import { Navigate } from 'react-router-dom'

/** Register is handled inside the Code Quest login page (signup mode). */
export function RegisterPage() {
  return <Navigate to="/login" replace />
}
