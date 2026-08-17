export function ReportHistory() {
  const history = [
    { id: "1", date: "2025-07-23 17:30", zones: 8, maxPriority: 2490, format: "PDF" },
    { id: "2", date: "2025-07-23 16:00", zones: 6, maxPriority: 1864, format: "Teams" },
    { id: "3", date: "2025-07-23 14:30", zones: 5, maxPriority: 1140, format: "PDF" },
    { id: "4", date: "2025-07-22 18:00", zones: 3, maxPriority: 720, format: "PDF" },
    { id: "5", date: "2025-07-22 12:00", zones: 2, maxPriority: 345, format: "Teams" },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: "1.2rem" }}>📁 Report History</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: 20, fontSize: "0.9rem" }}>
        Previously generated situation reports. Click to view or re-export.
      </p>
      {history.map((item) => (
        <div key={item.id} className="history-item">
          <div>
            <strong>SITREP — {item.date}</strong>
            <div className="history-meta">
              {item.zones} zones · Max priority: {item.maxPriority} · Exported as {item.format}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" style={{ fontSize: "0.8rem", padding: "6px 12px" }}>
              👁️ View
            </button>
            <button className="btn btn-secondary" style={{ fontSize: "0.8rem", padding: "6px 12px" }}>
              📄 Re-export
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
