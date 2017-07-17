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
                <div className="content-container">
                    <h2>Home</h2>
                </div>
            </Content>
        )
    }
}


export default withRouter(Home)