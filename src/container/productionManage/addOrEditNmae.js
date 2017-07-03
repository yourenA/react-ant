/**
 * Created by Administrator on 2017/3/24.
 */
import React from 'react';
import {Form, Input, Select} from 'antd';
import {formItemLayout} from './../../common/common'
const FormItem = Form.Item;
const Option = Select.Option;
class AddOrEditNameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log('componentDidMount');
        this.props.isEdit ? this.props.fetchAllHardwareVersions(this.props.editRecord.product_id)  : null
        this.props.isEdit ? this.props.fetchAllScript(this.props.editRecord.hardware_version_id)  : null
    }

    changeProduct = (e)=> {
        console.log(e)
        this.props.fetchAllHardwareVersions(e.key)
    }
    changeHardwareVersion = (e)=> {
        console.log(e)
        this.props.fetchAllScript(e.key)
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
                            initialValue: this.props.isEdit ? {
                                key: this.props.editRecord.product_id.toString(),
                                label: this.props.editRecord.product_code
                            } : {key: '', label: ''},
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
                            initialValue: this.props.isEdit ? {
                                key: this.props.editRecord.hardware_version_id.toString(),
                                label: this.props.editRecord.hardware_version
                            } : {key: '', label: ''},
                            rules: [{required: true, message: '请选择硬件版本'}],
                        })(
                            <Select labelInValue={true} allowClear={true} onChange={this.changeHardwareVersion}>
                                { this.props.fetchTestConf.hardware_versions.map((item, key) => {
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
                            initialValue: this.props.isEdit ? {
                                key: this.props.editRecord.default_test_script_id.toString(),
                                label: this.props.editRecord.default_test_script_name
                            } : {key: '', label: ''},
                        })(
                            <Select labelInValue={true} allowClear={true}>
                                { this.props.fetchTestConf.script.map((item, key) => {
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
                            initialValue: this.props.isEdit ? {
                                key: this.props.editRecord.company_id.toString(),
                                label: this.props.editRecord.company_name
                            } : {key: '', label: ''},
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
                            initialValue: this.props.isEdit ? this.props.editRecord.description : '',
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
