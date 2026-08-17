import { useState, useEffect, useCallback } from "react";
import { KPI_SUMMARY, ACTIVE_FIRES, FIRE_LOCATIONS } from "../queries";
import { FireMap } from "../components/FireMap";
import { PriorityTable } from "../components/PriorityTable";
import { KPICard } from "../components/KPICard";
import type { KPISummary, FireZone } from "../types";

export function CommandCenter() {
  const [kpis, setKpis] = useState<KPISummary | null>(null);
  const [fires, setFires] = useState<FireZone[]>([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchData = useCallback(async () => {
    try {
      // In production, these use Rayfin's useQuery hook with the Kusto datasource
      // For now, we show mock data that matches the demo scenario
      setKpis({
        active_zones: 8,
        total_frp: 2710,
        population_at_risk: 609000,
        critical_count: 3,
        max_priority: 2490,
      });

      setFires([
        { commune: "Toulon", priority_score: 2490, frp: 340, population_30km: 215000, recommendation: "SOL + AÉRIEN", latitude: 43.12, longitude: 5.93 },
        { commune: "Fontainebleau", priority_score: 2130, frp: 280, population_30km: 185000, recommendation: "SOL + AÉRIEN", latitude: 48.40, longitude: 2.70 },
        { commune: "Bormes-les-Mimosas", priority_score: 1864, frp: 1110, population_30km: 75400, recommendation: "SOL + AÉRIEN", latitude: 43.15, longitude: 6.34 },
        { commune: "Fréjus", priority_score: 1140, frp: 720, population_30km: 42000, recommendation: "SOL + AÉRIEN", latitude: 43.43, longitude: 6.74 },
        { commune: "Nemours", priority_score: 670, frp: 150, population_30km: 52000, recommendation: "SOL + AÉRIEN", latitude: 48.27, longitude: 2.70 },
        { commune: "Melun", priority_score: 345, frp: 65, population_30km: 28000, recommendation: "SOL", latitude: 48.54, longitude: 2.66 },
        { commune: "Draguignan", priority_score: 180, frp: 95, population_30km: 8500, recommendation: "AÉRIEN", latitude: 43.54, longitude: 6.47 },
        { commune: "Collobrières", priority_score: 77, frp: 45, population_30km: 3200, recommendation: "SOL", latitude: 43.24, longitude: 6.31 },
      ]);

      setLastRefresh(new Date());
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div>
      <div className="kpi-row">
        <KPICard label="Active Fire Zones" value={kpis?.active_zones ?? "—"} className="danger" sub="▲ 3 new in last hour" />
        <KPICard label="Total FRP (MW)" value={kpis?.total_frp?.toLocaleString() ?? "—"} className="warning" />
        <KPICard label="Population at Risk" value={kpis ? `${Math.round(kpis.population_at_risk / 1000)}K` : "—"} className="accent" />
        <KPICard label="Critical Zones" value={kpis?.critical_count ?? "—"} className="danger" sub="Score > 2000" />
      </div>

      <div className="split-view">
        <div className="panel">
          <div className="panel-header">🗺️ Live Fire Map</div>
          <div className="panel-body">
            <FireMap fires={fires} />
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            🎯 Dispatch Priority
            <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#95a5a6" }}>
              Last refresh: {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
          <div className="panel-body">
            <PriorityTable fires={fires} />
          </div>
        </div>
      </div>
    </div>
  );
}
