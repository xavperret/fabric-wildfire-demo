// KQL queries for the SitRep app

export const SITUATION_SUMMARY = `
DispatchResults
| where ingestion_time() > ago(6h)
| summarize 
    total_fires = dcount(cluster_id),
    max_priority = max(priority_score),
    total_pop_at_risk = sum(population_30km),
    avg_frp = avg(frp),
    top_zone = arg_max(priority_score, commune)
| extend report_time = now()
`;

export const TIMELINE = `
FIRMSDetections
| where ingestion_time() > ago(6h)
| summarize 
    fire_count = count(),
    avg_frp = avg(frp),
    max_frp = max(frp)
  by bin(ingestion_time(), 30m)
| order by ingestion_time() asc
`;

export const RESOURCES_DEPLOYED = `
AircraftPositions
| where ingestion_time() > ago(1h)
| summarize 
    count_deployed = countif(status == "deployed"),
    count_available = countif(status == "available")
  by aircraft_type
`;

export const ZONES_DETAIL = `
DispatchResults
| where ingestion_time() > ago(1h)
| project 
    commune,
    priority_score,
    frp,
    population_30km,
    recommendation
| order by priority_score desc
`;

export const COMMUNES_EVACUATED = `
EvacuationLog
| where timestamp > ago(24h)
| summarize 
    total_evacuated = sum(people_evacuated),
    communes = make_set(commune)
`;
