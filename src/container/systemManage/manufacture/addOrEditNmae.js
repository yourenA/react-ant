/**
 * Created by Administrator on 2017/3/24.
 */
import React from 'react';
import {Form, Input} from 'antd';
import {formItemLayout} from './../../../common/common'

const FormItem = Form.Item;

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
            </Form>
        );
    }
}

const WrappedForm = Form.create()(AddOrEditNameForm);
export default WrappedForm;
