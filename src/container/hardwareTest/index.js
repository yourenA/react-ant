/**
 * Created by Administrator on 2017/6/14.
 */
import React, {Component} from 'react';
import {Breadcrumb, Table, Pagination, Button, Card} from 'antd';
import axios from 'axios'
import SearchWrap from  './search';
import {
    Link
} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import configJson from './../../common/config.json';
import {getHeader, converErrorCodeToMsg} from './../../common/common';
import Script from './../scriptManage/script';
class HardwareTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
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
        this.fetchHwData();
        this.props.fetchAllBatches();
        // this.props.fetchAllTestType();
        // this.props.fetchAllParts();
        // this.props.fetchAllHardwareVersions();
    }

    fetchHwData = (page = 1, batches = '')=> {
        const that = this;
        this.setState({loading: true});
        axios({
            url: `${configJson.prefix}/products?return=all`,
            method: 'get',
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    loading: false,
                    data: response.data.data,
                    meta: response.data.meta,
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
        const {data, page, meta} = this.state;
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
                                                <span title={this.state.test_script}>生产批次 : this.state.test_scripttest_scripttest_scripttest_script</span>
                                            </div>
                                            <div className="testing-config-item">
                                                <span
                                                    title={this.state.test_script}>产品代码 : this.state.test_script</span>
                                            </div>
                                            <div className="testing-config-item">
                                                <span
                                                    title={this.state.test_script}>产品名称 : this.state.test_script</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                        </div>
                        <div className="choseTest-container">
                            <div className="choseTest">
                                <div className="choseTest-header">
                                    测试类型（点击下面名称进入测试）
                                </div>
                                <div>
                                    <Button size="large" type="primary" style={{width:'100%'}}>
                                        <Link to={`${this.props.match.url}/record.id`}>进入测试</Link>
                                    </Button>
                                </div>
                                <div>
                                    <Button size="large"  type="primary" style={{width:'100%'}}>
                                        <Link to={`${this.props.match.url}/record.id`}>进入测试进入</Link>
                                    </Button>
                                </div>
                                <div>
                                    <Button size="large"  type="primary" style={{width:'100%'}}>
                                        <Link to={`${this.props.match.url}/record.id`}>进入测试</Link>
                                    </Button>
                                </div>
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
