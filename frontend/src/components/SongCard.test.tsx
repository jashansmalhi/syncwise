import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SongCard } from './SongCard'

describe('SongCard', () => {
  it('renders the V4 recommendation fields', () => {
    render(
      <SongCard
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
    expect(screen.getByText('88% match')).toBeInTheDocument()
    expect(screen.getByText('Low')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open Track' })).toHaveAttribute('href', 'https://example.com/a')
  })
})
