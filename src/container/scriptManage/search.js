/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import { Select,Input,Button} from 'antd';
const Option = Select.Option;
class TopicTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText:'',
            testType:'',
            testVersion:''
        };
    }
    onChangeTestType= (value)=> {
        console.log(value)
        const {q,test_version}=this.props;
        this.props.onChangeSearch(1, q, value,test_version)
    }
    onChangeTestVersion= (value)=> {
        console.log(value)
        const {q,test_type}=this.props;
        this.props.onChangeSearch(1, q,test_type,value)
    }
    onChangeSearchText = (value)=> {
        console.log(value)
        const {test_type,test_version}=this.props;
        this.props.onChangeSearch(1, value, test_type,test_version)
    };
    changeProduct = (value)=> {
        console.log(value)
        this.props.delAllHardwareVersions()
        if(value){
            this.props.fetchAllHardwareVersions(value)
        }
    }
    render() {
        return (
            <div className="search-wrap">
                <span>脚本名称: </span>
                <Input
                    defaultValue={''}
                    style={{width: 150}}
                    onPressEnter={searchText => {this.onChangeSearchText(searchText.target.value)}}
                    onChange={searchText =>  {this.onChangeSearchText(searchText.target.value)}}
                />
                <span className="search-text">测试类型: </span>
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
                <span  className="search-text">产品代码: </span>
                <Select allowClear={true} dropdownMatchSelectWidth={false} className="search-select"
                        onChange={this.changeProduct}
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    { this.props.fetchTestConf.products.map((item, key) => {
                        return (
                            <Option key={item.id} value={item.id.toString()}>{item.code}</Option>
                        )
                    }) }
                </Select>
                <span  className="search-text">测试版本: </span>
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