import type { FireZone } from "../types";

interface Props {
  fires: FireZone[];
}

function getBadgeClass(score: number): string {
  if (score > 2000) return "badge-critical";
  if (score > 1000) return "badge-high";
  if (score > 500) return "badge-medium";
  return "badge-low";
}

export function PriorityTable({ fires }: Props) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Commune</th>
          <th>Priority</th>
          <th>FRP</th>
          <th>Pop 30km</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {fires.map((fire) => (
          <tr key={fire.commune}>
            <td style={{ fontWeight: 600 }}>{fire.commune}</td>
            <td>
              <span className={`badge ${getBadgeClass(fire.priority_score)}`}>
                {fire.priority_score.toLocaleString()}
              </span>
            </td>
            <td>{fire.frp}</td>
            <td>{fire.population_30km.toLocaleString()}</td>
            <td>
              <span className={`badge ${fire.recommendation.includes("AÉRIEN") ? "badge-high" : "badge-low"}`}>
                {fire.recommendation}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
