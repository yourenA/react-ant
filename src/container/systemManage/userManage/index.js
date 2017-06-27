/**
 * Created by Administrator on 2017/6/14.
 */
import React, {Component} from 'react';
import {Breadcrumb, Table, Pagination, Button, Modal,Popconfirm,Layout} from 'antd';
import axios from 'axios'
import SearchWrap from  './search';
import configJson from './../../../common/config.json';
import {getHeader, converErrorCodeToMsg} from './../../../common/common';
const {Content,} = Layout;
class HardwareTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            q: '',
            page: 1,
            group: '',
            meta: {pagination: {total: 0, per_page: 0}},
            editModal: false,
            addModal:false
        };
    }

    componentDidMount() {
        this.setState({loading: true});
        this.fetchHwData();
    }

    fetchHwData = (page = 1, q = '', group = '') => {
        const that = this;
        this.setState({loading: true});
        axios({
            url: `${configJson.prefix}/users`,
            method: 'get',
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    loading: false,
                    data: response.data.data
                })
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    delData=(id)=>{

    }
    onChangeSearch = (page, q, group)=> {
        this.setState({
            page, q, group,
        })
        this.fetchHwData(page, q, group);
    }
    onPageChange = (page) => {
        const {q, group}=this.state;
        this.onChangeSearch(page, q,group);
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
            title: '用户名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '所属组',
            dataIndex: 'username',
            key: 'username'
        },{
            title: '操作',
            key: 'action',
            width: 240,
            render: (text, record, index) => {
                return (
                    <div key={index}>
                        <Button type='primary' onClick={this.delData.bind(this, record.id)}>
                            重置密码
                        </Button>
                        <span className="ant-divider"/>
                        <Button onClick={()=> {
                            this.setState({editId:record.id,editModal: true, editRecord: record})
                        }}>
                            编辑
                        </Button>
                        <span className="ant-divider"/>
                        <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                                    onConfirm={this.delData.bind(this, record.id)}>
                            <button className="ant-btn ant-btn-danger" >
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
                        <Breadcrumb.Item>用户管理</Breadcrumb.Item>
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
                        title="查看脚本"
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
                    </Modal>
                <Modal
                    key={ Date.parse(new Date())+1}
                    visible={this.state.editModal}
                    title="修改用户"
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
                </Modal>
    </Layout>
        )
    }
}
export default HardwareTest;
