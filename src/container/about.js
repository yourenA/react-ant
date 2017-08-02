/**
 * Created by Administrator on 2017/6/13.
 */
import React from 'react';
import {Breadcrumb, Collapse,Icon} from 'antd';
import ReactMarkdown from './../component/markdown'
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
                                    <img src={require('./about/1.png')} alt="" className="Media-figure"/>
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
                                        <h4><Icon type="exclamation-circle-o" style={{marginRight:'5px',color:'red'}}/>每个分组必须有一个"开始",一个或多个"结束"。每个图形之间只能有一条线相连</h4>
                                        <div className="interval"></div>
                                        <img style={{maxWidth:'1100px'}} alt=""  src={require('./about/3.png')}/>
                                        <p className="about-p ">拖动"操作框"中的图形到"编辑框"进行代码编辑</p>
                                        <p className="about-p ">将图形按住放到"编辑框"下边框附近或上边框附近，可以将编辑框拉长</p>
                                        <p className="about-p ">在"编辑框"中可以使用ctrl+z可以撤销操作，使用ctrl+y可以恢复撤销，也可以使用ctrl+c/ctrl+v对图形进行复制/粘贴</p>
                                        <div className="interval"></div>
                                        <h3>"操作框"说明</h3>
                                        <div className="interval"></div>
                                        <ul>
                                            <li>
                                                <h4>1.分组框</h4>
                                                <img  alt=""  src={require('./about/4.png')}/> <p className="about-p ">
                                                右击查看详情可以进入到分组里面，双击文字可以编辑分组名称</p>
                                            </li>

                                            <li>
                                                <h4>2.循环分组框</h4>
                                                <img  alt=""  src={require('./about/5.png')}/> <p className="about-p ">
                                                一种特殊的"分组"，双击循环次数后面的数字可以设置"循环次数"</p>
                                            </li>
                                            <li>
                                                <h4>3.条件判断框</h4>
                                                <img  alt=""  src={require('./about/6.png')}/> <p className="about-p " style={{fontWeight:'bold'}}>
                                                双击文字可以编辑条件，条件的格式<br />
                                                <br />
                                                {`
                                                >,<,>=,<=,==,!= 数字比较符号
                                                 `}<br />
                                                {`
                                                ==,!= 字符串比较符号`
                                                }<br />
                                                {`
                                                && 且`
                                                }<br />
                                                {`
                                                || 或`
                                                }<br />
                                                {`
                                                && 优先级比 || 高，支持使用 () 更改表达式优先级
                                                `}<br />
                                                {`
                                                结果偏差判断：[结果变量]=={数字}。 结果变量是dll方法中的定义结果变量
                                                  `}<br />
                                                {`
                                                例如：设置了结果上限1，结果下限2，表达式 [variable]=={5} 表示 variable 的值介于 3-6 时为真`
                                                }
                                            </p>
                                            </li>
                                            <li>
                                                <h4>4.设置参数框</h4>
                                                <img  alt=""  src={require('./about/7.png')}/> <p className="about-p ">
                                                设置当前分组的参数，双击key或value可以编辑，右击key-value表格可以添加key-value值</p>
                                                <p className="about-p ">参数中的第一个单元格为参数kye</p>
                                                <p className="about-p ">参数中的第二个单元格为参数value</p>
                                                <p className="about-p ">参数中的第三个单元格为删除当前参数按钮</p>
                                            </li>
                                            <li>
                                                <h4>5.dll方法框</h4>
                                                <img  alt=""  src={require('./about/8.png')}/>
                                                <p className="about-p ">dll方法。参数和错误码操作如"设置参数框"。</p>
                                                <p className="about-p">"方法名称"表示代码中dll方法名称;"结果下限"/"结果上限"表示期待结果的范围;</p>
                                                <p className="about-p">"结果变量"表示在将当前的dll方法的结果赋值为这个变量，方便在判断语句中引用。下一层分组可以调用上一层分组定义的"结果变量"</p><br/>
                                                <p className="about-p ">参数中的第一个单元格--选择按钮，选中表示该参数是 <b>输出参数</b></p>
                                                <p className="about-p ">参数中的第二个单元格为参数kye</p>
                                                <p className="about-p ">参数中的第三个单元格为参数value</p>
                                                <p className="about-p ">参数中的第四个单元格为删除当前参数按钮</p><br/>
                                                <p className="about-p ">错误码中的第一个单元格为错误码kye</p>
                                                <p className="about-p ">错误码中的第二个单元格为错误码value</p>
                                                <p className="about-p ">错误码中的第三个单元格为删除当前错误码按钮</p>
                                            </li>
                                            <li>
                                                <h4>6.错误输出</h4>
                                                <img  alt=""  src={require('./about/9.png')}/> <p className="about-p " >
                                                当需要把'dll方法框'中的相关错误码输出，可以将'dll方法框'与'错误输出框'相连，如下图：
                                                <p>
                                                <img  alt=""  src={require('./about/10.png')}/></p>

                                                当'dll方法1'运行过程中出现指定的错误码404，这时候会调用'dll方法3'，而不是调用'dll方法2'
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </Panel>
                        </Collapse>
                        <ReactMarkdown />

                    </div>
                </div>
            </div>
            )
    }
}


export default About