# Guide de Démarrage Rapide - E-Commerce Boh

## 🚀 Démarrage du Projet

### Prérequis
- Node.js (v18+)
- npm ou yarn
- PostgreSQL (requis pour le backend)
- Compte Cloudinary (pour l'upload d'images)

### Installation

1. **Installer les dépendances principales :**
```bash
npm run install:all
```

2. **Configurer l'environnement :**
```bash
# Copier le fichier d'exemple
cp backend/env.example backend/.env

# Éditer le fichier .env avec vos configurations
# Variables requises :
# DATABASE_URL="postgresql://username:password@localhost:5432/ecom_boh"
# JWT_SECRET="votre-secret-jwt"
# CLOUDINARY_CLOUD_NAME="votre-cloud-name"
# CLOUDINARY_API_KEY="votre-api-key"
# CLOUDINARY_API_SECRET="votre-api-secret"
```

3. **Configurer la base de données :**
```bash
# Générer le client Prisma
cd backend && npx prisma generate

# Exécuter les migrations
npx prisma migrate dev

# Seeder la base de données (optionnel)
npx prisma db seed

# Ouvrir Prisma Studio pour visualiser les données
npx prisma studio
```

4. **Démarrer le développement :**
```bash
# Démarrer backend et frontend simultanément
npm run dev

# Ou démarrer séparément :
npm run dev:backend  # Port 5000
npm run dev:frontend # Port 3000
```

## 📁 Structure du Projet

```
ecom-boh/
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── controllers/    # Contrôleurs API
│   │   ├── middleware/     # Middlewares Express
│   │   ├── routes/         # Routes API
│   │   ├── services/       # Logique métier
│   │   ├── types/          # Types TypeScript
│   │   ├── utils/          # Utilitaires
│   │   └── lib/            # Bibliothèques
│   ├── prisma/             # Configuration base de données
│   └── package.json
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   └── utils/          # Utilitaires
│   └── package.json
└── package.json            # Scripts globaux
```

## 🌐 URLs de Développement

- **Frontend :** http://localhost:3000
- **Backend API :** http://localhost:5000
- **Health Check :** http://localhost:5000/health
- **Prisma Studio :** http://localhost:5555

## 🔧 Configuration Avancée

### Variables d'Environnement Backend (.env)
```env
# Base de données
DATABASE_URL="postgresql://username:password@localhost:5432/ecom_boh"

# Authentification
JWT_SECRET="votre-secret-jwt-super-securise"
JWT_REFRESH_SECRET="votre-refresh-secret"

# Serveur
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# Cloudinary (pour l'upload d'images)
CLOUDINARY_CLOUD_NAME="votre-cloud-name"
CLOUDINARY_API_KEY="votre-api-key"
CLOUDINARY_API_SECRET="votre-api-secret"

# Email (optionnel)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="votre-mot-de-passe-app"
```

### Configuration Frontend
Le frontend utilise les variables d'environnement de Vite :
```env
VITE_API_URL=http://localhost:5000/api
```

## 📋 Prochaines Étapes

### Phase 2 : Base de Données ✅ COMPLÉTÉE
- ✅ Installer PostgreSQL
- ✅ Configurer la base de données
- ✅ Exécuter les migrations Prisma

### Phase 3 : Backend 🔄 EN COURS (60%)
- ✅ Implémenter l'authentification JWT
- ✅ Créer les APIs REST
- ✅ Gestion des fichiers avec Cloudinary
- 🔄 API Admin complète
- 🔄 Système de messagerie

### Phase 4 : Frontend ✅ MAJORITAIREMENT COMPLÉTÉE (90%)
- ✅ Intégrer les APIs
- ✅ Gestion d'état avec React Query
- ✅ Interface utilisateur complète
- 🔄 Tests et optimisations

### Phase 5 : Intégration 🔄 EN COURS (30%)
- 🔄 Connexion frontend-backend
- 🔄 Gestion des états de chargement
- 🔄 Tests fonctionnels

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev              # Démarre backend + frontend
npm run dev:backend      # Démarre seulement le backend
npm run dev:frontend     # Démarre seulement le frontend

# Build
npm run build            # Build backend + frontend
npm run build:backend    # Build seulement le backend
npm run build:frontend   # Build seulement le frontend

# Base de données
npm run db:migrate       # Exécute les migrations
npm run db:seed          # Insère les données de test
npm run db:studio        # Ouvre Prisma Studio

# Tests
npm run test             # Lance tous les tests
npm run test:backend     # Tests backend
npm run test:frontend    # Tests frontend

# Installation
npm run install:all      # Installe toutes les dépendances
```

## 🚀 Nouvelles Fonctionnalités

### ✅ Backend API Complète
- **Authentification JWT** avec refresh tokens
- **API des utilisateurs** avec gestion de profil
- **API des produits** avec CRUD complet
- **API des catégories** pour la classification
- **API des avis** pour les évaluations
- **Upload d'images** avec Cloudinary
- **Middleware de sécurité** (Helmet, Rate Limiting)
- **Gestion d'erreurs** centralisée

### ✅ Frontend Avancé
- **Gestion d'état optimisée** avec React Query et Zustand
- **Animations fluides** avec Framer Motion
- **Formulaires robustes** avec React Hook Form
- **Notifications toast** avec React Hot Toast
- **Interface responsive** complète
- **Galerie d'images** interactive

### ✅ Base de Données
- **Schéma Prisma** complet avec relations
- **Migrations** pour la gestion des versions
- **Seeders** pour les données de test
- **Indexation** pour les performances

## 🐛 Dépannage

### Problèmes courants :

1. **Port déjà utilisé :**
   - Backend : Modifier `PORT` dans `backend/.env`
   - Frontend : Modifier dans `frontend/vite.config.ts`

2. **Erreurs de dépendances :**
   ```bash
   rm -rf node_modules package-lock.json
   npm run install:all
   ```

3. **Problèmes TypeScript :**
   ```bash
   npm run build:backend
   npm run build:frontend
   ```

4. **Problèmes de base de données :**
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate reset
   npx prisma db seed
   ```

5. **Problèmes Cloudinary :**
   - Vérifier les variables d'environnement
   - S'assurer que le compte Cloudinary est configuré
   - Vérifier les permissions de l'API

## 📚 Documentation

- **Documentation complète :** `DOCUMENTATION_ETAPES.md`
- **README principal :** `README.md`
- **API Documentation :** http://localhost:5000/health

## 🎯 Statut Actuel

✅ **Phase 1.2 : Configuration de l'Environnement de Développement** - TERMINÉE
- Structure du projet créée
- Configuration TypeScript
- Scripts de développement
- Pages de base du frontend

✅ **Phase 2 : Base de Données** - TERMINÉE
- PostgreSQL configuré
- Schéma Prisma défini
- Migrations créées
- Seeders implémentés

🔄 **Phase 3 : Backend** - EN COURS (60%)
- Authentification JWT complète
- APIs REST implémentées
- Upload d'images fonctionnel
- Sécurité renforcée

✅ **Phase 4 : Frontend** - MAJORITAIREMENT COMPLÉTÉE (90%)
- Interface utilisateur complète
- Gestion d'état optimisée
- Animations et UX avancées

🔄 **Prochaine étape :** Finaliser l'intégration frontend-backend 