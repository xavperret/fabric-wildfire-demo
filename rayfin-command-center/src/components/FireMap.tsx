import type { FireZone } from "../types";

interface Props {
  fires: FireZone[];
}

export function FireMap({ fires }: Props) {
  // In production, this renders a Leaflet map connected to the Eventhouse data.
  // The map shows fire markers sized by FRP, aircraft triangles, and SDIS unit squares.
  // For the demo scaffold, we show a placeholder that documents the integration.
  return (
    <div className="map-container">
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>🗺️</div>
        <p style={{ marginBottom: 12 }}>
          <strong>Leaflet + Azure Maps</strong>
        </p>
        <p style={{ fontSize: "0.8rem", lineHeight: 1.6 }}>
          This map renders fire detections from the <code>FIRMSDetections</code> KQL table
          as sized circles (FRP = radius), aircraft as blue triangles, and SDIS units as green squares.
        </p>
        <p style={{ fontSize: "0.8rem", marginTop: 12, color: "#3498db" }}>
          {fires.length} active fire zones loaded
        </p>
        <p style={{ fontSize: "0.7rem", marginTop: 16, color: "#555" }}>
          Connect with: <code>npm run dev</code> after <code>npx rayfin login</code>
        </p>
      </div>
    </div>
  );
}
