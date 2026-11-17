# 💄 Makeup Brands API & Directory

> Backend Node.js / Express 5 fournissant un annuaire interactif avec rendu côté serveur (SSR) et une API REST JSON complète pour explorer plus de 200 marques internationales de maquillage et cosmétiques.

🌐 **Déploiement en ligne (Production Vercel) :** [https://makeupbrandslist-api.vercel.app](https://makeupbrandslist-api.vercel.app)  
📊 **Rapport de tests complet :** [Consulter RAPPORT_TESTS.md](./RAPPORT_TESTS.md)  
🛠️ **Historique des modifications :** [Consulter le dossier changes/](./changes)

---

## 🌟 Fonctionnalités

- 🌐 **Interface Web avec Rendu Serveur (SSR) :**
  - Tableau HTML dynamique, moderne et entièrement stylisé.
  - Formulaire de recherche textuelle instantanée (insensible à la casse).
  - Menus déroulants de filtrage par catégorie (*Luxury, Prestige, Mass Market...*) et par pays d'origine (*France, USA, Italie, Corée du Sud, Japon...*).
  - Maintien de l'état des filtres dans l'URL et les sélecteurs.
  - Badges colorés thématiques par typologie de marque.
- ⚡ **API REST JSON Performante :**
  - Consultation globale paginable/filtrable avec métadonnées (`count` et `data`).
  - Endpoint allégé projetant uniquement les noms et sites web (`/api/brands-list`), idéal pour alimenter des menus déroulants et composants d'autocomplétion frontend.
  - Endpoint unitaire ciblant une marque par son identifiant unique (`/api/brands/:id`).
- 🛡️ **Sécurité & Intégration :**
  - **Middleware CORS activé** (`cors`) pour une communication sans friction avec n'importe quelle application cliente frontend (React, Vue, Svelte, Angular ou Vanilla JS).
  - **Protection XSS intégrée** (`escapeHTML`) échappant les entrées utilisateurs avant injection dans le gabarit HTML.
  - **Architecture moderne ES Modules (`"type": "module"`)** et **Express 5**.
  - **Prêt pour le Cloud Serverless** avec Vercel et rechargement à chaud local via `nodemon`.

---

## 📁 Structure du Projet

```text
makeupBrands-api/
├── .env                  # Configuration locale des variables d'environnement (PORT)
├── .gitignore            # Fichiers exclus du versionnage Git
├── vercel.json           # Configuration de routage Serverless pour Vercel
├── package.json          # Manifeste du projet, dépendances et scripts
├── package-lock.json     # Arbre de dépendances verrouillé
├── server.js             # Serveur Express, logique de rendu SSR et routes API REST
├── api/
│   └── index.js          # Point d'entrée Serverless Vercel
├── data/
│   └── brands.js         # Base de données locale de 200 marques de beauté
├── docs/                 # Documentation technique détaillée ligne par ligne
│   ├── server.md         # Explication approfondie ligne par ligne de server.js
│   ├── brands.md         # Explication du jeu de données et structure de brands.js
│   ├── package.json.md   # Explication de package.json et des paquets npm
│   └── env.md            # Explication des variables d'environnement et sécurité
├── changes/              # Détail de chaque modification apportée pour corriger l'API
│   ├── change1.md        # Résolution de l'import/export de brands.js
│   ├── change2.md        # Correction de la casse escapeHtml -> escapeHTML
│   ├── change3.md        # Correction de l'inversion 404 sur /api/brands/:id
│   ├── change4.md        # Sécurisation du port réseau avec valeur de repli
│   └── change5.md        # Configuration pour le déploiement serverless Vercel
├── RAPPORT_TESTS.md      # Rapport complet d'exécution et de validation des tests
└── README.md             # Guide d'utilisation et présentation générale
```

---

## 🚀 Installation et Démarrage Rapide

### Prérequis
- [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
- [npm](https://www.npmjs.com/) (inclus avec Node.js)

### 1. Cloner le projet
```bash
git clone git@github.com:keciramounir97/makeupBrandsList-api.git
cd makeupBrandsList-api
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'environnement
Vérifiez ou créez le fichier `.env` à la racine :
```env
PORT=5000
```

### 4. Lancer l'application

#### Mode Développement (avec rechargement automatique) :
```bash
npm run dev
```

#### Mode Production :
```bash
npm start
```

Le terminal affiche alors :
```text
Serveur Démarré : http://localhost:5000
Tableau des Marques : http://localhost:5000/
Api JSON : http://localhost:5000/api/brands
```

---

## 📖 Spécification des Endpoints de l'API

### 1. Annuaire Visuel (HTML SSR)
- **URL :** `GET /`
- **Description :** Retourne la page web complète avec l'annuaire, les formulaires de recherche et le tableau stylisé.
- **Paramètres Query (optionnels) :**
  - `search` *(string)* : Recherche textuelle dans le nom de la marque.
  - `category` *(string)* : Filtre par catégorie (`luxury`, `prestige`, `mass`, etc.).
  - `country` *(string)* : Filtre par pays d'origine (`France`, `USA`, `Italy`...).
- **Exemple d'URL :**
  ```text
  https://makeupbrandslist-api.vercel.app/?search=dior&category=luxury
  ```

---

### 2. Récupérer toutes les marques (JSON)
- **URL :** `GET /api/brands`
- **Description :** Retourne le tableau des marques filtré au format JSON avec le compteur de résultats.
- **Paramètres Query (optionnels) :**
  - `search` *(string)* : Recherche partielle dans le nom.
  - `category` *(string)* : Filtrage par catégorie.
  - `country` *(string)* : Filtrage par pays.
- **Exemple de Requête :**
  ```bash
  curl "https://makeupbrandslist-api.vercel.app/api/brands?country=France&category=Luxury"
  ```
- **Exemple de Réponse (`200 OK`) :**
  ```json
  {
    "count": 9,
    "data": [
      {
        "id": 1,
        "name": "Chanel",
        "website": "https://www.chanel.com",
        "country": "France",
        "category": "Luxury"
      },
      {
        "id": 2,
        "name": "Dior",
        "website": "https://www.dior.com",
        "country": "France",
        "category": "Luxury"
      }
    ]
  }
  ```

---

### 3. Liste Allégée (Noms & Sites Web)
- **URL :** `GET /api/brands-list`
- **Description :** Retourne une projection allégée des marques (`name` et `website`), idéale pour les sélecteurs ou listes compactes.
- **Exemple de Requête :**
  ```bash
  curl "https://makeupbrandslist-api.vercel.app/api/brands-list"
  ```
- **Exemple de Réponse (`200 OK`) :**
  ```json
  [
    {
      "name": "Chanel",
      "website": "https://www.chanel.com"
    },
    {
      "name": "Dior",
      "website": "https://www.dior.com"
    }
  ]
  ```

---

### 4. Récupérer une marque par son ID
- **URL :** `GET /api/brands/:id`
- **Description :** Retourne les informations détaillées d'une marque spécifique à partir de son identifiant numérique.
- **Paramètre d'URL :**
  - `:id` *(integer)* : L'identifiant unique de la marque (entre 1 et 200).
- **Exemple de Requête :**
  ```bash
  curl "https://makeupbrandslist-api.vercel.app/api/brands/1"
  ```
- **Exemple de Réponse (`200 OK`) :**
  ```json
  {
    "id": 1,
    "name": "Chanel",
    "website": "https://www.chanel.com",
    "country": "France",
    "category": "Luxury"
  }
  ```
- **Exemple de Réponse pour ID inexistant (`404 Not Found`) :**
  ```json
  {
    "error": "marque Non Trouvée"
  }
  ```

---

## 📚 Documentation Technique Détaillée

Pour comprendre en profondeur le fonctionnement de chaque fichier, chaque méthode et chaque ligne de code du projet, consultez la documentation dédiée dans le dossier [`docs/`](./docs) :

- 📄 **[Documentation de server.js](./docs/server.md)** : Analyse ligne par ligne du serveur Express, des méthodes de filtrage, de l'échappement XSS et de la génération du template HTML.
- 📄 **[Documentation de data/brands.js](./docs/brands.md)** : Étude du schéma de données des 200 marques, des catégories, des pays et des exports ES Modules.
- 📄 **[Documentation de package.json](./docs/package.json.md)** : Explication des métadonnées, des scripts npm et des rôles d'Express 5, CORS et Nodemon.
- 📄 **[Documentation de .env](./docs/env.md)** : Rôle de la variable `PORT`, intégration dans Node.js et consignes de sécurité pour GitHub.

---

## 🛠️ Dossier de Correctifs (`changes/`)

Pour examiner les détails de chaque correction ayant permis de fiabiliser l'API :
- 🔧 **[change1.md](./changes/change1.md)** : Résolution du conflit d'import/export de `brands.js`.
- 🔧 **[change2.md](./changes/change2.md)** : Correction de la casse `escapeHtml` vs `escapeHTML`.
- 🔧 **[change3.md](./changes/change3.md)** : Inversion logique `if (!brand)` sur la route unitaire.
- 🔧 **[change4.md](./changes/change4.md)** : Valeur de repli réseau `PORT = process.env.PORT || 5000`.
- 🔧 **[change5.md](./changes/change5.md)** : Configuration et export serverless pour Vercel.

---

## 🛠️ Technologies Utilisées

- **Hébergement Cloud :** [Vercel](https://vercel.com/)
- **Runtime :** [Node.js](https://nodejs.org/)
- **Framework Web :** [Express 5](https://expressjs.com/)
- **Gestion des Requêtes Multi-Origines :** [CORS](https://github.com/expressjs/cors)
- **Moniteur de Développement :** [Nodemon](https://nodemon.io/)
- **Standard de Modules :** ECMAScript Modules (ESM)
- **Langages :** JavaScript (ES6+), HTML5, CSS3

---

## 📄 Licence

Ce projet est sous licence [MIT](./LICENSE).
