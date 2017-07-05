/**
 * Created by Administrator on 2017/6/13.
 */
import React from 'react';

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
            }, function () {
                let systemJournalContent = document.querySelector('.systemJournal-info');
                if (systemJournalContent) {
                    systemJournalContent.scrollTop = systemJournalContent.scrollHeight;//要在里面这一层添加height: 67vh;overflow-y: scroll;
                }
            });
        }, 5000)
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
        const systemJournalStyle=this.state.systemJournalModal?null:{width:'0px',height:'0px'};
        const systemJournalContentStyle=this.state.systemJournalModal?{display:'block'}:{display:'none'}
        return (
            <div className="systemJournal" style={systemJournalStyle} >
                <div className="systemJournal-mask" onClick={this.hideSystemJournal}>

                </div>
                <div className="systemJournal-content" style={systemJournalContentStyle}>
                    <div className="systemJournal-header">
                        系统日志
                    </div>
                    <div className="systemJournal-info">
                        {this.state.systemJournalInfo.map((item, index)=> {
                            return (
                                <div key={index}>
                                    <p ><span >时间: {item.dateTime } </span><span>{item.info}</span></p>
                                </div>
                            )
                        })}
                    </div>
                </div>


            </div>
        )
    }
}

export default SystemJournal