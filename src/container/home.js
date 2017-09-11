/**
 * Created by Administrator on 2017/6/13.
 */
import React from 'react'
import {withRouter} from 'react-router'
import { Layout} from 'antd';
const {Content,} = Layout;
class Home extends React.Component {

    render() {
        return (
            <Content className="content">
                <div className="content-container" style={{minHeight:'calc(100vh - 64px)'}}>
                    <h2>欢迎使用 PCB自动化测试 系统</h2>
                </div>
            </Content>
        )
    }
}


export default withRouter(Home)