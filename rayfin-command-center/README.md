# 🔥 Wildfire Command Center — Rayfin App

Real-time operational command center for SDIS wildfire coordinators.

## Features

| Page | Purpose |
|------|---------|
| **Command Center** | Live fire map + dispatch priority table (auto-refresh 30s) |
| **Dispatch** | Assign aircraft and ground crews to fire zones |
| **Alerts** | Feed of Activator notifications with acknowledge actions |

## Architecture

```
Eventhouse (KQL) → Rayfin Backend → React Frontend
                                    ├── Fire Map (Leaflet)
                                    ├── Priority Table
                                    └── Unit Assignment
```

## Getting Started

```bash
cd rayfin-command-center
npx rayfin login            # Interactive Entra ID auth
npm install
npm run dev                 # Local dev server
```

## Deploy to Fabric

```bash
npm run deploy              # Publishes as Fabric item in your workspace
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `FABRIC_WORKSPACE_ID` | Target Fabric workspace ID |
| `EVENTHOUSE_CLUSTER` | Eventhouse KQL cluster URL |

## KQL Data Sources

- `DispatchResults` — Computed priority scores per commune
- `FIRMSDetections` — Raw satellite fire detections
- `AircraftPositions` — Real-time aircraft tracking
- `AvailableUnits` — SDIS ground crews and aircraft availability
- `AlertLog` — Activator alert history
