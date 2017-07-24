/**
 * Created by Administrator on 2017/3/24.
 */
import React from 'react';
import {Breadcrumb, Transfer, Card, Button, message, Icon,Radio} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import AddOrEditName from './addOrEditNmae';
import axios from 'axios'
import configJson from 'configJson' ;
import messageJson from './../../common/message.json';
import {getHeader, converErrorCodeToMsg} from './../../common/common';
const RadioGroup = Radio.Group;
class AddOrEditBatch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editRecord:null,
            hardwareVersion:'',
            targetTestTypeKeys: [],
            selectedTestTypeKeys: [],
        };
    }

    componentDidMount() {
        this.props.delAllScript();
        this.props.delTestTypet();
        this.props.delAllHardwareVersions();
        console.log('componentDidMount');
        this.props.fetchAllManufacture();
        this.props.fetchAllProducts();
        if( !this.props.location.state.newBatch){
            this.fetchBatch(this.props.location.state.editId)
            this.props.fetchAllTestType()
        }


    }
    fetchBatch=(id)=>{
        const that=this;
        axios({
            url: `${configJson.prefix}/batches/${id}`,
            method: 'get',
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                let tesTypeArr=[]
                for(let i=0,len=response.data.test_types.data.length;i<len;i++){
                    tesTypeArr.push(response.data.test_types.data[i].id);
                    that.setState({
                        [response.data.test_types.data[i].id]:response.data.test_types.data[i].default_test_script_id
                    })
                }
                that.setState({
                    editRecord:response.data,
                    hardwareVersion:response.data.hardware_version_id,
                    targetTestTypeKeys:tesTypeArr
                })
            }).catch(function (error) {
            console.log('获取出错', error);
        })
    }

    changeProduct = (e)=> {
        console.log(e)
        this.setState({
            targetTestTypeKeys: [],
        });
        this.props.delAllScript()
        this.props.fetchAllHardwareVersions(e.key)
    }
    changeHardwareVersion = (e)=> {
        console.log(e);
        this.setState({
            targetTestTypeKeys: [],
            hardwareVersion:e.key
        });
        this.props.fetchAllTestType()
        // this.props.fetchAllScript(e.key)
    }
    handleChangeTestType = (nextTargetKeys, direction, moveKeys) => {
        this.setState({targetTestTypeKeys: nextTargetKeys});
        if(direction==='left'){
            this.props.delAllScript();
            for(let i=0,len=moveKeys.length;i<len;i++){
                if(this.state[moveKeys[i]]){
                    console.log('先前存在')
                    this.setState({
                        [moveKeys[i]]:null
                    },function () {
                    })
                }
            }
        }
    }

    handleSelectChangeTestType = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({selectedTestTypeKeys: [...sourceSelectedKeys, ...targetSelectedKeys]});
    }
    sortScript = (category, sort, selectedKeys, targetKeys)=> {
        targetKeys = [...targetKeys];//注意！这是不能直接写成let targetKeys=this.state.targetKeys;这样写视图就不会更新
        if (selectedKeys.length !== 1) {
            message.error('只能选一个脚本移动')
            return false
        }
        if (sort === 'up') {
            if (targetKeys.indexOf(selectedKeys[0]) === 0) {
                message.error('不能选择第一个')
                return false
            } else {
                const index = targetKeys.indexOf(selectedKeys[0]);
                const temp = targetKeys[index - 1]
                targetKeys[index - 1] = targetKeys[index]
                targetKeys[index] = temp;

            }
        } else if (sort === 'down') {
            if (targetKeys.indexOf(selectedKeys[0]) === targetKeys.length - 1) {
                message.error('不能选择最后一个')
            } else {
                const index = targetKeys.indexOf(selectedKeys[0]);
                const temp = targetKeys[index + 1]
                targetKeys[index + 1] = targetKeys[index]
                targetKeys[index] = temp;
            }
        }

            this.setState({
                targetTestTypeKeys: targetKeys
            })
    }
    saveBatch = ()=> {
        const isEdit=!this.props.location.state.newBatch
        const AddOrEditName = this.refs.AddOrEditName.getFieldsValue();
        const { targetTestTypeKeys}=this.state;
        const sendData={
            code:AddOrEditName.code,
            // product_id:AddOrEditName.product_id?AddOrEditName.product_id.key:'',
            hardware_version_id:AddOrEditName.hardware_version_id?AddOrEditName.hardware_version_id.key:'',
            company_id:AddOrEditName.company_id?AddOrEditName.company_id.key:'',
            description:AddOrEditName.description,
            test_types:[]
        };
        if(isEdit)delete sendData.code;
        for(let i=0,len=targetTestTypeKeys.length;i<len;i++){
            sendData.test_types.push({
                id:targetTestTypeKeys[i],
                default_test_script_id:this.state[targetTestTypeKeys[i]]
            })
        }
        console.log( sendData.test_types)
        const url=isEdit?`/${this.state.editRecord.id}`:'';
        const method=isEdit?`put`:'post';
        const msg=isEdit?`edit batches success`:`add batches success`;
        axios({
            url: `${configJson.prefix}/batches${url}`,
            method: method,
            data: sendData,
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response.data);
                message.success(messageJson[msg]);
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })

    }
    getScript=(id)=>{
        console.log('id',id);
        if(this.state.targetTestTypeKeys.indexOf(id)>=0){
            if(this.state[id]){
                this.setState({
                    nowGetScript:id
                })
            }else{
                this.setState({
                    [id]:null,
                    nowGetScript:id
                })
            }

            this.props.fetchAllScript(this.state.hardwareVersion,id)
        }else{
            message.error('请将测试类型添加到右边')
        }
    }
    renderItem = (item) => {
        const customLabel= (
            <span className="custom-item">
                {item.name }<Button style={{marginLeft:'10px'}} size="small" onClick={(e)=>{e.stopPropagation();this.getScript(item.id)}}>设置默认脚本</Button>
            </span>
        );
        return {
            label: customLabel,  // for displayed item
            value: item.name,   // for title and filter matching
        };
    }
    onChange=(e)=>{
        const {nowGetScript}=this.state;
        this.setState({
            [nowGetScript]:e.target.value
        })
    }
    render() {
        const radioStyle = {
            display: 'block',
            height: '33px',
            lineHeight: '33px',
            paddingLeft:'10px'
        };
        return (
            <div>
                <div className="content">
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item>生产批次管理</Breadcrumb.Item>
                        <Breadcrumb.Item>{this.props.location.state.newBatch ? '新建产品批次' : `${this.state.editRecord?this.state.editRecord.code:''}`}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="content-container">
                        <div className="operate-box">
                            <Button onClick={()=>this.props.history.goBack()}>取消</Button>
                            <span className="ant-divider"/>
                            <Button type='primary' onClick={this.saveBatch}>保存</Button>
                        </div>
                        <Card title="1.批次基本信息" bordered={true} className="transfer-card">
                            <AddOrEditName isEdit={this.state.editRecord!==null} editRecord={this.state.editRecord} changeProduct={this.changeProduct} changeHardwareVersion={this.changeHardwareVersion}  {...this.props} ref="AddOrEditName"/>
                        </Card>
                        <Card title="2.批次测试工序流程" bordered={true} className="transfer-card">
                            <Transfer
                                className='batch-transfer batch-transfer-process'
                                rowKey={record => record.id}
                                dataSource={this.props.fetchTestConf.test_type}
                                titles={['可选测试类型', '已选测试类型']}
                                targetKeys={this.state.targetTestTypeKeys}
                                selectedKeys={this.state.selectedTestTypeKeys}
                                onChange={this.handleChangeTestType}
                                operations={["添加", "移除"]}
                                onSelectChange={this.handleSelectChangeTestType}
                                render={this.renderItem}
                                listStyle={{
                                    width: 250,
                                    height: 300,
                                }}
                            />
                            <div className="batch-sort">
                                <div>
                                    <Icon type="caret-up" className="scroll-icon"
                                          onClick={()=>this.sortScript('testType', 'up', this.state.selectedTestTypeKeys, this.state.targetTestTypeKeys)}/>
                                </div>
                                <div>
                                    <Icon type="caret-down" className="scroll-icon"
                                          onClick={()=>this.sortScript('testType', 'down', this.state.selectedTestTypeKeys, this.state.targetTestTypeKeys)}/>
                                </div>
                            </div>
                            <div className="set-defaultScript">
                                <div className="set-defaultScript-header">选择默认脚本</div>
                                <RadioGroup onChange={this.onChange} >
                                {this.props.fetchTestConf.script.map((item,index)=>{
                                        if(this.state[this.state.nowGetScript]===item.id){
                                            console.log('已经选择')
                                            return(
                                                <Radio key={index} checked={true} style={radioStyle} value={item.id}>{item.name}</Radio>
                                            )
                                        }else{
                                            return(
                                                <Radio key={index} style={radioStyle} value={item.id}>{item.name}</Radio>
                                            )
                                        }

                                })}
                                </RadioGroup>
                            </div>
                            <div className="right-transfer-description">
                                说明：执行的测试顺序为从上到下，请排好优先顺序
                            </div>


                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        fetchTestConf: state.fetchTestConf,
    };
}
function mapDispatchToProps(dispath) {
    return bindActionCreators(fetchTestConfAction, dispath);
}
export default connect(mapStateToProps, mapDispatchToProps)(AddOrEditBatch);
