# 🚀 Guide de Démarrage Rapide - TodoApp

## 📋 Informations Nécessaires

Avant de commencer, vous aurez besoin des informations suivantes :

### 1. MongoDB
- **URI de connexion** : `mongodb://localhost:27017` (par défaut)
- **Nom de la base de données** : `todoapp_db` (configurable)

### 2. Configuration Email (pour la récupération de mot de passe)
- **Service email** : Gmail recommandé
- **Email** : Votre adresse email
- **Mot de passe d'application** : Généré depuis votre compte Gmail

### 3. JWT Secret
- Un secret fort pour signer les tokens JWT (généré automatiquement dans l'exemple)

## ⚙️ Configuration Étape par Étape 

### Étape 1 : Configuration Backend

1. Allez dans le dossier `backend`
2. Copiez `env.example.txt` vers `.env`
3. Modifiez le fichier `.env` avec vos informations :

```env
# MongoDB - Modifiez si nécessaire
MONGODB_URI=mongodb://localhost:27017/todoapp_db

# JWT Secret - Changez pour un secret fort en production
JWT_SECRET=votre_secret_jwt_tres_securise_12345

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_application

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Étape 2 : Configuration Frontend

1. Allez dans le dossier `frontend`
2. Créez un fichier `.env` avec :

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Étape 3 : Installation des Dépendances

**Backend :**
```bash
cd backend
npm install
```

**Frontend :**
```bash
cd frontend
npm install
```

### Étape 4 : Démarrer MongoDB

Assurez-vous que MongoDB est installé et en cours d'exécution :

```bash
# Windows (si MongoDB est installé en service, il démarre automatiquement)
# Sinon, démarrez MongoDB manuellement

# Vérifiez que MongoDB fonctionne
mongod --version
```

### Étape 5 : Démarrer l'Application

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm start
```

## 📧 Configuration Email Gmail

Pour utiliser Gmail pour l'envoi d'emails de réinitialisation :

1. **Activez l'authentification à deux facteurs** sur votre compte Gmail
2. **Générez un mot de passe d'application** :
   - Allez dans : https://myaccount.google.com/apppasswords
   - Sélectionnez "Mail" et "Autre (nom personnalisé)"
   - Entrez "TodoApp" comme nom
   - Copiez le mot de passe généré (16 caractères)
3. **Utilisez ce mot de passe** dans `EMAIL_PASS` du fichier `.env`

## 🔐 Sécurité

- **JWT_SECRET** : Utilisez un secret fort et unique en production
- **Mots de passe** : Minimum 6 caractères (recommandé : 12+ avec majuscules, minuscules, chiffres, symboles)
- **MongoDB** : En production, utilisez MongoDB Atlas avec authentification

## ✅ Vérification

Une fois tout configuré :

1. Ouvrez http://localhost:3000
2. Créez un compte
3. Connectez-vous
4. Ajoutez des tâches
5. Testez la récupération de mot de passe

## 🐛 Dépannage

### Erreur de connexion MongoDB
- Vérifiez que MongoDB est en cours d'exécution
- Vérifiez l'URI dans `.env`

### Erreur d'envoi d'email
- Vérifiez les identifiants email dans `.env`
- Assurez-vous d'utiliser un mot de passe d'application (pas votre mot de passe Gmail)

### Erreur CORS
- Vérifiez que `FRONTEND_URL` dans le backend correspond à l'URL du frontend

## 📝 Notes

- Le système de récupération de mot de passe utilise **nodemailer** (pas Firebase directement)
- Les tokens de réinitialisation expirent après **1 heure**
- Les tokens JWT expirent après **7 jours**
