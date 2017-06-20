/**
 * Created by Administrator on 2017/6/14.
 */
import React, {Component} from 'react';
import {Breadcrumb, Table, Pagination,Button,Modal,Popconfirm} from 'antd';
import axios from 'axios'
import SearchWrap from  './search';
import {
    Link
} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import configJson from './../../common/config.json';
import {getHeader,converErrorCodeToMsg} from './../../common/common';
import AddOrEditName from './addOrEditNmae';

class ScriptManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            page: 1,
            test_type:'',
            test_part:'',
            test_version:'',
            meta: {pagination: {total: 0, per_page: 0}},
            editModal:false,
            editRecord:{}
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
        this.setState({loading: true});
        this.fetchHwData();
        this.props.fetchAllTestType();
        this.props.fetchAllParts();
        this.props.fetchAllHardwareVersions();
    }

    fetchHwData = (page = 1, test_type = '', test_part = '', test_version = '')=> {
        const that = this;
        axios({
            url: `${configJson.prefix}/hardware_versions`,
            method: 'get',
            params: {
                page: page,
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    data: response.data.data,
                    meta: response.data.meta,
                    page: page,
                    loading: false
                })
            }).catch(function (error) {
            console.log('获取出错',error);
            converErrorCodeToMsg(error)
        })
    }
    delData=(id)=>{
        console.log('id',id)
    }
    editData=()=>{
        const editScriptName = this.refs.editScriptName.getFieldsValue();
        console.log("editScriptName",editScriptName)
    }
    onChangeSearch = (page, test_type, test_part, test_version)=> {
        this.fetchHwData(page, test_type, test_part, test_version);
    }
    onPageChange = (page) => {
        const {test_type, test_part, test_version}=this.state
        this.onChangeSearch(page, this.state.q,test_type, test_part, test_version);
    };
    render() {
        const {data, page, meta} = this.state;
        const columns = [{
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width:'45px',
            className:'table-index',
            render: (text, record, index) => {
                return (
                    <span>
                            {index+1}
                        </span>
                )
            }
        },{
            title: '脚本名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '部件名称',
            dataIndex: 'username',
            key: 'username'
        }, {
            title: '测试类型',
            dataIndex: 'description',
            key: 'description',
        }, {
            title: '操作',
            key: 'action',
            width: 265,
            render: (text, record, index) => {
                return (
                    <div key={index}>

                        <Button  type="primary">
                            <Link
                                to={{
                                    pathname:`${this.props.match.url}/${record.id}`,
                                    state: { newScript: false , scriptJson:{ "class": "go.GraphLinksModel",
                                        "copiesArrays": true,
                                        "copiesArrayObjects": true,
                                        "nodeDataArray": [
                                            {"text":"subject 测试电源", "isGroup":true, "category":"OfGroups", "key":-7, "loc":"-81.734375 -74.5"},
                                            {"text":"subject 测试电源", "isGroup":true, "category":"OfGroups", "key":-2, "loc":"-91.984375 1417"},
                                            {"category":"formula", "formula":"test_3.3v_delay", "title":"unit 测试3.3v 上电延迟", "params":[ {"name":"param1", "val":"100", "type":"init"},{"name":"param2", "val":"120", "type":"string"},{"name":"param3", "val":"130", "type":"init"} ], "key":-8, "loc":"-307.734375 -198", "group":-7},
                                            {"category":"formula", "formula":"test_3.5v_delay", "title":"unit 测试3.5 上电延迟", "params":[ {"name":"param1", "val":"100", "type":"init"},{"name":"param2", "val":"120", "type":"init"} ], "key":-9, "loc":"148.265625 49", "group":-7},
                                            {"category":"formula", "formula":"test_4.5v_delay", "title":"unit 测试4.5 上电延迟", "params":[ {"name":"param1", "val":"100", "type":"init"},{"name":"param2", "val":"120", "type":"init"} ], "key":-11, "loc":"-388.734375 1322", "group":-2},
                                            {"category":"formula", "formula":"test_10v_delay", "title":"unit 测试10v 上电延迟", "params":[ {"name":"param1", "val":"100", "type":"init"},{"name":"param2", "val":"120", "type":"init"},{"name":"param3", "val":"130", "type":"init"},{"name":"param4", "val":"120", "type":"init"},{"name":"param5", "val":"130", "type":"init"},{"name":"param6", "val":"120", "type":"init"},{"name":"param7", "val":"130", "type":"init"} ], "key":-15, "loc":"203.265625 1512", "group":-2}
                                        ],
                                        "linkDataArray": [
                                            {"from":-8, "to":-9, "points":[-215.7215677848952,-198,-205.7215677848952,-198,-77.73437499999999,-198,-77.73437499999999,48.999999999999986,50.25281778489523,48.999999999999986,60.25281778489523,48.999999999999986]},
                                            {"from":-11, "to":-15, "points":[-300.7215677848951,1322,-290.7215677848951,1322,-93.48437499999994,1322,-93.48437499999994,1512,103.75281778489523,1512,113.75281778489523,1512]},
                                            {"from":-7, "to":-2, "points":[-81.73437499999994,87.67284749830793,-81.73437499999994,97.67284749830793,-81.73437499999994,668.4686523437499,-91.98437499999994,668.4686523437499,-91.98437499999994,1239.264457189192,-91.98437499999994,1249.264457189192]}
                                        ]}}
                                }}
                            >查看/编辑</Link>
                        </Button>
                        <span className="ant-divider"/>
                        <Button onClick={()=>{this.setState({editRecord:record,editModal:true})}}>
                            修改名称
                        </Button>
                        <span className="ant-divider"/>
                        <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                                    onConfirm={this.delData.bind(this, record.id)}>
                            <button className="ant-btn ant-btn-danger">删除
                            </button>
                        </Popconfirm>
                    </div>

                )
            }
        }];
        console.log(`${this.props.match.url}`)
        return (
            <div>
                <div className="content">
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item>硬件测试</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="content-container">
                        <div className="operate-box">
                            <SearchWrap onChangeSearch={this.onChangeSearch} {...this.state} {...this.props}/>
                            <span className="ant-divider"/>
                            <Button type='primary'>
                                <Link
                                    to={{
                                        pathname:`${this.props.match.url}/newScript`,
                                        state: { newScript: true}
                                    }}
                                >新建脚本</Link>
                            </Button>
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
                        visible={this.state.editModal}
                        title="查看脚本"
                        onCancel={()=> {
                            this.setState({editModal: false})
                        }}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=> {
                                        this.setState({editModal: false})
                                    }}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.editData}>
                                保存
                            </Button>,
                        ]}
                    >
                        <AddOrEditName ref="editScriptName" editRecord={this.state.editRecord}/>
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
export default connect(mapStateToProps,mapDispatchToProps)(ScriptManage);