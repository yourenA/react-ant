/**
 * Created by Administrator on 2017/6/13.
 */
import React from 'react';

class SystemJournal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            systemJournalInfo:this.props.systemJournalInfo
        };
    }

    componentDidMount=()=> {
        console.log('componentDidMount')
        const that=this;
        this.timer=setInterval(function () {
            that.setState({
                systemJournalInfo: that.state.systemJournalInfo.concat({
                    info:'无效Product Code: 00.000000',
                    dateTime: new Date().toLocaleString()
                })
            },function () {
                let systemJournalContent = document.querySelector('.systemJournal-content');
                if(systemJournalContent){
                    systemJournalContent.scrollTop = systemJournalContent.scrollHeight;//要在里面这一层添加height: 67vh;overflow-y: scroll;
                }
            });
        },1000)
    }
    componentWillUnmount(){
        console.log('componentWillUnmount')
        clearInterval(  this.timer);
    }
    componentWillReceiveProps(nextProps) {
    }
    render() {
        return (
            <div className="systemJournal">
                <div className="systemJournal-content">
                    {this.state.systemJournalInfo.map((item,index)=>{
                        return(
                            <div key={index}>
                                <p ><span >时间: {item.dateTime } </span><span>{item.info}</span></p>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default SystemJournal