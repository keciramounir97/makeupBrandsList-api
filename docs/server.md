# Documentation détaillée de `server.js`

Le fichier `server.js` constitue le point d'entrée principal (*entry point*) de l'application backend. Il configure et démarre un serveur web utilisant le framework **Express**, implémente des middlewares de sécurité et de traitement de requêtes, expose une interface utilisateur en rendu côté serveur (SSR - *Server-Side Rendering*) avec un système de filtrage dynamique, et fournit plusieurs routes API REST au format JSON.

---

## Sommaire
1. [Imports et Modules](#1-imports-et-modules)
2. [Initialisation et Configuration](#2-initialisation-et-configuration)
3. [Middlewares](#3-middlewares)
4. [Fonction utilitaire de sécurité (Échappement XSS)](#4-fonction-utilitaire-de-sécurité-échappement-xss)
5. [Route SSR Principale (`GET /`)](#5-route-ssr-principale-get-)
   - [5.1 Extraction et Destructuration des Paramètres](#51-extraction-et-destructuration-des-paramètres)
   - [5.2 Filtrage des Données](#52-filtrage-des-données)
   - [5.3 Extraction Unique et Tri des Pays](#53-extraction-unique-et-tri-des-pays)
   - [5.4 Génération Dynamique des Lignes du Tableau](#54-génération-dynamique-des-lignes-du-tableau)
   - [5.5 Génération des Menus Déroulants (Select Options)](#55-génération-des-menus-déroulants-select-options)
   - [5.6 Construction du Template HTML et CSS](#56-construction-du-template-html-et-css)
   - [5.7 Envoi de la Réponse](#57-envoi-de-la-réponse)
6. [Routes API REST](#6-routes-api-rest)
   - [6.1 Route `GET /api/brands`](#61-route-get-apibrands)
   - [6.2 Route `GET /api/brands-list`](#62-route-get-apibrands-list)
   - [6.3 Route `GET /api/brands/:id`](#63-route-get-apibrandsid)
7. [Démarrage du Serveur (`app.listen`)](#7-démarrage-du-serveur-applisten)
8. [Récapitulatif des Méthodes et Propriétés Employées](#8-récapitulatif-des-méthodes-et-propriétés-employées)

---

## 1. Imports et Modules

```javascript
// Ligne 1
import express from "express";
// Ligne 2
import cors from "cors";
// Ligne 3
import { brands } from "./data/brands.js";
```

### Explication ligne par ligne :
- **Ligne 1 (`import express from "express";`) :**
  - **Rôle :** Importe la fonction par défaut exportée par le module npm `express`.
  - **Mécanisme :** Utilise la syntaxe ES Modules (`import/export`), rendue possible grâce à la présence de `"type": "module"` dans `package.json`. Express est un framework minimaliste et flexible pour Node.js facilitant la création de serveurs HTTP, la gestion des routes, et l'orchestration des middlewares.
- **Ligne 2 (`import cors from "cors";`) :**
  - **Rôle :** Importe le middleware `cors` (*Cross-Origin Resource Sharing*).
  - **Mécanisme :** Permet d'autoriser ou restreindre l'accès à l'API depuis d'autres domaines (origines), indispensable lorsque le frontend (par exemple une application React, Vue ou simple page HTML) tourne sur un port ou domaine distinct (ex: `http://localhost:3000` ou `http://127.0.0.1:5500`).
- **Ligne 3 (`import { brands } from "./data/brands.js";`) :**
  - **Rôle :** Importe le jeu de données contenant la liste des marques de beauté depuis le fichier local `./data/brands.js`.
  - **Mécanisme :** Import nommé `{ brands }`. L'extension `.js` est obligatoire dans l'écosystème natif ES Modules de Node.js.

---

## 2. Initialisation et Configuration

```javascript
// Ligne 5
const app = express();
// Ligne 6
const PORT = process.env.PORT || 5000;
```

### Explication ligne par ligne :
- **Ligne 5 (`const app = express();`) :**
  - **Rôle :** Initialise une nouvelle instance de l'application Express.
  - **Propriétés/Méthodes rattachées :** L'objet `app` fournit toutes les méthodes nécessaires pour configurer le serveur (ex: `app.use()`, `app.get()`, `app.post()`, `app.listen()`).
- **Ligne 6 (`const PORT = process.env.PORT || 5000;`) :**
  - **Rôle :** Récupère la valeur de la variable d'environnement nommée `PORT`.
  - **Objet global employé :** `process.env` est un objet global fourni par le runtime Node.js qui expose les variables d'environnement du système ou chargées par l'environnement d'exécution (définies par exemple dans le fichier `.env` ou fournies par la plateforme d'hébergement).

---

## 3. Middlewares

```javascript
// Ligne 8
app.use(cors());
// Ligne 9
app.use(express.json());
```

### Explication ligne par ligne :
- **Ligne 8 (`app.use(cors());`) :**
  - **Méthode employée :** `app.use()` monte un middleware dans la pile d'exécution d'Express.
  - **Fonction exécutée :** `cors()` retourne une fonction middleware qui injecte les en-têtes HTTP appropriés (`Access-Control-Allow-Origin: *`) dans chaque réponse.
  - **Effet :** Débloque les requêtes AJAX / Fetch provenant de navigateurs web exécutant du code depuis un autre domaine.
- **Ligne 9 (`app.use(express.json());`) :**
  - **Méthode employée :** `express.json()` est un middleware natif d'Express basé sur `body-parser`.
  - **Rôle :** Analyse le corps (*body*) des requêtes HTTP entrantes lorsque l'en-tête `Content-Type` est `application/json`.
  - **Effet :** Rend les données JSON accessibles sous forme d'objet JavaScript dans `req.body` pour les requêtes POST, PUT ou PATCH.

---

## 4. Fonction utilitaire de sécurité (Échappement XSS)

```javascript
// Lignes 11-18
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
```

### Explication ligne par ligne :
- **Ligne 11 (`function escapeHTML(str) {`) :**
  - Déclaration d'une fonction d'échappement qui prend une valeur `str` en paramètre.
- **Ligne 12 (`return String(str)`) :**
  - Convertit la valeur reçue en chaîne de caractères primitive (permet d'éviter les erreurs si `str` est un nombre, `null` ou `undefined`).
- **Lignes 13 à 17 (`.replace(...)`) :**
  - Utilise la méthode native `String.prototype.replace()` chaînée avec des expressions régulières (Regex) munies du drapeau global `/g` :
    - `replace(/&/g, "&amp;")` : Remplace le caractère esperluette `&` par son entité HTML `&amp;` (doit être fait en premier pour ne pas ré-échapper les entités suivantes).
    - `replace(/</g, "&lt;")` : Remplace `<` par `&lt;` (*less than*), empêchant l'injection de balises HTML telles que `<script>`.
    - `replace(/>/g, "&gt;")` : Remplace `>` par `&gt;` (*greater than*).
    - `replace(/"/g, "&quot;")` : Remplace les guillemets doubles `"` par `&quot;`, empêchant la sortie d'attributs HTML.
    - `replace(/'/g, "&#39;");` : Remplace les apostrophes simples `'` par `&#39;`.
- **Rôle global :** Protection essentielle contre les attaques **XSS** (*Cross-Site Scripting*) lors de la concaténation de variables dans du code HTML généré dynamiquement côté serveur.

---

## 5. Route SSR Principale (`GET /`)

```javascript
// Ligne 20
app.get("/", (req, res) => {
```
- **Méthode employée :** `app.get(path, callback)` écoute les requêtes HTTP avec la méthode `GET` sur l'URI racine `"/"`.
- **Paramètres :**
  - `req` (*Request*) : L'objet représentant la requête HTTP reçue.
  - `res` (*Response*) : L'objet permettant de construire et envoyer la réponse HTTP.

---

### 5.1 Extraction et Destructuration des Paramètres

```javascript
// Ligne 21
  const { search = "", category = "", country = "" } = req.query;
// Ligne 22
  let list = [...brands];
```

- **Ligne 21 :**
  - **Propriété employée :** `req.query` est un objet contenant les paramètres de requête de l'URL (*query string*, ex: `/?search=dior&category=luxury`).
  - **Syntaxe ES6 :** Destructuration d'objet avec valeurs par défaut. Si `search`, `category` ou `country` ne sont pas fournis dans l'URL, ils prennent pour valeur une chaîne vide `""`.
- **Ligne 22 :**
  - **Syntaxe ES6 :** Utilisation de l'opérateur de décomposition (*Spread operator* `[...brands]`) pour créer une copie superficielle (*shallow copy*) du tableau original `brands`.
  - **Pourquoi :** Permet de manipuler et filtrer la variable `list` sans altérer ni muter le tableau initial de données en mémoire.

---

### 5.2 Filtrage des Données

```javascript
// Lignes 23-26
  if (search)
    list = list.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase()),
    );
// Lignes 27-30
  if (category)
    list = list.filter(
      (b) => b.category.toLowerCase() === category.toLowerCase(),
    );
// Lignes 31-34
  if (country)
    list = list.filter(
      (b) => b.country.toLowerCase() === country.toLowerCase(),
    );
```

- **Lignes 23-26 (Filtre par nom/recherche textuelle) :**
  - Si la variable `search` n'est pas vide (évaluation de vérité *truthy*).
  - `list.filter(callback)` parcourt chaque élément `b` de la liste et conserve uniquement ceux dont le retour est `true`.
  - `.toLowerCase()` : Convertit le nom de la marque et la chaîne recherchée en minuscules pour garantir une recherche **insensible à la casse** (*case-insensitive*).
  - `.includes()` : Vérifie si la sous-chaîne saisie est contenue n'importe où dans le nom de la marque.
- **Lignes 27-30 (Filtre par catégorie) :**
  - Filtre la liste en comparant l'égalité stricte `===` entre la catégorie de la marque et le paramètre sélectionné (tous deux convertis en minuscules).
- **Lignes 31-34 (Filtre par pays) :**
  - Filtre la liste en comparant le pays d'origine de la marque avec le pays sélectionné.

---

### 5.3 Extraction Unique et Tri des Pays

```javascript
// Ligne 36
  const countries = [...new Set(brands.map((b) => b.country))].sort();
```

- **Mécanismes et méthodes employés :**
  1. `brands.map((b) => b.country)` : Projette le tableau d'objets `brands` en un tableau de simples chaînes représentant les pays (avec de nombreux doublons).
  2. `new Set(...)` : La structure de données native `Set` élimine automatiquement toutes les valeurs en doublon, ne conservant que les pays uniques.
  3. `[...new Set(...)]` : Reconvertit l'ensemble `Set` en un tableau standard JavaScript.
  4. `.sort()` : Trie les noms de pays par ordre alphabétique croissant selon l'encodage lexicographique UTF-16.

---

### 5.4 Génération Dynamique des Lignes du Tableau

```javascript
// Lignes 38-61
  const rows = list
    .map(
      (b, i) => `
    
    <tr>
    <td>${i + 1}</td>
    <td>${escapeHTML(b.name)}</td>
    <td>
    <a class="brand-link" href="${escapeHTML(b.website)}" target="_blank">
    ${escapeHTML(b.website.replace(/^https?:\/\//, ""))}
    </a>
    </td>

    <td>${escapeHTML(b.country)}</td>
    <td>
     <span class="badge ${escapeHTML(b.category)}">${escapeHTML(b.category)}
    
    </td>
    
    </tr>
    
    `,
    )
    .join("");
```

- **Ligne 38 (`const rows = list.map((b, i) => ...).join("");`) :**
  - `map()` itère sur chaque marque `b` avec son index `i` (commençant à `0`) pour retourner un fragment de balisage HTML sous forme de chaîne de caractères.
  - `.join("")` regroupe l'ensemble des fragments HTML du tableau en une unique chaîne de caractères continue.
- **Ligne 43 (`<td>${i + 1}</td>`) :** Numérotation séquentielle des lignes pour l'affichage (index `+ 1` pour commencer à `1`).
- **Ligne 44 (`<td>${escapeHTML(b.name)}</td>`) :** Injection sécurisée du nom de la marque.
- **Lignes 46-48 (`<a class="brand-link" href="..." target="_blank">`) :**
  - Crée un lien hypertexte ouvrant le site web de la marque dans un nouvel onglet grâce à `target="_blank"`.
  - **Expression régulière :** `.replace(/^https?:\/\//, "")` supprime le protocole `http://` ou `https://` au début de l'URL pour un affichage plus propre et esthétique (ex: `https://www.chanel.com` devient `www.chanel.com`).
- **Ligne 51 (`<td>${escapeHTML(b.country)}</td>`) :** Affiche le pays d'origine.
- **Ligne 53 (`<span class="badge ${escapeHTML(b.category)}">${escapeHTML(b.category)}`) :**
  - Attribue une classe CSS dynamique portant le nom de la catégorie (ex: `class="badge luxury"`) permettant d'appliquer des styles et couleurs spécifiques définis dans la feuille de style.

---

### 5.5 Génération des Menus Déroulants (Select Options)

```javascript
// Lignes 63-71
  const countryOptions = countries
    .map(
      (c) => `
    <option value="${escapeHTML(c)}" ${country === c ? "selected" : ""}>
    ${escapeHTML(c)}</option>

    `,
    )
    .join("");

// Lignes 73-78
  const categoryOptions = ["luxury", "prestige", "mass"]
    .map(
      (c) =>
        `<option value="${c}" ${category === c ? "selected" : ""}>${c}</option>`,
    )
    .join("");
```

- **`countryOptions` :**
  - Génère dynamiquement une balise `<option>` pour chaque pays de la liste triée.
  - **Opérateur ternaire `${country === c ? "selected" : ""}` :** Conserve la sélection de l'utilisateur après le rechargement de la page si le pays actuel correspond à l'option.
- **`categoryOptions` :**
  - Génère les options pour les trois catégories prédéfinies : `"luxury"`, `"prestige"`, `"mass"`.
  - Conserve également l'attribut `selected` si la catégorie en cours correspond.

---

### 5.6 Construction du Template HTML et CSS

```javascript
// Lignes 80-290
  const html = `<!doctype html>
<html lang="fr">
...
`;
```

Le code assemble une page HTML5 complète en utilisant les *Template Literals* (littéraux de gabarits avec backticks `` ` ``) :
- **En-tête (`<head>`) :**
  - Déclaration de l'encodage `UTF-8`.
  - Balise viewport pour un affichage fluide et responsive sur mobile.
  - Titre de document `<title>Marques de maquillage — Annuaire</title>`.
- **Styles CSS intégrés (`<style>`) :**
  - `* { box-sizing: border-box; }` : Modèle de boîte garantissant que padding et bordures sont inclus dans la largeur totale des éléments.
  - Typographie moderne système (`system-ui`, `-apple-system`, `sans-serif`).
  - Arrière-plan pastel doux (`#faf7fb`) et palette de couleurs inspirée de l'univers cosmétique (magenta `#d63384`, pourpre `#7b2ff7`).
  - Formulaire de filtres en `display: flex` avec `flex-wrap: wrap` et `gap: 0.6rem`.
  - Tableau moderne avec en-tête en dégradé linéaire (`linear-gradient(135deg, #d63384, #7b2ff7)`).
  - Badges colorés thématiques :
    - `.luxury` : Doré (`background: #fff3cd; color: #8a6d00;`).
    - `.prestige` : Rose poudré (`background: #fde2ef; color: #a11f63;`).
    - `.mass` : Vert clair (`background: #d4edda; color: #0a5c1c;`).
- **Corps (`<body>`) :**
  - Titre et sous-titre dynamique indiquant le nombre de marques trouvées (`Affichage de ${list.length} marque(s)`).
  - Formulaire HTML `<form class="filters" method="GET" action="/">` :
    - Soumet les paramètres de recherche par méthode GET dans l'URL.
    - Champ texte pour la recherche par nom (`name="search"`).
    - Sélecteur de catégorie (`name="category"`).
    - Sélecteur de pays (`name="country"`).
    - Bouton `<button type="submit">Filtrer</button>` et lien de réinitialisation `<a href="/">Réinitialiser</a>`.
  - Rendu conditionnel du contenu :
    - Si `list.length === 0` : Affiche un encadré d'information `<div class="empty">Aucune marque ne correspond aux filtres.</div>`.
    - Sinon : Affiche le tableau complet contenant les lignes générées dans `${rows}`.

---

### 5.7 Envoi de la Réponse

```javascript
// Ligne 292
  res.send(html);
});
```

- **Méthode employée :** `res.send(html)`
- **Rôle :** Transmet la chaîne HTML construite au client HTTP. Express détecte automatiquement le type de contenu et applique l'en-tête `Content-Type: text/html; charset=utf-8`.

---

## 6. Routes API REST

Le serveur expose trois endpoints d'API pour une consommation programmatique par un frontend découplé ou un client mobile.

---

### 6.1 Route `GET /api/brands`

```javascript
// Lignes 295-311
app.get("/api/brands", (req, res) => {
  const { search, category, country } = req.query;
  let result = [...brands];
  if (search)
    result = result.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase()),
    );
  if (category)
    result = result.filter(
      (b) => b.category.toLowerCase() === category.toLowerCase(),
    );
  if (country)
    result = result.filter(
      (b) => b.country.toLowerCase() === country.toLowerCase(),
    );
  res.json({ count: result.length, data: result });
});
```

- **Ligne 295 (`app.get("/api/brands", ...)`) :** Déclare la route API de consultation globale des marques.
- **Ligne 296 (`const { search, category, country } = req.query;`) :** Récupère les paramètres de filtrage passés dans l'URL (ex: `/api/brands?category=luxury&country=france`).
- **Ligne 297 (`let result = [...brands];`) :** Clone superficiellement la liste des marques pour préserver l'intégrité des données d'origine.
- **Lignes 298-309 :** Filtre successivement par `search`, `category` et `country` de manière insensible à la casse.
- **Ligne 310 (`res.json({ count: result.length, data: result });`) :**
  - **Méthode employée :** `res.json()` sérialise l'objet JavaScript en JSON valide et applique l'en-tête `Content-Type: application/json; charset=utf-8`.
  - **Structure retournée :** Un objet contenant la propriété `count` (nombre total de marques correspondant aux critères) et `data` (le tableau des marques filtrées).

---

### 6.2 Route `GET /api/brands-list`

```javascript
// Lignes 313-315
app.get("/api/brands-list", (req, res) => {
  res.json(brands.map(({ name, website }) => ({ name, website })));
});
```

- **Ligne 313 (`app.get("/api/brands-list", ...)`) :** Déclare une route allégée.
- **Ligne 314 (`res.json(brands.map(({ name, website }) => ({ name, website })));`) :**
  - **Projection de données :** Utilise la destructuration dans la signature de la fonction fléchée `({ name, website })` pour ne retenir que deux propriétés de chaque marque.
  - **Optimisation :** Réduit considérablement la taille de la charge utile (*payload*) envoyée sur le réseau en omettant `id`, `country` et `category`. Idéal pour un affichage rapide sous forme de liste ou de menu déroulant côté frontend.

---

### 6.3 Route `GET /api/brands/:id`

```javascript
// Lignes 317-321
app.get("/api/brands/:id", (req, res) => {
  const brand = brands.find((b) => b.id === parseInt(req.params.id));
  if (!brand) return res.status(404).json({ error: "marque Non Trouvée" });
  res.json(brand);
});
```

- **Ligne 317 (`app.get("/api/brands/:id", ...)`) :**
  - **Paramètre de route :** Le segment `:id` est un paramètre dynamique capturé par Express.
- **Ligne 318 (`const brand = brands.find((b) => b.id === parseInt(req.params.id));`) :**
  - **Propriété employée :** `req.params.id` extrait la valeur de l'identifiant depuis l'URL sous forme de chaîne de caractères.
  - **Fonction employée :** `parseInt(req.params.id)` convertit la chaîne en nombre entier décimal pour permettre la comparaison avec la propriété numérique `b.id`.
  - **Méthode employée :** `Array.prototype.find()` recherche et retourne le premier élément satisfaisant la condition, ou `undefined` si aucun élément ne correspond.
- **Ligne 319 (`if (!brand) return res.status(404).json({ error: "marque Non Trouvée" });`) :**
  - **Condition :** Utilise la négation `!brand` pour intercepter les marques introuvables.
  - **Méthodes employées :** `res.status(404).json(...)` définit le code de statut HTTP `404 Not Found` et retourne un message d'erreur au format JSON.
- **Ligne 320 (`res.json(brand);`) :** Retourne l'objet de la marque trouvée avec un code de statut `200 OK` implicite.

---

## 7. Démarrage du Serveur (`app.listen`)

```javascript
// Lignes 323-327
app.listen(PORT, () => {
  console.log(`Serveur Démarré : http://localhost:${PORT}`);
  console.log(`Tableau des Marques : http://localhost:${PORT}/`);
  console.log(`Api JSON : http://localhost:${PORT}/api/brands`);
});
```

### Explication ligne par ligne :
- **Ligne 323 (`app.listen(PORT, () => {`) :**
  - **Méthode employée :** `app.listen(port, callback)` lie et écoute les connexions réseau entrantes sur le port spécifié.
  - **Callback :** Fonction asynchrone exécutée dès que le serveur est prêt à recevoir des requêtes.
- **Lignes 324 à 326 (`console.log(...)`) :**
  - Affiche dans le terminal de commande des liens directement cliquables pour naviguer vers :
    - L'adresse de base du serveur (`http://localhost:${PORT}`)
    - La vue du tableau interactif (`http://localhost:${PORT}/`)
    - L'endpoint JSON principal (`http://localhost:${PORT}/api/brands`)
- **Ligne 327 (`});`) :** Clôture du bloc de la fonction `listen`.

---

## 8. Récapitulatif des Méthodes et Propriétés Employées

### Méthodes Express :
| Méthode | Description |
| :--- | :--- |
| `express()` | Fonction d'initialisation de l'application serveur Express. |
| `app.use(middleware)` | Enregistre un middleware dans le cycle de vie des requêtes. |
| `app.get(path, handler)` | Définit un gestionnaire de route pour les requêtes HTTP GET. |
| `app.listen(port, callback)` | Démarre l'écoute des connexions réseau sur un port donné. |
| `res.send(body)` | Envoie une réponse HTTP (texte ou HTML). |
| `res.json(data)` | Envoie une réponse HTTP sérialisée en JSON avec les en-têtes correspondants. |
| `res.status(code)` | Définit le code d'état HTTP de la réponse (ex: 404, 200). |

### Propriétés Express :
| Propriété | Description |
| :--- | :--- |
| `req.query` | Objet contenant les paramètres passés dans la chaîne de requête (*query string*) de l'URL. |
| `req.params` | Objet contenant les paramètres d'URL nommés (ex: `:id`). |

### Méthodes JavaScript natives :
| Méthode | Rôle dans le fichier |
| :--- | :--- |
| `Array.prototype.filter()` | Filtre les marques selon le nom, la catégorie ou le pays. |
| `Array.prototype.map()` | Transforme les éléments d'un tableau en chaînes HTML ou en sous-objets. |
| `Array.prototype.find()` | Recherche une marque précise par son identifiant unique. |
| `Array.prototype.join()` | Concatène un tableau de chaînes en une seule chaîne. |
| `Array.prototype.sort()` | Trie le tableau des pays par ordre alphabétique. |
| `String.prototype.replace()` | Remplace des motifs dans une chaîne via expressions régulières (Regex). |
| `String.prototype.toLowerCase()` | Normalise les chaînes en minuscules pour la comparaison insensible à la casse. |
| `String.prototype.includes()` | Vérifie la présence d'une sous-chaîne de caractères. |
| `parseInt()` | Convertit une chaîne de caractères en entier numérique. |
| `String()` | Convertit une valeur en chaîne de caractères. |
| `new Set()` | Déduplique les pays pour obtenir une liste unique d'éléments. |
| `[...iterable]` (*Spread*) | Clone un tableau ou convertit un itérable (`Set`) en tableau. |
