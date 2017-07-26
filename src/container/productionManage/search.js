/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import {Input,Button} from 'antd';
class TopicTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
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
                <Input
                    defaultValue={''}
                    style={{width: 150}}
                    onPressEnter={searchText => {this.onChangeSearchText(searchText.target.value)}}
                    onChange={searchText => {this.onChangeSearchText(searchText.target.value)}}
                />
            </div>

        );
    }
}

export default TopicTable;