/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import {Breadcrumb, Layout, Button,Select,message} from 'antd';
import DrawScriptCof from './drawScriptCof'
import './drawScript.less';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import {getHeader,converErrorCodeToMsg} from './../../common/common.js';
import configJson from './../../common/config.json';
import axios from 'axios';
import messageJson from './../../common/message.json';
import uuidv4 from 'uuid/v4';
import ScriptIndex from './scriptIndex.js'
const Option = Select.Option;
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
        const method=this.props.location.state.newScript ?`post`:`put`;
        const msg=this.props.location.state.newScript ?messageJson[`add script success`]:messageJson[`edit script success`];
        axios({
            url: `${configJson.prefix}${url}`,
            method: method,
            params: {
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
    onChangeSegment=(id)=>{
        const that = this;
        axios({
            url: `${configJson.prefix}/flow_diagrams/${id}`,
            method: 'get',
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    segmentsJson: response.data.content,
                })
            }).catch(function (error) {
            console.log('获取出错',error);
            converErrorCodeToMsg(error)
        })
    }
    addGraphical = ()=> {
        let myDiagram=this.refs.ScriptIndex.callbackDiagram()
        let originHadJson = JSON.parse(this.state.segmentsJson);
        if(!originHadJson.nodeDataArray){
            return false
        }else{
            console.log('originHadJson',originHadJson);
            let keyUuidArr = [];
            for (let k = 0, len3 = originHadJson.nodeDataArray.length; k < len3; k++) {
                let uuid2 = uuidv4();
                keyUuidArr.push({key: originHadJson.nodeDataArray[k].key, uuid: uuid2});

            }
            for (let i = 0, len1 = keyUuidArr.length; i < len1; i++) {
                // if( originHadJson.nodeDataArray[i].group){
                //     originHadJson.nodeDataArray[i].group=keyUuidArr[i].uuid
                // }
                // let parseLoc = originHadJson.nodeDataArray[i].loc.split(' ');
                // originHadJson.nodeDataArray[i].loc = `${parseInt(parseLoc[0]) + this.state.scrollLeft} ${parseInt(parseLoc[1]) + this.state.scrollTop}`


                if (originHadJson.nodeDataArray[i].group) {
                    for (let n = 0, len4 = keyUuidArr.length; n < len4; n++) {
                        if (originHadJson.nodeDataArray[i].group === keyUuidArr[n].key) {
                            originHadJson.nodeDataArray[i].group = keyUuidArr[n].uuid
                        }
                    }
                }

                if (originHadJson.nodeDataArray[i].isGroup) {
                    originHadJson.nodeDataArray[i].key = keyUuidArr[i].uuid;
                }


                for (let j = 0, len2 = originHadJson.linkDataArray.length; j < len2; j++) {
                    if (originHadJson.linkDataArray[j].from === keyUuidArr[i].key) {
                        originHadJson.nodeDataArray[i].key = keyUuidArr[i].uuid;
                        originHadJson.linkDataArray[j].from = keyUuidArr[i].uuid;
                    }
                    if (originHadJson.linkDataArray[j].to === keyUuidArr[i].key) {
                        originHadJson.nodeDataArray[i].key = keyUuidArr[i].uuid;
                        originHadJson.linkDataArray[j].to = keyUuidArr[i].uuid;
                    }
                }
            }

            // const originGrapJson = JSON.parse(myDiagram.model.toJson());//获取图里面的数据
            // const addGrapJson = originHadJson;//需要添加的数据
            for (let h = 0, len = originHadJson.nodeDataArray.length; h < len; h++) {
                myDiagram.model.addNodeData(originHadJson.nodeDataArray[h]);
            }
            for (let g = 0, len = originHadJson.linkDataArray.length; g < len; g++) {
                myDiagram.model.addLinkData(originHadJson.linkDataArray[g]);
            }
        }

        // originGrapJson.nodeDataArray = originGrapJson.nodeDataArray.concat(addGrapJson.nodeDataArray);
        // originGrapJson.linkDataArray = originGrapJson.linkDataArray.concat(addGrapJson.linkDataArray);
        // myDiagram.model = go.Model.fromJson(originGrapJson);

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
                    <div>
                        <span>选择代码段: </span>
                        <Select   className="search-select"
                                showSearch
                                onChange={this.onChangeSegment}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            { this.props.fetchTestConf.segments.map((item, key) => {
                                return (
                                    <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                                )
                            }) }
                        </Select>
                        <Button type='primary' onClick={this.addGraphical}>添加</Button>
                    </div>
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