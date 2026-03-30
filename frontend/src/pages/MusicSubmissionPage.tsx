import { FormEvent, useState } from 'react'
import type { Genre, Industry } from '../types'

const genres: Genre[] = [
  'Electronic',
  'Chiptune',
  'Sound Art',
  'Rock',
  'Punk',
  'Metal',
  'Post-Punk',
  'Post-Rock',
  'Pop',
  'Indie-Rock',
  'Psych-Rock',
  'Folk',
  'Psych-Folk',
  'Old-Time / Historic',
  'Hip-Hop',
  'Trip-Hop',
  'Jazz',
  'Blues',
  'Classical',
  'Soundtrack',
  'International',
  'Kid-Friendly',
  'Compilation',
]

const industries: Industry[] = ['Tech', 'Entertainment', 'Automotive', 'Retail', 'F&B', 'Finance', 'Healthcare']

export function MusicSubmissionPage() {
  const [songTitle, setSongTitle] = useState('')
  const [artistName, setArtistName] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
  const [excludedIndustries, setExcludedIndustries] = useState<Industry[]>([])
  const [instrumental, setInstrumental] = useState(false)
  const [trackUploadName, setTrackUploadName] = useState('')
  const [albumArtName, setAlbumArtName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function toggleGenre(genre: Genre) {
    setSelectedGenres((current) => {
      if (current.includes(genre)) {
        return current.filter((item) => item !== genre)
      }

      if (current.length >= 3) {
        return current
      }

      return [...current, genre]
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  function handleSubmitAnother() {
    setSongTitle('')
    setArtistName('')
    setSelectedGenres([])
    setExcludedIndustries([])
    setInstrumental(false)
    setTrackUploadName('')
    setAlbumArtName('')
    setSubmitted(false)
  }

  function toggleIndustry(industry: Industry) {
    setExcludedIndustries((current) =>
      current.includes(industry) ? current.filter((item) => item !== industry) : [...current, industry],
    )
  }

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-semibold text-slate-900">Submit a Track</h2>
      <p className="mt-2 text-slate-600">
        {submitted
          ? 'Thanks for submitting your track. You can add another track anytime.'
          : 'Add track details to expand the catalog and improve future matching'}
      </p>
      {!submitted && <p className="mt-1 text-sm text-slate-500">Help your music get discovered for the right campaigns</p>}

      {!submitted ? (
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-800">Track Title</span>
              <input
                value={songTitle}
                onChange={(event) => setSongTitle(event.target.value)}
                required
                placeholder="Midnight Skyline"
                className="input"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-800">Artist Name</span>
              <input
                value={artistName}
                onChange={(event) => setArtistName(event.target.value)}
                required
                placeholder="Nova Lane"
                className="input"
              />
            </label>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-slate-800">Genres (up to 3)</legend>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => {
                const active = selectedGenres.includes(genre)
                const disabled = !active && selectedGenres.length >= 3
                return (
                  <button
                    key={genre}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleGenre(genre)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${
                      active
                        ? 'border-sky-200 bg-sky-50 text-sky-700 shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:border-slate-400'
                    } ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
                  >
                    {genre}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-slate-800">Industry Exclusions</legend>
            <p className="mb-2 text-xs text-slate-500">
              Exclude industries where this track should not be surfaced for campaign matching
            </p>
            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => {
                const active = excludedIndustries.includes(industry)
                return (
                  <button
                    key={industry}
                    type="button"
                    onClick={() => toggleIndustry(industry)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${
                      active
                        ? 'border-sky-200 bg-sky-50 text-sky-700 shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {industry}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={instrumental}
              onChange={(event) => setInstrumental(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 bg-transparent accent-slate-900"
            />
            Instrumental
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-800">Track File (optional)</span>
            <input
              type="file"
              accept="audio/*"
              onChange={(event) => setTrackUploadName(event.target.files?.[0]?.name || '')}
              className="input file:mr-3 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-sky-600 file:to-cyan-500 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
            />
            {trackUploadName ? <span className="mt-2 block text-xs text-slate-500">Selected: {trackUploadName}</span> : null}
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-800">Album Art (optional)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setAlbumArtName(event.target.files?.[0]?.name || '')}
              className="input file:mr-3 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-sky-600 file:to-cyan-500 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
            />
            {albumArtName ? <span className="mt-2 block text-xs text-slate-500">Selected: {albumArtName}</span> : null}
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-105"
          >
            Submit Track
          </button>
        </form>
      ) : (
        <div className="surface-enter mt-6 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-8 text-center">
          <p className="text-lg font-semibold text-slate-900">Track submitted</p>
          <p className="mt-2 text-sm text-slate-600">Want to submit another track?</p>
          <button
            type="button"
            onClick={handleSubmitAnother}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
          >
            Submit another track
          </button>
        </div>
      )}
    </section>
  )
}
