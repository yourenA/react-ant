/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import {Breadcrumb, Icon, Input, Button, Modal, Select, Steps,Progress,message} from 'antd';
import configJson from './../../common/config.json';
import {getHeader, converErrorCodeToMsg} from './../../common/common';
import axios from 'axios'
import './hardwareTesting.less'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import HighZIndexMask from './../../component/mask'
const Option = Select.Option;
const Step = Steps.Step;
const confirm = Modal.confirm;
class HardwareTesting extends Component {
    constructor(props) {
        super(props);
        this.timer=null;
        this.state = {
            test_script_name: '',
            product_name: '',
            hardware_version: '',
            company_name: '',
            test_type_name: '',
            test_stand: '',
            product_code: '',
            adapter: '',
            product_sn: '',
            inputDisabled: true,
            standModal: false,
            adapterModal: false,
            startTestModal: false,
            startTest:false,
            maskDisplay:'none',
            percent:0
        };
    }

    componentDidMount() {
        console.log('this.props', this.props);
        const testRecord=this.props.location.state.testRecord;
        if (this.props.location.state.testAllType) {
            console.log('测试全部')
        } else {
            console.log(`只测试${this.props.location.state.testTypeId}`)
            this.fetchHwTestingData(testRecord.batch_id,this.props.location.state.testScriptId)
        }

    }
    fetchHwTestingData=(batch_id,test_script_id)=>{
        const that = this;
        let params = {
            batch_id,test_script_id
        };
        axios({
            url: `${configJson.prefix}/hardware_test_scripts/detail`,
            method: 'get',
            params: params,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                const receiveData=response.data
                that.setState({
                    ...receiveData
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
        if(this.state.startTest){
            const that=this;
            confirm({
                title: '确定要停止测试吗？',
                content: 'Some descriptions',
                onOk() {
                    that.setState({
                        startTest:false,
                        maskDisplay:'none',
                        percent:0
                    })
                    clearInterval(that.timer)
                },
                onCancel() {
                    console.log('Cancel');
                },
            });


        }else{
            this.setState({
                startTestModal: true
            })
        }

    }
    confirmTesting=()=>{
        const serialNumbers=this.refs.serialNumbers.refs.input.value;
        this.setState({
            startTestModal:false,
            maskDisplay:'block',
            startTest:!this.state.startTest
        });
        const that=this;
        this.timer=setInterval(function () {
            let percent = that.state.percent + 10;
            that.setState({ percent });
            if (percent === 100) {
                clearInterval(that.timer);
                message.success('测试完成')
            }
        },1000);
        console.log('正式开始测试',serialNumbers)
    }
    toggleInput = ()=> {
        this.setState({
            inputDisabled: !this.state.inputDisabled
        })
    }

    render() {
        return (
            <div>
                <div className="content">
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item style={{cursor: 'pointer'}} onClick={()=> {
                            this.props.history.goBack()
                        }}>硬件测试</Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.test_type_name?`测试:${this.state.test_type_name}` : `按工序流程测试`}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="content-container">
                        <div className="testing-header">
                            <div className="testing-config">
                                <div className="testing-config-row">
                                    <div className="testing-config-item">
                                        <span title={this.state.test_script_name}>测试脚本 : {this.state.test_script_name}
                                        </span>
                                    </div>

                                    <div className="testing-config-item">
                                        <span title={this.state.test_type_name}>产品批次 : {this.state.test_type_name}</span>
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
                                        <span title={this.state.test_type_name}>测试类型 : {this.state.test_type_name}</span>
                                    </div>
                                    <div className="testing-config-item">
                                        <span title={this.state.test_stand}>测试架 : {this.state.test_stand}</span>
                                        <Button className='change' type='primary' onClick={()=> {
                                            this.setState({
                                                standModal: true
                                            })
                                        }}>更改</Button>
                                    </div>
                                    <div className="testing-config-item">
                                        <span title={this.state.product_code}>产品代码 : {this.state.product_code}</span>
                                    </div>
                                    <div className="testing-config-item">
                                        <span title={this.state.adapter}>适配器 : {this.state.adapter}</span>
                                        <Button className='change' type='primary' onClick={()=> {
                                            this.setState({
                                                adapterModal: true
                                            })
                                        }}>更改</Button>
                                    </div>
                                    <div className="testing-config-item">
                                        <span>产品SN :
                                            <Input disabled={this.state.inputDisabled} style={{width: 130}}
                                                   placeholder=""/>
                                            <Icon onClick={this.toggleInput}
                                                  type={this.state.inputDisabled ? 'lock' : 'unlock'}
                                                  title={this.state.inputDisabled ? '打开' : '关闭'}
                                                  style={{fontSize: '20px', cursor: 'pointer'}}/>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="testing-start" style={{zIndex:this.state.startTest?1000:''}}>
                                <div className="testing-start-btn" onClick={this.startTesting} style={{backgroundColor:this.state.startTest?'red':''}}>
                                    {this.state.startTest?"结束测试":"开始测试"}
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
                                                <Step  title={ this.props.location.state.testTypeName}/>
                                            </Steps>
                                    }
                                </div>
                            </div>
                            <div className="testing-content-data"></div>
                        </div>
                    </div>
                    <Modal
                        key={ Date.parse(new Date())}
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
                            <Button key="submit" type="primary" size="large" onClick={this.editData}>
                                保存
                            </Button>,
                        ]}
                    >
                        <Select allowClear={true} dropdownMatchSelectWidth={false} style={{width: '100%'}}
                                onChange={this.onChangeStand}
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            { this.props.fetchTestConf.test_stands.map((item, key) => {
                                return (
                                    <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                                )
                            }) }
                        </Select>
                    </Modal>
                    <Modal
                        key={ Date.parse(new Date()) + 1}
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
                            <Button key="submit" type="primary" size="large" onClick={this.editData}>
                                保存
                            </Button>,
                        ]}
                    >
                        <Select allowClear={true} dropdownMatchSelectWidth={false} style={{width: '100%'}}
                                onChange={this.onChangeStand}
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            { this.props.fetchTestConf.test_stands.map((item, key) => {
                                return (
                                    <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                                )
                            }) }
                        </Select>
                    </Modal>
                    <Modal
                        key={ Date.parse(new Date()) + 2}
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
                            <Button key="submit" type="primary" size="large" onClick={this.confirmTesting}>
                                开始测试
                            </Button>,
                        ]}
                    >
                        产品序列号 : <Input ref="serialNumbers" style={{width: '80%'}}/>
                    </Modal>
                </div>
                <HighZIndexMask display={this.state.maskDisplay}/>
                <Progress type="circle"  width={180} percent={this.state.percent} className="hardware-progress" style={{display:this.state.startTest?'block':'none'}}/>
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