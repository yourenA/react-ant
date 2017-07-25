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
            <div className="scriptInfo" style={{lineHeight:'30px'}}>
                <h3><Icon type="exclamation-circle-o" style={{marginRight:'5px',color:'red'}}/>暂不要使用浏览器的"前进"与"后退"按钮。右击"分组"可查看详情，右击"方法标题"和"设置参数"中的key-value表格可以添加数据</h3>
                <h3><Icon type="exclamation-circle-o" style={{marginRight:'5px',color:'red'}}/>不能在同一个浏览器编辑多个"脚本"或"脚本段"流程图,如果编辑多个可能导致数据相互影响</h3>
            </div>
        )
    }
}

export default ScriptInfo