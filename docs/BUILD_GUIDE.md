# Build Guide — Fabric Wildfire Response Demo

This is the step-by-step guide to build the demo from an empty tenant to a full end-to-end run. It follows the same **phases 0 → 7** as the project. Each phase states its **objective**, **concrete numbered steps**, the **notebooks/KQL** used, and the **expected result**.

> Convention: “portal” = the Fabric web experience (`app.fabric.microsoft.com`). Where an asset can also be authored in VS Code, that path is noted. Fill your keys in `config/parameters.json` (copied from `config/parameters.example.json`) before you start — it is git-ignored.

---

## Phase 0 — Socle (capacity, workspace, keys)

**Objective.** Have a working Fabric workspace with Real-Time Intelligence enabled and all three external keys in hand.

**Steps.**
1. Ensure a **Fabric capacity** (F2+ or a trial) is assigned to your tenant and that the **Real-Time Intelligence** workload is available.
2. Create a **Workspace** (e.g. `Wildfire-Response-Demo`) and bind it to this GitHub repo via **Workspace settings → Git integration** (branch = `main`, folder = repo root). This gives you two-way sync for notebooks, KQL and the other items.
3. Obtain the keys and record them in `config/parameters.json`:
   - **FIRMS `MAP_KEY`** — request a free key from the NASA FIRMS API portal.
   - **OpenSky OAuth2 client** — create a client (id + secret) in your OpenSky account.
   - **Azure Maps** — create an Azure Maps account and copy its primary key.
4. Confirm you can create these item types in the workspace: Lakehouse, Eventhouse, Eventstream, Digital Twin Builder, Data Agent, Activator, Real-Time Dashboard.

**Expected result.** An empty, Git-connected workspace on a capacity with RTI, and a filled-in (local, git-ignored) `parameters.json`.

---

## Phase 1 — Feux (FIRMS → Eventhouse; first map)

**Objective.** Ingest live fire detections into the Eventhouse and see the first fires on a map.

**Uses.** `notebooks/01_ingest_firms_fire_detections.ipynb`, `kql/01_setup_eventhouse.kql`.

**Steps.**
1. **Create the Lakehouse** (`WildfireLakehouse`) — it will hold reference data later and can stage raw pulls.
2. **Create the Eventhouse** (`WildfireEventhouse`); a KQL database is created inside it. Open a KQL queryset.
3. **Create the hot tables.** Run `kql/01_setup_eventhouse.kql` in the queryset. It defines the tables `FireDetections`, `AircraftPositions`, `FirefighterUnits` and their ingestion mappings.
4. **Import the ingestion notebook.** Either use the **Fabric Data Engineering VS Code extension** (open the workspace, edit locally) or, in the portal, **Data Engineering → Import notebook** and pick `notebooks/01_ingest_firms_fire_detections.ipynb`.
5. **Parameterize it.** The notebook reads the FIRMS `MAP_KEY`, the France bbox `-5,41,10,51.5` and the sensor (`VIIRS_SNPP_NRT` / MODIS). Point secret reads at a Key Vault or the `parameters.json` you loaded.
6. **Run it once** interactively. It pulls the FIRMS CSV, keeps `latitude, longitude, frp, acq_datetime, sensor`, and writes to `FireDetections` (directly, or via the Eventstream once Phase set up).
7. **Schedule it.** In the notebook’s **Schedule** (or wrap it in a **Data Factory pipeline**) run **every 2–5 minutes**.
8. **First map (sanity check).** Open the companion `map/index.html` locally, or add a quick map tile in a dashboard later. At this stage the goal is just to confirm points land.

**Expected result.** `FireDetections` fills on a schedule with recent Sud-Est fires; you can `take 100` and see non-null `frp`.

---

## Phase 2 — Avions + référentiels (OpenSky + reference data)

**Objective.** Add live aircraft and the curated population/infrastructure reference data.

**Uses.** `notebooks/02_ingest_opensky_aircraft.ipynb`, `notebooks/03_simulate_firefighter_units.ipynb`, `notebooks/04_load_reference_data.ipynb`.

**Steps.**
1. **OpenSky ingestion.** Import and parameterize `02_ingest_opensky_aircraft.ipynb`. It does the **OAuth2 client-credentials** flow, calls `/states/all` over the France bbox, filters Sécurité Civile callsigns (`PELICAN*`, `MILAN*`, `DRAGON*`), and writes to `AircraftPositions`. Schedule it every **2–5 minutes**.
2. **Simulated units.** Run `03_simulate_firefighter_units.ipynb`. It **generates SDIS units** (id, home base, lat/lon, status available/engaged) around the Var/Bouches-du-Rhône and writes to `FirefighterUnits`. This feed is **simulated and labeled** (no public API).
3. **Reference data.** Run `04_load_reference_data.ipynb`. It loads the curated **INSEE/IGN** subset (communes with population/housing density, critical infrastructure points) into **Lakehouse** Delta tables (`Communes`, `CriticalInfrastructure`).
4. Verify each table with a quick `take`/preview.

**Expected result.** Three hot tables live in the Eventhouse (`FireDetections`, `AircraftPositions`, `FirefighterUnits`) and reference tables sit in the Lakehouse.

---

## Phase 3 — Ontologie (Digital Twin Builder)

**Objective.** Unify the four silos into one semantic model — the **Fabric IQ** ontology.

**Uses.** Eventhouse tables + Lakehouse reference tables. Authored in the portal (Digital Twin Builder designer), version-controlled via Git.

**Steps.**
1. **Create the Digital Twin Builder item** in the workspace (e.g. `WildfireOntology`).
2. **Define the entities** and their key properties:
   - **FireZone** — id, latitude, longitude, `frp`, first/last seen, `priority_score`, `assigned` (bool).
   - **Aircraft** — callsign, type (Canadair/Dash-8/helicopter), latitude, longitude, altitude, status.
   - **FirefighterUnit** — unit_id, base, latitude, longitude, status (available/engaged).
   - **PopulatedArea / Commune** — insee code, name, population, housing/density.
   - **CriticalInfrastructure** — id, type, latitude, longitude.
3. **Map source tables to entities.** Bind each entity to its backing table: `FireDetections`→FireZone (aggregate detections into zones), `AircraftPositions`→Aircraft, `FirefighterUnits`→FirefighterUnit, Lakehouse `Communes`→PopulatedArea, `CriticalInfrastructure`→CriticalInfrastructure. Map property → column for each.
4. **Define the relationships** (from the spec):
   - **FireZone → THREATENS → PopulatedArea**
   - **Aircraft → ASSIGNED_TO → FireZone**
   - **FirefighterUnit → COVERS → Commune**
   - **FireZone → NEAR → CriticalInfrastructure**
   Where a relationship is spatial (THREATENS, NEAR), back it with the geospatial predicates from Phase 4 (distance / point-in-polygon) so it is computed, not hand-entered.
5. **Publish** the ontology and confirm you can browse entities and traverse relationships in the designer.

**Expected result.** One navigable ontology where, starting from a FireZone, you can reach the communes it threatens, the aircraft assigned to it, the units covering those communes and the infrastructure nearby.

> Digital Twin Builder is a **preview** capability — expect the designer and APIs to evolve.

---

## Phase 4 — Dispatch (geospatial KQL)

**Objective.** Score each fire by real risk and produce a dispatch recommendation.

**Uses.** `kql/02_dispatch_logic.kql`.

**Steps.**
1. Open `kql/02_dispatch_logic.kql` in the Eventhouse queryset (or the Kusto VS Code extension).
2. Understand the geospatial building blocks it uses:
   - `geo_point_to_s2cell()` — cluster raw detections into **FireZones** (dedupe multiple pixels of the same fire).
   - `geo_distance_2points()` — geodesic distance to the **nearest available** unit/aircraft and to water for aircraft suitability.
   - `geo_point_in_polygon()` — whether a fire falls inside a commune/urban polygon (population exposure).
3. Review the **priority score**: `priority_score = f(FRP, population density within 5 km, buildings/infrastructure proximity, − distance to nearest resource)`. Higher FRP, denser population, closer structures and closer-but-not-yet-assigned resources raise the score.
4. Review the **dispatch rule**:
   - **large / remote / near water →** aircraft (Canadair/Dash-8).
   - **near housing / structural →** ground **SDIS**.
   - **high FWI + dense + unassigned →** combined air+ground **and** maximum priority.
5. **Run it** and confirm it returns, per fire zone: `priority_score`, the recommended resource, and the nearest candidates (e.g. `PELICAN 32 + SDIS 83`).

**Expected result.** A ranked table of fire zones with a concrete, explainable recommendation per zone.

---

## Phase 5 — Data Agent (natural language)

**Objective.** Ask the unified model questions in plain French.

**Uses.** The Eventhouse + the Digital Twin Builder ontology.

**Steps.**
1. **Create a Data Agent** in the workspace.
2. **Ground it** on the Eventhouse (KQL DB) and the ontology so it can traverse relationships, not just single tables.
3. **Add guidance/examples** — provide the sample questions and expected shapes so answers are stable on stage:
   - *“Quels feux menacent une zone habitée sans moyen assigné ?”*
   - *“Quel est le foyer prioritaire dans le Var et pourquoi ?”*
   - *“Quel Canadair est le plus proche du foyer de Bormes ?”*
4. **Test** each question and verify the agent explains its reasoning (e.g. cites the priority drivers).

**Expected result.** The Data Agent answers cross-silo questions correctly and reproducibly.

---

## Phase 6 — Alerting (Activator → Teams)

**Objective.** Turn a threshold breach into an automatic Teams alert carrying the dispatch recommendation.

**Uses.** `kql/03_activator_source.kql`.

**Steps.**
1. `kql/03_activator_source.kql` is the query that surfaces, continuously, fire zones with their `priority_score`, `assigned` flag and recommended resource. Run it once to confirm the shape.
2. **Create an Activator** and point it at that source (from the KQL queryset, use **Set alert**, or attach the Eventstream/KQL as the Activator’s source).
3. **Define the rule:** trigger when **`priority_score ≥ threshold` AND the zone is unassigned** (`assigned == false`). Pick a threshold that a scenarized injection will clearly exceed (e.g. ≥ 80).
4. **Define the action:** send a **Teams message** (and/or email) whose body includes the commune, the FRP/priority and the **dispatch recommendation** string (e.g. *“Foyer prioritaire Bormes-les-Mimosas — reco: PELICAN 32 + SDIS 83”*).
5. **Rate-limit / dedupe** so one fire does not spam (e.g. one alert per zone per N minutes).
6. **Test** by lowering the threshold or injecting a hot fire (see Phase 7) and confirm the Teams alert arrives with the reco.

**Expected result.** A hot, unassigned fire produces exactly one Teams alert containing an actionable recommendation.

---

## Phase 7 — Polish (dashboard + demo script + scenarized injection)

**Objective.** A stage-ready Real-Time Dashboard, the map-zoom beat, and a reliable way to trigger the story.

**Uses.** Real-Time Dashboard + Azure Maps, `map/index.html`, `docs/DEMO_SCRIPT.md`.

**Steps.**
1. **Create a Real-Time Dashboard** in the workspace.
2. **Add an Azure Maps tile** bound to the fire-zone KQL (the Phase 4 query). Configure the map so points are **sized by `frp`** and **colored by `priority_score`** (e.g. green → red ramp). Paste your Azure Maps key in the tile settings.
3. Add supporting tiles: the ranked dispatch table, aircraft positions, and available units.
4. **Map zoom to the ignition point.** When the Activator fires, the alert carries the fire’s coordinates. Two ways to “zoom to the départ de feu”:
   - In the dashboard, use a parameter driven by the top-priority zone so the Azure Maps tile recenters on it; **or**
   - Use the **companion Leaflet map** (`map/index.html`) — click **“🔥 Simuler une alerte”** and it `flyTo`s the hottest fire (highest `frp`), opens the popup with the threatened commune + dispatch reco. This is the tenant-independent, always-works version of the beat.
5. **Scenarized injection.** Prepare a small script/notebook cell that inserts a **hot fire** (high `frp`, unassigned) near Bormes into `FireDetections`. This guarantees the Activator fires on cue even if no real satellite pass lands during the talk.
6. Rehearse with `docs/DEMO_SCRIPT.md`.

**Expected result.** A live dashboard with an Azure Maps fire layer, an alert that zooms the map to the ignition point, and a repeatable trigger.

---

## Companion Leaflet map (`map/index.html`)

- It is **tenant-independent**: no Fabric capacity, no key, no build step. It reads `map/sample_snapshot.geojson` from the same folder.
- Serve it over HTTP (e.g. `python -m http.server` in the `map/` folder) rather than opening it as `file://`, so the `fetch()` of the GeoJSON succeeds.
- Layers: **fires** (red circles sized by `frp`), **aircraft** (blue, labeled by callsign), **SDIS units** (green available / grey engaged).
- The **“🔥 Simuler une alerte”** button reproduces the map-zoom beat without depending on the live pipeline — ideal for **Plan B**.

---

## Réel vs Simulé

| Element | In the demo | Notes |
|---------|-------------|-------|
| Fire detections (FIRMS) | **Réel** (near-real-time) | Satellite passes → not continuous; replay/injection for timing. |
| FWI / EFFIS context | **Réel** (optional) | Credibility/context layer. |
| Aircraft (OpenSky) | **Réel si visible**, sinon **Simulé** | Depends on transponder coverage over the zone. |
| Firefighter / SDIS units | **Simulé** | No public real-time API; generated and labeled. |
| Population / housing (INSEE/IGN) | **Réel, curé** | Static curated subset for the demo. |
| The triggering hot fire | Often **Simulé (injection scénarisée)** | Guarantees the Activator fires on stage. |

---

## Troubleshooting

- **No fires appear.** FIRMS has no recent pass over the bbox; use a replay window or the scenarized injection. Confirm the `MAP_KEY` and bbox `-5,41,10,51.5`.
- **OpenSky returns nothing / 401.** Token expired or rate-limited; re-run the OAuth2 client-credentials step. Sécurité Civile aircraft may simply not be airborne — switch to simulated aircraft.
- **Activator never fires.** Threshold too high, or the zone is already `assigned`. Lower the threshold or inject an unassigned hot fire; check the Activator’s source query returns rows.
- **Teams alert has no recommendation.** The action template isn’t reading the reco field — confirm `03_activator_source.kql` outputs the recommendation string and the action body references it.
- **Azure Maps tile is blank.** Missing/invalid Azure Maps key, or the bound KQL returns no rows in the tile’s time window. Widen the window and re-check the key.
- **Leaflet map shows the load error.** You opened it as `file://`; serve it over `http://` so the GeoJSON `fetch()` is allowed.
- **Digital Twin Builder behaves unexpectedly.** It is **preview** — re-publish the ontology after schema changes, and re-check entity→table mappings.
- **Git sync conflicts.** Portal-authored items (ontology, Activator, dashboard) are serialized on save; commit from Fabric before editing the same item in VS Code to avoid divergence.
