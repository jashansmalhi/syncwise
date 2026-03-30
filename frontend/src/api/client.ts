import type { RecommendationRequest, RecommendationResponse } from '../types'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || `${window.location.protocol}//${window.location.hostname}:8000`

export async function fetchRecommendations(
  payload: RecommendationRequest,
): Promise<RecommendationResponse> {
  const response = await fetch(`${API_BASE_URL}/recommendations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let errorMessage = 'Failed to fetch recommendations'
    const responseText = await response.text()

    try {
      const parsed = JSON.parse(responseText) as {
        detail?: Array<{ loc?: Array<string | number>; msg?: string }>
      }
      const firstIssue = parsed.detail?.[0]
      if (firstIssue?.loc?.includes('adDescription')) {
        errorMessage = 'Ad description must be at least 5 characters'
      } else if (firstIssue?.msg) {
        errorMessage = firstIssue.msg
      }
    } catch {
      if (responseText) {
        errorMessage = responseText
      }
    }

    throw new Error(errorMessage)
  }

  return response.json() as Promise<RecommendationResponse>
}
