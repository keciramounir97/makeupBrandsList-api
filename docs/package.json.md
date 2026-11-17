# Documentation détaillée de `package.json`

Le fichier `package.json` est le manifeste central de tout projet Node.js. Il consigne les métadonnées de l'application, configure les commandes et scripts d'exécution, définit le format des modules JavaScript utilisés et répertorie l'ensemble des dépendances nécessaires au fonctionnement et au développement du projet.

---

## Sommaire
1. [Vue d'ensemble du Fichier](#1-vue-densemble-du-fichier)
2. [Explication Ligne par Ligne](#2-explication-ligne-par-ligne)
   - [2.1 Métadonnées Générales (Lignes 1 à 5)](#21-métadonnées-générales-lignes-1-à-5)
   - [2.2 Scripts d'Exécution (Lignes 6 à 10)](#22-scripts-dexécution-lignes-6-à-10)
   - [2.3 Informations Légales et Format de Module (Lignes 11 à 14)](#23-informations-légales-et-format-de-module-lignes-11-à-14)
   - [2.4 Dépendances de Production (Lignes 15 à 18)](#24-dépendances-de-production-lignes-15-à-18)
   - [2.5 Dépendances de Développement (Lignes 19 à 21)](#25-dépendances-de-développement-lignes-19-à-21)
3. [Détail des Bibliothèques Installées](#3-détail-des-bibliothèques-installées)
4. [La Notation SemVer (`^`)](#4-la-notation-semver-)

---

## 1. Vue d'ensemble du Fichier

Voici le contenu intégral du fichier `package.json` :

```json
{
  "name": "makeupbrands-api",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "cors": "^2.8.6",
    "express": "^5.3.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```

---

## 2. Explication Ligne par Ligne

### 2.1 Métadonnées Générales (Lignes 1 à 5)

```json
  "name": "makeupbrands-api",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
```

- **Ligne 2 (`"name": "makeupbrands-api"`) :**
  - **Rôle :** Identifiant officiel du paquet sur npm.
  - **Règles :** Doit être composé uniquement de minuscules, sans espaces, et peut contenir des tirets.
- **Ligne 3 (`"version": "1.0.0"`) :**
  - **Rôle :** Numéro de version actuel selon la norme de versionnage sémantique (*SemVer* : `MAJEUR.MINEUR.PATCH`).
  - `1.0.0` désigne la première version stable et fonctionnelle de l'application.
- **Ligne 4 (`"description": ""`) :**
  - **Rôle :** Résumé succinct de l'objectif du projet pour les utilisateurs ou la publication sur le registre npm.
- **Ligne 5 (`"main": "server.js"`) :**
  - **Rôle :** Définit le point d'entrée principal (*entry point*) de l'application. Si ce module était importé par un autre paquet, Node.js chargerait automatiquement `server.js`.

---

### 2.2 Scripts d'Exécution (Lignes 6 à 10)

```json
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

- **Ligne 6 (`"scripts": {`) :**
  - Bloc contenant des raccourcis de commandes CLI automatisables via `npm run <nom_du_script>` (ou directement `npm start` / `npm test`).
- **Ligne 7 (`"start": "node server.js"`) :**
  - **Commande associée :** `npm start`
  - **Rôle :** Lance l'application avec le runtime standard Node.js. C'est le script exécuté en environnement de **production** ou sur les plateformes Cloud (Render, Heroku, Railway, etc.).
- **Ligne 8 (`"dev": "nodemon server.js"`) :**
  - **Commande associée :** `npm run dev`
  - **Rôle :** Lance l'application en mode **développement** avec l'outil `nodemon`. Dès qu'un fichier (`server.js`, `brands.js`, etc.) est modifié et enregistré, le serveur redémarre instantanément sans intervention manuelle.
- **Ligne 9 (`"test": "echo \"Error: no test specified\" && exit 1"`) :**
  - **Commande associée :** `npm test`
  - **Rôle :** Script par défaut généré lors de `npm init`, signalant qu'aucun test unitaire automatisé (ex: Jest, Mocha) n'a encore été configuré. Le code de sortie `1` indique une erreur système au terminal.

---

### 2.3 Informations Légales et Format de Module (Lignes 11 à 14)

```json
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
```

- **Ligne 11 (`"keywords": []`) :**
  - Tableau de mots-clés destinés à l'indexation et à la recherche sur le registre public npm (ex: `["makeup", "api", "express", "cosmetics"]`).
- **Ligne 12 (`"author": ""`) :**
  - Identité ou coordonnées du créateur / mainteneur du projet.
- **Ligne 13 (`"license": "ISC"`) :**
  - Spécifie la licence logicielle open-source. La licence ISC est une licence permissive et simplifiée, fonctionnellement équivalente à la licence MIT.
- **Ligne 14 (`"type": "module"`) :**
  - **Propriété capitale :** Active nativement le support des **ECMAScript Modules (ESM)** dans tout le projet.
  - **Conséquence :** Permet l'utilisation des mots-clés modernes `import` et `export` au lieu de la syntaxe CommonJS historique (`require()` et `module.exports`).

---

### 2.4 Dépendances de Production (Lignes 15 à 18)

```json
  "dependencies": {
    "cors": "^2.8.6",
    "express": "^5.3.0"
  },
```

- **Ligne 15 (`"dependencies": {`) :**
  - Liste les packages strictement indispensables pour faire tourner l'application en production. Ils sont installés lors de la commande `npm install --omit=dev`.
- **Ligne 16 (`"cors": "^2.8.6"`) :**
  - Dépendance gérant les en-têtes CORS pour sécuriser et autoriser le partage de ressources entre différentes origines web.
- **Ligne 17 (`"express": "^5.3.0"`) :**
  - Le framework web minimaliste pour Node.js.
  - **Note :** La version `^5.3.0` indique l'utilisation de la version majeure **Express 5**, apportant une meilleure prise en charge native des promesses asynchrones et des modernisations du routeur.

---

### 2.5 Dépendances de Développement (Lignes 19 à 21)

```json
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
```

- **Ligne 19 (`"devDependencies": {`) :**
  - Liste les outils et paquets utiles uniquement pendant la phase de développement local et qui ne sont pas requis sur le serveur de production.
- **Ligne 20 (`"nodemon": "^3.1.14"`) :**
  - Utilitaire de surveillance de fichiers (*file watcher*) qui redémarre automatiquement le processus Node.js à chaque détection de sauvegarde de code.

---

## 3. Détail des Bibliothèques Installées

| Nom du Paquet | Version | Rôle dans l'Architecture |
| :--- | :--- | :--- |
| **express** | `^5.3.0` | Serveur web HTTP, gestionnaire de routage (`/`, `/api/brands`), parsing des requêtes JSON, et rendu des réponses. |
| **cors** | `^2.8.6` | Middleware d'autorisation inter-domaines permettant aux applications frontend de consommer les données de l'API. |
| **nodemon** | `^3.1.14` | Accélérateur de productivité en développement évitant de stopper et relancer le terminal manuellement après chaque modification. |

---

## 4. La Notation SemVer (`^`)

Le symbole accent circonflexe (`^`) devant les numéros de version (ex: `^5.3.0`) applique la règle suivante du gestionnaire de paquets npm :
- Autorise les mises à jour de type **MINEUR** (nouvelles fonctionnalités rétrocompatibles) et **PATCH** (corrections de bugs de sécurité).
- **Interdit** les mises à jour de type **MAJEUR** (qui risqueraient de casser le code existant en raison de changements incompatibles).
- Exemple : Pour `^2.8.6`, npm acceptera `2.8.7` ou `2.9.0`, mais refusera la version `3.0.0`.
