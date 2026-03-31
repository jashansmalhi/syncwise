import { FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { fetchRecommendations } from '../api/client'
import { DemoPromptStrip, type DemoPromptPreset } from '../components/DemoPromptStrip'
import { LoadingState } from '../components/LoadingState'
import { SongCard } from '../components/SongCard'
import { ThemedSelect } from '../components/ThemedSelect'
import type { Genre, Industry, LyricsPreference, Mood, RecommendedSong, Tempo } from '../types'

type GenreSelection = Genre | 'No Preference'

const energyOptions = [
  { value: 1, label: 'Calm' },
  { value: 2, label: 'Relaxed' },
  { value: 3, label: 'Moderate' },
  { value: 4, label: 'Upbeat' },
  { value: 5, label: 'High' },
]

const tempoOptions: Tempo[] = ['Slow', 'Medium', 'Fast']
const moodOptions: Mood[] = ['Positive', 'Neutral', 'Serious']
const lyricsPreferenceOptions: LyricsPreference[] = ['No Preference', 'No Lyrics', 'Lyrics']

const industryOptions: Industry[] = [
  'Tech',
  'Entertainment',
  'Automotive',
  'Retail',
  'F&B',
  'Finance',
  'Healthcare',
]

const genreOptions: GenreSelection[] = [
  'No Preference',
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
const MAX_RECOMMENDATIONS = 10

const demoPromptPresets: DemoPromptPreset[] = [
  {
    id: 'tech-launch',
    label: 'Tech Launch',
    description: 'A polished AI workflow launch spot for startup teams and modern product demos.',
    values: {
      adTitle: 'Neon Launch',
      adDescription:
        'A polished AI workflow launch spot for startup teams with glowing dashboards, fast product cuts, and a confident futuristic tone.',
      duration: 30,
      energy: 4,
      tempo: 'Fast',
      mood: 'Positive',
      industry: 'Tech',
      preferredGenre: 'Electronic',
      lyricsPreference: 'No Lyrics',
    },
  },
  {
    id: 'retail-drop',
    label: 'Retail Drop',
    description: 'A stylish retail campaign for a new collection drop with clean visuals and motion.',
    values: {
      adTitle: 'Weekend Drop',
      adDescription:
        'A stylish retail campaign for a new collection drop, featuring clean visuals, quick pacing, and a cool fashion-forward vibe.',
      duration: 15,
      energy: 3,
      tempo: 'Medium',
      mood: 'Positive',
      industry: 'Retail',
      preferredGenre: 'Pop',
      lyricsPreference: 'No Preference',
    },
  },
  {
    id: 'luxury-auto',
    label: 'Luxury Auto',
    description: 'A premium car film with cinematic pacing, city lights, and understated confidence.',
    values: {
      adTitle: 'Precision Drive',
      adDescription:
        'A premium luxury auto film with night city streets, reflective surfaces, cinematic pacing, and understated confidence.',
      duration: 45,
      energy: 4,
      tempo: 'Slow',
      mood: 'Serious',
      industry: 'Automotive',
      preferredGenre: 'Soundtrack',
      lyricsPreference: 'No Lyrics',
    },
  },
]

export function AdSubmissionPage() {
  const [adTitle, setAdTitle] = useState('')
  const [adDescription, setAdDescription] = useState('')
  const [duration, setDuration] = useState<number>(30)
  const [energy, setEnergy] = useState<number>(3)
  const [tempo, setTempo] = useState<Tempo>('Medium')
  const [mood, setMood] = useState<Mood>('Neutral')
  const [industry, setIndustry] = useState<Industry>('Tech')
  const [genre, setGenre] = useState<GenreSelection>('No Preference')
  const [lyricsPreference, setLyricsPreference] = useState<LyricsPreference>('No Preference')

  const [results, setResults] = useState<RecommendedSong[]>([])
  const [llmFallbackUsed, setLlmFallbackUsed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [songLimit, setSongLimit] = useState<number>(3)
  const [rightPanelHeight, setRightPanelHeight] = useState<number>()
  const leftPanelRef = useRef<HTMLDivElement | null>(null)
  const requestIdRef = useRef(0)

  async function runRecommendationRequest(limit: number) {
    const requestId = ++requestIdRef.current
    setIsLoading(true)
    setError(null)
    setResults([])
    setLlmFallbackUsed(false)

    try {
      const response = await fetchRecommendations({
        adDescription,
        energy,
        tempo,
        mood,
        industry,
        genreOverride: genre === 'No Preference' ? undefined : [genre],
        lyricsPreference,
        limit,
      })
      if (requestId === requestIdRef.current) {
        setResults(response.recommendations)
        setLlmFallbackUsed(response.llmFallbackUsed)
      }
    } catch (submitError) {
      const fallback =
        'Could not reach the API Confirm backend is running on port 8000 and CORS allows your frontend host'
      if (requestId === requestIdRef.current) {
        setError(submitError instanceof Error ? submitError.message || fallback : fallback)
        setResults([])
        setLlmFallbackUsed(false)
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false)
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResults([])
    setLlmFallbackUsed(false)
    setError(null)
    setHasSubmitted(true)
    await runRecommendationRequest(MAX_RECOMMENDATIONS)
  }

  function handleStartOver() {
    setAdTitle('')
    setAdDescription('')
    setDuration(30)
    setEnergy(3)
    setTempo('Medium')
    setMood('Neutral')
    setIndustry('Tech')
    setGenre('No Preference')
    setLyricsPreference('No Preference')
    setResults([])
    setLlmFallbackUsed(false)
    setError(null)
    setHasSubmitted(false)
    setIsLoading(false)
  }

  function applyDemoPrompt(prompt: DemoPromptPreset['values']) {
    setAdTitle(prompt.adTitle)
    setAdDescription(prompt.adDescription)
    setDuration(prompt.duration)
    setEnergy(prompt.energy)
    setTempo(prompt.tempo)
    setMood(prompt.mood)
    setIndustry(prompt.industry)
    setGenre(prompt.preferredGenre)
    setLyricsPreference(prompt.lyricsPreference)
    setResults([])
    setLlmFallbackUsed(false)
    setError(null)
    setHasSubmitted(false)
    setIsLoading(false)
  }

  useEffect(() => {
    function syncRightPanelHeight() {
      if (window.innerWidth < 1024 || !leftPanelRef.current) {
        setRightPanelHeight(undefined)
        return
      }
      setRightPanelHeight(leftPanelRef.current.getBoundingClientRect().height)
    }

    syncRightPanelHeight()
    window.addEventListener('resize', syncRightPanelHeight)

    let observer: ResizeObserver | null = null
    if (leftPanelRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(syncRightPanelHeight)
      observer.observe(leftPanelRef.current)
    }

    return () => {
      window.removeEventListener('resize', syncRightPanelHeight)
      observer?.disconnect()
    }
  }, [])

  const campaignSummary = useMemo(
    () => ({
      title: adTitle.trim() || 'Untitled',
      duration: `${duration} sec`,
      energy: `${energy}/5`,
      tempo,
      mood,
      industry,
      genre: genre === 'No Preference' ? 'Automatic' : genre,
      lyricsPreference,
    }),
    [adTitle, duration, energy, tempo, mood, industry, genre, lyricsPreference],
  )

  const recommendationsHint = useMemo(() => {
    if (isLoading) return 'Curating your results into a ranked shortlist'
    if (error) return 'We could not generate recommendations. Update campaign details and try again.'
    if (!hasSubmitted) return 'Ranked track recommendations will appear here after you submit a campaign'
    if (results.length > 0) return ''
    return 'No recommendations yet. Submit your campaign to generate matches.'
  }, [isLoading, error, hasSubmitted, results.length])

  const visibleResults = useMemo(() => results.slice(0, songLimit), [results, songLimit])
  const fitMode: 'normal' | 'compact' | 'micro' | 'nano' =
    visibleResults.length >= 8 ? 'nano' : visibleResults.length >= 5 ? 'micro' : 'normal'

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="mb-2 text-xs uppercase tracking-[0.24em] text-sky-600">CAMPAIGN-TO-MUSIC MATCHING</p>
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Find the right music for your campaign</h2>
        <p className="max-w-3xl text-slate-600">
          Describe your campaign and get ranked track recommendations with clear fit explanations
          Higher match scores indicate stronger fits based on the V4 model.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start">
        <div ref={leftPanelRef} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <DemoPromptStrip prompts={demoPromptPresets} onApplyPrompt={applyDemoPrompt} />

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Campaign Summary</p>
            <div className="flex flex-wrap gap-2">
              <SummaryChip label="Title" value={campaignSummary.title} />
              <SummaryChip label="Duration" value={campaignSummary.duration} />
              <SummaryChip label="Energy" value={campaignSummary.energy} />
              <SummaryChip label="Tempo" value={campaignSummary.tempo} />
              <SummaryChip label="Mood" value={campaignSummary.mood} />
              <SummaryChip label="Industry" value={campaignSummary.industry} />
              <SummaryChip label="Genre" value={campaignSummary.genre} />
              <SummaryChip label="Lyrics" value={campaignSummary.lyricsPreference} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Campaign Title">
                <input
                  value={adTitle}
                  onChange={(event) => setAdTitle(event.target.value)}
                  placeholder="Summer Product Launch"
                  className="input"
                />
              </Field>

              <Field label="Duration">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 text-sm font-semibold text-slate-800">{duration} sec</div>
                  <input
                    type="range"
                    min={15}
                    max={120}
                    step={15}
                    value={duration}
                    onChange={(event) => setDuration(Number(event.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-slate-900"
                  />
                </div>
              </Field>
            </div>

            <Field label="Campaign Description">
              <textarea
                value={adDescription}
                onChange={(event) => setAdDescription(event.target.value)}
                placeholder="A fast-paced campaign showing an AI-powered car dashboard with cinematic transitions"
                className="input min-h-28 resize-y"
                minLength={5}
                required
              />
            </Field>

            <Field label="Energy">
              <SegmentedNumber options={energyOptions} value={energy} onChange={setEnergy} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tempo">
                <SegmentedString<Tempo> options={tempoOptions} value={tempo} onChange={setTempo} />
              </Field>

              <Field label="Mood">
                <SegmentedString<Mood> options={moodOptions} value={mood} onChange={setMood} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Industry">
                <ThemedSelect label="Industry" value={industry} options={industryOptions} onChange={setIndustry} />
              </Field>

              <Field label="Preferred Genre">
                <ThemedSelect label="Preferred Genre" value={genre} options={genreOptions} onChange={setGenre} />
              </Field>
            </div>

            <Field label="Lyrics Preference">
              <SegmentedString<LyricsPreference>
                options={lyricsPreferenceOptions}
                value={lyricsPreference}
                onChange={setLyricsPreference}
              />
            </Field>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Matching Tracks' : 'Start Ad Matching'}
            </button>
          </form>
        </div>

        <aside
          className={`overflow-hidden rounded-3xl border p-5 shadow-sm sm:p-6 lg:flex lg:flex-col ${
            llmFallbackUsed
              ? 'border-violet-200 bg-gradient-to-br from-white via-violet-50/50 to-fuchsia-50/50 shadow-[0_18px_48px_rgba(109,40,217,0.12)]'
              : 'border-slate-200 bg-white'
          }`}
          style={rightPanelHeight ? { height: `${rightPanelHeight}px` } : undefined}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <h3 className="text-xl font-semibold text-slate-900">Recommended Songs</h3>
            <button
              type="button"
              onClick={handleStartOver}
              className="shrink-0 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 transition hover:bg-sky-100 lg:sticky lg:top-7"
            >
              Start New Match
            </button>
          </div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Tracks shown</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[3, 5, 10].map((count) => {
                const active = songLimit === count
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setSongLimit(count)}
                    className={`rounded-lg border px-2 py-1 text-xs font-semibold ${
                      active ? 'border-sky-200 bg-sky-50 text-sky-700 shadow-sm' : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {count}
                  </button>
                )
              })}
            </div>
          </div>
          <p className={`mb-4 text-sm ${llmFallbackUsed ? 'text-violet-700/80' : 'text-slate-500'}`}>{recommendationsHint}</p>
          <div className="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
            {!hasSubmitted && (
              <div className="surface-enter rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
                No recommendations yet. Submit your campaign to generate matches.
              </div>
            )}

            {hasSubmitted && isLoading && (
              <LoadingState
                subtitle="We are shaping a ranked shortlist that fits the brief you just gave us."
                steps={['Analyzing campaign tone', 'Scoring best-fit tracks', 'Preparing the shortlist']}
              />
            )}

            {hasSubmitted && !isLoading && error && (
              <div className="surface-enter rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
            )}

            {hasSubmitted && !isLoading && !error && results.length === 0 && (
              <div className="surface-enter rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                No songs matched this query Try adjusting mood, genre, or tempo
              </div>
            )}

            {visibleResults.length > 0 && (
              <div className={`recommendation-scroll pr-1 ${visibleResults.length >= 8 ? 'lg:min-h-0 lg:flex-1 lg:overflow-y-auto' : ''}`}>
                <div className="flex flex-col gap-2 content-start">
                  {visibleResults.map((song, index) => (
                    <div
                      key={`${song.artist}-${song.title}-${index}`}
                      className="result-enter min-h-0"
                      style={{ animationDelay: `${Math.min(index * 90, 360)}ms` }}
                    >
                      <SongCard song={song} fitMode={fitMode} fallbackUsed={llmFallbackUsed} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-800">{label}</span>
      {children}
    </div>
  )
}

function SegmentedNumber({
  options,
  value,
  onChange,
}: {
  options: Array<{ value: number; label: string }>
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`rounded-xl border px-2 py-2 text-xs font-medium transition sm:text-sm ${
              isActive
                ? 'border-sky-200 bg-sky-50 text-sky-700 shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
            }`}
          >
            <span className="block text-[11px] font-semibold sm:text-xs">{option.value}</span>
            <span className="block truncate">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function SegmentedString<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((option) => {
        const isActive = option === value
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option)}
            className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
              isActive
                ? 'border-sky-200 bg-sky-50 text-sky-700 shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs">
      <span className="text-slate-500">{label}:</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  )
}
