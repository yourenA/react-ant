var React = require('react');
var PropTypes = require('prop-types');
var Codemirror = require('react-codemirror');
require('codemirror/mode/markdown/markdown');

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            code: this.props.value,
            readOnly: false,
            mode: 'markdown',
        }
    }
    componentDidMount=()=>{
        // var editor = CodeMirror.fromTextArea(document.querySelector('#myTextarea'), {
        //     value: "# Heading\n\nSome **bold** and _italic_ text\nBy [Jed Watson](https://github.com/JedWatson)",
        //     mode: 'markdown',
        //     theme: 'monokai',
        //     onChange: (e)=>{console.log("e.target.value",e.target.value)}
        // });
    }
    onInputChange=(e)=> {
        console.log("e.target.value",e.target.value)
        this.props.onChange(e.target.value);
    }
    updateCode =(newCode)=> {
        this.props.onChange(newCode);
        // this.setState({
        //     code: newCode
        // });
    }
    render() {
        var options = {
            lineNumbers: true,
            readOnly: this.state.readOnly,
            mode: this.state.mode,
            theme: 'monokai',
        };
        return (
               <Codemirror className="myCodemirror" ref="editor" value={this.props.value} onChange={this.updateCode} options={options} autoFocus={true} />
        );
    }
}

Editor.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string
};

export default  Editor;
