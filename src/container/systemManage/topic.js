/**
 * Created by Administrator on 2017/6/13.
 */
import React from 'react'
import {Layout, Breadcrumb,Button} from 'antd';
import './index.less'
const {Content,} = Layout;

class Topic extends React.Component {
    changeCls=()=>{
        // this.props.currentAnimate(this.refs.input.value);
    }
    render() {
        const {match}=this.props;
        return (
            <Layout style={{padding: '0 24px 24px'}}>
                <Breadcrumb style={{margin: '12px 0'}}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Topic</Breadcrumb.Item>
                    <Breadcrumb.Item>{match.params.topicId}</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
                    <input type="text" ref='input'/>
                    <Button type='primary' onClick={this.changeCls}>改变cls</Button>
                    <h3>{match.params.topicId}1236</h3>
                </Content>
            </Layout>
        )
    }
}

export default Topic