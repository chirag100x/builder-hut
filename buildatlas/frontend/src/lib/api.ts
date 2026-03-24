import { ProjectFormData, EstimateResponse } from "./types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function getEstimate(formData: ProjectFormData): 
  Promise<EstimateResponse> {
  const res = await fetch(`${BASE_URL}/estimate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
  if (!res.ok) throw new Error("Estimate request failed")
  return res.json()
}

export async function sendChatMessage(
  message: string,
  projectContext: string
): Promise<string> {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      message, 
      project_context: projectContext 
    }),
  })
  if (!res.ok) throw new Error("Chat request failed")
  const data = await res.json()
  return data.reply
}
