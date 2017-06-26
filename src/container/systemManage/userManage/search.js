/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import { Select} from 'antd';
import axios from 'axios'
import configJson from './../../../common/config.json';
import {getHeader} from './../../../common/common';
const Option = Select.Option;
class UserManageSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            partNameArr: []
        };
    }

    componentDidMount() {
        const that = this;
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
                partNameArr: response.data.data
            })
        }).catch(function (error) {
            console.log('获取出错', error);
        })
    }

    onChangeSelect = (group)=> {
        console.log(group);
        const {q}=this.props
        this.props.onChangeSearch(1, q, group)
    }

    render() {
        return (
            <div className="search-wrap">
                <span>用户所属组: </span>
                <Select allowClear={true} dropdownMatchSelectWidth={false} className="search-select"
                        onChange={this.onChangeSelect}
                >
                    { this.state.partNameArr.map((item, key) => {
                        return (
                            <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                        )
                    }) }
                </Select>

            </div>

        );
    }
}

export default UserManageSearch;