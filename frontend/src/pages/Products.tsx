import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiFilter, FiMapPin, FiClock, FiEye } from 'react-icons/fi'

interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  category: {
    name: string
  }
  seller: {
    firstName: string
    lastName: string
  }
  createdAt: string
  location?: string
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  // Mock data for demonstration
  const mockProducts: Product[] = [
    {
      id: '1',
      title: 'iPhone 13 Pro Max - Excellent état',
      description: 'iPhone 13 Pro Max 256GB en excellent état, vendu avec tous ses accessoires',
      price: 2800,
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'],
      category: { name: 'Électronique' },
      seller: { firstName: 'Ahmed', lastName: 'Ben Ali' },
      createdAt: '2024-01-15T10:30:00Z',
      location: 'Tunis'
    },
    {
      id: '2',
      title: 'Voiture Renault Clio 2018',
      description: 'Renault Clio 2018, 45000 km, moteur essence, climatisation, radio CD',
      price: 45000,
      images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400'],
      category: { name: 'Véhicules' },
      seller: { firstName: 'Sara', lastName: 'Trabelsi' },
      createdAt: '2024-01-14T15:45:00Z',
      location: 'Sfax'
    },
    {
      id: '3',
      title: 'Appartement 3 pièces - Centre-ville',
      description: 'Appartement 3 pièces meublé, 80m², 2ème étage avec ascenseur',
      price: 180000,
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'],
      category: { name: 'Immobilier' },
      seller: { firstName: 'Mohamed', lastName: 'Hammami' },
      createdAt: '2024-01-13T09:20:00Z',
      location: 'Monastir'
    },
    {
      id: '4',
      title: 'Canapé cuir marron - Neuf',
      description: 'Canapé 3 places en cuir marron, jamais utilisé, livraison possible',
      price: 1200,
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'],
      category: { name: 'Maison & Jardin' },
      seller: { firstName: 'Fatma', lastName: 'Karray' },
      createdAt: '2024-01-12T14:15:00Z',
      location: 'Nabeul'
    }
  ]

  const categories = [
    'Toutes les catégories',
    'Véhicules',
    'Immobilier',
    'Électronique',
    'Maison & Jardin',
    'Mode & Beauté',
    'Sport & Loisirs',
    'Emploi & Services'
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '' || product.category.name === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      default:
        return 0
    }
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'À l\'instant'
    if (diffInHours < 24) return `Il y a ${diffInHours}h`
    if (diffInHours < 48) return 'Hier'
    return date.toLocaleDateString('fr-TN')
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Annonces</h1>
        <p className="text-gray-600">Trouvez ce que vous cherchez parmi nos milliers d'annonces</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category === 'Toutes les catégories' ? '' : category}>
                {category}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="newest">Plus récentes</option>
            <option value="oldest">Plus anciennes</option>
            <option value="price-low">Prix croissant</option>
            <option value="price-high">Prix décroissant</option>
          </select>

          {/* Post Ad Button */}
          <Link
            to="/register"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors text-center"
          >
            Publier une annonce
          </Link>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {sortedProducts.length} annonce{sortedProducts.length !== 1 ? 's' : ''} trouvée{sortedProducts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map(product => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="relative">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {product.category.name}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.title}
              </h3>
              
              <p className="text-primary-600 font-bold text-lg mb-2">
                {formatPrice(product.price)}
              </p>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <FiMapPin className="mr-1" />
                  <span>{product.location}</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-1" />
                  <span>{formatDate(product.createdAt)}</span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Par {product.seller.firstName} {product.seller.lastName}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune annonce trouvée</h3>
          <p className="text-gray-600 mb-6">
            Essayez de modifier vos critères de recherche ou de publier une nouvelle annonce.
          </p>
          <Link
            to="/register"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Publier une annonce
          </Link>
        </div>
      )}
    </div>
  )
}

export default Products 