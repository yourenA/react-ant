/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import {Breadcrumb, Layout, message, Modal, Button} from 'antd';
import './drawScript.less';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import {getHeader, converErrorCodeToMsg, delPointsInLink,checkJSon,transformPrintJson,setPointsNamespace} from './../../common/common.js';
import configJson from 'configJson' ;
import axios from 'axios';
import messageJson from './../../common/message.json';
import AddOrEditName from './addOrEditNmae';
import ScriptIndex from './scriptIndex.js'
import FetchSegments from './fetchSegments'
import ScriptInfo from './scriptInfo';
import uuidv4 from 'uuid/v4';
import ScriptErrorInfo from './scriptErrorInfo'
import './../hardwareTest/hardwareTesting.less'
const _ = require('lodash');
const {Content,} = Layout;
const confirm = Modal.confirm;

class DrawScript extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scriptJson: '{}',
            editRecord: null,
            returnMsg:sessionStorage.getItem('returnMsg')?JSON.parse(sessionStorage.getItem('returnMsg')):[]
        };
    }

    componentDidMount() {
        if (!this.props.location.state.newScript) {
            sessionStorage.setItem('manageScriptId', this.props.location.state.editRecord.id);
            if (this.props.fetchTestConf.scriptLoaded){
                const  transformJson=transformPrintJson(JSON.parse(sessionStorage.getItem('resultTempJson')));
                this.refs.ScriptIndex.init(this.refs.ScriptIndex.load, JSON.stringify(transformJson));
                this.props.fetchDrawScript(this.props.location.state.editRecord.id)
            } else {
                this.props.fetchDrawScript(this.props.location.state.editRecord.id, this.refs.ScriptIndex.init)
            }
        } else {
            this.props.delEditRecord();
            this.refs.ScriptIndex.init();
            if (sessionStorage.getItem('resultTempJson')) {
                const  transformJson=transformPrintJson(JSON.parse(sessionStorage.getItem('resultTempJson')));
                this.refs.ScriptIndex.load(JSON.stringify(transformJson))
            } else {
                const myDiagramDiv=document.querySelector('#myDiagramDiv');
                this.refs.ScriptIndex.load(JSON.stringify({
                    class: "go.GraphLinksModel",
                    linkFromPortIdProperty: "fromPort",
                    linkToPortIdProperty: "toPort",
                    copiesArrays: true,
                    copiesArrayObjects: true,
                    nodeDataArray: [{category: "start", key: uuidv4(), title: "开始", loc: "0 0", isPrint: true}, {
                        category: "end",
                        key: uuidv4(),
                        title: "结束",
                        loc: `${myDiagramDiv.offsetWidth-80} ${myDiagramDiv.offsetHeight-80}`,
                        isPrint: true
                    }],
                    // nodeDataArray: [],
                    linkDataArray: []
                }))
            }
        }
        this.props.fetchAllTestType();
        this.props.fetchAllHardwareVersions();
        this.props.fetchAllSegments();
        this.props.fetchAllProducts();
        sessionStorage.removeItem('breadcrumbArr')
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.id !== nextProps.match.params.id) {
            this.refs.ScriptIndex.delDiagram();
            this.props.fetchDrawScript(nextProps.location.state.editRecord.id, this.refs.ScriptIndex.init)
        }
    }
    getErrorInfo=()=>{
        let myDiagram = this.refs.ScriptIndex.callbackDiagram();
        const content = JSON.parse(myDiagram.model.toJson());
        let  canSave=checkJSon(content);
        this.setState({
            returnMsg:canSave.returnMsg
        })
        sessionStorage.setItem('returnMsg',JSON.stringify(canSave.returnMsg))
    }
    saveScript = ()=> {
        let myDiagram = this.refs.ScriptIndex.callbackDiagram();
        const that = this
        const DrawScriptCof = this.refs.DrawScriptCofForm.getFieldsValue();
        const content = JSON.parse(myDiagram.model.toJson());
        delPointsInLink(content.linkDataArray);
        setPointsNamespace(content.nodeDataArray);
        const newScript = this.props.location.state.newScript
        const url = newScript ? `/test_scripts` : `/test_scripts/${this.props.match.params.id}`
        const method = newScript ? `POST` : `PUT`;
        const msg = newScript ? messageJson[`add script success`] : messageJson[`edit script success`];
       axios({
            url: `${configJson.prefix}${url}`,
            method: method,
            data: {
                name: DrawScriptCof.name,
                test_type_id: DrawScriptCof.test_type_id ? DrawScriptCof.test_type_id.key : '',
                hardware_version_id: DrawScriptCof.hardware_version_id ? DrawScriptCof.hardware_version_id.key : '',
                content: JSON.stringify(content),
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                message.success(msg);
                newScript
                    ? setTimeout(function () {
                    that.props.history.replace({pathname: `/scriptManage`})
                }, 1000)
                    : that.props.fetchDrawScript(that.props.match.params.id);

                that.setState({
                    saveScriptModal: false
                })
                // that.refs.ScriptIndex.setHadEditFalse()
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    saveTempScript = ()=> {

        let myDiagram = this.refs.ScriptIndex.callbackDiagram();
        const resultTempJson = JSON.parse(myDiagram.model.toJson());
        delPointsInLink(resultTempJson.linkDataArray);
        sessionStorage.setItem('resultTempJson', JSON.stringify(resultTempJson));

        const scriptDiagramStorage=JSON.parse(sessionStorage.getItem('scriptDiagramStorage'))||[];
        if( Array.indexOf(scriptDiagramStorage, `resultTempJson`)===-1){
            scriptDiagramStorage.push(`resultTempJson`)
            sessionStorage.setItem('scriptDiagramStorage',JSON.stringify(scriptDiagramStorage))
        }

        const scriptStorage=JSON.parse(sessionStorage.getItem('scriptStorage'))||[];
        if( Array.indexOf(scriptStorage, `resultTempJson`)===-1){
            scriptStorage.push(`resultTempJson`)
            sessionStorage.setItem('scriptStorage',JSON.stringify(scriptStorage))
        }
    }
    turnBack = ()=> {
        const that = this;
        confirm({
            title: '如果放弃保存，修改的内容将会丢失',
            okText: '直接退出',
            cancelText: '取消',
            maskClosable:true,
            onOk() {
                that.props.history.goBack()
            },
            onCancel() {
                // that.props.history.goBack()
            },
        });
    }

    render() {
        return (
            <Content className="content">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item  >脚本管理</Breadcrumb.Item>
                    <Breadcrumb.Item>{this.props.location.state.newScript ? '新建脚本' : `编辑脚本'${this.props.fetchTestConf.editRecord ? this.props.fetchTestConf.editRecord.name : ''}'`}</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content-container " style={{paddingBottom:0}}>
                    <ScriptInfo />
                    <div className="testing-header">
                        <div className="testing-start">
                            <div className="testing-start-btn  testing-save-btn" onClick={this.turnBack}>
                                退出
                            </div>
                        </div>
                        <div className="testing-start">
                            <div className="testing-start-btn testing-save-btn" onClick={()=> {
                                let myDiagram = this.refs.ScriptIndex.callbackDiagram();
                                const content = JSON.parse(myDiagram.model.toJson());
                                let  canSave=checkJSon(content);
                                this.setState({
                                    returnMsg:canSave.returnMsg
                                })
                                sessionStorage.setItem('returnMsg',JSON.stringify(canSave.returnMsg))
                                if(canSave.returnCode===-1){
                                    message.error('脚本存在错误，不能保存，请查看错误信息');
                                    return false;
                                }
                                this.setState({
                                    saveScriptModal: true
                                })
                            }}>
                                保存脚本
                            </div>
                        </div>
                    </div>
                    <FetchSegments fetchTestConf={this.props.fetchTestConf} ScriptIndex={this.refs.ScriptIndex}/>
                    <ScriptIndex  getErrorInfo={this.getErrorInfo}
                                 saveTempScript={this.saveTempScript} ref="ScriptIndex" {...this.props}
                                 fromNew={this.props.location.state.newScript ? true : false}
                                 isNew={this.props.location.state.newScript}
                                 json={this.props.fetchTestConf.scriptJson}/>
                    <ScriptErrorInfo returnMsg={this.state.returnMsg} getErrorInfo={this.getErrorInfo}/>
                </div>
                <Modal
                    visible={this.state.saveScriptModal}
                    title={this.props.location.state.newScript ? '新建脚本' : `编辑'${this.props.fetchTestConf.editRecord ? this.props.fetchTestConf.editRecord.name : ''}'`}
                    onCancel={()=> {
                        this.setState({saveScriptModal: false})
                    }}
                    footer={[
                        <Button key="back" type="ghost" size="large"
                                onClick={()=> {
                                    this.setState({saveScriptModal: false})
                                }}>取消</Button>,
                        <Button key="submit" type="primary" size="large" onClick={this.saveScript}>
                            保存
                        </Button>,
                    ]}
                >
                    <AddOrEditName ref="DrawScriptCofForm" fetchTestConf={this.props.fetchTestConf}
                                   editRecord={this.props.fetchTestConf.editRecord}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(DrawScript);