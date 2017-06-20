/**
 * Created by Administrator on 2017/6/13.
 */
import React from 'react';
import {Breadcrumb} from 'antd';

class Topic extends React.Component {
    render() {
        return (
            <div className="content">
                <Breadcrumb className="breadcrumb">
                </Breadcrumb>
                <div className="content-container">
                    <div className="no-permission">
                        没有权限
                    </div>
                </div>
            </div>
        )
    }
}

export default Topic