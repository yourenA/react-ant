/**
 * Created by Administrator on 2017/3/24.
 */
import React from 'react';
import {Form,  Select} from 'antd';
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
                            <Select labelInValue={true} onChange={this.changeProduct}
                                    dropdownMatchSelectWidth={false}
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {  this.props.fetchTestConf.script.length === 0 ? null :  this.props.fetchTestConf.script.map((item, key) => {
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
                            <Select labelInValue={true} onChange={this.changeProduct}
                                    dropdownMatchSelectWidth={false}
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {  this.props.fetchTestConf.test_stands.length === 0 ? null : this.props.fetchTestConf.test_stands.map((item, key) => {
                                    return (
                                        <Option key={item.id}
                                                value={item.id.toString()}>{item.name}</Option>
                                    )
                                }) }
                            </Select>
                        )}
                    </FormItem>
                    :null}
                {this.props.type==='adapter'?
                    <FormItem>
                        {getFieldDecorator('adapter', {
                            initialValue: this.props.selectedAdapter,
                            rules: [{required: true, message: '请选择适配器'}],
                        })(
                            <Select labelInValue={true} onChange={this.changeProduct}
                                    dropdownMatchSelectWidth={false}
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                { this.props.adapter.length === 0 ? null : this.props.adapter.map((item, key) => {
                                    return (
                                        <Option key={item.index}
                                                value={item.index.toString()}>{item.name}</Option>
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
