/**
 * Created by Administrator on 2017/6/13.
 */
import React from 'react';
import {Breadcrumb} from 'antd';
import './about/about.less'
const About = () => (
    <div>
        <div className="content">
            <Breadcrumb className="breadcrumb">
                <Breadcrumb.Item>使用流程图相关事项</Breadcrumb.Item>
            </Breadcrumb>
            <div className="content-container">
                <div className="Media">
                    <img src={require('./about/1.png')} className="Media-figure"/>
                    <div className="Media-body">
                        <h2>在何处使用到流程图</h2>
                        <p className="about-p">在“脚本管理”和“脚本段管理”使用到流程图</p>
                        <div className="interval"></div>
                        <p className="about-p"><b>脚本管理</b>:即运行硬件测试所需要的完整脚本</p>
                        <div className="interval"></div>
                        <p className="about-p about-p-inline"><b>脚本段管理</b>:每一个脚本段为一个“分组”(目前设想)</p> <img
                        src={require('./about/2.png')}/>
                    </div>
                </div>
                <div className="Media">
                    <div className="Media-body">
                        <h2>"脚本管理"页面结构</h2>
                        <img src={require('./about/3.png')}/>
                        <div className="interval"></div>
                        <h4>"操作框"说明</h4>
                        <ul>
                            <li>
                                <img src={require('./about/4.png')}/> <p className="about-p about-p-inline">
                                右击查看详情可以进入到分组里面，双击文字可以编辑分组名称</p>
                            </li>
                            <li>
                                <img src={require('./about/5.png')}/> <p className="about-p about-p-inline">
                                一种特殊的"分组"，双击循环次数后面的数字可以设置"循环次数"</p>
                            </li>
                            <li>
                                <img src={require('./about/6.png')}/> <p className="about-p about-p-inline">
                                双击文字可以编辑条件，条件的格式如: <b>[1] > 10 && [2] == 8 </b>
                                [1]表示当前条件的上一个语句返回的结果；[2]表示当前条件的上两个语句返回的结果</p>
                            </li>
                            <li>
                                <img src={require('./about/7.png')}/> <p className="about-p about-p-inline">
                                设置当前分组的参数，双击key或value可以编辑，右击key-value表格可以添加key-value值，点击右边删除按钮可以删除当前行的key-value</p>
                            </li>
                            <li>
                                <img src={require('./about/8.png')}/> <p className="about-p about-p-inline">
                                dll方法。参数和错误码操作如"设置参数"。"方法名称"表示当前dll的唯一标识，"结果下限"/"结果上限"表示期待结果的范围</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="Media">
                    <div className="Media-body">
                        <h2>"脚本管理"页面结构</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

export default About