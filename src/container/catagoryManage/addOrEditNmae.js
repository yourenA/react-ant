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
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                {this.props.type === '/companies' ?
                    <div>
                        <FormItem
                            label={'制造商名称'}
                            {...formItemLayout}>
                            {getFieldDecorator('name', {
                                initialValue: this.props.isEdit ? this.props.editRecord.name : '',
                                rules: [{required: true, message: `请输入制造厂名称`}],
                            })(
                                <Input  />
                            )}
                        </FormItem>
                        <FormItem
                            label={'制造商编码'}
                            {...formItemLayout}>
                            {getFieldDecorator('code', {
                                initialValue: this.props.isEdit ? this.props.editRecord.code : '',
                                rules: [{required: true, message: `请输入制造厂编码`}],
                            })(
                                <Input  />
                            )}
                        </FormItem>
                        <FormItem
                            label={'制造商电话'}
                            {...formItemLayout}>
                            {getFieldDecorator('telephone', {
                                initialValue: this.props.isEdit ? this.props.editRecord.telephone : '',
                            })(
                                <Input  />
                            )}
                        </FormItem>
                        <FormItem
                            label={'制造商地址'}
                            {...formItemLayout}>
                            {getFieldDecorator('address', {
                                initialValue: this.props.isEdit ? this.props.editRecord.address : '',
                            })(
                                <Input  />
                            )}
                        </FormItem>
                        <FormItem
                            label={'描述'}
                            {...formItemLayout}>
                            {getFieldDecorator('description', {
                                initialValue: this.props.isEdit ? this.props.editRecord.description : '',
                            })(
                                <Input  type="textarea" rows={3} />
                            )}
                        </FormItem>

                    </div>
                    : null}
                {this.props.type === '/products' ?
                    <div>
                        <FormItem
                            label={'产品代码'}
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
                            label="产品名称"
                            {...formItemLayout}>
                            {getFieldDecorator('product_id', {
                                initialValue: this.props.isEdit?{key:this.props.editRecord.product_id.toString(),label:this.props.editRecord.product_name}:{key:'',label:''},
                                rules: [{required: true, message: '请选择产品名称'}],
                            })(
                                <Select labelInValue={true} allowClear={true}>
                                    { this.props.fetchTestConf.products.map((item, key) => {
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
                        {
                            localStorage.getItem('userrole')==='系统管理员'?
                                <FormItem
                                    label="厂商名称"
                                    {...formItemLayout}>
                                    {getFieldDecorator('company_id', {
                                        initialValue: this.props.isEdit?{key:this.props.editRecord.company_id.toString(),label:this.props.editRecord.company_name}:{key:'',label:''},
                                        rules: [{required: true, message: '请选择厂商'}],
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
                                :null
                        }

                    </div>
                    : null}
            </Form>
        );
    }
}

const WrappedForm = Form.create()(AddOrEditNameForm);
export default WrappedForm;
