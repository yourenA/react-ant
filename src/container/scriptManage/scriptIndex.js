/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import {Button} from 'antd'
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
        console.log('e.subject.fromNode.data', e.subject.fromNode.data)
        var label = e.subject.findObject("LABEL");// name: "LABEL"
        if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond" || e.subject.fromNode.data.category === 'item' );
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
    addReason = (e, obj)=> {
        var adorn = obj.part;
        if (adorn === null) return;
        e.handled = true;
        var arr = adorn.adornedPart.data.params;
        myDiagram.model.addArrayItem(arr, {});
    }
    addFormulaParam = (e, obj)=> {
        var adorn = obj.part;
        if (adorn === null) return;
        e.handled = true;
        var arr = adorn.adornedPart.data.params;
        myDiagram.model.addArrayItem(arr, {});
    }
    init = ()=> {
        const that = this;
        const titleFont = "11pt Verdana, sans-serif";
        const lightText = 'whitesmoke';
        let formulaArr = [
            {category: "start", text: "开始"},
            {text: "条件语句", category: "if", figure: "Diamond"},
            {text: "循环语句", category: "for", figure: "Diamond"},
            {text: "错误输出", category: "errOut"},
            {category: "end", text: "结束"},
            {category: "Comment", text: "备注"},
            {title: "分组", isGroup: true, category: "OfGroups"},
            {category: "set", params: [{}], text: '设置参数'},
            {
                category: "item",
                title: "语句",
                params: [
                    {}
                ]
            }];


        for (let i = 0, len = formulaArr.length; i < len; i++) {
            let uuidIn = uuidv4();
            formulaArr[i].key = uuidIn
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
        myDiagram.addDiagramListener("Modified", function (e) {
            var button = document.getElementById("SaveButton");
            if (button) button.disabled = !myDiagram.isModified;//当图标不修改时，保存按钮不可用
            var idx = document.title.indexOf("*");//改变页面的标题
            if (myDiagram.isModified) {
                if (idx < 0) document.title += "*";
            } else {
                if (idx >= 0) document.title = document.title.substr(0, idx);
            }
        });

        myDiagram.nodeTemplateMap.add("node",  // the default category
            $(go.Node, "Spot", that.nodeStyle(),//节点最外层根据loc属性定位
                // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                $(go.Panel, "Auto",//节点第二层定义Panel
                    $(go.Shape, "Rectangle",//节点第三层定义Shape,
                        {fill: "#00A9C9", stroke: null},
                        new go.Binding("figure", "figure")),//Shape绑定figure
                    $(go.TextBlock,//节点第三层定义TextBlock
                        {
                            font: "bold 11pt Helvetica, Arial, sans-serif",
                            stroke: 'whitesmoke',
                            margin: 8,
                            maxSize: new go.Size(160, NaN),
                            wrap: go.TextBlock.WrapFit,
                            editable: true//是否可以编辑，默认是false
                        },
                        new go.Binding("text").makeTwoWay())//TextBlock绑定text属性
                ),
                // four named ports, one on each side:
                that.makePort("T", go.Spot.Top, false, true),//创建点，顶点不可输出，可以输入
                that.makePort("L", go.Spot.Left, true, true),
                that.makePort("R", go.Spot.Right, true, true),
                that.makePort("B", go.Spot.Bottom, true, false)
            ));

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
                        new go.Binding("text").makeTwoWay())//TextBlock绑定text属性
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
                        new go.Binding("text").makeTwoWay())//TextBlock绑定text属性
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
                            editable: true//是否可以编辑，默认是false
                        },
                        new go.Binding("text").makeTwoWay())//TextBlock绑定text属性
                ),
                // four named ports, one on each side:
                that.makePort("T", go.Spot.Top, false, true),//创建点，顶点不可输出，可以输入
                that.makePort("L", go.Spot.Left, true, true),
                that.makePort("R", go.Spot.Right, true, true),
                that.makePort("B", go.Spot.Bottom, true, false)
            ));
        myDiagram.nodeTemplateMap.add("start",
            $(go.Node, "Spot", that.nodeStyle(),
                $(go.Panel, "Auto",
                    $(go.Shape, "Circle",
                        {minSize: new go.Size(40, 40), fill: "#79C900", stroke: null}),
                    $(go.TextBlock, "Start",
                        {font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText},
                        new go.Binding("text"))
                ),
                // three named ports, one on each side except the top, all output only:
                that.makePort("L", go.Spot.Left, true, false),
                that.makePort("R", go.Spot.Right, true, false),
                that.makePort("B", go.Spot.Bottom, true, false)
            ));

        myDiagram.nodeTemplateMap.add("end",
            $(go.Node, "Spot", that.nodeStyle(),
                $(go.Panel, "Auto",
                    $(go.Shape, "Circle",
                        {minSize: new go.Size(40, 40), fill: "#000", stroke: null}),
                    $(go.TextBlock, "End",
                        {font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText},
                        new go.Binding("text"))
                ),
                // three named ports, one on each side except the bottom, all input only:
                that.makePort("T", go.Spot.Top, false, true),
                that.makePort("L", go.Spot.Left, false, true),
                that.makePort("R", go.Spot.Right, false, true)
            ));
        myDiagram.nodeTemplateMap.add("Comment",
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
                    new go.Binding("text").makeTwoWay())
                // no ports, because no links are allowed to connect with a comment
            ));

        var UndesiredEventAdornmentFormula =
            $(go.Adornment, "Spot",
                $(go.Panel, "Auto",
                    $(go.Shape, {fill: null, stroke: "dodgerblue", strokeWidth: 4}),
                    $(go.Placeholder)),
                // the button to create a "next" node, at the top-right corner
                $("Button",
                    {
                        alignment: go.Spot.BottomRight,
                        click: this.addFormulaParam
                    },  // this function is defined below
                    new go.Binding("visible", "", function (a) {
                        return !a.diagram.isReadOnly;
                    }).ofObject(),
                    $(go.Shape, "TriangleDown", {desiredSize: new go.Size(10, 10)})
                )
            );
        var actionTemplate =
            $(go.Panel, "TableRow",
                $(go.TextBlock, "key",
                    {column: 0, margin: 5, font: " 10pt sans-serif", editable: true},
                    new go.Binding("text", "key").makeTwoWay()
                ),
                $(go.TextBlock, "value",
                    {column: 1, margin: 5, font: " 10pt sans-serif", editable: true,},
                    new go.Binding("text", "value").makeTwoWay()
                )
            );
        myDiagram.nodeTemplateMap.add("item",
            $(go.Node, "Auto",
                // define the node's outer shape
                that.nodeStyle(),//加了nodeStyle左边左边操作框才会对齐
                {selectionAdornmentTemplate: UndesiredEventAdornmentFormula},
                $(go.Shape, "RoundedRectangle",
                    {
                        fill: '#FFDD33',
                    }),

                $(go.Panel, "Vertical",
                    {stretch: go.GraphObject.Horizontal, background: "#FFDD33"},
                    // headered by a label and a PanelExpanderButton inside a Table
                    $(go.Panel, "Horizontal",  // button next to TextBlock
                        {stretch: go.GraphObject.Horizontal, minSize: new go.Size(150, 40)},
                        $("PanelExpanderButton", "COLLAPSIBLE",  //引用下拉菜单COLLAPSIBLE name of the object to make visible or invisible
                            {alignment: go.Spot.Left, margin: new go.Margin(0, 0, 0, 10),}
                        ),
                        $(go.TextBlock,
                            {
                                editable: true,
                                margin: new go.Margin(10, 10, 10, 0),
                                font: titleFont,
                            },
                            new go.Binding("text", "title").makeTwoWay()
                        )
                    ),  // end Horizontal Panel
                    // with the list data bound in the Vertical Panel
                    $(go.Panel, "Table",
                        {
                            defaultRowSeparatorStroke: "gray",
                            defaultColumnSeparatorStroke: "gray"
                        },
                        {
                            name: "COLLAPSIBLE",  //定义下拉菜单COLLAPSIBLE identify to the PanelExpanderButton
                            visible: false,
                            stretch: go.GraphObject.Horizontal,  // take up whole available width
                            background: "#00A9C9",  // to distinguish from the node's body
                            defaultAlignment: go.Spot.Center,  // thus no need to specify alignment on each element
                            itemTemplate: actionTemplate  // the Panel created for each item in Panel.itemArray
                        },
                        new go.Binding("itemArray", "params").makeTwoWay()  // bind Panel.itemArray to nodedata.actions
                    )  // end action list Vertical Panel
                ),  // end optional Vertical Panel
                that.makePort("T", go.Spot.Top, false, true),//创建点，顶点不可输出，可以输入
                that.makePort("L", go.Spot.Left, true, true),
                that.makePort("R", go.Spot.Right, true, true),
                that.makePort("B", go.Spot.Bottom, true, false)
            ));

        var UndesiredEventAdornment =
            $(go.Adornment, "Spot",
                $(go.Panel, "Auto",
                    $(go.Shape, {fill: null, stroke: "dodgerblue", strokeWidth: 4}),
                    $(go.Placeholder)),
                // the button to create a "next" node, at the top-right corner
                $("Button",
                    {
                        alignment: go.Spot.BottomRight,
                        click: this.addReason
                    },  // this function is defined below
                    new go.Binding("visible", "", function (a) {
                        return !a.diagram.isReadOnly;
                    }).ofObject(),
                    $(go.Shape, "TriangleDown", {desiredSize: new go.Size(10, 10)})
                )
            );
        var reasonTemplate =
            $(go.Panel, "TableRow",
                $(go.TextBlock, "key",
                    {column: 0, margin: 5, font: " 11pt sans-serif", editable: true,},
                    new go.Binding("text", "key").makeTwoWay()
                ),
                $(go.TextBlock, "value",
                    {column: 1, margin: 5, font: " 11pt sans-serif", editable: true,},
                    new go.Binding("text", "value").makeTwoWay()
                )
            );
        myDiagram.nodeTemplateMap.add("set",
            $(go.Node, "Auto",
                that.nodeStyle(),
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                {selectionAdornmentTemplate: UndesiredEventAdornment},
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
                            new go.Binding("text", "text").makeTwoWay()
                        )
                    ),  // end Horizontal Panel
                    $(go.Panel, "Table",
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

                [
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    {
                        mouseEnter: function (e, obj) {
                            that.showPorts(obj.part, true);
                        },
                        mouseLeave: function (e, obj) {
                            that.showPorts(obj.part, false);
                        }
                    }
                ],
                {
                    background: "#FFFFFF",
                    isSubGraphExpanded: false,
                    // highlight when dragging into the Group
                    mouseDragEnter: function (e, grp, prev) {
                        that.highlightGroup(e, grp, true);
                    },
                    mouseDragLeave: function (e, grp, next) {
                        that.highlightGroup(e, grp, false);
                    },
                    // computesBoundsAfterDrag: true,//不设置这个才会拖动的时候同时改变大小
                    // when the selection is dropped into a Group, add the selected Parts into that Group;
                    // if it fails, cancel the tool, rolling back any changes
                    mouseDrop: that.finishDrop,
                    handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
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

        // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
        myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
        myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
        myDiagram.model.copiesArrays = true;//设置这个使用itemArr数据才不会互相影响
        myDiagram.model.copiesArrayObjects = true;//设置这个使用itemArr数据才不会互相影响
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
                    model: new go.GraphLinksModel([  //定义图形 specify the contents of the Palette
                    ].concat(formulaArr))
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
                    {visible: true, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
                    new go.Binding("visible", "visible").makeTwoWay(),
                    $(go.Shape, "RoundedRectangle",  // the label shape
                        {fill: "#F8F8F8", stroke: null}),
                    $(go.TextBlock, "条件",  // the label
                        {
                            margin: 3,
                            font: "10pt helvetica, arial, sans-serif",
                            stroke: "#333333",
                            editable: true,
                        },
                        new go.Binding("text", "linkText").makeTwoWay())
                )
            );

        myPalette.layout.sorting = go.GridLayout.Forward;

        myOverview =
            $(go.Overview, "myOverviewDiv",  // the HTML DIV element for the Overview
                {observed: myDiagram, contentAlignment: go.Spot.Center});   // tell it which Diagram to show and pan
        if (!this.props.isNew) {
            this.load(this.props.json)
        }

    }
    showDetail = (e, obj) => {
        // get the context menu that holds the button that was clicked
        var contextmenu = obj.part;
        // get the node data to which the Node is data bound
        var nodedata = contextmenu.data;
        // compute the next color for the node
        let originJson = JSON.parse(this.callbackJson());
        let detailJon = {class: "go.GraphLinksModel", nodeDataArray: [], linkDataArray: []};
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
        if (this.props.match.path === '/scriptManage/:id' || this.props.match.path === '/scriptDetail/:id') {
            this.props.saveTempScript()
            this.props.history.push({pathname: `/scriptDetail/${nodedata.key}`, state: {groupNmae: nodedata.title}})
        } else if (this.props.match.path === '/segmentManage/:id' || this.props.match.path === '/segmentDetail/:id') {
            this.props.history.push({pathname: `/segmentDetail/${nodedata.key}`, state: {groupNmae: nodedata.title}})
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
    addGraphical = ()=> {
        const originHadJson = {
            nodeDataArray: [
                {
                    "title": "unit",
                    "isGroup": true,
                    "category": "OfGroups",
                    "key": "5f42b271-f681-4b57-a695-3dcb4aa2add2",
                    "loc": "-385.2614237491539 61.73857625084602",
                    "group": -6
                },
                {
                    "category": "set",
                    "params": [{"key": "11", "value": "11"}, {"key": "22", "value": "22"}],
                    "text": "设置参数",
                    "key": -7,
                    "loc": "93 84.99999999999994",
                    "group": "5f42b271-f681-4b57-a695-3dcb4aa2add2"
                },
                {
                    "category": "item",
                    "title": "语句",
                    "params": [{"key": "2", "value": "2"}],
                    "key": "73f0dba7-34fb-4359-9fe8-fdad19146a5b",
                    "loc": "-173 234",
                    "group": "5f42b271-f681-4b57-a695-3dcb4aa2add2"
                },
                {
                    "category": "item",
                    "title": "语句",
                    "params": [{"key": "4", "value": "4"}],
                    "key": "df00d9f6-ce5d-45d8-9978-d5140c9c8167",
                    "loc": "-64.99999999999994 459.0000000000001",
                    "group": "5f42b271-f681-4b57-a695-3dcb4aa2add2"
                },
                {
                    "category": "item",
                    "title": "语句",
                    "params": [{"key": "1", "value": "1"}],
                    "key": "86d675c8-cde6-41ae-a525-95f7bcc9538f",
                    "loc": "-170.9999999999999 110.99999999999983",
                    "group": "5f42b271-f681-4b57-a695-3dcb4aa2add2"
                },
                {
                    "category": "item",
                    "title": "语句",
                    "params": [{"key": "3", "value": "3"}],
                    "key": "84b34504-495d-4c02-b2a8-19c5e28983ce",
                    "loc": "-307 467",
                    "group": "5f42b271-f681-4b57-a695-3dcb4aa2add2"
                },
                {
                    "text": "条件语句",
                    "category": "if",
                    "figure": "Diamond",
                    "key": "99a50da8-cf12-4943-8c21-615c7ed68493",
                    "loc": "-179 330",
                    "group": "5f42b271-f681-4b57-a695-3dcb4aa2add2"
                },
                {
                    "title": "project",
                    "isGroup": true,
                    "category": "OfGroups",
                    "key": -6,
                    "loc": "-721.522847498308 8.477152501692025"
                },
                {
                    "title": "unit",
                    "isGroup": true,
                    "category": "OfGroups",
                    "key": -9,
                    "loc": "-708.261423749154 383.2729253109046",
                    "group": -6
                },
                {
                    "category": "item",
                    "title": "语句",
                    "params": [{"key": "22", "value": "22"}],
                    "key": -8,
                    "loc": "-630 420",
                    "group": -9
                }
            ],
            linkDataArray: [
                {
                    "from": "86d675c8-cde6-41ae-a525-95f7bcc9538f",
                    "to": "73f0dba7-34fb-4359-9fe8-fdad19146a5b",
                },
                {
                    "from": "73f0dba7-34fb-4359-9fe8-fdad19146a5b",
                    "to": "99a50da8-cf12-4943-8c21-615c7ed68493",
                },
                {
                    "from": "99a50da8-cf12-4943-8c21-615c7ed68493",
                    "to": "84b34504-495d-4c02-b2a8-19c5e28983ce",
                    "visible": true,
                },
                {
                    "from": "99a50da8-cf12-4943-8c21-615c7ed68493",
                    "to": "df00d9f6-ce5d-45d8-9978-d5140c9c8167",
                    "visible": true,
                    "condition": "N"
                },
                {
                    "from": "5f42b271-f681-4b57-a695-3dcb4aa2add2",
                    "to": -9,
                }
            ]
        };
        let keyUuidArr = [];
        for (let k = 0, len3 = originHadJson.nodeDataArray.length; k < len3; k++) {
            let uuid2 = uuidv4();
            keyUuidArr.push({key: originHadJson.nodeDataArray[k].key, uuid: uuid2});

        }
        for (let i = 0, len1 = keyUuidArr.length; i < len1; i++) {
            let parseLoc = originHadJson.nodeDataArray[i].loc.split(' ');
            originHadJson.nodeDataArray[i].loc = `${parseInt(parseLoc[0]) + this.state.scrollLeft} ${parseInt(parseLoc[1]) + this.state.scrollTop}`
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

        for (let h = 0, len = originHadJson.nodeDataArray.length; h < len; h++) {
            myDiagram.model.addNodeData(originHadJson.nodeDataArray[h]);
        }
        for (let g = 0, len = originHadJson.linkDataArray.length; g < len; g++) {
            myDiagram.model.addLinkData(originHadJson.linkDataArray[g]);
        }

    }
    onscroll = (e)=> {
        this.setState({
            scrollTop: e.target.scrollTop,
            scrollLeft: e.target.scrollLeft
        })
    }
    loadTextArea = ()=> {
        myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
    }
    searchDiagram = ()=> {
        var input = document.getElementById("mySearch");
        if (!input) return;
        input.focus();

        myPalette.startTransaction("highlight search");

        if (input.value) {
            // search four different data properties for the string, any of which may match for success
            // create a case insensitive RegExp from what the user typed
            var regex = new RegExp(input.value, "i");
            console.log("regex", regex)
            var results = myPalette.findNodesByExample({name: regex},
                {text: regex},
                {title: regex});
            // try to center the diagram at the first node that was found
            if (results.count > 0) myPalette.centerRect(results.first().actualBounds);
        } else {  // empty string only clears highlighteds collection
            myPalette.clearHighlighteds();
        }


    }
    keypressInput = (e)=> {
        console.log(e.which);//react使用which代替keycode
        if (e.which === 13) {
            this.searchDiagram()
        }
    }
    saveScript = ()=> {
        const DrawScriptCof = this.refs.DrawScriptCofForm.getFieldsValue()
        console.log('保存', DrawScriptCof)
    }
    turnBack = ()=> {
        if (this.state.isChange) {
            console.log('已经修改，请确认')
        } else {
            this.props.history.goBack()
        }
    }
    contentHadChanged = ()=> {
        this.setState({
            isChange: true
        })
    }
    addProgramSegment = ()=> {
        this.props.history.push('/addProgramSegment')
    }

    render() {
        return (
            <div>
                <div className="drawScript">
                    <div className="drawScript-sidebar" id="myPaletteDiv">

                    </div>
                    <div className="drawScript-content">
                        <div className="" id="myDiagramDiv" onScroll={this.onscroll}>

                        </div>
                        <div className="drawScript-overview" id="myOverviewDiv"></div>
                    </div>
                </div>
                <div>
                    <Button onClick={this.addGraphical}>向图上添加图形</Button>
                </div>
                <div>
                    <Button id="SaveButton" onClick={this.save}>将图表转为JSON</Button>
                    <Button onClick={this.loadTextArea}>将JSON转为图表</Button>
                </div>
                <div>
                    <input id="mySearch" type="text" onKeyPress={this.keypressInput}/>
                    <Button onClick={this.searchDiagram}>search</Button>
                </div>

                <textarea id="mySavedModel"></textarea>
            </div>


        )
    }
}
export default ScriptIndex;