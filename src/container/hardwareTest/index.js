/**
 * Created by Administrator on 2017/6/14.
 */
import React, {Component} from 'react';
import {Breadcrumb, Table, Pagination, Button, Modal} from 'antd';
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
            q: '',
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

    fetchHwData = (page = 1, q = '', batches = '')=> {
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
    onChangeSearch = (page, q, batches)=> {
        this.setState({
            page, q, batches
        })
        this.fetchHwData(page, q, batches);
    }
    onPageChange = (page) => {
        const {q,batches}=this.state
        this.onChangeSearch(page,q,batches);
    };
    render() {
        const {data, page, meta} = this.state;
        const columns = [{
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: '45px',
            className: 'table-index',
            render: (text, record, index) => {
                return (
                    <span>
                            {index + 1}
                        </span>
                )
            }
        }, {
            title: '脚本名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '生产批次',
            dataIndex: 'username',
            key: 'username'
        }, {
            title: '产品序列号',
            dataIndex: 'product_name',
            key: 'product_name',
        },  {
            title: '产品代码',
            dataIndex: 'product_code',
            key: 'product_code',
        }, {
            title: '产品名称',
            dataIndex: 'version',
            key: 'version',
        }, {
            title: '测试类型',
            dataIndex: 'hardware_version_id',
            key: 'hardware_version_id',
        },{
            title: '操作',
            key: 'action',
            width: 120,
            render: (text, record, index) => {
                return (
                    <div key={index}>
                        <Button type="primary">
                            <Link to={`${this.props.match.url}/${record.id}`}>进入测试</Link>
                        </Button>
                    </div>

                )
            }
        }];
        return (
            <div>
                <div className="content">
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item>硬件测试</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="content-container">
                        <div className="operate-box">
                            <SearchWrap onChangeSearch={this.onChangeSearch} {...this.state} {...this.props}/>
                        </div>
                        <Table bordered className="main-table"
                               loading={this.state.loading}
                               rowKey="id" columns={columns}
                               dataSource={data} pagination={false}/>
                        <Pagination total={meta.pagination.total} current={page} pageSize={meta.pagination.per_page}
                                    style={{marginTop: '10px'}} onChange={this.onPageChange}/>

                    </div>

                    <Modal
                        key={ Date.parse(new Date())}
                        className="big-modal"
                        visible={this.state.showScriptModal}
                        title="查看脚本"
                        onCancel={()=> {
                            this.setState({showScriptModal: false})
                        }}
                        footer={[
                            <Button type="primary" size="large" onClick={()=> {
                                this.setState({showScriptModal: false})
                            }}>
                                关闭
                            </Button>
                        ]}
                    >
                        <Script key={Date.parse(new Date()) + 1} showScriptSidebar={false}
                                scriptJson={this.state.scriptJson}/>
                    </Modal>
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
export default connect(mapStateToProps,mapDispatchToProps)(HardwareTest);
