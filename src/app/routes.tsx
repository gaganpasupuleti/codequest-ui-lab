import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../components/layout/ProtectedRoute'
import { StudentShell } from '../components/layout/StudentShell'

const LandingPage = lazy(() => import('../pages/LandingPage').then((m) => ({ default: m.LandingPage })))
const EditorialLandingPage = lazy(() =>
  import('../pages/EditorialLandingPage').then((m) => ({ default: m.EditorialLandingPage })),
)
const LoginPage = lazy(() => import('../pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('../pages/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const DashboardPage = lazy(() => import('../pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const PracticePage = lazy(() => import('../pages/PracticePage').then((m) => ({ default: m.PracticePage })))
const SqlArenaPage = lazy(() => import('../pages/SqlArenaPage').then((m) => ({ default: m.SqlArenaPage })))
const PythonLabPage = lazy(() => import('../pages/PythonLabPage').then((m) => ({ default: m.PythonLabPage })))
const AptitudePage = lazy(() => import('../pages/AptitudePage').then((m) => ({ default: m.AptitudePage })))
const DsaPage = lazy(() => import('../pages/DsaPage').then((m) => ({ default: m.DsaPage })))
const MaterialsPage = lazy(() => import('../pages/MaterialsPage').then((m) => ({ default: m.MaterialsPage })))
const ResumeLabPage = lazy(() => import('../pages/ResumeLabPage').then((m) => ({ default: m.ResumeLabPage })))
const JobsPage = lazy(() => import('../pages/JobsPage').then((m) => ({ default: m.JobsPage })))
const CareerMapPage = lazy(() => import('../pages/CareerMapPage').then((m) => ({ default: m.CareerMapPage })))
const ProgressPage = lazy(() => import('../pages/ProgressPage').then((m) => ({ default: m.ProgressPage })))
const ProfilePage = lazy(() => import('../pages/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const SettingsPage = lazy(() => import('../pages/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const AdminPage = lazy(() => import('../pages/AdminPage').then((m) => ({ default: m.AdminPage })))

function PageLoader() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  { path: '/', element: withSuspense(LandingPage) },
  { path: '/landing-editorial', element: withSuspense(EditorialLandingPage) },
  { path: '/login', element: withSuspense(LoginPage) },
  { path: '/register', element: withSuspense(RegisterPage) },
  {
    element: (
      <ProtectedRoute>
        <StudentShell />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: withSuspense(DashboardPage) },
      { path: '/practice', element: withSuspense(PracticePage) },
      { path: '/sql-arena', element: withSuspense(SqlArenaPage) },
      { path: '/python-lab', element: withSuspense(PythonLabPage) },
      { path: '/aptitude', element: withSuspense(AptitudePage) },
      { path: '/dsa', element: withSuspense(DsaPage) },
      { path: '/materials', element: withSuspense(MaterialsPage) },
      { path: '/resume-lab', element: withSuspense(ResumeLabPage) },
      { path: '/jobs', element: withSuspense(JobsPage) },
      { path: '/career-map', element: withSuspense(CareerMapPage) },
      { path: '/progress', element: withSuspense(ProgressPage) },
      { path: '/profile', element: withSuspense(ProfilePage) },
      { path: '/settings', element: withSuspense(SettingsPage) },
      { path: '/admin', element: withSuspense(AdminPage) },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
