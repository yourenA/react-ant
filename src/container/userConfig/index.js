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
import UserInfo from './userInfo/index'
import ModifyPassword from './modifyPassword/index'
const {Sider} = Layout;

class UserConfig extends React.Component {
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
                                <Menu.Item key={`/userConfig/userInfo`}>
                                    <Link title=" 用户信息" to={`/userConfig/userInfo`}><Icon type="user"/>
                                        <span className="nav-text">
                                                    用户信息
                                             </span>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key={`/userConfig/ModifyPassword`}>
                                    <Link title=" 组管理" to={`/userConfig/ModifyPassword`}><Icon type="edit"/>
                                        <span className="nav-text">
                                                    修改密码
                                                </span>
                                    </Link>
                                </Menu.Item>
                            </Menu>
                            <Icon
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            />
                        </Sider>


                        <Route path={`/userConfig/userInfo`} render={(props) => {
                            return (<UserInfo {...props}/>);
                        }}/>
                        <Route path={`/userConfig/ModifyPassword`} render={(props) => {
                            return (<ModifyPassword {...props}/>)
                        }}/>
                    </Layout>

                </div>
            </Router>
        )
    }
}

export default UserConfig