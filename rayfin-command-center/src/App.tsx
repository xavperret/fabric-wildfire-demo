import { useState } from "react";
import { CommandCenter } from "./pages/CommandCenter";
import { Dispatch } from "./pages/Dispatch";
import { Alerts } from "./pages/Alerts";

type Page = "command-center" | "dispatch" | "alerts";

export function App() {
  const [page, setPage] = useState<Page>("command-center");

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-header">
          <span className="logo">🔥</span>
          <span className="app-title">Wildfire</span>
        </div>
        <ul className="nav-list">
          <li className={page === "command-center" ? "active" : ""}>
            <button onClick={() => setPage("command-center")}>🗺️ Command Center</button>
          </li>
          <li className={page === "dispatch" ? "active" : ""}>
            <button onClick={() => setPage("dispatch")}>🎯 Dispatch</button>
          </li>
          <li className={page === "alerts" ? "active" : ""}>
            <button onClick={() => setPage("alerts")}>🚨 Alerts</button>
          </li>
        </ul>
        <div className="sidebar-footer">
          <div className="live-indicator">
            <span className="pulse"></span> Live — refreshing every 30s
          </div>
        </div>
      </nav>
      <main className="content">
        {page === "command-center" && <CommandCenter />}
        {page === "dispatch" && <Dispatch />}
        {page === "alerts" && <Alerts />}
      </main>
    </div>
  );
}
