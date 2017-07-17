/**
 * Created by Administrator on 2017/3/27.
 */
import React, {Component} from 'react';
import {Form, Input, Button, message,Breadcrumb,Layout} from 'antd';
import axios from 'axios';
import messageJson from './../../../common/message.json';
import configJson from './../../../common/config.json';
import {getHeader, converErrorCodeToMsg} from './../../../common/common.js';
import {formItemLayout} from './../../../common/common';
const FormItem = Form.Item;
const {Content,} = Layout;
class EditPassword extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        const {form} = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                axios({
                    url: `${configJson.prefix}/password/`,
                    method: 'put',
                    data: values,
                    headers: getHeader()
                })
                    .then(function (response) {
                        console.log(response);
                        message.success(messageJson['edit password success']);
                        form.setFieldsValue({
                            old_password: '',
                            new_password: '',
                            new_password_confirmation: ''
                        });
                    })
                    .catch(function (error) {
                        converErrorCodeToMsg(error)
                    });
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Layout style={{padding: '0 24px 24px'}}>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>用户设置</Breadcrumb.Item>
                    <Breadcrumb.Item>用户信息</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
                    <Form onSubmit={this.handleSubmit} style={{width:'400px'}}>
                        <FormItem
                            label="用户名"
                            {...formItemLayout}>
                            {getFieldDecorator('username', {
                                initialValue: localStorage.getItem('username') || sessionStorage.getItem('username')
                            })(
                                <Input disabled={true}/>
                            )}
                        </FormItem>
                        <FormItem
                            label="原密码"
                            {...formItemLayout}>
                            {getFieldDecorator('old_password', {})(
                                <Input type="password"/>
                            )}
                        </FormItem>
                        <FormItem
                            label="新密码"
                            {...formItemLayout}>
                            {getFieldDecorator('new_password', {})(
                                <Input type="password"/>
                            )}
                        </FormItem>
                        <FormItem
                            label="重复新密码"
                            {...formItemLayout}>
                            {getFieldDecorator('new_password_confirmation', {})(
                                <Input type="password"/>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" style={{width: '100%'}} htmlType="submit"
                                    className="login-form-button">
                                确定修改密码
                            </Button>
                        </FormItem>
                    </Form>
                </Content>
            </Layout>

        );
    }
}

const EditPasswordWrap = Form.create()(EditPassword);

export default EditPasswordWrap;