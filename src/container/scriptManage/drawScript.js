/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import {Breadcrumb, Layout,message} from 'antd';
import DrawScriptCof from './drawScriptCof'
import './drawScript.less';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import {getHeader,converErrorCodeToMsg} from './../../common/common.js';
import configJson from './../../common/config.json';
import axios from 'axios';
import messageJson from './../../common/message.json';

import ScriptIndex from './scriptIndex.js'
import FetchSegments from './fetchSegments'
const {Content,} = Layout;


class DrawScript extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scriptJson:'{}',
            editRecord:null
        };
    }

     componentDidMount () {
        if (!this.props.location.state.newScript) {
            localStorage.setItem('manageScriptId',this.props.location.state.editRecord.id);
            this.fetchScript(this.props.location.state.editRecord.id, this.refs.ScriptIndex.init)
        }else{
            this.refs.ScriptIndex.init()
        }

        this.props.fetchAllTestType();
        this.props.fetchAllParts();
        this.props.fetchAllHardwareVersions();
        this.props.fetchAllSegments();
    }
    fetchScript=(id,cb)=>{
        const that=this
        axios({
            url: `${configJson.prefix}/test_scripts/${id}`,
            method: 'get',
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    scriptJson:response.data.content,
                    editRecord:response.data
                });
                if(cb) cb();
            }).catch(function (error) {
            console.log('获取出错',error);
        })
    }

    saveScript = ()=> {

        let myDiagram=this.refs.ScriptIndex.callbackDiagram();
        const that=this
        const DrawScriptCof = this.refs.DrawScriptCofForm.getFieldsValue();
        const content=JSON.parse( myDiagram.model.toJson());
        for(let i=0,len=content.linkDataArray.length;i<len;i++){
            delete  content.linkDataArray[i].points
        }
        const url=this.props.location.state.newScript ?`/test_scripts`:`/test_scripts/${this.props.match.params.id}`
        const method=this.props.location.state.newScript ?`POST`:`PUT`;
        const msg=this.props.location.state.newScript ?messageJson[`add script success`]:messageJson[`edit script success`];
        axios({
            url: `${configJson.prefix}${url}`,
            method: method,
            data: {
                name:DrawScriptCof.name,
                test_type_id:DrawScriptCof.test_type_id?DrawScriptCof.test_type_id.key:'',
                part_id:DrawScriptCof.part_id?DrawScriptCof.part_id.key:'',
                hardware_version_id:DrawScriptCof.hardware_version_id?DrawScriptCof.hardware_version_id.key:'',
                content: JSON.stringify(content),
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                message.success(msg);
                that.setState({
                    editRecord:response.data
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
                    <Breadcrumb.Item>{this.props.location.state.newScript ? '新建脚本' : `编辑'${this.state.editRecord? this.state.editRecord.name: ''}'`}</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content-container">
                    <div className="testing-header">
                        <DrawScriptCof ref="DrawScriptCofForm"  {...this.props} {...this.state}/>
                        <div className="testing-start">
                            <div className="testing-start-btn testing-save-btn" onClick={this.saveScript}>
                                保存脚本
                            </div>
                        </div>
                    </div>
                    <FetchSegments fetchTestConf={this.props.fetchTestConf} ScriptIndex={this.refs.ScriptIndex}/>
                    <ScriptIndex ref="ScriptIndex" {...this.props} isNew={this.props.location.state.newScript} json={this.state.scriptJson}/>
                </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(DrawScript);