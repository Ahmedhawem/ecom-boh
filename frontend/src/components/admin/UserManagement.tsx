import React, { useState, useEffect } from 'react'
import useAdminStore from '@/store/adminStore'
import LoadingSpinner from '@/components/LoadingSpinner'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  ShoppingBagIcon,
  StarIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline'

const UserManagement = () => {
  const { 
    users, 
    usersLoading, 
    usersPagination, 
    userFilters,
    getUsers, 
    updateUserRole, 
    toggleUserStatus,
    setUserFilters 
  } = useAdminStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('')

  useEffect(() => {
    getUsers()
  }, [getUsers])

  const handleSearch = () => {
    getUsers({ search: searchTerm, role: selectedRole, page: 1 })
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    updateUserRole(userId, newRole)
  }

  const handleStatusToggle = (userId: string) => {
    toggleUserStatus(userId)
  }

  const handlePageChange = (page: number) => {
    getUsers({ page })
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

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (usersLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom, email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les rôles</option>
              <option value="ADMIN">Admin</option>
              <option value="SELLER">Vendeur</option>
              <option value="BUYER">Acheteur</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FunnelIcon className="h-5 w-5 inline mr-2" />
              Filtrer
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Utilisateurs ({usersPagination?.total || 0})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={user.avatar} 
                            alt={user.firstName} 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.phone && (
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)} border-0 focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="BUYER">BUYER</option>
                      <option value="SELLER">SELLER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.isActive)}`}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <ShoppingBagIcon className="h-4 w-4 mr-1" />
                        {user._count.products}
                      </div>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 mr-1" />
                        {user._count.reviews}
                      </div>
                      <div className="flex items-center">
                        <ShoppingCartIcon className="h-4 w-4 mr-1" />
                        {user._count.orders}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleStatusToggle(user.id)}
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                        user.isActive 
                          ? 'text-red-700 bg-red-100 hover:bg-red-200' 
                          : 'text-green-700 bg-green-100 hover:bg-green-200'
                      }`}
                    >
                      {user.isActive ? (
                        <>
                          <EyeSlashIcon className="h-4 w-4 mr-1" />
                          Désactiver
                        </>
                      ) : (
                        <>
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Activer
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {usersPagination && usersPagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Affichage de {((usersPagination.page - 1) * usersPagination.limit) + 1} à{' '}
                {Math.min(usersPagination.page * usersPagination.limit, usersPagination.total)} sur{' '}
                {usersPagination.total} résultats
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(usersPagination.page - 1)}
                  disabled={usersPagination.page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Précédent
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Page {usersPagination.page} sur {usersPagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(usersPagination.page + 1)}
                  disabled={usersPagination.page === usersPagination.pages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagement 