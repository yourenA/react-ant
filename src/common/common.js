/**
 * Created by Administrator on 2017/3/7.
 */
import {message,Tree} from 'antd';
import messageJson from './message.json';
import {signout} from './../actions/login';
import {store} from './../index'
const TreeNode = Tree.TreeNode;
const _ = require('lodash');
/**
 * 接入管理表单ItemLayout
 * */
exports.formItemLayout = {
    labelCol: {
        xs: {span: 6},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 18},
        sm: {span: 18},
    }
};
exports.producLayout = {
    labelCol: {
        xs: {span: 9},
        sm: {span: 9},
    },
    wrapperCol: {
        xs: {span: 15},
        sm: {span: 15},
    }
};
exports.addSeriaNumLayout = {
    labelCol: {
        xs: {span: 8},
        sm: {span: 8},
    },
    wrapperCol: {
        xs: {span: 16},
        sm: {span: 16},
    }
};
exports.DrawScriptConfLayout = {
    labelCol: {
        xs: {span: 7},
        sm: {span: 7},
    },
    wrapperCol: {
        xs: {span: 17},
        sm: {span: 17},
    }
};
exports.formItemLayoutForOrganize = {
    labelCol: {
        sm: {span: 6},
    },
    wrapperCol: {
        sm: {span: 18},
    }
};
exports.formItemLayoutWithLabel = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
    }
};
exports.formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 18, offset: 6},
    },
};

/**
 * 消除登陆状态storage
 * */

const removeLoginStorage = () => {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('usertoken');
    sessionStorage.removeItem('permissions');
    sessionStorage.clear();
    localStorage.removeItem('username');
    localStorage.removeItem('usertoken');
    localStorage.removeItem('permissions');
    localStorage.clear();
};
exports.removeLoginStorage = removeLoginStorage;
/**
 * 获取头信息
 * */
exports.getHeader = () => {
    return {Authorization: `Bearer ${sessionStorage.getItem('usertoken') || localStorage.getItem('usertoken')}`}
};

/**
 * 获取头信息
 * */
const testPermission = (permisionName) => {
    const permissions = JSON.parse(localStorage.getItem('permissions'));
    for (let i = 0; i < permissions.length; i++) {
        if (permissions[i].name === permisionName) {
            return true;
        }
    }
};
exports.testPermission = testPermission;
/**
 * 将策略form表单转换为发送数据
 * */
exports.convertFormToData = (form) => {
    const addPoliciesDate = {
        name: form.name,
        description: form.desc,
        topics: []
    };
    for (var k in form) {
        if (k.indexOf('topics') >= 0) {
            if (form.hasOwnProperty(k)) {
                if (form[k] === undefined) {
                    return false
                }
                if (form[k].authority === 0) {
                    addPoliciesDate.topics.push({
                        name: form[k].name,
                        allow_publish: -1,
                        allow_subscribe: 1
                    })
                } else if (form[k].authority === 1) {
                    addPoliciesDate.topics.push({
                        name: form[k].name,
                        allow_publish: 1,
                        allow_subscribe: -1
                    })
                } else if (form[k].authority === 2) {
                    addPoliciesDate.topics.push({
                        name: form[k].name,
                        allow_publish: 1,
                        allow_subscribe: 1
                    })
                } else {
                    addPoliciesDate.topics.push({
                        name: form[k].name,
                        allow_publish: form[k].allow_publish,
                        allow_subscribe: form[k].allow_subscribe
                    })
                }
            }
        }
    }

    return addPoliciesDate;
};
/**
 * 将订阅主题表单转换为发送数据
 * */
/*exports.convertSubFormToData  = (form) => {
 const topics= {}
 for (var k in form) {
 if (k.indexOf('topics') >= 0) {
 if (form.hasOwnProperty(k)) {
 topics[`${form[k].theme}`]=parseInt(form[k].QoS);
 }
 }
 }

 return topics;
 };*/
/**
 * 将订阅主题表单转换为发送数据
 * */
exports.getUrlParam = (name) => {
    const search = window.location.href.split('?')[window.location.href.split('?').length - 1];
    const searchParam = search.split('&');
    for (let i = 0, len = searchParam.length; i < len; i++) {
        const eachParam = searchParam[i].split('=');
        if (eachParam[0] === name) {
            return eachParam[1]
        }
    }
    return null
};

/**
 *  判断错误码(数组)
 * */

exports.converErrorCodeToMsg = (error) => {
    console.log("error", error.toString())
    if (error.toString() === 'Error: Network Error') {
        message.error(messageJson['network error'], 3);
        return false
    }
    if (error.response.status === 401) {
        message.error(messageJson['token fail']);
        removeLoginStorage();
        setTimeout(()=> {
            //hashHistory.replace('/');
            store.dispatch(signout());
        }, 1000)
    } else if (!error.response.data.errors) {
        message.error(error.response.data.message);
    } else if (error.response.status === 422) {
        let first;
        for (first in error.response.data.errors) break;
        message.error(`${error.response.data.errors[first][0]}`);
    } else {
        message.error(messageJson['unknown error']);
    }
}

/**
 *  获取用户权限
 * */
exports.getUserPermission = (name) => {
    const allPermisssions = JSON.parse(sessionStorage.getItem('userPermissions') || localStorage.getItem('userPermissions'));
    for (let i = 0, len = allPermisssions.len; i < len; i++) {
        if (allPermisssions[i].name === name) {
            return true
        }
    }
    return false
};

/**
 *  删除图形的线节点
 * */
exports.delPointsInLink = (arr) => {
    for (let i = 0, len = arr.length; i < len; i++) {
        if(arr[i].visible && !arr[i].condition){
            arr[i].condition='YES'
        }
        delete  arr[i].points
    }
}
exports.setPointsNamespace = (arr) => {
    for (let i = 0, len = arr.length; i < len; i++) {
        let rootNamespace='root';
        if (findP(arr, arr[i])) {
            let resultKeys = findP(arr, arr[i]).reverse().map(x => x.title);
            let childNamespace=resultKeys.join('.');
            rootNamespace=`${rootNamespace}.${childNamespace}`
        } else {
        }
        arr[i].namespace=rootNamespace
    }
    console.log(arr)
}
/**
 * 为每个节点添加命名空间"."分隔
 * */

/**
 * 判断节点是否正确
 * */

exports.checkJSon = (myDiagramModel)=> {
    const {nodeDataArray, linkDataArray}=myDiagramModel;

    //对nodeDataArray进行分组
    let tree = nodeDataArray.reduce((o, x) => {
        let id = x.key;
        let pId = x.group
        o[id] = o[id] || {children: []}
        o[id].node = x
        if (pId) {
            o[pId] = o[pId] || {children: []}
            o[pId].children.push(x)
        }
        return o
    }, {});

    let returnCode = 1;
    let returnMsg=[];
    const groupErrSign=' < ';
    const itemErrSign=' >: ';
    //判断每一个group
    const groups = _.groupBy(nodeDataArray, 'group');
    console.log('groups', groups);
    _.forEach(groups, function (group, key) {
        if(key==='undefined'){
            key='root'
        }else{
            const node=_.find(nodeDataArray,function (o) {
                return o.key===key
            })
            key='root.'+listParents(tree,node ).map(x => x.title).concat(node.title).join('.')
        }

        let hasLinkIndiffGroup=_.filter(linkDataArray, function(o) { return _.map(group,'key').indexOf(o.from)!==-1 &&_.map(group,'key').indexOf(o.to)===-1 });
        if(hasLinkIndiffGroup.length){
            for (let i = 0, len = hasLinkIndiffGroup.length; i < len; i++) {
                console.log(key,_.find(nodeDataArray, function(o) { return o.key ===hasLinkIndiffGroup[i].from; }).title,'跨分组内容之间有连线');
                returnMsg.push(`${key}${groupErrSign}${_.find(nodeDataArray, function(o) { return o.key ===hasLinkIndiffGroup[i].from; }).title}${itemErrSign}'跨分组内容之间有连线'`)
            }
            returnCode = -1;
        }
        //判断link
        let linkInGroup=_.filter(linkDataArray, function(o) { return _.map(group,'key').indexOf(o.from)!==-1&&_.map(group,'key').indexOf(o.to)!==-1 });

        let parseArray1 = []
        let new_arr = [];
        _.forEach(linkInGroup, function (value) {
            parseArray1.push(`${value.from}_${value.to}`)
        });
        for (let i = 0, len = parseArray1.length; i < len; i++) {
            let res = parseArray1[i];
            if (new_arr.indexOf(res) === -1) {
                new_arr.push(res)
            } else {
                console.log(key,_.find(nodeDataArray, function(o) { return o.key ===linkInGroup[i].from; }).title,'存在重复的连线');
                returnMsg.push(`${key}${groupErrSign}${_.find(nodeDataArray, function(o) { return o.key ===linkInGroup[i].from; }).title}${itemErrSign}存在重复的连线`);
                returnCode = -1;
            }
            let reversed = res.split('_').reverse().join('_')
            if (new_arr.indexOf(reversed) === -1) {
            } else {
                console.log(key,_.find(nodeDataArray, function(o) { return o.key ===linkInGroup[i].from; }).title,'存在颠倒的连线');
                returnMsg.push(`${key}${groupErrSign}${_.find(nodeDataArray, function(o) { return o.key ===linkInGroup[i].from; }).title}${itemErrSign}存在颠倒的连线`);
                returnCode = -1;
            }
        }
        const hasStart = _.findKey(group, function (o) {
            return o.category === 'start';
        });
        const hasEnd = _.findKey(group, function (o) {
            return o.category === 'end';
        });
        if (!hasStart) {
            console.log(key,'没有起点')
            returnMsg.push(`${key}${itemErrSign} 没有起点`)
            returnCode = -1;
        }
        if (!hasEnd) {
            console.log(key,'没有终点')
            returnMsg.push(`${key}${itemErrSign} 没有终点`)
            returnCode = -1;
        }

        for (let i = 0, ilen = group.length; i < ilen; i++) {
            if(group[i].title.length===0 &&  group[i].category !== 'comment'){
                console.log(key,group[i].title,'命名不能为空')
                returnMsg.push(`${key}${groupErrSign}${group[i].title}${itemErrSign}命名不能为空`);
                returnCode = -1;
            }
            if( group[i].title.indexOf('.')>=0 ){
                if( group[i].category === 'if' ||  group[i].category === 'comment'){
                }else{
                    console.log(key,group[i].title,'命名错误')
                    returnMsg.push(`${key}${groupErrSign}${group[i].title}${itemErrSign}命名错误`);
                    returnCode = -1;
                }
            }
            if (group[i].category === 'start') {
                const startOnLink = _.filter(linkDataArray, function (link) {
                    return link.from === group[i].key
                });
                if (startOnLink.length === 0) {
                    console.log(key,'起点没有输出连线');
                    returnMsg.push(`${key}${groupErrSign}${group[i].title}${itemErrSign}没有输出连线`)
                    returnCode = -1;
                }
                if (startOnLink.length > 1) {
                    console.log(key,'起点有多条输出连线')
                    returnMsg.push(`${key}${groupErrSign}${group[i].title}${itemErrSign}有多条输出连线`)
                    returnCode = -1;
                }
            }

            if (group[i].category === 'item' || group[i].category === 'if' || group[i].category === 'OfGroups' || group[i].category === 'ForGroups' || group[i].category === 'errOut') {
                const itemOnLinkTo = _.filter(linkDataArray, function (link) {
                    return link.to === group[i].key
                });
                const itemOnLinkFrom = _.filter(linkDataArray, function (link) {
                    return link.from === group[i].key
                });
                if (itemOnLinkTo.length === 0) {
                    console.log(key,group[i].title,'没有输入连线')
                    returnMsg.push(`${key}${groupErrSign}${group[i].title}${itemErrSign}没有输入连线`)
                    returnCode = -1;
                }
                if (itemOnLinkFrom.length === 0) {
                    console.log(key,group[i].title,'没有输出连线')
                    returnMsg.push(`${key}${groupErrSign}${group[i].title}${itemErrSign}没有输出连线`)
                    returnCode = -1;
                }

            }

            if (group[i].category === 'if' || group[i].category === 'item') {
                const itemOnLinkFrom = _.filter(linkDataArray, function (link) {
                    return link.from === group[i].key
                });
                if (itemOnLinkFrom.length > 2) {
                    console.log(key,group[i].title,'输出连线大于2')
                    returnMsg.push(`${key}${groupErrSign}${group[i].title}${itemErrSign}输出连线大于2`)
                    returnCode = -1;
                }
            }

            if (group[i].category === 'item' || group[i].category === 'if') {
                const itemOnLinkFrom = _.filter(linkDataArray, function (link) {
                    return link.from === group[i].key
                });
                if (itemOnLinkFrom.length === 2) {
                    if(itemOnLinkFrom[0].condition == itemOnLinkFrom[1].condition){
                        console.log(key,group[i].title,'判断条件错误');
                        returnMsg.push(`${key}${groupErrSign}${group[i].title}${itemErrSign}判断条件错误`);
                        returnCode = -1;
                    }
                    if( (!Boolean(itemOnLinkFrom[0].condition) && itemOnLinkFrom[1].condition == 'YES') ||  (!itemOnLinkFrom[1].condition && itemOnLinkFrom[0].condition == 'YES')){
                        console.log(key,group[i].title,'判断条件错误');
                        returnMsg.push(`${key}${groupErrSign}${group[i].title}${itemErrSign}判断条件错误`);
                        returnCode = -1;
                    }
                }
            }

            // if (group[i].category === 'if') {
            //     const itemOnLinkFrom = _.filter(linkDataArray, function (link) {
            //         return link.from === group[i].key
            //     });
            //     let condition='';
            //     for(let j=0,len=itemOnLinkFrom.length;j<len;j++){
            //         if(!itemOnLinkFrom[j].condition){
            //             console.log(key,group[i].title,'if没有判断条件')
            //             returnMsg.push(`${key}${groupErrSign}${group[i].title}${itemErrSign}if没有判断条件`)
            //             returnCode = -1;
            //         }else {
            //             if(itemOnLinkFrom[j].condition===condition){
            //                 console.log(key,group[i].title,'if判断条件相同');
            //                 returnMsg.push(`${key}${groupErrSign}${group[i].title}${itemErrSign}if判断条件相同`)
            //                 returnCode = -1;
            //             }
            //             condition=itemOnLinkFrom[j].condition
            //         }
            //     }
            //
            // }

            if( group[i].category === 'errOut'){
                const itemOnLinkTo = _.filter(linkDataArray, function (link) {
                    return link.to === group[i].key
                });
                console.log('itemOnLinkTo',itemOnLinkTo)
                for(let j=0,len=itemOnLinkTo.length;j<len;j++){
                    let itemToErrOut=_.find(group,function (o) {
                        return o.key===itemOnLinkTo[j].from
                    })
                    if(itemToErrOut.category !== 'item'){
                        console.log(key,group[i].title,' 输入连线的图形不是dll方法');
                        returnMsg.push(`${key}${groupErrSign}${group[i].title}${itemErrSign}输入连线的图形不是dll方法`);
                        returnCode = -1;
                    }
                }
            }

            if (group[i].category === 'OfGroups' || group[i].category === 'ForGroups' || group[i].category === 'errOut') {
                const itemOnLinkFrom = _.filter(linkDataArray, function (link) {
                    return link.from === group[i].key
                });

                if (itemOnLinkFrom.length > 1) {
                    console.log(key,group[i].title,'有多条输出连线')
                    returnMsg.push(`${key}${groupErrSign}${group[i].title}${itemErrSign}有多条输出连线`)
                    returnCode = -1;
                }
            }
            if (group[i].category === 'end') {
                const endOnLink = _.filter(linkDataArray, function (link) {
                    return link.to === group[i].key
                });
                if (endOnLink.length === 0) {
                    console.log(key,'终点没有输入连线')
                    returnMsg.push(`${key}${groupErrSign}${group[i].title}${itemErrSign}没有输入连线`)
                    returnCode = -1;
                }
            }
        }
    });
    return {returnCode,returnMsg}
}


function listParents(tree, node) {
    if (!node.group) {
        return []
    }
    return _list(tree, tree[node.group].node)
    function _list (tree, node) {
        if (node.group === undefined) {
            return [node]
        } else {
            return _list(tree, tree[node.group].node).concat([node])
        }
    }
}

/**
 * 查找所有的父/子节点
 * */
const findP=(zNodes,node)=> {
    let ans=[];
    for(let i=0;i<zNodes.length;i++){
        if(node.group==zNodes[i].key){
            if(!zNodes[i].group){
                return [zNodes[i]];
            }
            ans.push(zNodes[i]);
            return  ans.concat(findP(zNodes,zNodes[i]));
        }
    }
};
exports.findParents=findP;

const findC=(zNodes,node)=> {
    let ans=[];
    for(var i=0;i<zNodes.length;i++){
        if(node.key==zNodes[i].group){
            ans.push(zNodes[i]);
            ans=ans.concat(findC(zNodes,zNodes[i]));
        }
    }
    return ans;
}

exports.findChildren=findC;

/**
 * 判断分组是不是全选或非全选，返回修改后的json
 * */
exports.transformPrintJson = (transformJson) => {
    if(!transformJson){
        console.log('没有传入transformJson');
        return false
    }
    const groups = _.groupBy(transformJson.nodeDataArray, 'group');
    _.forEach(groups, function (group, key) {
        if (key !== 'undefined') {
            const findKey=_.find(transformJson.nodeDataArray, function(o) { return o.key===key; });
            if(findKey){
                const findAllChildren=findC(transformJson.nodeDataArray,findKey)
                const everyNodePrint=_.every(findAllChildren, ['isPrint', true]);
                const findEditIndex=_.findIndex(transformJson.nodeDataArray, findKey);
                if(everyNodePrint){
                    transformJson.nodeDataArray[findEditIndex].isPrint=true
                }else{
                    transformJson.nodeDataArray[findEditIndex].isPrint=false
                }
            }

        }
    });
    return transformJson
}