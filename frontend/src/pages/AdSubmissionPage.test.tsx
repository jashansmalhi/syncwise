import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, afterEach } from 'vitest'

import { AdSubmissionPage } from './AdSubmissionPage'
import { fetchRecommendations } from '../api/client'

vi.mock('../api/client', () => ({
  fetchRecommendations: vi.fn(),
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('AdSubmissionPage', () => {
  it('submits the V4 request shape and renders the response', async () => {
    const fetchRecommendationsMock = vi.mocked(fetchRecommendations)
    fetchRecommendationsMock.mockResolvedValue({
      llmFallbackUsed: true,
      recommendations: [
        {
          artist: 'Artist A',
          title: 'Track A',
          genre: 'Electronic',
          fmaUrl: 'https://example.com/a',
          matchScore: 0.1234,
          popularity: 'Low',
        },
      ],
    })

    render(<AdSubmissionPage />)

    await userEvent.type(
      screen.getByPlaceholderText(
        'A fast-paced campaign showing an AI-powered car dashboard with cinematic transitions',
      ),
      'A polished AI dashboard commercial for a tech audience.',
    )

    await userEvent.click(screen.getByRole('button', { name: '4 Upbeat' }))
    await userEvent.click(screen.getByRole('button', { name: 'Positive' }))
    await userEvent.click(screen.getByRole('button', { name: 'No Lyrics' }))
    await userEvent.click(screen.getByRole('button', { name: 'Start Ad Matching' }))

    await waitFor(() => {
        expect(fetchRecommendationsMock).toHaveBeenCalledWith(
        expect.objectContaining({
          adDescription: 'A polished AI dashboard commercial for a tech audience.',
          energy: 4,
          tempo: 'Medium',
          mood: 'Positive',
          industry: 'Tech',
          lyricsPreference: 'No Lyrics',
          limit: 10,
        }),
      )
    })

    expect(await screen.findByText('Track A')).toBeInTheDocument()
    expect(screen.queryByText('Fallback Mode')).not.toBeInTheDocument()
  })
})
