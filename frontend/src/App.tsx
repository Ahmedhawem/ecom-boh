import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/LoadingSpinner'
import ProtectedRoute from '@/components/ProtectedRoute'
import useAuthStore from '@/store/authStore'
import useProductStore from '@/store/productStore'
import { logNetworkDiagnostics } from '@/utils/networkDiagnostic'

// Lazy load pages
const Home = lazy(() => import('@/pages/Home'))
const Login = lazy(() => import('@/pages/Login'))
const Register = lazy(() => import('@/pages/Register'))
const Products = lazy(() => import('@/pages/Products'))
const ProductDetail = lazy(() => import('@/pages/ProductDetail'))
const Profile = lazy(() => import('@/pages/Profile'))
const Admin = lazy(() => import('@/pages/Admin'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const NetworkTest = lazy(() => import('@/components/NetworkTest'))

// Configuration React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  const { isAuthenticated, getProfile } = useAuthStore()
  const { fetchCategories } = useProductStore()

  // Initialiser les données au démarrage
  useEffect(() => {
    const initializeApp = async () => {
      // Diagnostic réseau au démarrage
      console.log('🚀 Initializing application...')
      await logNetworkDiagnostics()

      // Charger les catégories au démarrage
      try {
        await fetchCategories()
        console.log('✅ Categories loaded successfully')
      } catch (error) {
        console.error('❌ Failed to load categories:', error)
      }

      // Si l'utilisateur est authentifié, charger son profil
      if (isAuthenticated) {
        try {
          await getProfile()
          console.log('✅ User profile loaded successfully')
        } catch (error) {
          console.error('❌ Failed to load user profile:', error)
        }
      }
    }

    initializeApp()
  }, [fetchCategories, isAuthenticated, getProfile])

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            
            {/* Route de diagnostic (temporaire) */}
            <Route path="/network-test" element={<NetworkTest />} />
            
            {/* Routes protégées */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            
            {/* Routes admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireRole="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />
            
            {/* Route 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </QueryClientProvider>
  )
}

export default App 