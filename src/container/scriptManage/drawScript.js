/**
 * Created by Administrator on 2017/6/13.
 */
import React, {Component} from 'react';
import {Breadcrumb, Layout} from 'antd';
import DrawScriptCof from './drawScriptCof'
import './drawScript.less';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as fetchTestConfAction from './../../actions/fetchTestConf';
const {Content,} = Layout;


var $ = window.$;
var go = window.go;
var formulaArr = [
    {category: "start", text: "开始"},
    {text: "条件语句", category: "if", figure: "Diamond"},
    {text: "循环语句", category: "for", figure: "Diamond"},
    {category: "end", text: "结束"},
    { category: "Comment", text: "备注" },
    {title: "分组", isGroup: true, category: "OfGroups"},
    { category: "set", params: [{}],text:'设置参数' },
    {
        category: "item",
        title: "语句",
        params: [
            {key: "param1", value: "100"},
            {key: "param2", value: "120"},
            {key: "param3", value: "130"}
        ]
    }];

var myDiagram = null;
var myPalette = null;
var myOverview =null;
class DrawScript extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChange:false
        };
    }

    componentDidMount() {
        this.init();
        this.props.fetchAllTestType();
        this.props.fetchAllParts();
        this.props.fetchAllHardwareVersions();
    }

    showLinkLabel = (e)=> {
        var label = e.subject.findObject("LABEL");// name: "LABEL"
        if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");//如果figure=Diamond则线的文字可以编辑
    }
    nodeStyle=()=> {
        const that=this;
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
    makePort=(name, spot, output, input)=> {
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
    showPorts=(node, show)=> {
        var diagram = node.diagram;
        if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
        node.ports.each(function (port) {
            port.stroke = (show ? "#333" : null);
        });
    }
    highlightGroup=(e, grp, show)=> {
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
    finishDrop=(e, grp) =>{
        (grp !== null
            ? grp.addMembers(grp.diagram.selection, true)
            : e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true));
    }
    addReason=(e, obj)=>{
        var adorn = obj.part;
        if (adorn === null) return;
        e.handled = true;
        var arr = adorn.adornedPart.data.params;
        myDiagram.model.addArrayItem(arr, {});
    }
    addFormulaParam=(e, obj)=>{
        var adorn = obj.part;
        if (adorn === null) return;
        e.handled = true;
        var arr = adorn.adornedPart.data.params;
        myDiagram.model.addArrayItem(arr, {});
    }
    textStyle=()=>{
        var bigfont = "bold 12pt Helvetica, Arial, sans-serif";
        return {
            margin: 6,
            wrap: go.TextBlock.WrapFit,
            textAlign: "center",
            editable: true,
            font: bigfont
        }
    }
    init = ()=> {
        const that=this;
        const titleFont="11pt Verdana, sans-serif"
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
                    { fill: "#EFFAB4", stroke: null }),
                $(go.TextBlock,
                    {
                        margin: 5,
                        textAlign: "center",
                        editable: true,
                        font:titleFont,
                        stroke: '#454545'
                    },
                    new go.Binding("text").makeTwoWay())
                // no ports, because no links are allowed to connect with a comment
            ));

        var UndesiredEventAdornmentFormula =
            $(go.Adornment, "Spot",
                $(go.Panel, "Auto",
                    $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 4 }),
                    $(go.Placeholder)),
                // the button to create a "next" node, at the top-right corner
                $("Button",
                    { alignment: go.Spot.BottomRight,
                        click: this.addFormulaParam },  // this function is defined below
                    new go.Binding("visible", "", function(a) { return !a.diagram.isReadOnly; }).ofObject(),
                    $(go.Shape, "TriangleDown", { desiredSize: new go.Size(10, 10) })
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
                { selectionAdornmentTemplate: UndesiredEventAdornmentFormula },
                $(go.Shape, "RoundedRectangle",
                    {
                        fill: '#FFDD33',
                    }),

                $(go.Panel, "Vertical",
                    {stretch: go.GraphObject.Horizontal, background: "#FFDD33"},
                    // headered by a label and a PanelExpanderButton inside a Table
                    $(go.Panel, "Horizontal",  // button next to TextBlock
                        {stretch: go.GraphObject.Horizontal,minSize: new go.Size(150, 40)},
                        $("PanelExpanderButton", "COLLAPSIBLE",  //引用下拉菜单COLLAPSIBLE name of the object to make visible or invisible
                            { alignment: go.Spot.Left, margin: new go.Margin(0, 0, 0, 10),}
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
                    $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 4 }),
                    $(go.Placeholder)),
                // the button to create a "next" node, at the top-right corner
                $("Button",
                    { alignment: go.Spot.BottomRight,
                        click: this.addReason },  // this function is defined below
                    new go.Binding("visible", "", function(a) { return !a.diagram.isReadOnly; }).ofObject(),
                    $(go.Shape, "TriangleDown", { desiredSize: new go.Size(10, 10) })
                )
            );
        var reasonTemplate =
            $(go.Panel, "TableRow",
                $(go.TextBlock, "key",
                    {column: 0, margin: 5, font: " 11pt sans-serif", editable: true,},
                    new go.Binding("text", "key").makeTwoWay()
                ),
                $(go.TextBlock,"value",
                    {column: 1, margin: 5, font: " 11pt sans-serif", editable: true,},
                    new go.Binding("text", "value").makeTwoWay()
                )
            );
        myDiagram.nodeTemplateMap.add("set",
            $(go.Node, "Auto",
                that.nodeStyle(),
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                { selectionAdornmentTemplate: UndesiredEventAdornment },
                $(go.Shape, "RoundedRectangle",
                    { fill: "#CC5245", portId: "", stroke: "black", toEndSegmentLength: 150 }),
                $(go.Panel, "Vertical",
                    $(go.Panel, "Horizontal",  // button next to TextBlock
                        {stretch: go.GraphObject.Horizontal,minSize: new go.Size(150, 40)},
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
                            itemTemplate: reasonTemplate },
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
                    return h ? "#FFCCCC" :  "#FFFFFF";
                }).ofObject(),
//                            { resizable: true },
                $(go.Shape, "RoundedRectangle",
                    {fill: null, stroke: "black", strokeWidth: 1}),
                $(go.Panel, "Vertical",  // title above Placeholder
                    $(go.Panel, "Horizontal",  // button next to TextBlock
                        {stretch: go.GraphObject.Horizontal, background: "#98FB98",minSize: new go.Size(150, 40)},
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
                    $(go.Placeholder,
                        {margin: new go.Margin(10)})
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
                { observed: myDiagram, contentAlignment: go.Spot.Center });   // tell it which Diagram to show and pan

        if(!this.props.location.state.newScript){
            console.log(this.props.location.state.scriptJson)
            this.load(this.props.location.state.scriptJson)
        }
    }
    save = ()=> {
        document.getElementById("mySavedModel").value = myDiagram.model.toJson();
        myDiagram.isModified = false;
    }
    load = (json)=> {
        myDiagram.model = go.Model.fromJson(json);
    }
    searchDiagram=()=>{
        {  // called by button
            var input = document.getElementById("mySearch");
            if (!input) return;
            input.focus();

            myPalette.startTransaction("highlight search");

            if (input.value) {
                // search four different data properties for the string, any of which may match for success
                // create a case insensitive RegExp from what the user typed
                var regex = new RegExp(input.value, "i");
                console.log("regex",regex)
                var results = myPalette.findNodesByExample({ name: regex },
                    { text: regex },
                    { title: regex });
                // try to center the diagram at the first node that was found
                if (results.count > 0) myPalette.centerRect(results.first().actualBounds);
            } else {  // empty string only clears highlighteds collection
                myPalette.clearHighlighteds();
            }

        }

    }
    keypressInput=(e)=>{
        console.log(e.which);//react使用which代替keycode
        if(e.which===13){
            this.searchDiagram()
        }
    }
    saveScript=()=>{
        const DrawScriptCof=this.refs.DrawScriptCofForm.getFieldsValue()
        console.log('保存',DrawScriptCof)
    }
    turnBack=()=>{
        if(this.state.isChange){
            console.log('已经修改，请确认')
        }else{
            this.props.history.goBack()
        }
    }
    contentHadChanged=()=>{
        this.setState({
            isChange:true
        })
    }
    render() {
        console.log(this.props)
        return (
            <Content className="content">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item style={{cursor: 'pointer'}} onClick={this.turnBack}>脚本管理</Breadcrumb.Item>
                    <Breadcrumb.Item>{this.props.location.state.newScript?'新建脚本':'编辑脚本'}</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content-container">
                    <div className="testing-header">
                        <DrawScriptCof ref="DrawScriptCofForm" {...this.props}/>
                        <div className="testing-start">
                            <div className="testing-start-btn testing-save-btn" onClick={this.saveScript}>
                                保存脚本
                            </div>
                        </div>
                    </div>
                    <div className="drawScript">
                        <div className="drawScript-sidebar" id="myPaletteDiv">

                        </div>
                        <div className="drawScript-content">
                            <div className="" id="myDiagramDiv">

                            </div>
                            <div className="drawScript-overview" id="myOverviewDiv"></div>
                        </div>
                    </div>
                    <div>
                        <button id="SaveButton" onClick={this.save}>将图表转为JSON</button>
                        <button onClick={this.load}>将JSON转为图表</button>
                    </div>
                    <div>
                        <input id="mySearch" type="text" onKeyPress={this.keypressInput}/>
                        <button onClick={this.searchDiagram}>search</button>
                    </div>
                    <textarea id="mySavedModel"></textarea>
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
export default connect(mapStateToProps,mapDispatchToProps)(DrawScript);