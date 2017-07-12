/**
 * Created by Administrator on 2017/6/14.
 */
import React, {Component} from 'react';
import {Breadcrumb, Table, Pagination, Button, Modal, Popconfirm, message, Card, Row, Col} from 'antd';
import axios from 'axios'
import configJson from './../../common/config.json';
import {getHeader, converErrorCodeToMsg} from './../../common/common';
import messageJson from './../../common/message.json';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import MergeSerialNumber from './mergeSeriaNum'
import AddSeriaNum from './addSeriaNum'
import Dropzone from './../../component/dropzone'
const _ = require('lodash');
class SerialNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 1,
            data: [],
            tempData: [],
            loading: false,
            tempLoading: false,
            page: 1,
            tempPage: 1,
            meta: {pagination: {total: 0, per_page: 0}},
            tempMeta: {pagination: {total: 0, per_page: 0}},
            importSerialNumModal: false,
            addModal: false,
            mergeModal:false,
            editRecord: {},
            editId: '',
            selectedRowKeys: []
        };
    }

    componentDidMount() {
        this.fetchData();
        this.fetchTempData()
    }

    fetchData = (page = 1)=> {
        const that = this;
        this.setState({loading: true});
        let params = {
            page: page,
            is_permanent: 1,
            batch_id: this.props.location.state.batchId
        };
        axios({
            url: `${configJson.prefix}/product_serial_numbers`,
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
        })
    }
    fetchTempData = (page = 1)=> {
        const that = this;
        this.setState({TempLoading: true});
        let params = {
            page: page,
            is_permanent: -1,
            batch_id: this.props.location.state.batchId
        };
        axios({
            url: `${configJson.prefix}/product_serial_numbers`,
            method: 'get',
            params: params,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data)
                that.setState({
                    tempData: response.data.data,
                    tempMeta: response.data.meta,
                    TempLoading: false
                })
            }).catch(function (error) {
            console.log('获取出错', error);
        })
    }

    importSerialNum = ()=> {
        this.refs.Dropzone.callbackFile();
    }
    addSerialNum = ()=> {
        const addSeriaNum = this.refs.AddSeriaNum.getFieldsValue();
        console.log(addSeriaNum);
        const that = this;
        axios({
            url: `${configJson.prefix}/product_serial_numbers`,
            method: 'post',
            data:{
                batch_id:this.props.location.state.batchId,
                ...addSeriaNum
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[`add product_serial_numbers success`]);
                that.setState({
                    addModal:false
                })
                if(addSeriaNum.is_permanent==='1'){
                    const {page}=that.state;
                    that.onChangeSearch(page)
                }else if(addSeriaNum.is_permanent==='-1'){
                    const {tempPage}=that.state;
                    that.onTempChangeSearch(tempPage)
                }

            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    onChangeSearch = (page)=> {
        this.setState({
            page
        })
        this.fetchData(page);
    }
    onTempChangeSearch = (tempPage)=> {
        this.setState({
            tempPage
        })
        this.fetchTempData(tempPage);
    }
    onPageChange = (page) => {
        this.onChangeSearch(page);
    };
    onTempPageChange = (page) => {
        this.onTempChangeSearch(page);

    };
    setImportModalFalse = ()=> {
        this.setState({
            importSerialNumModal: false
        })
    }
    delData = (id,type)=> {
        const that = this;
        axios({
            url: `${configJson.prefix}/product_serial_numbers/${id}`,
            method: 'delete',
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[`del product_serial_numbers success`]);
                if(type===1){
                    const {page}=that.state;
                    that.onChangeSearch(page)
                }else if(type===-1){
                    const {tempPage}=that.state;
                    that.onTempChangeSearch(tempPage)
                }
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    mergeData = ()=> {
        const mergeType=this.refs.mergeSerialNum.callBackRadio();
        console.log("mergeType",mergeType)
        const that = this;
        axios({
            url: `${configJson.prefix}/product_serial_numbers/batch`,
            method: 'put',
            data: {
                batch_id: this.props.location.state.batchId
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[`merge serial numbers success`]);
                that.onChangeSearch(1)
                that.onTempChangeSearch(1)
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }

    render() {
        const {data, page, meta} = this.state;
        const {tempData, tempPage, tempMeta} = this.state;
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
            title: '产品序列号',
            dataIndex: 'serial_number',
            key: 'serial_number',
        }, {
            title: '当前工序',
            dataIndex: 'company_name',
            key: 'company_name',
        }, {
            title: '工作进度',
            dataIndex: 'product_code',
            key: 'product_code',
        }, {
            title: '执行情况',
            dataIndex: 'hardware_version',
            key: 'hardware_version',
        }, {
            title: '操作',
            key: 'action',
            width: 70,
            fixed: 'right',
            render: (text, record, index) => {
                return (
                    <div key={index}>
                        <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                                    onConfirm={this.delData.bind(this, record.id,1)}>
                            <button className="ant-btn ant-btn-danger">删除
                            </button>
                        </Popconfirm>
                    </div>
                )
            }
        }];
        const tempColumns = [{
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
            title: '产品序列号',
            dataIndex: 'serial_number',
            key: 'serial_number',
        }, {
            title: '当前工序',
            dataIndex: 'company_name',
            key: 'company_name',
        }, {
            title: '工作进度',
            dataIndex: 'product_code',
            key: 'product_code',
        }, {
            title: '执行情况',
            dataIndex: 'hardware_version',
            key: 'hardware_version',
        }, {
            title: '操作',
            key: 'action',
            width: 70,
            fixed: 'right',
            render: (text, record, index) => {
                return (
                    <div key={index}>
                        <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                                    onConfirm={this.delData.bind(this, record.id,-1)}>
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
                        <Breadcrumb.Item>序列号管理</Breadcrumb.Item>
                        <Breadcrumb.Item>{this.props.location.state.editRecord.code}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="content-container">
                        <Row gutter={16}>
                            <Col span={12}>
                                <div className="operate-box">
                                    <Button  onClick={()=> {
                                        this.props.history.goBack()
                                    }}>
                                        取消
                                    </Button>
                                    <span className="ant-divider"/>
                                    <Button icon="plus" type="primary" onClick={()=> {
                                        this.setState({
                                            addModal: true
                                        })
                                    }}>
                                        添加序列号
                                    </Button>

                                </div>
                                <Card title="序列号" >
                                    <Table bordered className="main-table"
                                           loading={this.state.loading}
                                           rowKey="id" columns={columns}
                                           dataSource={data} pagination={false}/>
                                    <Pagination total={meta.pagination.total} current={page}
                                                pageSize={meta.pagination.per_page}
                                                style={{marginTop: '10px'}} onChange={this.onPageChange}/>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <div className="operate-box">
                                    <Button icon="plus" type="primary" onClick={()=> {
                                        this.setState({
                                            importSerialNumModal: true
                                        })
                                    }}>
                                        从文件中导入
                                    </Button>
                                    <span className="ant-divider"/>
                                        <Button type="primary" onClick={()=>{
                                            this.setState({
                                                mergeModal:true
                                            })
                                        }}>
                                            保存序列号
                                        </Button>
                                </div>
                                <Card title="临时序列号">
                                    <Table
                                        bordered className="main-table"
                                        loading={this.state.tempLoading}
                                        rowKey="id" columns={tempColumns}
                                        dataSource={tempData} pagination={false}/>
                                    <Pagination total={tempMeta.pagination.total} current={tempPage}
                                                pageSize={tempMeta.pagination.per_page}
                                                style={{marginTop: '10px'}} onChange={this.onTempPageChange}/>
                                </Card>
                            </Col>
                        </Row>

                    </div>

                    <Modal
                        key={ Date.parse(new Date())}
                        visible={this.state.importSerialNumModal}
                        title={`导入临时序列号`}
                        onCancel={()=> {
                            this.setState({importSerialNumModal: false})
                        }}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=> {
                                        this.setState({importSerialNumModal: false})
                                    }}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.importSerialNum}>
                                保存
                            </Button>,
                        ]}
                    >
                        <Dropzone ref="Dropzone" batchId={this.props.location.state.batchId}  setImportModalFalse={this.setImportModalFalse} fetchTempData={this.fetchTempData} postUrl={`${configJson.prefix}/product_serial_numbers/batch`}
                                  paramName="file"/>
                    </Modal>
                    <Modal
                        key={ Date.parse(new Date()) + 1}
                        visible={this.state.addModal}
                        title={`添加序列号`}
                        onCancel={()=> {
                            this.setState({addModal: false})
                        }}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=> {
                                        this.setState({addModal: false})
                                    }}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.addSerialNum}>
                                保存
                            </Button>,
                        ]}
                    >
                        <AddSeriaNum ref="AddSeriaNum"/>
                    </Modal>
                    <Modal
                        key={ Date.parse(new Date()) + 2}
                        visible={this.state.mergeModal}
                        title={`合并序列号`}
                        onCancel={()=> {
                            this.setState({mergeModal: false})
                        }}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=> {
                                        this.setState({mergeModal: false})
                                    }}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.mergeData}>
                                保存
                            </Button>,
                        ]}
                    >
                        <MergeSerialNumber ref="mergeSerialNum"
                                            batchId={this.props.location.state.batchId}
                        />
                    </Modal>
                </div>
            </div >
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
export default connect(mapStateToProps, mapDispatchToProps)(SerialNumber);