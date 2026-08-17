export interface FireZone {
  commune: string;
  priority_score: number;
  frp: number;
  population_30km: number;
  recommendation: string;
  latitude: number;
  longitude: number;
}

export interface KPISummary {
  active_zones: number;
  total_frp: number;
  population_at_risk: number;
  critical_count: number;
  max_priority: number;
}

export interface Unit {
  unit_id: string;
  unit_name: string;
  unit_type: string;
  status: "available" | "deployed" | "en_route";
  base_latitude: number;
  base_longitude: number;
  current_assignment?: string;
}

export interface FireDetection {
  latitude: number;
  longitude: number;
  frp: number;
  confidence: number;
  satellite: string;
  acq_date: string;
  acq_time: string;
  detection_id: string;
}
