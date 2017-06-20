/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import {Breadcrumb, Select, Input, Button, Tree} from 'antd';
import './hardwareTesting.less'
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
class HardwareTesting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test_script:'123fa fa fafafffa 123fa fa fafafffa 123fa fa fafafffa 123fa fa fafafffa f',
            part_name:'part_name',
            hardware_version:'hardware_version',
            manufacturer:'manufacturer',
            test_type:'test_type',
            test_stand:'test_stand',
            product_code:'product_code',
            adapter:'adapter',
            product_sn:'product_sn'
        };
    }

    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    }
    startTesting=()=>{
        console.log('开始测试')
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
                                        <span title={this.state.test_script}>测试脚本 : {this.state.test_script}</span>
                                    </div>
                                    <div className="testing-config-item">
                                        <span title={this.state.part_name}>部件名称 : {this.state.part_name}</span>
                                    </div>
                                    <div className="testing-config-item">
                                        <span>硬件版本 :
                                            <Select style={{width: 150}} defaultValue={ '0' }
                                                    onChange={this.onChangeOnline_status}>
                                                <Option value="0">所有状态</Option>
                                                <Option value="1">在线</Option>
                                                <Option value="-1">离线</Option>
                                                <Option value="-2">未激活</Option>
                                            </Select>
                                        </span>
                                    </div>
                                </div>
                                <div className="testing-config-row">
                                    <div className="testing-config-item">
                                        <span title={this.state.manufacturer}>生产商 : {this.state.manufacturer}</span>
                                    </div>
                                    <div className="testing-config-item">
                                        <span title={this.state.test_type}>测试类型 : {this.state.test_type}</span>
                                    </div>
                                    <div className="testing-config-item">
                                        <span>测试架   :
                                         <Select style={{width: 150}} defaultValue={ '0' }
                                                 onChange={this.onChangeOnline_status}>
                                                <Option value="0">所有状态</Option>
                                                <Option value="1">在线</Option>
                                                <Option value="-1">离线</Option>
                                                <Option value="-2">未激活</Option>
                                            </Select>
                                        </span>
                                    </div>
                                </div>
                                <div className="testing-config-row">
                                    <div className="testing-config-item">
                                        <span title={this.state.product_code}>产品代码 : {this.state.product_code}</span>
                                    </div>
                                    <div className="testing-config-item">
                                        <span>适配器 :
                                            <Select style={{width: 70}} defaultValue={ '0' }
                                                    onChange={this.onChangeOnline_status}>
                                                <Option value="0">所有状态</Option>
                                                <Option value="1">在线</Option>
                                                <Option value="-1">离线</Option>
                                                <Option value="-2">未激活</Option>
                                            </Select>
                                            <Button type="primary">重新获取</Button></span>
                                    </div>
                                    <div className="testing-config-item">
                                        <span>产品SN :
                                        <Input style={{width: 150}} placeholder=""/>
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
                </div>
            </div>
        )
    }
}
export default HardwareTesting