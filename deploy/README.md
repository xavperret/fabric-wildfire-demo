# Deployment — Fabric Wildfire Response Demo

How to provision and (re)deploy this demo to a Microsoft Fabric workspace. / Comment provisionner et (re)déployer la démo vers un workspace Microsoft Fabric.

## Prerequisites / Prérequis

Install the tooling into a Python environment (VS Code recommended):

```bash
pip install -r deploy/requirements.txt
```

This installs the Fabric CLI (`fab`), `fabric-cicd`, and `azure-identity`.

## Steps / Étapes

1. **Install dependencies** — `pip install -r deploy/requirements.txt`, then sign in with `fab auth login`.

2. **Provision the empty workspace + base items** — run the Fabric CLI provisioning script. It creates the `Wildfire-Demo` workspace plus the `LH_Wildfire` Lakehouse, `EH_Wildfire` Eventhouse, and `ES_Wildfire` Eventstream:

   ```powershell
   ./provision.ps1 -Capacity "<your-capacity-name>"
   ```

3. **Author the portal items once** — the four low-code items are built by hand in the Fabric portal (they can't be scripted): the **Digital Twin Builder** ontology, the **Real-Time / KQL Dashboard** (+ Azure Maps tile), the **Activator / Reflex** alert (→ Teams), and the **Data Agent**. See `docs/BUILD_GUIDE.md` for the click-through.

4. **Connect Fabric Git integration** — in **Workspace settings → Git integration**, connect the `Wildfire-Demo` workspace to this GitHub repo. Fabric then serializes each workspace item into an item folder inside the repo, and **Commit** pushes them to Git. This is what makes `deploy.py` able to redeploy them.

5. **Redeploy to another workspace** — once the item folders exist in the repo, publish everything to a target workspace with `fabric-cicd`:

   ```bash
   python deploy/deploy.py
   ```

   Set `WORKSPACE_ID` in `deploy.py` (and use `parameter.yml` for DEV→PROD GUID find/replace).

## Caveat / Réserve

`fabric-cicd` and the Fabric CLI don't (yet) cover every item type. **Digital Twin Builder (preview)** and the **Data Agent** are not guaranteed to deploy through `deploy.py` — rebuild those two in the portal on the target workspace if publishing skips them.
