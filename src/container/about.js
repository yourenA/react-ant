/**
 * Created by Administrator on 2017/6/13.
 */
import React from 'react';
import {Breadcrumb, Collapse, Icon, Anchor} from 'antd';
import ReactMarkdown from './../component/markdown'
import './about/about.less'
const Panel = Collapse.Panel;
const {Link} = Anchor;
class About extends React.Component {
    render() {
        return (
            <div>
                <div className="content">

                    <div className=" about-container">
                        <div className="about-anchor">
                            <Anchor>
                                <Link href="#system-desc" title="1.系统概述"/>
                                <Link href="#run-env" title="2.运行环境"/>
                                <Link href="#function" title="3.功能"/>
                                <Link href="#definition" title="4.定义"/>
                                <Link href="#permission" title="5.权限说明"/>
                                <Link href="#use-explain" title="6.使用说明">
                                    <Link href="#hardware-test" title="6.1 硬件测试"/>
                                    <Link href="#test-info" title="6.2 测试报告"/>
                                    <Link href="#production-manage" title="6.3 生产管理"/>
                                    <Link href="#script-manage" title="6.4 脚本管理"/>
                                    <Link href="#segment-manage" title="6.5 脚本段管理"/>
                                    <Link href="#category-manage" title="6.6 分类管理"/>
                                    <Link href="#system-manage" title="6.7 系统管理"/>
                                    <Link href="#system-journal" title="6.8 系统日志"/>
                                    <Link href="#user-config" title="6.9 用户设置"/>
                                </Link>
                            </Anchor>
                        </div>

                        <div className="about-content" >
                            <div className="about-content-item" id="system-desc">
                                <h2>1.系统概述</h2>
                                <div className="item-desc">
                                    <ul>
                                        <ol>
                                            系统的使用与管理源于研发公司与制造厂商之间的生产关系，研发公司要求制造厂商生产某批电子产品时，对于质量的控制，有很大的比重来自如何实行严格的测试，以保证产品的质量相对稳定。这是一个自动化控制上电测试电子产品的系统，基于B/S的网络架构，数据全部保存于服务器，并可扩展到云端存储及管理【可参考系统架构图】。
                                        </ol>
                                        <ol>
                                            本系统有以下几大优点：
                                        </ol>

                                        <ol>1.减少大量重复的人力劳动使出错的机率降至接近于零的水平；</ol>
                                        <ol>2.效率极大地提升；</ol>
                                        <ol>3.实现异地协同工作；</ol>
                                        <ol>4.数据存于云端，为数据分析打下基础；</ol>

                                        <ol>
                                            系统的实体工作部分一般部曙在制造厂商的片区内，可以独立工作，当连上互联网时，可与云端服务器双向同步数据。工作必备部分为厂区服务器、局域网、PC终端、测试架等硬件设备，云端属扩展部分，缺少云端会使得部分功能无法使用，但不影响最基本的测试工作。
                                        </ol>
                                    </ul>
                                    <img className="about-image" alt="系统概述" src={require('./about/system-desc.png')}/>
                                </div>
                            </div>
                            <div className="about-content-item" id="run-env">
                                <h2>2.运行环境</h2>
                                <div className="item-desc">
                                    <ul>
                                        <h4>硬件：</h4>
                                        <ol>服务器一台（建议：内存8G或以上）</ol>
                                        <ol >PC机至少一台</ol>
                                        <ol>高质量以太网（百兆或以上）</ol>
                                        <ol>测试架，连接PC的适配器</ol>
                                        <h4>软件：</h4>
                                        <ol>windows7/8/10操作系统</ol>
                                        <ol>浏览器：Chrome (其它不推荐)</ol>
                                        <ol>官方指定的服务程序，运行环境</ol>
                                    </ul>
                                </div>
                            </div>
                            <div className="about-content-item" id="function">
                                <h2>3.功能</h2>
                                <div className="item-desc">
                                    <ul>
                                        <ol><span className="color-red">总体业务流程：</span> 创建产品的生产批次（研发公司） -> 激活（研发公司） ->
                                            生产（制造厂商） -> 测试（制造厂商） -> 完成 【可参考业务流程图】
                                        </ol>
                                        <ol><span className="color-red">规范化的测试工序流程：</span>产品测试目前有两种工作模式，自由测试模式可根据实际需要做单个或小部分测试，灵活但不规范。按工序流程的模式，由系统自动控制各步骤先后顺序，避免
                                        </ol>
                                        <ol><span className="color-red">直观的测试脚本制作：</span>使用图形化的方式生创建测试脚本，对于一般人员更容易上手，降低了学习难度。使用写代码方式生成测试脚本需要具备一定的编程基础，而使用图形方式大大降
                                            使用图形化的方式生创建测试脚本，对于一般人员更容易上手，降低了学习难度。使用写代码方式生成测试脚本需要具备一定的编程基础，而使用图形方式大大降复制作的工作量。
                                        </ol>
                                        <ol><span className="color-red"> 有效简单的生产管理：</span>生产管理可以作为研发公司与制造厂商之间业务关系的钮带。研发公司制定的生产计划可以通过生产管理模块创建生产批次，制作产品序列号，激活批次后制造厂
                                            商由此作为生产测试的依据。
                                        </ol>
                                        <ol><span className="color-red">测试报告：</span>所有的测试会被记录下来，事后可到测试报告中查询结果，并可有选择地打印出来。研发公司无需再到现场取样，无论有多远，只要坐在办公室，点一下就可以查询到所有想看
                                            的测试结果。
                                        </ol>
                                        <ol><span className="color-red">权限：</span>为了更有效地支持实际的业务环境，系统提供了简便的分级权限管理，以满足不同业务部门的需要。
                                        </ol>
                                        <ol><span className="color-red">云服务器：</span>这是一个可选的隐含模块，对于研发公司与制造厂商远程协同工作起到至关重要的的作用，特别是有多间制造厂商的时侯。研发公司可以更方便快捷地把生产计划，测试脚本传
                                            传给相应的制造厂商，或更容易查看到测试的结果等。
                                        </ol>
                                    </ul>
                                    <img className="about-image" alt="系统概述" src={require('./about/function.png')}/>
                                </div>
                            </div>
                            <div className="about-content-item" id="definition">
                                <h2>4.定义</h2>
                                <div className="item-desc">
                                    <ul>
                                        <ol><span className="color-red">制造厂商：</span> 一般为研发公司的合作厂商，是研发公司测试计划的执行者。</ol>
                                        <ol><span className="color-red">产品代码：</span>对于某品类产品的唯一编码，人工编制，有一定的格式，编码中的位或段有一定的含义标识产品的属性。
                                        </ol>
                                        <ol><span className="color-red">产品名称：</span>相对于产品代码的一个名称，该名称没有唯一性要求。</ol>
                                        <ol><span className="color-red">测试类型：</span>产品测试的方法，一般按业内专业划分来定名称，可自行创建，不建议随意命名。
                                        </ol>
                                        <ol><span className="color-red">硬件版本：</span>随着同一个功能的产品不断改进，产生的区别，用版本号来区分，版本号只有依附于相应的产品才有意义，不能独立存在。
                                        </ol>
                                        <ol><span className="color-red">测试架：</span>PC机跟被测硬件产品的连接设备，用于执行PC机发出的动作指令，并可返回执行结果，一台PC机可连接多个测试架。
                                        </ol>
                                        <ol><span className="color-red">生产批次号：</span>生产批次号</ol>
                                        <ol><span className="color-red">产品序列号：</span>每个产品的生产编号，每个产品序列号对应唯一的实体产品，该号在系统内归属到某个生产批次号下面。
                                        </ol>
                                        <ol><span className="color-red">工序流程：</span>工序流程跟测试类型相关，对于标准化的工作流程来说，每个工序要制定好先后顺序，而测试类型代表了不同种类的测试，工作中需要对测试控制好先后顺序。
                                        </ol>
                                        <ol><span className="color-red">自由测试：</span>由于某些原因导致需要只做某一种测试，就可以使用自由测试模式来做测试。
                                        </ol>
                                        <ol><span className="color-red">用户组：</span>对某类性质相同的用户做批量的权限设置，需要用到用户组。</ol>
                                        <ol><span className="color-red">用户：</span>可以登录并有一定使用权限的账号。</ol>
                                        <ol><span className="color-red">脚本：</span>运行硬件测试所需要的完整脚本。</ol>
                                        <ol><span className="color-red">脚本段：</span>由各种图形组成的一段代码。</ol>
                                    </ul>
                                </div>
                            </div>
                            <div className="about-content-item" id="permission">
                                <h2>5.权限说明</h2>
                                <div className="item-desc">
                                    <ul>
                                        <ol>系统权限由用户和用户组构成，分个两层级，上层研发公司，下层制造厂商。最高权限是系统管理员（研发公司管理员），由系统初始化时创建，不能修改、删除。系统管理员可以创建同一
                                            级用户或下一级用户，通常由系统管理员创建下一级的制造厂商管理员，再由制造厂商管理员创建需要的用户。【可参考权限层级图】同一用户组有相同的权限，方便统一设置用户的权限</ol>
                                    </ul>
                                    <img className="about-image" alt="系统概述" src={require('./about/definition.jpg')}/>

                                </div>
                            </div>
                            <div className="about-content-item" id="use-explain">
                                <h2>6.使用说明</h2>
                                <div className="item-desc" id="hardware-test">
                                    <h3>6.1 硬件测试</h3>
                                    <ul>
                                        <ol><span className="color-red">说明：</span>
                                            连接好被测硬件于对应的PC接口上（有相应的连接端口），根据设定的测试脚本运行测试，返回测试结果会自动保存。
                                        </ol>
                                        <ol><span className="color-red">使用步骤：</span></ol>
                                        <ol>1.测试架连接到电脑的USB接口，安装好驱动，被测硬件接上测试架；</ol>
                                        <ol> 2.打开硬件测试的界面，根据工单上的批次号输入，如果存在就在界面上显示该单简单属性。</ol>
                                        <ol> 2.打开硬件测试的界面，根据工单上的批次号输入，如果存在就在界面上显示该单简单属性。</ol>
                                        <ol> 4.进入测试的正式工作界面，根据需要调整上面的选项，界面中可以给用户修改有有三项：
                                            <ul>
                                                <li>测试脚本：会自动显示由研发公司提前设好的默认脚本，如果有可选的测试脚本，点傍边的按钮在弹出框中选择，没有特别原因，无需修改此项。
                                                </li>
                                                <li>测试架：测试架属于本机资源，需要人工设置好要使用的测试架，选择后会自动保存，下次打开如果相同就不用修改。</li>
                                                <li>适配器：连接PC的设备，也是本地资源，一般需要选择，选择后会自动保存，发生变动仍需再次手工选择。</li>
                                            </ul>
                                        </ol>
                                        <ol> 5.点击开始测试，会弹出产品序列号的输入框，可以手工输入，也可以用扫描枪输入</ol>
                                        <ol> 6.开始测试时，脚本解释由服务器提供，会显示测试进度，可以手工终止测试，后台响应可能有一定的延迟</ol>
                                    </ul>
                                </div>
                                <div className="item-desc" id="test-info">
                                    <h3>6.2 测试报告</h3>
                                    <ul>
                                        <ol>待定</ol>
                                    </ul>
                                </div>
                                <div className="item-desc" id="production-manage">
                                    <h3>6.3 生产管理</h3>
                                    <ul>
                                        <ol><span className="color-red">说明：</span></ol>
                                        <ol><span className="color-red">使用步骤：</span></ol>
                                        <ol>1.在打开的默认界面，输入生产批次号可查找到已存在的生产批次号，输入时会自动匹配并显示，不需要按其它按钮，也不用回车，列表空白说明不存在。</ol>
                                        <ol>2.点击添加生产批次，可进入创建新批次的界面。</ol>
                                        <ol>3.在创建新批次界面中，批次号需手工输入，产品代码只能在下接列表中选择，选择后才会有可供选择的硬件版本号。说明描述按需填写，属于非必填项。</ol>
                                        <ol>
                                            4.批次测试工序流程需要按照从左到右的选择顺序，先在第一个选项框选择要使用的测试方法，把需要用到的测试方法添加到中间选项框，系统会按照从上到下的顺序控制测试的先后次
                                            序。点击第二个选框中的选项时，第三个选框会列出该类型可用的测试脚本，然后在第三个选项框选中要设为默认的脚本。
                                        </ol>
                                        <ol>
                                            5.保存后回到生产批次列表界面，找到刚才创建的批次号，在操作栏点击产品序列号即可进行产品序列号的添加。点击从文件中导入，点击弹出框中间灰色区域可以选择要导入的文件，
                                            也可以把文件从外面拖放进来。文件要求使用csv格式，可在excel制作好后另存为csv文件，首行预留给表头，可留空第一行。
                                        </ol>
                                        <ol> 6.导入后的序列号会暂时保存在临时表，需要点保存序列号才会真正生效。保存有三个功能选项：
                                            <ul>
                                                <li>6.导入后的序列号会暂时保存在临时表，需要点保存序列号才会真正生效。保存有三个功能选项： </li>
                                                <li> 增量保存：在当前己存在序列号后面添加，不影响之前的序列号。</li>
                                                <li>覆盖保存：以后面的序列号为准，会更新旧的序列号。</li>
                                            </ul>
                                        </ol>
                                        <ol> 7.添加序列号提供单个添加，如果想删除单个序列号，可以直接点每个号后面的删除按钮，全部删除点击清空序列号。</ol>
                                        <ol>8.完成后点击退出即可回到列表。</ol>
                                        <ol>9.列表中对应批次后面的编辑只能对相关属性修改，要修改序列号还要点回序列号按钮。</ol>
                                        <ol>10.状态是根据工作场影来设定的，当刚创建时状态为未激活，可随意修改、删除、增加序列号。确认批次后把状态设为已激活，这时制造厂商就可以看见该批次。当完成生产、测试后，
                                            应当把状态设为已完成。再修改是非正常手段，提供查漏补缺的一种额外方法，一般情况下不会用到。</ol>
                                        <ol>11.删除批次只能在未激添状态下使用，未激活的批次相当于草稿，可随意删除。</ol>
                                    </ul>
                                    <img className="about-image" alt="系统概述" src={require('./about/prodution-manage.png')}/>
                                </div>
                                <div className="item-desc" id="script-manage">
                                    <h3>6.4 脚本管理</h3>
                                    <div className="Media">
                                        <div className="Media-body">
                                            <h3>注意事项</h3>
                                            <h4><Icon type="exclamation-circle-o" style={{marginRight:'5px',color:'red'}}/>暂不要使用浏览器的"前进"与"后退"按钮。</h4>
                                            <h4><Icon type="exclamation-circle-o" style={{marginRight:'5px',color:'red'}}/>每个分组必须有一个"开始",一个或多个"结束"。每个图形之间只能有一条线相连</h4>
                                            <div className="interval"></div>
                                            <img className="about-image" alt=""  src={require('./about/3.png')}/>
                                            <img className="about-image" alt=""  src={require('./about/3-1.png')}/>
                                            <p className="about-p ">拖动"操作框"中的图形到"编辑框"进行代码编辑</p>
                                            <p className="about-p ">将图形按住放到"编辑框"下边框附近或上边框附近，可以将编辑框拉长</p>
                                            <div className="interval"></div>
                                            <h3>"操作框"说明</h3>
                                            <div className="interval"></div>
                                            <ul>
                                                <li>
                                                    <h4>1.分组框</h4>
                                                    <img  alt=""  src={require('./about/4.png')}/> <p className="about-p ">
                                                    双击可以进入到分组里面，双击文字可以编辑分组名称</p>
                                                </li>

                                                <li>
                                                    <h4>2.循环分组框</h4>
                                                    <img  alt=""  src={require('./about/5.png')}/> <p className="about-p ">
                                                    一种特殊的"分组"，双击默认值后面的数字可以设置"默认值"，双击循环次数后面的数字可以设置"循环次数"，</p>
                                                </li>
                                                <li>
                                                    <h4>3.条件判断框</h4>
                                                    <img  alt=""  src={require('./about/6.png')}/> <p className="about-p " >
                                                    双击文字可以编辑条件，条件的格式<br />
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
                                                    <h4>4.dll方法框</h4>
                                                    <img  alt=""  src={require('./about/8.png')}/>
                                                    <p className="about-p">"方法描述"表示代码中dll方法的相关描述</p>
                                                    <p className="about-p ">参数中的第一个单元格如果有箭头表示该参数是 <b>输出参数</b> 如果没有箭头则表示是普通参数</p>
                                                    <p className="about-p ">参数中的第二个单元格为参数kye</p>
                                                    <p className="about-p ">参数中的第三个单元格为参数value</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="item-desc" id="segment-manage">
                                    <h3>6.5 脚本段管理</h3>
                                    <ul>
                                        <ol>"脚本段管理"页面布局与"脚本管理"页面布局相似，只不过脚本段管理中的每一个脚本段即可以表示一个功能完整的流程图，也可以表示一个功能不完整的流程图</ol>
                                    </ul>
                                </div>

                                <div className="item-desc" id="category-manage">
                                    <h3>6.6 分类管理</h3>
                                    <ul>
                                        <ol>产品管理、测试类型、硬件版本属最基本数据，在系统开始使用前就要创建好，不然其它主要的工作界面没有可用数据，完全无法使用。此处要注意的是硬件版本是对应不同产品代码，同一个版本号可对应多个产品代码，各产品的版本号独立设置互不影响。添加硬件版本号需要先添加产品代码，否则无法单独添加版本号。测试架在硬件测试时用到，可在后面根据需要时增减。</ol>
                                        <ol>各界面操作及风格一致，根据需要操作即可。</ol>
                                    </ul>
                                </div>

                                <div className="item-desc" id="system-manage">
                                    <h3>6.7 系统</h3>
                                    <ul>
                                        <ol><span className="color-red">用户管理：</span>系统管理员可以创建厂商管理员、测试员，厂商管理员只可以创建测试员。提供了删除、禁用/启用、设置分组、重置密码这几个功能，一般如果不想账户消失但不希望这个账户被使用，可以先把它禁用，删除的账户不可恢复。重置密码用于忘记密码的情况下使用，此功能为管理员所用。</ol>
                                        <ol><span className="color-red">组管理：</span>方便把同一类用户统一管理，组权限改变，组内所有用户权限一起改变，要改变组权限请点击操作栏的编辑，把相应权限打开或关闭。</ol>
                                    </ul>
                                </div>

                                <div className="item-desc" id="system-journal">
                                    <h3>6.8 系统日志</h3>
                                    <ul>
                                        <ol>待定</ol>
                                    </ul>
                                </div>

                                <div className="item-desc" id="user-config">
                                    <h3>6.9 用户管理</h3>
                                    <ul>
                                        <ol>用户可以在此处查看自已的权限或修改密码。</ol>
                                    </ul>
                                </div>
                            </div>
                            {/*<ReactMarkdown />*/}
                        </div>


                    </div>
                </div>
            </div>
        )
    }
}


export default About