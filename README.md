# TodoApp - Application MERN avec Authentification

Application de gestion de tâches (TodoApp) construite avec la stack MERN (MongoDB, Express, React, Node.js) incluant l'authentification JWT, le cryptage de mots de passe, la récupération de mot de passe, et une interface utilisateur moderne avec Tailwind CSS.

## 🚀 Fonctionnalités

### Authentification
- ✅ Création de compte utilisateur
- ✅ Connexion/Déconnexion
- ✅ Cryptage des mots de passe avec bcrypt
- ✅ Authentification JWT
- ✅ Récupération de mot de passe par email

### Gestion des Tâches
- ✅ CRUD complet pour les tâches (Create, Read, Update, Delete)
- ✅ Date et heure d'exécution pour chaque tâche
- ✅ Codes couleurs selon la proximité de la date d'exécution :
  - 🔴 Rouge : Tâche en retard
  - 🟠 Orange : Aujourd'hui
  - 🟡 Jaune : Dans 1-3 jours
  - 🟢 Vert : Plus de 3 jours
- ✅ Barre de résumé avec statistiques (Total, Complétées, En attente)
- ✅ Barre de progression visuelle
- ✅ Système de filtres avancé :
  - Filtre par statut : Tout, En attente, Faites
  - Filtre par date : Toutes dates, En retard, Aujourd'hui, Cette semaine, Ce mois

### Interface Utilisateur
- ✅ Design moderne avec Tailwind CSS
- ✅ Animations fluides et transitions
- ✅ Icônes avec react-icons
- ✅ Interface responsive (mobile, tablette, desktop)
- ✅ Formulaire d'ajout masqué par défaut (révélé par bouton)
- ✅ Animations de chargement
- ✅ Effets hover et interactions

## 📋 Prérequis

- Node.js (v14 ou supérieur)
- MongoDB (local ou Atlas)
- npm ou yarn

## 🛠️ Installation

### 1. Backend

```bash
cd backend
npm install
```

### 2. Frontend

```bash
cd frontend
npm install
```

**Note :** Le frontend utilise Tailwind CSS et react-icons qui seront installés automatiquement.

## ⚙️ Configuration

### Backend (.env)

Créez un fichier `.env` dans le dossier `backend` avec les variables suivantes :

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/todoapp_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# Email Configuration (for password recovery)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

Créez un fichier `.env` dans le dossier `frontend` :

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Démarrage

### 1. Démarrer MongoDB

Assurez-vous que MongoDB est en cours d'exécution sur votre machine.

```bash
# Windows (si MongoDB est installé en service, il démarre automatiquement)
# Sinon, démarrez MongoDB manuellement

# Vérifiez que MongoDB fonctionne
mongod --version
```

### 2. Démarrer le Backend

```bash
cd backend
npm run dev
```

Le serveur backend sera accessible sur `http://localhost:5000`

### 3. Démarrer le Frontend

```bash
cd frontend
npm start
```

L'application frontend sera accessible sur `http://localhost:3000`

## 📝 Structure du Projet

```
TodoApp Advanced/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Todo.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── todos.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── emailService.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.js
│   │   │   │   ├── Register.js
│   │   │   │   ├── ForgotPassword.js
│   │   │   │   └── ResetPassword.js
│   │   │   ├── TodoApp.js
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env
├── GUIDE_DEMARRAGE.md
├── backend/TROUBLESHOOTING_EMAIL.md
├── frontend/INSTALLATION_TAILWIND.md
└── README.md
```

## 🎨 Technologies Utilisées

### Backend
- **Express.js** - Framework web Node.js
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification par tokens
- **bcryptjs** - Cryptage des mots de passe
- **nodemailer** - Envoi d'emails
- **dotenv** - Gestion des variables d'environnement
- **cors** - Gestion CORS

### Frontend
- **React** - Bibliothèque UI
- **React Router** - Routage
- **Tailwind CSS** - Framework CSS utility-first
- **react-icons** - Bibliothèque d'icônes
- **Axios** - Client HTTP
- **Context API** - Gestion d'état

## 🔐 Sécurité

- Mots de passe cryptés avec bcrypt (salt rounds: 10)
- JWT avec expiration de 7 jours
- Middleware d'authentification pour protéger les routes
- Validation des données côté serveur
- Tokens de réinitialisation avec expiration (1 heure)
- Protection CORS configurée

## 📧 Configuration Email

Pour la récupération de mot de passe, configurez un service email. Pour Gmail :

1. Activez l'authentification à deux facteurs sur votre compte Gmail
2. Générez un mot de passe d'application : https://myaccount.google.com/apppasswords
3. Utilisez ce mot de passe dans `EMAIL_PASS` (pas votre mot de passe Gmail normal)

**Note :** En mode développement, si l'email n'est pas configuré, le lien de réinitialisation s'affichera dans la console du serveur.

## 🎯 API Endpoints

### Authentification
- `POST /api/auth/register` - Créer un compte
  - Body: `{ username, email, password }`
- `POST /api/auth/login` - Se connecter
  - Body: `{ email, password }`
- `POST /api/auth/forgot-password` - Demander la réinitialisation
  - Body: `{ email }`
- `POST /api/auth/reset-password` - Réinitialiser le mot de passe
  - Body: `{ token, newPassword }`

### Todos
- `GET /api/todos` - Récupérer toutes les tâches (protégé)
- `POST /api/todos` - Créer une tâche (protégé)
  - Body: `{ title, description, dueDate }`
- `PUT /api/todos/:id` - Modifier une tâche (protégé)
  - Body: `{ title?, description?, completed?, dueDate? }`
- `DELETE /api/todos/:id` - Supprimer une tâche (protégé)
- `GET /api/todos/:id` - Récupérer une tâche (protégé)

## ✨ Fonctionnalités Détaillées

### Système de Filtres

Les filtres peuvent être combinés pour affiner la recherche :

**Filtre par statut :**
- **Tout** : Affiche toutes les tâches
- **En attente** : Affiche uniquement les tâches non complétées
- **Faites** : Affiche uniquement les tâches complétées

**Filtre par date d'exécution :**
- **Toutes dates** : Affiche toutes les tâches
- **En retard** : Affiche les tâches dont la date d'exécution est passée
- **Aujourd'hui** : Affiche les tâches à faire aujourd'hui
- **Cette semaine** : Affiche les tâches des 7 prochains jours
- **Ce mois** : Affiche les tâches du mois en cours

### Codes Couleurs

Les tâches sont automatiquement colorées selon leur date d'exécution :
- **Rouge** : Date d'exécution dépassée (en retard)
- **Orange** : Date d'exécution aujourd'hui
- **Jaune** : Date d'exécution dans 1 à 3 jours
- **Vert** : Date d'exécution dans plus de 3 jours

La couleur apparaît sur la bordure gauche de chaque tâche.

### Barre de Résumé

La barre de résumé affiche :
- **Total** : Nombre total de tâches
- **Complétées** : Nombre de tâches terminées
- **En attente** : Nombre de tâches à faire
- **Barre de progression** : Pourcentage de complétion

## 🐛 Dépannage

### Erreur de connexion MongoDB
- Vérifiez que MongoDB est en cours d'exécution
- Vérifiez l'URI dans `.env`

### Erreur d'envoi d'email
- Vérifiez les identifiants email dans `.env`
- Assurez-vous d'utiliser un mot de passe d'application (pas votre mot de passe Gmail)
- Consultez `backend/TROUBLESHOOTING_EMAIL.md` pour plus de détails

### Erreur CORS
- Vérifiez que `FRONTEND_URL` dans le backend correspond à l'URL du frontend

### Problèmes avec Tailwind CSS
- Consultez `frontend/INSTALLATION_TAILWIND.md` pour les instructions d'installation

## 📚 Documentation Supplémentaire

- `GUIDE_DEMARRAGE.md` - Guide de démarrage rapide
- `backend/TROUBLESHOOTING_EMAIL.md` - Dépannage email
- `frontend/INSTALLATION_TAILWIND.md` - Installation Tailwind CSS

## 🎨 Personnalisation

### Couleurs

Les couleurs peuvent être personnalisées dans `frontend/tailwind.config.js` :

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Vos couleurs personnalisées
      }
    }
  }
}
```

### Animations

Les animations personnalisées sont définies dans `frontend/src/index.css` et peuvent être modifiées selon vos besoins.

## 📄 Licence

ISC

## 👤 Auteur

Créé avec ❤️ pour la gestion de tâches

## 🔄 Versions

### Version 2.0
- ✨ Ajout de Tailwind CSS
- ✨ Ajout de react-icons
- ✨ Système de filtres avancé
- ✨ Date/heure d'exécution
- ✨ Codes couleurs selon l'urgence
- ✨ Barre de résumé avec statistiques
- ✨ Animations et transitions
- ✨ Design responsive amélioré

### Version 1.0
- ✅ Authentification complète
- ✅ CRUD des tâches
- ✅ Récupération de mot de passe
