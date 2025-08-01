import apiService from '@/services/api'

export const checkNetworkStatus = async () => {
  const diagnostics = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    backendHealth: false,
    corsEnabled: false,
    networkError: null as string | null,
    timestamp: new Date().toISOString(),
  }

  try {
    // Test de connexion au backend
    const response = await fetch(`${diagnostics.apiUrl.replace('/api', '')}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      diagnostics.backendHealth = true
      const data = await response.json()
      console.log('✅ Backend health check:', data)
    } else {
      diagnostics.networkError = `Backend responded with status: ${response.status}`
    }
  } catch (error: any) {
    diagnostics.networkError = error.message
    console.error('❌ Network error:', error)
  }

  // Test CORS
  try {
    const corsResponse = await fetch(`${diagnostics.apiUrl}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (corsResponse.ok) {
      diagnostics.corsEnabled = true
    } else {
      diagnostics.networkError = `CORS test failed: ${corsResponse.status}`
    }
  } catch (error: any) {
    diagnostics.networkError = `CORS error: ${error.message}`
  }

  return diagnostics
}

export const logNetworkDiagnostics = async () => {
  console.log('🔍 Running network diagnostics...')
  const diagnostics = await checkNetworkStatus()
  
  console.log('📊 Network Diagnostics:', {
    'API URL': diagnostics.apiUrl,
    'Backend Health': diagnostics.backendHealth ? '✅ OK' : '❌ Failed',
    'CORS Enabled': diagnostics.corsEnabled ? '✅ OK' : '❌ Failed',
    'Error': diagnostics.networkError || 'None',
    'Timestamp': diagnostics.timestamp,
  })

  return diagnostics
}

// Fonction pour tester la connexion API
export const testApiConnection = async () => {
  try {
    console.log('🧪 Testing API connection...')
    
    // Test 1: Health check
    const healthResponse = await fetch('http://localhost:5000/health')
    console.log('Health check status:', healthResponse.status)
    
    // Test 2: API endpoint
    const apiResponse = await fetch('http://localhost:5000/api/categories')
    console.log('API categories status:', apiResponse.status)
    
    // Test 3: Axios via service
    try {
      const categories = await apiService.getCategories()
      console.log('✅ API service working, categories count:', categories.length)
      return true
    } catch (error: any) {
      console.error('❌ API service error:', error.message)
      return false
    }
  } catch (error: any) {
    console.error('❌ Network test failed:', error.message)
    return false
  }
} 