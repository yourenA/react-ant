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
            partNameArr: [],
        };
    }

    componentDidMount() {
        const that=this;
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
                partNameArr:response.data.data
            })
        }).catch(function (error) {
            console.log('获取出错', error);
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                {this.props.type === '/products' ?
                    <div>
                        <FormItem
                            label={'产品编号'}
                            {...formItemLayout}>
                            {getFieldDecorator('code', {
                                initialValue: this.props.isEdit ? this.props.editRecord.code : '',
                                rules: [{required: true, message: `请输入产品编号`}],
                            })(
                                <Input  />
                            )}
                        </FormItem>
                        <FormItem
                            label='产品名称'
                            {...formItemLayout}>
                            {getFieldDecorator('name', {
                                initialValue: this.props.isEdit ? this.props.editRecord.name : '',
                                rules: [{required: true, message: '请输入产品名称'}],
                            })(
                                <Input  />
                            )}
                        </FormItem>
                        <FormItem
                            label="部件名称"
                            {...formItemLayout}>
                            {getFieldDecorator('part_id', {
                                initialValue: this.props.isEdit ? {key:this.props.editRecord.part_id.toString(),label:this.props.editRecord.part_name} : {key:'',label:''},
                                rules: [{required: true, message: '请输入部件名称'}],
                            })(
                                <Select labelInValue={true} allowClear={true}>
                                    { this.state.partNameArr.map((item, key) => {
                                        return (
                                            <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                                        )
                                    }) }
                                </Select>
                            )}
                        </FormItem>
                    </div>
                    : null}
                {this.props.type === '/test_types' ?
                    <div>
                        <FormItem
                            label={'测试类型'}
                            {...formItemLayout}>
                            {getFieldDecorator('name', {
                                initialValue: this.props.isEdit ? this.props.editRecord.name : '',
                                rules: [{required: true, message: `请输入测试类型`}],
                            })(
                                <Input  />
                            )}
                        </FormItem>
                    </div>
                    : null}
                {this.props.type === '/parts'  ?
                    <div>
                        <FormItem
                            label='部件名称'
                            {...formItemLayout}>
                            {getFieldDecorator('name', {
                                initialValue: this.props.isEdit ? this.props.editRecord.name : '',
                                rules: [{required: true, message: '请输入部件名称'}],
                            })(
                                <Input  />
                            )}
                        </FormItem>
                    </div>
                    : null}
                {this.props.type === '/hardware_versions' ?
                    <div>
                        <FormItem
                            label='硬件版本'
                            {...formItemLayout}>
                            {getFieldDecorator('version', {
                                initialValue: this.props.isEdit ? this.props.editRecord.version : '',
                                rules: [{required: true, message: '请输入硬件版本'}],
                            })(
                                <Input  />
                            )}
                        </FormItem>
                        <FormItem
                            label="部件名称"
                            {...formItemLayout}>
                            {getFieldDecorator('part_id', {
                                initialValue: this.props.isEdit ? {key:this.props.editRecord.part_id.toString(),label:this.props.editRecord.part_name} : {key:'',label:''},
                                rules: [{required: true, message: '请输入部件名称'}],
                            })(
                                <Select labelInValue={true} allowClear={true}>
                                    { this.state.partNameArr.map((item, key) => {
                                        return (
                                            <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                                        )
                                    }) }
                                </Select>
                            )}
                        </FormItem>
                    </div>
                    : null}
                {this.props.type === '/test_stands'  ?
                    <div>
                        <FormItem
                            label='测试架名称'
                            {...formItemLayout}>
                            {getFieldDecorator('name', {
                                initialValue: this.props.isEdit ? this.props.editRecord.name : '',
                                rules: [{required: true, message: '请输入测试架名称'}],
                            })(
                                <Input  />
                            )}
                        </FormItem>
                    </div>
                    : null}
            </Form>
        );
    }
}

const WrappedForm = Form.create()(AddOrEditNameForm);
export default WrappedForm;
