/**
 * Created by Administrator on 2017/3/24.
 */
import React from 'react';
import {Form, Input, Select} from 'antd';
import {producLayout} from './../../common/common'
const FormItem = Form.Item;
const Option = Select.Option;
class ConfigForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                {this.props.type==='script'?
                    <FormItem>
                        {getFieldDecorator('test_script', {
                            initialValue: this.props.script,
                            rules: [{required: true, message: '请选择测试脚本'}],
                        })(
                            <Select labelInValue={true} onChange={this.changeProduct}>
                                { this.props.fetchTestConf.script.map((item, key) => {
                                    return (
                                        <Option key={item.id}
                                                value={item.id.toString()}>{item.name}</Option>
                                    )
                                }) }
                            </Select>
                        )}
                    </FormItem>
                    :null}
                {this.props.type==='test_stand'?
                    <FormItem>
                        {getFieldDecorator('test_stand', {
                            initialValue: this.props.script,
                            rules: [{required: true, message: '请选择测试架'}],
                        })(
                            <Select labelInValue={true} onChange={this.changeProduct}>
                                { this.props.fetchTestConf.test_stands.map((item, key) => {
                                    return (
                                        <Option key={item.id}
                                                value={item.id.toString()}>{item.name}</Option>
                                    )
                                }) }
                            </Select>
                        )}
                    </FormItem>
                    :null}
            </Form>
        );
    }
}

const WrappedForm = Form.create()(ConfigForm);
export default WrappedForm;
