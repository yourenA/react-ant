/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import { Select,Input} from 'antd';
const Option = Select.Option;
const Search = Input.Search;
class TopicTable extends Component {
    onChangeTestType= (value)=> {
        console.log(value)
        const {q,test_part,test_version}=this.props;
        this.props.onChangeSearch(1, q, value,test_part,test_version)
    }
    onChangeTestPart= (value)=> {
        console.log(value)
        const {q,test_type,test_version}=this.props;
        this.props.onChangeSearch(1, q, test_type,value,test_version)
    }
    onChangeTestVersion= (value)=> {
        console.log(value)
        const {q,test_part,test_type}=this.props;
        this.props.onChangeSearch(1, q,test_type,test_part,value)
    }
    onChangeSearchText = (value)=> {
        console.log(value)
        const {test_part,test_type,test_version}=this.props;
        this.props.onChangeSearch(1, value, test_type,test_part,test_version)
    };
    render() {
        return (
            <div className="search-wrap">
                <span>脚本名称: </span>
                <Search
                    defaultValue={''}
                    style={{width: 150}}
                    onSearch={value => this.onChangeSearchText(value)}
                />
                <span className="ant-divider"/>
                <span>测试类型: </span>
                <Select allowClear={true} dropdownMatchSelectWidth={false} className="search-select"
                        onChange={this.onChangeTestType}
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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