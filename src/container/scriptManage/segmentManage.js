/**
 * Created by Administrator on 2017/6/14.
 */
import React, {Component} from 'react';
import {Breadcrumb, Table, Pagination, Button, Modal, Popconfirm, message} from 'antd';
import axios from 'axios'
import {
    Link
} from 'react-router-dom';
import configJson from 'configJson' ;
import SearchSegment from './searchSegment'
import {getHeader, converErrorCodeToMsg} from './../../common/common';
import AddOrEditName from './addOrEditNmae';
import messageJson from './../../common/message.json';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
class SegmentManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            page: 1,
            q: '',
            meta: {pagination: {total: 0, per_page: 0}},
            editModal: false,
            editRecord: {}
        };
    }

    componentDidMount() {
        const segmentStorage = JSON.parse(sessionStorage.getItem('segmentStorage')) || [];
        if (segmentStorage.length > 0) {
            for (let i = 0, len = segmentStorage.length; i < len; i++) {
                sessionStorage.removeItem(segmentStorage[i])
            }
        }
        sessionStorage.removeItem('segmentStorage')
        sessionStorage.removeItem('manageSegmentId')
        sessionStorage.removeItem('segmentDiagramStorage')
        sessionStorage.removeItem('collapsed')
        sessionStorage.removeItem('fullPaged')
        this.fetchHwData();
    }

    fetchHwData = (page = 1, q = '')=> {
        this.setState({loading: true});
        const that = this;
        this.props.setSegmentLoadedFalse();
        // sessionStorage.clear();
        axios({
            url: `${configJson.prefix}/flow_diagrams`,
            method: 'get',
            params: {
                page: page,
                query: q
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
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    delData = (id)=> {
        console.log('id', id)
        const that = this;
        const {page, q}=this.state;
        axios({
            url: `${configJson.prefix}/flow_diagrams/${id}`,
            method: 'delete',
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.fetchHwData(page, q);
                message.success(messageJson[`del segment success`]);
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    editData = ()=> {
        const editSegmentName = this.refs.editSegmentName.getFieldsValue();
        console.log("editScriptName", editSegmentName);
        console.log('id', this.state.editRecord.id)
        const that = this;
        const {page, q, test_type, test_part, test_version}=this.state;
        axios({
            url: `${configJson.prefix}/flow_diagrams/${this.state.editRecord.id}`,
            method: 'put',
            data: {
                name: editSegmentName.name,
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                message.success(messageJson[`edit segment success`]);
                that.setState({
                    editModal: false
                })
                that.fetchHwData(page, q, test_type, test_part, test_version);
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
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '操作',
            key: 'action',
            width: 265,
            render: (text, record, index) => {
                return (
                    <div key={index}>
                        <Link
                            to={{
                                pathname: `${this.props.match.url}/${record.id}`,
                                state: {
                                    newSegment: false,
                                    SegmentJson: record.content,
                                    name: record.name,
                                    editRecord: record
                                }
                            }}
                        ><Button type="primary">查看/编辑</Button></Link>

                        <span className="ant-divider"/>
                        <Button onClick={()=> {
                            this.setState({editRecord: record, editModal: true})
                        }}>
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
        return (
            <div>
                <div className="content">
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item>脚本段管理</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="content-container">
                        <div className="operate-box">
                            <SearchSegment onChangeSearch={this.onChangeSearch}/>
                            <Link
                                to={{
                                    pathname: `${this.props.match.url}/newSegment`,
                                    state: {newSegment: true, SegmentJson: '{}', name: ''}
                                }}
                            ><Button icon="plus" type='primary' className='add-btn'>新建脚本段</Button></Link>

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
                        <AddOrEditName ref="editSegmentName" isSegment={true} editRecord={this.state.editRecord}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(SegmentManage);