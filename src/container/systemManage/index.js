/**
 * Created by Administrator on 2017/6/13.
 */
import React from 'react'
import {
    BrowserRouter as Router,
    Link,
    Route,
} from 'react-router-dom'
import {Layout, Menu, Icon} from 'antd';
import './index.less'
import SystemConfig from './systemConfig/index'
import GroupManage from './groupManage/index'
import UserManage from './userManage/index'
import Nopermission from './../../container/nopermission';
import {testPermission} from './../../common/common'
const {Sider} = Layout;

class SystemManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            pathname: ''
        }
    }

    componentWillMount() {
        console.log(window.location.pathname)
        this.setState({
            pathname: window.location.pathname
        })
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        return (
            <Router>
                <div>
                    <Layout className="layout-sider">
                        <Sider
                            trigger={null}
                            collapsible
                            collapsed={this.state.collapsed}
                            width={200}
                            style={{background: '#fff', minHeight: 'calc(100vh - 64px)', paddingTop: '20px'}}>

                            <Menu
                                mode="inline"
                                defaultSelectedKeys={[this.state.pathname]}
                                defaultOpenKeys={['sub1']}
                                style={{height: '100%'}}
                            >
                                <Menu.Item key={`/systemManage/systemConfig`}>
                                    <Link title=" 系统参数设置" to={`/systemManage/systemConfig`}><Icon type="tool"/>
                                        <span className="nav-text">
                                                    系统参数设置
                                             </span>
                                    </Link>
                                </Menu.Item>
                                {
                                    (testPermission('user_management') ) ?
                                        <Menu.Item key={`/systemManage/groupManage`}>
                                            <Link title=" 组管理" to={`/systemManage/groupManage`}><Icon type="usergroup-add"/>
                                                <span className="nav-text">
                                                    组管理
                                                </span>
                                            </Link>
                                        </Menu.Item>
                                        : null
                                }
                                {
                                    (testPermission('user_management') ) ?
                                        <Menu.Item key={`/systemManage/userManage`}>
                                            <Link title=" 用户管理" to={`/systemManage/userManage`}><Icon type="user"/>
                                                <span className="nav-text">
                                                    用户管理
                                                </span>
                                            </Link>
                                        </Menu.Item>
                                        : null
                                }

                            </Menu>
                            <Icon
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            />
                        </Sider>

                        <Route path={`/systemManage/systemConfig`} render={(props) => {
                            return (testPermission('system_management') ) ?
                                <SystemConfig {...props}/> :<Nopermission/>;
                        }} />
                        <Route path={`/systemManage/groupManage`} render={(props) => {
                            return (testPermission('user_management') ) ?
                                <GroupManage {...props}/> :<Nopermission/>;
                        }} />
                        <Route path={`/systemManage/userManage`} render={(props) => {
                            return (testPermission('user_management') ) ?
                                <UserManage {...props}/> :<Nopermission/>;
                        }} />

                    </Layout>

                </div>
            </Router>
        )
    }
}

export default SystemManage