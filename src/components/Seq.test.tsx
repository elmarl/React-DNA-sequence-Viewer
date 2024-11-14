import { render, screen } from "@testing-library/react";
import Seq from "./Seq";

describe("Seq Component", () => {
  const sampleDNA = "ATCGATCGATCG";

  test("renders the DNA sequence correctly", () => {
    render(
      <Seq DNAseq={sampleDNA} TabbedView={false} ComplementView={false} />
    );

    // Check for the presence of the first base
    const linkElements = screen.getAllByText("A");
    linkElements.forEach((linkElement) => {
      expect(linkElement).toBeInTheDocument();
    });
  });

  test("renders the entire DNA sequence correctly", () => {
    render(
      <Seq DNAseq={sampleDNA} TabbedView={false} ComplementView={false} />
    );

    const container = screen.getByTestId("dna-sequence");
    expect(container).toHaveTextContent(sampleDNA);
  });

  test("applies correct styles on hover", () => {
    render(<Seq DNAseq="A" TabbedView={false} ComplementView={false} />);

    const baseElement = screen.getByText("A");
    expect(baseElement).toBeInTheDocument();

    // Simulate hover and check style changes
    // React Testing Library doesn't handle CSS hover effects directly so just checking if class name applied.
    expect(baseElement).toHaveClass("DNAletter");
    expect(baseElement).toHaveClass("A");
  });

  test("handles multiple occurrences of the same nucleotide", () => {
    render(<Seq DNAseq="AAATTT" TabbedView={false} ComplementView={false} />);

    const aElements = screen.getAllByText("A");
    const tElements = screen.getAllByText("T");

    expect(aElements).toHaveLength(3);
    expect(tElements).toHaveLength(3);

    aElements.forEach((element) => {
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass("DNAletter", "A");
    });

    tElements.forEach((element) => {
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass("DNAletter", "T");
    });
  });

  test("does not assign nucleotide-specific class to invalid nucleotides", () => {
    render(<Seq DNAseq="AXTG" TabbedView={false} ComplementView={false} />);

    const validBase = screen.getByText("A");
    const invalidBase = screen.getByText("X");
    const validTBase = screen.getByText("T");
    const validGBase = screen.getByText("G");

    // Valid bases
    expect(validBase).toBeInTheDocument();
    expect(validBase).toHaveClass("DNAletter", "A");

    expect(validTBase).toBeInTheDocument();
    expect(validTBase).toHaveClass("DNAletter", "T");

    expect(validGBase).toBeInTheDocument();
    expect(validGBase).toHaveClass("DNAletter", "G");

    // Invalid base
    expect(invalidBase).toBeInTheDocument();
    expect(invalidBase).toHaveClass("DNAletter"); // Should NOT have class 'X'
    expect(invalidBase).not.toHaveClass("X");
  });

  test("renders complement sequence when ComplementView is true", () => {
    render(<Seq DNAseq="A" TabbedView={false} ComplementView={true} />);

    // Original base
    const originalBase = screen.getByText("A");
    expect(originalBase).toBeInTheDocument();

    // Complement base
    const complementBase = screen.getByText("T");
    expect(complementBase).toBeInTheDocument();
    expect(complementBase).toHaveClass("DNAletter");
    expect(complementBase).toHaveClass("Complement");
  });

  test("renders tabbed view correctly", () => {
    const longDNA = "ATCGATCGATCG";
    render(<Seq DNAseq={longDNA} TabbedView={true} ComplementView={false} />);

    const tabs = screen.getAllByTestId("tab");
    expect(tabs.length).toBeGreaterThan(0);
  });
});
