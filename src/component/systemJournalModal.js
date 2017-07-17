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
            systemJournalInfo: [],
            systemJournalModal: this.props.systemJournalModal
        };
    }

    componentDidMount = ()=> {
        console.log('componentDidMount')
        const that = this;
        this.timer = setInterval(function () {
            that.setState({
                systemJournalInfo: that.state.systemJournalInfo.concat({
                    info: '无效Product Code: 00.000000',
                    dateTime: new Date().toLocaleString()
                })
            });
        }, 3000)
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
                            <div>
                                <Icon type="caret-up" className="scroll-icon" onClick={this.scrollToTop}/>
                            </div>
                            <div>
                                <Icon type="caret-down" className="scroll-icon" onClick={this.scrollToBottom}/>
                            </div>
                        </div>
                        <p ><span >时间: item.dateTime </span><span>item.info</span></p>
                        <p ><span >时间: item.dateTime </span><span>item.info</span></p>
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