# Modification 2 : Correction de la fonction d'échappement XSS (`escapeHtml` vs `escapeHTML`)

## 1. Problème identifié
Lorsqu'un utilisateur ou un navigateur ouvrait la route d'accueil `http://localhost:5000/`, le serveur retournait une erreur HTTP 500 (Internal Server Error) et générait l'exception suivante dans la console :

```text
ReferenceError: escapeHtml is not defined
    at file:///C:/Users/mounir/Downloads/beauty-landing-page/backend/makeupBrands-api/server.js:249:17
```

### Cause technique :
JavaScript est un langage strictement sensible à la casse (*case-sensitive*).
- À la ligne 11 de `server.js`, la fonction d'échappement XSS a été définie avec l'acronyme HTML en lettres majuscules :
  ```javascript
  function escapeHTML(str) { ... }
  ```
- Aux lignes 44, 46, 47, 51, 53, 66 et 68, cette fonction était correctement appelée sous le nom `escapeHTML(...)`.
- Cependant, à la ligne 249, dans la balise d'entrée du champ de recherche :
  ```javascript
  value="${escapeHtml(search)}"
  ```
  Le nom utilisé était `escapeHtml` (avec un "H" majuscule et "tml" en minuscules). N'ayant jamais été déclarée sous cette casse, l'interpréteur JavaScript levait immédiatement un `ReferenceError`.

---

## 2. Ce qui a été fait dans le code pour que ça fonctionne
Nous avons corrigé l'appel à la ligne 249 de `server.js` pour utiliser exactement le nom de la fonction déclarée (`escapeHTML`).

### Code avant modification (`server.js` ligne 249) :
```html
<input
  type="text"
  name="search"
  placeholder="Rechercher une marque..."
  value="${escapeHtml(search)}"
/>
```

### Code après modification (`server.js` ligne 249) :
```html
<input
  type="text"
  name="search"
  placeholder="Rechercher une marque..."
  value="${escapeHTML(search)}"
/>
```

---

## 3. Bénéfices et Résultat
- Élimination complète de l'exception `ReferenceError`.
- La route racine `GET /` génère et retourne désormais la page HTML complète avec succès (Code HTTP `200 OK`).
- Le champ de recherche conserve et échappe correctement la valeur saisie par l'utilisateur lors du rechargement de la page.
