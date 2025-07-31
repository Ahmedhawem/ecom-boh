# Guide de Démarrage Rapide - E-Commerce Boh

## 🚀 Démarrage du Projet

### Prérequis
- Node.js (v18+)
- npm ou yarn
- PostgreSQL (optionnel pour le moment)
- Redis (optionnel pour le moment)

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
# Pour le développement, vous pouvez laisser les valeurs par défaut
```

3. **Démarrer le développement :**
```bash
# Démarrer le backend et frontend simultanément
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
│   │   ├── models/         # Modèles de données
│   │   ├── routes/         # Routes API
│   │   ├── services/       # Logique métier
│   │   ├── utils/          # Utilitaires
│   │   └── index.ts        # Point d'entrée
│   ├── prisma/             # Configuration base de données
│   └── package.json
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── hooks/          # Hooks personnalisés
│   │   ├── services/       # Services API
│   │   ├── utils/          # Utilitaires
│   │   └── types/          # Types TypeScript
│   └── package.json
└── package.json            # Scripts globaux
```

## 🌐 URLs de Développement

- **Frontend :** http://localhost:3000
- **Backend API :** http://localhost:5000
- **Health Check :** http://localhost:5000/health

## 📋 Prochaines Étapes

### Phase 2 : Base de Données
1. Installer PostgreSQL
2. Configurer la base de données
3. Exécuter les migrations Prisma

### Phase 3 : Backend
1. Implémenter l'authentification JWT
2. Créer les APIs REST
3. Gestion des fichiers

### Phase 4 : Frontend
1. Intégrer les APIs
2. Gestion d'état
3. Interface utilisateur complète

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
```

## 🐛 Dépannage

### Problèmes courants :

1. **Port déjà utilisé :**
   - Backend : Modifier `PORT` dans `backend/.env`
   - Frontend : Modifier dans `frontend/vite.config.ts`

2. **Erreurs de dépendances :**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Problèmes TypeScript :**
   ```bash
   npm run build:backend
   npm run build:frontend
   ```

## 📚 Documentation

- **Documentation complète :** `DOCUMENTATION_ETAPES.md`
- **README principal :** `README.md`

## 🎯 Statut Actuel

✅ **Phase 1.2 : Configuration de l'Environnement de Développement** - TERMINÉE
- Structure du projet créée
- Configuration TypeScript
- Scripts de développement
- Pages de base du frontend

🔄 **Prochaine étape :** Phase 2 - Base de Données 