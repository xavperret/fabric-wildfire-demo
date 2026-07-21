# provision.ps1 — Crée le workspace + items socles avec la Fabric CLI (fab).
# Prérequis: pip install ms-fabric-cli ; fab auth login
param(
  [string]$Workspace = "Wildfire-Demo",
  [string]$Capacity  = "REMPLACER_PAR_NOM_CAPACITE"
)
fab auth login
fab config set default_capacity $Capacity
fab create "$Workspace.Workspace" -P capacityname=$Capacity
fab create "$Workspace.Workspace/LH_Wildfire.Lakehouse"
fab create "$Workspace.Workspace/EH_Wildfire.Eventhouse"
fab create "$Workspace.Workspace/ES_Wildfire.Eventstream"
fab ls "$Workspace.Workspace" -l
# Note: si un type d'item n'est pas supporté par ta version de fab, crée-le dans le portail.
