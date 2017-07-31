/**
 * Created by Administrator on 2017/6/14.
 */
import React, {Component} from 'react';
import {Breadcrumb, Table, Pagination,Button,Modal,Popconfirm,message} from 'antd';
import axios from 'axios'
import SearchWrap from  './search';
import {
    Link
} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import configJson from 'configJson' ;
import {getHeader,converErrorCodeToMsg} from './../../common/common';
import AddOrEditName from './addOrEditNmae';
import messageJson from './../../common/message.json';

class ScriptManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            page: 1,
            q:'',
            test_type: '',
            test_version: '',
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
        const scriptStorage=JSON.parse(sessionStorage.getItem('scriptStorage'))||[];
        if(scriptStorage.length>0){
            for(let i=0,len=scriptStorage.length;i<len;i++){
                sessionStorage.removeItem(scriptStorage[i])
            }
        }
        sessionStorage.removeItem('scriptStorage')
        sessionStorage.removeItem('breadcrumbArr')
        sessionStorage.removeItem('manageScriptId')
        this.fetchHwData();
        this.props.delAllHardwareVersions()

        this.props.fetchAllTestType();
        this.props.fetchAllProducts();
    }

    fetchHwData = (page = 1,q='', test_type='',test_version='')=> {
        const that = this;
        this.setState({loading: true});
        this.props.setSciptLoadedFalse();
        // sessionStorage.clear();
        axios({
            url: `${configJson.prefix}/test_scripts`,
            method: 'get',
            params: {
                page: page,
                query:q,
                test_type_id:test_type,
                hardware_version_id:test_version
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
        const that=this;
        const {page, q, test_type,  test_version}=this.state;
        axios({
            url: `${configJson.prefix}/test_scripts/${id}`,
            method: 'delete',
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.fetchHwData(page, q, test_type, test_version);
                message.success(messageJson[`del script success`]);
            }).catch(function (error) {
            console.log('获取出错',error);
            converErrorCodeToMsg(error)
        })
    }
    editData=()=>{
        const that=this;
        const {page, q, test_type,  test_version}=this.state;
        const editScriptName = this.refs.editScriptName.getFieldsValue();
        axios({
            url: `${configJson.prefix}/test_scripts/${this.state.editRecord.id}`,
            method: 'put',
            params: {
                name:editScriptName.name,
                test_type_id:editScriptName.test_type_id.key,
                hardware_version_id:editScriptName.hardware_version_id.key,
            },
            headers: getHeader()
        })
            .then(function (response) {
                // console.log(response);
                message.success(messageJson[`edit script success`]);//这三条语句的顺序不能乱
                that.setState({
                    editModal:false
                })
                that.fetchHwData(page, q, test_type, test_version);
            }).catch(function (error) {
            console.log('获取出错',error);
            converErrorCodeToMsg(error)
        })
    }
    onChangeSearch = (page, q, test_type,test_version)=> {
        this.setState({
            page, q, test_type,  test_version
        })
        this.fetchHwData(page, q, test_type,test_version);
    }
    onPageChange = (page) => {
        const {q, test_type,  test_version}=this.state
        this.onChangeSearch(page, q, test_type, test_version);
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
            title: '产品代码',
            dataIndex: 'product_code',
            key: 'product_code'
        }, {
            title: '测试类型',
            dataIndex: 'test_type_name',
            key: 'test_type_name',
        }, {
            title: '硬件版本',
            dataIndex: 'hardware_version',
            key: 'hardware_version',
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
                                    state: { newScript: false , scriptJson:JSON.parse(record.content),editRecord:record}
                                }}
                            >查看/编辑</Link>
                        </Button>
                        <span className="ant-divider"/>
                        <Button onClick={()=>{this.setState({editRecord:record,editModal:true})}}>
                            修改属性
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
        return (
            <div>
                <div className="content">
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item>脚本管理</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="content-container">
                        <div className="operate-box">
                            <SearchWrap onChangeSearch={this.onChangeSearch} {...this.state} {...this.props}/>

                                <Link
                                    to={{
                                        pathname:`${this.props.match.url}/newScript`,
                                        state: { newScript: true}
                                    }}
                                > <Button  icon="plus" type='primary' className='add-btn'>新建脚本</Button></Link>

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
                        title="修改名称"
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
                        <AddOrEditName ref="editScriptName" {...this.props} fetchTestConf={this.props.fetchTestConf} editRecord={this.state.editRecord}/>
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