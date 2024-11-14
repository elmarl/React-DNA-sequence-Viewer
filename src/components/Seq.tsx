import React from "react";
import styles from "../styles/Seq.module.css";
import { Nucleotide } from "../types/nucleotide";

interface SeqProps {
  DNAseq: string;
  TabbedView: boolean;
  ComplementView: boolean;
}

const nucleotideClassMap: Record<Nucleotide, string> = {
  A: styles.A,
  T: styles.T,
  C: styles.C,
  G: styles.G,
};

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
     * Splits an array into smaller chunks of a specified size.
     *
     * @param {string} array - The string to be split into chunks.
     * @param {number} size - The size of each chunk.
     */
    const chunkArray = (array: string, size: number): string[] => {
      const result: string[] = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    };

    /**
     * Transforms the DNA sequence string into an array of JSX elements with appropriate formatting.
     *
     * @param {string} sequence - The DNA sequence string.
     */
    const transformDNAseqToHtml = (sequence: string): JSX.Element[] => {
      const elements: JSX.Element[] = [];
      const lines = chunkArray(sequence, 100); // Split into lines of 100 bases

      lines.forEach((line, lineIndex) => {
        // Split line into chunks of 10 bases if TabbedView is enabled
        const chunks = TabbedView ? chunkArray(line, 10) : [line];

        chunks.forEach((chunk, chunkIndex) => {
          // Insert tab before the chunk if it's not the first chunk in the line
          if (TabbedView && chunkIndex > 0) {
            elements.push(
              <span
                key={`tab-${lineIndex}-${chunkIndex}`}
                className={styles.tab}
                aria-hidden="true"
                data-testid="tab"
              ></span>
            );
          }

          // Map each base in the chunk to a <span>
          const baseElements = chunk.split("").map((base, baseIndex) => {
            const globalBaseIndex =
              lineIndex * 100 + chunkIndex * 10 + baseIndex;
            const upperBase = base.toUpperCase() as Nucleotide;
            return (
              <span
                key={`base-${globalBaseIndex}`}
                className={`${styles.DNAletter} ${nucleotideClassMap[upperBase]}`}
                data-base={base.toUpperCase()}
                aria-label={`Base ${
                  globalBaseIndex + 1
                }: ${base.toUpperCase()}`}
              >
                {base.toUpperCase()}
              </span>
            );
          });

          elements.push(...baseElements);
        });

        // Add a line break after each line
        elements.push(<br key={`br-${lineIndex}`} />);

        // If ComplementView is enabled, generate and append the complementary sequence
        if (ComplementView) {
          const complementSequence = sequence
            .slice(lineIndex * 100, lineIndex * 100 + 100)
            .split("")
            .map((base) => getComplement(base));

          const complementChunks = TabbedView
            ? chunkArray(complementSequence.join(""), 10)
            : [complementSequence.join("")];

          // Optionally insert tabs in the complement sequence
          const complementElements: JSX.Element[] = [];
          complementChunks.forEach((chunk, chunkIndex) => {
            if (TabbedView && chunkIndex > 0) {
              complementElements.push(
                <span
                  key={`comp-tab-${lineIndex}-${chunkIndex}`}
                  className={styles.tab}
                  aria-hidden="true"
                  data-testid="tab"
                ></span>
              );
            }

            const compBaseElements = chunk
              .split("")
              .map((compBase, compBaseIndex) => {
                const globalCompIndex =
                  lineIndex * 100 + chunkIndex * 10 + compBaseIndex;
                const upperBase = compBase.toUpperCase() as Nucleotide;
                return (
                  <span
                    key={`comp-base-${globalCompIndex}`}
                    className={`${styles.DNAletter} ${styles.Complement} ${nucleotideClassMap[upperBase]}`}
                    data-base={compBase}
                    aria-label={`Complement of base ${
                      globalCompIndex + 1
                    }: ${compBase}`}
                  >
                    {compBase}
                  </span>
                );
              });

            complementElements.push(...compBaseElements);
          });

          elements.push(
            <span
              key={`comp-line-${lineIndex}`}
              aria-label={`Complement sequence line ${lineIndex + 1}`}
            >
              {complementElements}
            </span>
          );
          elements.push(<br key={`br-comp-${lineIndex}`} />);
          elements.push(<br key={`br-comp2-${lineIndex}`} />);
        }
      });

      return elements;
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
            {i * 100 + 1}:
          </span>
        );
        rowHeader.push(<br key={`br-header-${i}`} />);
        if (ComplementView) {
          rowHeader.push(<br key={`br-header-cmplmnt-1-${i}`} />);
          rowHeader.push(<br key={`br-header-cmplmnt-2-${i}`} />);
        }
      }

      return rowHeader;
    };

    const renderedSequence = React.useMemo(
      () => transformDNAseqToHtml(DNAseq),
      [DNAseq, TabbedView, ComplementView]
    );

    return (
      <div data-testid="dna-sequence">
        <span className={styles.rowHeader}>{generateRowHeader()}</span>
        <span className={styles.DNAseq}>{renderedSequence}</span>
      </div>
    );
  }
);

export default Seq;
