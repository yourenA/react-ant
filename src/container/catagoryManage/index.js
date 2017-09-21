/**
 * Created by Administrator on 2017/6/14.
 */
import React, {Component} from 'react';
import {Breadcrumb, Table, Pagination, Button, Modal, Popconfirm, message} from 'antd';
import axios from 'axios'
import SearchWrap from  './search';
import configJson from 'configJson' ;
import {getHeader, converErrorCodeToMsg} from './../../common/common';
import messageJson from './../../common/message.json';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import AddOrEditName from './addOrEditNmae';
import {
    Link
} from 'react-router-dom';
class Catagory extends Component {
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
            addVersionModal: false,
            editRecord: {},
            editId: ''
        };
    }

    componentDidMount() {
        this.fetchHwData();
        this.props.fetchAllProducts();
        if (this.props.match.url === '/test_stands') {
            this.props.fetchAllManufacture()
        }
    }

    fetchHwData = (page = 1, q = '', selectTypeOrCompany = '',startDate,endDate)=> {
        this.setState({loading: true});
        const that = this;
        this.setState({loading: true});
        let params = {
            page: page,
            query: q,
        };
        if (this.props.match.url === '/hardware_versions') {
            params = {
                page: page,
                query: q,
                product_id: selectTypeOrCompany
            }
        }else if(this.props.match.url === '/test_stands'){
            params = {
                page: page,
                query: q,
                company_id: selectTypeOrCompany
            }
        }else if(this.props.match.url ==='/reports'){
            params = {
                page: page,
                serial_number: q,
                start_date:startDate,
                end_date:endDate
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
            if (key === 'product_id') {
                addName.product_id = addName.product_id.key
            }
            if (key === 'company_id') {
                addName.company_id = addName.company_id.key
            }
        }
        console.log("addName", addName);
        axios({
            url: `${configJson.prefix}${this.props.match.url}`,
            method: 'post',
            data: addName,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[`add ${that.props.match.url} success`]);
                that.setState({
                    addModal: false
                })
                that.fetchHwData(page, q);
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    editData = ()=> {
        const editName = this.refs.EditName.getFieldsValue();
        const that = this;
        const {page, q}=this.state;
        for (let key in editName) {
            if (key === 'product_id') {
                editName.product_id = editName.product_id.key
            }
            if (key === 'company_id') {
                editName.company_id = editName.company_id.key
            }
        }
        console.log("editName", editName);
        axios({
            url: `${configJson.prefix}${this.props.match.url}/${this.state.editId}`,
            method: 'put',
            data: editName,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[`edit ${that.props.match.url} success`]);
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
    onChangeSearch = (page, q, selectType,startDate,endDate)=> {
        if (this.props.match.url === '/hardware_versions') {
            this.setState({
                page, q, selectType
            })
            this.fetchHwData(page, q, selectType);
        }else if(this.props.match.url === '/reports'){
            this.setState({
                page, q,startDate,endDate
            })
            this.fetchHwData(page, q, null,startDate,endDate);
        } else {
            this.setState({
                page, q
            })
            this.fetchHwData(page, q);
        }
    }
    onPageChange = (page) => {
        if (this.props.match.url === '/hardware_versions') {
            this.onChangeSearch(page, this.state.q, this.state.selectType);
        }else if(this.props.match.url === '/reports'){
            this.onChangeSearch(page, this.state.q, null,this.state.startDate,this.state.endDate)
        } else {
            this.onChangeSearch(page, this.state.q);
        }
    };
    renderTitle = ()=> {
        switch (this.props.match.url) {
            case '/companies':
                return '制造厂商';
            case '/products':
                return '产品管理';
            case '/test_types':
                return '测试类型';
            case '/hardware_versions':
                return '硬件版本';
            case '/test_stands':
                return '测试架';
            case '/reports':
                return '测试报告列表';
            default:
                return ''
        }
    }
    renderSearchTitle = ()=> {
        switch (this.props.match.url) {
            case '/companies':
                return '厂商名称';
            case '/products':
                return '产品代码';
            case '/test_types':
                return '测试类型';
            case '/hardware_versions':
                return '版本号';
            case '/test_stands':
                return '测试架名称';
            case '/reports':
                return '产品序列号';
            default:
                return ''
        }
    }
    renderAddBtn = ()=> {
        switch (this.props.match.url) {
            case '/companies':
            case '/products':
            case '/test_types':
            case '/parts':
            case '/test_stands':
                return <span><Button type="primary" icon="plus" className='add-btn' onClick={()=> {
                    this.setState({addModal: true})
                }}>
                    添加</Button></span>;
            case '/hardware_versions':
                return <span>
                    <Button icon="plus" type="primary"  className='add-btn'  onClick={()=> {
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
            width: '45px',
            className: 'table-index',
            render: (text, record, index) => {
                return (
                    <span>
                            {index + 1}
                        </span>
                )
            }
        }];
        if (this.props.match.url === '/companies') {
            columns.push({
                title: '制造厂商名称',
                dataIndex: 'name',
                key: 'name'
            })
        } else if (this.props.match.url === '/products') {
            columns.push({
                title: '产品代码',
                dataIndex: 'code',
                key: 'code'
            }, {
                title: '产品名称',
                dataIndex: 'name',
                key: 'name',
            });
        } else if (this.props.match.url === '/test_types') {
            columns.push({
                title: '测试类型',
                dataIndex: 'name',
                key: 'name'
            });
        } else if (this.props.match.url === '/hardware_versions') {
            columns.push({
                title: '产品名称',
                dataIndex: 'product_name',
                key: 'product_name'
            }, {
                title: '产品代码',
                dataIndex: 'product_code',
                key: 'product_code'
            }, {
                title: '硬件版本',
                dataIndex: 'version',
                key: 'version'
            });
        } else if (this.props.match.url === '/test_stands') {
            columns.push({
                title: '测试架名称',
                dataIndex: 'name',
                key: 'name'
            }, {
                title: 'IP地址',
                dataIndex: 'ip',
                key: 'ip'
            }, {
                title: '通道号',
                dataIndex: 'index',
                key: 'index'
            });
            /*localStorage.getItem('userrole') === '系统管理员' ?
                columns.push({
                    title: '厂商名称',
                    dataIndex: 'company_name',
                    key: 'company_name'
                }) : null;*/
        } else if (this.props.match.url === '/reports') {
            columns.push({
                title: '产品序列号',
                dataIndex: 'product_serial_number',
                key: 'product_serial_number'
            }, {
                title: '脚本名称',
                dataIndex: 'test_script_name',
                key: 'test_script_name'
            }, {
                title: '制造厂商',
                dataIndex: 'company_name',
                key: 'company_name'
            },{
                title: '产品代码',
                dataIndex: 'product_code',
                key: 'product_code'
            }, {
                title: '硬件版本',
                dataIndex: 'hardware_version',
                key: 'hardware_version'
            }, {
                title: '测试架',
                dataIndex: 'test_stand_name',
                key: 'test_stand_name'
            },{
                title: '测试时间',
                dataIndex: 'created_at',
                key: 'created_at'
            }, {
                title: '结果',
                dataIndex: 'status_code_explain',
                key: 'status_code_explain'
            });
            /*localStorage.getItem('userrole') === '系统管理员' ?
             columns.push({
             title: '厂商名称',
             dataIndex: 'company_name',
             key: 'company_name'
             }) : null;*/
        }

        if (this.props.match.url === '/reports'){
            columns.push({
                title: '操作',
                key: 'action',
                width: 150,
                render: (text, record, index) => {
                    return (
                        <div key={index}>
                            <Link
                                to={{
                                    pathname: `${this.props.match.url}/${record.id}`,
                                }}
                            ><Button type="primary">打开</Button></Link>
                            <span className="ant-divider"/>
                            <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                                        onConfirm={this.delData.bind(this, record.id)}>
                                <button className="ant-btn ant-btn-danger">删除
                                </button>
                            </Popconfirm>
                        </div>
                    )
                }
            })
        }else{
            columns.push({
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
                                <button className="ant-btn ant-btn-danger">删除
                                </button>
                            </Popconfirm>
                        </div>
                    )
                }
            })
        }


        return (
            <div>
                <div className="content">
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item>{this.renderTitle()}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="content-container">
                        <div className="operate-box">
                            <SearchWrap searchTitle={this.renderSearchTitle()}
                                        onChangeSearch={this.onChangeSearch}
                                        type={this.props.match.url} {...this.props} {...this.state} />
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
                        <AddOrEditName {...this.props} text1={this.renderSearchTitle()} type={this.props.match.url}
                                       ref="EditName"
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
                        <AddOrEditName  {...this.props} text1={this.renderSearchTitle()} type={this.props.match.url}
                                        ref="AddName"/>
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
export default connect(mapStateToProps, mapDispatchToProps)(Catagory);