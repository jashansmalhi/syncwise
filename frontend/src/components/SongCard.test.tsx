import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SongCard } from './SongCard'

describe('SongCard', () => {
  it('renders the V4 recommendation fields', () => {
    render(
      <SongCard
        rank={1}
        song={{
          artist: 'Artist A',
          title: 'Track A',
          genre: 'Electronic',
          fmaUrl: 'https://example.com/a',
          matchScore: 0.1234,
          popularity: 'Low',
        }}
      />,
    )

    expect(screen.getByText('Track A')).toBeInTheDocument()
    expect(screen.getByText('Artist A')).toBeInTheDocument()
    expect(screen.getByText('Best Match')).toBeInTheDocument()
    expect(screen.getByText('88% fit')).toBeInTheDocument()
    expect(screen.getAllByText('Genre: Electronic').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Popularity: Low').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Score: Solid score').length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: 'Open Track' })).toHaveAttribute('href', 'https://example.com/a')
  })

  it('renders deterministic rationale chips', () => {
    render(
      <SongCard
        rank={3}
        song={{
          artist: 'Artist B',
          title: 'Track B',
          genre: 'Pop',
          fmaUrl: 'https://example.com/b',
          matchScore: 0.1675,
          popularity: 'Mid-High',
        }}
      />,
    )

    expect(screen.getByText('Match #3')).toBeInTheDocument()
    expect(screen.getAllByText('Genre: Pop').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Popularity: Mid-High').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Score: Solid score').length).toBeGreaterThan(0)
  })
})
