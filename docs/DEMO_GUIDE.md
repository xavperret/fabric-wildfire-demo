# 🔥 Fabric Wildfire Response — Guide de démo

## Vue d'ensemble

Cette démo illustre comment Microsoft Fabric unifie **données satellite, IA et coordination terrain** pour la réponse aux feux de forêt en France. En 10 minutes, vous montrez :

1. Ingestion de données FIRMS (NASA) en temps réel
2. Algorithme de dispatch KQL (clustering + population + priorisation)
3. Alerte Teams automatique via Activator
4. Carte interactive Leaflet
5. Dashboard Real-Time avec Azure Maps
6. Agent IA conversationnel (AI Skill)

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
              │  Carte Leaflet  │
              │  (companion)    │
              └─────────────────┘
```

---

## Pré-requis

| Élément | Détail |
|---------|--------|
| Workspace Fabric | `Wildfire-Demo` avec capacité Trial ou F64+ |
| Clé FIRMS | Gratuite sur [firms.modaps.eosdis.nasa.gov](https://firms.modaps.eosdis.nasa.gov/api/) |
| Navigateur | Chrome / Edge pour la carte Leaflet |

---

## Scénario de démo (10 min)

### Acte 1 — Le problème (2 min)

> *"Chaque été, la France fait face à des feux de forêt de plus en plus intenses. Les SDIS doivent décider en quelques minutes : envoyer du terrestre, de l'aérien, ou les deux. Aujourd'hui, on leur montre comment Fabric les aide."*

- Montrez la **carte Leaflet** (vue France entière)
- Cliquez **📍 Zoom Var** → 4 feux dans le massif des Maures
- Cliquez **📍 Zoom Fontainebleau** → 3 feux en forêt domaniale

### Acte 2 — L'intelligence (3 min)

> *"Fabric ingère les détections satellite toutes les 10 min et calcule automatiquement les priorités."*

- Ouvrez le **Real-Time Dashboard** dans Fabric
- Montrez le tableau de dispatch : priority_score, population menacée, recommandation
- Pointez Toulon (score 2490 — 215k habitants à 30km !)
- Pointez Fontainebleau (score 2130 — forêt domaniale + 185k habitants)

### Acte 3 — L'alerte (2 min)

> *"Quand le score dépasse le seuil, Fabric déclenche une alerte Teams instantanément."*

- Montrez l'**Activator** dans le workspace → règle "frp > 50"
- Montrez la notification Teams reçue (ou faites un "Test action")
- Cliquez **🔥 Simuler une alerte** sur la carte → zoom animé sur le feu le plus chaud

### Acte 4 — L'agent IA (3 min)

> *"Et si le coordinateur pouvait simplement poser des questions en français ?"*

- Ouvrez **Agent_Wildfire** (AI Skill)
- Posez : *"Quels sont les feux les plus critiques ?"*
- Posez : *"Compare la situation Var vs Île-de-France"*
- Posez : *"Pour Fontainebleau, quelle est ta recommandation ?"*

### Conclusion

> *"Tout ça avec UNE plateforme : Fabric. Données satellite, KQL en temps réel, alertes, dashboards, IA — un seul workspace."*

---

## Lancer la carte Leaflet

```bash
cd map
python -m http.server 8080
# Ouvrir http://localhost:8080
```

**Boutons :**
- 🔥 **Simuler une alerte** → zoom animé sur le feu le plus intense (FRP max)
- 📍 **Zoom Var** → région Bormes / Hyères / La Londe
- 📍 **Zoom Fontainebleau** → forêt domaniale / Nemours / Melun

---

## Notebooks (ordre d'exécution)

| # | Notebook | Rôle |
|---|----------|------|
| 01 | `01_ingest_firms.ipynb` | Récupère les détections satellite FIRMS |
| 02 | `02_ingest_opensky.ipynb` | Récupère les positions aéronefs (optionnel) |
| 03 | `03_dispatch_logic.ipynb` | Exécute la logique de dispatch KQL |
| 04 | `04_load_reference_data.ipynb` | Charge communes + infra critiques |
| 05 | `05_inject_demo_fire.ipynb` | Injecte un feu de démo dans l'Eventstream |

---

## Identifiants du workspace

| Item | ID |
|------|-----|
| Workspace | `96a844c1-e64e-491b-b536-d3846330d598` |
| Lakehouse | `1045edcf-6fe1-4788-a552-1dfea509812b` |
| Eventhouse | `28cef4a6-18bd-414f-8b41-907e4d4a752a` |
| KQL Database | `8eae510f-f9e7-4c8c-bd2b-4f6ef45e4709` |
| Eventstream | `98c25341-a09c-4450-9732-864e34320284` |
| Query URI | `https://trd-vhu31241kdu6ebwvx7.z0.kusto.fabric.microsoft.com` |

---

## Troubleshooting

| Problème | Solution |
|----------|----------|
| Carte vide | Lancez via `python -m http.server`, pas en `file://` |
| 0 résultats dans le dashboard | Retirez le filtre `ingestion_time() > ago(6h)` |
| Agent ne répond pas | Vérifiez que `DispatchResults` est ajouté comme source |
| Activator ne se déclenche pas | Vérifiez Object ID = `detection_id` dans la règle |
| KQL "column not found" | Utilisez `| getschema` pour voir les vrais noms de colonnes |
