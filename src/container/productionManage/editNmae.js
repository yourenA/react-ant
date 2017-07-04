/**
 * Created by Administrator on 2017/3/24.
 */
import React from 'react';
import {Form, Input, Select} from 'antd';
import {formItemLayout} from './../../common/common'
import {getHeader} from './../../common/common.js';
import configJson from './../../common/config.json';
import axios from 'axios';
const FormItem = Form.Item;
const Option = Select.Option;
class AddOrEditNameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hardware_versions: [],
            script: []
        };
    }

    componentDidMount() {
        console.log('componentDidMount');
        this.fetchAllHardwareVersions(this.props.editRecord.product_id);
        this.fetchAllScript(this.props.editRecord.hardware_version_id);
    }

    changeProduct = (e)=> {
        this.fetchAllHardwareVersions(e.key)
    }
    changeHardwareVersion = (e)=> {
        this.fetchAllScript(e.key)
    }
    fetchAllHardwareVersions = (product_id)=> {
        const that = this;
        axios({
            url: `${configJson.prefix}/hardware_versions`,
            method: 'get',
            params: {
                product_id: product_id || '',
                return: 'all'
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log("response", response)
                that.setState({
                    hardware_versions: response.data.data
                })
            })
            .catch(function (error) {
                console.log('获取出错', error)
            });
    }
    fetchAllScript = (hardware_version_id)=> {
        const that = this;
        axios({
            url: `${configJson.prefix}/test_scripts`,
            method: 'get',
            params: {
                hardware_version_id: hardware_version_id || '',
                return: 'all'
            },
            headers: getHeader()
        })
            .then(function (response) {
                that.setState({
                    script: response.data.data
                })
            })
            .catch(function (error) {
                console.log('获取出错', error)
            });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <div>
                    <FormItem
                        label="产品代码"
                        {...formItemLayout}>
                        {getFieldDecorator('product_id', {
                            initialValue: {
                                key: this.props.editRecord.product_id.toString(),
                                label: this.props.editRecord.product_code
                            },
                            rules: [{required: true, message: '请选择产品代码'}],
                        })(
                            <Select labelInValue={true} allowClear={true} onChange={this.changeProduct}>
                                { this.props.fetchTestConf.products.map((item, key) => {
                                    return (
                                        <Option key={item.id} value={item.id.toString()}>{item.code}</Option>
                                    )
                                }) }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        label="硬件版本"
                        {...formItemLayout}>
                        {getFieldDecorator('hardware_version_id', {
                            initialValue: {
                                key: this.props.editRecord.hardware_version_id.toString(),
                                label: this.props.editRecord.hardware_version
                            },
                            rules: [{required: true, message: '请选择硬件版本'}],
                        })(
                            <Select labelInValue={true} allowClear={true} onChange={this.changeHardwareVersion}>
                                { this.state.hardware_versions.map((item, key) => {
                                    return (
                                        <Option key={item.id} value={item.id.toString()}>{item.version}</Option>
                                    )
                                }) }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        label="脚本名称"
                        {...formItemLayout}>
                        {getFieldDecorator('default_test_script_id', {
                            initialValue: {
                                key: this.props.editRecord.default_test_script_id.toString(),
                                label: this.props.editRecord.default_test_script_name
                            },
                        })(
                            <Select labelInValue={true} allowClear={true}>
                                { this.state.script.map((item, key) => {
                                    return (
                                        <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                                    )
                                }) }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        label="制造厂商"
                        {...formItemLayout}>
                        {getFieldDecorator('company_id', {
                            initialValue: {
                                key: this.props.editRecord.company_id.toString(),
                                label: this.props.editRecord.company_name
                            },
                            rules: [{required: true, message: '请选择制造厂商'}],
                        })(
                            <Select labelInValue={true} allowClear={true}>
                                { this.props.fetchTestConf.manufactures.map((item, key) => {
                                    return (
                                        <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                                    )
                                }) }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        label="说明描述"
                        {...formItemLayout}>
                        {getFieldDecorator('description', {
                            initialValue:  this.props.editRecord.description ,
                        })(
                            <Input type="textarea" rows={4}/>
                        )}
                    </FormItem>
                </div>
            </Form>
        );
    }
}

const WrappedForm = Form.create()(AddOrEditNameForm);
export default WrappedForm;
