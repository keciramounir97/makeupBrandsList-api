# Documentation détaillée de `data/brands.js`

Le fichier `data/brands.js` est la base de données statique en mémoire (*in-memory dataset*) du projet. Il recense une collection de **200 marques de cosmétiques et de maquillage réelles**, réparties à travers le monde, structurées sous forme d'un tableau d'objets JavaScript prêt à être consommé par l'API et le moteur de rendu serveur.

---

## Sommaire
1. [Vue d'ensemble et Rôle](#1-vue-densemble-et-rôle)
2. [Structure de Données et Schéma d'un Objet](#2-structure-de-données-et-schéma-dun-objet)
   - [2.1 Propriété `id`](#21-propriété-id)
   - [2.2 Propriété `name`](#22-propriété-name)
   - [2.3 Propriété `website`](#23-propriété-website)
   - [2.4 Propriété `country`](#24-propriété-country)
   - [2.5 Propriété `category`](#25-propriété-category)
3. [Analyse du Jeu de Données](#3-analyse-du-jeu-de-données)
   - [3.1 Répartition par Catégorie](#31-répartition-par-catégorie)
   - [3.2 Répartition par Pays](#32-répartition-par-pays)
4. [Exportation et Modularité ES Modules](#4-exportation-et-modularité-es-modules)
5. [Exemple de Données (Extrait Lignes 1 à 60)](#5-exemple-de-données-extrait-lignes-1-à-60)
6. [Remarques Techniques et Compatibilité](#6-remarques-techniques-et-compatibilité)

---

## 1. Vue d'ensemble et Rôle

Dans une architecture sans base de données relationnelle ou NoSQL externe (comme MongoDB ou PostgreSQL), le fichier `data/brands.js` fait office de **couche de persistance locale** (*Data Layer / Mock Database*).

- **Format :** Tableau JavaScript natif (`Array`) contenant 200 dictionnaires/objets (`Object`).
- **Avantages :**
  - **Temps d'accès ultra-rapide (O(1) à O(N)) :** Les données résident directement dans la mémoire vive (RAM) allouée au processus Node.js.
  - **Simplicité :** Aucune configuration de connexion réseau, de pool de connexions ou de migration SQL n'est requise.
  - **Immuabilité recommandée :** Utilisé en lecture seule (*Read-Only*) pour alimenter les opérations de recherche, de filtrage et d'affichage.

---

## 2. Structure de Données et Schéma d'un Objet

Chaque élément du tableau `brands` respecte une interface de données rigoureuse et uniforme composée de 5 propriétés :

```javascript
{
  id: 1,
  name: "Chanel",
  website: "https://www.chanel.com",
  country: "France",
  category: "Luxury"
}
```

### 2.1 Propriété `id`
- **Type :** Nombre entier positif (`Number` / `Integer`).
- **Rôle :** Identifiant unique (*Primary Key*).
- **Plage de valeurs :** De `1` à `200`.
- **Usage dans le code :** Utilisé dans la route dynamique `GET /api/brands/:id` pour cibler une marque spécifique à l'aide de la méthode `brands.find(b => b.id === parseInt(req.params.id))`.

### 2.2 Propriété `name`
- **Type :** Chaîne de caractères (`String`).
- **Rôle :** Nom officiel et commercial de la marque (ex: `"Chanel"`, `"Dior"`, `"Fenty Beauty"`, `"Huda Beauty"`).
- **Usage dans le code :**
  - Affiché dans la 2ᵉ colonne du tableau HTML.
  - Cible principale de la barre de recherche textuelle via `b.name.toLowerCase().includes(search.toLowerCase())`.
  - Projeté dans la route allégée `GET /api/brands-list`.

### 2.3 Propriété `website`
- **Type :** Chaîne de caractères (`String`).
- **Format :** URL absolue complète incluant le protocole sécurisé `https://`.
- **Usage dans le code :**
  - Rendu sous forme de lien cliquable dans la 3ᵉ colonne du tableau HTML (`<a href="${escapeHTML(b.website)}" target="_blank">`).
  - Nettoyé visuellement dans l'interface grâce à l'expression régulière `.replace(/^https?:\/\//, "")` pour ne présenter que le nom de domaine (ex: `www.chanel.com`).
  - Renvoyé dans la route allégée `GET /api/brands-list`.

### 2.4 Propriété `country`
- **Type :** Chaîne de caractères (`String`).
- **Rôle :** Pays d'origine ou siège historique de la marque.
- **Valeurs présentes :** `"France"`, `"Italy"`, `"USA"`, `"Japan"`, `"Canada"`, `"UK"`, `"UAE"`, `"Germany"`, `"Poland"`, `"South Korea"`, etc.
- **Usage dans le code :**
  - Affiché dans la 4ᵉ colonne du tableau HTML.
  - Utilisé pour extraire la liste unique et triée des pays (`[...new Set(brands.map((b) => b.country))].sort()`).
  - Critère de filtrage dans les routes `GET /` et `GET /api/brands`.

### 2.5 Propriété `category`
- **Type :** Chaîne de caractères (`String`).
- **Rôle :** Segmentation commerciale et positionnement marché de la marque.
- **Valeurs présentes dans le dataset :**
  - `"Luxury"` (Haute couture et cosmétiques de luxe : Chanel, Dior, YSL, Guerlain...)
  - `"Prestige"` (Marques haut de gamme vendues en grands magasins : Clarins, Estée Lauder, Clinique...)
  - `"Professional"` (Maquillage pour maquilleurs professionnels : MAC, Make Up For Ever...)
  - `"Clean Beauty"` (Formules naturelles, bio ou véganes : Ilia, RMS Beauty...)
  - `"Celebrity"` (Marques lancées par des célébrités : Fenty Beauty, Rare Beauty, Rhode...)
  - `"Indie"` (Marques indépendantes : Glossier, Milk Makeup, Uoma...)
  - `"Mass Market"` (Grand public et grande distribution : Maybelline, L'Oréal, Nyx...)
  - `"K-Beauty"` (Cosmétiques coréens : Laneige, Innisfree, Etude House...)
  - `"J-Beauty"` (Cosmétiques japonais : Shiseido, Shu Uemura...)
- **Usage dans le code :**
  - Affiché sous forme de pastille/badge stylisé (`<span class="badge ${b.category}">`).
  - Critère de filtrage dans les routes `GET /` et `GET /api/brands`.

---

## 3. Analyse du Jeu de Données

Le dataset rassemble un total de **200 entrées**.

### 3.1 Répartition par Catégorie
Les catégories regroupent l'ensemble de l'écosystème cosmétique moderne :
1. **Luxury :** Marques historiques associées à la haute parfumerie et couture.
2. **Prestige :** Marques reconnues distribuées chez Sephora, Ulta ou en parfumeries sélectives.
3. **Mass Market :** Marques accessibles à large diffusion.
4. **Clean Beauty & Indie :** Marques avant-gardistes, cruelty-free ou éco-responsables.
5. **K-Beauty & J-Beauty :** L'innovation asiatique en soins et maquillage.

### 3.2 Répartition par Pays
Le dataset couvre les principaux pôles mondiaux de l'industrie de la beauté :
- **France & Italie :** Berceaux traditionnels du luxe européen.
- **États-Unis :** Leaders des marques Indie, Celebrity et Mass Market.
- **Corée du Sud & Japon :** Pionniers des textures innovantes et des formulations de soin hybrides.
- **Royaume-Uni, Allemagne, Pologne, Canada, Émirats Arabes Unis...**

---

## 4. Exportation et Modularité ES Modules

À la ligne 1402 et 1404 du fichier :

```javascript
// Ligne 1402 : Fermeture du tableau
];

// Ligne 1404 : Export nommé et par défaut du module
export { brands };
export default brands;
```

### Explication de l'export :
- **`export { brands };` :**
  - Exporte le tableau `brands` en tant qu'export nommé, permettant son import direct via `import { brands } from "./data/brands.js";`.
- **`export default brands;` :**
  - Syntaxe standardisée ECMAScript Modules (**ESM**).
  - Exporte le tableau `brands` en tant qu'export par défaut du fichier.
  - Permet à tout autre module JavaScript de l'importer également via `import brands from "./data/brands.js";`.

---

## 5. Exemple de Données (Extrait Lignes 1 à 60)

```javascript
const brands = [
  {
    id: 1,
    name: "Chanel",
    website: "https://www.chanel.com",
    country: "France",
    category: "Luxury",
  },
  {
    id: 2,
    name: "Dior",
    website: "https://www.dior.com",
    country: "France",
    category: "Luxury",
  },
  {
    id: 3,
    name: "Yves Saint Laurent Beauty",
    website: "https://www.yslbeauty.com",
    country: "France",
    category: "Luxury",
  },
  {
    id: 4,
    name: "Lancôme",
    website: "https://www.lancome.com",
    country: "France",
    category: "Luxury",
  },
  {
    id: 5,
    name: "Guerlain",
    website: "https://www.guerlain.com",
    country: "France",
    category: "Luxury",
  },
  {
    id: 6,
    name: "Givenchy Beauty",
    website: "https://www.givenchybeauty.com",
    country: "France",
    category: "Luxury",
  },
  {
    id: 7,
    name: "Armani Beauty",
    website: "https://www.armanibeauty.com",
    country: "Italy",
    category: "Luxury",
  },
  {
    id: 8,
    name: "Clarins",
    website: "https://www.clarins.com",
    country: "France",
    category: "Prestige",
  },
  {
    id: 9,
    name: "Sisley Paris",
    website: "https://www.sisley-paris.com",
    country: "France",
    category: "Luxury",
  },
  ...
```

---

## 6. Remarques Techniques et Compatibilité

1. **Cohérence des types :** L'intégralité des identifiants `id` sont de type numérique séquentiel (`1, 2, ..., 200`), ce qui assure une indexation fiable et prévisible.
2. **Validité des URLs :** Toutes les adresses web fournies utilisent le protocole sécurisé `https://`, garantissant que les liens générés dans le tableau HTML ou fournis par l'API sont prêts pour un environnement de production.
3. **Immuabilité :** Dans `server.js`, les opérations de filtrage s'exécutent sur une copie superficielle (`[...brands]`), préservant ainsi la pureté du tableau d'origine en mémoire.
