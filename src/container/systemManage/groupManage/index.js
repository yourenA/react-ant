/**
 * Created by Administrator on 2017/6/14.
 */
import React, {Component} from 'react';
import {Breadcrumb, Table, Pagination, Button, Modal,  Layout} from 'antd';
import axios from 'axios'
import configJson from './../../../common/config.json';
import {getHeader, converErrorCodeToMsg} from './../../../common/common';
import AddOrEditName from './addOrEditNmae';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../../actions/fetchTestConf';
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
        this.props.fetchAllPermissions()
    }

    fetchHwData = (page = 1, q = '') => {
        const that = this;
        this.setState({loading: true});
        axios({
            url: `${configJson.prefix}/roles`,
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
    editData=()=>{
        const editName = this.refs.EditName.getFieldsValue();
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
            title: '组名称',
            dataIndex: 'display_name',
            key: 'display_name',
        }, {
            title: '操作',
            key: 'action',
            width: 80,
            render: (text, record, index) => {
                return (
                    <div key={index}>
                        <Button onClick={()=> {
                            this.setState({editId: record.id, editModal: true, editRecord: record})
                        }}>
                            编辑
                        </Button>
                    </div>
                )
            }
        }];
        return (
            <Layout style={{padding: '0 24px 24px'}}>

                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>组管理</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
                    <Table bordered className="main-table"
                           loading={this.state.loading}
                           rowKey="id" columns={columns}
                           dataSource={data} pagination={false}/>
                    <Pagination total={meta.pagination.total} current={page} pageSize={meta.pagination.per_page}
                                style={{marginTop: '10px'}} onChange={this.onPageChange}/>

                </Content>

                <Modal
                    key={ Date.parse(new Date()) + 1}
                    visible={this.state.editModal}
                    title="编辑组权限"
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
                    <AddOrEditName  {...this.props} ref="EditName"
                                    isEdit={true} editRecord={this.state.editRecord}/>
                </Modal>
            </Layout>
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
export default connect(mapStateToProps,mapDispatchToProps)(Manufacture);
