import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@store'

interface AuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const location = useLocation()
  const { token } = useSelector((state: RootState) => state.auth)

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}