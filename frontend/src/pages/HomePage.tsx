import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="mb-3 text-xs uppercase tracking-[0.24em] text-sky-600">MUSIC-TECH MATCHING PLATFORM</p>
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Find the right music for every campaign
        </h2>
        <p className="max-w-3xl text-slate-600">
          SyncWise helps brands and creative teams match campaign context to tracks from independent artists, with ranked recommendations and clear fit explanations
        </p>
        <p className="mt-2 text-sm text-slate-500">Better matches for brands and more opportunities for independent artists</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/ad-submission"
            className="tap-smooth inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105"
          >
            Start Ad Matching
          </Link>
          <Link
            to="/music-submission"
            className="tap-smooth inline-flex items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
          >
            Submit a Track
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold text-slate-900">How SyncWise works</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <StepCard
            step="Step 1"
            title="Describe the campaign"
            text="Enter structured campaign details such as ad description, energy, tempo, mood, industry, and genre"
          />
          <StepCard
            step="Step 2"
            title="Review ranked matches"
            text="Get five ranked track recommendations from independent artists, with match scores and concise fit explanations"
          />
          <StepCard
            step="Step 3"
            title="Grow the catalog"
            text="Submit track metadata to expand the platform catalog and strengthen future matching"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold text-slate-900">Choose a workflow</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Link to="/ad-submission" className="tap-smooth rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-sky-200 hover:bg-sky-50">
            <h4 className="mb-1 text-lg font-semibold text-slate-900">Ad Submission</h4>
            <p className="text-sm text-slate-600">
              For advertisers: add campaign context and get ranked music recommendations with fit scores and concise explanations
            </p>
          </Link>
          <Link to="/music-submission" className="tap-smooth rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-sky-200 hover:bg-sky-50">
            <h4 className="mb-1 text-lg font-semibold text-slate-900">Submit a Track</h4>
            <p className="text-sm text-slate-600">
              For artists: submit track metadata to expand catalog coverage and increase campaign discovery opportunities
            </p>
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <h3 className="mb-2 text-2xl font-semibold text-slate-900">
          Ready to match your next campaign with independent music?
        </h3>
        <p className="max-w-2xl text-slate-600">
          Start with a campaign brief, or submit track details to expand catalog discovery
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/ad-submission"
            className="tap-smooth inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105"
          >
            Start Ad Matching
          </Link>
          <Link
            to="/music-submission"
            className="tap-smooth inline-flex items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
          >
            Submit a Track
          </Link>
        </div>
      </section>
    </div>
  )
}

function StepCard({ step, title, text }: { step: string; title: string; text: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-sky-600">{step}</p>
      <h4 className="mb-1 text-base font-semibold text-slate-900">{title}</h4>
      <p className="text-sm text-slate-600">{text}</p>
    </article>
  )
}
