import React from "react";

interface SeqProps {
  DNAseq: string;
  TabbedView: boolean;
  ComplementView: boolean;
}

/**
 * Functional component to display a DNA sequence and its complement.
 *
 * @param {SeqProps} props
 * @param {string} props.DNAseq - The DNA sequence to display.
 * @param {boolean} props.TabbedView - Flag to enable tabbed view after every 10 bases.
 * @param {boolean} props.ComplementView - Flag to display the complementary DNA sequence.
 */
const Seq: React.FC<SeqProps> = React.memo(
  ({ DNAseq, TabbedView, ComplementView }) => {
    /**
     * Returns the complementary base for a given DNA base.
     *
     * @param {string} base - The DNA base ('A', 'T', 'C', 'G').
     */
    const getComplement = (base: string): string => {
      switch (base.toUpperCase()) {
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
     */
    const transformDNAseqToHtml = (text: string): JSX.Element[] => {
      const newText: JSX.Element[] = [];
      let complementArray: JSX.Element[] = [];
      let base: string;

      /**
       * Adds a DNA base and its complement (if enabled) to the respective arrays.
       *
       * @param {string} char - The DNA base character.
       * @param {number} index
       */
      const addBase = (char: string, index: number): void => {
        base = char.toUpperCase();
        newText.push(
          <span
            key={`base-${index}`}
            className="DNAletter"
            aria-label={`Base ${index + 1}: ${base}`}
          >
            {base}
          </span>
        );
        if (ComplementView) {
          complementArray.push(
            <span
              key={`comp-${index}`}
              className="DNAletter Complement"
              aria-label={`Complement of base ${index + 1}: ${getComplement(
                base
              )}`}
            >
              {getComplement(base)}
            </span>
          );
        }
      };

      for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i);
        if (TabbedView && i % 10 === 0 && i % 100 !== 0) {
          // Add tabbing to main sequence
          newText.push(<span key={`tab-${i}`}>&nbsp;&nbsp;&nbsp;&nbsp;</span>);
          addBase(char, i);

          // Add tabbing to complement sequence
          if (ComplementView) {
            complementArray.push(
              <span key={`comp-tab-${i}`}>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            );
          }
        } else if (i % 100 === 0 && i !== 0) {
          // Add line break to main sequence
          newText.push(<br key={`br-${i}`} />);
          if (ComplementView) {
            // Add complement sequence and line breaks
            newText.push(
              <span
                key={`comp-line-${i}`}
                aria-label={`Complement sequence line ${i / 100}`}
              >
                {complementArray}
              </span>
            );
            newText.push(<br key={`br-comp-${i}`} />);
            newText.push(<br key={`br-comp2-${i}`} />);
            complementArray = []; // Clear the array
            addBase(char, i);
          } else {
            addBase(char, i);
          }
        } else {
          addBase(char, i);
          if (i === text.length - 1) {
            newText.push(<br key={`end-br-${i}`} />);
            if (ComplementView) {
              newText.push(
                <span
                  key={`comp-end-${i}`}
                  aria-label="Final complement sequence"
                >
                  {complementArray}
                </span>
              );
            }
          }
        }
      }

      return newText;
    };

    /**
     * Generates row headers for the DNA sequence display.
     *
     */
    const generateRowHeader = (): JSX.Element[] => {
      const rowCount = Math.ceil(DNAseq.length / 100);
      const rowHeader: JSX.Element[] = [];

      for (let i = 0; i < rowCount; i++) {
        rowHeader.push(
          <span key={`header-${i}`} aria-label={`Row ${i + 1}`}>
            {i * 100 + 1}:&nbsp;
          </span>
        );
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
  }
);

export default Seq;
