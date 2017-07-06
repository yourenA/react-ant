/**
 * Created by Administrator on 2017/6/13.
 */
import React from 'react';
import {Icon} from 'antd'
class SystemJournal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            systemJournalInfo: [],
            systemJournalModal:this.props.systemJournalModal
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
        }, 5000)
    }
    scrollToTop=()=>{
        const systemJournalContent = document.querySelector('.systemJournal-info');
        systemJournalContent.scrollTop = 0;
    }
    scrollToBottom=()=>{
        const systemJournalContent = document.querySelector('.systemJournal-info');
        systemJournalContent.scrollTop = systemJournalContent.scrollHeight;
    }
    componentWillUnmount() {
        console.log('componentWillUnmount')
        clearInterval(this.timer);
    }

    componentWillReceiveProps(nextProps) {
    }
    hideSystemJournal=()=>{
        this.setState({
            systemJournalModal:false
        })
    }
    setSystemJournalModalTrue=()=>{
        this.setState({
            systemJournalModal:true
        })
    }
    render() {
        const systemJournalStyle=this.state.systemJournalModal?null:{display:'none'};
        return (
            <div className="systemJournal" style={systemJournalStyle} >
                <div className="systemJournal-mask" onClick={this.hideSystemJournal}>

                </div>
                <div className="systemJournal-content" >
                    <div className="systemJournal-header">
                        系统日志
                    </div>
                    <div className="systemJournal-info">
                        <div className="systemJournal-scroll">
                            <div>
                                <Icon type="caret-up" className="scroll-icon" onClick={this.scrollToTop}/>
                            </div>
                            <div>
                                <Icon type="caret-down" className="scroll-icon"  onClick={this.scrollToBottom}/>
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