/**
 * Created by Administrator on 2017/6/13.
 */
import React from 'react';
class HighZIndexMask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount = ()=> {
    }
    render() {
        return (
            <div  className="high-zIndex-mask" style={{...this.props.style,display:this.props.display}} >


            </div>
        )
    }
}

export default HighZIndexMask