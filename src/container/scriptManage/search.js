/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import { Select} from 'antd';
const Option = Select.Option;
class TopicTable extends Component {
    constructor(props) {
        super(props);
    }

    onChangeTestType= (value)=> {
        console.log(value);
        const {q,test_part,test_version}=this.props;
        this.props.onChangeSearch(1, q, value,test_part,test_version)
    }
    onChangeTestPart= (value)=> {
        console.log(value);
        const {q,test_type,test_version}=this.props;
        this.props.onChangeSearch(1, q, test_type,value,test_version)
    }
    onChangeTestVersion= (value)=> {
        console.log(value);
        const {q,test_part,test_type}=this.props;
        this.props.onChangeSearch(1, q,test_type,test_part,value)
    }
    render() {
        console.log(this.props)
        return (
            <div className="search-wrap">
                <span>测试类型: </span>
                <Select allowClear={true} dropdownMatchSelectWidth={false} className="search-select"
                        onChange={this.onChangeTestType}
                >
                    { this.props.fetchTestConf.test_type.map((item, key) => {
                        return (
                            <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                        )
                    }) }
                </Select>
                <span className="ant-divider"/>
                <span>测试部件: </span>
                <Select allowClear={true} dropdownMatchSelectWidth={false} className="search-select"
                        onChange={this.onChangeTestPart}
                >
                    { this.props.fetchTestConf.parts.map((item, key) => {
                        return (
                            <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                        )
                    }) }
                </Select>
                <span className="ant-divider"/>
                <span>测试版本: </span>
                <Select allowClear={true} dropdownMatchSelectWidth={false} className="search-select"
                        onChange={this.onChangeTestVersion}
                >
                    { this.props.fetchTestConf.hardware_versions.map((item, key) => {
                        return (
                            <Option key={item.id} value={item.id.toString()}>{item.version}</Option>
                        )
                    }) }
                </Select>
            </div>

        );
    }
}

export default TopicTable;