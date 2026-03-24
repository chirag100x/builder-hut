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
  schedule: Array<{week: number, task: string, milestone: boolean}>
  resources: {
    workers_breakdown: Record<string, number>
    materials: string[]
    equipment: string[]
  }
  risk_flags: string[]
  recommendation: string
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export async function getEstimate(formData: ProjectFormData) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/estimate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
  if (!res.ok) throw new Error("Estimate API returned " + res.status)
  return await res.json()
}

export async function sendChatMessage(message: string, projectContext: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, project_context: projectContext }),
  })
  if (!res.ok) throw new Error("Chat API returned " + res.status)
  const data = await res.json()
  return data.reply
}
