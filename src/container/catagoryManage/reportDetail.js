/**
 * Created by Administrator on 2017/3/24.
 */
import React from 'react';
import {Breadcrumb, Button,Table,Badge} from 'antd';
import configJson from 'configJson' ;
import {getHeader, converErrorCodeToMsg,getArray,getArrayOfGroup} from './../../common/common';
import messageJson from './../../common/message.json';
import axios from 'axios'
import './print.css'
import './print.less'
class ReportDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expands:[],
            items:[],
            allExpandsIndex:[]
        };
    }

    componentDidMount() {
        this.fetchReportDetail(this.props.match.params.id)
    }
    fetchReportDetail=(id)=>{
        console.log(id)
        const that=this;
        axios({
            url: `${configJson.prefix}/reports/${id}`,
            method: 'get',
            headers: getHeader()
        })
            .then(function (response) {
                const allExpandsIndex=getArrayOfGroup(response.data.items);
                getArray(response.data.items);
                that.setState({
                    allExpandsIndex,
                    ...response.data
                })
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    expandRow=(expanded, record)=>{
        if(expanded){
            this.state.expands.push(record.index)
            this.setState({
                    expands:this.state.expands
            })
        }else{
            const index = this.state.expands.indexOf(record.index);
            if (index > -1) {
                this.state.expands.splice(index, 1);
            }
            this.setState({
                expands:this.state.expands
            })
        }

    }

    printReport=()=>{
        let expands = this.state.expands;
        this.setState({
            expands:this.state.allExpandsIndex
        },function () {
            if(document.execCommand("print")){
                this.setState({
                    expands
                })
                // console.log(new Date().getUTCSeconds())//关闭打印窗口后
            }else{
                console.log('不打印')
            }
        })
        // window.print()
        // printJS('print-content', 'html')
    }

    render() {
        console.log(this.state.expands)
        const that=this;
        const columns = [{
            title: '名称',
            dataIndex: 'test_name',
            key: 'test_name',
        }, {
            title: '状态码',
            dataIndex: 'status_code',
            key: 'status_code',
            width: '15%',
        }, {
            title: '描述',
            dataIndex: 'status_code_explain',
            key: 'status_code_explain',
            width: '15%',
        }];

        const expandedRowRender = (record) => {
            console.log(record);
            return (
                <Table
                    rowKey="index"
                    columns={columns}
                    dataSource={record.children}
                    pagination={false}
                    expandedRowRender={(record)=>expandedRowRender(record) }
                />
            );
        };


        return (
            <div>
                <div className="content">
                    <Breadcrumb className="breadcrumb notprint">
                        <Breadcrumb.Item>测试报告列表</Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.product_serial_number}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="content-container">
                        <div className="operate-box notprint" >
                            <Button onClick={()=>this.props.history.goBack()}>退出</Button>
                            <span className="ant-divider"/>
                            <Button type='primary' onClick={this.printReport}>打印</Button>
                        </div>
                        {/*style={{visibility:'hidden',overflow:'hidden',position:'fixed',zIndex:0}}*/}
                        <div id="print-content" className="print-content" >
                            <div className="print-header">
                                <h3>测试报告</h3>
                                <div className="print-category">
                                    <div className="print-item">
                                        <span
                                              title={this.state.product_serial_number}>产品序列号 : {this.state.product_serial_number}
                                        </span>
                                    </div>

                                    <div className="print-item">
                                        <span
                                              title={this.state.product_code}>产品代码 : {this.state.product_code}
                                        </span>
                                    </div>
                                    <div className="print-item">
                                        <span
                                              title={this.state.product_name}>产品名称 : {this.state.product_name}
                                        </span>
                                    </div>
                                    <div className="print-item">
                                        <span
                                              title={this.state.hardware_version}>硬件版本 : {this.state.hardware_version}
                                        </span>
                                    </div>
                                    <div className="print-item">
                                        <span
                                              title={this.state.status_code_explain}>结果 : {this.state.status_code_explain}
                                        </span>
                                    </div>
                                    <div className="print-item">
                                        <span
                                              title={this.state.test_type_name}>测试类型 : {this.state.test_type_name}
                                        </span>
                                    </div>
                                    <div className="print-item">
                                        <span
                                              title={this.state.test_script_name}>脚本名称 : {this.state.test_script_name}
                                        </span>
                                    </div>
                                    <div className="print-item">
                                        <span
                                              title={this.state.created_at}>测试时间 : {this.state.created_at}
                                        </span>
                                    </div>
                                    <div className="print-item">
                                        <span
                                              title={this.state.test_stand_name}>测试架 : {this.state.test_stand_name}
                                        </span>
                                    </div>
                                    <div className="print-item">
                                        <span
                                            title={this.state.company_name}>制造厂商 : {this.state.company_name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                          {/*  <table className="print-table" style={{width:'100%'}}>
                         <tbody>
                         {renderPrintTable}
                         </tbody>
                         </table>*/}
                            <Table bordered className="main-table  print-ant-table"
                                   rowKey="index" columns={columns}
                                   expandedRowKeys={this.state.expands}
                                   onExpand={this.expandRow}
                                   dataSource={this.state.items} pagination={false}/>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default ReportDetail;
