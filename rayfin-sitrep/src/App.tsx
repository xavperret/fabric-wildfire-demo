import { useState } from "react";
import { SitRepGenerator } from "./pages/SitRepGenerator";
import { ReportHistory } from "./pages/ReportHistory";

type Page = "generator" | "history";

export function App() {
  const [page, setPage] = useState<Page>("generator");

  return (
    <div className="app">
      <header className="top-bar">
        <div className="top-bar-left">
          <span className="logo">📋</span>
          <h1>Wildfire SitRep</h1>
        </div>
        <nav className="top-nav">
          <button className={page === "generator" ? "active" : ""} onClick={() => setPage("generator")}>
            📋 Generate Report
          </button>
          <button className={page === "history" ? "active" : ""} onClick={() => setPage("history")}>
            📁 History
          </button>
        </nav>
      </header>
      <main className="main-content">
        {page === "generator" && <SitRepGenerator />}
        {page === "history" && <ReportHistory />}
      </main>
    </div>
  );
}
