import { useState } from "react";
import { Home } from "./pages/Home";
import { Documentation } from "./pages/Documentation";

function App() {
  const [page, setPage] = useState<"home" | "docs">("home");

  if (page === "docs") {
    return <Documentation onBack={() => setPage("home")} />;
  }

  return <Home onOpenDocs={() => setPage("docs")} />;
}

export default App;
