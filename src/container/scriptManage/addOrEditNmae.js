/**
 * Created by Administrator on 2017/3/24.
 */
import React from 'react';
import {Form, Input, Select} from 'antd';
import {formItemLayout} from './../../common/common'
import axios from 'axios'
import configJson from './../../common/config.json';
import {getHeader} from './../../common/common';
const FormItem = Form.Item;
const Option = Select.Option;

class AddOrEditNameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            partsArr: [],
            test_typesArr:[],
            hardware_versionsArr:[]
        };
    }

    componentDidMount() {
        const that = this;
        axios({
            url: `${configJson.prefix}/test_types`,
            method: 'get',
            params: {
                return: 'all'
            },
            headers: getHeader()
        }).then(function (response) {
            console.log(response.data);
            that.setState({
                test_typesArr: response.data.data
            })
        }).catch(function (error) {
            console.log('获取出错', error);
        })
        axios({
            url: `${configJson.prefix}/parts`,
            method: 'get',
            params: {
                return: 'all'
            },
            headers: getHeader()
        }).then(function (response) {
            console.log(response.data);
            that.setState({
                partsArr: response.data.data
            })
        }).catch(function (error) {
            console.log('获取出错', error);
        })
        axios({
            url: `${configJson.prefix}/hardware_versions`,
            method: 'get',
            params: {
                return: 'all'
            },
            headers: getHeader()
        }).then(function (response) {
            console.log(response.data);
            that.setState({
                hardware_versionsArr: response.data.data
            })
        }).catch(function (error) {
            console.log('获取出错', error);
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                    <div>
                        <FormItem
                            label='脚本名称'
                            {...formItemLayout}>
                            {getFieldDecorator('name', {
                                initialValue: this.props.editRecord.version,
                                rules: [{required: true, message: '请输入脚本名称'}],
                            })(
                                <Input  />
                            )}
                        </FormItem>
                        <FormItem
                            label="测试类型"
                            {...formItemLayout}>
                            {getFieldDecorator('testType_id', {
                                initialValue: {key:this.props.editRecord.part_id.toString(),label:this.props.editRecord.part_name},
                                rules: [{required: true, message: '请选择部件名称'}],
                            })(
                                <Select labelInValue={true} allowClear={true}>
                                    { this.state.test_typesArr.map((item, key) => {
                                        return (
                                            <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                                        )
                                    }) }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label="部件名称"
                            {...formItemLayout}>
                            {getFieldDecorator('part_id', {
                                initialValue: {key:this.props.editRecord.part_id.toString(),label:this.props.editRecord.part_name},
                                rules: [{required: true, message: '请选择部件名称'}],
                            })(
                                <Select labelInValue={true} allowClear={true}>
                                    { this.state.partsArr.map((item, key) => {
                                        return (
                                            <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                                        )
                                    }) }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label="硬件版本"
                            {...formItemLayout}>
                            {getFieldDecorator('version_id', {
                                initialValue: {key:this.props.editRecord.part_id.toString(),label:this.props.editRecord.part_name},
                                rules: [{required: true, message: '请选择硬件版本'}],
                            })(
                                <Select labelInValue={true} allowClear={true}>
                                    { this.state.hardware_versionsArr.map((item, key) => {
                                        return (
                                            <Option key={item.id} value={item.id.toString()}>{item.version}</Option>
                                        )
                                    }) }
                                </Select>
                            )}
                        </FormItem>
                    </div>
            </Form>
        );
    }
}

const WrappedForm = Form.create()(AddOrEditNameForm);
export default WrappedForm;
