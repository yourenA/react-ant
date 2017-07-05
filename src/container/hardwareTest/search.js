/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import { Select} from 'antd';
const Option = Select.Option;
class TopicTable extends Component {
    onChangeBatches= (value)=> {
        console.log(value)
        this.props.onChangeSearch(1,  value)
    }
    render() {
        return (
            <div className="search-wrap">

                <span>生产批次: </span>
                <Select allowClear={true} dropdownMatchSelectWidth={false} className="search-select"
                        onChange={this.onChangeBatches}
                        showSearch
                        style={{width: 150}}
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    { this.props.fetchTestConf.batches.map((item, key) => {
                        return (
                            <Option key={item.id} value={item.id.toString()}>{item.code}</Option>
                        )
                    }) }
                </Select>

            </div>

        );
    }
}

export default TopicTable;