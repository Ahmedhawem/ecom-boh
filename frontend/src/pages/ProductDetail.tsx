import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiMapPin, FiClock, FiPhone, FiMail, FiEye, FiHeart, FiShare2, FiUser, FiStar } from 'react-icons/fi'

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
    id: string
    firstName: string
    lastName: string
    phone?: string
    email: string
    avatar?: string
  }
  createdAt: string
  location?: string
  stock: number
  isActive: boolean
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showContactModal, setShowContactModal] = useState(false)

  // Mock data for demonstration
  const mockProduct: Product = {
    id: '1',
    title: 'iPhone 13 Pro Max - Excellent état',
    description: `iPhone 13 Pro Max 256GB en excellent état, vendu avec tous ses accessoires.

Caractéristiques :
- Capacité : 256GB
- Couleur : Graphite
- État : Excellent (95% de batterie)
- Accessoires inclus : Chargeur, câble, boîte d'origine
- Garantie : 3 mois

Le téléphone a été utilisé avec soin et est en parfait état. Aucun défaut ni rayure. Batterie en excellent état avec 95% de capacité restante.

Livraison possible dans toute la Tunisie. Paiement en espèces ou par virement bancaire.

N'hésitez pas à me contacter pour plus d'informations ou pour organiser une rencontre.`,
    price: 2800,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
      'https://images.unsplash.com/photo-1601972599720-36938d4ecd5e?w=800',
      'https://images.unsplash.com/photo-1592899677977-9c5caaab5613?w=800'
    ],
    category: { name: 'Électronique' },
    seller: {
      id: '1',
      firstName: 'Ahmed',
      lastName: 'Ben Ali',
      phone: '+216 22 123 456',
      email: 'ahmed.benali@email.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    },
    createdAt: '2024-01-15T10:30:00Z',
    location: 'Tunis, Tunisie',
    stock: 1,
    isActive: true
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProduct(mockProduct)
      setLoading(false)
    }, 1000)
  }, [id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-TN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleContact = () => {
    setShowContactModal(true)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-6"></div>
              <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h2>
          <p className="text-gray-600 mb-6">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link
            to="/products"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retour aux annonces
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link to="/" className="hover:text-primary-600">Accueil</Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/products" className="hover:text-primary-600">Annonces</Link>
          </li>
          <li>/</li>
          <li>
            <Link to={`/products?category=${product.category.name}`} className="hover:text-primary-600">
              {product.category.name}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900">{product.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          
          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.category.name}
              </span>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <FiHeart className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <FiMapPin className="mr-1" />
                <span>{product.location}</span>
              </div>
              <div className="flex items-center">
                <FiClock className="mr-1" />
                <span>Publié le {formatDate(product.createdAt)}</span>
              </div>
            </div>
            
            <div className="text-4xl font-bold text-primary-600 mb-6">
              {formatPrice(product.price)}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <div className="prose prose-gray max-w-none">
              {product.description.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-600 mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Contact Seller */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacter le vendeur</h3>
            
            <div className="flex items-center mb-4">
              <img
                src={product.seller.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                alt={`${product.seller.firstName} ${product.seller.lastName}`}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-medium text-gray-900">
                  {product.seller.firstName} {product.seller.lastName}
                </p>
                <p className="text-sm text-gray-500">Membre depuis 2023</p>
              </div>
            </div>

            <div className="space-y-3">
              {product.seller.phone && (
                <div className="flex items-center text-sm">
                  <FiPhone className="mr-2 text-gray-400" />
                  <span>{product.seller.phone}</span>
                </div>
              )}
              
              <div className="flex items-center text-sm">
                <FiMail className="mr-2 text-gray-400" />
                <span>{product.seller.email}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <FiMapPin className="mr-2 text-gray-400" />
                <span>{product.location}</span>
              </div>
            </div>

            <button
              onClick={handleContact}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors mt-4"
            >
              Contacter le vendeur
            </button>
          </div>

          {/* Safety Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Conseils de sécurité</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Rencontrez le vendeur dans un lieu public</li>
              <li>• Vérifiez le produit avant de payer</li>
              <li>• Évitez les paiements en avance</li>
              <li>• Signalez tout comportement suspect</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacter le vendeur</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Votre nom
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Votre nom complet"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Votre téléphone
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Votre numéro de téléphone"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Votre message au vendeur..."
                ></textarea>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  // Handle contact submission
                  setShowContactModal(false)
                }}
                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail 