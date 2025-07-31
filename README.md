# 🛒 E-Commerce Boh - Plateforme Marketplace

Une plateforme e-commerce moderne inspirée de Tayara.tn, permettant aux utilisateurs d'acheter et vendre des produits avec une interface intuitive et des fonctionnalités avancées.

## ✨ Fonctionnalités Principales

### 🏠 **Page d'Accueil**
- Design moderne avec sections héro
- Présentation des fonctionnalités principales
- Navigation intuitive vers les annonces

### 🔍 **Recherche et Filtrage**
- Recherche par mot-clé dans les titres et descriptions
- Filtrage par catégories (Véhicules, Immobilier, Électronique, etc.)
- Tri par prix (croissant/décroissant) et date
- Affichage du nombre de résultats trouvés

### 📱 **Interface des Annonces**
- Affichage en grille responsive
- Cartes d'annonces avec images, prix, localisation
- Informations du vendeur et date de publication
- États de chargement et messages informatifs

### 🖼️ **Galerie de Produits**
- Galerie d'images avec miniatures
- Navigation entre les photos
- Image principale mise en avant
- Interface intuitive pour visualiser les produits

### 👤 **Profil Utilisateur Complet**
- **Onglet Profil** : Informations personnelles et statistiques
- **Onglet Mes Annonces** : Gestion des annonces avec statuts
- **Onglet Messages** : Système de messagerie
- **Onglet Paramètres** : Modification des informations

### 📝 **Publication d'Annonces**
- Processus en 3 étapes guidé
- **Étape 1** : Création du compte utilisateur
- **Étape 2** : Détails de l'annonce (titre, catégorie, prix, description)
- **Étape 3** : Upload d'images et finalisation
- Validation des données et acceptation des termes

### 💬 **Système de Contact**
- Modal de contact pour contacter les vendeurs
- Formulaire avec nom, téléphone et message
- Informations détaillées du vendeur
- Conseils de sécurité pour les transactions

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **React Router** pour la navigation
- **Tailwind CSS** pour le styling
- **React Icons** pour les icônes
- **React Hook Form** pour les formulaires

### Backend
- **Node.js** avec Express
- **TypeScript** pour le typage
- **Prisma** comme ORM
- **PostgreSQL** comme base de données
- **JWT** pour l'authentification

### Base de Données
- **PostgreSQL** pour les données principales
- **Schéma Prisma** avec relations complètes
- **Migrations** pour la gestion des versions

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 18 ou supérieure)
- PostgreSQL
- npm ou yarn

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/ecom-boh.git
cd ecom-boh
```

2. **Installer les dépendances du backend**
```bash
cd backend
npm install
```

3. **Configurer la base de données**
```bash
# Copier le fichier d'environnement
cp env.example .env

# Modifier les variables d'environnement dans .env
# DATABASE_URL="postgresql://username:password@localhost:5432/ecom_boh"

# Générer le client Prisma
npx prisma generate

# Exécuter les migrations
npx prisma migrate dev

# Seeder la base de données (optionnel)
npx prisma db seed
```

4. **Installer les dépendances du frontend**
```bash
cd ../frontend
npm install
```

5. **Démarrer le développement**

**Backend :**
```bash
cd backend
npm run dev
```

**Frontend :**
```bash
cd frontend
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173` et le backend sur `http://localhost:3000`.

## 📁 Structure du Projet

```
ecom-boh/
├── backend/                 # API Backend
│   ├── src/
│   │   ├── controllers/    # Contrôleurs API
│   │   ├── middleware/     # Middlewares Express
│   │   ├── routes/         # Routes API
│   │   ├── services/       # Logique métier
│   │   ├── types/          # Types TypeScript
│   │   └── utils/          # Utilitaires
│   ├── prisma/             # Schéma et migrations
│   └── package.json
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── services/       # Services API
│   │   └── utils/          # Utilitaires
│   └── package.json
└── README.md
```

## 🎯 Fonctionnalités Similaires à Tayara.tn

### ✅ **Implémentées**
- **Recherche avancée** avec filtres multiples
- **Affichage en grille** des annonces
- **Galerie d'images** avec navigation
- **Système de contact** entre utilisateurs
- **Gestion de profil** complète
- **Publication d'annonces** avec upload d'images
- **Interface responsive** mobile/desktop
- **Design moderne** avec animations

### 🔄 **En cours de développement**
- **Système d'avis** et évaluations
- **Dashboard administrateur**
- **Notifications en temps réel**
- **Système de paiement**
- **Intégration API complète**

## 📊 État du Projet

| Phase | Statut | Progression |
|-------|--------|-------------|
| **Phase 1: Planification** | ✅ Complétée | 100% |
| **Phase 2: Base de Données** | ✅ Complétée | 100% |
| **Phase 3: Backend** | 🔄 En cours | 25% |
| **Phase 4: Frontend** | ✅ Majoritairement complétée | 85% |
| **Phase 5: Intégration** | 🔄 En cours | 10% |
| **Phase 6: Déploiement** | 🔄 À faire | 0% |

**Progression globale**: ~60%

## 🎨 Interface Utilisateur

### Design Moderne
- **Tailwind CSS** pour un design cohérent
- **Animations fluides** et transitions
- **Interface responsive** adaptée à tous les écrans
- **Loading states** et états vides informatifs

### Expérience Utilisateur
- **Navigation intuitive** avec breadcrumbs
- **Recherche instantanée** avec filtres
- **Galerie d'images** interactive
- **Formulaires guidés** pour la publication

## 🔧 Configuration

### Variables d'Environnement Backend
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ecom_boh"
JWT_SECRET="votre-secret-jwt"
PORT=3000
NODE_ENV=development
```

### Variables d'Environnement Frontend
```env
VITE_API_URL=http://localhost:3000/api
```

## 🧪 Tests

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 📦 Scripts Disponibles

### Backend
```bash
npm run dev          # Démarrage en mode développement
npm run build        # Build de production
npm run start        # Démarrage en mode production
npm run test         # Exécution des tests
```

### Frontend
```bash
npm run dev          # Démarrage du serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualisation du build
npm run test         # Exécution des tests
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**Développé avec ❤️ pour créer une plateforme e-commerce moderne et intuitive** 