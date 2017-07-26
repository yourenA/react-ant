/**
 * Created by Administrator on 2017/6/13.
 */
import React from 'react';
import {Breadcrumb, Collapse,Icon} from 'antd';
import './about/about.less'
const Panel = Collapse.Panel;
class About extends React.Component {
    render() {
        return(
            <div>
                <div className="content">
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item>使用流程图相关事项</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="content-container">
                        <Collapse defaultActiveKey={['2']} onChange={this.callback}>
                            <Panel header="在何处使用到流程图" key="1">
                                <div className="Media">
                                    <img src={require('./about/1.png')} className="Media-figure"/>
                                    <div className="Media-body">
                                        <p className="about-p">在“脚本管理”和“脚本段管理”使用到流程图</p>
                                        <div className="interval"></div>
                                        <p className="about-p"><b>脚本管理</b>:即运行硬件测试所需要的完整脚本</p>
                                        <div className="interval"></div>
                                        <p className="about-p about-p-inline"><b>脚本段管理</b>:由各种图形组成的一段代码</p>
                                    </div>
                                </div>
                            </Panel>
                            <Panel header="页面结构" key="2">
                                <div className="Media">
                                    <div className="Media-body">
                                        <h3>注意事项</h3>
                                        <h4><Icon type="exclamation-circle-o" style={{marginRight:'5px',color:'red'}}/>暂不要使用浏览器的"前进"与"后退"按钮。</h4>
                                        <h4><Icon type="exclamation-circle-o" style={{marginRight:'5px',color:'red'}}/>不能在同一个浏览器编辑多个"脚本"或"脚本段"流程图,如果编辑多个可能导致数据相互影响</h4>
                                        <h4><Icon type="exclamation-circle-o" style={{marginRight:'5px',color:'red'}}/>每个分组必须有一个"开始",一个或多个"结束"。每个图形之间只能有一条线相连</h4>
                                        <div className="interval"></div>
                                        <img style={{maxWidth:'1100px'}} src={require('./about/3.png')}/>
                                        <div className="interval"></div>
                                        <h3>"操作框"说明</h3>
                                        <div className="interval"></div>
                                        <ul>
                                            <li>
                                                <h5>1.分组框</h5>
                                                <img src={require('./about/4.png')}/> <p className="about-p ">
                                                右击查看详情可以进入到分组里面，双击文字可以编辑分组名称</p>
                                            </li>

                                            <li>
                                                <h5>2.循环分组框</h5>
                                                <img src={require('./about/5.png')}/> <p className="about-p ">
                                                一种特殊的"分组"，双击循环次数后面的数字可以设置"循环次数"</p>
                                            </li>
                                            <li>
                                                <h5>3.条件判断框</h5>
                                                <img src={require('./about/6.png')}/> <p className="about-p ">
                                                双击文字可以编辑条件，条件的格式如: <b>[1] > 10 && [2] == 8 </b>
                                                [1]表示当前条件的上一个语句返回的结果；[2]表示当前条件的上两个语句返回的结果</p>
                                            </li>
                                            <li>
                                                <h5>4.设置参数框</h5>
                                                <img src={require('./about/7.png')}/> <p className="about-p ">
                                                设置当前分组的参数，双击key或value可以编辑，右击key-value表格可以添加key-value值</p>
                                                <p className="about-p ">参数中的第一个单元格为参数kye</p>
                                                <p className="about-p ">参数中的第二个单元格为参数value</p>
                                                <p className="about-p ">参数中的第三个单元格为删除当前参数按钮</p>
                                            </li>
                                            <li>
                                                <h5>5.dll方法框</h5>
                                                <img src={require('./about/8.png')}/>
                                                <p className="about-p ">dll方法。参数和错误码操作如"设置参数框"。</p>
                                                <p className="about-p">"方法名称"表示代码中dll方法名称;"结果下限"/"结果上限"表示期待结果的范围;
                                                    "结果变量"表示在将当前的dll方法的结果赋值为这个变量，方便在判断语句中引用。</p><br/>
                                                <p className="about-p ">参数中的第一个单元格--选择按钮，选中表示该参数事输出参数</p>
                                                <p className="about-p ">参数中的第二个单元格为参数kye</p>
                                                <p className="about-p ">参数中的第三个单元格为参数value</p>
                                                <p className="about-p ">参数中的第四个单元格为删除当前参数按钮</p><br/>
                                                <p className="about-p ">错误码中的第一个单元格为错误码kye</p>
                                                <p className="about-p ">错误码中的第二个单元格为错误码value</p>
                                                <p className="about-p ">错误码中的第三个单元格为删除当前错误码按钮</p>
                                            </li>
                                            <li>
                                                <h5>6.错误输出</h5>
                                                <img src={require('./about/9.png')}/> <p className="about-p " >
                                                当需要把'dll方法框'中的相关错误码输出，可以将'dll方法框'与'错误输出框'相连，如下图：
                                                <p>
                                                <img src={require('./about/10.png')}/></p>

                                                当'dll方法1'运行过程中出现指定的错误码404，这时候会调用'dll方法3'，而不是调用'dll方法2'
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </Panel>
                        </Collapse>


                    </div>
                </div>
            </div>
            )
    }
}


export default About