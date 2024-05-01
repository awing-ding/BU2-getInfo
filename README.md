# Pré-requis 
- [Node.js et npm installé sur votre machine](https://learn.microsoft.com/fr-fr/windows/dev-environment/javascript/nodejs-on-windows)
- [Le mode projet de l'API](https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication?id=setting-up-your-quotapplicationquot) doit être en place
- [Un compte de service](https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication?id=service-account) doit exister

# Installation
1. Cloner le code source
1. Ouvrir le powershell dans le dossier du projet
2. Installer les dépendances
```bash
npm install
```
3. Créer un fichier `.env` à la racine du projet et ajouter les variables d'environnement suivantes :
```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email
GOOGLE_PRIVATE_KEY=your-private-key

TOKEN=discord-bot-token
```
* `GOOGLE_SERVICE_ACCOUNT_EMAIL` et `GOOGLE_PRIVATE_KEY` sont les informations de votre compte de service Google du fichier json fourni par google. `TOKEN` est le token de votre bot Discord.
4. Créer le fichier `sheets.json` à la racine du projet et le compléter ainsi
```json
{
    "ID-de-la-première-fiche": "id-du-salon-discord",
    "ID-de-la-deuxième-fiche": "id-du-salon-discord",
    ...
}
```
5. Lancer le bot
```bash
node index.js
```
