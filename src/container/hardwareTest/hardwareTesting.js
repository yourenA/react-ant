/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import {Breadcrumb, Icon, Input, Button, Tree,Modal,Select} from 'antd';

import './hardwareTesting.less'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
const TreeNode = Tree.TreeNode;
const Option = Select.Option;
class HardwareTesting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test_script:'123fa fa fafafffa 123fa fa fafafffa 123fa fa fafafffa 123fa fa fafafffa f',
            product_name:'product_name',
            hardware_version:'hardware_version',
            manufacturer:'manufacturer',
            test_type:'test_type',
            test_stand:'test_standtest_standtest_standtest_stand',
            product_code:'product_code',
            adapter:'adapter',
            product_sn:'product_sn',
            batches:'batches',
            inputDisabled:true,
            standModal:false,
            adapterModal:false,
            startTestModal:false
        };
    }

    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    }
    startTesting=()=>{
        this.setState({
            startTestModal:true
        })
    }
    toggleInput=()=>{
        this.setState({
            inputDisabled:!this.state.inputDisabled
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
                        <Breadcrumb.Item>测试{this.props.match.params.uuid}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="content-container">
                        <div className="testing-header">
                            <div className="testing-config">
                                <div className="testing-config-row">
                                    <div className="testing-config-item">
                                        <span title={this.state.test_script}>测试脚本 : {this.state.test_script}
                                            <Button className='change' type='primary' onClick={()=>{
                                                this.setState({
                                                    standModal:true
                                                })
                                            }}>更改</Button>
                                        </span>
                                    </div>

                                    <div className="testing-config-item">
                                        <span title={this.state.batches}>产品批次 : {this.state.batches}</span>
                                    </div>
                                    <div className="testing-config-item">
                                        <span title={this.state.hardware_version}>硬件版本 : {this.state.hardware_version}</span>
                                    </div>
                                    <div className="testing-config-item">
                                        <span title={this.state.product_name}>产品名称 : {this.state.product_name}</span>
                                    </div>
                                    <div className="testing-config-item">
                                        <span title={this.state.manufacturer}>生产商 : {this.state.manufacturer}</span>
                                    </div>
                                    <div className="testing-config-item">
                                        <span title={this.state.test_type}>测试类型 : {this.state.test_type}</span>
                                    </div>
                                    <div className="testing-config-item">
                                        <span title={this.state.test_stand}>测试架 : {this.state.test_stand}</span>
                                        <Button className='change' type='primary' onClick={()=>{
                                            this.setState({
                                                standModal:true
                                            })
                                        }}>更改</Button>
                                    </div>
                                    <div className="testing-config-item">
                                        <span title={this.state.product_code}>产品代码 : {this.state.product_code}</span>
                                    </div>
                                    <div className="testing-config-item">
                                        <span title={this.state.adapter}>适配器 : {this.state.adapter}</span>
                                        <Button  className='change'  type='primary'  onClick={()=>{
                                            this.setState({
                                                adapterModal:true
                                            })
                                        }}>更改</Button>
                                    </div>
                                    <div className="testing-config-item">
                                        <span>产品SN :
                                            <Input disabled={this.state.inputDisabled} style={{width: 130}} placeholder=""/>
                                            <Icon onClick={this.toggleInput} type={this.state.inputDisabled?'lock':'unlock'}
                                                  title={this.state.inputDisabled?'打开':'关闭'} style={{fontSize:'20px',cursor:'pointer'}}/>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="testing-start">
                                <div className="testing-start-btn" onClick={this.startTesting}>
                                    开始测试
                                </div>
                            </div>
                        </div>

                        <div className="testing-content">
                            <div className="testing-content-sidebar">
                                <Tree
                                    showLine
                                    onSelect={this.onSelect}
                                >
                                    <TreeNode title="测试电源" key="0-0">
                                        <TreeNode title="PA0 读取IG低电平状态" key="0-0-0"/>
                                        <TreeNode title="leaf" key="0-0-1"/>
                                        <TreeNode title="leaf" key="0-0-2"/>
                                    </TreeNode>
                                    <TreeNode title="功能测试" key="0-1">
                                        <TreeNode title="PA0 读取IG低电平状态PA0 读取IG低电平状态" key="0-1-0"/>
                                        <TreeNode title="leaf" key="0-1-1"/>
                                        <TreeNode title="leaf" key="0-1-2"/>
                                    </TreeNode>
                                </Tree>
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
                        <Select allowClear={true} dropdownMatchSelectWidth={false} style={{width:'100%'}}
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
                        key={ Date.parse(new Date())+1}
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
                        <Select allowClear={true} dropdownMatchSelectWidth={false} style={{width:'100%'}}
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
                        key={ Date.parse(new Date())+2}
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
                            <Button key="submit" type="primary" size="large" onClick={this.editData}>
                                开始测试
                            </Button>,
                        ]}
                    >
                        产品序列号 : <Input ref="serialNumbers"  style={{width:'80%'}}/>
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
export default connect(mapStateToProps,mapDispatchToProps)(HardwareTesting);