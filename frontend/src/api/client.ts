import type { RecommendationRequest, RecommendationResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const DEFAULT_ERROR_MESSAGE = 'We hit a temporary issue generating recommendations. Please try again.'

export async function fetchRecommendations(
  payload: RecommendationRequest,
): Promise<RecommendationResponse> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error(DEFAULT_ERROR_MESSAGE)
  }

  if (!response.ok) {
    const responseText = await response.text()

    try {
      const parsed = JSON.parse(responseText) as {
        detail?: Array<{ loc?: Array<string | number>; msg?: string }>
      }
      const firstIssue = parsed.detail?.[0]
      if (firstIssue?.loc?.includes('adDescription')) {
        throw new Error('Ad description must be at least 5 characters')
      }
      if (firstIssue?.msg) {
        throw new Error(firstIssue.msg)
      }
    } catch (error) {
      if (error instanceof Error && error.message !== 'Unexpected token') {
        throw error
      }
    }

    throw new Error(DEFAULT_ERROR_MESSAGE)
  }

  return response.json() as Promise<RecommendationResponse>
}
