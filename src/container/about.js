/**
 * Created by Administrator on 2017/6/13.
 */
import React from 'react';
import {  Breadcrumb } from 'antd';
const About = () => (
    <div>
        <div className="content" >
            <Breadcrumb className="breadcrumb" >
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <div className="content-container" >Content</div>
        </div>
    </div>
)

export default About