/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import {Icon} from 'antd'
class ScriptErrorInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        return (
            <div className="scriptErrorInfo">
                <div className="scriptErrorInfo-header">
                    错误信息
                    <div className="getScriptErrorInfo" onClick={this.props.getErrorInfo}>刷新错误信息<Icon type="reload" /></div>
                </div>
                <div className="scriptErrorInfo-content">
                    {this.props.returnMsg.map(function (item,index) {
                        return (
                            <p key={index}>
                                {item}
                            </p>
                        )
                    })}
                </div >

            </div>

        );
    }
}

export default ScriptErrorInfo;