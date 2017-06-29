/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import { Select} from 'antd';
const Option = Select.Option;
class UserManageSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
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
                    { this.props.fetchTestConf.groups.map((item, key) => {
                        return (
                            <Option key={item.id} value={item.id.toString()}>{item.display_name}</Option>
                        )
                    }) }
                </Select>

            </div>

        );
    }
}

export default UserManageSearch;