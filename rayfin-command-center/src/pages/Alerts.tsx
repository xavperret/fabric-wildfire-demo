interface Alert {
  timestamp: string;
  zone: string;
  priority_score: number;
  action_taken: string;
  acknowledged_by: string | null;
}

const MOCK_ALERTS: Alert[] = [
  { timestamp: "2025-07-23T17:35:00Z", zone: "Toulon", priority_score: 2490, action_taken: "SOL + AÉRIEN dispatched", acknowledged_by: null },
  { timestamp: "2025-07-23T17:20:00Z", zone: "Fontainebleau", priority_score: 2130, action_taken: "SOL + AÉRIEN dispatched", acknowledged_by: null },
  { timestamp: "2025-07-23T17:10:00Z", zone: "Bormes-les-Mimosas", priority_score: 1864, action_taken: "AÉRIEN dispatched", acknowledged_by: "Cpt. Dupont" },
  { timestamp: "2025-07-23T16:45:00Z", zone: "Fréjus", priority_score: 1140, action_taken: "AÉRIEN dispatched", acknowledged_by: "Lt. Martin" },
  { timestamp: "2025-07-23T16:30:00Z", zone: "Nemours", priority_score: 670, action_taken: "SOL dispatched", acknowledged_by: "Cpt. Bernard" },
];

export function Alerts() {
  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: "1.2rem" }}>🚨 Alert Feed (last 24h)</h2>
      <div className="alert-feed">
        {MOCK_ALERTS.map((alert, i) => (
          <div key={i} className={`alert-item ${alert.acknowledged_by ? "acknowledged" : ""}`}>
            <div className="alert-time">
              {new Date(alert.timestamp).toLocaleString()} 
              {alert.acknowledged_by && <span> · ✓ Acknowledged by {alert.acknowledged_by}</span>}
            </div>
            <div className="alert-zone">
              🔥 {alert.zone} — Score {alert.priority_score}
            </div>
            <div className="alert-details">
              Action: {alert.action_taken}
            </div>
            {!alert.acknowledged_by && (
              <div className="alert-actions">
                <button className="btn btn-primary">✓ Acknowledge</button>
                <button className="btn btn-outline">📍 View on map</button>
                <button className="btn btn-outline">📞 Call SDIS</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
