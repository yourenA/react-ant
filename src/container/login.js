/**
 * Created by Administrator on 2017/6/13.
 */
import React from 'react';
import {Form, Icon, Input, Button,Layout,Breadcrumb} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    withRouter
} from 'react-router-dom';
import * as loginAction from './../actions/login';
import './login.less'
const FormItem = Form.Item;
const {Content,} = Layout;
class NormalLoginForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const from=this.props.history.location.state?this.props.history.location.state.from.pathname:'/';
                this.props.login(values,from,this.props.history);
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Content className="content">
                <Breadcrumb className="breadcrumb" >
                    <Breadcrumb.Item>登录</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content-container">
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{required: true, message: '请输入用户名!'}],
                            })(
                                <Input prefix={<Icon type="user" style={{fontSize: 15}}/>} placeholder="用户名"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{required: true, message: '请输入密码!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{fontSize: 14}}/>} type="password"
                                       placeholder="密码"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {/*<a className="login-form-forgot" href="">忘记密码</a>*/}
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                            {/*还没有账号吗? <Link to="/register">现在注册!</Link>*/}
                        </FormItem>
                    </Form>
                </div>
            </Content>

        );
    }
}

function mapStateToProps(state){
    return {
        state:state,
    };
}
function mapDispatchToProps(dispath){
    return bindActionCreators(loginAction,dispath);
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(WrappedNormalLoginForm));