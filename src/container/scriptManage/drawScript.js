/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import {Breadcrumb, Layout,message,Icon} from 'antd';
import DrawScriptCof from './drawScriptCof'
import './drawScript.less';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import {getHeader,converErrorCodeToMsg,delPointsInLink} from './../../common/common.js';
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
            if(this.props.fetchTestConf.scriptLoaded){
                this.refs.ScriptIndex.init()
                this.refs.ScriptIndex.load(sessionStorage.getItem('resultTempJson'));
            }else{
                this.props.fetchDrawScript(this.props.location.state.editRecord.id, this.refs.ScriptIndex.init)
            }
        }else{
            this.props.delEditRecord();
            this.refs.ScriptIndex.init()
        }
        this.props.fetchAllTestType();
        this.props.fetchAllParts();
        this.props.fetchAllHardwareVersions();
        this.props.fetchAllSegments();
    }

    saveScript = ()=> {

        let myDiagram=this.refs.ScriptIndex.callbackDiagram();
        const that=this
        const DrawScriptCof = this.refs.DrawScriptCofForm.getFieldsValue();
        const content=JSON.parse( myDiagram.model.toJson());
        delPointsInLink(content.linkDataArray)
        // for(let i=0,len=content.linkDataArray.length;i<len;i++){
        //     delete  content.linkDataArray[i].points
        // }
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
    saveTempScript=()=>{
        let myDiagram=this.refs.ScriptIndex.callbackDiagram();
        const resultTempJson=JSON.parse( myDiagram.model.toJson());
        delPointsInLink(resultTempJson.linkDataArray);
        console.log("临时保存",resultTempJson);
        sessionStorage.setItem('resultTempJson',JSON.stringify(resultTempJson));
        // sessionStorage.setItem('originJson',JSON.stringify(resultTempJson))
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
                    <Breadcrumb.Item>{this.props.location.state.newScript ? '新建脚本' : `编辑'${this.props.fetchTestConf.editRecord? this.props.fetchTestConf.editRecord.name: ''}'`}</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content-container">
                    <div className="testing-header">
                        <div className="testing-start">
                            <div className="testing-start-btn  testing-save-btn">
                                <Icon type="arrow-left" />
                            </div>
                        </div>
                        <DrawScriptCof ref="DrawScriptCofForm"  {...this.props}/>
                        <div className="testing-start">
                            <div className="testing-start-btn testing-save-btn" onClick={this.saveScript}>
                                保存脚本
                            </div>
                        </div>
                    </div>
                    <FetchSegments fetchTestConf={this.props.fetchTestConf} ScriptIndex={this.refs.ScriptIndex}/>
                    <ScriptIndex saveTempScript={this.saveTempScript} ref="ScriptIndex" {...this.props} isNew={this.props.location.state.newScript} json={this.props.fetchTestConf.scriptJson}/>
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