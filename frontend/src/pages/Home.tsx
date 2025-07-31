import { Link } from 'react-router-dom'
import { FiShoppingBag, FiUsers, FiStar } from 'react-icons/fi'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bienvenue sur E-Commerce Boh
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              La plateforme moderne pour acheter et vendre des produits en toute sécurité
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="btn bg-white text-primary-600 hover:bg-gray-100">
                Découvrir les produits
              </Link>
              <Link to="/register" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600">
                Commencer à vendre
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir E-Commerce Boh ?
            </h2>
            <p className="text-lg text-gray-600">
              Une plateforme complète et sécurisée pour tous vos besoins e-commerce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiShoppingBag className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Achat Sécurisé</h3>
              <p className="text-gray-600">
                Achetez en toute confiance avec notre système de paiement sécurisé et nos garanties.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Vente Facile</h3>
              <p className="text-gray-600">
                Vendez vos produits facilement avec notre interface intuitive et nos outils de gestion.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiStar className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Qualité Garantie</h3>
              <p className="text-gray-600">
                Tous nos produits sont vérifiés et approuvés pour garantir la qualité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Rejoignez notre communauté d'acheteurs et vendeurs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary">
              Créer un compte
            </Link>
            <Link to="/products" className="btn-secondary">
              Voir les produits
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 