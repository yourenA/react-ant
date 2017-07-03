/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import {Breadcrumb, Layout,Input , Button,Modal,message,Icon} from 'antd';
import './drawScript.less';
import ScriptIndex from './scriptIndex.js'
import axios from 'axios'
import configJson from './../../common/config.json';
import {getHeader,converErrorCodeToMsg,delPointsInLink} from './../../common/common';
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
            localStorage.setItem('manageSegmentId',this.props.location.state.editRecord.id);
            // this.fetchScript(this.props.location.state.editRecord.id,this.refs.ScriptIndex.init)
            if(this.props.fetchTestConf.segmentLoaded){
                this.refs.ScriptIndex.init(this.refs.ScriptIndex.load,sessionStorage.getItem('segmentTempJson'));
                this.props.fetchDrawScript(this.props.location.state.editRecord.id)
            }else{
                this.props.fetchDrawScript(this.props.location.state.editRecord.id, this.refs.ScriptIndex.init)
            }

        }else{
            // this.refs.ScriptIndex.init()
            this.props.delSegmentEditRecord();
            this.refs.ScriptIndex.init();
            if(sessionStorage.getItem('segmentTempJson')){
                this.refs.ScriptIndex.load(sessionStorage.getItem('segmentTempJson'))
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.id !== nextProps.match.params.id) {
            this.refs.ScriptIndex.delDiagram();
            this.props.fetchDrawScript(nextProps.location.state.editRecord.id, this.refs.ScriptIndex.init)
        }
    }
    saveCode=()=>{
        let myDiagram=this.refs.ScriptIndex.callbackDiagram();
        const that=this;
        this.refs.ScriptIndex.save();
        const content=JSON.parse( myDiagram.model.toJson());
        delPointsInLink(content.linkDataArray)
        const newScript=this.props.location.state.newSegment
        const url=newScript ?`/flow_diagrams`:`/flow_diagrams/${this.props.match.params.id}`
        const method=newScript ?`post`:`put`;
        const meg=newScript ?messageJson[`add segment success`]:messageJson[`edit segment success`];
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
    saveTempScript=()=>{
        let myDiagram=this.refs.ScriptIndex.callbackDiagram();
        const segmentTempJson=JSON.parse( myDiagram.model.toJson());
        delPointsInLink(segmentTempJson.linkDataArray);
        console.log("临时保存",segmentTempJson);
        sessionStorage.setItem('segmentTempJson',JSON.stringify(segmentTempJson));
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
                    <Breadcrumb.Item>{this.props.location.state.newSegment ? '新建脚本段' : '编辑脚本段'}</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content-container">
                    <div className="testing-header">
                        <div className="testing-start">
                            <div className="testing-start-btn  testing-save-btn">
                                <Icon type="arrow-left" />
                            </div>
                        </div>
                        <div className="testing-start">
                            <div className="testing-start-btn testing-save-btn" onClick={()=>{
                                this.setState({
                                    saveModal:true
                                })
                            }}>
                                保存脚本段
                            </div>
                        </div>
                    </div>
                    <FetchSegments fetchTestConf={this.props.fetchTestConf} ScriptIndex={this.refs.ScriptIndex}/>
                    <ScriptIndex saveTempScript={this.saveTempScript} ref="ScriptIndex" isNew={this.props.location.state.newSegment} {...this.props} json={this.props.fetchTestConf.segmentJson}/>
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