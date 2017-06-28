/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import { Select,Input} from 'antd';
const Option = Select.Option;
const Search = Input.Search;
class TopicTable extends Component {
    onChangeBatches= (value)=> {
        console.log(value)
        const { q}=this.props;
        this.props.onChangeSearch(1, q, value)
    }
    onChangeSearchText = (value)=> {
        console.log(value)
        const {  batches}=this.props;
        this.props.onChangeSearch(1, value,batches)
    };
    render() {
        return (
            <div className="search-wrap">

                <span>生产批次: </span>
                <Select allowClear={true} dropdownMatchSelectWidth={false} className="search-select"
                        onChange={this.onChangeBatches}
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    { this.props.fetchTestConf.batches.map((item, key) => {
                        return (
                            <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                        )
                    }) }
                </Select>
                <span className="ant-divider"/>
                <span>产品序列号: </span>
                <Search
                    defaultValue={''}
                    style={{width: 150}}
                    onSearch={value => this.onChangeSearchText(value)}
                />

            </div>

        );
    }
}

export default TopicTable;