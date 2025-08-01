import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthResponse, LoginCredentials, RegisterData } from '@/services/api'
import apiService from '@/services/api'
import toast from 'react-hot-toast'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  getProfile: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  setUser: (user: User) => void
  setToken: (token: string) => void
  setRefreshToken: (refreshToken: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

type AuthStore = AuthState & AuthActions

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // État initial
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        try {
          const response: AuthResponse = await apiService.login(credentials)
          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          toast.success('Connexion réussie !')
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Erreur lors de la connexion',
          })
          toast.error(error.message || 'Erreur lors de la connexion')
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null })
        try {
          const response: AuthResponse = await apiService.register(data)
          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          toast.success('Inscription réussie !')
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Erreur lors de l\'inscription',
          })
          toast.error(error.message || 'Erreur lors de l\'inscription')
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await apiService.logout()
        } catch (error) {
          // Ignorer les erreurs lors de la déconnexion
        } finally {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
          toast.success('Déconnexion réussie')
        }
      },

      getProfile: async () => {
        const { token } = get()
        if (!token) return

        set({ isLoading: true })
        try {
          const user = await apiService.getProfile()
          set({
            user,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Erreur lors du chargement du profil',
          })
        }
      },

      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true, error: null })
        try {
          const updatedUser = await apiService.updateProfile(data)
          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          })
          toast.success('Profil mis à jour avec succès !')
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Erreur lors de la mise à jour du profil',
          })
          toast.error(error.message || 'Erreur lors de la mise à jour du profil')
        }
      },

      setUser: (user: User) => {
        set({ user })
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: true })
      },

      setRefreshToken: (refreshToken: string) => {
        set({ refreshToken })
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore 