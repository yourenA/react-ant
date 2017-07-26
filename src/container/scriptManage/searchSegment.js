/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import {Input} from 'antd';
class SearchSegment extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onChangeSearchText = (searchText)=> {
        this.props.onChangeSearch(1, searchText)
    };

    render() {
        return (
            <div className="search-wrap">
                <span>脚本段名称: </span>
                <Input
                    defaultValue={''}
                    style={{width: 150}}
                    onPressEnter={searchText => {this.onChangeSearchText(searchText.target.value)}}
                    onChange={searchText =>  {this.onChangeSearchText(searchText.target.value)}}
                />
            </div>

        );
    }
}

export default SearchSegment;