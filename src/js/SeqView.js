import React from 'react'
import Seq from './Seq'

class seqView extends React.Component {
    constructor() {
        super();
        this.state = {
            DNAseqs: [],
            TabbedView: false,
            ComplementView: false
        }
    }
    //To do: implement uploading a file from local to host
    addRandomSeq = () => {
        let copySeqs = this.state.DNAseqs;
        copySeqs.push(this.makeid());
        this.setState({
            DNAseqs: copySeqs
        })
    }
    makeid = (length = 500) => {
        var result = '';
        var characters = 'ACGT';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    addRequestedSeq = (seq) => {
        let copySeqs = this.state.DNAseqs;
        copySeqs.push(seq);
        this.setState({
            DNAseqs: copySeqs
        })
    }
    removeSeq = (e) => {
        let copySeqs = this.state.DNAseqs
        let child = document.getElementById(e.target.id);
        let parent = child.parentNode;
        let index = Array.prototype.indexOf.call(parent.children, child);
        index = (index - 2) / 4;
        copySeqs.splice(index, 1);
        this.setState({
            DNAseqs: copySeqs
        })
    }
    //Print the loaded DNA sequences
    printSeqs = () => {
        let seqArray = [];
        for (let i = 0; i < this.state.DNAseqs.length; i++) {
            seqArray.push(<Seq ComplementView={this.state.ComplementView} TabbedView={this.state.TabbedView} DNAseq={this.state.DNAseqs[i]} />);
            seqArray.push(<button id={i} onClick={this.removeSeq}>Remove</button>)
            seqArray.push(<br></br>);
            seqArray.push(<br></br>);
        }
        return seqArray;
    }
    requestSeq = () => {
        let xhr_first = new XMLHttpRequest();
        xhr_first.addEventListener('load', () => {
            //parse the result for WebEnv and QueryKey, needed for second API call which retrieves the sequence
            let res = xhr_first.responseText;
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(res, 'text/xml');
            let WebEnv = xmlDoc.getElementsByTagName('WebEnv')[0].childNodes[0].nodeValue;
            let QueryKey = xmlDoc.getElementsByTagName('QueryKey')[0].childNodes[0].nodeValue;
            //construct string for second API request, use efetch
            let xhr_second = new XMLHttpRequest();
            xhr_second.addEventListener('load', () => {
                let res = xhr_second.responseText;
                let lines = res.split('\n');
                lines.splice(0, 1);
                let seq = lines.join('\n').replace(/\n/g, '');
                this.addRequestedSeq(seq);
            })
            xhr_second.open('GET', 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&query_key=' + QueryKey + '&WebEnv=' + WebEnv + '&rettype=fasta&retmode=text');
            xhr_second.send();
        })
        //first pubmed API GET request, use esearch
        //db = 'nuccore' //request from nuccore database
        //usehistory = 'y' //use history for request
        let term = document.getElementById('requestID').value; //'NM_024530' //the search term

        xhr_first.open('GET', 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nuccore&term=' + term + '&usehistory=y');
        //xhr_first.open('GET', 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nuccore&term=NM_024529&usehistory=y');

                            ///https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nuccore&term=NM_024529&usehistory=y
        xhr_first.send();
    }
    render = () => {
        return (
            <div>
                <ul>
                    <li>
                        <label>Add random seq:</label>
                        <button onClick={this.addRandomSeq}>Generate</button>
                    </li>
                    <li>
                        <label htmlFor='requestID'>Search by sequence ID:</label>
                        <input id='requestID' type='text' defaultValue='NM_024530'></input>
                        <button onClick={this.requestSeq}>Load Seq</button>
                    </li>
                    <li>
                        Tab after 10 bases:
                        <input type='checkbox' id="TabbedView" onClick={this.toggleTabbedView}></input>
                    </li>
                    <li>
                        Show complement:
                        <input type='checkbox' id="ComplementView" onClick={this.toggleComplementView}></input>
                    </li>
                </ul>
                {this.printSeqs()}
            </div>
        )
    }
    //Toggle to show or not DNA complementary strand
    toggleComplementView = () => {
        this.setState({
            ComplementView: !this.state.ComplementView
        })
    }
    //Toggle tabbing enabled/disabled
    toggleTabbedView = () => {
        this.setState({
            TabbedView: !this.state.TabbedView
        })
    }
}

export default seqView;