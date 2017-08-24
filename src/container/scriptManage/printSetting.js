/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import {message, Button, Breadcrumb, Tree} from 'antd';
import messageJson from './../../common/message.json';
import configJson from 'configJson' ;
import {getHeader, converErrorCodeToMsg} from './../../common/common';
import axios from 'axios';
const _ = require('lodash');
const TreeNode = Tree.TreeNode;
class PrintSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            node: [],
            name: '',
            test_type_id:'',
            hardware_version_id:'',
            checkedKeys: [],
        };
    }

    componentDidMount = ()=> {
        this.fetchScript(this.props.match.params.id)
    }
    fetchScript = (id)=> {
        const that = this;
        this.setState({loading: true});
        axios({
            url: `${configJson.prefix}/test_scripts/${id}`,
            method: 'get',
            headers: getHeader()
        })
            .then(function (response) {
                let node = JSON.parse(response.data.content).nodeDataArray;
                let checkedKeys=[];
                for (let i = 0, len = node.length; i < len; i++) {
                    if(node[i].isPrint){
                        checkedKeys.push(node[i].key)
                    }
                    if (!node[i].group) {
                        node[i].group = 0
                    }
                }
                const jsonDataTree = that.transData(node, 'key', 'group', 'children');
                that.setState({
                    checkedKeys:checkedKeys,
                    node: jsonDataTree,
                    content:JSON.parse(response.data.content),
                    name: response.data.name,
                    test_type_id: response.data.test_type_id,
                    hardware_version_id: response.data.hardware_version_id,
                    loading: false
                })
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    transData = (a, idStr, pidStr, chindrenStr)=> {
        var r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length;
        for (; i < len; i++) {
            hash[a[i][id]] = a[i];
        }
        for (; j < len; j++) {
            var aVal = a[j], hashVP = hash[aVal[pid]];
            if (hashVP) {
                !hashVP[children] && (hashVP[children] = []);
                hashVP[children].push(aVal);
            } else {
                r.push(aVal);
            }
        }
        return r;
    }
    onCheck = (checkedKeys) => {
        this.setState({
            checkedKeys,
        });
    }
    onSelect = (selectedKeys, info) => {
    }
    savePrintSetting = ()=> {
        const {content,checkedKeys}=this.state;
        _.forEach(content.nodeDataArray, function(value, key) {
            const includesKey=_.includes(checkedKeys,value.key);
            if(includesKey){
                content.nodeDataArray[key].isPrint=true
            }else{
                content.nodeDataArray[key].isPrint=false
            }
        });
        console.log(content)
        axios({
            url: `${configJson.prefix}/test_scripts/${this.props.match.params.id}`,
            method: `PUT`,
            data: {
                name:this.state.name,
                test_type_id:this.state.test_type_id,
                hardware_version_id:this.state.hardware_version_id,
                content: JSON.stringify(content),
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                message.success(messageJson[`edit print success`]);

            }).catch(function (error) {
            console.log('获取出错',error);
            converErrorCodeToMsg(error)
        })
    }

    render() {

        const loop = data => data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={item.title}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={item.title}/>;
        });
        return (
            <div className="content">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>脚本管理</Breadcrumb.Item>
                    <Breadcrumb.Item>打印设置"{this.state.name}"</Breadcrumb.Item>
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
                        defaultExpandAll={true}
                        checkedKeys={this.state.checkedKeys}
                        onCheck={this.onCheck}
                    >
                        {loop(this.state.node)}
                    </Tree>
                </div>
            </div>
        );
    }
}

export default PrintSetting;