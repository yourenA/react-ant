/**
 * Created by Administrator on 2017/3/24.
 */
import React from 'react';
import {Form, Input, Select} from 'antd';
import {producLayout} from './../../common/common'
const FormItem = Form.Item;
const Option = Select.Option;
class AddOrEditNameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.isEdit!==this.props.isEdit){
            this.props.fetchAllHardwareVersions(nextProps.editRecord.product_id)
        }
    }
    changeProduct = (e)=> {
        console.log(e)
        if(e){
            this.props.form.setFieldsValue({
                hardware_version_id: {key:'',label:''},
            });
            this.props.changeProduct(e)
        }
    }
    changeHardwareVersion = (e)=> {
        console.log(e);
        if(e){
            // this.props.fetchAllScript(e.key)
            this.props.changeHardwareVersion(e)
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <div className="testing-header">
                    <div className="testing-config">
                        <div className="testing-config-row">
                            <div className="testing-config-item no-padding-right">
                                <FormItem
                                    label="产品批次号"
                                    {...producLayout}>
                                    {getFieldDecorator('code', {
                                        initialValue: this.props.isEdit ? this.props.editRecord.code : '',
                                        rules: [{required: true, message: '请输入产品批次号'}],
                                    })(
                                        <Input disabled={this.props.isEdit}/>
                                    )}
                                </FormItem>
                            </div>
                            <div className="testing-config-item no-padding-right">
                                <FormItem
                                    label="产品代码"
                                    {...producLayout}>
                                    {getFieldDecorator('product_id', {
                                        initialValue: this.props.isEdit ? {
                                            key: this.props.editRecord.product_id.toString(),
                                            label: this.props.editRecord.product_code
                                        } : {key: '', label: ''},
                                        rules: [{required: true, message: '请选择产品代码'}],
                                    })(
                                        <Select labelInValue={true}  onChange={this.changeProduct}
                                                dropdownMatchSelectWidth={false}
                                                showSearch
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                            { this.props.fetchTestConf.products.map((item, key) => {
                                                return (
                                                    <Option key={item.id}
                                                            value={item.id.toString()}>{item.code}</Option>
                                                )
                                            }) }
                                        </Select>
                                    )}
                                </FormItem>
                            </div>
                            <div className="testing-config-item no-padding-right">
                                <FormItem
                                    label="硬件版本"
                                    {...producLayout}>
                                    {getFieldDecorator('hardware_version_id', {
                                        initialValue: this.props.isEdit ? {
                                            key: this.props.editRecord.hardware_version_id.toString(),
                                            label: this.props.editRecord.hardware_version
                                        } : {key: '', label: ''},
                                        rules: [{required: true, message: '请选择硬件版本'}],
                                    })(
                                        <Select labelInValue={true}
                                                onChange={this.changeHardwareVersion}
                                                dropdownMatchSelectWidth={false}
                                                showSearch
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                            { this.props.fetchTestConf.hardware_versions.map((item, key) => {
                                                return (
                                                    <Option key={item.id}
                                                            value={item.id.toString()}>{item.version}</Option>
                                                )
                                            }) }
                                        </Select>
                                    )}
                                </FormItem>
                            </div>
                            <div className="testing-config-item no-padding-right">
                                <FormItem
                                    label="制造厂商"
                                    {...producLayout}>
                                    {getFieldDecorator('company_id', {
                                        initialValue: this.props.isEdit ? {
                                            key: this.props.editRecord.company_id.toString(),
                                            label: this.props.editRecord.company_name
                                        } : {key: '', label: ''},
                                        rules: [{required: true, message: '请选择制造厂商'}],
                                    })(
                                        <Select labelInValue={true} >
                                            { this.props.fetchTestConf.manufactures.map((item, key) => {
                                                return (
                                                    <Option key={item.id}
                                                            value={item.id.toString()}>{item.name}</Option>
                                                )
                                            }) }
                                        </Select>
                                    )}
                                </FormItem>
                            </div>
                        </div>
                        <div className="testing-config-row desc-row">
                            <div className="">
                                <span style={{marginRight:'10px',paddingLeft:'30px',fontSize:'12px'}}>说明描述 :</span>
                                <FormItem>
                                    {getFieldDecorator('description', {
                                        initialValue: this.props.isEdit ? this.props.editRecord.description : '',
                                    })(
                                        <Input type="textarea" rows={4}/>
                                    )}
                                </FormItem>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        );
    }
}

const WrappedForm = Form.create()(AddOrEditNameForm);
export default WrappedForm;
