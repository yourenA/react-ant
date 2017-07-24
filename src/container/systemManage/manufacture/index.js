/**
 * Created by Administrator on 2017/6/14.
 */
import React, {Component} from 'react';
import {Breadcrumb, Table, Pagination, Button, Modal, Popconfirm, Layout,message} from 'antd';
import axios from 'axios'
import SearchWrap from  './search';
import configJson from 'configJson' ;
import {getHeader, converErrorCodeToMsg} from './../../../common/common';
import AddOrEditName from './addOrEditNmae';
import messageJson from './../../../common/message.json';
const {Content,} = Layout;
class Manufacture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            q: '',
            page: 1,
            meta: {pagination: {total: 0, per_page: 0}},
            editModal: false,
            addModal: false
        };
    }

    componentDidMount() {
        this.fetchHwData();
    }

    fetchHwData = (page = 1, q = '') => {
        const that = this;
        this.setState({loading: true});
        axios({
            url: `${configJson.prefix}/companies`,
            method: 'get',
            params: {
                page: page,
                query: q,
            },
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
    addData = ()=> {
        const that = this;
        const {page, q}=this.state;
        const addName = this.refs.AddName.getFieldsValue();
        axios({
            url: `${configJson.prefix}/companies`,
            method: 'post',
            data: addName,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[`add manufacture success`]);
                that.setState({
                    addModal:false
                })
                that.fetchHwData(page, q);
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    editData=()=>{
        const editName = this.refs.EditName.getFieldsValue();
        const that = this;
        const {page, q}=this.state;
        axios({
            url: `${configJson.prefix}/companies/${this.state.editId}`,
            method: 'put',
            params: editName,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[`edit manufacture success`]);
                that.setState({
                    editModal:false
                });
                that.fetchHwData(page, q);
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    delData = (id)=> {
        const that = this;
        const {page, q}=this.state;
        axios({
            url: `${configJson.prefix}/companies/${id}`,
            method: 'delete',
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[`del manufacture success`]);
                that.fetchHwData(page, q);
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }

    onChangeSearch = (page, q,)=> {
        this.setState({
            page, q,
        })
        this.fetchHwData(page, q);
    }
    onPageChange = (page) => {
        const {q}=this.state;
        this.onChangeSearch(page, q);
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
            title: '制造厂商名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '操作',
            key: 'action',
            width: 150,
            render: (text, record, index) => {
                return (
                    <div key={index}>
                        <Button onClick={()=> {
                            this.setState({editId: record.id, editModal: true, editRecord: record})
                        }}>
                            编辑
                        </Button>
                        <span className="ant-divider"/>
                        <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                                    onConfirm={this.delData.bind(this, record.id)}>
                            <button className="ant-btn ant-btn-danger">
                                删除
                            </button>
                        </Popconfirm>

                    </div>
                )
            }
        }];
        return (
            <Layout style={{padding: '0 24px 24px'}}>

                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>制造厂信息</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
                    <div className="operate-box">
                        <SearchWrap onChangeSearch={this.onChangeSearch} {...this.state} {...this.props}/>
                        <span className="ant-divider"/><Button type="primary" icon="plus" onClick={()=> {
                        this.setState({addModal: true})
                    }}>
                        添加</Button>
                    </div>
                    <Table bordered className="main-table"
                           loading={this.state.loading}
                           rowKey="id" columns={columns}
                           dataSource={data} pagination={false}/>
                    <Pagination total={meta.pagination.total} current={page} pageSize={meta.pagination.per_page}
                                style={{marginTop: '10px'}} onChange={this.onPageChange}/>

                </Content>

                <Modal
                    key={ Date.parse(new Date())}
                    visible={this.state.addModal}
                    title="添加制造厂商"
                    onCancel={()=> {
                        this.setState({addModal: false})
                    }}
                    footer={[
                        <Button key="back" type="ghost" size="large"
                                onClick={()=> {
                                    this.setState({addModal: false})
                                }}>取消</Button>,
                        <Button key="submit" type="primary" size="large" onClick={this.addData}>
                            保存
                        </Button>,
                    ]}
                >
                    <AddOrEditName  ref="AddName"/>
                </Modal>
                <Modal
                    key={ Date.parse(new Date()) + 1}
                    visible={this.state.editModal}
                    title="修改制造厂商"
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
                    <AddOrEditName  ref="EditName"
                                    isEdit={true} editRecord={this.state.editRecord}/>
                </Modal>
            </Layout>
        )
    }
}
export default Manufacture;
