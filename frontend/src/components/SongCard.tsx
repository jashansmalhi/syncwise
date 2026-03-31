import { type ReactNode, useState } from 'react'
import type { RecommendedSong } from '../types'

interface SongCardProps {
  song: RecommendedSong
  fitMode?: 'compact' | 'micro' | 'normal' | 'nano'
}

export function SongCard({ song, fitMode = 'compact' }: SongCardProps) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const dense = fitMode === 'micro' || fitMode === 'nano'

  return (
    <article className={`relative flex h-full min-h-0 overflow-hidden rounded-xl border border-slate-200 bg-white ${dense ? 'p-2' : 'p-3'} shadow-sm`}>
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-sky-500 to-cyan-400" />

      <div className="flex min-w-0 flex-1 flex-col justify-center pl-1.5">
        <div className={`${dense ? 'mb-0.5' : 'mb-1'} flex items-start justify-between gap-2`}>
          <div className="min-w-0">
            <h3 className={`${dense ? 'text-sm' : 'text-lg'} truncate font-semibold text-slate-900`}>{song.title}</h3>
            <p className={`${dense ? 'text-xs' : 'text-sm'} truncate text-slate-500`}>{song.artist}</p>
          </div>
          <span className={`${dense ? 'text-xs' : 'text-sm'} whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-700`}>
            score {song.matchScore.toFixed(4)}
          </span>
        </div>

        <div className={`${dense ? 'mb-0.5 gap-1' : 'mb-1.5 gap-1.5'} flex flex-wrap`}>
          <MetaPill label={song.genre} dense={dense} />
          <MetaPill label={song.popularity} dense={dense} />
        </div>

        <a
          href={song.fmaUrl}
          target="_blank"
          rel="noreferrer"
          className={`${dense ? 'text-[11px]' : 'text-xs'} text-sky-700 underline`}
        >
          Open on FMA
        </a>
      </div>

      <div className={`${dense ? 'ml-2 pl-2' : 'ml-3 pl-3'} flex shrink-0 flex-col items-center justify-center gap-1 border-l border-slate-100`}>
        <FeedbackButton
          active={feedback === 'up'}
          onClick={() => setFeedback((curr) => (curr === 'up' ? null : 'up'))}
          label={`Thumbs up for ${song.title}`}
          dense={dense}
        >
          <ThumbUpIcon />
        </FeedbackButton>
        <FeedbackButton
          active={feedback === 'down'}
          onClick={() => setFeedback((curr) => (curr === 'down' ? null : 'down'))}
          label={`Thumbs down for ${song.title}`}
          dense={dense}
        >
          <ThumbDownIcon />
        </FeedbackButton>
      </div>
    </article>
  )
}

function MetaPill({ label, dense }: { label: string; dense: boolean }) {
  return (
    <span
      className={`${dense ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5'} truncate rounded-full border border-slate-200 bg-slate-50 text-slate-600`}
    >
      {label}
    </span>
  )
}

function FeedbackButton({
  active,
  onClick,
  label,
  dense,
  children,
}: {
  active: boolean
  onClick: () => void
  label: string
  dense: boolean
  children: ReactNode
}) {
  const sizeClass = dense ? 'h-8 w-8 p-0' : 'h-9 w-9 p-0'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${sizeClass} inline-flex items-center justify-center rounded-full border transition ${
        active
          ? 'border-sky-300 bg-sky-100 text-sky-700'
          : 'border-sky-100 bg-sky-50 text-sky-600 hover:border-sky-200 hover:bg-sky-100'
      }`}
      aria-label={label}
    >
      {children}
    </button>
  )
}

function ThumbUpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 10v10" />
      <path d="M12 3l-1 7h8a2 2 0 0 1 2 2l-1 6a2 2 0 0 1-2 2H7V10l5-7z" />
    </svg>
  )
}

function ThumbDownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 14V4" />
      <path d="M12 21l-1-7h8a2 2 0 0 0 2-2l-1-6a2 2 0 0 0-2-2H7v10l5 7z" />
    </svg>
  )
}
