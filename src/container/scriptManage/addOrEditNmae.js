/**
 * Created by Administrator on 2017/3/24.
 */
import React from 'react';
import {Form, Input, Select} from 'antd';
import {formItemLayout} from './../../common/common'
import {getHeader} from './../../common/common.js';
import configJson from 'configJson' ;
import axios from 'axios';
const FormItem = Form.Item;
const Option = Select.Option;

class AddOrEditNameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hardware_versions:[]
        };
    }

    componentDidMount() {
        this.props.editRecord ?this.fetchAllHardwareVersions(this.props.editRecord.product_id):null
    }
    changeProduct = (e)=> {
        console.log(e)
        if(e){
            this.props.form.setFieldsValue({
                hardware_version_id: {key:'',label:''},
            });
            this.fetchAllHardwareVersions(e.key)
        }
    }
    fetchAllHardwareVersions=(product_id)=> {
        const that=this;
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
                console.log(response)
                that.setState({
                    hardware_versions: response.data.data
                })
            })
            .catch(function (error) {
                console.log('获取出错', error)
            });
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        // console.log('this.props',this.props)
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                {this.props.isSegment?
                    <div>
                        <FormItem
                            label='脚本名称'
                            {...formItemLayout}>
                            {getFieldDecorator('name', {
                                initialValue: this.props.editRecord ? this.props.editRecord.name:'',
                                rules: [{required: true, message: '请输入脚本段名称'}],
                            })(
                                <Input  />
                            )}
                        </FormItem>
                    </div>
                    :
                    <div>
                        <FormItem
                            label='脚本名称'
                            {...formItemLayout}>
                            {getFieldDecorator('name', {
                                initialValue: this.props.editRecord ?this.props.editRecord.name:'',
                                rules: [{required: true, message: '请输入脚本名称'}],
                            })(
                                <Input  />
                            )}
                        </FormItem>
                        <FormItem
                            label="测试类型"
                            {...formItemLayout}>
                            {getFieldDecorator('test_type_id', {
                                initialValue: this.props.editRecord ?{key:this.props.editRecord.test_type_id.toString(),label:this.props.editRecord.test_type_name}:{key:'',label:''},
                                rules: [{required: true, message: '请选择测试类型'}],
                            })(
                                <Select labelInValue={true}
                                        dropdownMatchSelectWidth={false}
                                        showSearch
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                    { this.props.fetchTestConf.test_type.map((item, key) => {
                                        return (
                                            <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                                        )
                                    }) }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label="产品代码"
                            {...formItemLayout}>
                            {getFieldDecorator('product_id', {
                                initialValue: this.props.editRecord ? {
                                    key: this.props.editRecord.product_id,
                                    label: this.props.editRecord.product_code
                                } : {key: '', label: ''},
                                rules: [{required: true, message: '请选择产品代码'}],
                            })(
                                <Select labelInValue={true}  onChange={this.changeProduct}
                                        dropdownMatchSelectWidth={false}
                                        showSearch
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                    { this.props.fetchTestConf.products.map((item, key) => {
                                        return (
                                            <Option key={item.id}
                                                    value={item.id.toString()}>{item.code}</Option>
                                        )
                                    }) }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label="硬件版本"
                            {...formItemLayout}>
                            {getFieldDecorator('hardware_version_id', {
                                initialValue: this.props.editRecord ? {key:this.props.editRecord.hardware_version_id.toString(),label:this.props.editRecord.hardware_version}:{key:'',label:''},
                                rules: [{required: true, message: '请选择硬件版本'}],
                            })(
                                <Select labelInValue={true}
                                        dropdownMatchSelectWidth={false}
                                        showSearch
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                    { this.state.hardware_versions.map((item, key) => {
                                        return (
                                            <Option key={item.id} value={item.id.toString()}>{item.version}</Option>
                                        )
                                    }) }
                                </Select>
                            )}
                        </FormItem>
                    </div>
                }

            </Form>
        );
    }
}

const WrappedForm = Form.create()(AddOrEditNameForm);
export default WrappedForm;
