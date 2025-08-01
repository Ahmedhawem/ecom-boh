import { ReactNode, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import LoadingSpinner from './LoadingSpinner'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  requireRole?: 'buyer' | 'seller' | 'admin'
  redirectTo?: string
}

const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireRole,
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading, getProfile } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    // Si l'utilisateur n'est pas chargé mais qu'il y a un token, charger le profil
    if (!user && isAuthenticated && !isLoading) {
      getProfile()
    }
  }, [user, isAuthenticated, isLoading, getProfile])

  // Afficher le spinner pendant le chargement
  if (isLoading) {
    return <LoadingSpinner />
  }

  // Si l'authentification n'est pas requise, afficher directement
  if (!requireAuth) {
    return <>{children}</>
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Si un rôle spécifique est requis, vérifier les permissions
  if (requireRole && user.role !== requireRole) {
    // Rediriger vers la page d'accueil si l'utilisateur n'a pas les bonnes permissions
    return <Navigate to="/" replace />
  }

  // Si toutes les vérifications sont passées, afficher le contenu
  return <>{children}</>
}

export default ProtectedRoute 