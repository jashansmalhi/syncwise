import { NavLink, Outlet } from 'react-router-dom'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `tap-smooth rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

export function AppLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-sky-200/35 blur-3xl" />
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 shadow-sm backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-sky-600">Music-Tech Matching</p>
              <h1 className="text-2xl font-semibold text-slate-900">SyncWise</h1>
            </div>
            <nav className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1">
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/ad-submission" className={navLinkClass}>
                Ad Submission
              </NavLink>
              <NavLink to="/music-submission" className={navLinkClass}>
                Submit a Track
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
