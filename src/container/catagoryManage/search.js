/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import {Input,Select} from 'antd';
import axios from 'axios'
import configJson from './../../common/config.json';
import {getHeader} from './../../common/common';
const Search = Input.Search;
const Option = Select.Option;
class TopicTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            partNameArr:[]
        };
    }
    componentDidMount() {
        const that=this;
        axios({
            url: `${configJson.prefix}/parts`,
            method: 'get',
            params: {
                return: 'all'
            },
            headers: getHeader()
        }).then(function (response) {
            console.log(response.data);
            that.setState({
                partNameArr:response.data.data
            })
        }).catch(function (error) {
            console.log('获取出错', error);
        })
    }
    onChangeSearchText = (searchText)=> {
        if(this.props.type==='/hardware_versions'){
            const {selectType}=this.props
            this.props.onChangeSearch(1, searchText,selectType)
        }else{
            this.props.onChangeSearch(1, searchText)
        }
    };
    onChangeSelect=(value)=>{
        console.log(value);
        const {q}=this.props
        this.props.onChangeSearch(1, q,value)
    }
    render() {
        return (
            <div className="search-wrap">
                <span>{this.props.searchTitle}: </span>
                {this.props.type==='/hardware_versions'?
                    <span>
                         <Select allowClear={true} dropdownMatchSelectWidth={false} className="search-select"   onChange={this.onChangeSelect}
                         >
                        { this.state.partNameArr.map((item, key) => {
                            return (
                                <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                            )
                        }) }
                    </Select>
                        <span className="ant-divider"/>
                        <span>硬件版本: </span>
                    </span>

                :null}
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