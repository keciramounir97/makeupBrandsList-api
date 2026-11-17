# Documentation détaillée du fichier `.env`

Le fichier `.env` (abréviation de *environment*) est le fichier de configuration locale destiné à définir les **variables d'environnement** de l'application. Il permet de séparer rigoureusement la configuration technique du code source de l'application, suivant l'une des recommandations fondamentales de la méthodologie *The Twelve-Factor App*.

---

## Sommaire
1. [Contenu du Fichier](#1-contenu-du-fichier)
2. [Explication Ligne par Ligne](#2-explication-ligne-par-ligne)
3. [Fonctionnement dans Node.js](#3-fonctionnement-dans-nodejs)
4. [Sécurité et Bonnes Pratiques GitHub](#4-sécurité-et-bonnes-pratiques-github)
5. [Modèle recommandé (`.env.example`)](#5-modèle-recommandé-envexample)

---

## 1. Contenu du Fichier

```env
PORT = 5000
```

---

## 2. Explication Ligne par Ligne

- **Ligne 1 (`PORT = 5000`) :**
  - **Nom de la variable :** `PORT` (par convention, les variables d'environnement sont toujours écrites en lettres majuscules).
  - **Opérateur :** `=` (assignation de valeur).
  - **Valeur assignée :** `5000` (le numéro du port réseau TCP sur lequel le serveur Express doit écouter les connexions HTTP entrantes).
  - **Pourquoi 5000 :** Les ports inférieurs à 1024 sont réservés au système d'exploitation (ex: 80 pour HTTP, 443 pour HTTPS). Les ports au-delà de 3000 (comme 3000, 5000, 8080) sont couramment employés pour les serveurs de développement locaux afin d'éviter tout conflit réseau.

---

## 3. Fonctionnement dans Node.js

Dans `server.js`, la valeur est lue à la ligne 6 :

```javascript
const PORT = process.env.PORT;
```

- **`process.env` :**
  - C'est un objet global fourni par le moteur Node.js qui reflète l'environnement d'exécution du système hôte.
  - La propriété `process.env.PORT` reçoit ainsi la valeur définie dans l'environnement.
- **Chargement sous Node.js :**
  - Depuis Node.js v20.6.0+, il est possible de charger nativement un fichier `.env` sans aucune dépendance externe en utilisant le drapeau `--env-file` :
    ```bash
    node --env-file=.env server.js
    ```
  - Dans d'autres contextes ou versions antérieures, des paquets comme `dotenv` (`npm install dotenv`) avec `import "dotenv/config";` en tête de `server.js` sont fréquemment employés.
  - Sur les plateformes d'hébergement cloud (Render, Railway, Heroku, AWS, Vercel), la variable `PORT` est automatiquement injectée par l'infrastructure selon la disponibilité des ports du conteneur.

---

## 4. Sécurité et Bonnes Pratiques GitHub

> [!WARNING] Règle d'or de sécurité
> Le fichier `.env` réel **ne doit jamais être poussé sur un dépôt GitHub public**.

### Pourquoi ?
- Si le fichier `.env` contient plus tard des clés d'API privées, des identifiants de base de données ou des jetons JWT secrets, les envoyer sur GitHub expose immédiatement l'application à des attaques et des compromissions de données.

### Protection via `.gitignore` :
Il est indispensable d'ajouter le fichier `.env` dans un fichier `.gitignore` à la racine du projet :

```gitignore
# Fichiers d'environnement contenant des secrets ou configurations locales
.env
.env.local
.env.*.local
```

---

## 5. Modèle recommandé (`.env.example`)

Pour permettre à d'autres développeurs de cloner le dépôt GitHub et de configurer facilement leur propre environnement sans exposer de secrets, la bonne pratique consiste à fournir un fichier modèle nommé `.env.example` :

```env
# Port d'écoute local du serveur Express
PORT=5000
```
Le développeur clone ensuite le dépôt, duplique `.env.example` en `.env` et adapte les valeurs à sa machine.
