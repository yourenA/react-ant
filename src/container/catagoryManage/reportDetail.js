/**
 * Created by Administrator on 2017/3/24.
 */
import React from 'react';
import {Breadcrumb, Button} from 'antd';
import { Table, Badge, Menu, Dropdown, Icon } from 'antd';
import './print.css'
import './print.less'
class ReportDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expands:[]
        };
    }

    componentDidMount() {
        this.fetchReportDetail(this.props.match.params.id)
    }
    fetchReportDetail=(id)=>{
        console.log(id)
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
        const expandedRowRender = () => {
            const columns = [
                { title: 'Date', dataIndex: 'date', key: 'date' },
                { title: 'Name', dataIndex: 'name', key: 'name' },
                { title: 'Status', key: 'state', render: () => <span><Badge status="success" />Finished</span> },
                { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
            ];

            const data = [];
            for (let i = 0; i < 3; ++i) {
                data.push({
                    key: i,
                    date: '2014-12-24 23:12:00',
                    name: 'This is production name',
                    upgradeNum: 'Upgraded: 56',
                });
            }
            return (
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                />
            );
        };

        const columns = [
            { title: 'Version', dataIndex: 'version', key: 'version' },
            { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
            { title: 'Creator', dataIndex: 'creator', key: 'creator' },
            { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
        ];

        const data = [];
        for (let i = 0; i < 3; ++i) {
            data.push({
                key: i,
                version: '10.3.4.5654',
                upgradeNum: 500,
                creator: 'Jack',
                createdAt: '2014-12-24 23:12:00',
            });
        }

        return (
            <div>
                <div className="content">
                    <Breadcrumb className="breadcrumb notprint">
                        <Breadcrumb.Item>测试报告列表</Breadcrumb.Item>
                        <Breadcrumb.Item>{this.props.match.params.id}</Breadcrumb.Item>
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
                                              title='测试脚本测试脚本测试脚本'>测试脚本 : 测试脚本测试脚本测试脚本{this.state.script}
                                        </span>
                                    </div>

                                    <div className="print-item">
                                        <span
                                              title={this.state.script}>测试脚本 : {this.state.script}
                                        </span>
                                    </div>
                                    <div className="print-item">
                                        <span
                                              title={this.state.script}>测试脚本 : {this.state.script}
                                        </span>
                                    </div>
                                    <div className="print-item">
                                        <span
                                              title={this.state.script}>测试脚本 : {this.state.script}
                                        </span>
                                    </div>
                                    <div className="print-item">
                                        <span
                                              title={this.state.script}>测试脚本 : {this.state.script}
                                        </span>
                                    </div>
                                    <div className="print-item">
                                        <span
                                              title={this.state.script}>测试脚本 : {this.state.script}
                                        </span>
                                    </div>
                                    <div className="print-item">
                                        <span
                                              title={this.state.script}>测试脚本 : {this.state.script}
                                        </span>
                                    </div>
                                    <div className="print-item">
                                        <span
                                              title={this.state.script}>测试脚本 : {this.state.script}
                                        </span>
                                    </div>
                                    <div className="print-item">
                                        <span
                                              title={this.state.script}>测试脚本 : {this.state.script}
                                        </span>
                                    </div>
                                    <div className="print-item">
                                        <span
                                              title={this.state.script}>测试脚本 : {this.state.script}
                                        </span>
                                    </div>

                                </div>
                            </div>
                            <Table
                                ref="printTable"
                                className="components-table-demo-nested"
                                columns={columns}
                                bordered
                                expandedRowRender={expandedRowRender}
                                dataSource={data}
                                expandedRowKeys={this.state.expands}
                                onExpand={(expanded, record) => {
                                    let expands = this.state.expands;
                                    if (expanded) {
                                        expands.push(record.key);
                                    } else {
                                        expands = expands.filter(v => v != record.key);
                                    }
                                    this.setState({expands});
                                }}
                            />
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default ReportDetail;
