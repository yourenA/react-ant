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
import About from './container/about'
import HardwareTest from './container/hardwareTest/index';
import HardwareTesting from './container/hardwareTest/hardwareTesting';
import ProductionManage from './container/productionManage/index';
import AddOrEditBatch from './container/productionManage/addOrEditBatch';
import SerialNumber from './container/productionManage/serialNumber';
import ScriptManage from './container/scriptManage/index';
import DrawScript from './container/scriptManage/drawScript';
import SegmentManage from './container/scriptManage/segmentManage';
import ScriptDetail from './container/scriptManage/drawScriptDetail';
import DrawSegmentDetail from './container/scriptManage/drawSegmentDetail';
import DrawSegment from './container/scriptManage/drawSegment';
import CatagoryManage from './container/catagoryManage/index';
import SystemManage from './container/systemManage/index';
import UserConfig from './container/userConfig/index';
import Login from './container/login';
import Register from './container/register';
import SystemJournalModal from './component/systemJournalModal'
import './App.less';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as loginAction from './actions/login';
import {testPermission} from './common/common'
import configJson from 'configJson' ;
const {Header} = Layout;
const SubMenu = Menu.SubMenu;

class App extends Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            pathname: '',
            systemJournalModal: false,
            systemJournalInfo: [{
                info: '无效Product Code: 00.000000',
                dateTime: new Date().toLocaleString()
            }, {
                info: '无效Product Code: 00.01200011',
                dateTime: new Date().toLocaleString()
            }]
        }
    }

    componentWillMount() {
        if (window.location.pathname.indexOf('systemManage') >= 0) {
            this.setState({
                pathname: '/systemManage'
            })
        } else {
            this.setState({
                pathname: window.location.pathname
            })
        }

    }

    handleClick = (e) => {
        if (e.key === 'systemJournal') {
            this.refs.SystemJournalModal.setSystemJournalModalTrue()
        } else {
            this.setState({
                pathname: e.key,
            });
            if (e.key === '/signout') {
                this.props.signout();
            }
        }
    }
    render() {
        const login = this.props.loginState;
        return (
            <Router>
                <div>
                    <Route exact
                           path="/about" render={(props) => {
                        return (login.login && testPermission('test_script_management') ) ?
                            <About {...props}/> : login.login ? <Nopermission/> :
                            <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
                    }}/>
                    <div className="layout" style={{display:this.state.pathname==='/about'?'none':'block'}}>
                        <Header className="layout-header" style={{minWidth:'1000px'}}>
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
                                {
                                    (login.login && testPermission('hardware_testing') ) ?
                                        <Menu.Item key="/hardwareTest"><NavLink activeClassName="nav-selected"
                                                                                to="/hardwareTest">硬件测试</NavLink></Menu.Item>
                                        : null
                                }
                                {
                                    (login.login && testPermission('production_management') ) ?
                                        <Menu.Item key="/productionManagement"><NavLink activeClassName="nav-selected"
                                                                                        to="/productionManagement">生产管理</NavLink></Menu.Item>
                                        : null
                                }
                                {
                                    (login.login && testPermission('test_script_management') ) ?
                                        <SubMenu title={<span>脚本管理</span>}>
                                            <Menu.Item key="/scriptManage"><NavLink activeClassName="nav-selected"
                                                                                    to="/scriptManage">脚本管理</NavLink></Menu.Item>
                                            <Menu.Item key="/segmentManage"><NavLink activeClassName="nav-selected"
                                                                                     to="/segmentManage">脚本段管理</NavLink></Menu.Item>
                                        {/*    <Menu.Item key="/about"><NavLink target="_blank" activeClassName="nav-selected"
                                                                                     to="/about">流程图使用说明</NavLink></Menu.Item>*/}
                                        </SubMenu>
                                        : null
                                }
                                {
                                    (login.login && testPermission('test_stand_management') ) ?
                                        <SubMenu title={<span>分类管理</span>}>
                                            {testPermission('company_management') ?
                                                <Menu.Item key="/companies"><NavLink activeClassName="nav-selected"
                                                                                     to="/companies">制造厂商</NavLink></Menu.Item>
                                                : null
                                            }
                                            {testPermission('product_management') ?
                                                <Menu.Item key="/products"><NavLink activeClassName="nav-selected"
                                                                                    to="/products">产品管理</NavLink></Menu.Item>
                                                : null
                                            }
                                            {testPermission('product_management') ?
                                                <Menu.Item key="/test_types"><NavLink activeClassName="nav-selected"
                                                                                      to="/test_types">测试类型</NavLink></Menu.Item>
                                                : null
                                            }
                                            {testPermission('product_management') ?
                                                <Menu.Item key="/hardware_versions"><NavLink
                                                    activeClassName="nav-selected"
                                                    to="/hardware_versions">硬件版本</NavLink></Menu.Item>
                                                : null
                                            }
                                            {testPermission('test_stand_management') ?
                                                <Menu.Item key="/test_stands"><NavLink activeClassName="nav-selected"
                                                                                       to="/test_stands">测试架</NavLink></Menu.Item>
                                                : null
                                            }
                                        </SubMenu>
                                        : null
                                }
                                {  (login.login && (testPermission('user_management')||testPermission('system_management')) ) ?
                                <Menu.Item key="/systemManage"><NavLink activeClassName="nav-selected"
                                                                        to="/systemManage/groupManage">系统管理</NavLink></Menu.Item>: null}
                                {login.login ?
                                    <SubMenu className="float-right" title={<span>{login.username}  </span>}>
                                        <Menu.Item key="/userConfig"><NavLink activeClassName="nav-selected"
                                                                              to="/userConfig/userInfo">用户设置</NavLink></Menu.Item>
                                        <Menu.Item key="/changeUser"><NavLink activeClassName="nav-selected"
                                                                              to="/login">切换账号</NavLink></Menu.Item>
                                        <Menu.Item key="/signout">退出</Menu.Item>
                                    </SubMenu>
                                    : <SubMenu className="float-right" title={<span>登录/注册</span>}>
                                    <Menu.Item key="/login"><NavLink activeClassName="nav-selected"
                                                                     to="/login">登录</NavLink></Menu.Item>
                                    <Menu.Item key="/register"><NavLink activeClassName="nav-selected"
                                                                        to="/register">注册</NavLink></Menu.Item>
                                </SubMenu>}
                                {login.login ?
                                    <Menu.Item key="systemJournal"
                                               className="systemJournal-nav">系统日志</Menu.Item> : null}
                            </Menu>
                        </Header>
                        <SystemJournalModal systemJournalModal={this.state.systemJournalModal}
                                            ref="SystemJournalModal"/>
                    </div>

                    <Route exact path="/" component={Home}/>
                    <Route exact
                           path="/hardwareTest" render={(props) => {
                        return (login.login && testPermission('hardware_testing') ) ?
                            <HardwareTest {...props}/> : login.login ? <Nopermission/> :
                            <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
                    }}/>
                    <Route path="/hardwareTest/:uuid" render={(props) => {
                        return (login.login && testPermission('hardware_testing') ) ?
                            <HardwareTesting {...props}/> : login.login ? <Nopermission/> :
                            <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
                    }}/>
                    <Route  exact path="/productionManagement" render={(props) => {
                        return (login.login && testPermission('production_management') ) ?
                            <ProductionManage {...props}/> : login.login ? <Nopermission/> :
                            <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
                    }}/>
                    <Route  exact  path="/productionManagement/:id" render={(props) => {
                        return (login.login && testPermission('production_management') ) ?
                            <AddOrEditBatch {...props}/> : login.login ? <Nopermission/> :
                            <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
                    }}/>
                    <Route  path="/productionManagement/:id/serialNumbers" render={(props) => {
                        return (login.login && testPermission('production_management') ) ?
                            <SerialNumber {...props}/> : login.login ? <Nopermission/> :
                            <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
                    }}/>


                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                    <Route exact
                           path="/scriptManage" render={(props) => {
                        return (login.login && testPermission('test_script_management') ) ?
                            <ScriptManage {...props}/> : login.login ? <Nopermission/> :
                            <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
                    }}/>
                    <Route
                        path="/scriptManage/:id" render={(props) => {
                        return (login.login && testPermission('test_script_management') ) ?
                            <DrawScript {...props}/> : login.login ? <Nopermission/> :
                            <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
                    }}/>

                    <Route
                        path="/scriptDetail/:id" render={(props) => {
                        return (login.login && testPermission('test_script_management') ) ?
                            <ScriptDetail {...props}/> : login.login ? <Nopermission/> :
                            <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
                    }}/>

                    <Route exact
                           path="/segmentManage" render={(props) => {
                        return (login.login && testPermission('test_script_management') ) ?
                            <SegmentManage {...props}/> : login.login ? <Nopermission/> :
                            <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
                    }}/>

                    <Route
                        path="/segmentManage/:id" render={(props) => {
                        return (login.login && testPermission('test_script_management') ) ?
                            <DrawSegment {...props}/> : login.login ? <Nopermission/> :
                            <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
                    }}/>
                    <Route
                        path="/segmentDetail/:id" render={(props) => {
                        return (login.login && testPermission('test_script_management') ) ?
                            <DrawSegmentDetail {...props}/> : login.login ? <Nopermission/> :
                            <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
                    }}/>
                    <Route
                        path="/systemManage" render={(props) => {
                        return login.login ?
                            <SystemManage {...props}/> : login.login ? <Nopermission/> :
                            <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
                    }}/>
                    <Route
                        path="/userConfig" render={(props) => {
                        return login.login ?
                            <UserConfig {...props}/> : login.login ? <Nopermission/> :
                            <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
                    }}/>
                    <Route
                        path="/companies" render={(props) => {
                        return (login.login && testPermission('company_management') ) ?
                            <CatagoryManage {...props}/> : login.login ? <Nopermission/> :
                            <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
                    }}/>
                    <Route
                        path="/products" render={(props) => {
                        return (login.login && testPermission('product_management') ) ?
                            <CatagoryManage {...props}/> : login.login ? <Nopermission/> :
                            <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
                    }}/>
                    <Route
                        path="/test_types" render={(props) => {
                        return (login.login && testPermission('product_management') ) ?
                            <CatagoryManage  {...props}/> : login.login ? <Nopermission/> :
                            <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
                    }}/>
                    <Route
                        path="/hardware_versions" render={(props) => {
                        return (login.login && testPermission('product_management') ) ?
                            <CatagoryManage  {...props}/> : login.login ? <Nopermission/> :
                            <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
                    }}/>
                    <Route
                        path="/test_stands" render={(props) => {
                        return (login.login && testPermission('test_stand_management') ) ?
                            <CatagoryManage  {...props}/> : login.login ? <Nopermission/> :
                            <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
                    }}/>


                </div>

            </Router>
        );
    }
}
function mapStateToProps(state) {
    return {
        loginState: state.login,
    };
}
function mapDispatchToProps(dispath) {
    return bindActionCreators(loginAction, dispath);
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
