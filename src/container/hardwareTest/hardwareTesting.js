/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import {Breadcrumb,  Input, Button, Modal, Select, Steps, Progress, message} from 'antd';
import configJson from 'configJson' ;
import {getHeader, converErrorCodeToMsg} from './../../common/common';
import axios from 'axios'
import './hardwareTesting.less'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import HighZIndexMask from './../../component/mask'
import ConfigForm from './configForm'
const Step = Steps.Step;
const confirm = Modal.confirm;

class HardwareTesting extends Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.ws=null;
        this.state = {
            product_name: '',
            hardware_version: '',
            company_name: '',
            test_type_name: '',
            batch_code:'',
            test_stand: {
                key: localStorage.getItem('test_stand') ? JSON.parse(localStorage.getItem('test_stand')).key : '',
                label: localStorage.getItem('test_stand') ? JSON.parse(localStorage.getItem('test_stand')).label : ''
            },
            script: {
                key: '',
                label:  ''
            },
            serial_number:'',
            product_code: '',
            // adapter: [],
            // selectedAdapter:{
            //     key: localStorage.getItem('adapter') ? JSON.parse(localStorage.getItem('adapter')).key : '',
            //     label: localStorage.getItem('adapter') ? JSON.parse(localStorage.getItem('adapter')).label : ''
            // },
            product_sn: '',
            inputDisabled: true,
            scriptModal: false,
            standModal: false,
            // adapterModal: false,
            startTestModal: false,
            startTest: false,
            startLoopTest:false,
            maskDisplay: 'none',
            percent: 0,
            wsMessage:[],
            testInfo: []
        };
    }

    componentDidMount() {
        const testRecord = this.props.location.state.testRecord;
        if (this.props.location.state.testAllType) {
            console.log('测试全部')
        } else {
            console.log(`只测试${this.props.location.state.testTypeId}`)
            this.fetchHwTestingData(testRecord.batch_id, this.props.location.state.testScriptId)

        }
        this.props.fetchAllTestStand()
        const data = [];
        for (let i = 0; i < 100; i++) {
            data.push({
                key: i,
                name: `Edward King ${i}`,
                age: 32,
                address: `London, Park Lane no. ${i}`,
                info: `Info ${i}`
            });
        }
        this.setState({
            testInfo: data
        });
        // this.getAdapter()
    }
    componentWillUnmount(){
        if(this.ws){
            this.ws.close()
        }
    }
    fetchHwTestingData = (batch_id, test_script_id)=> {
        const that = this;
        let params = {
            batch_id, test_script_id
        };
        axios({
            url: `${configJson.prefix}/hardware_test_scripts/detail`,
            method: 'get',
            params: params,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                const receiveData = response.data
                that.setState({
                    script:{key:receiveData.test_script_id,label:receiveData.test_script_name},
                    ...receiveData
                },function () {
                    that.props.fetchAllScript(this.state.hardware_version_id,this.state.test_type_id)
                })
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    }
    startTesting = ()=> {
        if(this.state.percent===100 &&  !this.state.startLoopTest){
            this.setState({
                startTest: false,
                maskDisplay: 'none',
                percent: 0
            });
            // this.stopWS()
        }else if (this.state.startTest) {
            const that = this;
            confirm({
                title: '确定要停止测试吗？',
                onOk() {
                    that.setState({
                        startTest: false,
                        maskDisplay: 'none',
                        percent: 0
                    });
                    that.ws.close();
                    // that.stopWS()
                    // clearInterval(that.timer)
                },
                onCancel() {
                    console.log('Cancel');
                },
            });


        } else {
            this.setState({
                startTestModal: true
            })
        }

    }
    confirmTesting = ()=> {
        const serialNumbers = this.refs.serialNumbers.refs.input.value;
        const that = this;
        const parameters = {
            serial_number: serialNumbers,
            test_script_id: this.state.script.key,
            test_stand_id:this.state.test_stand.key,
        }
        that.openWS('start',parameters);
    }
    openWS = (command,parameters)=> {
        console.log('parameters',parameters);
        const that=this;
        this.ws = new WebSocket(`${configJson.wsPrefix}:${configJson.wsPort}/?token=${localStorage.getItem('usertoken')}`);//url地址类似与get请求
        this.ws.onopen = function () {
            console.log('onopen');
            const sendData=JSON.stringify({
                command:command,
                parameters:parameters
            })
            that.ws.send(sendData);
        };
        this.ws.onmessage = function (evt) {
            const {wsMessage}={...that.state};
            const evtData=JSON.parse(evt.data)
            console.log('evt',evtData)
            if(evtData.status_code === 200 && evtData.type === 'START_TEST'){
                console.log('开始正确测试');
                that.setState({
                    startTestModal: false,
                    maskDisplay: 'block',
                    startTest: true,
                })
            }
            if(evtData.status_code === 200 && evtData.type === 'STOP_TEST'){
                console.log('结束正确测试');
                that.ws.close();
                if(that.state.percent===100 && that.state.startLoopTest){
                    console.log('继续开始测试');
                    // that.stopWS();
                    that.setState({
                        percent:0,
                        // startTest:false
                    });
                    that.confirmTesting()
                }
            }
            if(evtData.status_code === 200 && evtData.type === 'TESTING' ){
                console.log('that.state.percent',that.state.percent)
                that.setState({
                    percent:evtData.data.percent,
                    wsMessage:wsMessage.concat(evtData.data.message)
                })
            }else if(evtData.status_code === 400 ||evtData.status_code === 401 || evtData.status_code === 403|| evtData.status_code === 422){
                that.ws.close();
                if(evtData.errors){
                    let first;
                    for (first in evtData.errors) break;
                    message.error(evtData.errors[first][0]);
                }else{
                    message.error(evtData.message);
                }

            }
        };
        this.ws.onclose = function (evt) {
            console.log('WebSocketClosed!');
        };
        this.ws.onerror = function (evt) {
            console.log('WebSocketError!');
        };
    }
    stopWS=()=>{
        const sendData=JSON.stringify({
            command:'stop',
        });
        this.ws.send(sendData);
        console.log('关闭websocket');
        this.ws.close();

    }
    changetScrip=()=>{
        const scriptConfigForm = this.refs.scriptConfigForm.getFieldsValue();
        this.setState({
            script:{key:scriptConfigForm.test_script.key,label:scriptConfigForm.test_script.label},
            scriptModal:false
        })
    }
    changeTestStand = ()=> {
        const testStandConfigForm = this.refs.testStandConfigForm.getFieldsValue();
        this.setState({
            test_stand:{key:testStandConfigForm.test_stand.key,label:testStandConfigForm.test_stand.label},
            standModal:false
        }, function () {
            localStorage.setItem('test_stand', JSON.stringify(this.state.test_stand))
        })
    }
    renderLoopTestBtn=()=>{
        return(
            configJson.env==='development'?
                <Button key="submit-loop" type="primary" size="large"
                        onClick={()=> {
                            this.setState({startLoopTest:true},function () {
                                this.confirmTesting();
                            });
                        }}>开始循环测试</Button>
                :null
        )
    }
    render() {
        return (
            <div>
                <div className="content">
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item style={{cursor: 'pointer'}} onClick={()=> {
                            this.props.history.goBack()
                        }}>硬件测试</Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.test_type_name ? `测试:${this.state.test_type_name}` : `按工序流程测试`}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="content-container">
                        <div className="testing-header">
                            <div className="testing-config">
                                <div className="testing-config-row">
                                    <div className="testing-config-item">
                                        <span className="testing-config-text" title={this.state.script.label}>测试脚本 : {this.state.script.label}
                                        </span>
                                        <Button className='change' type='primary' onClick={()=> {
                                            this.setState({
                                                scriptModal: true
                                            })
                                        }}>更改</Button>
                                    </div>

                                    <div className="testing-config-item">
                                        <span
                                            title={this.state.batch_code}>产品批次 : {this.state.batch_code}</span>
                                    </div>
                                    <div className="testing-config-item">
                                        <span
                                            title={this.state.hardware_version}>硬件版本 : {this.state.hardware_version}</span>
                                    </div>
                                    <div className="testing-config-item">
                                        <span title={this.state.product_name}>产品名称 : {this.state.product_name}</span>
                                    </div>
                                    <div className="testing-config-item">
                                        <span title={this.state.company_name}>生产商 : {this.state.company_name}</span>
                                    </div>
                                    <div className="testing-config-item">
                                        <span
                                            title={this.state.test_type_name}>测试类型 : {this.state.test_type_name}</span>
                                    </div>
                                    <div className="testing-config-item">
                                        <span
                                            className="testing-config-text" title={this.state.test_stand.label}>测试架 : {this.state.test_stand.label}</span>
                                        <Button className='change' type='primary' onClick={()=> {
                                            this.setState({
                                                standModal: true
                                            })
                                        }}>更改</Button>
                                    </div>
                                    <div className="testing-config-item">
                                        <span title={this.state.product_code}>产品代码 : {this.state.product_code}</span>
                                    </div>
                                    {/*<div className="testing-config-item">
                                        <span className="testing-config-text" title={this.state.selectedAdapter.label}>适配器 : {this.state.selectedAdapter.label}</span>
                                        <Button className='change' type='primary' onClick={()=> {
                                            this.setState({
                                                adapterModal: true
                                            })
                                        }}>更改</Button>
                                    </div>*/}
                                    {/*<div className="testing-config-item">
                                        <span title={this.state.serial_number}>产品序列号 : {this.state.serial_number}</span>
                                    </div>*/}
                                </div>
                            </div>
                            <div className="testing-start" style={{zIndex: this.state.startTest ? 1000 : ''}}>
                                <div className="testing-start-btn" onClick={this.startTesting}
                                     style={{backgroundColor: this.state.startTest ? 'red' : ''}}>
                                    {this.state.percent===100?this.state.startLoopTest?"结束测试":'完成':this.state.startTest ? "结束测试" : "开始测试"}
                                </div>
                            </div>
                        </div>

                        <div className="testing-content">
                            <div className="testing-content-sidebar">
                                <div>
                                    <h4 className="sidebar-title">测试工序流程状态</h4>
                                    {
                                        this.props.location.state.testAllType
                                            ?
                                            <Steps direction="vertical" current={0}>
                                                {
                                                    this.props.location.state.testRecord.test_types.data.map((item, index)=> {
                                                        return (
                                                            <Step key={index} title={item.name}/>
                                                        )
                                                    })
                                                }
                                            </Steps>
                                            :
                                            <Steps direction="vertical" current={0}>
                                                <Step title={ this.props.location.state.testTypeName}/>
                                            </Steps>
                                    }
                                </div>
                            </div>
                            <div className="testing-content-data">
                                {/*<Table bordered={true} columns={columns} dataSource={this.state.testInfo}
                                       pagination={false} scroll={{y: 457}}/>*/}
                                {this.state.wsMessage.map((item,index)=>{
                                    return(
                                        <p key={index}>{item}</p>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <Modal
                        key={ Date.parse(new Date())}
                        visible={this.state.scriptModal}
                        title="测试脚本"
                        onCancel={()=> {
                            this.setState({scriptModal: false})
                        }}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=> {
                                        this.setState({scriptModal: false})
                                    }}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.changetScrip}>
                                保存
                            </Button>,
                        ]}
                    >
                        <ConfigForm ref="scriptConfigForm" {...this.props} type="script" script={this.state.script}/>
                    </Modal>
                    <Modal
                        key={ Date.parse(new Date())+1}
                        visible={this.state.standModal}
                        title="测试架"
                        onCancel={()=> {
                            this.setState({standModal: false})
                        }}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=> {
                                        this.setState({standModal: false})
                                    }}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.changeTestStand}>
                                保存
                            </Button>,
                        ]}
                    >
                        <ConfigForm ref="testStandConfigForm"  {...this.props} type="test_stand" script={this.state.test_stand}/>
                    </Modal>
                   {/* <Modal
                        key={ Date.parse(new Date()) + 2}
                        visible={this.state.adapterModal}
                        title="适配器"
                        onCancel={()=> {
                            this.setState({adapterModal: false})
                        }}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=> {
                                        this.setState({adapterModal: false})
                                    }}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.changeAdapter}>
                                保存
                            </Button>,
                        ]}
                    >
                        <ConfigForm ref="adapterConfigForm"  {...this.props} type="adapter" adapter={this.state.adapter} selectedAdapter={this.state.selectedAdapter}/>
                    </Modal>*/}
                    <Modal
                        visible={this.state.startTestModal}
                        title="开始测试"
                        onCancel={()=> {
                            this.setState({startTestModal: false})
                        }}
                        footer={[
                            <Button key="back" type="ghost" size="large"
                                    onClick={()=> {
                                        this.setState({startTestModal: false})
                                    }}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={()=> {
                                this.setState({startLoopTest:false},function () {
                                    this.confirmTesting();
                                });
                            }}>
                                开始测试
                            </Button>,
                            this.renderLoopTestBtn()
                        ]}
                    >
                        产品序列号 : <Input ref="serialNumbers" style={{width: '80%'}}/>
                    </Modal>
                </div>
                <HighZIndexMask display={this.state.maskDisplay}/>
                <Progress type="circle" width={180} percent={this.state.percent} className="hardware-progress"
                          style={{display: this.state.startTest ? 'block' : 'none'}}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(HardwareTesting);