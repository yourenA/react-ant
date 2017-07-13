/**
 * Created by Administrator on 2017/3/24.
 */
import React from 'react';
import {Radio} from 'antd';
const RadioGroup = Radio.Group;
class AddSeriaNum extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value:'new'
        };
    }

    componentDidMount() {
    }

    changeRadio=(e)=>{
        this.setState({
            value: e.target.value,
        });
    }
    callBackRadio=()=>{
        return this.state.value
    }
    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return (
            <div>
                <RadioGroup onChange={this.changeRadio} value={this.state.value}>
                    <Radio style={radioStyle} value="new">全新保存 <span className="radio-text">如果之前已生成过，则会清空之前的所有序列号</span></Radio>
                    <Radio style={radioStyle} value="append">增量保存 <span
                        className="radio-text">如果之前已生成过，则会在后面继续增加新的序列号</span></Radio>
                    <Radio style={radioStyle} value="replace">覆盖保存 <span className="radio-text">如果之前已生成过，则会覆盖原来序列号，这种方法不会清空原来已存在的号</span></Radio>
                </RadioGroup>
            </div>
        );
    }
}

export default AddSeriaNum;
