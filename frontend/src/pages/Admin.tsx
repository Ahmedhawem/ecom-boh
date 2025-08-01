import React, { useState, useEffect } from 'react'
import useAuthStore from '@/store/authStore'
import useAdminStore from '@/store/adminStore'
import DashboardOverview from '@/components/admin/DashboardOverview'
import UserManagement from '@/components/admin/UserManagement'
import ProductManagement from '@/components/admin/ProductManagement'
import CategoryManagement from '@/components/admin/CategoryManagement'
import LoadingSpinner from '@/components/LoadingSpinner'

const Admin = () => {
  const { user } = useAuthStore()
  const { getDashboardStats, isLoadingStats } = useAdminStore()
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      getDashboardStats()
    }
  }, [user, getDashboardStats])

  // Check if user is admin
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Accès Refusé</h1>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', name: 'Tableau de Bord', icon: '📊' },
    { id: 'users', name: 'Gestion Utilisateurs', icon: '👥' },
    { id: 'products', name: 'Gestion Produits', icon: '📦' },
    { id: 'categories', name: 'Gestion Catégories', icon: '📂' }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />
      case 'users':
        return <UserManagement />
      case 'products':
        return <ProductManagement />
      case 'categories':
        return <CategoryManagement />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration</h1>
        <p className="text-gray-600">Gérez votre plateforme e-commerce</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {isLoadingStats && activeTab === 'dashboard' ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  )
}

export default Admin 