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
        const {getFieldDecorator} = this.props.form;
        return (

                <div className="testing-config">
                    <div className="testing-config-row">
                        <div className="testing-config-item no-hide">
                            <FormItem
                                label={'脚本名称'}
                                {...DrawScriptConfLayout}>
                                {getFieldDecorator('scriptName', {
                                    initialValue: '',
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
                                {getFieldDecorator('test_type', {
                                })(
                                    <Select style={{width:'150px'}} labelInValue={true} allowClear={true}>
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
                                })(
                                    <Select style={{width:'150px'}} labelInValue={true} allowClear={true}>
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
                                })(
                                    <Select  style={{width:'150px'}} labelInValue={true} allowClear={true}>
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
