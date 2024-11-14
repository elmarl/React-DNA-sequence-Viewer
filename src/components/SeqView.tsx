import React, { useState, useRef, ChangeEvent } from "react";
import Seq from "./Seq";

/**
 * Functional component to manage and display multiple DNA sequences.
 */
const SeqView: React.FC = () => {
  const [DNAseqs, setDNAseqs] = useState<string[]>([]);
  const [TabbedView, setTabbedView] = useState<boolean>(false);
  const [ComplementView, setComplementView] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const requestIDRef = useRef<HTMLInputElement>(null);

  /**
   * Generates a random DNA sequence composed of 'A', 'C', 'G', and 'T'.
   *
   * @param {number} [length=500] - The length of the DNA sequence to generate.
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
   * @param {string} seq
   */
  const addRequestedSeq = (seq: string): void => {
    setDNAseqs((prevSeqs) => [...prevSeqs, seq]);
  };

  /**
   * Removes a DNA sequence from the state based on its index.
   *
   * @param {number} index
   */
  const removeSeq = (index: number): void => {
    setDNAseqs((prevSeqs) =>
      prevSeqs.filter((_, seqIndex) => seqIndex !== index)
    );
  };

  /**
   * Renders all DNA sequences with corresponding remove buttons.
   *
   */
  const printSeqs = (): JSX.Element[] => {
    return DNAseqs.map((seq, index) => (
      <div key={`seq-container-${index}`} className="seq-container">
        <Seq
          ComplementView={ComplementView}
          TabbedView={TabbedView}
          DNAseq={seq}
        />
        <button
          onClick={() => removeSeq(index)}
          aria-label={`Remove sequence ${index + 1}`}
        >
          Remove
        </button>
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
      setError("Please enter a valid sequence ID.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First API call: esearch
      const esearchResponse = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nuccore&term=${encodeURIComponent(
          term
        )}&usehistory=y`
      );

      if (!esearchResponse.ok) {
        throw new Error(`Esearch API error: ${esearchResponse.statusText}`);
      }

      const esearchText = await esearchResponse.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(esearchText, "text/xml");
      const WebEnv = xmlDoc.getElementsByTagName("WebEnv")[0]?.textContent;
      const QueryKey = xmlDoc.getElementsByTagName("QueryKey")[0]?.textContent;

      if (!WebEnv || !QueryKey) {
        throw new Error("Invalid response from NCBI API.");
      }

      // Second API call: efetch
      const efetchResponse = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&query_key=${QueryKey}&WebEnv=${WebEnv}&rettype=fasta&retmode=text`
      );

      if (!efetchResponse.ok) {
        throw new Error(`Efetch API error: ${efetchResponse.statusText}`);
      }

      const efetchText = await efetchResponse.text();
      const seq = efetchText.split("\n").slice(1).join("").replace(/\n/g, "");

      if (!seq) {
        throw new Error("No sequence data found.");
      }

      addRequestedSeq(seq);
    } catch (error: any) {
      console.error("Error fetching sequence:", error);
      setError(
        error.message || "Failed to fetch the sequence. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles changes to the TabbedView checkbox.
   */
  const handleTabbedViewChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setTabbedView(event.target.checked);
  };

  /**
   * Handles changes to the ComplementView checkbox.
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
          <button
            id="generate-button"
            onClick={addRandomSeq}
            aria-label="Generate random DNA sequence"
          >
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
            aria-label="Sequence ID"
          />
          <button onClick={requestSeq}>Load Seq</button>
        </li>
        <li>
          <label htmlFor="tabbed-view-checkbox">Tab after 10 bases:</label>
          <input
            id="tabbed-view-checkbox"
            type="checkbox"
            checked={TabbedView}
            onChange={handleTabbedViewChange}
            aria-checked={TabbedView}
            aria-label="Toggle tabbed view after every 10 bases"
          />
        </li>
        <li>
          <label htmlFor="complement-view-checkbox">Show complement:</label>
          <input
            id="complement-view-checkbox"
            type="checkbox"
            checked={ComplementView}
            onChange={handleComplementViewChange}
            aria-checked={ComplementView}
            aria-label="Toggle display of complementary DNA sequence"
          />
        </li>
      </ul>
      {isLoading && <p>Loading...</p>}
      {error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}
      {printSeqs()}
    </div>
  );
};

export default SeqView;
