import { useState } from "react";
import type { FireZone, Unit } from "../types";

const MOCK_UNITS: Unit[] = [
  { unit_id: "1", unit_name: "DRAGON83", unit_type: "helicopter", status: "available", base_latitude: 43.1, base_longitude: 6.1 },
  { unit_id: "2", unit_name: "PELICAN32", unit_type: "canadair", status: "deployed", base_latitude: 43.5, base_longitude: 5.2, current_assignment: "Toulon" },
  { unit_id: "3", unit_name: "PELICAN44", unit_type: "canadair", status: "available", base_latitude: 48.5, base_longitude: 2.6 },
  { unit_id: "4", unit_name: "SDIS83-Alpha", unit_type: "ground_crew", status: "available", base_latitude: 43.2, base_longitude: 6.0 },
  { unit_id: "5", unit_name: "SDIS83-Bravo", unit_type: "ground_crew", status: "deployed", base_latitude: 43.3, base_longitude: 6.2, current_assignment: "Bormes" },
  { unit_id: "6", unit_name: "SDIS77-Alpha", unit_type: "ground_crew", status: "available", base_latitude: 48.4, base_longitude: 2.7 },
  { unit_id: "7", unit_name: "DASH-01", unit_type: "dash_aircraft", status: "available", base_latitude: 43.6, base_longitude: 5.1 },
  { unit_id: "8", unit_name: "SDIS13-Charlie", unit_type: "ground_crew", status: "available", base_latitude: 43.3, base_longitude: 5.4 },
];

const FIRE_ZONES: FireZone[] = [
  { commune: "Toulon", priority_score: 2490, frp: 340, population_30km: 215000, recommendation: "SOL + AÉRIEN", latitude: 43.12, longitude: 5.93 },
  { commune: "Fontainebleau", priority_score: 2130, frp: 280, population_30km: 185000, recommendation: "SOL + AÉRIEN", latitude: 48.40, longitude: 2.70 },
  { commune: "Bormes-les-Mimosas", priority_score: 1864, frp: 1110, population_30km: 75400, recommendation: "SOL + AÉRIEN", latitude: 43.15, longitude: 6.34 },
];

const UNIT_ICONS: Record<string, string> = {
  helicopter: "🚁",
  canadair: "✈️",
  ground_crew: "🚒",
  dash_aircraft: "🛩️",
};

export function Dispatch() {
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});

  const assignUnit = (unitId: string, zone: string) => {
    setAssignments((prev) => ({
      ...prev,
      [zone]: [...(prev[zone] || []), unitId],
    }));
  };

  return (
    <div className="dispatch-grid">
      <div className="panel">
        <div className="panel-header">🚒 Available Units</div>
        <div className="panel-body">
          <ul className="unit-list">
            {MOCK_UNITS.map((unit) => (
              <li key={unit.unit_id} className="unit-item">
                <span className="unit-icon">{UNIT_ICONS[unit.unit_type] || "📍"}</span>
                <div className="unit-info">
                  <div className="unit-name">{unit.unit_name}</div>
                  <div className="unit-type">{unit.unit_type.replace("_", " ")}</div>
                </div>
                <span className={`unit-status status-${unit.status}`}>
                  {unit.status === "deployed" ? `→ ${unit.current_assignment}` : "Available"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">🎯 Fire Zones — Assign Resources</div>
        <div className="panel-body" style={{ padding: 16 }}>
          {FIRE_ZONES.map((zone) => (
            <div key={zone.commune} style={{
              background: "var(--surface-hover)",
              borderRadius: 10,
              padding: 16,
              marginBottom: 12,
              borderLeft: `4px solid ${zone.priority_score > 2000 ? "var(--danger)" : "var(--warning)"}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>{zone.commune}</strong>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>
                    Score: {zone.priority_score} · FRP: {zone.frp} · Pop: {zone.population_30km.toLocaleString()}
                  </div>
                </div>
                <span className={`badge ${zone.priority_score > 2000 ? "badge-critical" : "badge-high"}`}>
                  {zone.recommendation}
                </span>
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {MOCK_UNITS.filter((u) => u.status === "available").map((unit) => (
                  <button
                    key={unit.unit_id}
                    className="btn btn-outline"
                    onClick={() => assignUnit(unit.unit_id, zone.commune)}
                    style={{ fontSize: "0.75rem" }}
                  >
                    + {UNIT_ICONS[unit.unit_type]} {unit.unit_name}
                  </button>
                ))}
              </div>
              {assignments[zone.commune]?.length > 0 && (
                <div style={{ marginTop: 8, fontSize: "0.8rem", color: "var(--success)" }}>
                  ✓ Assigned: {assignments[zone.commune].map((id) => MOCK_UNITS.find((u) => u.unit_id === id)?.unit_name).join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
