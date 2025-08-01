import React, { useState, useEffect } from 'react'
import useAdminStore from '@/store/adminStore'
import LoadingSpinner from '@/components/LoadingSpinner'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  FolderIcon
} from '@heroicons/react/24/outline'

const CategoryManagement = () => {
  const { 
    adminCategories, 
    categoriesLoading, 
    categoriesPagination, 
    categoryFilters,
    getAdminCategories, 
    createCategory,
    updateCategory,
    deleteCategory,
    setCategoryFilters 
  } = useAdminStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  })

  useEffect(() => {
    getAdminCategories()
  }, [getAdminCategories])

  const handleSearch = () => {
    getAdminCategories({ search: searchTerm, page: 1 })
  }

  const handlePageChange = (page: number) => {
    getAdminCategories({ page })
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    await createCategory(formData)
    setShowCreateModal(false)
    setFormData({ name: '', description: '', image: '' })
  }

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedCategory) {
      await updateCategory(selectedCategory.id, formData)
      setShowEditModal(false)
      setSelectedCategory(null)
      setFormData({ name: '', description: '', image: '' })
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      await deleteCategory(categoryId)
    }
  }

  const openEditModal = (category: any) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || ''
    })
    setShowEditModal(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (categoriesLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher des catégories..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FunnelIcon className="h-5 w-5 inline mr-2" />
              Filtrer
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5 inline mr-2" />
          Nouvelle Catégorie
        </button>
      </div>

      {/* Categories Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Catégories ({categoriesPagination?.total || 0})
          </h3>
        </div>
        
        <div className="p-6">
          {adminCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminCategories.map((category) => (
                <div key={category.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        {category.image ? (
                          <img 
                            src={category.image} 
                            alt={category.name}
                            className="h-12 w-12 rounded-lg object-cover mr-3"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-300 flex items-center justify-center mr-3">
                            <FolderIcon className="h-6 w-6 text-gray-600" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{category.name}</h4>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              category.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {category.isActive ? (
                                <>
                                  <EyeIcon className="h-3 w-3 mr-1" />
                                  Actif
                                </>
                              ) : (
                                <>
                                  <EyeSlashIcon className="h-3 w-3 mr-1" />
                                  Inactif
                                </>
                              )}
                            </span>
                            <span className="text-xs text-gray-500">
                              {category._count.products} produits
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {category.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        Créée le {formatDate(category.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => openEditModal(category)}
                      className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={category._count.products > 0}
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                        category._count.products > 0
                          ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                          : 'text-red-700 bg-red-100 hover:bg-red-200'
                      }`}
                      title={category._count.products > 0 ? 'Impossible de supprimer une catégorie avec des produits' : ''}
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune catégorie trouvée</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {categoriesPagination && categoriesPagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Affichage de {((categoriesPagination.page - 1) * categoriesPagination.limit) + 1} à{' '}
                {Math.min(categoriesPagination.page * categoriesPagination.limit, categoriesPagination.total)} sur{' '}
                {categoriesPagination.total} résultats
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(categoriesPagination.page - 1)}
                  disabled={categoriesPagination.page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Précédent
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Page {categoriesPagination.page} sur {categoriesPagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(categoriesPagination.page + 1)}
                  disabled={categoriesPagination.page === categoriesPagination.pages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nouvelle Catégorie</h3>
              <form onSubmit={handleCreateCategory}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nom de la catégorie"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Description de la catégorie"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="URL de l'image"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Créer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Modifier la Catégorie</h3>
              <form onSubmit={handleEditCategory}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nom de la catégorie"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Description de la catégorie"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="URL de l'image"
                    />
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive !== false}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Catégorie active</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Modifier
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryManagement 