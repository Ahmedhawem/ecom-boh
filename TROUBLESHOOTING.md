# 🔧 Guide de Dépannage - Erreurs Réseau

## 🚨 Erreur "Network Error"

Cette erreur indique un problème de connexion entre le frontend et le backend. Voici les étapes de diagnostic et de résolution :

### 📋 Checklist de Diagnostic

#### 1. **Vérifier que les serveurs sont démarrés**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

**Vérifications :**
- Backend accessible sur `http://localhost:5000`
- Frontend accessible sur `http://localhost:3000`
- Pas d'erreurs dans les terminaux

#### 2. **Tester la connexion backend**

```bash
# Test de santé du backend
curl http://localhost:5000/health

# Test d'un endpoint API
curl http://localhost:5000/api/categories
```

#### 3. **Vérifier les variables d'environnement**

**Backend (.env) :**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ecom_boh"
JWT_SECRET="your-secret-jwt"
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

**Frontend (env.example) :**
```env
VITE_API_URL=http://localhost:5000/api
```

#### 4. **Diagnostic automatique**

Accédez à `http://localhost:3000/network-test` pour un diagnostic automatique.

### 🔧 Solutions Courantes

#### **Problème 1: Backend non démarré**

**Symptômes :**
- Erreur "ECONNREFUSED"
- Impossible d'accéder à `http://localhost:5000`

**Solution :**
```bash
cd backend
npm install
npm run dev
```

#### **Problème 2: Base de données non connectée**

**Symptômes :**
- Backend démarre mais erreurs de base de données
- Logs mentionnant "database connection failed"

**Solution :**
```bash
# Vérifier PostgreSQL
sudo systemctl status postgresql

# Démarrer PostgreSQL si nécessaire
sudo systemctl start postgresql

# Vérifier la connexion
psql -U postgres -d ecom_boh

# Réinitialiser la base de données
cd backend
npx prisma migrate reset
npx prisma db seed
```

#### **Problème 3: CORS non configuré**

**Symptômes :**
- Erreur CORS dans la console navigateur
- Requêtes bloquées par le navigateur

**Solution :**
Vérifier la configuration CORS dans `backend/src/index.ts` :
```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))
```

#### **Problème 4: Variables d'environnement manquantes**

**Symptômes :**
- Erreurs de configuration
- URLs incorrectes

**Solution :**
```bash
# Backend
cp backend/env.example backend/.env
# Éditer backend/.env avec vos valeurs

# Frontend
cp frontend/env.example frontend/.env
# Éditer frontend/.env avec vos valeurs
```

#### **Problème 5: Ports déjà utilisés**

**Symptômes :**
- Erreur "EADDRINUSE"
- Impossible de démarrer les serveurs

**Solution :**
```bash
# Trouver les processus utilisant les ports
lsof -i :5000
lsof -i :3000

# Tuer les processus
kill -9 <PID>

# Ou changer les ports
# Backend: modifier PORT dans .env
# Frontend: modifier dans vite.config.ts
```

### 🛠️ Commandes de Diagnostic

#### **Vérifier les processus**
```bash
# Vérifier les processus Node.js
ps aux | grep node

# Vérifier les ports utilisés
netstat -tulpn | grep :5000
netstat -tulpn | grep :3000
```

#### **Vérifier les logs**
```bash
# Backend logs
cd backend && npm run dev

# Frontend logs  
cd frontend && npm run dev
```

#### **Tester l'API manuellement**
```bash
# Test de santé
curl -X GET http://localhost:5000/health

# Test des catégories
curl -X GET http://localhost:5000/api/categories

# Test avec authentification
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 🔍 Diagnostic Avancé

#### **1. Vérifier la configuration réseau**

```bash
# Test de connectivité
ping localhost

# Test des ports
telnet localhost 5000
telnet localhost 3000
```

#### **2. Vérifier les dépendances**

```bash
# Backend
cd backend
npm install
npm audit fix

# Frontend
cd frontend  
npm install
npm audit fix
```

#### **3. Réinitialiser complètement**

```bash
# Arrêter tous les processus
pkill -f node

# Nettoyer les caches
rm -rf node_modules package-lock.json
npm install

# Réinitialiser la base de données
cd backend
npx prisma migrate reset
npx prisma db seed

# Redémarrer
npm run dev
```

### 📞 Support

Si le problème persiste :

1. **Vérifiez les logs** dans la console du navigateur (F12)
2. **Vérifiez les logs** du backend dans le terminal
3. **Utilisez le diagnostic** sur `http://localhost:3000/network-test`
4. **Partagez les erreurs** exactes pour un diagnostic précis

### 🎯 Erreurs Courantes et Solutions

| Erreur | Cause | Solution |
|--------|-------|----------|
| `ECONNREFUSED` | Backend non démarré | `cd backend && npm run dev` |
| `CORS error` | Configuration CORS | Vérifier `CORS_ORIGIN` dans backend |
| `Database connection failed` | PostgreSQL non démarré | `sudo systemctl start postgresql` |
| `EADDRINUSE` | Port déjà utilisé | Changer le port ou tuer le processus |
| `Module not found` | Dépendances manquantes | `npm install` |
| `Invalid token` | Token JWT expiré | Se reconnecter |

### 🚀 Prévention

Pour éviter les erreurs réseau :

1. **Toujours démarrer le backend avant le frontend**
2. **Vérifier les variables d'environnement**
3. **S'assurer que PostgreSQL est démarré**
4. **Utiliser le diagnostic automatique** au démarrage
5. **Vérifier les logs** en cas de problème 