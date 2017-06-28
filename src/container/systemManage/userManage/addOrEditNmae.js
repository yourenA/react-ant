/**
 * Created by Administrator on 2017/3/24.
 */
import React from 'react';
import {Form, Input,Select} from 'antd';
import {formItemLayout} from './../../../common/common'
const Option = Select.Option;
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
                            label={'名称'}
                            {...formItemLayout}>
                            {getFieldDecorator('name', {
                                initialValue: this.props.isEdit ? this.props.editRecord.name : '',
                                rules: [{required: true, message: `请输入名称`}],
                            })(
                                <Input  />
                            )}
                        </FormItem>
                        <FormItem
                            label={'用户名'}
                            {...formItemLayout}>
                            {getFieldDecorator('username', {
                                initialValue: this.props.isEdit ? this.props.editRecord.username : '',
                                rules: [{required: true, message: `请输入用户名`}],
                            })(
                                <Input  />
                            )}
                        </FormItem>
                        {
                            localStorage.getItem('userrole')==='系统管理员'
                                ?
                                <FormItem
                                    label="用户组"
                                    {...formItemLayout}>
                                    {getFieldDecorator('role_id', {
                                        initialValue: this.props.isEdit?{key:this.props.editRecord.id.toString(),label:this.props.editRecord.role_name}:{key:'',label:''},
                                        rules: [{required: true, message: '请选择用户组'}],
                                    })(
                                        <Select labelInValue={true} allowClear={true}>
                                            { this.props.fetchTestConf.groups.map((item, key) => {
                                                return (
                                                    <Option key={item.id} value={item.id.toString()}>{item.display_name}</Option>
                                                )
                                            }) }
                                        </Select>
                                    )}
                                </FormItem>
                                :null
                        }

                    </div>
            </Form>
        );
    }
}

const WrappedForm = Form.create()(AddOrEditNameForm);
export default WrappedForm;
