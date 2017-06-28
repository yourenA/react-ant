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
                            label={'新密码'}
                            {...formItemLayout}>
                            {getFieldDecorator('new_password', {
                                initialValue:  '',
                                rules: [{required: true, message: `请输入新密码`}],
                            })(
                                <Input   type="password" />
                            )}
                        </FormItem>
                        <FormItem
                            label={'确认密码'}
                            {...formItemLayout}>
                            {getFieldDecorator('new_password_confirmation', {
                                initialValue:  '',
                                rules: [{required: true, message: `请输入确认密码`}],
                            })(
                                <Input  type="password"/>
                            )}
                        </FormItem>
                    </div>
            </Form>
        );
    }
}

const WrappedForm = Form.create()(AddOrEditNameForm);
export default WrappedForm;
