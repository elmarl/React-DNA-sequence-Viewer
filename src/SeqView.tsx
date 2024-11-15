// SeqView.tsx
import React, { useState, useRef, ChangeEvent } from "react";
import Seq from "./components/Seq";

/**
 * Functional component to manage and display multiple DNA sequences.
 *
 * @returns {JSX.Element} The rendered DNA sequence view component.
 */
const SeqView: React.FC = () => {
  const [DNAseqs, setDNAseqs] = useState<string[]>([]);
  const [TabbedView, setTabbedView] = useState<boolean>(false);
  const [ComplementView, setComplementView] = useState<boolean>(false);
  const requestIDRef = useRef<HTMLInputElement>(null);

  /**
   * Generates a random DNA sequence composed of 'A', 'C', 'G', and 'T'.
   *
   * @param {number} [length=500] - The length of the DNA sequence to generate.
   * @returns {string} The generated DNA sequence.
   */
  const makeId = (length: number = 500): string => {
    const characters = "ACGT";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  /**
   * Adds a randomly generated DNA sequence to the state.
   */
  const addRandomSeq = (): void => {
    setDNAseqs((prevSeqs) => [...prevSeqs, makeId()]);
  };

  /**
   * Adds a requested DNA sequence to the state.
   *
   * @param {string} seq - The DNA sequence to add.
   */
  const addRequestedSeq = (seq: string): void => {
    setDNAseqs((prevSeqs) => [...prevSeqs, seq]);
  };

  /**
   * Removes a DNA sequence from the state based on its index.
   *
   * @param {number} index - The index of the DNA sequence to remove.
   */
  const removeSeq = (index: number): void => {
    setDNAseqs((prevSeqs) =>
      prevSeqs.filter((_, seqIndex) => seqIndex !== index)
    );
  };

  /**
   * Renders all DNA sequences with corresponding remove buttons.
   *
   * @returns {Array<JSX.Element>} An array of JSX elements representing the DNA sequences and controls.
   */
  const printSeqs = (): JSX.Element[] => {
    return DNAseqs.map((seq, index) => (
      <div key={`seq-container-${index}`}>
        <Seq
          ComplementView={ComplementView}
          TabbedView={TabbedView}
          DNAseq={seq}
        />
        <button onClick={() => removeSeq(index)}>Remove</button>
        <br />
        <br />
      </div>
    ));
  };

  /**
   * Fetches a DNA sequence from the NCBI API based on the input sequence ID.
   */
  const requestSeq = async (): Promise<void> => {
    const term = requestIDRef.current?.value.trim();
    if (!term) {
      alert("Please enter a valid sequence ID.");
      return;
    }

    try {
      // First API call: esearch
      const esearchResponse = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nuccore&term=${encodeURIComponent(
          term
        )}&usehistory=y`
      );
      const esearchText = await esearchResponse.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(esearchText, "text/xml");
      const WebEnv = xmlDoc.getElementsByTagName("WebEnv")[0]?.textContent;
      const QueryKey = xmlDoc.getElementsByTagName("QueryKey")[0]?.textContent;

      if (!WebEnv || !QueryKey) {
        alert("Invalid response from NCBI API.");
        return;
      }

      // Second API call: efetch
      const efetchResponse = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&query_key=${QueryKey}&WebEnv=${WebEnv}&rettype=fasta&retmode=text`
      );
      const efetchText = await efetchResponse.text();
      const seq = efetchText.split("\n").slice(1).join("").replace(/\n/g, "");
      addRequestedSeq(seq);
    } catch (error) {
      console.error("Error fetching sequence:", error);
      alert("Failed to fetch the sequence. Please try again.");
    }
  };

  /**
   * Handles changes to the TabbedView checkbox.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - The change event.
   */
  const handleTabbedViewChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setTabbedView(event.target.checked);
  };

  /**
   * Handles changes to the ComplementView checkbox.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - The change event.
   */
  const handleComplementViewChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setComplementView(event.target.checked);
  };

  return (
    <div>
      <ul>
        <li>
          <label htmlFor="generate-button">Add random seq:</label>
          <button id="generate-button" onClick={addRandomSeq}>
            Generate
          </button>
        </li>
        <li>
          <label htmlFor="requestID">Search by sequence ID:</label>
          <input
            id="requestID"
            type="text"
            defaultValue="NM_024530"
            ref={requestIDRef}
          />
          <button onClick={requestSeq}>Load Seq</button>
        </li>
        <li>
          Tab after 10 bases:
          <input
            type="checkbox"
            checked={TabbedView}
            onChange={handleTabbedViewChange}
          />
        </li>
        <li>
          Show complement:
          <input
            type="checkbox"
            checked={ComplementView}
            onChange={handleComplementViewChange}
          />
        </li>
      </ul>
      {printSeqs()}
    </div>
  );
};

export default SeqView;
