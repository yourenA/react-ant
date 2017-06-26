/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import {Breadcrumb, Layout,Input , Button,Modal,message} from 'antd';
import './drawScript.less';
import ScriptIndex from './scriptIndex.js'
import axios from 'axios'
import configJson from './../../common/config.json';
import {getHeader,converErrorCodeToMsg} from './../../common/common';
import messageJson from './../../common/message.json';
import FetchSegments from './fetchSegments'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';

const {Content,} = Layout;


class AddProgramSegment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveModal:false,
            segmentJson:'{}'
        };
    }

    componentDidMount() {
        this.props.fetchAllSegments();
        if (!this.props.location.state.newSegment) {
            this.fetchScript(this.props.location.state.editRecord.id,this.refs.ScriptIndex.init)
        }else{
            this.refs.ScriptIndex.init()
        }
    }
    fetchScript=(id,cb)=>{
        const that=this
        axios({
            url: `${configJson.prefix}/flow_diagrams/${id}`,
            method: 'get',
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    segmentJson:response.data.content
                });
                if(cb) cb();
            }).catch(function (error) {
            console.log('获取出错',error);
        })
    }
    saveCode=()=>{
        const that=this;
        console.log('this.refs.scriptCodeNmae',this.refs.scriptCodeNmae.refs.input.value)
        this.refs.ScriptIndex.save();
        const content=JSON.parse(this.refs.ScriptIndex.callbackJson());
        for(let i=0,len=content.linkDataArray.length;i<len;i++){
            delete  content.linkDataArray[i].points
        }
        const url=this.props.location.state.newSegment ?`/flow_diagrams`:`/flow_diagrams/${this.props.match.params.id}`
        const method=this.props.location.state.newSegment ?`post`:`put`;
        const meg=this.props.location.state.newSegment ?messageJson[`add segment success`]:messageJson[`edit segment success`];
        axios({
            url: `${configJson.prefix}${url}`,
            method: method,
            data: {
                name:this.refs.scriptCodeNmae.refs.input.value,
                content: JSON.stringify(content),
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                message.success(meg);
                that.setState({
                    saveModal:false
                })
            }).catch(function (error) {
            console.log('获取出错',error);
            converErrorCodeToMsg(error)
        })
    }
    turnBack = ()=> {
        if (this.state.isChange) {
            console.log('已经修改，请确认')
        } else {
            this.props.history.goBack()
        }
    }
    render() {
        return (
            <Content className="content">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item style={{cursor: 'pointer'}} onClick={this.turnBack}>脚本管理</Breadcrumb.Item>
                    <Breadcrumb.Item>{this.props.location.state.newSegment ? '新建脚本段' : '编辑脚本段'}</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content-container">
                    <FetchSegments fetchTestConf={this.props.fetchTestConf} ScriptIndex={this.refs.ScriptIndex}/>
                    <Button type='primary' onClick={()=>{this.setState({saveModal:true})}}>{this.props.location.state.newSegment ?'保存' :'保存修改'}</Button>
                    <ScriptIndex ref="ScriptIndex" isNew={this.props.location.state.newSegment} {...this.props} json={this.state.segmentJson}/>
                </div>
                <Modal
                    key={ Date.parse(new Date())}
                    visible={this.state.saveModal}
                    title={this.props.location.state.newSegment ? '新建脚本段' : '编辑脚本段'}
                    onCancel={()=> {
                        this.setState({saveModal: false})
                    }}
                    footer={[
                        <Button key="back" type="ghost" size="large"
                                onClick={()=> {
                                    this.setState({saveModal: false})
                                }}>取消</Button>,
                        <Button key="submit" type="primary" size="large" onClick={this.saveCode}>
                            保存
                        </Button>,
                    ]}
                >
                    <Input defaultValue={this.props.location.state.name} ref="scriptCodeNmae" onChange={this.changeSaveName} placeholder="Basic usage" />
                </Modal>
            </Content>
        )
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
export default connect(mapStateToProps, mapDispatchToProps)(AddProgramSegment);