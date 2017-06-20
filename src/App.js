import React, {Component} from 'react';
import {Layout, Menu} from 'antd';
import {
    BrowserRouter as Router,
    Route,
    NavLink,
    Redirect
} from 'react-router-dom';
import Nopermission from './container/nopermission';
import Home from './container/home';
import HardwareTest from './container/hardwareTest/index';
import HardwareTesting from './container/hardwareTest/hardwareTesting';
import ScriptManage from './container/scriptManage/index';
import DrawScript from './container/scriptManage/drawScript';
import CatagoryManage from './container/catagoryManage/index';
// import About from './container/about';
// import Topics from './container/topics';
import Login from './container/login';
import Register from './container/register';
import './App.less';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as loginAction from './actions/login';
import {testPermission} from './common/common'
const {Header} = Layout;
const SubMenu = Menu.SubMenu;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pathname: ''
        }
    }

    componentWillMount() {
        console.log(window.location.pathname);
        if (window.location.pathname.indexOf('topics') >= 0) {
            this.setState({
                pathname: '/topics'
            })
        } else {
            this.setState({
                pathname: window.location.pathname
            })
        }

    }

    handleClick = (e) => {
        this.setState({
            pathname: e.key,
        });
        if (e.key === '/signout') {
            this.props.signout();
        }
    }

    render() {
        const login=this.props.loginState
        return (
            <Router>
                <div>
                    <div className="layout">
                        <Header className="layout-header">
                            <div className="logo"/>
                            <Menu
                                onClick={this.handleClick}
                                theme="dark"
                                mode="horizontal"
                                defaultSelectedKeys={[this.state.pathname]}
                                style={{lineHeight: '64px'}}
                            >
                                {/*'/'的navlink 需要添加exact才不会选其他的时候默认将‘/’也变高亮*/}
                                <Menu.Item key="/"><NavLink exact activeClassName="nav-selected"
                                                            to="/">主页</NavLink></Menu.Item>
                                <Menu.Item key="/hardwareTest"><NavLink activeClassName="nav-selected"
                                                                        to="/hardwareTest">硬件测试</NavLink></Menu.Item>
                                <Menu.Item key="/scriptManage"><NavLink activeClassName="nav-selected"
                                                                        to="/scriptManage">脚本管理</NavLink></Menu.Item>
                                <SubMenu title={<span>分类管理</span>}>
                                    <Menu.Item key="/products"><NavLink activeClassName="nav-selected"
                                                                          to="/products">产品管理</NavLink></Menu.Item>
                                    <Menu.Item key="/test_types"><NavLink activeClassName="nav-selected"
                                                                                to="/test_types">测试类型</NavLink></Menu.Item>
                                    <Menu.Item key="/hardware_versions"><NavLink activeClassName="nav-selected"
                                                                              to="/hardware_versions">硬件版本</NavLink></Menu.Item>
                                    <Menu.Item key="/parts"><NavLink activeClassName="nav-selected"
                                                                     to="/parts">测试部件</NavLink></Menu.Item>
                                    <Menu.Item key="/test_stands"><NavLink activeClassName="nav-selected"
                                                                     to="/test_stands">测试架</NavLink></Menu.Item>
                                </SubMenu>
                                {/*<Menu.Item key="/about"><NavLink activeClassName="nav-selected"
                                                                 to="/about">About</NavLink></Menu.Item>
                                <Menu.Item key="/topics"><NavLink activeClassName="nav-selected" to="/topics/option1">Topics</NavLink></Menu.Item>*/}
                                {login.login ?
                                    <SubMenu className="float-right" title={<span>{login.username}  </span>}>
                                        <Menu.Item key="/changeUser"><NavLink activeClassName="nav-selected"
                                                                              to="/login">切换账号</NavLink></Menu.Item>
                                        <Menu.Item key="/signout">退出</Menu.Item>
                                    </SubMenu>
                                    : <SubMenu className="float-right"  title={<span>登录/注册</span>}>
                                    <Menu.Item key="/login"><NavLink activeClassName="nav-selected"
                                                                     to="/login">登录</NavLink></Menu.Item>
                                    <Menu.Item key="/register"><NavLink activeClassName="nav-selected"
                                                                        to="/register">注册</NavLink></Menu.Item>
                                </SubMenu>}

                            </Menu>
                        </Header>
                    </div>

                    <Route exact path="/" component={Home}/>
                    <Route exact
                           path="/hardwareTest" render={(props) => {
                        return (login.login && testPermission('script_test') )?
                            <HardwareTest {...props}/> :login.login? <Nopermission/> : <Redirect to={{pathname: '/login',state: { from: props.location} }}/>;
                    }}/>
                    <Route path="/hardwareTest/:uuid" render={(props) => {
                        return (login.login && testPermission('script_test') ) ?
                            <HardwareTesting {...props}/> :login.login? <Nopermission/> : <Redirect to={{pathname: '/login',state: { from: props.location} }}/>;
                    }}/>
                    {/*<Route path="/about" component={About}/>*/}
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                    <Route exact
                        path="/scriptManage" render={(props) => {
                        return (login.login && testPermission('script_management') ) ?
                            <ScriptManage {...props}/> :login.login? <Nopermission/> : <Redirect to={{pathname: '/login',state: { from: props.location} }}/>;
                    }}/>
                    <Route
                        path="/scriptManage/:id" render={(props) => {
                        return (login.login && testPermission('script_management') ) ?
                            <DrawScript {...props}/> :login.login? <Nopermission/> : <Redirect to={{pathname: '/login',state: { from: props.location} }}/>;
                    }}/>
                   {/* <Route
                        path="/topics/option1" render={(props) => {
                        return login.login ?
                            <Topics {...props}/> :login.login? <Nopermission/> : <Redirect to={{pathname: '/login',state: { from: props.location} }}/>;
                    }}/>*/}
                    <Route
                        path="/products" render={(props) => {
                        return (login.login && testPermission('product_management') ) ?
                            <CatagoryManage {...props}/> :login.login? <Nopermission/> : <Redirect to={{pathname: '/login',state: { from: props.location} }}/>;
                    }}/>
                    <Route
                        path="/test_types" render={(props) => {
                        return (login.login && testPermission('test_type_management') )  ?
                            <CatagoryManage  {...props}/> : login.login? <Nopermission/> :<Redirect to={{pathname: '/login',state: { from: props.location} }}/>;
                    }}/>
                    <Route
                        path="/parts" render={(props) => {
                        return (login.login && testPermission('part_management') ) ?
                            <CatagoryManage  {...props}/> : login.login? <Nopermission/> :<Redirect to={{pathname: '/login',state: { from: props.location} }}/>;
                    }}/>
                    <Route
                        path="/hardware_versions" render={(props) => {
                        return (login.login && testPermission('hardware_version_management') ) ?
                            <CatagoryManage  {...props}/> :login.login? <Nopermission/> : <Redirect to={{pathname: '/login',state: { from: props.location} }}/>;
                    }}/>
                    <Route
                        path="/test_stands" render={(props) => {
                        return (login.login && testPermission('test_stand_management') )?
                            <CatagoryManage  {...props}/> : login.login? <Nopermission/> :<Redirect to={{pathname: '/login',state: { from: props.location} }}/>;
                    }}/>


                </div>
            </Router>
        );
    }
}
function mapStateToProps(state){
    return {
        loginState:state.login,
    };
}
function mapDispatchToProps(dispath) {
    return bindActionCreators(loginAction, dispath);
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
