/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import {Button, message, Input, Icon} from 'antd'
import './drawScript.less';
import uuidv4 from 'uuid/v4';
import axios from 'axios'
import {getHeader, converErrorCodeToMsg, findChildren, findParents} from './../../common/common';
import configJson from 'configJson' ;
const _ = require('lodash');
var $ = window.$;
var go = window.go;
var myDiagram = null;
var myPalette = null;
var myOverview = null;
class ScriptIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            testFuncData: [],
            hadEdit: false
        };
    }

    componentDidMount() {
        // this.getTestFunctions()
    }

    getTestFunctions = ()=> {
        const that = this;
        axios({
            url: `${configJson.prefix}/test_functions`,
            method: 'get',
            params: {
                return: 'all'
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                let testFuncData = [];
                for (let i = 0, len = response.data.data.length; i < len; i++) {
                    let funcItem = response.data.data[i];
                    let addData = {
                        key: uuidv4(),
                        category: "item",
                        desc: funcItem.display_name,
                        title: funcItem.action,
                        action: funcItem.action,
                        params: [],
                        // errors: [{key: 'key', value: 'value'}],
                        // upper_limit: 0,
                        // lower_limit: 0,
                        // outcome_variable: '结果变量',
                        isPrint: true
                    }
                    for (let j = 0, len2 = funcItem.parameters.length; j < len2; j++) {
                        let paramItem = funcItem.parameters[j];
                        addData.params.push({
                            key: paramItem.name,
                            value: paramItem.default_value,
                            is_output_parameter: paramItem.is_output_parameter === 1
                        })
                    }
                    testFuncData.push(addData)
                }
                that.setState({
                    testFuncData: testFuncData
                })
                const myPaletteModel = JSON.parse(myPalette.model.toJson()).nodeDataArray;
                myPalette.model = new go.GraphLinksModel(myPaletteModel.concat(testFuncData))
                console.log('加载functionData')
            }).catch(function (error) {
            console.log('获取出错', error);
            converErrorCodeToMsg(error)
        })
    }
    showLinkLabel = (e)=> {
        // console.log('e.subject.fromNode.data', e.subject.fromNode.data)
        var label = e.subject.findObject("LABEL");// name: "LABEL"
        if (label !== null) {
            label.visible = ( ( e.subject.fromNode.data.category === "if" || e.subject.fromNode.data.category === 'item') );
        }
        //如果figure=Diamond则线的文字可以编辑
    }
    nodeStyle = ()=> {
        const that = this;
        return [
            // The Node.location comes from the "loc" property of the node data,
            // converted by the Point.parse static method.
            // If the Node.location is changed, it updates the "loc" property of the node data,
            // converting back using the Point.stringify static method.
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            {
                // the Node.location is at the center of each node
                locationSpot: go.Spot.Center,
                //isShadowed: true,
                shadowColor: "#888",
                // handle mouse enter/leave events to show/hide the ports
                mouseEnter: function (e, obj) {
                    that.showPorts(obj.part, true);
                },
                mouseLeave: function (e, obj) {
                    that.showPorts(obj.part, false);
                }
            }
        ]
    }
    makePort = (name, spot, output, input)=> {
        // the port is basically just a small circle that has a white stroke when it is made visible
        return $(go.Shape, "Circle",
            {
                fill: "transparent",
                stroke: null,  // this is changed to "white" in the showPorts function
                desiredSize: new go.Size(8, 8),
                alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                portId: name,  //点属性的描述 declare this object to be a "port"
                fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                fromLinkable: output, toLinkable: input,  //输入和输出 declare whether the user may draw links to/from here
                cursor: "pointer"  // show a different cursor to indicate potential link point
            });
    }
    showPorts = (node, show)=> {
        var diagram = node.diagram;
        if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
        node.ports.each(function (port) {
            port.stroke = (show ? "#333" : null);
        });
    }
    highlightGroup = (e, grp, show)=> {
        if (!grp) return;
        e.handled = true;
        if (show) {
            // cannot depend on the grp.diagram.selection in the case of external drag-and-drops;
            // instead depend on the DraggingTool.draggedParts or .copiedParts
            var tool = grp.diagram.toolManager.draggingTool;
            var map = tool.draggedParts || tool.copiedParts;  // this is a Map
            // now we can check to see if the Group will accept membership of the dragged Parts
            if (grp.canAddMembers(map.toKeySet())) {
                grp.isHighlighted = true;
                return;
            }
        }
        grp.isHighlighted = false;
    }
    finishDrop = (e, grp) => {
        (grp !== null
            ? grp.addMembers(grp.diagram.selection, true)
            : e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true));
    }
    renderDelButton = (name)=> {
        return (
            $("Button",
                {
                    column: 3,
                    margin: new go.Margin(0, 1, 0, 0),
                    click: function (e, obj) {
                        const n = obj.part;//myDiagram.selection.first()//获取选中的节点
                        if (n === null) return;
                        const itempanel = obj.panel;
                        const d = n.data;
                        if (d[name].length === 1 && name === 'params') {
                            message.error('参数个数至少为一个');
                            return false
                        }
                        myDiagram.startTransaction("removeFromTable");
                        // remove second item of list, at index #1
                        myDiagram.model.removeArrayItem(d[name], itempanel.row);
                        myDiagram.commitTransaction("removeFromTable");
                    }
                },
                $(go.Shape, "ThinX",
                    {desiredSize: new go.Size(8, 8)})
            )
        )
    }
    addReason = (e, obj)=> {
        var adorn = obj.part;
        if (adorn === null) return;
        e.handled = true;
        var arr = adorn.adornedPart.data.params;
        myDiagram.model.addArrayItem(arr, {key: 'key', value: 'value'});
    }
    addFormulaParam = (e, obj)=> {
        var adorn = obj.part;
        if (adorn === null) return;
        e.handled = true;
        var arr = adorn.adornedPart.data.params;
        myDiagram.model.addArrayItem(arr, {key: 'key', value: 'value', is_output_parameter: false,});

    }
    addErrorParam = (e, obj)=> {
        var adorn = obj.part;
        if (adorn === null) return;
        e.handled = true;
        var arr = adorn.adornedPart.data.errors;
        myDiagram.model.addArrayItem(arr, {key: 'key', value: 'value'});
    }
    renderPrintCheckbox = (isRight)=> {
        const that = this;
        return (
            $("CheckBox", "isPrint", {
                    column: 2,
                    alignment: isRight ? go.Spot.Right : go.Spot.Center,
                    margin: new go.Margin(0, 10, 0, 10),
                },
                { // _doClick is executed within a transaction by the CheckBoxButton click function
                    "_doClick": function (e, obj) {
                        var contextmenu = obj.part;
                        // get the node data to which the Node is data bound
                        var nodedata = contextmenu.data;
                        that.findFromNode(nodedata)
                    }
                })
        )
    }
    init = (cb, cbArg)=> {
        const that = this;
        const titleFont = "11pt Verdana, sans-serif";
        const lightText = 'whitesmoke';
        const myDiagramDiv = document.querySelector('#myDiagramDiv');
        let formulaArr = [
            {title: "分组", isGroup: true, category: "OfGroups", isPrint: true},
            {title: "循环分组", isGroup: true, category: "ForGroups", default_value: 100, times: 1, isPrint: true},
            {title: "条件语句", category: "if", isPrint: true},
            // {title: "错误输出", category: "errOut", isPrint: false},
            {category: "start", title: "开始", loc: "0 0", belong: 'OfGroups', isPrint: true},
            {category: "start", title: "开始", loc: "0 0", belong: 'ForGroups', isPrint: true},
            {
                category: "end",
                title: "结束",
                loc: `${myDiagramDiv.offsetWidth - 80} ${myDiagramDiv.offsetHeight - 80}`,
                belong: 'OfGroups',
                isPrint: true
            },
            {
                category: "end",
                title: "结束",
                loc: `${myDiagramDiv.offsetWidth - 80} ${myDiagramDiv.offsetHeight - 80}`,
                belong: 'ForGroups',
                isPrint: true
            },
            {category: "end", title: "结束", isPrint: true},
            {category: "comment", title: "备注", isPrint: false},
            // {category: "set", params: [{key: 'key', value: 'value'}], title: '设置参数'},
            {
                category: "item",
                desc: "dll方法",
                title: 'action',
                action: 'action',
                params: [
                    {key: 'key', value: 'value', is_output_parameter: true,},
                    {key: 'key', value: 'value', is_output_parameter: false,},
                    {key: 'key', value: 'value', is_output_parameter: true,}
                ],
                // errors: [{key: 'key', value: 'value'}],
                // upper_limit: 0,
                // lower_limit: 0,
                // outcome_variable: '结果变量',
                isPrint: true
            }];
        if (this.state.testFuncData.length > 0) {
            console.log('拼接原有的test_function')
            formulaArr = formulaArr.concat(this.state.testFuncData)
        }
        let OfGroupsId = '';
        let ForGroupsId = '';
        for (let i = 0, len = formulaArr.length; i < len; i++) {
            let uuidIn = uuidv4();
            formulaArr[i].key = uuidIn;
            if (formulaArr[i].category === 'OfGroups') {
                OfGroupsId = uuidIn
            }
            if (formulaArr[i].category === 'ForGroups') {
                ForGroupsId = uuidIn
            }
            if (formulaArr[i].belong === 'OfGroups') {
                formulaArr[i].group = OfGroupsId
            }
            if (formulaArr[i].belong === 'ForGroups') {
                formulaArr[i].group = ForGroupsId
            }
        }

        myDiagram =
            $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
                {
                    initialContentAlignment: go.Spot.Center,
                    "LinkDrawn": that.showLinkLabel,  //画线
                    "LinkRelinked": that.showLinkLabel,//重新连接
                    allowDrop: true,  // must be true to accept drops from the Palette
                    "animationManager.duration": 1, // slightly longer than default (600ms) animation
                    "undoManager.isEnabled": true,  // enable Ctrl-Z to undo and Ctrl-Y to redo 可以撤销
                });

        myDiagram.model.copiesArrays = true;//设置这个使用itemArr数据才不会互相影响
        myDiagram.model.copiesArrayObjects = true;//设置这个使用itemArr数据才不会互相影响
        myDiagram.addDiagramListener("Modified", function (e) {
            // var button = document.getElementById("SaveButton");
            // if (button) button.disabled = !myDiagram.isModified;//当图标不修改时，保存按钮不可用
            // var idx = document.title.indexOf("*");//改变页面的标题
            // if (myDiagram.isModified) {
            //     if (idx < 0) document.title += "*";
            // } else {
            //     if (idx >= 0) document.title = document.title.substr(0, idx);
            // }
            // that.setState({
            //     hadEdit:true
            // })
        });
        myDiagram.nodeTemplateMap.add("if",
            $(go.Node, "Spot", that.nodeStyle(),//节点最外层根据loc属性定位
                // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                $(go.Panel, "Auto",//节点第二层定义Panel
                    $(go.Shape, "Card",//节点第三层定义Shape,
                        {fill: "#A570AD", stroke: null}),//Shape绑定figure
                    $(go.Panel, "Horizontal",
                        $(go.TextBlock,//节点第三层定义TextBlock
                            {
                                font: "bold 11pt Helvetica, Arial, sans-serif",
                                stroke: lightText,
                                margin: 8,
                                maxSize: new go.Size(160, NaN),
                                wrap: go.TextBlock.WrapFit,
                                editable: true//是否可以编辑，默认是false
                            },
                            new go.Binding("text", "title").makeTwoWay()),//TextBlock绑定text属性
                        that.renderPrintCheckbox()
                    )
                ),
                // four named ports, one on each side:
                that.makePort("T", go.Spot.Top, false, true),//创建点，顶点不可输出，可以输入
                that.makePort("L", go.Spot.Left, true, true),
                that.makePort("R", go.Spot.Right, true, true),
                that.makePort("B", go.Spot.Bottom, true, false)
            ));
        myDiagram.nodeTemplateMap.add("errOut",
            $(go.Node, "Spot", that.nodeStyle(),//节点最外层根据loc属性定位
                // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                $(go.Panel, "Auto",//节点第二层定义Panel
                    $(go.Shape, "Ellipse",//节点第三层定义Shape,
                        {fill: "#E20048", stroke: null}),//Shape绑定figure
                    $(go.Panel, "Horizontal",
                        $(go.TextBlock,//节点第三层定义TextBlock
                            {
                                font: "bold 11pt Helvetica, Arial, sans-serif",
                                stroke: lightText,
                                margin: 8,
                                maxSize: new go.Size(160, NaN),
                                wrap: go.TextBlock.WrapFit,
                                editable: false,//是否可以编辑，默认是false
                            },
                            new go.Binding("text", "title").makeTwoWay()),//TextBlock绑定text属性
                        that.renderPrintCheckbox()
                    )
                ),
                // four named ports, one on each side:
                that.makePort("T", go.Spot.Top, false, true),//创建点，顶点不可输出，可以输入
                that.makePort("L", go.Spot.Left, true, true),
                that.makePort("R", go.Spot.Right, true, true),
                that.makePort("B", go.Spot.Bottom, true, false)
            ));
        myDiagram.nodeTemplateMap.add("start",
            $(go.Node, "Spot",
                // new go.Binding("guid", "num"),
                {
                    // copyable: false,
                    deletable: false  // do not allow this node to be removed by the user
                }, that.nodeStyle(),
                $(go.Panel, "Auto",
                    $(go.Shape, "Circle",
                        {minSize: new go.Size(40, 40), fill: "#79C900", stroke: null}),
                    $(go.Panel, "Vertical",
                        $(go.TextBlock, "Start",
                            {font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText},
                            new go.Binding("text", "title")),
                        that.renderPrintCheckbox()
                    )
                ),
                // three named ports, one on each side except the top, all output only:
                that.makePort("L", go.Spot.Left, true, false),
                that.makePort("R", go.Spot.Right, true, false),
                that.makePort("B", go.Spot.Bottom, true, false)
            ));

        myDiagram.nodeTemplateMap.add("end",
            $(go.Node, "Spot",
                // new go.Binding("guid", "num"),
                that.nodeStyle(),
                $(go.Panel, "Auto",
                    $(go.Shape, "Circle",
                        {fill: "#000", stroke: null}),
                    $(go.Panel, "Vertical",
                        $(go.TextBlock, "End",
                            {font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText},
                            new go.Binding("text", "title")),
                        that.renderPrintCheckbox()
                    )
                ),
                // three named ports, one on each side except the bottom, all input only:
                that.makePort("T", go.Spot.Top, false, true),
                that.makePort("L", go.Spot.Left, false, true),
                that.makePort("R", go.Spot.Right, false, true)
            ));
        myDiagram.nodeTemplateMap.add("comment",
            $(go.Node, "Auto", this.nodeStyle(),
                $(go.Shape, "File",
                    {fill: "#EFFAB4", stroke: null}),
                $(go.Panel, "Vertical",
                    $(go.TextBlock,
                        {
                            margin: new go.Margin(5, 5, 0, 5),
                            textAlign: "center",
                            editable: true,
                            font: titleFont,
                            stroke: '#454545'
                        },
                        new go.Binding("text", "title").makeTwoWay()),
                    that.renderPrintCheckbox()
                )
                // no ports, because no links are allowed to connect with a comment
            ));

        var actionTemplate =
            $(go.Panel, "TableRow",
                // $("CheckBox", "is_output_parameter",
                //     {column: 0},
                // ),
                $(go.Shape,
                    "SplitEndArrow",
                    {
                        column: 0,
                        width: 15, height: 15,
                        stroke: "#C2185B",
                        fill: "#F48FB1",
                        strokeWidth: 1,
                    },
                    new go.Binding("visible", "is_output_parameter"),
                    // bind the Shape.figure to the figure name, which automatically gives the Shape a Geometry
                ),
                $(go.TextBlock, "key",
                    {column: 1, margin: 5, font: " 10pt sans-serif", editable: true},
                    new go.Binding("text", "key").makeTwoWay()
                ),
                $(go.TextBlock, "value",
                    {column: 2, margin: 5, font: " 10pt sans-serif", editable: true,},
                    new go.Binding("text", "value").makeTwoWay()
                ),
                // this.renderDelButton('params')
            );
        var errorTemplate =
            $(go.Panel, "TableRow",
                $(go.TextBlock, "ErrorKey",
                    {
                        column: 0,
                        margin: 5,
                        font: " 10pt sans-serif",
                        editable: true,
                        //在index.html中引入TextEditorSelectBox.js
                        //不能在myDiagram初始化的时候定义 "textEditingTool.defaultTextEditor": window.TextEditorSelectBox,这样会使所有的编辑框变为下拉
                        //textEditor只针对当前的编辑框，要在这里设置choices
                        textEditor: window.TextEditorSelectBox,
                        choices: ['400', '401', '404', '500']
                    },
                    new go.Binding("text", "key").makeTwoWay()
                ),
                $(go.TextBlock, "ErrorValue",
                    {column: 1, margin: 5, font: " 10pt sans-serif", editable: true,},
                    new go.Binding("text", "value").makeTwoWay()
                ),
                this.renderDelButton('errors')
            );
        myDiagram.nodeTemplateMap.add("item",
            $(go.Node, "Auto",
                // define the node's outer shape

                that.nodeStyle(),
                $(go.Shape, "RoundedRectangle",
                    {
                        fill: '#FFDD33', portId: "", toEndSegmentLength: 150
                    }),
                $(go.Panel, "Vertical",
                    // headered by a label and a PanelExpanderButton inside a Table
                    $(go.Panel, "Table",
                        {stretch: go.GraphObject.Horizontal, minSize: new go.Size(150, 40)},
                        $(go.Panel, "Horizontal",
                            {
                                column: 0,
                                alignment: go.Spot.Left,
                            },
                            $("PanelExpanderButton", "COLLAPSIBLE",  //引用下拉菜单COLLAPSIBLE name of the object to make visible or invisible
                                {width: 15, alignment: go.Spot.Left, margin: new go.Margin(0, 0, 0, 10),}
                            ),
                            $(go.TextBlock,
                                {
                                    editable: true,
                                    alignment: go.Spot.Left,
                                    font: titleFont,
                                },
                                new go.Binding("text", "title").makeTwoWay()
                            ),
                        ),

                        that.renderPrintCheckbox(true)
                    ),
                    $(go.Panel, "Vertical",
                        {
                            name: "COLLAPSIBLE",  //定义下拉菜单COLLAPSIBLE identify to the PanelExpanderButton
                            visible: false,
                            stretch: go.GraphObject.Horizontal,  // take up whole available width
                            defaultAlignment: go.Spot.Center,  // thus no need to specify alignment on each element
                        },
                        $(go.Panel, "Table",
                            {
                                background: "#00A9C9",
                                stretch: go.GraphObject.Horizontal,  // take up whole available width
                                defaultRowSeparatorStroke: "gray",
                                defaultColumnSeparatorStroke: "gray"
                            },
                            $(go.TextBlock, "方法描述",
                                {row: 0, column: 0, margin: 5, font: " 10pt sans-serif"}),
                            $(go.TextBlock,
                                {
                                    row: 0,
                                    column: 1,
                                    margin: new go.Margin(0, 10, 0, 10),
                                    font: " 10pt sans-serif",
                                    editable: true,
                                },
                                new go.Binding("text", "desc").makeTwoWay(),
                            ),
                            $(go.TextBlock, "方法名称",
                                {visible:false,row: 1, column: 0, margin: 5, font: " 10pt sans-serif"}),
                            $(go.TextBlock,
                                {
                                    visible:false,
                                    row: 1,
                                    column: 1,
                                    margin: new go.Margin(0, 10, 0, 10),
                                    font: " 10pt sans-serif",
                                    editable: true,
                                },
                                new go.Binding("text", "desc").makeTwoWay(),
                            ),
                            // $(go.TextBlock, "结果下限",
                            //     {row: 1, column: 0, margin: 5, font: " 10pt sans-serif"}),
                            // $(go.TextBlock,
                            //     {
                            //         row: 1,
                            //         column: 1,
                            //         margin: new go.Margin(0, 10, 0, 0),
                            //         font: " 10pt sans-serif",
                            //         editable: true,
                            //     },
                            //     new go.Binding("text", "lower_limit").makeTwoWay(),
                            // ),
                            // $(go.TextBlock, "结果上限",
                            //     {row: 2, column: 0, margin: 5, font: " 10pt sans-serif"}),
                            // $(go.TextBlock,
                            //     {
                            //         row: 2,
                            //         column: 1,
                            //         margin: new go.Margin(0, 10, 0, 0),
                            //         font: " 10pt sans-serif",
                            //         editable: true,
                            //     },
                            //     new go.Binding("text", "upper_limit").makeTwoWay(),
                            // ),
                            // $(go.TextBlock, "结果变量",
                            //     {row: 3, column: 0, margin: 5, font: " 10pt sans-serif"}),
                            // $(go.TextBlock,
                            //     {
                            //         row: 3,
                            //         column: 1,
                            //         margin: new go.Margin(0, 10, 0, 0),
                            //         font: " 10pt sans-serif",
                            //         editable: true,
                            //     },
                            //     new go.Binding("text", "outcome_variable").makeTwoWay(),
                            // ),
                        ),
                        $(go.Panel, "Vertical",
                            {
                                stretch: go.GraphObject.Horizontal,  // take up whole available width
                            },
                            // {
                            //     contextMenu:     // define a context menu for each node
                            //         $(go.Adornment, "Vertical",  // that has one button
                            //             $("ContextMenuButton",
                            //                 $(go.TextBlock, "添加参数"),
                            //                 {click: this.addFormulaParam})
                            //             // more ContextMenuButtons would go here
                            //         )  // end Adornment
                            // },
                            $(go.TextBlock, "参数",
                                {
                                    margin: new go.Margin(10, 0, 0, 0),
                                    font: " 10pt sans-serif",
                                    alignment: go.Spot.Left,
                                    stretch: go.GraphObject.Horizontal,
                                },
                            ),
                            $(go.Panel, "Table",

                                {
                                    stretch: go.GraphObject.Horizontal,  // take up whole available width
                                    defaultRowSeparatorStroke: "gray",
                                    defaultColumnSeparatorStroke: "gray"
                                },
                                {
                                    background: "#00A9C9",  // to distinguish from the node's body
                                    itemTemplate: actionTemplate  // the Panel created for each item in Panel.itemArray
                                },
                                new go.Binding("itemArray", "params").makeTwoWay()  // bind Panel.itemArray to nodedata.actions
                            ),  // end action list Vertical Panel
                        ),
                        // $(go.Panel, "Vertical",
                        //     {
                        //         stretch: go.GraphObject.Horizontal,  // take up whole available width
                        //     },
                        //     {
                        //         contextMenu:     // define a context menu for each node
                        //             $(go.Adornment, "Vertical",  // that has one button
                        //                 $("ContextMenuButton",
                        //                     $(go.TextBlock, "添加错误码"),
                        //                     {click: this.addErrorParam})
                        //             )  // end Adornment
                        //     },
                        //     $(go.TextBlock, "错误码",
                        //         {
                        //             font: " 10pt sans-serif",
                        //             alignment: go.Spot.Left,
                        //             margin: new go.Margin(10, 0, 0, 0),
                        //             stretch: go.GraphObject.Horizontal,
                        //         },
                        //     ),
                        //     $(go.Panel, "Table",
                        //
                        //         {
                        //             stretch: go.GraphObject.Horizontal,  // take up whole available width
                        //             defaultRowSeparatorStroke: "gray",
                        //             defaultColumnSeparatorStroke: "gray"
                        //         },
                        //         {
                        //             background: "#00A9C9",  // to distinguish from the node's body
                        //             itemTemplate: errorTemplate  // the Panel created for each item in Panel.itemArray
                        //         },
                        //         new go.Binding("itemArray", "errors").makeTwoWay()  // bind Panel.itemArray to nodedata.actions
                        //     ),
                        // )
                    )  // end action list Vertical Panel
                ),  // end optional Vertical Panel
                that.makePort("T", go.Spot.Top, false, true),//创建点，顶点不可输出，可以输入
                that.makePort("L", go.Spot.Left, true, true),
                that.makePort("R", go.Spot.Right, true, true),
                that.makePort("B", go.Spot.Bottom, true, false)
            ));

        var reasonTemplate =
            $(go.Panel, "TableRow",
                $(go.TextBlock, "key",
                    {column: 0, margin: 5, font: " 11pt sans-serif", editable: true,},
                    new go.Binding("text", "key").makeTwoWay()
                ),
                $(go.TextBlock, "value",
                    {column: 1, margin: 5, font: " 11pt sans-serif", editable: true,},
                    new go.Binding("text", "value").makeTwoWay()
                ),
                this.renderDelButton('params')
            );

        myDiagram.nodeTemplateMap.add("set",
            $(go.Node, "Auto",
                that.nodeStyle(),
                // {selectionAdornmentTemplate: UndesiredEventAdornment},
                $(go.Shape, "RoundedRectangle",
                    {fill: "#CC5245", portId: "", strokeWidth: 1, stroke: "black", toEndSegmentLength: 150}),
                $(go.Panel, "Vertical",
                    $(go.Panel, "Table",
                        {stretch: go.GraphObject.Horizontal, minSize: new go.Size(150, 40)},
                        $(go.Panel, "Horizontal",
                            {
                                column: 0,
                                alignment: go.Spot.Left,
                            },
                            $("PanelExpanderButton", "COLLAPSIBLECONF",  //引用下拉菜单COLLAPSIBLE name of the object to make visible or invisible
                                {width: 15, alignment: go.Spot.Left, margin: new go.Margin(0, 0, 0, 10),}
                            ),
                            $(go.TextBlock,
                                {
                                    alignment: go.Spot.Left,
                                    font: titleFont,
                                },
                                new go.Binding("text", "title").makeTwoWay()
                            ),
                        ),

                        that.renderPrintCheckbox(true)
                    ),
                    $(go.Panel, "Table",
                        {
                            contextMenu:     // define a context menu for each node
                                $(go.Adornment, "Vertical",  // that has one button
                                    $("ContextMenuButton",
                                        $(go.TextBlock, "添加设置参数"),
                                        {click: this.addReason})
                                    // more ContextMenuButtons would go here
                                )  // end Adornment
                        },
                        {
                            defaultRowSeparatorStroke: "gray",
                            defaultColumnSeparatorStroke: "gray"
                        },
                        {
                            name: "COLLAPSIBLECONF",
                            visible: false,
                            stretch: go.GraphObject.Horizontal,  // take up whole available width
                            background: "#00A9C9",  // to distinguish from the node's body
                            itemTemplate: reasonTemplate
                        },
                        new go.Binding("itemArray", "params").makeTwoWay()
                    )
                )
            ));


        myDiagram.groupTemplateMap.add("OfGroups",
            $(go.Group, "Auto",
                that.nodeStyle(),
                {
                    doubleClick:that.showDetail,
                    background: "#FFFFFF",
                    isSubGraphExpanded: false,
                    // highlight when dragging into the Group
                    // mouseDragEnter: function (e, grp, prev) {//注释掉不可以直接往group里面添加
                    //     that.highlightGroup(e, grp, true);
                    // },
                    // mouseDragLeave: function (e, grp, next) {//注释掉不可以直接往group里面添加
                    //     that.highlightGroup(e, grp, false);
                    // },
                    // computesBoundsAfterDrag: true,//不设置这个才会拖动的时候同时改变大小
                    // when the selection is dropped into a Group, add the selected Parts into that Group;
                    // if it fails, cancel the tool, rolling back any changes
                    // mouseDrop: that.finishDrop,//注释掉不可以直接往group里面添加
                    handlesDragDropForMembers: false,  //设为false不可以直接往group里面添加
                    // Groups containing Groups lay out their members horizontally
                },
                new go.Binding("background", "isHighlighted", function (h) {
                    return h ? "#FFCCCC" : "#FFFFFF";
                }).ofObject(),
                $(go.Shape, "RoundedRectangle",
                    {fill: null, stroke: "black", strokeWidth: 1},
                    ),
                $(go.Panel, "Vertical",  // title above Placeholder
                    $(go.Panel, "Table",
                        {stretch: go.GraphObject.Horizontal, background: "#98FB98", minSize: new go.Size(150, 40)},
                        // {
                        //     contextMenu:     // define a context menu for each node
                        //         $(go.Adornment, "Vertical",  // that has one button
                        //             $("ContextMenuButton",
                        //                 $(go.TextBlock, "查看详细"),
                        //                 {click: this.showDetail})
                        //             // more ContextMenuButtons would go here
                        //         )  // end Adornment
                        // },
                        $(go.Panel, "Horizontal",  // button next to TextBlock
                            {
                                column: 0,
                                alignment: go.Spot.Left,
                            },
                            // $("SubGraphExpanderButton",
                            //     {alignment: go.Spot.Center, margin: 5}),
                            $(go.TextBlock,
                                {
                                    margin: new go.Margin(0, 0, 0, 15),
                                    alignment: go.Spot.Center,
                                    editable: true,
                                    font: titleFont,
                                },
                                new go.Binding("text", "title").makeTwoWay()),
                        ),
                        that.renderPrintCheckbox(true)
                    ),  // end Horizontal Panel
                    $(go.Placeholder,  // becomes zero-sized when Group.isSubGraphExpanded is false
                        {padding: 10},
                        new go.Binding("padding", "isSubGraphExpanded",
                            function (exp) {
                                return exp ? 10 : 0;
                            }).ofObject())
                ),  // end Vertical Panel

                // three named ports, one on each side except the bottom, all input only:
                that.makePort("T", go.Spot.Top, false, true),
                that.makePort("L", go.Spot.Left, true, true),
                that.makePort("R", go.Spot.Right, true, true),
                that.makePort("B", go.Spot.Bottom, true, false)
            ))
        ;  // end Group and call to add to template Map

        myDiagram.groupTemplateMap.add("ForGroups",
            $(go.Group, "Auto",

                that.nodeStyle(),
                {
                    doubleClick:that.showDetail,
                    background: "#FFFFFF",
                    isSubGraphExpanded: false,
                    handlesDragDropForMembers: false,  //设为false不可以直接往group里面添加
                },
                new go.Binding("background", "isHighlighted", function (h) {
                    return h ? "#FFCCCC" : "#FFFFFF";
                }).ofObject(),
                $(go.Shape, "RoundedRectangle",
                    {fill: null, stroke: "black", strokeWidth: 1}),
                $(go.Panel, "Vertical",  // title above Placeholder
                    $(go.Panel, "Table",  // button next to TextBlock
                        {stretch: go.GraphObject.Horizontal, background: "#00A9C9", minSize: new go.Size(200, 40)},
                        // {
                        //     contextMenu:     // define a context menu for each node
                        //         $(go.Adornment, "Vertical",  // that has one button
                        //             $("ContextMenuButton",
                        //                 $(go.TextBlock, "查看详细"),
                        //                 {click: this.showDetail})
                        //         )  // end Adornment
                        // },
                        $(go.Panel, "Horizontal",  // button next to TextBlock
                            {
                                column: 0,
                                alignment: go.Spot.Left,
                            },
                            // $("SubGraphExpanderButton",
                            //     {alignment: go.Spot.Center, margin: 5}),
                            $(go.TextBlock,
                                {
                                    margin: new go.Margin(0, 0, 0, 15),
                                    alignment: go.Spot.Center,
                                    editable: true,
                                    font: titleFont,
                                    stroke: lightText,
                                },
                                new go.Binding("text", "title").makeTwoWay()),
                            $(go.TextBlock, "默认值:",
                                {
                                    margin: new go.Margin(0, 0, 0, 5),
                                    alignment: go.Spot.Right,
                                    editable: false,
                                    font: "9pt Verdana, sans-serif",
                                    stroke: lightText,
                                }),
                            $(go.TextBlock,
                                {
                                    margin: new go.Margin(0, 5, 0, 0),
                                    alignment: go.Spot.Right,
                                    editable: true,
                                    font: titleFont,
                                    stroke: lightText,
                                },
                                new go.Binding("text", "default_value").makeTwoWay()),
                            $(go.TextBlock, "次数:",
                                {
                                    margin: new go.Margin(0, 0, 0, 5),
                                    alignment: go.Spot.Right,
                                    editable: false,
                                    font: "9pt Verdana, sans-serif",
                                    stroke: lightText,
                                }),
                            $(go.TextBlock,
                                {
                                    margin: new go.Margin(0, 5, 0, 0),
                                    alignment: go.Spot.Right,
                                    editable: true,
                                    font: titleFont,
                                    stroke: lightText,
                                },
                                new go.Binding("text", "times").makeTwoWay()),
                        ),
                        that.renderPrintCheckbox(true)
                    ),  // end Horizontal Panel
                    $(go.Placeholder,  // becomes zero-sized when Group.isSubGraphExpanded is false
                        {padding: 10},
                        new go.Binding("padding", "isSubGraphExpanded",
                            function (exp) {
                                return exp ? 10 : 0;
                            }).ofObject())
                ),  // end Vertical Panel

                // three named ports, one on each side except the bottom, all input only:
                that.makePort("T", go.Spot.Top, false, true),
                that.makePort("L", go.Spot.Left, true, true),
                that.makePort("R", go.Spot.Right, true, true),
                that.makePort("B", go.Spot.Bottom, true, false)
            ))
        ;  // end Group and call to add to template Map

        // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
        myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
        myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

        // create the Palette
        // myPalette =
        //     $(go.Palette, "myPaletteDiv");
        //
        // // the Palette's node template is different from the main Diagram's
        // myPalette.nodeTemplate =
        //     $(go.Node, "Horizontal",
        //         $(go.Shape,
        //             { width: 14, height: 14, fill: "white" },
        //             new go.Binding("fill", "color")),
        //         $(go.TextBlock,
        //             new go.Binding("text", "title"))
        //     );
        //
        // // the list of data to show in the Palette
        // myPalette.groupTemplate =
        //     $(go.Group, "Vertical",
        //         $(go.Panel, "Auto",
        //             $(go.Shape, "RoundedRectangle", new go.Binding("fill", "color"),
        //                 { fill: "white" }),
        //
        //             $(go.TextBlock,
        //                 {
        //                     font: "bold 11pt Helvetica, Arial, sans-serif",
        //                     //stroke: lightText,
        //                     margin: 8,
        //                     maxSize: new go.Size(40, 40),
        //                     textAlign: "center",
        //                     editable: false
        //                 },
        //                 new go.Binding("text", "text"))
        //         )
        //     );
        //
        // myPalette.model.nodeDataArray = formulaArr;


        myPalette =
            $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element

                {
                    layout: $(go.GridLayout, {alignment: go.GridLayout.Location}),
                    "animationManager.duration": 1, // slightly longer than default (600ms) animation
                    nodeTemplateMap: myDiagram.nodeTemplateMap,  // 使用myDiagram.nodeTemplateMap来定义图形 share the templates used by myDiagram
                    groupTemplateMap: myDiagram.groupTemplateMap,
                    /**
                     * model根据category来识别定义的图形
                     * 当没有category时使用 myDiagram.nodeTemplateMap.add("")定义的图形
                     * */
                    model: new go.GraphLinksModel(formulaArr)
                });
        myPalette.initialScale = 0.85;

        myDiagram.addDiagramListener("ExternalObjectsDropped", function (e) {
            var sel = e.diagram.selection;
            var elem = sel.first();
            console.log('selectText', elem.data.title);
            // elem.data.title='123'
            // var part = e.subject.part;
            // if ((part instanceof go.Link)) console.log(e.subject.link);
        })


        if (!this.state.testFuncData.length) {
            console.log('加载test_function')
            this.getTestFunctions()
        }

        myDiagram.linkTemplate =
            $(go.Link,  // the whole link panel
                {
                    routing: go.Link.AvoidsNodes,
                    curve: go.Link.JumpOver,
                    corner: 5, toShortLength: 4,
                    relinkableFrom: true,
                    relinkableTo: true,
                    reshapable: true,
                    resegmentable: true,
                    // mouse-overs subtly highlight links:
                    mouseEnter: function (e, link) {
                        link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
                    },
                    mouseLeave: function (e, link) {
                        link.findObject("HIGHLIGHT").stroke = "transparent";
                    }
                },
                new go.Binding("points").makeTwoWay(),
                $(go.Shape,  // the highlight shape, normally transparent
                    {isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT"}),
                $(go.Shape,  // the link path shape
                    {isPanelMain: true, stroke: "gray", strokeWidth: 2}),
                $(go.Shape,  // the arrowhead
                    {toArrow: "standard", stroke: null, fill: "gray"}),
                $(go.Panel, "Auto",  //是否显示线的描述文字 the link label, normally not visible
                    {
                        visible: false, name: "LABEL", margin: 10, segmentOffset: new go.Point(0, 15),
                    },
                    new go.Binding("visible", "visible").makeTwoWay(),
                    $(go.Shape, "RoundedRectangle",  // the label shape
                        {fill: "#F8F8F8", stroke: null}),
                    $(go.TextBlock, "YES",  // the label
                        {
                            segmentIndex: 2, segmentFraction: 0.5,
                            margin: 3,
                            font: "11pt helvetica, arial, sans-serif",
                            stroke: "#333333",
                            editable: true,
                            textEditor: window.TextEditorSelectBox,
                            choices: ['YES', 'NO']
                        },
                        new go.Binding("text", "condition").makeTwoWay())
                )
            );

        myPalette.layout.sorting = go.GridLayout.Forward;

        myOverview =
            $(go.Overview, "myOverviewDiv",  // the HTML DIV element for the Overview
                {observed: myDiagram, contentAlignment: go.Spot.Center});   // tell it which Diagram to show and pan
        if (!this.props.isNew) {
            that.load(that.props.json)
        }
        if (cb) {
            cb(cbArg)
        }
    }
    findFromNode = (node)=> {
        const model = myDiagram.model;
        const myDiagramJson = JSON.parse(model.toJson());
        const children = findChildren(myDiagramJson.nodeDataArray, node);
        const parents = findParents(myDiagramJson.nodeDataArray, node);

        if (node.category === 'ForGroups' || node.category === 'OfGroups') {
            _.forEach(children, function (value, key) {
                let findChildIndex = _.findIndex(myDiagramJson.nodeDataArray, function (o) {
                    return o.key == children[key].key;
                });
                myDiagramJson.nodeDataArray[findChildIndex].isPrint = node.isPrint;
                let data = model.nodeDataArray[findChildIndex];
                model.setDataProperty(data, "isPrint", node.isPrint);
            });
        }

        if (node.isPrint) {
            _.forEach(parents, function (value, key) {
                if (value) {
                    let findParentsIndex = _.findIndex(myDiagramJson.nodeDataArray, function (o) {
                        return o.key == parents[key].key;
                    });
                    myDiagramJson.nodeDataArray[findParentsIndex].isPrint = node.isPrint;
                    let data = model.nodeDataArray[findParentsIndex];
                    const findAllChildren = findChildren(myDiagramJson.nodeDataArray, data)
                    const everyNodePrint = _.every(findAllChildren, ['isPrint', true]);
                    if (everyNodePrint) {
                        model.setDataProperty(data, "isPrint", node.isPrint);
                    }
                }
            });
        } else {
            _.forEach(parents, function (value, key) {
                if (value) {
                    let findParentsIndex = _.findIndex(myDiagramJson.nodeDataArray, function (o) {
                        return o.key == parents[key].key;
                    });
                    let data = model.nodeDataArray[findParentsIndex];
                    model.setDataProperty(data, "isPrint", node.isPrint);
                }
            });
        }
    }
    showDetail = (e, obj) => {
        // get the context menu that holds the button that was clicked
        var contextmenu = obj.part;
        // get the node data to which the Node is data bound
        var nodedata = contextmenu.data;
        // compute the next color for the node
        let originJson = JSON.parse(this.callbackJson());
        console.log("nodedata", nodedata)
        let detailJon = {
            class: "go.GraphLinksModel",
            copiesArrays: true,
            copiesArrayObjects: true,
            linkFromPortIdProperty: "fromPort",
            linkToPortIdProperty: "toPort",
            nodeDataArray: [],
            linkDataArray: []
        };
        let keyInGroup = []
        for (let i = 0, len = originJson.nodeDataArray.length; i < len; i++) {
            if (originJson.nodeDataArray[i].group === nodedata.key) {
                detailJon.nodeDataArray.push(originJson.nodeDataArray[i]);
                keyInGroup.push(originJson.nodeDataArray[i].key)
            }
            if (originJson.nodeDataArray[i].isGroup === true && originJson.nodeDataArray[i].key !== nodedata.key) {
                for (let m = 0, len = originJson.nodeDataArray.length; m < len; m++) {
                    if (originJson.nodeDataArray[m].group === originJson.nodeDataArray[i].key) {
                        if (keyInGroup.indexOf(originJson.nodeDataArray[i].group) >= 0 || keyInGroup.indexOf(originJson.nodeDataArray[m].group) >= 0) {
                            detailJon.nodeDataArray.push(originJson.nodeDataArray[m]);
                            keyInGroup.push(originJson.nodeDataArray[m].key)
                        }
                    }
                }
            }
        }
        for (let j = 0, len = originJson.linkDataArray.length; j < len; j++) {
            delete  originJson.linkDataArray[j].points;
            if (keyInGroup.indexOf(originJson.linkDataArray[j].from) >= 0 || keyInGroup.indexOf(originJson.linkDataArray[j].to) >= 0) {
                detailJon.linkDataArray.push(originJson.linkDataArray[j]);
            }
        }

        sessionStorage.setItem(`${nodedata.key}`, JSON.stringify(detailJon));
        if (this.props.match.path === '/scriptManage/:id' || this.props.match.path === '/scriptDetail/:id') {
            this.props.getErrorInfo();
            this.props.saveTempScript();

            const scriptDiagramStorage = JSON.parse(sessionStorage.getItem('scriptDiagramStorage'));
            if (Array.indexOf(scriptDiagramStorage, `${nodedata.key}`) === -1) {
                scriptDiagramStorage.push(nodedata.key)
                sessionStorage.setItem('scriptDiagramStorage', JSON.stringify(scriptDiagramStorage))
            }

            const scriptStorage = JSON.parse(sessionStorage.getItem('scriptStorage'));
            if (Array.indexOf(scriptStorage, `${nodedata.key}`) === -1) {
                scriptStorage.push(nodedata.key)
                sessionStorage.setItem('scriptStorage', JSON.stringify(scriptStorage))
            }
            if (this.props.location.pathname === '/scriptManage/newScript') {
                this.props.history.push({
                    pathname: `/scriptDetail/${nodedata.key}`,
                    state: {groupNmae: nodedata.title, newScript: true, category: nodedata.category}
                })
            } else {
                this.props.history.push({
                    pathname: `/scriptDetail/${nodedata.key}`,
                    state: {groupNmae: nodedata.title, category: nodedata.category}
                })
            }
        } else if (this.props.match.path === '/segmentManage/:id' || this.props.match.path === '/segmentDetail/:id') {
            this.props.saveTempScript();

            const segmentDiagramStorage = JSON.parse(sessionStorage.getItem('segmentDiagramStorage'));
            if (Array.indexOf(segmentDiagramStorage, `${nodedata.key}`) === -1) {
                segmentDiagramStorage.push(nodedata.key)
                sessionStorage.setItem('segmentDiagramStorage', JSON.stringify(segmentDiagramStorage))
            }

            const segmentStorage = JSON.parse(sessionStorage.getItem('segmentStorage'));
            if (Array.indexOf(segmentStorage, `${nodedata.key}`) === -1) {
                segmentStorage.push(nodedata.key)
                sessionStorage.setItem('segmentStorage', JSON.stringify(segmentStorage))
            }

            if (this.props.location.pathname === '/segmentManage/newSegment') {
                this.props.history.push({
                    pathname: `/segmentDetail/${nodedata.key}`,
                    state: {groupNmae: nodedata.title, newSegment: true, category: nodedata.category}
                })
            } else {
                this.props.history.push({
                    pathname: `/segmentDetail/${nodedata.key}`,
                    state: {groupNmae: nodedata.title, category: nodedata.category}
                })
            }

        }

    }
    delDiagram = ()=> {
        myDiagram.div = null;//设置这个才可以清空原来div与图像的联系，然后可以重新初始化图像 https://my.oschina.net/u/2391658/blog/856390
        myPalette.div = null;
        myOverview.div = null;
    }
    setHadEditTrue = ()=> {
        console.log('设为true')
        myDiagram.isModified = true;
    }
    save = ()=> {
        document.getElementById("mySavedModel").value = myDiagram.model.toJson();
    }
    callbackJson = ()=> {
        return myDiagram.model.toJson();
    }
    callbackDiagram = ()=> {
        return myDiagram
    }
    load = (json)=> {
        myDiagram.model = go.Model.fromJson(json);
        this.setHadEditTrue()
    }
    loadTextArea = ()=> {
        myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
    }
    searchDiagram = ()=> {
        var input = document.getElementById("mySearch");
        if (!input) return;
        input.focus();

        if (input.value) {
            // search four different data properties for the string, any of which may match for success
            // create a case insensitive RegExp from what the user typed
            var regex = new RegExp(input.value, "i");
            var results = myDiagram.findNodesByExample({name: regex},
                {text: regex},
                {title: regex});
            // try to center the diagram at the first node that was found
            if (results.count > 0) {
                myDiagram.centerRect(results.first().actualBounds);
                myDiagram.select(results.first());
            }
        } else {  // empty string only clears highlighteds collection
            myDiagram.clearHighlighteds();
        }

    }
    keypressInput = (e)=> {
        if (e.which === 13) {
            this.searchDiagram()
        }
    }
    onscroll = (e)=> {
        this.setState({
            scrollTop: e.target.scrollTop,
            scrollLeft: e.target.scrollLeft
        })
    }
    getCenter = ()=> {
        var bottom = myDiagram.computeBounds().bottom
        var top = myDiagram.computeBounds().top
        const {scrollTop, scrollLeft}=this.state
        console.log("top", top)
        console.log("bottom", bottom)
        console.log("bottom-top", bottom - top)
        console.log("top+scrollTop", top + scrollTop)
    }
    callbackScrollAndBounds = ()=> {
        const left = myDiagram.computeBounds().left
        const top = myDiagram.computeBounds().top
        const {scrollTop, scrollLeft}=this.state
        return {top, left, scrollTop, scrollLeft}
    }
    renderParents = ()=> {
        const that = this;
        if (this.props.match.path !== '/segmentManage/:id' || this.props.match.path !== '/scriptManage/:id') {
            let json = [];
            if (this.props.match.path === '/scriptDetail/:id') {
                json = JSON.parse(sessionStorage.getItem('resultTempJson'))
            } else if (this.props.match.path === '/segmentDetail/:id') {
                json = JSON.parse(sessionStorage.getItem('segmentTempJson'))
            }
            const findKey = _.find(json.nodeDataArray, function (o) {
                return o.key === that.props.match.params.id;
            });
            if (findParents(json.nodeDataArray, findKey)) {
                let resultKeys = findParents(json.nodeDataArray, findKey).reverse().map(x => x.title);
                resultKeys.unshift('root');
                return resultKeys.join(' . ') + ' . ' + this.props.location.state.groupNmae;
            } else {
                return 'root' + ' . ' + this.props.location.state.groupNmae
            }
        } else {
            return 'root' + ' . ' + this.props.location.state.groupNmae
        }
    }
    toggle = () => {
        const collapsed = sessionStorage.getItem('collapsed');
        if (Number(collapsed)) {
            sessionStorage.setItem('collapsed', 0)
        } else {
            sessionStorage.setItem('collapsed', 1)
        }
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    openOrCloseFullPage = ()=> {
        const fullPaged = sessionStorage.getItem('fullPaged');
        if (Number(fullPaged)) {
            sessionStorage.setItem('fullPaged', 0)
        } else {
            sessionStorage.setItem('fullPaged', 1)
        }
        this.setState({
            fullPaged: !this.state.fullPaged,
        });
    }

    render() {
        const drawScriptSidebarWidth = Number(sessionStorage.getItem('collapsed')) ? '0 0 0px' : '0 0 250px';
        const fullPageClassName = Number(sessionStorage.getItem('fullPaged')) ? 'fullPage close':'fullPage open';
        return (
            <div>
                <div className="drawScript">
                    <div className="drawScript-search">
                        <span>图形名称 : </span>
                        <Input id="mySearch" style={{width: 150, marginRight: '10px'}} onKeyPress={this.keypressInput}/>
                        <Button type='primary' onClick={this.searchDiagram}>检索</Button>
                    </div>
                    <div id="drawScript-edit-container" className={Number(sessionStorage.getItem('fullPaged')) ?
                        this.props.match.path === '/scriptDetail/:id'|| this.props.match.path === '/segmentDetail/:id' ? 'fullPaged in-group':'fullPaged'
                        :''
                    }>
                        <div className="drawScript-sidebar" ref="drawScriptSidebar"
                             style={{flex: drawScriptSidebarWidth}}>
                            <div className="drawScript-overview" id="myOverviewDiv"></div>
                            <div id="myPaletteDiv"></div>
                        </div>
                        <div className="drawScript-content">
                            <Icon
                                className="palette-trigger"
                                type={Number(sessionStorage.getItem('collapsed')) ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            />
                            {(this.props.match.path === '/scriptDetail/:id' || this.props.match.path === '/segmentDetail/:id') ?
                                <div className="detail-header"
                                     style={{background: this.props.location.state.category === 'ForGroups' ? '#00A9C9' : '#98FB98'}}>
                                    <Button onClick={()=>this.props.turnBack()} style={{marginRight:'5px'}}>后退</Button>
                                    {this.renderParents()}
                                </div>
                                : null}
                            <div className="" id="myDiagramDiv" onScroll={this.onscroll}
                                 style={{
                                     height: (this.props.match.path === '/scriptDetail/:id' || this.props.match.path === '/segmentDetail/:id') ? `calc(100vh - 243px)` : `calc(100vh - 192px)`,
                                     minHeight: (this.props.match.path === '/scriptDetail/:id' || this.props.match.path === '/segmentDetail/:id') ? 'calc(700px - 47px)' : '700px'
                                 }}>
                            </div>

                            <span className={fullPageClassName} onClick={this.openOrCloseFullPage}>
                        </span>
                        </div>
                    </div>
                </div>


              {/*  <div>
                    <Button id="getCenter" onClick={this.addPalatte}>添加左侧语句</Button>
                    <Button id="SaveButton" onClick={this.save}>将图表转为JSON</Button>
                    <Button onClick={this.loadTextAxrea}>将JSON转为图表</Button>
                </div>

                <textarea id="mySavedModel"></textarea>*/}
            </div>


        )
    }
}
export default ScriptIndex;