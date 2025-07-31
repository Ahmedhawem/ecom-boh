import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiEdit, FiTrash2, FiEye, FiMessageSquare, FiSettings, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiStar } from 'react-icons/fi'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  avatar: string
  createdAt: string
  role: 'BUYER' | 'SELLER' | 'ADMIN'
}

interface Product {
  id: string
  title: string
  price: number
  images: string[]
  status: 'active' | 'pending' | 'sold' | 'inactive'
  createdAt: string
  views: number
  favorites: number
}

interface Message {
  id: string
  subject: string
  sender: {
    firstName: string
    lastName: string
  }
  createdAt: string
  isRead: boolean
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [user] = useState<User>({
    id: '1',
    firstName: 'Ahmed',
    lastName: 'Ben Ali',
    email: 'ahmed.benali@email.com',
    phone: '+216 22 123 456',
    address: 'Tunis, Tunisie',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    createdAt: '2023-01-15T10:30:00Z',
    role: 'SELLER'
  })

  const [products] = useState<Product[]>([
    {
      id: '1',
      title: 'iPhone 13 Pro Max - Excellent état',
      price: 2800,
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'],
      status: 'active',
      createdAt: '2024-01-15T10:30:00Z',
      views: 45,
      favorites: 12
    },
    {
      id: '2',
      title: 'MacBook Pro 2021 - Comme neuf',
      price: 8500,
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
      status: 'pending',
      createdAt: '2024-01-10T14:20:00Z',
      views: 23,
      favorites: 8
    },
    {
      id: '3',
      title: 'Canon EOS R6 - Professionnel',
      price: 4200,
      images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'],
      status: 'sold',
      createdAt: '2024-01-05T09:15:00Z',
      views: 67,
      favorites: 15
    }
  ])

  const [messages] = useState<Message[]>([
    {
      id: '1',
      subject: 'Intéressé par votre iPhone',
      sender: { firstName: 'Sara', lastName: 'Trabelsi' },
      createdAt: '2024-01-16T15:30:00Z',
      isRead: false
    },
    {
      id: '2',
      subject: 'Question sur le MacBook',
      sender: { firstName: 'Mohamed', lastName: 'Hammami' },
      createdAt: '2024-01-15T11:20:00Z',
      isRead: true
    }
  ])

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
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', text: 'Active' },
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'En attente' },
      sold: { color: 'bg-blue-100 text-blue-800', text: 'Vendue' },
      inactive: { color: 'bg-gray-100 text-gray-800', text: 'Inactive' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-6">
          <img
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-20 h-20 rounded-full"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-600">Membre depuis {formatDate(user.createdAt)}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                {user.role === 'SELLER' ? 'Vendeur' : 'Acheteur'}
              </span>
            </div>
          </div>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            Modifier le profil
          </button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <FiMail className="text-gray-400" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <FiPhone className="text-gray-400" />
            <span>{user.phone}</span>
          </div>
          <div className="flex items-center space-x-3">
            <FiMapPin className="text-gray-400" />
            <span>{user.address}</span>
          </div>
          <div className="flex items-center space-x-3">
            <FiCalendar className="text-gray-400" />
            <span>Inscrit le {formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiEye className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vues totales</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiStar className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Favoris</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FiMessageSquare className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Messages</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProductsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Mes annonces</h3>
        <Link
          to="/register"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Publier une annonce
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Annonce
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vues
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.title}</div>
                        <div className="text-sm text-gray-500">{formatDate(product.createdAt)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.views}</div>
                    <div className="text-sm text-gray-500">{product.favorites} favoris</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(product.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/products/${product.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <FiEye className="w-4 h-4" />
                      </Link>
                      <button className="text-blue-600 hover:text-blue-900">
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderMessagesTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Messages reçus</h3>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
            <p className="text-gray-600">Vous n'avez pas encore reçu de messages.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {messages.map(message => (
              <div key={message.id} className={`p-6 hover:bg-gray-50 ${!message.isRead ? 'bg-blue-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {message.sender.firstName[0]}{message.sender.lastName[0]}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">
                          {message.sender.firstName} {message.sender.lastName}
                        </p>
                        {!message.isRead && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            Nouveau
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{message.subject}</p>
                      <p className="text-xs text-gray-500">{formatDate(message.createdAt)}</p>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-900">
                    <FiEye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Paramètres du compte</h3>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Informations personnelles</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input
                  type="text"
                  defaultValue={user.firstName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  defaultValue={user.lastName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  defaultValue={user.phone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Sécurité</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Laissez vide pour ne pas changer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Confirmez le nouveau mot de passe"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Sauvegarder les modifications
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'profile', name: 'Profil', icon: FiUser },
    { id: 'products', name: 'Mes annonces', icon: FiEye },
    { id: 'messages', name: 'Messages', icon: FiMessageSquare },
    { id: 'settings', name: 'Paramètres', icon: FiSettings }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon compte</h1>
        <p className="text-gray-600">Gérez votre profil, vos annonces et vos paramètres</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && renderProfileTab()}
      {activeTab === 'products' && renderProductsTab()}
      {activeTab === 'messages' && renderMessagesTab()}
      {activeTab === 'settings' && renderSettingsTab()}
    </div>
  )
}

export default Profile 