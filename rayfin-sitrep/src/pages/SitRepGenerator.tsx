import { useState } from "react";

interface SitRepData {
  generated_at: string;
  summary: {
    total_fires: number;
    max_priority: number;
    population_at_risk: number;
    top_zone: string;
  };
  zones: Array<{
    commune: string;
    priority_score: number;
    frp: number;
    population_30km: number;
    recommendation: string;
  }>;
  resources: {
    aircraft_deployed: number;
    aircraft_available: number;
    ground_crews_deployed: number;
  };
  aiSummary: string;
}

// Mock data matching our demo scenario
const MOCK_DATA: SitRepData = {
  generated_at: new Date().toISOString(),
  summary: {
    total_fires: 8,
    max_priority: 2490,
    population_at_risk: 609000,
    top_zone: "Toulon",
  },
  zones: [
    { commune: "Toulon", priority_score: 2490, frp: 340, population_30km: 215000, recommendation: "SOL + AÉRIEN" },
    { commune: "Fontainebleau", priority_score: 2130, frp: 280, population_30km: 185000, recommendation: "SOL + AÉRIEN" },
    { commune: "Bormes-les-Mimosas", priority_score: 1864, frp: 1110, population_30km: 75400, recommendation: "SOL + AÉRIEN" },
    { commune: "Fréjus", priority_score: 1140, frp: 720, population_30km: 42000, recommendation: "SOL + AÉRIEN" },
    { commune: "Nemours", priority_score: 670, frp: 150, population_30km: 52000, recommendation: "SOL + AÉRIEN" },
    { commune: "Melun", priority_score: 345, frp: 65, population_30km: 28000, recommendation: "SOL" },
    { commune: "Draguignan", priority_score: 180, frp: 95, population_30km: 8500, recommendation: "AÉRIEN" },
    { commune: "Collobrières", priority_score: 77, frp: 45, population_30km: 3200, recommendation: "SOL" },
  ],
  resources: {
    aircraft_deployed: 4,
    aircraft_available: 2,
    ground_crews_deployed: 6,
  },
  aiSummary: `La situation incendie se concentre sur deux théâtres majeurs :

**Département du Var (sud-est)** : 5 feux actifs dont Toulon (score critique 2 490) avec 215 000 personnes dans un rayon de 30 km. Les moyens aériens DRAGON83 et PELICAN32 sont engagés. Bormes-les-Mimosas présente le FRP le plus élevé (1 110 MW), indiquant un incendie très intense malgré une population moindre.

**Île-de-France / Seine-et-Marne** : 3 feux autour de Fontainebleau (score 2 130). La forêt nationale est directement menacée. PELICAN44 et SDIS77 sont déployés.

**Recommandation** : Prioriser le renfort aérien sur Toulon (population critique) tout en maintenant la couverture Fontainebleau pour protéger la forêt nationale. Envisager pré-positionnement de moyens supplémentaires à Nîmes si la situation Var s'aggrave.`,
};

function getPriorityClass(score: number): string {
  if (score > 2000) return "priority-critical";
  if (score > 1000) return "priority-high";
  return "priority-medium";
}

export function SitRepGenerator() {
  const [data] = useState<SitRepData>(MOCK_DATA);
  const [generating, setGenerating] = useState(false);

  const handleExportPDF = async () => {
    // In production: uses jspdf + html2canvas to generate PDF
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    setGenerating(false);
    alert("📄 PDF exported: SitRep_" + new Date().toISOString().slice(0, 10) + ".pdf");
  };

  const handleShareTeams = async () => {
    // In production: posts adaptive card to Teams webhook
    alert("📨 SitRep shared to Teams channel: #wildfire-ops");
  };

  return (
    <div id="sitrep-content">
      {/* Header */}
      <div className="report-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "1.4rem", marginBottom: 4 }}>🔥 SITREP — Wildfire Response France</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              Generated: {new Date(data.generated_at).toLocaleString()} · Source: Fabric Eventhouse EH_Wildfire
            </p>
          </div>
          <span style={{ 
            background: "var(--danger)", 
            color: "white", 
            padding: "6px 16px", 
            borderRadius: 20, 
            fontWeight: 700, 
            fontSize: "0.8rem" 
          }}>
            🚨 ALERT LEVEL: HIGH
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="report-card">
        <h2>📊 Situation Overview</h2>
        <div className="kpi-row">
          <div className="kpi-item">
            <div className="label">Active Zones</div>
            <div className="value danger">{data.summary.total_fires}</div>
          </div>
          <div className="kpi-item">
            <div className="label">Max Priority</div>
            <div className="value danger">{data.summary.max_priority.toLocaleString()}</div>
          </div>
          <div className="kpi-item">
            <div className="label">Population at Risk</div>
            <div className="value info">{Math.round(data.summary.population_at_risk / 1000)}K</div>
          </div>
          <div className="kpi-item">
            <div className="label">Top Zone</div>
            <div className="value warning">{data.summary.top_zone}</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="report-card">
        <h2>📈 Timeline (last 6h)</h2>
        <div className="chart-container">
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: 8 }}>📈</div>
            <p>In production: Recharts LineChart showing fire_count and avg_frp over time</p>
            <p style={{ fontSize: "0.8rem", marginTop: 8 }}>Data source: <code>FIRMSDetections | summarize by bin(30m)</code></p>
          </div>
        </div>
      </div>

      {/* Zones detail */}
      <div className="report-card">
        <h2>🎯 Fire Zones by Priority</h2>
        <table className="zones-table">
          <thead>
            <tr>
              <th>Commune</th>
              <th>Priority Score</th>
              <th>FRP (MW)</th>
              <th>Pop. 30km</th>
              <th>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {data.zones.map((zone) => (
              <tr key={zone.commune}>
                <td style={{ fontWeight: 600 }}>{zone.commune}</td>
                <td>
                  <span className={`priority-badge ${getPriorityClass(zone.priority_score)}`}>
                    {zone.priority_score.toLocaleString()}
                  </span>
                </td>
                <td>{zone.frp.toLocaleString()}</td>
                <td>{zone.population_30km.toLocaleString()}</td>
                <td>{zone.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resources */}
      <div className="report-card">
        <h2>🚁 Resources Deployed</h2>
        <div className="kpi-row">
          <div className="kpi-item">
            <div className="label">Aircraft Deployed</div>
            <div className="value info">{data.resources.aircraft_deployed}</div>
          </div>
          <div className="kpi-item">
            <div className="label">Aircraft Available</div>
            <div className="value success">{data.resources.aircraft_available}</div>
          </div>
          <div className="kpi-item">
            <div className="label">Ground Crews</div>
            <div className="value warning">{data.resources.ground_crews_deployed}</div>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="report-card">
        <h2>🤖 AI Analysis</h2>
        <div className="ai-summary">
          <div className="ai-badge">🤖 AI Generated · Agent_Wildfire</div>
          <div style={{ whiteSpace: "pre-line" }}>{data.aiSummary}</div>
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 12 }}>
          Generated by Fabric AI Skill querying DispatchResults in real-time KQL.
        </p>
      </div>

      {/* Export actions */}
      <div className="export-bar">
        <button className="btn btn-primary" onClick={handleExportPDF} disabled={generating}>
          {generating ? "⏳ Generating..." : "📄 Export PDF"}
        </button>
        <button className="btn btn-info" onClick={handleShareTeams}>
          📨 Share to Teams
        </button>
        <button className="btn btn-secondary" onClick={() => window.print()}>
          🖨️ Print
        </button>
      </div>
    </div>
  );
}
