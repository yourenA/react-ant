/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import { Input} from 'antd';
const Search = Input.Search;
class UserManageSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    onChangeSearchText = (value)=> {
        console.log(value)
        const {  page}=this.props;
        this.props.onChangeSearch(1, page,value)
    };
    render() {
        return (
            <div className="search-wrap">
                <span>制造厂名称: </span>
                <Search
                    defaultValue={''}
                    style={{width: 150}}
                    onSearch={value => this.onChangeSearchText(value)}
                />

            </div>

        );
    }
}

export default UserManageSearch;