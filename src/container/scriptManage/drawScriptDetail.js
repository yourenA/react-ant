/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import {Breadcrumb, Layout, Icon,Modal,Button,message} from 'antd';
import './drawScript.less';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import {getHeader, delPointsInLink,converErrorCodeToMsg} from './../../common/common.js';
import configJson from './../../common/config.json';
import axios from 'axios';
import messageJson from './../../common/message.json';
import AddOrEditName from './addOrEditNmae';
import FetchSegments from './fetchSegments'
import ScriptIndex from './scriptIndex.js'
const _ = require('lodash');
const {Content,} = Layout;

class DrawScriptDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            segmentsJson: '{}',
            detailIndex: 0,
            editRecord: null,
            saveScriptModal:false
        };
    }

    componentDidMount() {
        this.props.fetchAllTestType();
        this.props.fetchAllHardwareVersions();
        this.props.fetchAllSegments();
        this.refs.ScriptIndex.init(this.refs.ScriptIndex.load,sessionStorage.getItem(this.props.match.params.id));
        this.fetchScript(localStorage.getItem('manageScriptId'))
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

            this.refs.ScriptIndex.delDiagram();
            this.refs.ScriptIndex.init();
            // console.log("this.state",this.state)
            // this.refs.ScriptIndex.load(this.state[nextProps.match.params.id]);
            const preSessionJson=JSON.parse(sessionStorage.getItem(`pre-${this.props.match.params.id}`));

            const nextPropsIdJson = JSON.parse(sessionStorage.getItem(nextProps.match.params.id));
            const thisPropsIdJson=JSON.parse(sessionStorage.getItem(this.props.match.params.id));
            console.log("this.props.match.params.id",this.props.match.params.id,thisPropsIdJson)
            console.log("nextProps.match.params.id",nextProps.match.params.id,JSON.parse(sessionStorage.getItem(nextProps.match.params.id)))

            if(this.props.history.action==='POP'){
                console.log('POP');
                for(let i=0,len=sessionStorage.length;i<len;i++){
                    console.log(sessionStorage.key(i))
                    let sessionJson=JSON.parse(sessionStorage.getItem(sessionStorage.key(i)));
                    let intersectJsonNode=_.differenceWith(preSessionJson.nodeDataArray,thisPropsIdJson.nodeDataArray,function (a,b) {
                        return (a.key === b.key)
                    })
                    let intersectJsonLink=_.differenceWith(preSessionJson.linkDataArray,thisPropsIdJson.linkDataArray,_.isEqual)
                    if(intersectJsonNode.length){
                        sessionJson.nodeDataArray=_.differenceWith(sessionJson.nodeDataArray,intersectJsonNode,function (a,b) {
                            return (a.key === b.key)
                        });
                        sessionStorage.setItem(sessionStorage.key(i),JSON.stringify(sessionJson))
                    }
                    if(intersectJsonLink.length){
                        sessionJson.linkDataArray=_.differenceWith(sessionJson.linkDataArray,intersectJsonLink,_.isEqual);
                        sessionStorage.setItem(sessionStorage.key(i),JSON.stringify(sessionJson))
                    }
                }
                nextPropsIdJson.nodeDataArray=_.differenceWith(nextPropsIdJson.nodeDataArray, preSessionJson.nodeDataArray,function (a,b) {
                    return (a.key === b.key)
                }).concat(thisPropsIdJson.nodeDataArray)

                nextPropsIdJson.linkDataArray=_.differenceWith(nextPropsIdJson.linkDataArray, preSessionJson.linkDataArray,_.isEqual)
                    .concat(thisPropsIdJson.linkDataArray);
            }

            sessionStorage.setItem(nextProps.match.params.id, JSON.stringify(nextPropsIdJson))
            console.log("nextPropsIdJson", nextPropsIdJson)
            this.refs.ScriptIndex.load(nextPropsIdJson);

        }
    }
    saveScript = ()=> {
        const that=this
        const DrawScriptCof = this.refs.DrawScriptCofForm.getFieldsValue();
        const content=this.saveTempScript(false,true);
        console.log('content',content)
        delPointsInLink(content.linkDataArray)
        const url= `/test_scripts/${localStorage.getItem('manageScriptId')}`;
        const method=`PUT`;
        const msg=messageJson[`edit script success`];
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
                that.fetchScript(localStorage.getItem('manageScriptId'));

                that.setState({
                    saveScriptModal:false
                })
            }).catch(function (error) {
            console.log('获取出错',error);
            converErrorCodeToMsg(error)
        })
    }
    saveTempScript = (canBack,returnJson)=> {
        const originJson = JSON.parse(sessionStorage.getItem('resultTempJson'));
        const nowJson = JSON.parse(sessionStorage.getItem(this.props.match.params.id));
        let changeJson = JSON.parse(this.refs.ScriptIndex.callbackJson());
        for (let i = 0, len = changeJson.nodeDataArray.length; i < len; i++) {
            if (!changeJson.nodeDataArray[i].group) {
                changeJson.nodeDataArray[i].group = this.props.match.params.id
            }
        }
        delPointsInLink(changeJson.linkDataArray);
        sessionStorage.setItem(this.props.match.params.id, JSON.stringify(changeJson))

        console.log('nowJson',nowJson)
        console.log('changeJson',changeJson)
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
            nodeDataArray: resultNodeJson,
            linkDataArray: resultLinkJson
        };
        sessionStorage.setItem('resultTempJson', JSON.stringify(resultTempJson));
        if(returnJson){
            return resultTempJson
        }
        if(canBack){
            sessionStorage.setItem(`pre-${this.props.match.params.id}`, JSON.stringify(nowJson))
            this.props.history.goBack()
        }
    }
    turnBack = ()=> {
        this.props.history.push('/scriptManage')
    }

    render() {
        return (
            <Content className="content">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item style={{cursor: 'pointer'}} onClick={this.turnBack}>脚本管理</Breadcrumb.Item>
                    <Breadcrumb.Item>{this.props.location.state.newScript ? '新建脚本' : `编辑'${this.state.editRecord? this.state.editRecord.name: ''}'`}</Breadcrumb.Item>
                    <Breadcrumb.Item>修改脚本"{this.props.location.state.groupNmae}"</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content-container">
                    <div className="testing-header">
                        <div className="testing-start">
                            <div className="testing-start-btn  testing-save-btn" onClick={()=>this.saveTempScript(true)}>
                                <Icon type="arrow-left"/>
                            </div>
                        </div>
                        <div className="testing-start">
                            <div className="testing-start-btn testing-save-btn" onClick={()=>{
                                this.setState({
                                    saveScriptModal:true
                                })
                            }}>
                                保存脚本
                            </div>
                        </div>
                    </div>
                    <FetchSegments fetchTestConf={this.props.fetchTestConf} ScriptIndex={this.refs.ScriptIndex}/>
                    <ScriptIndex saveTempScript={this.saveTempScript} ref="ScriptIndex"  {...this.props} isNew={true}
                                />
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