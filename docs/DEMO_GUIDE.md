# 🔥 Fabric Wildfire Response — Demo Guide

## Overview

This demo shows how Microsoft Fabric unifies **satellite data, AI, and field coordination** for wildfire response in France. In 12 minutes you walk the audience through:

1. Real-time ingestion of NASA FIRMS satellite detections
2. A semantic ontology linking fires, population, aircraft, and ground crews (Fabric IQ)
3. A KQL dispatch algorithm (clustering + population + priority scoring)
4. Automatic Teams alerts via Activator
5. An interactive Leaflet map
6. A Real-Time Dashboard with Azure Maps
7. A conversational AI agent (AI Skill)

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌───────────────────┐
│  NASA FIRMS API │────▶│  Eventstream     │────▶│  Eventhouse (KQL) │
│  (satellites)   │     │  ES_Wildfire     │     │  EH_Wildfire      │
└─────────────────┘     └──────────────────┘     └─────────┬─────────┘
                                                            │
                        ┌───────────────────────────────────┼─────────────────┐
                        │                                   │                 │
                        ▼                                   ▼                 ▼
              ┌─────────────────┐              ┌────────────────┐   ┌────────────────┐
              │  Activator      │              │  RT Dashboard  │   │  AI Skill      │
              │  → Teams alert  │              │  (Azure Maps)  │   │  Agent_Wildfire │
              └─────────────────┘              └────────────────┘   └────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │  Leaflet Map    │
              │  (companion)    │
              └─────────────────┘
```

---

## Prerequisites

| Item | Details |
|------|---------|
| Fabric workspace | `Wildfire-Demo` with Trial or F64+ capacity |
| FIRMS key | Free at [firms.modaps.eosdis.nasa.gov](https://firms.modaps.eosdis.nasa.gov/api/) |
| Browser | Chrome / Edge for the Leaflet map |

---

## Demo scenario (12 min)

### Act 1 — The problem (2 min)

> *"Every summer France faces increasingly intense wildfires. SDIS fire departments must decide in minutes: send ground crews, air tankers, or both. Today we show them how Fabric helps."*

- Show the **Leaflet map** (full France view)
- Click **📍 Zoom Var** → 4 fires in the Maures massif
- Click **📍 Zoom Fontainebleau** → 3 fires in the national forest

### Act 2 — The ontology (1 min 30)

> *"Fabric IQ links the four silos into a single semantic model. A fire zone now 'knows' which towns it threatens, which assets cover it, and which critical infrastructure is nearby."*

- Open **Ontology_Wildfire** in the workspace (Digital Twin Builder)
- Show the 5 entity types: FireZone, Commune, Aircraft, FirefighterUnit, CriticalInfrastructure
- Traverse a relationship live: FireZone → THREATENS → communes at risk
- Show ASSIGNED_TO → aircraft, COVERS → SDIS units
- Visual support: [`docs/Ontology_Wildfire.pptx`](Ontology_Wildfire.pptx) (6 slides)

### Act 3 — The intelligence (3 min)

> *"Fabric ingests satellite detections every 10 minutes and automatically computes priorities."*

- Open the **Real-Time Dashboard** in Fabric
- Show the dispatch table: priority_score, threatened population, recommendation
- Highlight Toulon (score 2490 — 215k people within 30 km!)
- Highlight Fontainebleau (score 2130 — national forest + 185k people)

### Act 4 — The alert (2 min)

> *"When the score exceeds the threshold, Fabric fires a Teams alert instantly."*

- Show the **Activator** in the workspace → rule "frp > 50"
- Show the Teams notification received (or run "Test action")
- Click **🔥 Simulate alert** on the map → animated zoom to the hottest fire

### Act 5 — The AI agent (3 min)

> *"What if the crisis coordinator could simply ask questions in plain language?"*

- Open **Agent_Wildfire** (AI Skill)
- Ask: *"What are the most critical fires?"*
- Ask: *"Compare the situation in Var vs Île-de-France"*
- Ask: *"For Fontainebleau, what is your operational recommendation?"*

### Conclusion

> *"All of this on ONE platform: Fabric. Satellite data, real-time KQL, alerts, dashboards, AI — a single workspace."*

---

## Running the Leaflet map

```bash
cd map
python -m http.server 8080
# Open http://localhost:8080
```

**Buttons:**
- 🔥 **Simulate alert** → animated zoom to the most intense fire (max FRP)
- 📍 **Zoom Var** → Bormes / Hyères / La Londe region
- 📍 **Zoom Fontainebleau** → national forest / Nemours / Melun

---

## Notebooks (execution order)

| # | Notebook | Purpose |
|---|----------|---------|
| 01 | `01_ingest_firms.ipynb` | Fetch FIRMS satellite detections |
| 02 | `02_ingest_opensky.ipynb` | Fetch aircraft positions (optional) |
| 03 | `03_dispatch_logic.ipynb` | Run KQL dispatch logic |
| 04 | `04_load_reference_data.ipynb` | Load communes + critical infrastructure |
| 05 | `05_inject_demo_fire.ipynb` | Inject a demo fire into the Eventstream |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Empty map | Serve via `python -m http.server`, not `file://` |
| 0 results in dashboard | Remove the `ingestion_time() > ago(6h)` filter |
| Agent not responding | Verify `DispatchResults` is added as a data source |
| Activator not firing | Check Object ID = `detection_id` in the trigger rule |
| KQL "column not found" | Use `| getschema` to inspect actual column names |
