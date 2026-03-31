import { type ReactNode, useState } from 'react'
import type { RecommendedSong } from '../types'

interface SongCardProps {
  song: RecommendedSong
  fitMode?: 'compact' | 'micro' | 'normal' | 'nano'
}

export function SongCard({ song, fitMode = 'compact' }: SongCardProps) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const dense = fitMode === 'micro' || fitMode === 'nano'
  const nano = fitMode === 'nano'
  const displayScore = Math.max(1, Math.round((1 - Math.min(song.matchScore, 0.9999)) * 100))

  return (
    <article
      className={`relative flex min-h-0 overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_18px_44px_rgba(14,116,144,0.12)] ${
        nano ? 'p-2' : dense ? 'p-2.5' : 'p-3.5'
      }`}
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-sky-500 to-cyan-400" />

      <div className={`flex min-w-0 flex-1 flex-col ${nano ? 'gap-1 pl-1.5' : 'gap-1.5 pl-2'}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className={`${nano ? 'text-base' : dense ? 'text-lg' : 'text-xl'} truncate font-semibold leading-tight text-slate-900`}>
              {song.title}
            </h3>
            <p className={`${nano ? 'text-xs' : 'text-sm'} truncate text-slate-500`}>{song.artist}</p>
          </div>
          <span
            className={`${nano ? 'text-[11px] px-2 py-1' : dense ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1'} shrink-0 whitespace-nowrap rounded-full border border-emerald-100 bg-emerald-50/90 font-semibold text-emerald-700 shadow-sm`}
          >
            {displayScore}% match
          </span>
        </div>

        <div className={`${nano ? 'gap-1' : 'gap-1.5'} flex flex-wrap`}>
          <MetaPill label={song.genre} dense={dense} />
          <MetaPill label={song.popularity} dense={dense} />
        </div>
      </div>

      <div
        className={`${nano ? 'ml-2 pl-2' : 'ml-3 pl-3'} flex shrink-0 flex-col items-center justify-center gap-1.5 border-l border-slate-100/90`}
      >
        <ActionLink href={song.fmaUrl} dense={dense} />
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
      className={`${dense ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5'} max-w-full truncate rounded-full border border-slate-200 bg-white/80 text-slate-600 shadow-sm`}
    >
      {label}
    </span>
  )
}

function ActionLink({ href, dense }: { href: string; dense: boolean }) {
  const sizeClass = dense ? 'h-8 w-8' : 'h-9 w-9'

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${sizeClass} inline-flex items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-sky-700 transition hover:border-sky-300 hover:bg-sky-100`}
      aria-label="Open Track"
      title="Open Track"
    >
      <OpenTrackIcon />
    </a>
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

function OpenTrackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 5h5v5" />
      <path d="M10 14L19 5" />
      <path d="M19 13v5a1 1 0 0 1-1 1h-12a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
    </svg>
  )
}
