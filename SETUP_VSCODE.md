# Developing & deploying the demo from VS Code + GitHub Copilot

This guide shows how to build, run, and deploy the **Fabric Wildfire Response Demo** almost entirely from VS Code with GitHub Copilot — and which handful of items still need a few clicks in the Fabric portal. The demo/item names stay in French (`Wildfire-Demo`, `LH_Wildfire`, `EH_Wildfire`, `ES_Wildfire`); the instructions are in English.

## 0. What runs where

| Layer | Where you build it |
| --- | --- |
| Ingestion notebooks (`01`–`04`), dispatch KQL, injection notebook (`05`), companion map (`map/index.html`), Git / CI-CD | **Fully in VS Code** — author, run, and version everything locally against your capacity |
| Workspace + `LH_Wildfire` / `EH_Wildfire` / `ES_Wildfire`, Eventhouse (KQL) tables | **Scriptable** — created with the Fabric CLI (`fab`) and KQL scripts |
| Digital Twin Builder ontology, Real-Time Dashboard (+ Azure Maps tile), Activator alert, Data Agent | **Portal-only but Git-syncable** — built once in the Fabric portal, then committed to the repo via Git integration |

**Net:** ~60% of the demo is code-first (notebooks, KQL, map, provisioning, deployment, versioning). Only **4 items** are portal clicks, done once, and even those are versioned once Git integration is connected.

## 1. Install once

Install these VS Code extensions:

- **Fabric Data Engineering** — author and run Fabric notebooks against your capacity
- **Kusto (KQL)** — run the Eventhouse KQL against `EH_Wildfire`
- **GitHub Copilot** + **Copilot Chat** — let Copilot write the notebook/KQL code
- **Python** — run and debug the deployment scripts
- **GitHub Pull Requests** — manage the repo and PRs

Then install the CLI tooling and sign in:

```bash
pip install ms-fabric-cli fabric-cicd azure-identity
fab auth login
```

## 2. Get the code into a GitHub repo

The files live in your OneDrive **Documents/Cowork → `fabric-wildfire-demo/`**. Create an empty GitHub repo (github.com → **New** → name it `fabric-wildfire-demo` → **Private** → **no** README), then in VS Code open the `fabric-wildfire-demo` folder and run:

```bash
git init
git add .
git commit -m "Initial Fabric wildfire demo"
git branch -M main
git remote add origin https://github.com/<you>/fabric-wildfire-demo.git
git push -u origin main
```

(Alternative: VS Code **Source Control → "Publish to GitHub"**.)

## 3. Link the Fabric workspace to GitHub (Git integration)

In Fabric, open the `Wildfire-Demo` workspace → **Workspace settings → Git integration** → provider **GitHub** → sign in / PAT → Repository `<you>/fabric-wildfire-demo`, Branch `main`, Git folder `/` → **Connect**. Then use **Update from Git** to pull items in, or **Commit** to push workspace items to the repo.

Note: Git integration serializes items in Fabric's item format; raw `.ipynb` files are best first-loaded via the Fabric Data Engineering extension or the portal **"Import notebook"**, after which Git keeps them in sync.

## 4. Dev loop

Sign into the Fabric extension → pick `Wildfire-Demo` → open and run notebooks **01–05** against your capacity (Copilot writes the code). Connect the Kusto extension to the `EH_Wildfire` query URI to run the KQL. Edit `map/index.html` locally. `git commit` / `git push` regularly — Git integration syncs your changes to the workspace.

## 5. Provision the base (step 0, scripted)

From `deploy/`:

```powershell
./provision.ps1 -Capacity "<your-capacity-name>"
```

This creates the workspace + `LH_Wildfire` + `EH_Wildfire` + `ES_Wildfire`.

## 6. Deploy / redeploy items

After the items exist and Git has serialized them into item folders:

```bash
python deploy/deploy.py
```

## 7. Finish the 4 portal items

In the browser, once: build the **Digital Twin Builder** ontology, the **Real-Time Dashboard** + **Azure Maps** tile, the **Activator** alert, and the **Data Agent** (see `docs/BUILD_GUIDE.md`). Then **Commit to Git** so they're versioned alongside the code.

## 8. Run order recap

Provision → push repo → link Git → import/run notebooks → KQL tables → Eventstream → ontology → dispatch KQL → dashboard/map → Activator → Data Agent → inject demo fire.
