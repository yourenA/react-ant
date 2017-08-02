'use strict';


import Editor from './editor'
import CodeBlock from './code-block'
import MarkdownControls from  './markdown-controls'
var React = require('react');
var assign = require('lodash.assign');
var Markdown = require('react-markdown');
var h = React.createElement;

export default class Demo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            markdownSrc: [
                '# Live demo\n\nChanges are automatically rendered as you type.\n\n* Follows the ',
                '[CommonMark](http://commonmark.org/) spec\n* Renders actual, "native" React DOM ',
                '![image](http://static.open-open.com/lib/uploadImg/20170514/20170514223408_401.png)',
                'elements\n* Allows you to escape or skip HTML (try toggling the checkboxes above)',
                '\n* If you escape or skip the HTML, no `dangerouslySetInnerHTML` is used! Yay!\n',
                '\n## HTML block below\n\n<blockquote>\n    This blockquote will change based ',
                'on the HTML settings above.\n</blockquote>\n\n## How about some code?\n',
                '```js\nvar React = require(\'react\');\nvar Markdown = require(\'react-markdown\');',
                '\n\nReact.render(\n    <Markdown source="# Your markdown here" />,\n    document.',
                'getElementById(\'content\')\n);\n```\n\nPretty neat, eh?\n\n', '## More info?\n\n',
                'Read usage information and more on [GitHub](//github.com/rexxars/react-markdown)\n\n',
                '---------------\n\n',
                'A component by [VaffelNinja](http://vaffel.ninja) / Espen Hovlandsdal'
            ].join(''),

            htmlMode: 'raw'
        };

        this.onMarkdownChange = this.onMarkdownChange.bind(this);
    }

    onMarkdownChange(md) {
        this.setState({
            markdownSrc: md
        });
    }


    render() {
        return (
            h('div', {className: 'demo'},
                h('div', {className: 'editor-pane'},
                    h(Editor, {
                        value: this.state.markdownSrc,
                        onChange: this.onMarkdownChange
                    })
                ),

                h('div', {className: 'result-pane'},
                    h(Markdown, {
                        className: 'result',
                        source: this.state.markdownSrc,
                        skipHtml: this.state.htmlMode === 'skip',
                        escapeHtml: this.state.htmlMode === 'escape',
                        renderers: assign({}, Markdown.renderers, {
                            CodeBlock: CodeBlock
                        })
                    })
                )
            )
        );
    }
}
