/**
 * Created by Administrator on 2017/3/24.
 */
import React from 'react';
import {Form, Input,Radio} from 'antd';
import {addSeriaNumLayout} from './../../common/common'
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
class AddSeriaNum extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <div>
                    <FormItem
                        label={'产品序列号生成数量'}
                        {...addSeriaNumLayout}>
                        {getFieldDecorator('name', {
                            initialValue: '',
                            rules: [{required: true, message: `请输入产品序列号生成数量`}],
                        })(
                            <Input  />
                        )}
                    </FormItem>
                    <FormItem
                        {...addSeriaNumLayout}
                    >
                        {getFieldDecorator('radio-button',{
                            initialValue: 'a',
                        })(
                            <RadioGroup>
                                <Radio style={radioStyle}  value="a">全新生成 <span className="radio-text">如果之前已生成过，则会清空之前的所有序列号</span></Radio>
                                <Radio style={radioStyle}  value="b">增量生成 <span className="radio-text">如果之前已生成过，则会在后面继续增加新的序列号</span></Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                </div>
            </Form>
        );
    }
}

const WrappedForm = Form.create()(AddSeriaNum);
export default WrappedForm;
