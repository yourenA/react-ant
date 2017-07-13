/**
 * Created by Administrator on 2017/6/13.
 */
import React from 'react';
import {Icon} from 'antd'
class ScriptInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount = ()=> {
    }
    render() {
        return (
            <div className="scriptInfo" style={{height:'30px',lineHeight:'30px'}}>
                <h3><Icon type="exclamation-circle-o" style={{marginRight:'5px',color:'red'}}/>暂不要使用浏览器的前进与后退</h3>
            </div>
        )
    }
}

export default ScriptInfo