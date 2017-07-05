/**
 * Created by Administrator on 2017/6/14.
 */
import React, {Component} from 'react';
import {Breadcrumb, Card, Pagination, Button, Col, Row, Layout, Input} from 'antd';
import axios from 'axios'
import configJson from './../../../common/config.json';
import {getHeader, converErrorCodeToMsg} from './../../../common/common';
import messageJson from './../../../common/message.json';
import Masonry from 'react-masonry-component';
const {Content,} = Layout;
class Manufacture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            editModal: false,
            addModal: false
        };
    }

    componentDidMount() {
        this.fetchHwData();
    }

    fetchHwData = () => {
        const that = this;
        axios({
            url: `${configJson.prefix}/configs`,
            method: 'get',
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    data: response.data.data,
                })
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    saveDefaultPassword = ()=> {

    }

    render() {
        var childElements = this.state.data.map((item, index)=> {
            if (item.name === 'default_password') {
                return (
                    <Col span={8} key={index} style={{padding:'0 0 10px 10px'}}>
                        <Card title={item.display_name} bordered={true}>
                            <Input defaultValue={item.value}/>
                            <p className="systemConfig-info">用于管理员生成用户时的默认密码。</p>
                            <div className="systemConfig-save-btn">
                                <Button type='primary' onClick={this.saveDefaultPassword}>
                                    保存
                                </Button>
                            </div>
                        </Card>
                    </Col>
                )
            } else {
                return null
            }

        })
        return (
            <Layout style={{padding: '0 24px 24px'}}>

                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>系统参数设置</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
                        <Masonry
                            elementType={'ul'} // default 'div'
                            options={{
                                transitionDuration: 0
                            }} // default {}
                            disableImagesLoaded={false} // default false
                            updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                        >
                            {childElements}
                        </Masonry>
                </Content>

            </Layout>
        )
    }
}
export default Manufacture;
