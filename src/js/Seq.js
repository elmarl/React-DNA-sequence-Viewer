import React from 'react';

class Seq extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dnaSeq: this.props.DNAseq,
            TabbedView: this.props.TabbedView,
            ComplementView: this.props.ComplementView
        }
    }
    getComplement = (base) => {
        if (base == 'a') { return 't'; }
        else if (base == 't') { return 'a'; }
        else if (base == 'c') { return 'g'; }
        else { return 'c'; }
    }
    transformDNAseqToHtml = (text) => {
        let newtext = [];
        let complementArray = [];
        let base;
        //if tabbed view enabled, add a tab after every 10 bases
        if (this.props.TabbedView) {
            for (let i = 0; i < text.length; i++) {
                //check if 10 bases passed, but dont add tab to end of line
                if (i % 10 === 0 && i % 100 !== 0) {
                    newtext.push(<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>)
                    newtext.push(<span className="DNAletter">{base = text.charAt(i)}</span>)
                    if (this.props.ComplementView) {
                        complementArray.push(<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>)
                        complementArray.push(<span className="DNAletter Complement">{this.getComplement(base)}</span>)
                    }
                    //print 100 bases per line, break row after
                } else if (i % 100 === 0 && i !== 0) {
                    newtext.push(<br></br>)
                    if (this.props.ComplementView) {
                        newtext.push(complementArray)
                        newtext.push(<br></br>)
                        newtext.push(<br></br>)
                        complementArray = [];
                        newtext.push(<span className="DNAletter">{base = text.charAt(i)}</span>)
                        complementArray.push(<span className="DNAletter Complement">{this.getComplement(base)}</span>)

                    } else {
                        newtext.push(<span className="DNAletter">{text.charAt(i)}</span>)
                    }
                    //when in middle of word, no tabbing or row break required
                } else {
                    newtext.push(<span className="DNAletter">{base = text.charAt(i)}</span>)
                    if (this.props.ComplementView) {
                        complementArray.push(<span className="DNAletter Complement">{this.getComplement(base)}</span>)
                    }
                    if (i === text.length - 1) {
                        newtext.push(<br></br>)
                        newtext.push(complementArray)
                    }
                }
            }
            //no tabbing enabled, don't add tabs every 10 bases
        } else {
            for (let i = 0; i < text.length; i++) {
                if (i % 100 === 0 && i !== 0) {
                    newtext.push(<br></br>)
                    if (this.props.ComplementView) {
                        newtext.push(complementArray)
                        newtext.push(<br></br>)
                        newtext.push(<br></br>)
                        complementArray = [];
                        newtext.push(<span className="DNAletter">{base = text.charAt(i)}</span>)
                        complementArray.push(<span className="DNAletter Complement">{this.getComplement(base)}</span>)

                    } else {
                        newtext.push(<span className="DNAletter">{text.charAt(i)}</span>)
                    }
                } else {
                    newtext.push(<span className="DNAletter">{base = text.charAt(i)}</span>)
                    if (this.props.ComplementView) {
                        complementArray.push(<span className="DNAletter Complement">{this.getComplement(base)}</span>)
                    }
                    if (i === text.length - 1) {
                        newtext.push(<br></br>)
                        newtext.push(complementArray)
                    }
                }
            }
        }

        return newtext;
    }
    /*toggleTabbedView = () => {
        let copyTabbedView = !this.state.TabbedView;
        this.setState({
            TabbedView: copyTabbedView
        })
        
    }*/
    generateRowHeader = () => {
        let rowCount = Math.ceil(this.state.dnaSeq.length / 100)
        let rowHeader = [];
        //Generete row header when complementary DNA view enabled
        if (this.props.ComplementView) {
            for (let i = 0; i < rowCount; i++) {
                rowHeader.push(<span>{(i * 100 + 1)}:&nbsp;</span>);
                rowHeader.push(<br></br>);
                rowHeader.push(<br></br>);
                rowHeader.push(<br></br>);
                if (i === rowCount - 1) {
                    rowHeader.pop();
                }
            }
            //Generate row header when complementary DNA view disabled
        } else {
            for (let i = 0; i < rowCount; i++) {
                rowHeader.push(<span>{(i * 100 + 1)}:&nbsp;</span>);
                rowHeader.push(<br></br>);
            }
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

export default Seq;
//ReactDOM.render(<App />, document.getElementById('root'));