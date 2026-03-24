export interface ProjectFormData {
  project_type: string
  location_tier: string
  total_area_sqft: number
  num_floors: number
  structure_type: string
  material_quality: string
  num_workers: number
  site_condition: string
}

export interface EstimateResponse {
  cost_low: number
  cost_high: number
  cost_predicted: number
  duration_low: number
  duration_high: number
  duration_predicted: number
  schedule: ScheduleItem[]
  resources: ResourcePlan
  risk_flags: string[]
  recommendation: string
}

export interface ScheduleItem {
  week: number
  task: string
  milestone: boolean
}

export interface ResourcePlan {
  workers_breakdown: Record<string, number>
  materials: string[]
  equipment: string[]
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}
