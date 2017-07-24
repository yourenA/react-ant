/**
 * Created by Administrator on 2017/6/14.
 */
import React, {Component} from 'react';
import {Breadcrumb, Table, Pagination, Button, Modal, Popconfirm, message, Card, Row, Col} from 'antd';
import axios from 'axios'
import configJson from 'configJson' ;
import {getHeader, converErrorCodeToMsg} from './../../common/common';
import messageJson from './../../common/message.json';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import MergeSerialNumber from './mergeSeriaNum'
import SeriaNum from './addSeriaNum'
import Dropzone from './../../component/dropzone'
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
            mergeModal: false,
            clearModal: false,
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
    addOrClearSerialNum = (type)=> {
        const seriaNum = type === 'add' ? this.refs.AddSeriaNum.getFieldsValue() : this.refs.ClearSeriaNum.getFieldsValue();
        console.log(seriaNum);
        const method = type === 'add' ? 'post' : 'delete';
        const msg = type === 'add' ? `add product_serial_numbers success` : `clear product_serial_numbers success`;
        const that = this;
        axios({
            url: `${configJson.prefix}/product_serial_numbers`,
            method: method,
            data: {
                batch_id: this.props.location.state.batchId,
                ...seriaNum
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[msg]);
                that.setState({
                    addModal: false,
                    clearModal: false
                })
                const page = type === 'add' ? that.state.page : 1;
                that.onChangeSearch(page)
                const tempPage = type === 'add' ? that.state.tempPage : 1;
                that.onTempChangeSearch(tempPage)

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
    delData = (id, type)=> {
        const that = this;
        axios({
            url: `${configJson.prefix}/product_serial_numbers/${id}`,
            method: 'delete',
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[`del product_serial_numbers success`]);
                if (type === 1) {
                    const {page}=that.state;
                    that.onChangeSearch(page)
                } else if (type === -1) {
                    const {tempPage}=that.state;
                    that.onTempChangeSearch(tempPage)
                }
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    mergeData = ()=> {
        const mergeType = this.refs.mergeSerialNum.callBackRadio();
        console.log("mergeType", mergeType)
        const that = this;
        axios({
            url: `${configJson.prefix}/product_serial_numbers/batch`,
            method: 'put',
            data: {
                batch_id: this.props.location.state.batchId,
                import_method: mergeType
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[`merge serial numbers success`]);
                that.setState({
                    mergeModal: false
                })
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
            dataIndex: 'stage',
            key: 'stage',
        }, {
            title: '工作进度',
            dataIndex: 'status',
            key: 'status',
            render: (text, record, index) => {
                return (
                    <span>1/1</span>
                )
            }
        }, {
            title: '执行情况',
            dataIndex: 'status_explain',
            key: 'status_explain',
        }, {
            title: '操作',
            key: 'action',
            width: 70,
            render: (text, record, index) => {
                return (
                    <div key={index}>
                        <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                                    onConfirm={this.delData.bind(this, record.id, 1)}>
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
            render: (text, record, index) => {
                let repeatClassName=''
                if(record.is_repeat===1){
                    // if(document.querySelectorAll('.tempSerialTable tr')[index+1]){
                    //     document.querySelectorAll('.tempSerialTable tr')[index+1].style.backgroundColor='#ecbcbc'
                    // }
                }
                return (
                    <span className={repeatClassName}>
                            {index + 1}
                        </span>
                )
            }
        }, {
            title: '产品序列号',
            dataIndex: 'serial_number',
            key: 'serial_number',
        }, {
            title: '操作',
            key: 'action',
            width: 70,
            render: (text, record, index) => {
                return (
                    <div key={index}>
                        <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                                    onConfirm={this.delData.bind(this, record.id, -1)}>
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
                                    <Button onClick={()=> {
                                        this.props.history.goBack()
                                    }}>
                                        退出
                                    </Button>
                                    <span className="ant-divider"/>
                                    <Button icon="plus" type="primary" onClick={()=> {
                                        this.setState({
                                            addModal: true
                                        })
                                    }}>
                                        添加序列号
                                    </Button>
                                    <span className="ant-divider"/>
                                    <Button icon="delete" type="danger" onClick={()=> {
                                        this.setState({
                                            clearModal: true
                                        })
                                    }}>
                                        清空序列号
                                    </Button>
                                </div>
                                <Card title="序列号">
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
                                    <Button type="primary" onClick={()=> {
                                        this.setState({
                                            mergeModal: true
                                        })
                                    }}>
                                        保存序列号
                                    </Button>
                                </div>
                                <Card title="临时序列号">
                                    <Table
                                        rowClassName={function (record, index) {
                                            if(record.is_repeat===1){
                                                return 'repeat'
                                            }
                                        }}
                                        bordered className="main-table tempSerialTable"
                                        loading={this.state.tempLoading}
                                        rowKey="id" columns={tempColumns}
                                        dataSource={tempData} pagination={false}
                                        footer={() =>
                                            <p>
                                                <span style={{marginRight: '10px'}}>总数:{tempMeta.total_quantity}</span>
                                                <span
                                                    style={{marginRight: '10px'}}>不重复:{tempMeta.no_repeat_quantity}</span>
                                                <span>重复:{tempMeta.repeat_quantity}</span>
                                            </p>}/>
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

                        ]}
                    >
                        <p style={{marginBottom:'10px',fontSize:'14px'}}>导入文件的第一行为表头</p>
                        <Dropzone ref="Dropzone" batchId={this.props.location.state.batchId}
                                  setImportModalFalse={this.setImportModalFalse}
                                  onTempChangeSearch={this.onTempChangeSearch}
                                  postUrl={`${configJson.prefix}/product_serial_numbers/batch`}
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
                            <Button key="submit" type="primary" size="large"
                                    onClick={()=>this.addOrClearSerialNum('add')}>
                                保存
                            </Button>,
                        ]}
                    >
                        <SeriaNum ref="AddSeriaNum"/>
                    </Modal>
                    <Modal
                        key={ Date.parse(new Date()) + 2}
                        visible={this.state.clearModal}
                        title={`清空序列号`}
                        onCancel={()=> {
                            this.setState({clearModal: false})
                        }}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=> {
                                        this.setState({clearModal: false})
                                    }}>取消</Button>,
                            <Button key="submit" type="primary" size="large"
                                    onClick={()=>this.addOrClearSerialNum('clear')}>
                                保存
                            </Button>,
                        ]}
                    >
                        <SeriaNum ref="ClearSeriaNum" type="clear"/>
                    </Modal>
                    <Modal
                        key={ Date.parse(new Date()) + 3}
                        visible={this.state.mergeModal}
                        title={`保存序列号`}
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