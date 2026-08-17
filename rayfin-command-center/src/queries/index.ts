// KQL queries for the Command Center app

export const ACTIVE_FIRES = `
DispatchResults
| where ingestion_time() > ago(1h)
| project 
    commune,
    priority_score,
    frp,
    population_30km,
    recommendation,
    latitude,
    longitude,
    cluster_id
| order by priority_score desc
`;

export const FIRE_LOCATIONS = `
FIRMSDetections
| where ingestion_time() > ago(1h)
| project 
    latitude,
    longitude,
    frp,
    confidence,
    satellite,
    acq_date,
    acq_time,
    detection_id
| order by frp desc
`;

export const AVAILABLE_UNITS = `
AvailableUnits
| where status in ("available", "en_route")
| project 
    unit_id,
    unit_name,
    unit_type,
    base_latitude,
    base_longitude,
    status,
    current_assignment
| order by unit_type asc, unit_name asc
`;

export const AIRCRAFT_POSITIONS = `
AircraftPositions
| where ingestion_time() > ago(10m)
| project 
    callsign,
    aircraft_type,
    latitude,
    longitude,
    altitude,
    heading,
    status
| order by callsign asc
`;

export const KPI_SUMMARY = `
DispatchResults
| where ingestion_time() > ago(1h)
| summarize 
    active_zones = dcount(cluster_id),
    total_frp = sum(frp),
    population_at_risk = sum(population_30km),
    critical_count = countif(priority_score > 2000),
    max_priority = max(priority_score)
`;

export const ALERT_HISTORY = `
AlertLog
| where timestamp > ago(24h)
| project 
    timestamp,
    zone,
    priority_score,
    action_taken,
    acknowledged_by
| order by timestamp desc
| take 50
`;
