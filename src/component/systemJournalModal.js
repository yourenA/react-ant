/**
 * Created by Administrator on 2017/6/13.
 */
import React from 'react';
import {Icon} from 'antd'
class SystemJournal extends React.Component {
    constructor(props) {
        super(props);
        this.timer=null;
        this.scrollTopTimer=null;
        this.scrollBottomTimer=null;
        this.state = {
            systemJournalInfo: [{
                info: '无效Product Code: 00.000000',
                dateTime: new Date().toLocaleString()
            }],
            systemJournalModal: this.props.systemJournalModal
        };
    }

    componentDidMount = ()=> {
        const that = this;
        this.timer = setInterval(function () {
            that.setState({
                systemJournalInfo: that.state.systemJournalInfo.concat({
                    info: '无效Product Code: 00.000000',
                    dateTime: new Date().toLocaleString()
                })
            });
        }, 5000)
    }
    scrollToTop = ()=> {
        const systemJournalContent = document.querySelector('.systemJournal-info');
        const that=this;
        if(this.scrollTopTimer){
            clearInterval(this.scrollTopTimer);
        }
        if(this.scrollBottomTimer){
            clearInterval(this.scrollBottomTimer);
        }
        this.scrollTopTimer = setInterval(function () {
            const backTop = systemJournalContent.scrollTop;
            var speedTop = backTop / 10;
            systemJournalContent.scrollTop=(backTop - speedTop);
            if (backTop == 0) {
                console.log('到达顶部')
                clearInterval( that.scrollTopTimer);
            }
        }, 30);
    }
    scrollToBottom = ()=> {
        const systemJournalContent = document.querySelector('.systemJournal-info');
        // systemJournalContent.scrollTop = systemJournalContent.scrollHeight;
        const that=this;
        if(this.scrollTopTimer){
            clearInterval(this.scrollTopTimer);
        }
        if(this.scrollBottomTimer){
            clearInterval(this.scrollBottomTimer);
        }
        let speedBottom=1
        this.scrollBottomTimer = setInterval(function () {
            const backBottom = systemJournalContent.scrollTop;
            speedBottom = parseInt((systemJournalContent.scrollHeight-backBottom)/8);
            systemJournalContent.scrollTop=(systemJournalContent.scrollTop+speedBottom);
            if (backBottom == systemJournalContent.scrollHeight-systemJournalContent.offsetHeight) {
                console.log('到达底部')
                speedBottom=1
                clearInterval( that.scrollBottomTimer);
            }
        }, 30);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    componentWillReceiveProps(nextProps) {
    }

    hideSystemJournal = ()=> {
        this.setState({
            systemJournalModal: false
        })
    }
    setSystemJournalModalTrue = ()=> {
        this.setState({
            systemJournalModal: true
        })
    }
    clearJournalData=()=>{
        this.setState({
            systemJournalInfo: [],
            })
    }
    render() {
        const systemJournalStyle = this.state.systemJournalModal ? null : {display: 'none'};
        return (
            <div className="systemJournal" style={systemJournalStyle}>
                <div className="systemJournal-mask" onClick={this.hideSystemJournal}>

                </div>
                <div className="systemJournal-content">
                    <div className="systemJournal-header">
                        系统日志
                    </div>
                    <div className="systemJournal-info">
                        <div className="systemJournal-scroll">
                            <div style={{marginBottom:'10px'}} >
                                <Icon title="清空日志" type="delete" className="scroll-icon" onClick={this.clearJournalData}/>
                            </div>
                            <div>
                                <Icon  title="返回顶部"  type="caret-up" className="scroll-icon" onClick={this.scrollToTop}/>
                            </div>
                            <div>
                                <Icon   title="跳到底部"  type="caret-down" className="scroll-icon" onClick={this.scrollToBottom}/>
                            </div>
                        </div>
                        {this.state.systemJournalInfo.map((item, index)=> {
                            return (
                                <p key={index}><span >时间: {item.dateTime } </span><span>{item.info}</span></p>
                            )
                        })}
                    </div>
                </div>


            </div>
        )
    }
}

export default SystemJournal