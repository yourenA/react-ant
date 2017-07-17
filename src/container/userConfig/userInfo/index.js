/**
 * Created by Administrator on 2017/6/14.
 */
import React, {Component} from 'react';
import {Breadcrumb, Layout,} from 'antd';
const {Content,} = Layout;
class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    fetchHwData = () => {
    }

    render() {
        console.log(JSON.parse(localStorage.getItem('userData')))
        return (
            <Layout style={{padding: '0 24px 24px'}}>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>用户设置</Breadcrumb.Item>
                    <Breadcrumb.Item>用户信息</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
                    <table className="userInfo-table">
                        <tbody>
                        <tr>
                            <td>用户名称：</td>
                            <td>{JSON.parse(localStorage.getItem('userData')).username}</td>
                        </tr>
                        <tr>
                            <td>用户组：</td>
                            <td>{JSON.parse(localStorage.getItem('userData')).role_name}</td>
                        </tr>
                        <tr>
                            <td>所属机构：</td>
                            <td>所属机构</td>
                        </tr>
                        <tr>
                            <td>当前权限：</td>
                            <td>{JSON.parse(localStorage.getItem('userData')).permissions.data.map((item, index)=> {
                                return (
                                    <span key={index}>{item.display_name}</span>
                                )
                            })}</td>
                        </tr>
                        </tbody>
                    </table>
                </Content>
            </Layout>
        )
    }
}
export default UserInfo;
