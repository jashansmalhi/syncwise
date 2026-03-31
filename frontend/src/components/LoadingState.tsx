type LoadingStateProps = {
  title?: string
  subtitle?: string
  steps?: string[]
}

const defaultSteps = ['Analyzing campaign tone', 'Scoring best-fit tracks', 'Preparing the shortlist']

export function LoadingState({
  title = 'Curating your results',
  subtitle = 'We are shaping a ranked shortlist that fits the brief you just gave us.',
  steps = defaultSteps,
}: LoadingStateProps) {
  return (
    <div
      className="surface-enter rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-[0_12px_34px_rgba(15,23,42,0.06)]"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-100 text-sky-700">
          <span className="loading-wave loading-wave--compact" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{subtitle}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step}
            className="rounded-2xl border border-white/70 bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-[11px] font-semibold text-sky-700">
                {index + 1}
              </span>
              <span>{step}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3">
        <LoadingCard />
        <LoadingCard />
      </div>
    </div>
  )
}

function LoadingCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 h-4 w-2/3 rounded bg-slate-200" />
      <div className="mb-2 h-3 w-1/2 rounded bg-slate-200" />
      <div className="h-3 w-4/5 rounded bg-slate-200" />
    </div>
  )
}
