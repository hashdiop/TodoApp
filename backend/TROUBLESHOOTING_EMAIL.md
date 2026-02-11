# 🔧 Dépannage - Récupération de Mot de Passe

## Problème : "Server error during password reset request"

### Solutions

#### 1. Mode Développement (Sans Configuration Email)

Si vous êtes en développement et n'avez pas encore configuré l'email, l'application affichera maintenant le lien de réinitialisation dans la console du serveur.

**Vérifiez la console du serveur backend** - vous verrez quelque chose comme :
```
📧 ===== PASSWORD RESET (DEVELOPMENT MODE) =====
Email: votre@email.com
Reset URL: http://localhost:3000/reset-password/abc123...
===============================================
```

Copiez ce lien et utilisez-le directement dans votre navigateur.

#### 2. Configuration Email Complète

Pour utiliser l'envoi d'email réel, configurez ces variables dans votre `.env` :

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_application
FRONTEND_URL=http://localhost:3000
```

#### 3. Configuration Gmail

**Étape 1 : Activer l'authentification à deux facteurs**
- Allez sur https://myaccount.google.com/security
- Activez "Validation en deux étapes"

**Étape 2 : Générer un mot de passe d'application**
- Allez sur https://myaccount.google.com/apppasswords
- Sélectionnez "Mail" comme application
- Sélectionnez "Autre (nom personnalisé)" comme appareil
- Entrez "TodoApp" comme nom
- Cliquez sur "Générer"
- **Copiez le mot de passe de 16 caractères** (sans espaces)
- Utilisez ce mot de passe dans `EMAIL_PASS` (PAS votre mot de passe Gmail normal)

**Étape 3 : Vérifier la configuration**
- Redémarrez votre serveur backend
- Essayez à nouveau la récupération de mot de passe
- Vérifiez les logs du serveur pour voir les erreurs détaillées

#### 4. Vérification des Erreurs

Les erreurs détaillées sont maintenant affichées dans la console du serveur. Recherchez :
- `❌ Email server verification failed` - Problème de connexion au serveur email
- `❌ Error sending password reset email` - Erreur lors de l'envoi

#### 5. Erreurs Courantes

**Erreur : "Invalid login"**
- Vérifiez que vous utilisez un **mot de passe d'application** (pas votre mot de passe Gmail)
- Vérifiez que l'authentification à deux facteurs est activée

**Erreur : "Connection timeout"**
- Vérifiez votre connexion internet
- Vérifiez que le port 587 n'est pas bloqué par votre firewall

**Erreur : "Email configuration is missing"**
- Vérifiez que toutes les variables EMAIL_* sont définies dans `.env`
- Redémarrez le serveur après avoir modifié `.env`

#### 6. Test Rapide

Pour tester sans configuration email complète :
1. Assurez-vous que `NODE_ENV=development` dans votre `.env`
2. Lancez la récupération de mot de passe
3. Regardez la console du serveur pour le lien de réinitialisation
4. Copiez le lien et utilisez-le dans votre navigateur

#### 7. Alternative : Utiliser un autre service email

Vous pouvez utiliser d'autres services que Gmail :

**Outlook/Hotmail :**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
```

**Yahoo :**
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
```

**SendGrid (Recommandé pour production) :**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=votre_api_key_sendgrid
```
