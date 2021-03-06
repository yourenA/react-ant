/**
 * Created by Administrator on 2017/6/14.
 */
import React, {Component} from 'react';
import {Breadcrumb,  Button, Card} from 'antd';
import axios from 'axios'
import SearchWrap from  './search';
import {
    Link
} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import configJson from 'configJson' ;
import {getHeader, converErrorCodeToMsg} from './../../common/common';
import './hardwareTesting.less'
class HardwareTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            loading: false,
            page: 1,
            batches: '',
            meta: {pagination: {total: 0, per_page: 0}},
            showScriptModal: false,
        };
    }

    /**
     * 如果需要保存数据使用redux
     import {fetchAbout, changeStart, changeAbout} from '../actions/about';

     static fetch(state, dispatch) {
		return dispatch(fetchAbout(state));
	};

     componentDidMount() {
		const {loaded} = this.props;
		if (!loaded) {
			this.constructor.fetch(this.props, this.props.dispatch);
		}
	}
     * */
    componentDidMount() {
        // this.fetchHwData();
        this.props.fetchAllBatches();
        // this.props.fetchAllTestType();
        // this.props.fetchAllParts();
        // this.props.fetchAllHardwareVersions();
    }

    fetchHwData = (page = 1, batches = '')=> {
        const that = this;
        this.setState({loading: true});
        axios({
            url: `${configJson.prefix}/hardware_test_scripts`,
            method: 'get',
            params:{
                batch_code:batches
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    loading: false,
                    data: response.data.data[0],
                })
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    onChangeSearch = (page, batches)=> {
        this.setState({
            page, batches
        })
        this.fetchHwData(page, batches);
    }

    render() {
        return (
            <div>
                <div className="content">
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item>硬件测试</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="content-container">
                        <div className="operate-box">
                            <SearchWrap onChangeSearch={this.onChangeSearch} {...this.state} {...this.props}/>
                            <Card title="测试摘要信息" bordered={true} style={{marginTop: '15px'}}
                                  className="hardwareTest-card">
                                <div className="testing-header">
                                    <div className="testing-config">
                                        <div className="testing-config-row">
                                            <div className="testing-config-item">
                                                <span title={this.state.data.batch_code}>生产批次 : {this.state.data.batch_code}</span>
                                            </div>
                                            <div className="testing-config-item">
                                                <span
                                                    title={this.state.data.product_code}>产品代码 : {this.state.data.product_code}</span>
                                            </div>
                                            <div className="testing-config-item">
                                                <span
                                                    title={this.state.data.product_name}>产品名称 : {this.state.data.product_name}</span>
                                            </div>
                                            <div className="testing-config-item">
                                                <Button type='primary' disabled={this.state.data.batch_id?true:true}>
                                                    <Link to={{
                                                        pathname:`${this.props.match.url}/testAll`,
                                                        state: {testAllType:true,testRecord:this.state.data }
                                                    }}>按工序流程测试 >></Link></Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                        </div>
                        <div className="choseTest-container">
                            <div className="choseTest">
                                <div className="choseTest-header">
                                    测试类型（自由测试模式）
                                </div>
                                {this.state.data.test_types?this.state.data.test_types.data.map((item,index)=>{
                                    return(
                                        <div key={index}>

                                                <Link to={{
                                                    pathname:`${this.props.match.url}/${item.id}`,
                                                    state: {testAllType:false,testTypeId:item.id,testTypeName:item.name,testScriptId:item.default_test_script_id,testRecord:this.state.data }
                                                }}><Button size="large" type="primary" style={{width:'100%'}}>{item.name} </Button></Link>

                                        </div>
                                    )
                                }):null}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        fetchTestConf: state.fetchTestConf,
    };
}
function mapDispatchToProps(dispath) {
    return bindActionCreators(fetchTestConfAction, dispath);
}
export default connect(mapStateToProps, mapDispatchToProps)(HardwareTest);
