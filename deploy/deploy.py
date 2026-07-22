"""deploy.py — Déploie/redéploie les items Fabric du repo vers un workspace via fabric-cicd.
Prérequis: pip install fabric-cicd azure-identity ; az login (ou fab auth login).
Les items doivent exister sous forme de dossiers d'items dans le repo (peuplés par la Git integration Fabric).
"""
from azure.identity import AzureCliCredential
from fabric_cicd import FabricWorkspace, publish_all_items, unpublish_all_orphan_items

WORKSPACE_ID = "96a844c1-e64e-491b-b536-d3846330d598"
REPO_DIR = "."  # racine du repo fabric-wildfire-demo

workspace = FabricWorkspace(
    workspace_id=WORKSPACE_ID,
    repository_directory=REPO_DIR,
    item_type_in_scope=[
        "Notebook", "Lakehouse", "Eventhouse", "KQLDatabase",
        "Eventstream", "KQLDashboard", "Reflex", "DataPipeline",
    ],
    token_credential=AzureCliCredential(),
)
publish_all_items(workspace)
unpublish_all_orphan_items(workspace)
# Note: Digital Twin Builder (preview) et Data Agent ne sont pas forcément pris en charge par fabric-cicd -> refaire dans le portail.
