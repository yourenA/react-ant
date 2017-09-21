/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import {Input,Select,DatePicker } from 'antd';
const RangePicker = DatePicker.RangePicker;
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
        if (this.props.type === '/hardware_versions') {
            const {selectType}=this.props
            this.props.onChangeSearch(1, searchText, selectType)
        } else if(this.props.match.url === '/reports'){
            const {startDate,endDate}=this.props
            this.props.onChangeSearch(1, searchText,null,startDate,endDate)
        } else {
            this.props.onChangeSearch(1, searchText)
        }
    };
    onChangeProductsName=(e)=>{
        const {q}=this.props;
        this.props.onChangeSearch(1,q,e)
    }
    changeReportTime=(date, dateString)=>{
        console.log( dateString);
        const {q}=this.props;
        this.props.onChangeSearch(1, q,null,dateString[0],dateString[1])
    }
    render() {
        return (
            <div className="search-wrap">
                <span>{this.props.searchTitle}: </span>
                <Input
                    defaultValue={''}
                    style={{width: 150}}
                    onPressEnter={searchText => {this.onChangeSearchText(searchText.target.value)}}
                    onChange={searchText =>  {this.onChangeSearchText(searchText.target.value)}}
                />
                {this.props.type === '/hardware_versions' ?
                    <span>
                         <span className="search-text">产品名称: </span>
                        <Select allowClear={true} dropdownMatchSelectWidth={false} className="search-select"
                                onChange={this.onChangeProductsName}
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                        { this.props.fetchTestConf.products.map((item, key) => {
                        return (
                            <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                        )
                    }) }
                </Select>
                    </span>
                    : null
                }
                {this.props.type === '/reports' ?
                    <span>
                         <span className="search-text">测试时间 : </span>
                        <RangePicker onChange={this.changeReportTime}
                        />
                    </span>
                    : null
                }
              {/*  {this.props.type === '/test_stands' ?
                    <span>
                         <span className="search-text">制造厂商: </span>
                        <Select allowClear={true} dropdownMatchSelectWidth={false} className="search-select"
                                onChange={this.onChangeProductsName}
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                        { this.props.fetchTestConf.manufactures.map((item, key) => {
                            return (
                                <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                            )
                        }) }
                </Select>
                    </span>
                    : null
                }*/}
            </div>

        );
    }
}

export default TopicTable;