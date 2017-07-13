/**
 * Created by Administrator on 2017/3/24.
 */
import React from 'react';
import { Form, Radio, Input} from 'antd';
import {formItemLayout} from './../../common/common'
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
class AddSeriaNumForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem
                    label={'序列号'}
                    {...formItemLayout}>
                    {getFieldDecorator('serial_number', {
                        initialValue: '',
                        rules: [{required: true, message: `请输入制造厂名称`}],
                    })(
                        <Input  />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="是否正式数据"
                >
                    {getFieldDecorator('is_permanent',{ initialValue:'-1',})(
                        <RadioGroup>
                            <Radio value="1">正式数据</Radio>
                            <Radio value="-1">临时数据</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
            </Form>
        );
    }
}
const AddSeriaNum = Form.create()(AddSeriaNumForm);
export default AddSeriaNum;
