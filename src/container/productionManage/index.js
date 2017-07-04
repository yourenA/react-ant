/**
 * Created by Administrator on 2017/6/14.
 */
import React, {Component} from 'react';
import {Breadcrumb, Table, Pagination, Button, Modal, Popconfirm, message, Tooltip, Badge} from 'antd';
import axios from 'axios'
import SearchWrap from  './search';
import configJson from './../../common/config.json';
import {getHeader, converErrorCodeToMsg} from './../../common/common';
import messageJson from './../../common/message.json';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import AddOrEditName from './addOrEditNmae';
import EditName from './editNmae';
import AddSeriaNum from './addSeriaNum';
const _ = require('lodash');
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
            editModal: false,
            addModal: false,
            addSerialNumModal: false,
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

    addData = (addSerialNum)=> {
        console.log("addSerialNum", addSerialNum)
        const that = this;
        const {page, q}=this.state;
        const addName = this.refs.AddName.getFieldsValue();
        console.log('addName', addName)
        const sendData = {
            hardware_version_id: addName.hardware_version_id ? addName.hardware_version_id.key : '',
            default_test_script_id: addName.default_test_script_id ? addName.default_test_script_id.key : '',
            company_id: addName.company_id ? addName.company_id.key : '',
            product_id: addName.product_id ? addName.product_id.key : '',
            description: addName.description
        }
        axios({
            url: `${configJson.prefix}/batches`,
            method: 'post',
            data: sendData,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[`add batches success`]);
                that.setState({
                    addModal: false,
                })
                that.fetchHwData(page, q);
                if (addSerialNum) {
                    that.setState({
                        addSerialNumModal: true,
                        editRecord: response.data,
                        editId: response.data.id
                    })
                }
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    addSerialNum = ()=> {
        const addSerialNum = this.refs.addSerialNum.getFieldsValue();
        const sendData = {
            batch_id: this.state.editId,
            production_quantity: parseInt(addSerialNum.production_quantity),
            generation_method: addSerialNum.generation_method
        }
        const that = this;
        axios({
            url: `${configJson.prefix}/product_serial_numbers`,
            method: 'post',
            data: sendData,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[`add product_serial_numbers success`]);
                that.setState({
                    addSerialNumModal: false,
                })
                const changeIndex=_.findIndex(that.state.data, function(o) { return o.id == that.state.editId; });
                if(addSerialNum.generation_method==='new'){
                    that.state.data[changeIndex].production_quantity=sendData.production_quantity;
                }else if(addSerialNum.generation_method==='append'){
                    that.state.data[changeIndex].production_quantity=that.state.data[changeIndex].production_quantity+sendData.production_quantity;
                }
                that.setState({
                    data:that.state.data
                })

            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    editData = ()=> {
        const editName = this.refs.EditName.getFieldsValue();
        const that = this;
        const {page, q}=this.state;
        const sendData = {
            hardware_version_id: editName.hardware_version_id ? editName.hardware_version_id.key : '',
            default_test_script_id: editName.default_test_script_id ? editName.default_test_script_id.key : '',
            company_id: editName.company_id ? editName.company_id.key : '',
            product_id: editName.product_id ? editName.product_id.key : '',
            description: editName.description
        }
        console.log('sendData', sendData)
        axios({
            url: `${configJson.prefix}/batches/${this.state.editId}`,
            method: 'put',
            data: sendData,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[`edit batches success`]);
                that.setState({
                    editModal: false
                });
                that.fetchHwData(page, q);
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
    confirm = (id)=> {
        console.log('确认', id);
        const that = this;
        const {page, q}=this.state;
        axios({
            url: `${configJson.prefix}/batches/${id}/status`,
            method: 'patch',
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[`confirm batches success`]);
                that.fetchHwData(page, q);
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
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
        }, {
            title: '生产数量',
            dataIndex: 'production_quantity',
            key: 'production_quantity',
        }, {
            title: '脚本名称',
            dataIndex: 'default_test_script_name',
            key: 'default_test_script_name',
        }, {
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
            title: '确认时间',
            dataIndex: 'confirmed_at',
            key: 'confirmed_at',
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text, record, index)=> {
                if (text === 1) {
                    return (
                        <p><Badge status="success"/>{record.status_explain}</p>
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
            width: 330,
            fixed: 'right',
            render: (text, record, index) => {
                return (
                    record.status === -1 ?
                        <div key={index}>
                            <Button type="primary" onClick={()=> {
                                this.setState({editId: record.id, addSerialNumModal: true, editRecord: record})
                            }}>
                                添加序列号</Button> <span className="ant-divider"/>
                            <Popconfirm placement="topRight" title={ `确定要确认吗?`}
                                        onConfirm={this.confirm.bind(this, record.id)}>
                                <Button type='primary'>确认
                                </Button>
                            </Popconfirm>

                            <span className="ant-divider"/>
                            <Button onClick={()=> {
                                this.setState({editId: record.id, editModal: true, editRecord: record})
                            }}>
                                编辑
                            </Button>
                            <span className="ant-divider"/>
                            <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                                        onConfirm={this.delData.bind(this, record.id)}>
                                <button className="ant-btn ant-btn-danger">删除
                                </button>
                            </Popconfirm>
                        </div>
                        : null
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
                            <span className="ant-divider"/><Button type="primary" icon="plus" onClick={()=> {
                            this.setState({addModal: true})
                        }}>
                            添加生产批次</Button>
                        </div>
                        <Table bordered className="main-table"
                               scroll={{x: 1500}}
                               loading={this.state.loading}
                               rowKey="id" columns={columns}
                               dataSource={data} pagination={false}/>
                        <Pagination total={meta.pagination.total} current={page} pageSize={meta.pagination.per_page}
                                    style={{marginTop: '10px'}} onChange={this.onPageChange}/>

                    </div>

                    <Modal
                        key={ Date.parse(new Date()) + 1}
                        visible={this.state.editModal}
                        title={`编辑`}
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
                        <EditName {...this.props}
                                  ref="EditName"
                                  editRecord={this.state.editRecord}/>
                    </Modal>
                    <Modal
                        visible={this.state.addModal}
                        title={`添加`}
                        onCancel={()=> {
                            this.setState({addModal: false})
                        }}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=> {
                                        this.setState({addModal: false})
                                    }}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={()=>this.addData()}>
                                保存
                            </Button>,
                            <Button key="submitAndNext" type="primary" size="large" onClick={()=>this.addData(true)}>
                                保存,下一步>>>
                            </Button>,
                        ]}
                    >
                        <AddOrEditName  {...this.props} ref="AddName"/>
                    </Modal>
                    <Modal
                        key={ Date.parse(new Date()) + 2}
                        visible={this.state.addSerialNumModal}
                        title={`添加${this.state.editRecord ? this.state.editRecord.code : ''}产品序列号`}
                        onCancel={()=> {
                            this.setState({addSerialNumModal: false})
                        }}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=> {
                                        this.setState({addSerialNumModal: false})
                                    }}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.addSerialNum}>
                                保存
                            </Button>,
                        ]}
                    >
                        <AddSeriaNum  {...this.props} ref="addSerialNum"/>
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