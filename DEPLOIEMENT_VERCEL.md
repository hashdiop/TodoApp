# Déploiement TodoApp sur Vercel (en deux temps)

Tu peux déployer **frontend** et **backend** séparément sur Vercel. C’est possible et recommandé.

---

## Prérequis

1. Compte [Vercel](https://vercel.com)
2. Base **MongoDB** en ligne (ex: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) gratuit)
3. Projet poussé sur **GitHub** (ou GitLab / Bitbucket)

---

## Étape 1 : Déployer le Backend

1. Va sur [vercel.com](https://vercel.com) et connecte-toi.
2. **New Project** → importe ton repo.
3. **Root Directory** : mets `backend` (pour ne déployer que le backend).
4. **Framework Preset** : `Other`.
5. Variables d’environnement :
   - `MONGODB_URI` → ton URI Atlas (ex: `mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/todoapp_db`)
   - `JWT_SECRET` → une clé secrète forte
   - `FRONTEND_URL` → `https://ton-frontend.vercel.app` (tu pourras mettre l’URL réelle du front après)
   - Optionnel (pour le reset mot de passe) : `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`
6. Clique sur **Deploy**.
7. Note l’URL du backend, par ex : `https://ton-backend-xxx.vercel.app`.

---

## Étape 2 : Déployer le Frontend

1. **New Project** → importe le **même repo**.
2. **Root Directory** : mets `frontend`.
3. **Framework Preset** : détecté automatiquement (Create React App).
4. Variable d’environnement :
   - `REACT_APP_API_URL` → `https://ton-backend-xxx.vercel.app/api`
5. Clique sur **Deploy**.
6. Note l’URL du frontend, par ex : `https://ton-frontend-xxx.vercel.app`.

---

## Étape 3 : Mettre à jour le Backend

1. Retourne dans le projet **backend** sur Vercel.
2. **Settings** → **Environment Variables**.
3. Mets à jour `FRONTEND_URL` avec l’URL réelle du frontend (ex: `https://ton-frontend-xxx.vercel.app`).
4. Redéploie le backend si besoin.

---

## Résumé

| Projet   | Root Directory | Variables principales           |
|----------|----------------|---------------------------------|
| Backend  | `backend`      | `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL` |
| Frontend | `frontend`     | `REACT_APP_API_URL`             |

---

## Déploiement en local (test)

```bash
# Backend
cd backend
vercel

# Frontend
cd frontend
vercel
```

---

## Dépannage (Chrome / 404)

- **404 en ouvrant ou en rafraîchissant une URL** (ex. `/todos`, `/login`) : le `vercel.json` du frontend contient maintenant des `rewrites` pour que toutes les routes renvoient vers `index.html` (SPA). Redéploie le frontend après la mise à jour.
- **Requêtes API bloquées (CORS)** : vérifie que `REACT_APP_API_URL` pointe bien vers l’URL du backend (ex. `https://ton-backend-xxx.vercel.app/api`) et que le backend a bien `FRONTEND_URL` avec l’URL du front.
- **Page blanche dans Chrome** : ouvre les DevTools (F12) → onglet Console et Network pour voir les erreurs éventuelles.

---

## Note MongoDB Atlas

- Crée une base, puis un utilisateur.
- Dans **Network Access**, ajoute `0.0.0.0/0` pour autoriser Vercel.
- Récupère l’URI de connexion et mets-la dans `MONGODB_URI`.
