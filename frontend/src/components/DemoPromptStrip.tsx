import type { Genre, Industry, LyricsPreference, Mood, Tempo } from '../types'

export type DemoPromptPreset = {
  id: string
  label: string
  description: string
  values: {
    adTitle: string
    adDescription: string
    duration: number
    energy: number
    tempo: Tempo
    mood: Mood
    industry: Industry
    preferredGenre: Genre | 'No Preference'
    lyricsPreference: LyricsPreference
  }
}

interface DemoPromptStripProps {
  prompts: DemoPromptPreset[]
  onApplyPrompt: (prompt: DemoPromptPreset['values']) => void
}

export function DemoPromptStrip({ prompts, onApplyPrompt }: DemoPromptStripProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Demo prompts</p>
          <p className="text-sm text-slate-600">Use one of these presentation-safe inputs to fill the form instantly.</p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {prompts.map((prompt) => (
          <button
            key={prompt.id}
            type="button"
            onClick={() => onApplyPrompt(prompt.values)}
            className="group rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-900">{prompt.label}</span>
              <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 opacity-0 transition group-hover:opacity-100">
                Fill form
              </span>
            </div>
            <p className="text-sm leading-snug text-slate-600">{prompt.description}</p>
          </button>
        ))}
      </div>
    </section>
  )
}
