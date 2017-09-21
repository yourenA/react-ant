/**
 * Created by Administrator on 2017/3/24.
 */
import React from 'react';
import {Breadcrumb, Button,Table,Badge} from 'antd';
import configJson from 'configJson' ;
import {getHeader, converErrorCodeToMsg} from './../../common/common';
import messageJson from './../../common/message.json';
import axios from 'axios'
import './print.css'
import './print.less'
import plus from './../../common/images/plus.png'
import reduce from './../../common/images/reduce.png'
const _ = require('lodash');
class ReportDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expands:[],
            items:{data:[]}
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
                console.log(response.data)
                that.setState({
                    ...response.data
                })
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }

    printReport=()=>{
        let expands = this.state.expands;
        this.setState({
            expands:[1,2,0,]
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
        const that=this;
        const renderPrintTable=this.state.items.data.map(function (item,index) {

            return(
                <tr key={index} className={`tr-${item.level}`}>
                    <td >{item.level<that.state.items.data[index+1]?<img src={plus} alt=""/>:null}</td>
                    <td ><span>{`${_.fill(Array((item.level-1)*5), '—').join('')}`}</span>{item.test_name}</td>
                    <td>{item.status_code}</td>
                    <td>{item.status_code_explain}</td>
                </tr>
            )
        })
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
            title: '名称',
            dataIndex: 'test_name',
            key: 'test_name',
            render: (text, record, index) => {
                return (
                    <p style={{paddingLeft:record.level>=2?(record.level-2)*80+'px':0}}><span style={{color:'#c7c2c2'}}>{`${record.level!== 1 ?'└'+_.fill(Array(6), '─').join(''):''}`}</span>{text}</p>
                )
            }
        }, {
            title: '状态码',
            dataIndex: 'status_code',
            key: 'status_code',
            width: 100,
        }, {
            title: '描述',
            dataIndex: 'status_code_explain',
            key: 'status_code_explain',
        }];
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
                            <Table bordered className="main-table print-ant-table"
                                   rowKey="id" columns={columns}
                                   dataSource={this.state.items.data} pagination={false}/>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default ReportDetail;
