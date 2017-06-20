/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import './drawScript.less'

var $ = window.$;
var go = window.go;
var formulaArr = [
    {text: "测试电源", isGroup: true, category: "OfGroups"},
    {text: "功能测试", isGroup: true, category: "OfGroups"},
    {category: "start", text: "开始"},
    {text: "节点", category: "node"},
    {text: "条件1", category: "judge", figure: "Diamond"},
    {text: "条件2", category: "judge", figure: "Diamond"},
    {text: "循环条件", category: "judge", figure: "Diamond"},
    {category: "end", text: "结束"},
    {category: "Comment", text: "备注"},
    {
        category: "formula",
        formula: "test_3.3v_delay",
        title: "unit 测试3.3v 上电延迟",
        params: [
            {name: "param1", val: "100", type: "init"},
            {name: "param2", val: "120", type: "string"},
            {name: "param3", val: "130", type: "init"}
        ]
    },
    {
        category: "formula",
        formula: "test_3.5v_delay",
        title: "unit 测试3.5 上电延迟",
        params: [
            {name: "param1", val: "100", type: "init"},
            {name: "param2", val: "120", type: "init"},
        ]
    },
    {
        category: "formula",
        formula: "test_4.5v_delay",
        title: "unit 测试4.5 上电延迟",
        params: [
            {name: "param1", val: "100", type: "init"},
            {name: "param2", val: "120", type: "init"},
        ]
    },
    {
        category: "formula",
        formula: "test_4.5v_delay",
        title: "unit 测试4.5 上电延迟",
        params: [
            {name: "param1", val: "100", type: "init"},
            {name: "param2", val: "120", type: "init"},
        ]
    },
    {
        category: "formula",
        formula: "test_4.5v_delay",
        title: "unit 测试4.5 上电延迟",
        params: [
            {name: "param1", val: "100", type: "init"},
            {name: "param2", val: "120", type: "init"},
        ]
    },
    {
        category: "formula",
        formula: "test_4.5v_delay",
        title: "unit 测试4.5 上电延迟",
        params: [
            {name: "param1", val: "100", type: "init"},
            {name: "param2", val: "120", type: "init"},
        ]
    },
    {
        category: "formula",
        formula: "test_4.5v_delay",
        title: "unit 测试4.5 上电延迟",
        params: [
            {name: "param1", val: "100", type: "init"},
            {name: "param2", val: "120", type: "init"},
        ]
    },
    {
        category: "formula",
        formula: "test_10v_delay",
        title: "unit 测试10v 上电延迟",
        params: [
            {name: "param1", val: "100", type: "init"},
            {name: "param2", val: "120", type: "init"},
            {name: "param3", val: "130", type: "init"},
            {name: "param4", val: "120", type: "init"},
            {name: "param5", val: "130", type: "init"},
            {name: "param6", val: "120", type: "init"},
            {name: "param7", val: "130", type: "init"}
        ]
    },
    {
        category: "formula",
        formula: "test_10v_delay",
        title: "unit 测试10v 上电延迟",
        params: [
            {name: "param1", val: "100", type: "init"},
            {name: "param2", val: "120", type: "init"},
            {name: "param3", val: "130", type: "init"},
            {name: "param4", val: "120", type: "init"},
            {name: "param5", val: "130", type: "init"},
            {name: "param6", val: "120", type: "init"},
            {name: "param7", val: "130", type: "init"}
        ]
    },
    {
        category: "formula",
        formula: "test_10v_delay",
        title: "unit 测试10v 上电延迟",
        params: [
            {name: "param1", val: "100", type: "init"},
            {name: "param2", val: "120", type: "init"},
            {name: "param3", val: "130", type: "init"},
            {name: "param4", val: "120", type: "init"},
            {name: "param5", val: "130", type: "init"},
            {name: "param6", val: "120", type: "init"},
            {name: "param7", val: "130", type: "init"}
        ]
    },
    {
        category: "formula",
        formula: "test_10v_delay",
        title: "unit 测试10v 上电延迟",
        params: [
            {name: "param1", val: "100", type: "init"},
            {name: "param2", val: "120", type: "init"},
            {name: "param3", val: "130", type: "init"},
            {name: "param4", val: "120", type: "init"},
            {name: "param5", val: "130", type: "init"},
            {name: "param6", val: "120", type: "init"},
            {name: "param7", val: "130", type: "init"}
        ]
    },
    {
        category: "formula",
        formula: "test_10v_delay",
        title: "unit 测试10v 上电延迟",
        params: [
            {name: "param1", val: "100", type: "init"},
            {name: "param2", val: "120", type: "init"},
            {name: "param3", val: "130", type: "init"},
            {name: "param4", val: "120", type: "init"},
            {name: "param5", val: "130", type: "init"},
            {name: "param6", val: "120", type: "init"},
            {name: "param7", val: "130", type: "init"}
        ]
    },
    {
        category: "formula",
        formula: "test_10v_delay",
        title: "unit 测试10v 上电延迟",
        params: [
            {name: "param1", val: "100", type: "init"},
            {name: "param2", val: "120", type: "init"},
            {name: "param3", val: "130", type: "init"},
            {name: "param4", val: "120", type: "init"},
            {name: "param5", val: "130", type: "init"},
            {name: "param6", val: "120", type: "init"},
            {name: "param7", val: "130", type: "init"}
        ]
    },
    {
        category: "formula",
        formula: "test_10v_delay",
        title: "unit 测试10v 上电延迟",
        params: [
            {name: "param1", val: "100", type: "init"},
            {name: "param2", val: "120", type: "init"},
            {name: "param3", val: "130", type: "init"},
            {name: "param4", val: "120", type: "init"},
            {name: "param5", val: "130", type: "init"},
            {name: "param6", val: "120", type: "init"},
            {name: "param7", val: "130", type: "init"}
        ]
    },
    {
        category: "formula",
        formula: "test_10v_delay",
        title: "unit 测试10v 上电延迟",
        params: [
            {name: "param1", val: "100", type: "init"},
            {name: "param2", val: "120", type: "init"},
            {name: "param3", val: "130", type: "init"},
            {name: "param4", val: "120", type: "init"},
            {name: "param5", val: "130", type: "init"},
            {name: "param6", val: "120", type: "init"},
            {name: "param7", val: "130", type: "init"}
        ]
    },
    {
        category: "formula",
        formula: "test_10v_delay",
        title: "unit 测试20v 上电延迟",
        params: [
            {name: "param1", val: "100", type: "init"},
            {name: "param2", val: "120", type: "init"},
            {name: "param3", val: "130", type: "init"},
            {name: "param4", val: "120", type: "init"},
            {name: "param5", val: "130", type: "init"},
            {name: "param6", val: "120", type: "init"},
            {name: "param7", val: "130", type: "init"}
        ]
    },
    {
        category: "formula",
        formula: "test_10v_delay",
        title: "unit 测试30v 上电延迟",
        params: [
            {name: "param1", val: "100", type: "init"},
            {name: "param2", val: "120", type: "init"},
            {name: "param3", val: "130", type: "init"},
            {name: "param4", val: "120", type: "init"},
            {name: "param5", val: "130", type: "init"},
            {name: "param6", val: "120", type: "init"},
            {name: "param7", val: "130", type: "init"}
        ]
    }];

var myDiagram = null;
var myPalette = null;
var myOverview = null;
class Script extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.init()
    }

    showLinkLabel = (e)=> {
        var label = e.subject.findObject("LABEL");// name: "LABEL"
        if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");//如果figure=Diamond则线的文字可以编辑
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
    init = ()=> {
        const that = this;
        var lightText = 'whitesmoke';
        myDiagram =
            $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
                {
                    initialContentAlignment: go.Spot.Center,
                    "LinkDrawn": that.showLinkLabel,  //画线
                    "LinkRelinked": that.showLinkLabel,//重新连接
                    allowDrop: true,  // must be true to accept drops from the Palette
                    "animationManager.duration": 800, // slightly longer than default (600ms) animation
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

        myDiagram.nodeTemplateMap.add("judge",
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
                            editable: false//是否可以编辑，默认是false
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
        var actionTemplate =
            $(go.Panel, "TableRow",
                $(go.TextBlock, "name",
                    {column: 0, margin: 5, font: " 10pt sans-serif"},
                    new go.Binding("text", "name")
                ),
                $(go.TextBlock,
                    {column: 1, margin: 5, font: " 10pt sans-serif", editable: true,},
                    new go.Binding("text", "val").makeTwoWay()
                ),
                $(go.TextBlock,
                    {column: 3, margin: 5, font: " 10pt sans-serif", editable: true,},
                    new go.Binding("text", "type").makeTwoWay()
                )
            );
        myDiagram.nodeTemplateMap.add("Comment",
            $(go.Node, "Auto", this.nodeStyle(),
                $(go.Shape, "File",
                    {fill: "#EFFAB4", stroke: null}),
                $(go.TextBlock,
                    {
                        margin: 7,
                        maxSize: new go.Size(200, NaN),
                        wrap: go.TextBlock.WrapFit,
                        textAlign: "center",
                        editable: true,
                        font: "bold 12pt Helvetica, Arial, sans-serif",
                        stroke: '#454545'
                    },
                    new go.Binding("text").makeTwoWay())
                // no ports, because no links are allowed to connect with a comment
            ));
        myDiagram.nodeTemplateMap.add("formula",
            $(go.Node, "Auto",
                // define the node's outer shape
                that.nodeStyle(),//加了nodeStyle左边左边操作框才会对齐
                $(go.Shape, "RoundedRectangle",
                    {
                        fill: '#00A9C9', stroke: "black",
                    }),

                $(go.Panel, "Vertical",
                    {stretch: go.GraphObject.Horizontal, background: "#FFDD33"},
                    // headered by a label and a PanelExpanderButton inside a Table
                    $(go.Panel, "Table",
                        {stretch: go.GraphObject.Horizontal},
                        $(go.TextBlock,
                            {
                                alignment: go.Spot.Left,
                                margin: new go.Margin(10, 0, 10, 10),
                                stroke: "black",
                                font: "10pt Verdana, sans-serif"
                            },
                            new go.Binding("text", "title").makeTwoWay()
                        ),
                        $("PanelExpanderButton", "COLLAPSIBLE",  //引用下拉菜单COLLAPSIBLE name of the object to make visible or invisible
                            {column: 1, alignment: go.Spot.Left, margin: new go.Margin(0, 10, 0, 0),}
                        )
                    ), // end Table panel
                    // with the list data bound in the Vertical Panel
                    $(go.Panel, "Table",
                        {
                            defaultRowSeparatorStroke: "gray",
                            defaultColumnSeparatorStroke: "gray"
                        },
                        {
                            name: "COLLAPSIBLE",  //定义下拉菜单COLLAPSIBLE identify to the PanelExpanderButton
                            padding: 1,
                            visible: false,
                            stretch: go.GraphObject.Horizontal,  // take up whole available width
                            background: "#00A9C9",  // to distinguish from the node's body
                            defaultAlignment: go.Spot.Left,  // thus no need to specify alignment on each element
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
        myDiagram.groupTemplateMap.add("OfGroups",
            $(go.Group, "Auto",
                [
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    {
                        locationSpot: go.Spot.Center,
                        mouseEnter: function (e, obj) {
                            that.showPorts(obj.part, true);
                        },
                        mouseLeave: function (e, obj) {
                            that.showPorts(obj.part, false);
                        }
                    }
                ],
                {
                    background: "transparent",
                    // highlight when dragging into the Group
                    mouseDragEnter: function (e, grp, prev) {
                        that.highlightGroup(e, grp, true);
                    },
                    mouseDragLeave: function (e, grp, next) {
                        that.highlightGroup(e, grp, false);
                    },
                    computesBoundsAfterDrag: true,
                    // when the selection is dropped into a Group, add the selected Parts into that Group;
                    // if it fails, cancel the tool, rolling back any changes
                    mouseDrop: that.finishDrop,
                    handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
                    // Groups containing Groups lay out their members horizontally
                },
                new go.Binding("background", "isHighlighted", function (h) {
                    return h ? "rgba(255,0,0,0.2)" : "transparent";
                }).ofObject(),
//                            { resizable: true },
                $(go.Shape, "RoundedRectangle",
                    {fill: null, stroke: "black", strokeWidth: 1}),
                $(go.Panel, "Vertical",  // title above Placeholder
                    $(go.Panel, "Horizontal",  // button next to TextBlock
                        {stretch: go.GraphObject.Horizontal, background: "#FFDD33"},
                        $("SubGraphExpanderButton",
                            {alignment: go.Spot.Left, margin: 5}),
                        $(go.TextBlock,
                            {
                                alignment: go.Spot.Right,
                                editable: true,
                                margin: 5,
                                font: "bold 18px sans-serif",
                                opacity: 0.75,
                                stroke: "#404040"
                            },
                            new go.Binding("text", "text").makeTwoWay())
                    ),  // end Horizontal Panel
                    $(go.Placeholder,
                        {margin: new go.Margin(15)})
                ),  // end Vertical Panel

                // three named ports, one on each side except the bottom, all input only:
                that.makePort("T", go.Spot.Top, false, true),
                that.makePort("L", go.Spot.Left, true, true),
                that.makePort("R", go.Spot.Right, true, true),
                that.makePort("B", go.Spot.Bottom, true, false)
            ));  // end Group and call to add to template Map

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
                    {visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
                    new go.Binding("visible", "visible").makeTwoWay(),
                    $(go.Shape, "RoundedRectangle",  // the label shape
                        {fill: "#F8F8F8", stroke: null}),
                    $(go.TextBlock, "Y",  // the label
                        {
                            textAlign: "center",
                            font: "10pt helvetica, arial, sans-serif",
                            stroke: "#333333",
                            editable: true
                        },
                        new go.Binding("text", "condition").makeTwoWay())
                )
            );

        myPalette.layout.sorting = go.GridLayout.Forward;

        myOverview =
            $(go.Overview, "myOverviewDiv",  // the HTML DIV element for the Overview
                {observed: myDiagram, contentAlignment: go.Spot.Center});   // tell it which Diagram to show and pan


        this.load(this.props.scriptJson)
    }
    load=(json)=>{
        console.log("loadJson")
        myDiagram.model = go.Model.fromJson(json);
    }
    render() {
        return (
            <div className="drawScript">
                <div className="drawScript-sidebar" id="myPaletteDiv" style={{flex:this.props.showScriptSidebar?'0 0 250px':'0 0 0px'}}>

                </div>
                <div className="drawScript-content">
                    <div className="" id="myDiagramDiv">

                    </div>
                    <div className="drawScript-overview" id="myOverviewDiv"></div>
                </div>

            </div>
        )
    }
}
export default Script