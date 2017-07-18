/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import {Button,message} from 'antd'
import './drawScript.less';
import uuidv4 from 'uuid/v4';


var $ = window.$;
var go = window.go;
var myDiagram = null;
var myPalette = null;
var myOverview = null;
class ScriptIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollTop: 0,
            scrollLeft: 0
        };
    }

    componentDidMount() {
        // this.init();
    }

    showLinkLabel = (e)=> {
        // console.log('e.subject.fromNode.data', e.subject.fromNode.data)
        var label = e.subject.findObject("LABEL");// name: "LABEL"
        if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond" /*|| e.subject.fromNode.data.category === 'item'*/ );
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
                //shadowColor: "#888",
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
    renderDelButton=(name)=>{
        return(
            $("Button",
                {
                    column: 3,
                    margin: new go.Margin(0, 1, 0, 0),
                    click: function(e, obj) {
                        const n  = obj.part;//myDiagram.selection.first()//获取选中的节点
                        if (n === null) return;
                        const itempanel = obj.panel;
                        const d = n.data;
                        if(d[name].length===1){
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
                    { desiredSize: new go.Size(8, 8) })
            )
        )
    }
    addReason = (e, obj)=> {
        var adorn = obj.part;
        if (adorn === null) return;
        e.handled = true;
        var arr = adorn.adornedPart.data.params;
        myDiagram.model.addArrayItem(arr, {key:'key',value:'value'});
    }
    addFormulaParam = (e, obj)=> {
        var adorn = obj.part;
        if (adorn === null) return;
        e.handled = true;
        var arr = adorn.adornedPart.data.params;
        myDiagram.model.addArrayItem(arr, {key:'key',value:'value'});
    }
    addErrorParam = (e, obj)=> {
        var adorn = obj.part;
        if (adorn === null) return;
        e.handled = true;
        var arr = adorn.adornedPart.data.errors;
        myDiagram.model.addArrayItem(arr, {key:'key',value:'value'});
    }
    init = (cb, cbArg)=> {
        const that = this;
        const titleFont = "11pt Verdana, sans-serif";
        const lightText = 'whitesmoke';
        let formulaArr = [
            {title: "分组", isGroup: true, category: "OfGroups"},
            {title: "循环分组", isGroup: true, category: "ForGroups", times: 1},
            {title: "条件语句", category: "if", figure: "Diamond"},
            // {text: "循环语句", category: "for", figure: "Diamond"},
            {title: "错误输出", category: "errOut"},
            {category: "start", title: "开始", loc: "80 75", belong: 'OfGroups'},
            {category: "start", title: "开始", loc: "80 75", belong: 'ForGroups'},
            {category: "end", title: "结束", loc: "80 475", belong: 'OfGroups'},
            {category: "end", title: "结束", loc: "80 475", belong: 'ForGroups'},
            {category: "end", title: "结束"},
            {category: "comment", title: "备注"},
            {category: "set", params: [{key:'key',value:'value'}], title: '设置参数'},
            {
                category: "item",
                title: "方法标题",
                identity:'方法名称',
                params: [
                    {key:'key',value:'value'}
                ],
                errors: [{key:'key',value:'value'}],
                upper_limit: 0,
                lower_limit: 0
            },
            {
                category: "item",
                title: "测试3.3v 上电延迟",
                identity:'test_ele_delay_on_3_3v',
                params: [
                    {key: 'id', value: '0'},
                    {key: 'max', value: '3300'},
                    {key: 'mini', value: '0'}
                ],
                errors: [
                    {key: '404', value: 'URL地址无法访问'},
                    {key: '500', value: '服务器错误'}
                ],
                upper_limit: 120,
                lower_limit: 100
            }];
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
        });

        myDiagram.nodeTemplateMap.add("if",
            $(go.Node, "Spot", that.nodeStyle(),//节点最外层根据loc属性定位
                // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                $(go.Panel, "Auto",//节点第二层定义Panel
                    $(go.Shape, "Diamond",//节点第三层定义Shape,
                        {fill: "#00A9C9", stroke: null}),//Shape绑定figure
                    $(go.TextBlock,//节点第三层定义TextBlock
                        {
                            font: "bold 11pt Helvetica, Arial, sans-serif",
                            stroke: lightText,
                            margin: 8,
                            maxSize: new go.Size(160, NaN),
                            wrap: go.TextBlock.WrapFit,
                            editable: true//是否可以编辑，默认是false
                        },
                        new go.Binding("text", "title").makeTwoWay())//TextBlock绑定text属性
                ),
                // four named ports, one on each side:
                that.makePort("T", go.Spot.Top, false, true),//创建点，顶点不可输出，可以输入
                that.makePort("L", go.Spot.Left, true, true),
                that.makePort("R", go.Spot.Right, true, true),
                that.makePort("B", go.Spot.Bottom, true, false)
            ));
        myDiagram.nodeTemplateMap.add("for",
            $(go.Node, "Spot", that.nodeStyle(),//节点最外层根据loc属性定位
                // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                $(go.Panel, "Auto",//节点第二层定义Panel
                    $(go.Shape, "Diamond",//节点第三层定义Shape,
                        {fill: "#8C0095", stroke: null}),//Shape绑定figure
                    $(go.TextBlock,//节点第三层定义TextBlock
                        {
                            font: "bold 11pt Helvetica, Arial, sans-serif",
                            stroke: lightText,
                            margin: 8,
                            maxSize: new go.Size(160, NaN),
                            wrap: go.TextBlock.WrapFit,
                            editable: true//是否可以编辑，默认是false
                        },
                        new go.Binding("text", "title").makeTwoWay())//TextBlock绑定text属性
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
                    $(go.TextBlock,//节点第三层定义TextBlock
                        {
                            font: "bold 11pt Helvetica, Arial, sans-serif",
                            stroke: lightText,
                            margin: 8,
                            maxSize: new go.Size(160, NaN),
                            wrap: go.TextBlock.WrapFit,
                            editable: false,//是否可以编辑，默认是false
                        },
                        new go.Binding("text", "title").makeTwoWay())//TextBlock绑定text属性
                ),
                // four named ports, one on each side:
                that.makePort("T", go.Spot.Top, false, true),//创建点，顶点不可输出，可以输入
                that.makePort("L", go.Spot.Left, true, true),
                that.makePort("R", go.Spot.Right, true, true),
                that.makePort("B", go.Spot.Bottom, true, false)
            ));
        myDiagram.nodeTemplateMap.add("start",
            $(go.Node, "Spot",
                {
                    deletable: false  // do not allow this node to be removed by the user
                }, that.nodeStyle(),
                $(go.Panel, "Auto",
                    $(go.Shape, "Circle",
                        {minSize: new go.Size(40, 40), fill: "#79C900", stroke: null}),
                    $(go.TextBlock, "Start",
                        {font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText},
                        new go.Binding("text", "title"))
                ),
                // three named ports, one on each side except the top, all output only:
                that.makePort("L", go.Spot.Left, true, false),
                that.makePort("R", go.Spot.Right, true, false),
                that.makePort("B", go.Spot.Bottom, true, false)
            ));

        myDiagram.nodeTemplateMap.add("end",
            $(go.Node, "Spot",
                that.nodeStyle(),
                $(go.Panel, "Auto",
                    $(go.Shape, "Circle",
                        {minSize: new go.Size(40, 40), fill: "#000", stroke: null}),
                    $(go.TextBlock, "End",
                        {font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText},
                        new go.Binding("text", "title"))
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
                $(go.TextBlock,
                    {
                        margin: 5,
                        textAlign: "center",
                        editable: true,
                        font: titleFont,
                        stroke: '#454545'
                    },
                    new go.Binding("text", "title").makeTwoWay())
                // no ports, because no links are allowed to connect with a comment
            ));

        // var UndesiredEventAdornmentFormula =
        //     $(go.Adornment, "Spot",
        //         $(go.Panel, "Auto",
        //             $(go.Shape, {fill: null, stroke: "dodgerblue", strokeWidth: 4}),
        //             $(go.Placeholder)),
        //         // the button to create a "next" node, at the top-right corner
        //         $("Button",
        //             {
        //                 alignment:go.Spot.parse("1 0.2"),
        //                 click: this.addFormulaParam
        //             },  // this function is defined below
        //             new go.Binding("visible", "", function (a) {
        //                 return !a.diagram.isReadOnly;
        //             }).ofObject(),
        //             $(go.Shape, "TriangleDown", {desiredSize: new go.Size(7, 7)})
        //         ),
        //         $("Button",
        //             {
        //                 alignment:  go.Spot.BottomRight,
        //                 click: this.addErrorParam
        //             },  // this function is defined below
        //             new go.Binding("visible", "", function (a) {
        //                 return !a.diagram.isReadOnly;
        //             }).ofObject(),
        //             $(go.Shape, "TriangleDown", {desiredSize: new go.Size(7, 7)})
        //         ),
        //     );
        var actionTemplate =
            $(go.Panel, "TableRow",
                $(go.TextBlock, "key",
                    {column: 0, margin: 5, font: " 10pt sans-serif", editable: true},
                    new go.Binding("text", "key").makeTwoWay()
                ),
                $(go.TextBlock, "value",
                    {column: 1, margin: 5, font: " 10pt sans-serif", editable: true,},
                    new go.Binding("text", "value").makeTwoWay()
                ),
                this.renderDelButton('params')
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
//         // Create an HTMLInfo and dynamically create some HTML to show/hide
//         var customEditor = new go.HTMLInfo();
//         var customSelectBox = document.createElement("select");
//         customEditor.show = function (textBlock, diagram, tool) {
//             if (!(textBlock instanceof go.TextBlock)) return;
//
//             // Populate the select box:
//             customSelectBox.innerHTML = "";
//
//             // this sample assumes textBlock.choices is not null
//             var list = textBlock.choices;
//             if (!list)return
//             for (var i = 0; i < list.length; i++) {
//                 var op = document.createElement("option");
//                 op.text = list[i];
//                 op.value = list[i];
//                 customSelectBox.add(op, null);
//             }
//             // After the list is populated, set the value:
//             customSelectBox.value = textBlock.text;
//             // Do a few different things when a user presses a key
//             customSelectBox.addEventListener("keydown", function (e) {
//                 var keynum = e.which;
//                 if (keynum == 13) { // Accept on Enter
//                     tool.acceptText(go.TextEditingTool.Enter);
//                     return;
//                 } else if (keynum == 9) { // Accept on Tab
//                     tool.acceptText(go.TextEditingTool.Tab);
//                     e.preventDefault();
//                     return false;
//                 } else if (keynum === 27) { // Cancel on Esc
//                     tool.doCancel();
//                     if (tool.diagram) tool.diagram.focus();
//                 }
//             }, false);
//
//             var loc = textBlock.getDocumentPoint(go.Spot.TopLeft);
//             var pos = diagram.transformDocToView(loc);
//             customSelectBox.style.left = pos.x + "px";
//             customSelectBox.style.top = pos.y + "px";
//             customSelectBox.style.position = 'absolute';
//             customSelectBox.style.zIndex = 100; // place it in front of the Diagram
//
//             diagram.div.appendChild(customSelectBox);
//         }
//         customEditor.hide = function (diagram, tool) {
//             console.log("tool",tool)
//             if(customSelectBox.value){
//                 diagram.div.removeChild(customSelectBox);
//                 customSelectBox.value=null
//             }
//         }
// // This is necessary for HTMLInfo instances that are used as text editors
//         customEditor.valueFunction = function () {
//             return customSelectBox.value;
//         }
//
// // Set the HTMLInfo:
//         myDiagram.toolManager.textEditingTool.defaultTextEditor = customEditor;
        myDiagram.nodeTemplateMap.add("item",
            $(go.Node, "Auto",
                // define the node's outer shape

                that.nodeStyle(),//加了nodeStyle左边左边操作框才会对齐
                // {selectionAdornmentTemplate: UndesiredEventAdornmentFormula},
                $(go.Shape, "RoundedRectangle",
                    {
                        fill: '#FFDD33',portId: "", toEndSegmentLength: 150
                    }),

                $(go.Panel, "Vertical",
                    // headered by a label and a PanelExpanderButton inside a Table
                    $(go.Panel, "Horizontal",  // button next to TextBlock
                        {stretch: go.GraphObject.Horizontal, minSize: new go.Size(150, 40)},
                        $("PanelExpanderButton", "COLLAPSIBLE",  //引用下拉菜单COLLAPSIBLE name of the object to make visible or invisible
                            {column: 0, alignment: go.Spot.Left, margin: new go.Margin(0, 0, 0, 10),}
                        ),
                        $(go.TextBlock,
                            {
                                column: 1,
                                editable: true,
                                margin: new go.Margin(10, 10, 10, 0),
                                font: titleFont,
                            },
                            new go.Binding("text", "title").makeTwoWay()
                        )
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
                                minSize: new go.Size(150, NaN),
                                background: "#00A9C9",
                                defaultRowSeparatorStroke: "gray",
                                defaultColumnSeparatorStroke: "gray"
                            },
                            $(go.TextBlock, "方法名称",
                                { row: 0, column: 0,margin: 5, font: " 10pt sans-serif" }),
                            $(go.TextBlock,
                                { row: 0, column: 1, margin: new go.Margin(0, 10, 0, 0), font: " 10pt sans-serif", editable: true,},
                                new go.Binding("text", "identity").makeTwoWay(),
                            ),
                            $(go.TextBlock, "结果下限",
                                { row: 1, column: 0,margin: 5, font: " 10pt sans-serif" }),
                            $(go.TextBlock,
                                { row: 1, column: 1, margin: new go.Margin(0, 10, 0, 0), font: " 10pt sans-serif", editable: true,},
                                new go.Binding("text", "lower_limit").makeTwoWay(),
                            ),
                            $(go.TextBlock, "结果上限",
                                { row: 2, column: 0,margin: 5, font: " 10pt sans-serif" }),
                            $(go.TextBlock,
                                { row: 2, column: 1, margin: new go.Margin(0, 10, 0, 0), font: " 10pt sans-serif", editable: true,},
                                new go.Binding("text", "upper_limit").makeTwoWay(),
                            ),
                        ),
                        $(go.TextBlock, "参数",
                            {margin: new go.Margin(10, 0, 0, 0),font: " 10pt sans-serif", alignment: go.Spot.Left,},
                        ),
                        $(go.Panel, "Table",
                            {
                                contextMenu:     // define a context menu for each node
                                    $(go.Adornment, "Vertical",  // that has one button
                                        $("ContextMenuButton",
                                            $(go.TextBlock, "添加参数"),
                                            {click: this.addFormulaParam})
                                        // more ContextMenuButtons would go here
                                    )  // end Adornment
                            },
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
                        $(go.TextBlock, "错误码",
                            {font: " 10pt sans-serif", alignment: go.Spot.Left, margin: new go.Margin(10, 0, 0, 0),},
                        ),
                        $(go.Panel, "Table",
                            {
                                contextMenu:     // define a context menu for each node
                                    $(go.Adornment, "Vertical",  // that has one button
                                        $("ContextMenuButton",
                                            $(go.TextBlock, "添加错误码"),
                                            {click: this.addErrorParam})
                                        // more ContextMenuButtons would go here
                                    )  // end Adornment
                            },
                            {
                                stretch: go.GraphObject.Horizontal,  // take up whole available width
                                defaultRowSeparatorStroke: "gray",
                                defaultColumnSeparatorStroke: "gray"
                            },
                            {
                                background: "#00A9C9",  // to distinguish from the node's body
                                itemTemplate: errorTemplate  // the Panel created for each item in Panel.itemArray
                            },
                            new go.Binding("itemArray", "errors").makeTwoWay()  // bind Panel.itemArray to nodedata.actions
                        ),
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
                    {fill: "#CC5245", portId: "", stroke: "black", toEndSegmentLength: 150}),
                $(go.Panel, "Vertical",
                    $(go.Panel, "Horizontal",  // button next to TextBlock
                        {stretch: go.GraphObject.Horizontal, minSize: new go.Size(150, 40)},
                        $("PanelExpanderButton", "COLLAPSIBLECONF",  //引用下拉菜单COLLAPSIBLE name of the object to make visible or invisible
                            {column: 0, alignment: go.Spot.Left, margin: new go.Margin(0, 0, 0, 10),}
                        ),
                        $(go.TextBlock,
                            {
                                column: 1,
                                margin: new go.Margin(10, 10, 10, 0),
                                font: titleFont,
                            },
                            new go.Binding("text", "title").makeTwoWay()
                        )
                    ),  // end Horizontal Panel
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
                    {fill: null, stroke: "black", strokeWidth: 1}),
                $(go.Panel, "Vertical",  // title above Placeholder
                    $(go.Panel, "Horizontal",  // button next to TextBlock
                        {stretch: go.GraphObject.Horizontal, background: "#98FB98", minSize: new go.Size(150, 40)},
                        {
                            contextMenu:     // define a context menu for each node
                                $(go.Adornment, "Vertical",  // that has one button
                                    $("ContextMenuButton",
                                        $(go.TextBlock, "查看详细"),
                                        {click: this.showDetail})
                                    // more ContextMenuButtons would go here
                                )  // end Adornment
                        },
                        $("SubGraphExpanderButton",
                            {alignment: go.Spot.Center, margin: 5}),
                        $(go.TextBlock,
                            {
                                alignment: go.Spot.Center,
                                editable: true,
                                font: titleFont,
                            },
                            new go.Binding("text", "title").makeTwoWay())
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
                    $(go.Panel, "Horizontal",  // button next to TextBlock
                        {stretch: go.GraphObject.Horizontal, background: "#00A9C9", minSize: new go.Size(150, 40)},
                        {
                            contextMenu:     // define a context menu for each node
                                $(go.Adornment, "Vertical",  // that has one button
                                    $("ContextMenuButton",
                                        $(go.TextBlock, "查看详细"),
                                        {click: this.showDetail})
                                )  // end Adornment
                        },
                        $("SubGraphExpanderButton",
                            {alignment: go.Spot.Center, margin: 5}),
                        $(go.TextBlock,
                            {
                                alignment: go.Spot.Center,
                                editable: true,
                                font: titleFont,
                                stroke: lightText,
                            },
                            new go.Binding("text", "title").makeTwoWay()),
                        $(go.TextBlock, "循环次数:",
                            {
                                margin: new go.Margin(0, 0, 0, 10),
                                alignment: go.Spot.Right,
                                editable: false,
                                font: "9pt Verdana, sans-serif",
                                stroke: lightText,
                            }),
                        $(go.TextBlock,
                            {
                                margin: new go.Margin(0, 10, 0, 0),
                                alignment: go.Spot.Right,
                                editable: true,
                                font: titleFont,
                                stroke: lightText,
                            },
                            new go.Binding("text", "times").makeTwoWay()),
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
                    {visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
                    new go.Binding("visible", "visible").makeTwoWay(),
                    $(go.Shape, "RoundedRectangle",  // the label shape
                        {fill: "#F8F8F8", stroke: null}),
                    $(go.TextBlock, "条件",  // the label
                        {
                            margin: 3,
                            font: "10pt helvetica, arial, sans-serif",
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
        // console.log('this.props.fromNew',this.props.fromNew)
        // if(this.props.fromNew && !sessionStorage.getItem(`${nodedata.key}`)){
        //         detailJon.nodeDataArray.push({category: "start",key:uuidv4(), title: "开始", loc:`${parseInt(nodedata.loc.split(' ')[0])+10} ${parseInt(nodedata.loc.split(' ')[1])+10}`})
        //         detailJon.nodeDataArray.push({category: "end",key:uuidv4(), title: "结束", loc:`${parseInt(nodedata.loc.split(' ')[0])+10} ${parseInt(nodedata.loc.split(' ')[1])+410}`})
        // }
        // if(!this.props.fromNew )

        let keyInGroup = []
        for (let i = 0, len = originJson.nodeDataArray.length; i < len; i++) {
            // if (originJson.nodeDataArray[i].key === nodedata.key) {
            //     detailJon.nodeDataArray.push(originJson.nodeDataArray[i]);
            // }
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
        console.log(this.props)
        if (this.props.match.path === '/scriptManage/:id' || this.props.match.path === '/scriptDetail/:id') {
            this.props.saveTempScript();
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

    save = ()=> {
        document.getElementById("mySavedModel").value = myDiagram.model.toJson();
        myDiagram.isModified = false;
    }
    callbackJson = ()=> {
        return myDiagram.model.toJson();
    }
    callbackDiagram = ()=> {
        return myDiagram
    }
    load = (json)=> {
        myDiagram.model = go.Model.fromJson(json);
    }
    loadTextArea = ()=> {
        myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
    }
    searchDiagram = ()=> {
        var input = document.getElementById("mySearch");
        if (!input) return;
        input.focus();

        myDiagram.startTransaction("highlight search");

        if (input.value) {
            // search four different data properties for the string, any of which may match for success
            // create a case insensitive RegExp from what the user typed
            var regex = new RegExp(input.value, "i");
            var results = myDiagram.findNodesByExample({name: regex},
                {text: regex},
                {title: regex});
            myDiagram.highlightCollection(results);

            // try to center the diagram at the first node that was found
            if (results.count > 0) myDiagram.centerRect(results.first().actualBounds);
        } else {  // empty string only clears highlighteds collection
            myDiagram.clearHighlighteds();
        }
        myDiagram.commitTransaction("highlight search");


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
    addPalatte=()=>{
        const myPaletteModel=JSON.parse(myPalette.model.toJson()).nodeDataArray;
        myPalette.model = new go.GraphLinksModel(myPaletteModel.concat(
            {
                category: "item",
                title: "测试3.3v 负载阈值",
                identity:'test_load_threshold_on_3_3v',
                params: [
                    {key: 'id', value: '0'},
                    {key: 'max', value: '1750'},
                    {key: 'mini', value: '1350'}
                ],
                errors: [
                    {key: '404', value: 'URL地址无法访问'},
                    {key: '500', value: '服务器错误'}
                ],
                deviation: 5
            }
        ));
    }
    render() {
        return (
            <div>
                <div className="drawScript">
                    <div className="drawScript-sidebar">
                        <div className="drawScript-overview" id="myOverviewDiv"></div>
                        <div id="myPaletteDiv"></div>
                    </div>
                    <div className="drawScript-content">
                        {(this.props.match.path === '/scriptDetail/:id' || this.props.match.path === '/segmentDetail/:id') ?

                            <div className="detail-header"
                                 style={{background: this.props.location.state.category === 'ForGroups' ? '#00A9C9' : '#98FB98'}}>
                                {this.props.location.state.groupNmae}
                            </div>
                            : null}
                        <div className="" id="myDiagramDiv" onScroll={this.onscroll}
                             style={{height: (this.props.match.path === '/scriptDetail/:id' || this.props.match.path === '/segmentDetail/:id') ? '700px' : '746px'}}>
                        </div>

                    </div>
                </div>
                <div className="drawScript-search">
                    <input id="mySearch" type="text" onKeyPress={this.keypressInput}/>
                    <Button onClick={this.searchDiagram}>检索</Button>
                </div>

                <div>
                    <Button id="getCenter" onClick={this.addPalatte}>添加左侧语句</Button>
                    {/*<Button id="getCenter" onClick={this.getCenter}>获取画布中心</Button>*/}
                    <Button id="SaveButton" onClick={this.save}>将图表转为JSON</Button>
                    <Button onClick={this.loadTextArea}>将JSON转为图表</Button>
                </div>


                <textarea id="mySavedModel"></textarea>
            </div>


        )
    }
}
export default ScriptIndex;