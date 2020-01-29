import React from 'react'
import Seq from './Seq'

class seqView extends React.Component {
    constructor() {
        super();
        this.seqref = React.createRef();
        this.state = {
            seqs: 0,
            DNAseqs: [],
            TabbedView: false,
            ComplementView: false
        }
    }
    openLocalFile = () => {
        this.setState({
            seqs: this.state.seqs + 1
        })
    }
    printSeqs = () => {
        let seqArray = [];
        for (let i = 0; i < this.state.seqs; i++) {
            seqArray.push(<Seq ComplementView={this.state.ComplementView} TabbedView={this.state.TabbedView} DNAseq="atgctggcagggtactcgctggcgtgaaccagtcctcagtaagcaccaagcagccaaccaagctgcctacccactttcaaccgaagagactcagaaacaaccggatctatgactatgagggttggctgcgtactcgccgctatacataaagaagacgatcagggcggtcaactctatcaatactatcattggagtggcgcgtcagcataatgttaggtccgcgaagcgtcttgtagaacctagctcagcggaacgttttcaaaaactgtttggcgcaggtgtctcttgcaccgtccctgggcccaggcgatagcgccacatttaatgcagcacgctcgccaatcatatgcacgccgatgttctaggtgctctgacgtttgagactcagcaaacagtactgagacggccaaagtattggaccaatggacttgaagagataatcgtggagatggagtcccgcccgtacctggtagtcgatgtatttgcgagacagttcttttcggtatgcgaacagaatgcagtgctttgtctttgatgaacgttcagtattccagggcaagttaattaagtcaaccccgcatacgcaccttaggaattagtggtgagtgtgcctcccttggcacctaaattattttgatatacaagagcggttaatgtaccgtgaccaacgtcccagcaccacttaagaccccgtcgcccc" />);
            seqArray.push(<br></br>);
        }
        return seqArray;
    }
    render() {
        return (
            <div>
                <ul>
                    <li>
                        Load a local Fasta file:
                    <button onClick={this.openLocalFile}>Open file</button>
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
    toggleComplementView = () => {
        this.setState({
            ComplementView: !this.state.ComplementView
        })
    }
    toggleTabbedView = () => {
        this.setState({
            TabbedView: !this.state.TabbedView
        })
    }
}

export default seqView;