import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { testApiConnection, checkNetworkStatus } from '@/utils/networkDiagnostic'

const NetworkTest = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runNetworkTest = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('🧪 Starting network test...')
      
      // Test 1: Diagnostic complet
      const diagnostics = await checkNetworkStatus()
      
      // Test 2: Connexion API
      const apiWorking = await testApiConnection()
      
      setResults({
        diagnostics,
        apiWorking,
        timestamp: new Date().toISOString(),
      })
      
      console.log('✅ Network test completed')
    } catch (err: any) {
      setError(err.message)
      console.error('❌ Network test failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Exécuter le test automatiquement au montage
    runNetworkTest()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">🔍 Diagnostic Réseau</h2>
      
      <div className="space-y-4">
        {/* Bouton de test */}
        <button
          onClick={runNetworkTest}
          disabled={isLoading}
          className="btn-primary flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Test en cours...</span>
            </>
          ) : (
            <>
              <span>🔄 Relancer le test</span>
            </>
          )}
        </button>

        {/* Résultats */}
        {results && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Résultats du Diagnostic</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>URL API:</span>
                  <span className="font-mono">{results.diagnostics.apiUrl}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Backend Health:</span>
                  <span className={results.diagnostics.backendHealth ? 'text-green-600' : 'text-red-600'}>
                    {results.diagnostics.backendHealth ? '✅ OK' : '❌ Failed'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>CORS Enabled:</span>
                  <span className={results.diagnostics.corsEnabled ? 'text-green-600' : 'text-red-600'}>
                    {results.diagnostics.corsEnabled ? '✅ OK' : '❌ Failed'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>API Service:</span>
                  <span className={results.apiWorking ? 'text-green-600' : 'text-red-600'}>
                    {results.apiWorking ? '✅ OK' : '❌ Failed'}
                  </span>
                </div>
                
                {results.diagnostics.networkError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                    <span className="text-red-800 font-medium">Erreur:</span>
                    <p className="text-red-700 text-sm mt-1">{results.diagnostics.networkError}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Solutions recommandées */}
            {(!results.diagnostics.backendHealth || !results.diagnostics.corsEnabled || !results.apiWorking) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">🔧 Solutions Recommandées</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {!results.diagnostics.backendHealth && (
                    <li>• Vérifiez que le backend est démarré sur le port 5000</li>
                  )}
                  {!results.diagnostics.corsEnabled && (
                    <li>• Vérifiez la configuration CORS dans le backend</li>
                  )}
                  {!results.apiWorking && (
                    <li>• Vérifiez les variables d'environnement VITE_API_URL</li>
                  )}
                  <li>• Vérifiez que PostgreSQL est démarré et accessible</li>
                  <li>• Vérifiez les logs du backend pour plus de détails</li>
                </ul>
              </div>
            )}

            {/* Commandes utiles */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💻 Commandes Utiles</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Démarrer le backend:</span>
                  <code className="block bg-blue-100 px-2 py-1 rounded mt-1 text-xs">
                    cd backend && npm run dev
                  </code>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Vérifier les logs:</span>
                  <code className="block bg-blue-100 px-2 py-1 rounded mt-1 text-xs">
                    tail -f backend/logs/app.log
                  </code>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Tester l'API:</span>
                  <code className="block bg-blue-100 px-2 py-1 rounded mt-1 text-xs">
                    curl http://localhost:5000/health
                  </code>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Erreur */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <h4 className="font-semibold text-red-800 mb-2">❌ Erreur de Test</h4>
            <p className="text-red-700 text-sm">{error}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default NetworkTest 