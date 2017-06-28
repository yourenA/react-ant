/**
 * Created by Administrator on 2017/3/24.
 */
import React from 'react';
import {Form, Input,Table,Switch} from 'antd';
import {formItemLayout} from './../../../common/common'

const FormItem = Form.Item;

class AddOrEditNameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const columns = [ {
            title: '功能',
            dataIndex: 'display_name',
            key: 'display_name',
            className:'center-col'
        }, {
            title: '权限',
            key: 'action',
            className:'center-col',
            render: (text, record, index) => {
                const permissions=this.props.editRecord.permissions.data;
                let isChecked=false
                for(let i=0,len=permissions.length;i<len;i++){
                    if(record.name===permissions[i].name){
                        isChecked=true
                    }
                }
                return(
                    <div key={index}>
                        <Switch defaultChecked={isChecked} checkedChildren={'开'} unCheckedChildren={'关'} />
                    </div>
                )

            }
        }];
        console.log('this.props',this.props)
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                    <div>
                        <FormItem
                            label={'组名称'}
                            {...formItemLayout}>
                            {getFieldDecorator('name', {
                                initialValue: this.props.isEdit ? this.props.editRecord.display_name : '',
                                rules: [{required: true, message: `请输入制造厂名称`}],
                            })(
                                <Input  />
                            )}
                        </FormItem>
                        <Table bordered className="main-table"
                               rowKey="id" columns={columns}
                               dataSource={this.props.fetchTestConf.permissions} pagination={false}/>
                    </div>
            </Form>
        );
    }
}

const WrappedForm = Form.create()(AddOrEditNameForm);
export default WrappedForm;
