"""deploy.py — Deploy/redeploy Fabric items from this repo to a workspace via fabric-cicd.
Prerequisites: pip install fabric-cicd azure-identity ; az login (or fab auth login).
Items must exist as item folders in the repo (populated by Fabric Git integration).
"""
import os
from azure.identity import AzureCliCredential
from fabric_cicd import FabricWorkspace, publish_all_items, unpublish_all_orphan_items

WORKSPACE_ID = os.environ.get("FABRIC_WORKSPACE_ID", "<your-workspace-id>")
REPO_DIR = "."  # root of the fabric-wildfire-demo repo

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
# Note: Digital Twin Builder (preview) and Data Agent may not be supported by fabric-cicd -> recreate in the portal.
