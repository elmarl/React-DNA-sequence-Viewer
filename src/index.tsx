import { createRoot } from "react-dom/client";
import "./styles/index.css";
import SeqView from "./components/SeqView";

const container = document.getElementById("root");
if (container === null) throw new Error("Root container missing in index.html");
const root = createRoot(container);
root.render(<SeqView />);
