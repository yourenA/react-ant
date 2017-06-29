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
            detailJson: localStorage.getItem('detailJon'),
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
        // this.setState({
        //     [this.props.match.params.id]: localStorage.getItem('detailJon')
        // }, function () {
        //     console.log("this.state",this.state)
        // })
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
            const idJson = JSON.parse(sessionStorage.getItem(nextProps.match.params.id));
            for (let i = 0, len = idJson.nodeDataArray.length; i < len; i++) {
                if (idJson.nodeDataArray[i].isGroup === true) {
                    console.log('存在分组')
                    if (sessionStorage.getItem(idJson.nodeDataArray[i].key)) {
                        idJson.nodeDataArray.push(..._.differenceWith(JSON.parse(sessionStorage.getItem(idJson.nodeDataArray[i].key)).nodeDataArray, idJson.nodeDataArray,function (a,b) {
                            return (a.key === b.key)
                        }));
                        idJson.linkDataArray.push(..._.differenceWith(JSON.parse(sessionStorage.getItem(idJson.nodeDataArray[i].key)).linkDataArray, idJson.linkDataArray,function (a,b) {
                            return (a.from === b.from &&  a.to === b.to)
                        }))
                    }
                }
            }
            sessionStorage.setItem(nextProps.match.params.id, JSON.stringify(idJson))
            console.log("idJson", idJson)
            this.refs.ScriptIndex.load(idJson);

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

        console.log('resultTempJson',originJson)
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
        console.log("修改后resultTempJson", resultTempJson);
        sessionStorage.setItem('resultTempJson', JSON.stringify(resultTempJson));
        if(returnJson){
            return resultTempJson
        }
        if(canBack){
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
                                 json={this.state.detailJson}/>
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