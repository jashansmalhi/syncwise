import { describe, expect, it, vi, afterEach } from 'vitest'

import { fetchRecommendations } from './client'

declare global {
  interface Window {
    fetch: typeof fetch
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchRecommendations', () => {
  it('posts the V4 request shape and returns parsed recommendations', async () => {
    const fetchMock = vi.spyOn(window, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
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
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    const response = await fetchRecommendations({
      adDescription: 'An AI product launch for a tech brand.',
      energy: 4,
      tempo: 'Medium',
      mood: 'Positive',
      industry: 'Tech',
      genreOverride: ['Electronic'],
      lyricsPreference: 'No Preference',
      limit: 1,
    })

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/recommendations'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          adDescription: 'An AI product launch for a tech brand.',
          energy: 4,
          tempo: 'Medium',
          mood: 'Positive',
          industry: 'Tech',
          genreOverride: ['Electronic'],
          lyricsPreference: 'No Preference',
          limit: 1,
        }),
      }),
    )
    expect(response.recommendations[0].fmaUrl).toBe('https://example.com/a')
  })

  it('surfaces the validation error for short descriptions', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          detail: [{ loc: ['body', 'adDescription'], msg: 'too short' }],
        }),
        { status: 422, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    await expect(
      fetchRecommendations({
        adDescription: 'bad',
        energy: 3,
        tempo: 'Medium',
        mood: 'Neutral',
        industry: 'Tech',
      }),
    ).rejects.toThrow('Ad description must be at least 5 characters')
  })
})
