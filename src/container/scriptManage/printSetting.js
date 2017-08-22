/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import {Select, Input, Button,Breadcrumb,Tree} from 'antd';
import configJson from 'configJson' ;
import {getHeader, converErrorCodeToMsg,transfromTree} from './../../common/common';
import axios from 'axios';
const TreeNode = Tree.TreeNode;
class PrintSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            node:[],
            scriptName:'',
            checkedKeys:[]
        };
    }
    componentDidMount=()=>{
        console.log(this.props.match.params.id)
        this.fetchScript(this.props.match.params.id)
    }
    fetchScript=(id)=>{
        const that = this;
        this.setState({loading: true});
        axios({
            url: `${configJson.prefix}/test_scripts/${id}`,
            method: 'get',
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                let node=JSON.parse(response.data.content).nodeDataArray;
                for(let i=0,len=node.length;i<len;i++){
                    if(!node[i].group){
                        node[i].group=0
                    }
                }
                    var jsonDataTree = that.transData(node, 'key', 'group', 'children');
                console.log(jsonDataTree);
                that.setState({
                    node: jsonDataTree,
                    scriptName:response.data.name,
                    loading: false
                })
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    transData=(a, idStr, pidStr, chindrenStr)=>{
        var r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length;
        for(; i < len; i++){
            hash[a[i][id]] = a[i];
        }
        for(; j < len; j++){
            var aVal = a[j], hashVP = hash[aVal[pid]];
            if(hashVP){
                !hashVP[children] && (hashVP[children] = []);
                hashVP[children].push(aVal);
            }else{
                r.push(aVal);
            }
        }
        return r;
    }
    onCheck = (checkedKeys) => {
        console.log('checkedKeys',checkedKeys)
        this.setState({
            checkedKeys,
        });
    }
    onSelect = (selectedKeys, info) => {
    }
    savePrintSetting=()=>{

    }
    render() {
        const loop = data => data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={item.title} >
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={item.title} />;
        });
        return (
            <div className="content">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>脚本管理</Breadcrumb.Item>
                    <Breadcrumb.Item>打印设置"{this.state.scriptName}"</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content-container">
                    <div className="operate-box">
                        <Button onClick={()=>this.props.history.goBack()}>退出</Button>
                        <span className="ant-divider"/>
                        <Button type='primary' onClick={this.savePrintSetting}>保存</Button>
                    </div>
                    <Tree
                        checkable
                        showLine
                        onCheck={this.onCheck}
                        onSelect={this.onSelect}
                    >
                        {loop(this.state.node)}
                    </Tree>
                </div>
            </div>
        );
    }
}

export default PrintSetting;