# 📋 Wildfire SitRep — Rayfin App

Situation Report generator for prefects and crisis coordinators.

## Features

| Page | Purpose |
|------|---------|
| **Generate SitRep** | One-click situation report with KPIs, zones, resources, AI summary |
| **History** | Browse and re-export previously generated reports |

## Architecture

```
Eventhouse (KQL) → Rayfin Backend → React Frontend
                                    ├── KPI Overview
AI Skill (Agent_Wildfire) ─────────→├── AI Analysis
                                    ├── Zone Priority Table
                                    └── Export (PDF / Teams / Print)
```

## Getting Started

```bash
cd rayfin-sitrep
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
| `AI_SKILL_ID` | Fabric AI Skill ID (Agent_Wildfire) |

## Export Formats

- **PDF** — via jspdf + html2canvas, auto-downloads
- **Teams** — Posts adaptive card to configured webhook
- **Print** — CSS print-optimized layout (hides nav)

## AI Summary

The app calls the Fabric AI Skill REST API:
```
POST /v1/workspaces/{id}/ai-skills/{id}/chat
{ "message": "Summarize the current wildfire situation for a prefect briefing" }
```

The AI agent queries KQL in real-time and produces an operational French-language analysis.
