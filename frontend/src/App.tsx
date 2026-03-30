import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { AdSubmissionPage } from './pages/AdSubmissionPage'
import { HomePage } from './pages/HomePage'
import { MusicSubmissionPage } from './pages/MusicSubmissionPage'

export function App() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ad-submission" element={<AdSubmissionPage />} />
        <Route path="/music-submission" element={<MusicSubmissionPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
