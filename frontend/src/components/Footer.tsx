const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">E-Commerce Boh</h3>
            <p className="text-gray-300 mb-4">
              Plateforme e-commerce moderne pour acheter et vendre des produits en toute sécurité.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              <li>
                <a href="/products" className="text-gray-300 hover:text-white transition-colors">
                  Produits
                </a>
              </li>
              <li>
                <a href="/categories" className="text-gray-300 hover:text-white transition-colors">
                  Catégories
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors">
                  À propos
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/help" className="text-gray-300 hover:text-white transition-colors">
                  Aide
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-300">
            © 2024 E-Commerce Boh. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 