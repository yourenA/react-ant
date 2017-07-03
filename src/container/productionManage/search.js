/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import {Input, Select} from 'antd';
const Search = Input.Search;
const Option = Select.Option;
class TopicTable extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    onChangeSearchText = (searchText)=> {
        this.props.onChangeSearch(1, searchText)
    };
    onChangeProductsName = ()=> {

    }

    render() {
        return (
            <div className="search-wrap">
                <span>生产批次: </span>
                <Search
                    defaultValue={''}
                    style={{width: 150}}
                    onSearch={searchText => this.onChangeSearchText(searchText)}
                />
            </div>

        );
    }
}

export default TopicTable;