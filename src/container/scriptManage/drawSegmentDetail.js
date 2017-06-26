/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import {Breadcrumb, Layout, Button, Select, message} from 'antd';
import './drawScript.less';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
import {getHeader, converErrorCodeToMsg} from './../../common/common.js';
import configJson from './../../common/config.json';
import axios from 'axios';
import DrawScriptCof from './drawScriptCof'
import FetchSegments from './fetchSegments'
import ScriptIndex from './scriptIndex.js'
const {Content,} = Layout;

class DrawScriptDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            segmentsJson: '{}',
            detailJson: localStorage.getItem('detailJon'),
            detailIndex: 0,
            editRecord:null
        };
    }

    componentDidMount() {
        this.props.fetchAllTestType();
        this.props.fetchAllParts();
        this.props.fetchAllHardwareVersions();
        this.props.fetchAllSegments();
        this.refs.ScriptIndex.init();
        this.fetchScript(localStorage.getItem('manageScriptId'))
        this.setState({
            [this.props.match.params.id]: localStorage.getItem('detailJon')
        }, function () {
        })
    }

    fetchScript = (id, cb)=> {
        const that = this
        axios({
            url: `${configJson.prefix}/test_scripts/${id}`,
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
            if (this.state[nextProps.match.params.id]) {
                this.refs.ScriptIndex.load(this.state[nextProps.match.params.id]);
            } else {
                this.setState({
                    [ nextProps.match.params.id]: localStorage.getItem('detailJon')
                }, function () {
                    this.refs.ScriptIndex.load(this.state[nextProps.match.params.id]);
                })
            }

        }
    }

    saveScript = ()=> {
    }
    turnBack = ()=> {
    }
    render() {
        console.log(this.props)
        return (
            <Content className="content">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item style={{cursor: 'pointer'}} onClick={this.turnBack}>脚本段管理</Breadcrumb.Item>
                    <Breadcrumb.Item>修改脚本段"{this.props.location.state.groupNmae}"</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content-container">
                    <FetchSegments fetchTestConf={this.props.fetchTestConf} ScriptIndex={this.refs.ScriptIndex}/>
                    <Button type='primary' onClick={()=>{this.setState({saveModal:true})}}>'保存</Button>
                    <ScriptIndex ref="ScriptIndex"  {...this.props} isNew={false} json={this.state.detailJson}/>
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