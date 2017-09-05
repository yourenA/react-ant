/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import {Breadcrumb, Layout, Modal,Button,message} from 'antd';
import './drawScript.less';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import {getHeader, delPointsInLink,converErrorCodeToMsg,checkJSon,transformPrintJson} from './../../common/common.js';
import configJson from 'configJson' ;
import axios from 'axios';
import messageJson from './../../common/message.json';
import AddOrEditName from './addOrEditNmae';
import FetchSegments from './fetchSegments'
import ScriptIndex from './scriptIndex.js'
import ScriptInfo from './scriptInfo';
import ScriptErrorInfo from './scriptErrorInfo'
const _ = require('lodash');
const {Content,} = Layout;

class DrawScriptDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            segmentsJson: '{}',
            detailIndex: 0,
            editRecord: null,
            saveScriptModal:false,
            returnMsg:JSON.parse(sessionStorage.getItem('returnMsg'))
        };
    }

    componentDidMount() {
        this.props.fetchAllTestType();
        this.props.fetchAllHardwareVersions();
        this.props.fetchAllSegments();
        this.props.fetchAllProducts()
        this.refs.ScriptIndex.init(this.refs.ScriptIndex.load,sessionStorage.getItem(this.props.match.params.id));
        if (!this.props.location.state.newScript) {
            this.fetchScript(sessionStorage.getItem('manageScriptId'))
        }
         if(!sessionStorage.getItem('breadcrumbArr')){
            sessionStorage.setItem('breadcrumbArr',JSON.stringify([{key:this.props.match.params.id,value:this.props.location.state.groupNmae}]))
        }
    }

    fetchScript = (id, cb)=> {
        const that = this
        axios({
            url: `${configJson.prefix}/test_scripts/${id}`,
            method: 'get',
            headers: getHeader()
        })
            .then(function (response) {
                // console.log(response);
                that.setState({
                    scriptJson: response.data.content,
                    editRecord: response.data
                });
                if (cb) cb();
            }).catch(function (error) {
            console.log('获取出错', error);
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.id !== nextProps.match.params.id) {
            // const breadcrumbArr=JSON.parse(sessionStorage.getItem('breadcrumbArr'));
            // let theSameBreadcrumIndex=0;
            // for(let i=0,len=breadcrumbArr.length;i<len;i++){
            //     if(breadcrumbArr[i].key===nextProps.match.params.id){
            //         theSameBreadcrumIndex=i+1
            //     }
            // }
            // if(theSameBreadcrumIndex===0){
            //     sessionStorage.setItem('breadcrumbArr',JSON.stringify(breadcrumbArr.concat({key:nextProps.match.params.id,value:nextProps.location.state.groupNmae})));
            // }else{
            //     breadcrumbArr.splice(theSameBreadcrumIndex,breadcrumbArr.length)
            //     sessionStorage.setItem('breadcrumbArr',JSON.stringify(breadcrumbArr));
            // }

            this.refs.ScriptIndex.delDiagram();
            this.refs.ScriptIndex.init();
            // console.log("this.state",this.state)
            // this.refs.ScriptIndex.load(this.state[nextProps.match.params.id]);
            //加了||使后退不会出错
            const preSessionJson=JSON.parse(sessionStorage.getItem(`pre-${this.props.match.params.id}`))||JSON.parse(sessionStorage.getItem(this.props.match.params.id));

            let nextPropsIdJson = JSON.parse(sessionStorage.getItem(nextProps.match.params.id));
            const thisPropsIdJson=JSON.parse(sessionStorage.getItem(this.props.match.params.id));
            // console.log("nextProps.match.params.id",nextProps.match.params.id,JSON.parse(sessionStorage.getItem(nextProps.match.params.id)))

            if(this.props.history.action==='POP'){
                // console.log('POP');
                const scriptDiagramStorage=JSON.parse(sessionStorage.getItem('scriptDiagramStorage'));
                for(let i=0,len=scriptDiagramStorage.length;i<len;i++){
                    let sessionJson=JSON.parse(sessionStorage.getItem(scriptDiagramStorage[i]));
                    let intersectJsonNode=_.differenceWith(preSessionJson.nodeDataArray,thisPropsIdJson.nodeDataArray,function (a,b) {
                        return (a.key === b.key)
                    })
                    let intersectJsonLink=_.differenceWith(preSessionJson.linkDataArray,thisPropsIdJson.linkDataArray,_.isEqual)
                    if(intersectJsonNode.length){
                        sessionJson.nodeDataArray=_.differenceWith(sessionJson.nodeDataArray,intersectJsonNode,function (a,b) {
                            return (a.key === b.key)
                        });
                        sessionStorage.setItem(scriptDiagramStorage[i],JSON.stringify(sessionJson))
                    }
                    if(intersectJsonLink.length){
                        sessionJson.linkDataArray=_.differenceWith(sessionJson.linkDataArray,intersectJsonLink,_.isEqual);
                        sessionStorage.setItem(scriptDiagramStorage[i],JSON.stringify(sessionJson))
                    }
                }
                nextPropsIdJson.nodeDataArray=_.differenceWith(nextPropsIdJson.nodeDataArray, preSessionJson.nodeDataArray,function (a,b) {
                    return (a.key === b.key)
                }).concat(thisPropsIdJson.nodeDataArray)

                nextPropsIdJson.linkDataArray=_.differenceWith(nextPropsIdJson.linkDataArray, preSessionJson.linkDataArray,_.isEqual)
                    .concat(thisPropsIdJson.linkDataArray);
            }

            nextPropsIdJson=transformPrintJson(nextPropsIdJson);
            sessionStorage.setItem(nextProps.match.params.id, JSON.stringify(nextPropsIdJson));

            // console.log("nextPropsIdJson", nextPropsIdJson)
            this.refs.ScriptIndex.load(nextPropsIdJson);
        }
    }
    getErrorInfo=()=>{
        const content=this.saveTempScript(false,true,true);
        let  canSave=checkJSon(content);
        this.setState({
            returnMsg:canSave.returnMsg
        })
        sessionStorage.setItem('returnMsg',JSON.stringify(canSave.returnMsg))
    }
    saveScript = ()=> {
        const that=this
        const DrawScriptCof = this.refs.DrawScriptCofForm.getFieldsValue();
        let content=this.saveTempScript(false,true);
        content=transformPrintJson(content);
        delPointsInLink(content.linkDataArray);
        const newScript=!this.state.editRecord
        const url= newScript?`/test_scripts`:`/test_scripts/${sessionStorage.getItem('manageScriptId')}`;
        const method=newScript ?`POST`:`PUT`;
        const msg=newScript ?messageJson[`add script success`]:messageJson[`edit script success`];
        axios({
            url: `${configJson.prefix}${url}`,
            method: method,
            data: {
                name:DrawScriptCof.name,
                test_type_id:DrawScriptCof.test_type_id?DrawScriptCof.test_type_id.key:'',
                hardware_version_id:DrawScriptCof.hardware_version_id?DrawScriptCof.hardware_version_id.key:'',
                content: JSON.stringify(content),
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                message.success(msg);
                newScript
                    ? setTimeout(function () {
                    that.props.history.replace({pathname:`/scriptManage`})
                },1000)
                    : that.fetchScript(sessionStorage.getItem('manageScriptId'));



                that.setState({
                    saveScriptModal:false
                })
            }).catch(function (error) {
            console.log('获取出错',error);
            converErrorCodeToMsg(error)
        })
    }
    saveTempScript = (canBack,returnJson,noSetSession)=> {
        const originJson = JSON.parse(sessionStorage.getItem('resultTempJson'));//总的数据
        const nowJson = JSON.parse(sessionStorage.getItem(this.props.match.params.id));//获取页面进入前的数据
        let changeJson = JSON.parse(this.refs.ScriptIndex.callbackJson());//修改后的数据
        for (let i = 0, len = changeJson.nodeDataArray.length; i < len; i++) {
            if (!changeJson.nodeDataArray[i].group) {
                changeJson.nodeDataArray[i].group = this.props.match.params.id
            }
        }
        delPointsInLink(changeJson.linkDataArray);
        if(!noSetSession){
            sessionStorage.setItem(this.props.match.params.id, JSON.stringify(changeJson))
        }

        let resultNodeJson = _.differenceWith(originJson.nodeDataArray, nowJson.nodeDataArray,function (a,b) {
            return (a.key === b.key)
        }).concat(changeJson.nodeDataArray);

        let resultLinkJson = _.differenceWith(originJson.linkDataArray, nowJson.linkDataArray, _.isEqual).concat(changeJson.linkDataArray);
        for (let j = 0, len = resultLinkJson.length; j < len; j++) {
            delete  resultLinkJson[j].points
        }
        //重新生成json的时候需要添加copiesArrays: true,copiesArrayObjects: true,不然数据就会相互影响
        let resultTempJson = {
            class: "go.GraphLinksModel",
            copiesArrays: true,
            copiesArrayObjects: true,
            linkFromPortIdProperty: "fromPort",
            linkToPortIdProperty: "toPort",
            nodeDataArray: resultNodeJson,
            linkDataArray: resultLinkJson
        };
        if(!noSetSession){
            sessionStorage.setItem('resultTempJson', JSON.stringify(resultTempJson));//修改后总的数据
        }
        if(returnJson){
            return resultTempJson
        }
        if(canBack){
            sessionStorage.setItem(`pre-${this.props.match.params.id}`, JSON.stringify(nowJson));
            const scriptDiagramStorage=JSON.parse(sessionStorage.getItem('scriptDiagramStorage'));
            if( Array.indexOf(scriptDiagramStorage, `pre-${this.props.match.params.id}`)===-1){
                scriptDiagramStorage.push(`pre-${this.props.match.params.id}`)
                sessionStorage.setItem('scriptDiagramStorage',JSON.stringify(scriptDiagramStorage))
            }

            const scriptStorage=JSON.parse(sessionStorage.getItem('scriptStorage'));
            if( Array.indexOf(scriptStorage, `pre-${this.props.match.params.id}`)===-1){
                scriptStorage.push(`pre-${this.props.match.params.id}`)
                sessionStorage.setItem('scriptStorage',JSON.stringify(scriptStorage))
            }
            this.props.history.goBack()
        }
    }
    turnBack = ()=> {
        this.getErrorInfo();
        this.saveTempScript(true)
    }

    render() {
        const breadcrumbArr=JSON.parse(sessionStorage.getItem('breadcrumbArr'))||[];
        return (
            <Content className="content">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item >脚本管理</Breadcrumb.Item>
                    <Breadcrumb.Item>{this.state.editRecord ?`编辑脚本'${ this.state.editRecord.name}'`  :'新建脚本' }</Breadcrumb.Item>
                    {/*{breadcrumbArr.map((item,index)=>{
                        return(
                            <Breadcrumb.Item key={index}>{item.value}</Breadcrumb.Item>
                        )
                    })}*/}
                </Breadcrumb>
                <div className="content-container">
                    <ScriptInfo />
                    <div className="testing-header">
                        <div className="testing-start">
                            <div className="testing-start-btn  testing-save-btn" onClick={()=>{
                                this.turnBack()
                            }}>
                                后退
                            </div>
                        </div>
                        <div className="testing-start">
                            <div className="testing-start-btn testing-save-btn" onClick={()=>{
                                const content=this.saveTempScript(false,true);
                                let  canSave=checkJSon(content);
                                this.setState({
                                    returnMsg:canSave.returnMsg
                                })
                                sessionStorage.setItem('returnMsg',JSON.stringify(canSave.returnMsg))
                                if(canSave.returnCode===-1){
                                    message.error('脚本存在错误，不能保存，请查看错误信息');
                                    return false
                                }
                                this.setState({
                                    saveScriptModal:true
                                })
                            }}>
                                保存脚本
                            </div>
                        </div>
                    </div>
                    <FetchSegments fetchTestConf={this.props.fetchTestConf} ScriptIndex={this.refs.ScriptIndex}/>
                    <ScriptIndex getErrorInfo={this.getErrorInfo} saveTempScript={this.saveTempScript} ref="ScriptIndex"  {...this.props} isNew={true} fromNew={this.state.editRecord?false:true}
                                 turnBack={this.turnBack}/>
                    <ScriptErrorInfo returnMsg={this.state.returnMsg} getErrorInfo={this.getErrorInfo}/>
                </div>
                <Modal
                    key={ Date.parse(new Date())}
                    visible={this.state.saveScriptModal}
                    title={this.props.location.state.newScript ? '新建脚本' : `编辑'${this.props.fetchTestConf.editRecord? this.props.fetchTestConf.editRecord.name: ''}'`}
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
                    <AddOrEditName ref="DrawScriptCofForm" fetchTestConf={this.props.fetchTestConf} editRecord={this.state.editRecord}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(DrawScriptDetail);