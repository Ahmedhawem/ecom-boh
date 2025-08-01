import React from 'react'
import useAdminStore from '@/store/adminStore'
import { 
  UsersIcon, 
  ShoppingBagIcon, 
  ShoppingCartIcon, 
  FolderIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

const DashboardOverview = () => {
  const { dashboardStats, isLoadingStats } = useAdminStore()

  if (!dashboardStats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Chargement des statistiques...</p>
      </div>
    )
  }

  const stats = [
    {
      name: 'Utilisateurs Totaux',
      value: dashboardStats.totalUsers,
      icon: UsersIcon,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Produits Totaux',
      value: dashboardStats.totalProducts,
      icon: ShoppingBagIcon,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Commandes Totales',
      value: dashboardStats.totalOrders,
      icon: ShoppingCartIcon,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'positive'
    },
    {
      name: 'Catégories',
      value: dashboardStats.totalCategories,
      icon: FolderIcon,
      color: 'bg-yellow-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      name: 'Produits en Attente',
      value: dashboardStats.pendingProducts,
      icon: ClockIcon,
      color: 'bg-orange-500',
      change: '+3',
      changeType: 'neutral'
    },
    {
      name: 'Revenus (7 jours)',
      value: `${dashboardStats.totalRevenue.toFixed(2)} DT`,
      icon: CurrencyDollarIcon,
      color: 'bg-emerald-500',
      change: '+22%',
      changeType: 'positive'
    }
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      case 'SELLER':
        return 'bg-blue-100 text-blue-800'
      case 'BUYER':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <div className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 
                stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Commandes Récentes</h3>
          </div>
          <div className="p-6">
            {dashboardStats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {dashboardStats.recentOrders.slice(0, 5).map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{order.product.title}</p>
                      <p className="text-sm text-gray-600">
                        {order.buyer.firstName} {order.buyer.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{order.totalPrice} DT</p>
                      <p className="text-sm text-gray-600">Qté: {order.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune commande récente</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Produits Populaires</h3>
          </div>
          <div className="p-6">
            {dashboardStats.topProducts.length > 0 ? (
              <div className="space-y-4">
                {dashboardStats.topProducts.slice(0, 5).map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.title}</p>
                      <p className="text-sm text-gray-600">{product.category.name}</p>
                      <div className="flex items-center mt-1">
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-600 ml-1">
                          {product.averageRating.toFixed(1)} ({product.reviewCount} avis)
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{product.price} DT</p>
                      <p className="text-sm text-gray-600">
                        Par {product.seller.firstName} {product.seller.lastName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Aucun produit populaire</p>
            )}
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Statistiques Utilisateurs</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboardStats.userStats.map((stat: any) => (
              <div key={stat.role} className="text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(stat.role)}`}>
                  {stat.role}
                </div>
                <p className="text-2xl font-semibold text-gray-900 mt-2">{stat._count.role}</p>
                <p className="text-sm text-gray-600">utilisateurs</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview 