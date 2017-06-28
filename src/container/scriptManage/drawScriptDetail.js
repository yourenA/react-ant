/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import {Breadcrumb, Layout, Icon} from 'antd';
import './drawScript.less';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import {getHeader, delPointsInLink} from './../../common/common.js';
import configJson from './../../common/config.json';
import axios from 'axios';
import DrawScriptCof from './drawScriptCof'
import FetchSegments from './fetchSegments'
import ScriptIndex from './scriptIndex.js'
var _ = require('lodash');
const {Content,} = Layout;

class DrawScriptDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            segmentsJson: '{}',
            detailJson: localStorage.getItem('detailJon'),
            detailIndex: 0,
            editRecord: null
        };
    }

    componentDidMount() {
        this.props.fetchAllTestType();
        this.props.fetchAllParts();
        this.props.fetchAllHardwareVersions();
        this.props.fetchAllSegments();
        this.refs.ScriptIndex.init();
        this.refs.ScriptIndex.load(sessionStorage.getItem(this.props.match.params.id));
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
            console.log("idJson", idJson)
            this.refs.ScriptIndex.load(idJson);

        }
    }

    saveTempScript = ()=> {
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

        console.log('originJson',originJson)
        console.log('changeJson',changeJson)
        let resultNodeJson = _.differenceWith(originJson.nodeDataArray, nowJson.nodeDataArray,function (a,b) {
            return (a.key === b.key)
        }).concat(changeJson.nodeDataArray);

        let resultLinkJson = _.differenceWith(originJson.linkDataArray, nowJson.linkDataArray, _.isEqual).concat(changeJson.linkDataArray);
        for (let j = 0, len = resultLinkJson.length; j < len; j++) {
            delete  resultLinkJson[j].points
        }
        let resultTempJson = {
            class: "go.GraphLinksModel",
            nodeDataArray: resultNodeJson,
            linkDataArray: resultLinkJson
        };
        console.log("临时保存", resultTempJson);
        sessionStorage.setItem('resultTempJson', JSON.stringify(resultTempJson));
        // sessionStorage.setItem('originJson',JSON.stringify(resultTempJson))
    }
    turnBack = ()=> {
        this.props.history.push('/scriptManage')
    }

    render() {
        return (
            <Content className="content">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item style={{cursor: 'pointer'}} onClick={this.turnBack}>脚本管理</Breadcrumb.Item>
                    <Breadcrumb.Item>修改脚本"{this.props.location.state.groupNmae}"</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content-container">
                    <div className="testing-header">
                        <div className="testing-start">
                            <div className="testing-start-btn  testing-save-btn">
                                <Icon type="arrow-left"/>
                            </div>
                        </div>
                        <DrawScriptCof ref="DrawScriptCofForm"  {...this.props} {...this.state}/>
                        <div className="testing-start">
                            <div className="testing-start-btn testing-save-btn" onClick={this.saveTempScript}>
                                保存脚本
                            </div>
                        </div>
                    </div>
                    <FetchSegments fetchTestConf={this.props.fetchTestConf} ScriptIndex={this.refs.ScriptIndex}/>
                    <ScriptIndex saveTempScript={this.saveTempScript} ref="ScriptIndex"  {...this.props} isNew={true}
                                 json={this.state.detailJson}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(DrawScriptDetail);