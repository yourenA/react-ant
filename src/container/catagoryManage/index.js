/**
 * Created by Administrator on 2017/6/14.
 */
import React, {Component} from 'react';
import {Breadcrumb, Table, Pagination, Button, Modal, Popconfirm,message} from 'antd';
import axios from 'axios'
import SearchWrap from  './search';
import configJson from './../../common/config.json';
import {getHeader, converErrorCodeToMsg} from './../../common/common';
import messageJson from './../../common/message.json';
import AddOrEditName from './addOrEditNmae';
class HardwareTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index:1,
            data: [],
            loading: false,
            q: '',
            selectType:'',
            page: 1,
            meta: {pagination: {total: 0, per_page: 0}},
            editModal: false,
            addModal: false,
            addVersionModal: false,
            editRecord: {},
            editId:''
        };
    }

    componentDidMount() {
        this.setState({loading: true});
        this.fetchHwData();
    }

    fetchHwData = (page = 1, q = '',selectType='')=> {
        const that = this;
        this.setState({loading: true});
        let params =  {
            page: page,
            query: q,
        };
        if(this.props.match.url==='/hardware_versions'){
            params={
                page: page,
                query: q,
                part_id:selectType
            }
        }
        axios({
            url: `${configJson.prefix}${this.props.match.url}`,
            method: 'get',
            params: params,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data)
                that.setState({
                    data: response.data.data,
                    meta: response.data.meta,
                    page: page,
                    q: q,
                    loading: false
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
        for (let key in addName) {
            if(key==='part_id'){
                addName.part_id=addName.part_id.key
            }
        }
        console.log("addName", addName);
        axios({
            url: `${configJson.prefix}${this.props.match.url}`,
            method: 'post',
            params: addName,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[`add ${that.props.match.url} success`]);
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
        for (let key in editName) {
            if(key==='part_id'){
                editName.part_id=editName.part_id.key
            }
        }
        console.log("editName", editName);
        axios({
            url: `${configJson.prefix}${this.props.match.url}/${this.state.editId}`,
            method: 'put',
            params: editName,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[`edit ${that.props.match.url} success`]);
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
        console.log('id', id);
        const that = this;
        const {page, q}=this.state;
        axios({
            url: `${configJson.prefix}${this.props.match.url}/${id}`,
            method: 'delete',
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[`del ${that.props.match.url} success`]);
                that.fetchHwData(page, q);
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    onChangeSearch = (page, q,selectType)=> {
        if(this.props.match.url==='/hardware_versions'){
            this.fetchHwData(page, q,selectType);
        }else{
            this.fetchHwData(page, q);
        }
    }
    onPageChange = (page) => {
        this.onChangeSearch(page, this.state.q);
    };
    renderTitle = ()=> {
        switch (this.props.match.url) {
            case '/products':
                return '产品管理';
            case '/test_types':
                return '测试类型';
            case '/parts':
                return '测试部件';
            case '/hardware_versions':
                return '硬件版本';
            case '/test_stands':
                return '测试架';
            default:
                return ''
        }
    }
    renderSearchTitle = ()=> {
        switch (this.props.match.url) {
            case '/products':
                return '产品编码';
            case '/test_types':
                return '测试类型';
            case '/parts':
            case '/hardware_versions':
                return '部件名称';
            case '/test_stands':
                return '测试架名称';
            default:
                return ''
        }
    }
    renderAddBtn = ()=> {
        switch (this.props.match.url) {
            case '/products':
            case '/test_types':
            case '/parts':
            case '/test_stands':
                return <span><span className="ant-divider"/><Button type="primary" icon="plus" onClick={()=> {
                    this.setState({addModal: true})
                }}>
                    添加</Button></span>;
            case '/hardware_versions':
                return <span>
                    <span className="ant-divider"/>
                    <Button icon="plus"  type="primary"  onClick={()=> {
                        this.setState({addModal: true})
                    }}>
                    添加版本</Button>
                    </span>;
            default:
                return ''
        }
    }

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
        }];
        if (this.props.match.url === '/products') {
            columns.push({
                title: '产品编号',
                dataIndex: 'code',
                key: 'code'
            }, {
                title: '产品名称',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '部件名称',
                dataIndex: 'part_name',
                key: 'part_name',
            });
        } else if (this.props.match.url === '/test_types') {
            columns.push( {
                title: '测试类型',
                dataIndex: 'name',
                key: 'name'
            });
        }else if (this.props.match.url === '/parts') {
            columns.push( {
                title: '部件名称',
                dataIndex: 'name',
                key: 'name'
            });
        } else if (this.props.match.url === '/hardware_versions') {
            columns.push({
                title: '部件名称',
                dataIndex: 'part_name',
                key: 'part_name'
            }, {
                title: '硬件版本',
                dataIndex: 'version',
                key: 'version'
            });
        }else if (this.props.match.url === '/test_stands') {
            columns.push({
                title: '测试架名称',
                dataIndex: 'name',
                key: 'name'
            });
        }
        columns.push({
            title: '操作',
            key: 'action',
            width: 150,
            render: (text, record, index) => {
                return (
                    <div key={index}>
                        <Button onClick={()=> {
                            this.setState({editId:record.id,editModal: true, editRecord: record})
                        }}>
                            编辑
                        </Button>
                        <span className="ant-divider"/>
                        <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                                    onConfirm={this.delData.bind(this, record.id)}>
                            <button className="ant-btn ant-btn-danger" disabled={this.props.match.url === '/parts'?true:false}>删除
                            </button>
                        </Popconfirm>
                    </div>

                )
            }
        })

        return (
            <div>
                <div className="content">
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item>{this.renderTitle()}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="content-container">
                        <div className="operate-box">
                            <SearchWrap searchTitle={this.renderSearchTitle()}
                                        onChangeSearch={this.onChangeSearch} type={this.props.match.url} {...this.state} />
                            {this.renderAddBtn()}
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
                        title={`编辑${this.renderTitle()}`}
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
                        <AddOrEditName text1={this.renderSearchTitle()} type={this.props.match.url} ref="EditName"
                                       isEdit={true} editRecord={this.state.editRecord}/>
                    </Modal>
                    <Modal
                        key={ Date.parse(new Date()) + 1}
                        visible={this.state.addModal}
                        title={`添加${ this.renderTitle()}`}
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
                        <AddOrEditName text1={this.renderSearchTitle()} type={this.props.match.url} ref="AddName"/>
                    </Modal>
                </div>
            </div>
        )
    }
}


export default HardwareTest