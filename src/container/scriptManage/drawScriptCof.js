/**
 * Created by Administrator on 2017/3/24.
 */
import React from 'react';
import {Form, Input, Select} from 'antd';
import {DrawScriptConfLayout} from './../../common/common';

const FormItem = Form.Item;
const Option = Select.Option;

class DrawScriptConf extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            partNameArr: [],
        };
    }

    componentDidMount() {
    }

    render() {
        console.log(this.props)
        const {getFieldDecorator} = this.props.form;
        return (

                <div className="testing-config">
                    <div className="testing-config-row">

                        <div className="testing-config-item no-hide">
                            <FormItem
                                label={'脚本名称'}
                                {...DrawScriptConfLayout}>
                                {getFieldDecorator('name', {
                                    initialValue: this.props.editRecord ? this.props.editRecord.name : '',
                                    rules: [{required: true, message: `请输入脚本名称`}],
                                })(
                                    <Input  style={{width:'150px'}}/>
                                )}
                            </FormItem>
                        </div>
                        <div className="testing-config-item no-hide">
                            <FormItem
                                label="测试类型"
                                {...DrawScriptConfLayout}>
                                {getFieldDecorator('test_type_id', {
                                    initialValue: this.props.editRecord ? {key:this.props.editRecord.test_type_id.toString(),label:this.props.editRecord.test_type_name} : {key:'',label:''},
                                    rules: [{required: true, message: `请选择测试类型`}],
                                })(
                                    <Select
                                        showSearch
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        style={{width:'150px'}} labelInValue={true} allowClear={true}>
                                        { this.props.fetchTestConf.test_type.map((item, key) => {
                                            return (
                                                <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                                            )
                                        }) }
                                    </Select>
                                )}
                            </FormItem>
                        </div>
                        <div className="testing-config-item no-hide">
                            <FormItem
                                label="测试部件"
                                {...DrawScriptConfLayout}>
                                {getFieldDecorator('part_id', {
                                    initialValue: this.props.editRecord ? {key:this.props.editRecord.part_id.toString(),label:this.props.editRecord.part_name} : {key:'',label:''},
                                    rules: [{required: true, message: `请选择测试部件`}],
                                })(
                                    <Select
                                        showSearch
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        style={{width:'150px'}} labelInValue={true} allowClear={true}>
                                        { this.props.fetchTestConf.parts.map((item, key) => {
                                            return (
                                                <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                                            )
                                        }) }
                                    </Select>
                                )}
                            </FormItem>
                        </div>
                        <div className="testing-config-item no-hide">
                            <FormItem
                                label="硬件版本"
                                {...DrawScriptConfLayout}>
                                {getFieldDecorator('hardware_version_id', {
                                    initialValue: this.props.editRecord ? {key:this.props.editRecord.hardware_version_id.toString(),label:this.props.editRecord.hardware_version} : {key:'',label:''},
                                    rules: [{required: true, message: `请选择硬件版本`}],
                                })(
                                    <Select
                                        showSearch
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        style={{width:'150px'}} labelInValue={true} allowClear={true}>
                                        { this.props.fetchTestConf.hardware_versions.map((item, key) => {
                                            return (
                                                <Option key={item.id} value={item.id.toString()}>{item.version}</Option>
                                            )
                                        }) }
                                    </Select>
                                )}
                            </FormItem>
                        </div>
                    </div>
                </div>
        );
    }
}

const WrappedForm = Form.create()(DrawScriptConf);

export default WrappedForm;
