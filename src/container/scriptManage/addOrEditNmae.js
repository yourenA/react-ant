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
        this.state = {
        };
    }

    componentDidMount() {
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
                                <Select labelInValue={true} allowClear={true}>
                                    { this.props.fetchTestConf.test_type.map((item, key) => {
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
                            {getFieldDecorator('hardware_version_id', {
                                initialValue: this.props.editRecord ? {key:this.props.editRecord.hardware_version_id.toString(),label:this.props.editRecord.hardware_version}:{key:'',label:''},
                                rules: [{required: true, message: '请选择硬件版本'}],
                            })(
                                <Select labelInValue={true} allowClear={true}>
                                    { this.props.fetchTestConf.hardware_versions.map((item, key) => {
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
