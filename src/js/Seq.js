import React from "react";
/**
 * Functional component to display a DNA sequence and its complement.
 *
 * @param {Object} props
 * @param {string} props.DNAseq - The DNA sequence to display.
 * @param {boolean} props.TabbedView - Flag to enable tabbed view after every 10 bases.
 * @param {boolean} props.ComplementView - Flag to display the complementary DNA sequence.
 * @returns {JSX.Element} The rendered DNA sequence component.
 */
const Seq = ({ DNAseq, TabbedView, ComplementView }) => {
  /**
   * Returns the complementary base for a given DNA base.
   *
   * @param {string} base - The DNA base ('A', 'T', 'C', 'G').
   * @returns {string} The complementary base.
   */
  const getComplement = (base) => {
    switch (base) {
      case "A":
        return "T";
      case "T":
        return "A";
      case "C":
        return "G";
      case "G":
        return "C";
      default:
        return base;
    }
  };

  /**
   * Transforms the DNA sequence string into an array of JSX elements with appropriate formatting.
   *
   * @param {string} text - The DNA sequence string.
   * @returns {Array<JSX.Element>} An array of JSX elements representing the formatted DNA sequence.
   */
  const transformDNAseqToHtml = (text) => {
    const newText = [];
    const complementArray = [];
    let base;

    /**
     * Adds a DNA base and its complement (if enabled) to the respective arrays.
     *
     * @param {string} char - The DNA base character.
     * @param {number} index - The current index in the DNA sequence.
     */
    const addBase = (char, index) => {
      base = char.toUpperCase();
      newText.push(
        <span key={`base-${index}`} className="DNAletter">
          {base}
        </span>
      );
      if (ComplementView) {
        complementArray.push(
          <span key={`comp-${index}`} className="DNAletter Complement">
            {getComplement(base)}
          </span>
        );
      }
    };

    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);
      if (TabbedView && i % 10 === 0 && i % 100 !== 0) {
        newText.push(<span key={`tab-${i}`}>&nbsp;&nbsp;&nbsp;&nbsp;</span>);
        addBase(char, i);
      } else if (i % 100 === 0 && i !== 0) {
        newText.push(<br key={`br-${i}`} />);
        if (ComplementView) {
          newText.push(<span key={`comp-line-${i}`}>{complementArray}</span>);
          newText.push(<br key={`br-comp-${i}`} />);
          newText.push(<br key={`br-comp2-${i}`} />);
          complementArray.length = 0; // Clear the array
          addBase(char, i);
        } else {
          addBase(char, i);
        }
      } else {
        addBase(char, i);
        if (i === text.length - 1) {
          newText.push(<br key={`end-br-${i}`} />);
          if (ComplementView) {
            newText.push(<span key={`comp-end-${i}`}>{complementArray}</span>);
          }
        }
      }
    }

    return newText;
  };

  /**
   * Generates row headers for the DNA sequence display.
   *
   * @returns {Array<JSX.Element>} An array of JSX elements representing the row headers.
   */
  const generateRowHeader = () => {
    const rowCount = Math.ceil(DNAseq.length / 100);
    const rowHeader = [];

    for (let i = 0; i < rowCount; i++) {
      rowHeader.push(<span key={`header-${i}`}>{i * 100 + 1}:&nbsp;</span>);
      rowHeader.push(<br key={`br-header-${i}`} />);
      if (ComplementView) {
        rowHeader.push(<br key={`br-header2-${i}`} />);
        rowHeader.push(<br key={`br-header3-${i}`} />);
      }
    }

    return rowHeader;
  };

  return (
    <div>
      <span className="rowHeader">{generateRowHeader()}</span>
      <span className="DNAseq">{transformDNAseqToHtml(DNAseq)}</span>
    </div>
  );
};

export default Seq;
