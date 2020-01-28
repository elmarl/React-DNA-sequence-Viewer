import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';

class Seqedit extends React.Component {
    constructor() {
        super();
        this.state = {
            dnaSeq: "Loremipsumloremipsumaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        }
    }

    transformDNAseqToHtml(text) {
        let newtext = [];
        for (let i = 0; i < text.length; i++) {
            if (i % 10 === 0 && i % 100 !== 0) {
                newtext.push(<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>)
                newtext.push(<span className="DNAletter">{text.charAt(i)}</span>)
            } else if (i % 100 === 0 && i !== 0) {
                newtext.push(<br></br>)
                newtext.push(<span className="DNAletter">{text.charAt(i)}</span>)
            } else {
                newtext.push(<span className="DNAletter">{text.charAt(i)}</span>)
            }
        }
        return newtext;
    }

    generateRowHeader(){
        let rowCount = Math.ceil(this.state.dnaSeq.length / 100)
        let rowHeader = [];
        for (let i = 0; i< rowCount; i++){
            rowHeader.push(<span>{(i*100+1)}:&nbsp;</span>);
            rowHeader.push(<br></br>);
        }
        return rowHeader;
    }

    render() {
        return (
            <div>
                <span className="rowHeader">{this.generateRowHeader()}</span>
                <span className="DNAseq">{this.transformDNAseqToHtml(this.state.dnaSeq)}</span>
            </div>
        );
    }
}

ReactDOM.render(<Seqedit />, document.getElementById('root'));