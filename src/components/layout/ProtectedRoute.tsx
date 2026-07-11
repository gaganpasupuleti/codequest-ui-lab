import { Navigate, useLocation } from 'react-router-dom'
import { getAuthToken } from '@/lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()

  if (!getAuthToken()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
