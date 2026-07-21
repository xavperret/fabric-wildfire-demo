# Demo Script — Fabric Wildfire Response (~8 minutes)

The on-stage walkthrough. It follows the storyboard exactly. Keep the French demo terms — the audience is French and the whole point lands better in the operational vocabulary (*feux*, *foyer*, *moyens*, *SDIS*, *Canadair*).

**Owner:** Xavier Perret — GBB Data Platform, France.
**Total time:** ~8 minutes. **Golden rule:** if anything is not live, switch to **Plan B** (replay + simulated feeds + scenarized injection) — never debug on stage.

---

## Pre-demo checklist (do this before you walk up)

- [ ] Workspace open, capacity **running** (not paused).
- [ ] Ingestion notebooks **scheduled and green** (last run < 5 min ago); `FireDetections`, `AircraftPositions`, `FirefighterUnits` have recent rows.
- [ ] **Real-Time Dashboard** open on the Azure Maps tile; it shows Sud-Est fires. Azure Maps key valid (tile not blank).
- [ ] **Data Agent** open in a second tab; the three sample questions **pre-tested** and answering correctly.
- [ ] **Activator** enabled; threshold set so the **scenarized injection will exceed it** (e.g. ≥ 80) and the target zone is **unassigned**.
- [ ] **Teams** channel that receives the alert visible on screen (or mirrored).
- [ ] **Companion Leaflet map** (`map/index.html`) served over `http://` in a tab, in case the dashboard map misbehaves (Plan B for the zoom beat).
- [ ] **Injection** ready: the notebook cell / script that inserts a hot fire near **Bormes-les-Mimosas** (`frp` ~85, unassigned) is loaded and one click away.
- [ ] Network/tethering backup ready.

---

## The walkthrough

### 1 — Carte live des feux du Sud (≈1 min)
Open on the **Real-Time Dashboard**. Point at the **Azure Maps** tile: red points are active fires across the Sud-Est, **sized by FRP** (fire radiative power) and **colored by priority**.
> Say: *“Voici les feux actifs dans le Sud-Est, en quasi temps réel — données satellite NASA FIRMS. Plus le point est gros, plus le foyer est intense.”*

### 2 — Le problème : 4 silos isolés (≈1 min)
Step back from the map. Name the four silos and that today they don’t talk to each other:
- **Les feux** (satellite / FIRMS),
- **Les avions** (OpenSky — Canadair *PELICAN*, Dash-8 *MILAN*, hélicos *DRAGON*),
- **Les moyens au sol** (unités **SDIS** — simulées ici),
- **Les enjeux** (population et habitat — INSEE/IGN).
> Say: *“Quatre sources, quatre systèmes, zéro lien. Aujourd’hui, croiser tout ça, c’est une réunion. Et un feu n’attend pas une réunion.”*

### 3 — L’ontologie les unifie (Fabric IQ) (≈1 min 30)
Open the **Digital Twin Builder** ontology. Show the entities (**FireZone, Aircraft, FirefighterUnit, PopulatedArea/Commune, CriticalInfrastructure**) and traverse a relationship live: from a **FireZone**, follow **THREATENS** to the communes at risk, **ASSIGNED_TO** to aircraft, **COVERS** to units.
> Say: *“Fabric IQ relie les quatre silos en un seul modèle sémantique. Un foyer ‘sait’ désormais quelles communes il menace, quels moyens le couvrent, quelles infrastructures sont à côté.”*

### 4 — Le Data Agent répond en langage naturel (≈2 min)
Switch to the **Data Agent**. Type these **exactly**, one at a time, and read the answers:

1. **`Quels feux menacent une zone habitée sans moyen assigné ?`**
   → expect a short list of fire zones flagged `THREATENS` a populated area with no `ASSIGNED_TO`/`COVERS`.
2. **`Quel est le foyer prioritaire dans le Var et pourquoi ?`**
   → expect the top `priority_score` zone with its **reasons** (FRP, densité, proximité habitat, distance au moyen le plus proche).
3. **`Quel Canadair est le plus proche du foyer de Bormes ?`**
   → expect the nearest `PELICAN` by geodesic distance.

> Say: *“Aucune requête, aucune jointure. On interroge les quatre silos d’un coup, en français, et l’agent explique son raisonnement.”*

### 5 — Un foyer chaud arrive → alerte → la carte zoome (≈1 min 30) — **the money moment**
Trigger the hot fire: **either** wait for a real satellite pass **or** (recommended) run the **scenarized injection** — insert the `frp ~85`, unassigned fire near **Bormes-les-Mimosas**.
- The **Activator** rule (`priority_score ≥ threshold` **AND** unassigned) fires.
- A **Teams alert** appears with the recommendation, e.g. *“Foyer prioritaire Bormes-les-Mimosas — reco : PELICAN 32 + SDIS 83.”*
- The **map zooms to the départ de feu**: the Azure Maps tile recenters on the ignition point — or click **“🔥 Simuler une alerte”** on the Leaflet map to `flyTo` the hottest fire and open its popup (commune menacée + reco).

> Say: *“Un foyer chaud apparaît. L’Activator déclenche seul, pousse une alerte Teams avec une reco de dispatch concrète — et la carte zoome directement sur le départ de feu.”*

### 6 — La priorité est pilotée par la densité d’habitation (≈45 s)
Back to the ranked view. Contrast two fires of **similar FRP**: the one **near housing** outranks the remote one. Show the driver.
> Say: *“Ce n’est pas le feu le plus gros qui gagne, c’est le plus dangereux : ici la densité d’habitation fait monter la priorité.”*

### 7 — Clôture : décloisonnement → dispatch en secondes (≈30 s)
> Say: *“On est passé de quatre silos isolés à une décision de dispatch en quelques secondes. Le décloisonnement des données, c’est du temps gagné — et sur un feu, le temps, c’est tout.”*

---

## Plan B (if no live fire / no aircraft)

- **No recent fire on the map?** Use a **replay** of a recent window, or lead with the **scenarized injection** earlier (step 1 can run on injected data).
- **No aircraft in OpenSky?** Switch the aircraft feed to **simulated** (labeled) — the *PELICAN/MILAN/DRAGON* callsigns are already in the sample data.
- **Dashboard map flaky / Azure Maps key issue?** Do the zoom beat on the **companion Leaflet map** (`map/index.html`, served over `http://`) with the **“🔥 Simuler une alerte”** button — it is tenant-independent and always works.
- **Activator slow to fire?** Lower the threshold before the talk, or trigger the injection 20–30 s earlier so the alert lands on cue.
- **Data Agent gives an odd answer?** Fall back to the three **pre-tested** questions only, in the order above.

*Never troubleshoot live — announce “passons à la démo scénarisée” and continue with Plan B.*
