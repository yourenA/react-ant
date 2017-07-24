/**
 * Created by Administrator on 2017/6/14.
 */
import React, {Component} from 'react';
import {
    Link
} from 'react-router-dom';
import {Breadcrumb, Table, Pagination, Button, Modal, Popconfirm, message, Tooltip, Badge,Select} from 'antd';
import axios from 'axios'
import SearchWrap from  './search';
import configJson from 'configJson' ;
import {getHeader, converErrorCodeToMsg} from './../../common/common';
import messageJson from './../../common/message.json';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
const Option = Select.Option;
class ProductionManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 1,
            data: [],
            loading: false,
            q: '',
            selectType: '',
            page: 1,
            meta: {pagination: {total: 0, per_page: 0}},
            statModal: false,
            editRecord: {},
            editId: '',
            selectedRowKeys: []
        };
    }

    componentDidMount() {
        this.fetchHwData();
        this.props.fetchAllProducts();
        this.props.fetchAllManufacture()

        // this.props.fetchAllHardwareVersions();
        // this.props.fetchAllScript()
    }

    fetchHwData = (page = 1, q = '')=> {
        const that = this;
        this.setState({loading: true});
        let params = {
            page: page,
            query: q,
        };
        axios({
            url: `${configJson.prefix}/batches`,
            method: 'get',
            params: params,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data)
                that.setState({
                    data: response.data.data,
                    meta: response.data.meta,
                    loading: false
                })
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }

    delData = (id)=> {
        console.log('id', id);
        const that = this;
        const {page, q}=this.state;
        axios({
            url: `${configJson.prefix}/batches/${id}`,
            method: 'delete',
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[`del batches success`]);
                that.fetchHwData(page, q);
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    onChangeSearch = (page, q)=> {
        this.setState({
            page, q
        })
        this.fetchHwData(page, q);
    }
    onPageChange = (page) => {
        this.onChangeSearch(page, this.state.q);
    };
    editStatus = ()=> {
        console.log('确认', this.state.editId);
        const that = this;
        const {page, q}=this.state;
        axios({
            url: `${configJson.prefix}/batches/${this.state.editId}/status`,
            method: 'patch',
            data:{
                status:parseInt(this.state.statusValue.key)
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[`edit status success`]);
                that.fetchHwData(page, q);
                that.setState({statModal:false})
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    handleChangeStatus=(value)=>{
        this.setState({
            statusValue:{key:value.key,label:value.label}
        })
    }
    render() {
        const {data, page, meta} = this.state;
        const columns = [{
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: '45px',
            className: 'table-index',
            fixed: 'left',
            render: (text, record, index) => {
                return (
                    <span>
                            {index + 1}
                        </span>
                )
            }
        }, {
            title: '生产批次号',
            dataIndex: 'code',
            key: 'code',
            fixed: 'left',
            width: 150,
        }, {
            title: '制造厂商',
            dataIndex: 'company_name',
            key: 'company_name',
        }, {
            title: '产品代码',
            dataIndex: 'product_code',
            key: 'product_code',
            width: 120
        }, {
            title: '硬件版本',
            dataIndex: 'hardware_version',
            key: 'hardware_version',
        },   {
            title: '描述说明',
            dataIndex: 'description',
            key: 'description',
            render: (text, record, index) => {
                return (
                    <Tooltip title={text}>
                        <span>{text.substring(0, 15)}</span>
                    </Tooltip>
                )
            }
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text, record, index)=> {
                if (text === 1) {
                    return (
                        <p><Badge status="processing"/>{record.status_explain}</p>
                    )
                }else if(text === 2){
                    return (
                        <p><Badge status="success"/>{record.status_explain}</p>
                    )
                }else if(text === 3){
                    return (
                        <p><Badge status="warning"/>{record.status_explain}</p>
                    )
                } else {
                    return (
                        <p><Badge status="default"/>{record.status_explain}</p>
                    )
                }

            }
        }, {
            title: '操作',
            key: 'action',
            width: 320,
            fixed: 'right',
            render: (text, record, index) => {
                return (
                        <div key={index}>
                            <Button onClick={()=> {
                                this.setState({statusValue:{key:record.status.toString(),label:record.statusValue},statModal:true,editId: record.id, editRecord: record})
                            }}>
                                状态
                            </Button><span className="ant-divider"/>
                            <Button  type="primary">
                                <Link
                                    to={{
                                        pathname:`${this.props.match.url}/${record.id}`,
                                        state: { newBatch: false,editId: record.id }
                                    }}
                                >编辑</Link>
                            </Button><span className="ant-divider"/>
                            <Button type="primary" >
                                <Link
                                    to={{
                                        pathname:`${this.props.match.url}/${record.id}/serialNumbers`,
                                        state: {batchId: record.id,editRecord:record }
                                    }}
                                >产品序列号</Link>
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
                        <Breadcrumb.Item>生产批次管理</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="content-container">
                        <div className="operate-box">
                            <SearchWrap
                                onChangeSearch={this.onChangeSearch}
                                type={this.props.match.url} {...this.props} {...this.state} />
                            <span className="ant-divider"/>
                            <Button  type="primary">
                                <Link
                                    to={{
                                        pathname:`${this.props.match.url}/newBatch`,
                                        state: { newBatch: true,editRecord:null}
                                    }}
                                >添加生产批次</Link>
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
                        visible={this.state.statModal}
                        title={`状态`}
                        onCancel={()=> {
                            this.setState({statModal: false})
                        }}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=> {
                                        this.setState({statModal: false})
                                    }}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.editStatus}>
                                保存
                            </Button>,
                        ]}
                    >
                        请选择批次状态：<Select
                                        onChange={this.handleChangeStatus}
                        value={this.state.statusValue} labelInValue={true}  style={{width:'70%'}}>
                            { [{key:-1,label:'未激活'},{key:1,label:'已激活'},{key:2,label:'已完成'},{key:3,label:'再修改'}].map((item, key) => {
                                    return (
                                        <Option key={item.key}
                                                value={item.key.toString()}>{item.label}</Option>
                                    )

                            }) }
                        </Select>
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
export default connect(mapStateToProps, mapDispatchToProps)(ProductionManage);