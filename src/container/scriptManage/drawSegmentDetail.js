/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import {Breadcrumb, Layout, Input,  Button, Modal, message} from 'antd';
import './drawScript.less';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import {getHeader, converErrorCodeToMsg, delPointsInLink,transformPrintJson} from './../../common/common';
import axios from 'axios';
import configJson from 'configJson' ;
import messageJson from './../../common/message.json';
import FetchSegments from './fetchSegments'
import ScriptIndex from './scriptIndex.js'
import ScriptInfo from './scriptInfo';
const _ = require('lodash');
const {Content,} = Layout;

class DrawScriptDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            segmentsJson: '{}',
            detailIndex: 0,
            editRecord: null
        };
    }

    componentDidMount() {
        this.props.fetchAllSegments();
        this.refs.ScriptIndex.init(this.refs.ScriptIndex.load, sessionStorage.getItem(this.props.match.params.id),this.props.location.state.category);
        if (!this.props.location.state.newSegment) {
            this.fetchScript(sessionStorage.getItem('manageSegmentId'))
        }
        if (!sessionStorage.getItem('breadcrumbArrForSegment')) {
            sessionStorage.setItem('breadcrumbArrForSegment', JSON.stringify([{
                key: this.props.match.params.id,
                value: this.props.location.state.groupNmae
            }]))
        }
    }

    fetchScript = (id, cb)=> {
        const that = this
        axios({
            url: `${configJson.prefix}/flow_diagrams/${id}`,
            method: 'get',
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
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
            // const breadcrumbArr = JSON.parse(sessionStorage.getItem('breadcrumbArrForSegment'));
            // let theSameBreadcrumIndex = 0;
            // for (let i = 0, len = breadcrumbArr.length; i < len; i++) {
            //     if (breadcrumbArr[i].key === nextProps.match.params.id) {
            //         theSameBreadcrumIndex = i + 1
            //     }
            // }
            // if (theSameBreadcrumIndex === 0) {
            //     sessionStorage.setItem('breadcrumbArrForSegment', JSON.stringify(breadcrumbArr.concat({
            //         key: nextProps.match.params.id,
            //         value: nextProps.location.state.groupNmae
            //     })));
            // } else {
            //     breadcrumbArr.splice(theSameBreadcrumIndex, breadcrumbArr.length)
            //     sessionStorage.setItem('breadcrumbArrForSegment', JSON.stringify(breadcrumbArr));
            // }


            this.refs.ScriptIndex.delDiagram();
            this.refs.ScriptIndex.init(null,null,nextProps.location.state.category);
            // console.log("this.state",this.state)
            // this.refs.ScriptIndex.load(this.state[nextProps.match.params.id]);
            const preSessionJson = JSON.parse(sessionStorage.getItem(`pre-${this.props.match.params.id}`));

            let nextPropsIdJson = JSON.parse(sessionStorage.getItem(nextProps.match.params.id));
            const thisPropsIdJson = JSON.parse(sessionStorage.getItem(this.props.match.params.id));
            if (this.props.history.action === 'POP') {
                // console.log('POP');
                const segmentDiagramStorage=JSON.parse(sessionStorage.getItem('segmentDiagramStorage'));
                for (let i = 0, len = segmentDiagramStorage.length; i < len; i++) {
                    // console.log(sessionStorage.key(i))
                    let sessionJson = JSON.parse(sessionStorage.getItem(segmentDiagramStorage[i]));
                    let intersectJsonNode = _.differenceWith(preSessionJson.nodeDataArray, thisPropsIdJson.nodeDataArray, function (a, b) {
                        return (a.key === b.key)
                    })
                    let intersectJsonLink = _.differenceWith(preSessionJson.linkDataArray, thisPropsIdJson.linkDataArray,function (a,b) {
                        return ((a.from === b.from) && (a.to === b.to))
                    })
                    if (intersectJsonNode.length) {
                        sessionJson.nodeDataArray = _.differenceWith(sessionJson.nodeDataArray, intersectJsonNode, function (a, b) {
                            return (a.key === b.key)
                        });
                        sessionStorage.setItem(segmentDiagramStorage[i], JSON.stringify(sessionJson))
                    }
                    if (intersectJsonLink.length) {
                        sessionJson.linkDataArray = _.differenceWith(sessionJson.linkDataArray, intersectJsonLink,function (a,b) {
                            return ((a.from === b.from) && (a.to === b.to))
                        });
                        sessionStorage.setItem(segmentDiagramStorage[i], JSON.stringify(sessionJson))
                    }
                }
                nextPropsIdJson.nodeDataArray = _.differenceWith(nextPropsIdJson.nodeDataArray, preSessionJson.nodeDataArray, function (a, b) {
                    return (a.key === b.key)
                }).concat(thisPropsIdJson.nodeDataArray)

                nextPropsIdJson.linkDataArray = _.differenceWith(nextPropsIdJson.linkDataArray, preSessionJson.linkDataArray,function (a,b) {
                    return ((a.from === b.from) && (a.to === b.to))
                })
                    .concat(thisPropsIdJson.linkDataArray);
            }
            nextPropsIdJson=transformPrintJson(nextPropsIdJson);
            sessionStorage.setItem(nextProps.match.params.id, JSON.stringify(nextPropsIdJson))
            this.refs.ScriptIndex.load(nextPropsIdJson);

        }
    }

    saveTempScript = (canBack, returnJson)=> {
        const originJson = JSON.parse(sessionStorage.getItem('segmentTempJson'));
        const nowJson = JSON.parse(sessionStorage.getItem(this.props.match.params.id));
        let changeJson = JSON.parse(this.refs.ScriptIndex.callbackJson());
        for (let i = 0, len = changeJson.nodeDataArray.length; i < len; i++) {
            if (!changeJson.nodeDataArray[i].group) {
                changeJson.nodeDataArray[i].group = this.props.match.params.id
            }
        }
        delPointsInLink(changeJson.linkDataArray);
        sessionStorage.setItem(this.props.match.params.id, JSON.stringify(changeJson))

        // console.log('nowJson', nowJson)
        // console.log('changeJson', changeJson)

        let resultNodeJson = _.differenceWith(originJson.nodeDataArray, nowJson.nodeDataArray, function (a, b) {
            return (a.key === b.key)
        }).concat(changeJson.nodeDataArray);

        let resultLinkJson = _.differenceWith(originJson.linkDataArray, nowJson.linkDataArray,function (a,b) {
            return ((a.from === b.from) && (a.to === b.to))
        }).concat(changeJson.linkDataArray);
        for (let j = 0, len = resultLinkJson.length; j < len; j++) {
            delete  resultLinkJson[j].points
        }
        //重新生成json的时候需要添加copiesArrays: true,copiesArrayObjects: true,不然数据就会相互影响
        let segmentTempJson = {
            class: "go.GraphLinksModel",
            linkFromPortIdProperty: "fromPort",
            linkToPortIdProperty: "toPort",
            copiesArrays: true,
            copiesArrayObjects: true,
            nodeDataArray: resultNodeJson,
            linkDataArray: resultLinkJson
        };
        sessionStorage.setItem('segmentTempJson', JSON.stringify(segmentTempJson));
        if (returnJson) {
            return segmentTempJson
        }
        if (canBack) {
            sessionStorage.setItem(`pre-${this.props.match.params.id}`, JSON.stringify(nowJson));

            const segmentDiagramStorage=JSON.parse(sessionStorage.getItem('segmentDiagramStorage'));
            if( Array.indexOf(segmentDiagramStorage, `pre-${this.props.match.params.id}`)===-1){
                segmentDiagramStorage.push(`pre-${this.props.match.params.id}`)
                sessionStorage.setItem('segmentDiagramStorage',JSON.stringify(segmentDiagramStorage))
            }

            const segmentStorage=JSON.parse(sessionStorage.getItem('segmentStorage'));
            if( Array.indexOf(segmentStorage, `pre-${this.props.match.params.id}`)===-1){
                segmentStorage.push(`pre-${this.props.match.params.id}`)
                sessionStorage.setItem('segmentStorage',JSON.stringify(segmentStorage))
            }
            this.props.history.goBack()
        }
    }

    saveCode = ()=> {
        const that = this;
        let content = this.saveTempScript(false, true);
        content=transformPrintJson(content);
        delPointsInLink(content.linkDataArray);
        const newSegment = !this.state.editRecord;
        const url = newSegment ? `/flow_diagrams` : `/flow_diagrams/${sessionStorage.getItem('manageSegmentId')}`;
        const method = newSegment ? `post` : `put`;
        const meg = newSegment ? messageJson[`add segment success`] : messageJson[`edit segment success`];
        axios({
            url: `${configJson.prefix}${url}`,
            method: method,
            data: {
                name: this.refs.scriptCodeNmae.refs.input.value,
                content: JSON.stringify(content),
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                message.success(meg);
                newSegment
                    ? setTimeout(function () {
                    that.props.history.replace({pathname: `/segmentManage`})
                }, 1000) : that.fetchScript(sessionStorage.getItem('manageSegmentId'));
                that.setState({
                    saveModal: false
                })
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })

    }
    turnBack = ()=> {
        this.saveTempScript(true)
    }

    render() {
        // const breadcrumbArr = JSON.parse(sessionStorage.getItem('breadcrumbArrForSegment')) || [];
        return (
            <Content className="content">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item >脚本段管理</Breadcrumb.Item>
                    <Breadcrumb.Item>{this.state.editRecord ? `编辑脚本段'${ this.state.editRecord.name}'` : '新建脚本段' }</Breadcrumb.Item>
                  {/*  {breadcrumbArr.map((item, index)=> {
                        return (
                            <Breadcrumb.Item key={index}>{item.value}</Breadcrumb.Item>
                        )
                    })}*/}
                </Breadcrumb>
                <div className="content-container">
                    <ScriptInfo />
                    <div className="testing-header">
                        <div className="testing-start">
                            <div className="testing-start-btn  testing-save-btn"
                                 onClick={()=>this.turnBack()}>
                                后退
                            </div>
                        </div>
                        <div className="testing-start">
                            <div className="testing-start-btn testing-save-btn" onClick={()=> {
                                this.setState({
                                    saveModal: true
                                })
                            }}>
                                保存脚本段
                            </div>
                        </div>
                    </div>
                    <FetchSegments fetchTestConf={this.props.fetchTestConf} ScriptIndex={this.refs.ScriptIndex}/>
                    <ScriptIndex saveTempScript={this.saveTempScript} ref="ScriptIndex"  {...this.props} isNew={true}
                                 fromNew={this.state.editRecord ? false : true} turnBack={this.turnBack}/>
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
                    <Input defaultValue={this.state.editRecord ? this.state.editRecord.name : ''} ref="scriptCodeNmae"
                           placeholder="Basic usage"/>
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