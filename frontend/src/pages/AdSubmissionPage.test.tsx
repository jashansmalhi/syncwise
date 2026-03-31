import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, afterEach } from 'vitest'

import { AdSubmissionPage } from './AdSubmissionPage'
import { fetchRecommendations } from '../api/client'

vi.mock('../api/client', () => ({
  fetchRecommendations: vi.fn(),
}))

function createDeferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('AdSubmissionPage', () => {
  it('applies the Tech Launch demo prompt', async () => {
    render(<AdSubmissionPage />)

    await userEvent.click(screen.getAllByRole('button', { name: /Tech Launch/i })[0])

    expect(screen.getAllByPlaceholderText('Summer Product Launch')[0]).toHaveValue('Neon Launch')
    expect(
      screen.getAllByPlaceholderText(
        'A fast-paced campaign showing an AI-powered car dashboard with cinematic transitions',
      )[0],
    ).toHaveValue(
      'A polished AI workflow launch spot for startup teams with glowing dashboards, fast product cuts, and a confident futuristic tone.',
    )
    expect(screen.getByText('Duration')).toBeInTheDocument()
    expect(screen.getByRole('slider')).toHaveValue('30')
    expect(screen.getByRole('button', { name: 'Industry' })).toHaveTextContent('Tech')
    expect(screen.getByRole('button', { name: 'Preferred Genre' })).toHaveTextContent('Electronic')
    expect(screen.getByRole('button', { name: 'No Lyrics' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('applies the Luxury Auto demo prompt', async () => {
    render(<AdSubmissionPage />)

    await userEvent.click(screen.getAllByRole('button', { name: /Luxury Auto/i })[0])

    expect(screen.getAllByPlaceholderText('Summer Product Launch')[0]).toHaveValue('Precision Drive')
    expect(screen.getByRole('slider')).toHaveValue('45')
    expect(screen.getByRole('button', { name: 'Industry' })).toHaveTextContent('Automotive')
    expect(screen.getByRole('button', { name: 'Preferred Genre' })).toHaveTextContent('Soundtrack')
    expect(screen.getByRole('button', { name: 'No Lyrics' })).toHaveAttribute('aria-pressed', 'true')
  })

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
      screen.getAllByPlaceholderText(
        'A fast-paced campaign showing an AI-powered car dashboard with cinematic transitions',
      )[0],
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

  it('clears previous results immediately and shows staged loading copy while a new request is pending', async () => {
    const fetchRecommendationsMock = vi.mocked(fetchRecommendations)
    fetchRecommendationsMock.mockResolvedValueOnce({
      llmFallbackUsed: false,
      recommendations: [
        {
          artist: 'Artist One',
          title: 'Existing Track',
          genre: 'Pop',
          fmaUrl: 'https://example.com/one',
          matchScore: 0.2234,
          popularity: 'Mid-High',
        },
      ],
    })

    const deferred = createDeferred<{
      llmFallbackUsed: boolean
      recommendations: Array<{
        artist: string
        title: string
        genre: string
        fmaUrl: string
        matchScore: number
        popularity: string
      }>
    }>()
    fetchRecommendationsMock.mockReturnValueOnce(deferred.promise)

    const user = userEvent.setup()
    render(<AdSubmissionPage />)

    await user.type(
      screen.getAllByPlaceholderText(
        'A fast-paced campaign showing an AI-powered car dashboard with cinematic transitions',
      )[0],
      'A polished AI dashboard commercial for a tech audience.',
    )

    await user.click(screen.getByRole('button', { name: '4 Upbeat' }))
    await user.click(screen.getByRole('button', { name: 'Positive' }))
    await user.click(screen.getByRole('button', { name: 'No Lyrics' }))
    await user.click(screen.getByRole('button', { name: 'Start Ad Matching' }))

    expect(await screen.findByText('Existing Track')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Start Ad Matching' }))

    expect(screen.queryByText('Existing Track')).not.toBeInTheDocument()
    expect(screen.getByText('Curating your results into a ranked shortlist')).toBeInTheDocument()
    expect(screen.getByText('Analyzing campaign tone')).toBeInTheDocument()
    expect(screen.getByText('Scoring best-fit tracks')).toBeInTheDocument()
    expect(screen.getByText('Preparing the shortlist')).toBeInTheDocument()

    deferred.resolve({
      llmFallbackUsed: false,
      recommendations: [
        {
          artist: 'Artist Two',
          title: 'Fresh Track',
          genre: 'Electronic',
          fmaUrl: 'https://example.com/two',
          matchScore: 0.1111,
          popularity: 'Low',
        },
      ],
    })

    expect(await screen.findByText('Fresh Track')).toBeInTheDocument()
  })
})
