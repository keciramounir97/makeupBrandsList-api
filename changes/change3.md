# Modification 3 : Correction de l'inversion logique sur la route `GET /api/brands/:id`

## 1. Problème identifié
Lors de l'appel à la route permettant de récupérer une marque par son identifiant numérique unique (ex: `/api/brands/1` pour Chanel), l'API renvoyait une erreur `404 Not Found` :

```json
{
  "error": "marque Non Trouvée"
}
```

À l'inverse, si l'on demandait un identifiant totalement inexistant (ex: `/api/brands/9999`), l'API renvoyait un statut `200 OK` avec un corps vide.

### Cause technique :
À la ligne 319 de `server.js` :
```javascript
const brand = brands.find((b) => b.id === parseInt(req.params.id));
if (!!brand) return res.status(404).json({ error: "marque Non Trouvée" });
res.json(brand);
```

- L'opérateur de double négation `!!` convertit une valeur en son équivalent booléen strict.
- Quand la marque **est trouvée**, `brand` est un objet valide (valeur *truthy*). `!!brand` devient donc `true`. Par conséquent, le code entrait dans le `if` et renvoyait une erreur `404 Not Found` pour une marque pourtant bien présente !
- Quand la marque **n'existe pas**, `brand` vaut `undefined` (valeur *falsy*). `!!brand` devenait `false`. Le code sautait le `if` et exécutait `res.json(undefined)`, renvoyant un statut `200 OK` pour une marque inexistante !

---

## 2. Ce qui a été fait dans le code pour que ça fonctionne
Nous avons remplacé la double négation `!!brand` par une simple négation `!brand` pour vérifier si la marque est introuvable.

### Code avant modification (`server.js` ligne 319) :
```javascript
if (!!brand) return res.status(404).json({ error: "marque Non Trouvée" });
```

### Code après modification (`server.js` ligne 319) :
```javascript
if (!brand) return res.status(404).json({ error: "marque Non Trouvée" });
```

---

## 3. Bénéfices et Résultat
- Lorsqu'une marque existe (ex: `GET /api/brands/1`), l'API renvoie le statut `200 OK` et l'objet JSON complet de la marque (Chanel).
- Lorsqu'une marque n'existe pas (ex: `GET /api/brands/9999`), l'API renvoie rigoureusement le statut `404 Not Found` avec `{ "error": "marque Non Trouvée" }`.
- La route respecte fidèlement les standards REST.
