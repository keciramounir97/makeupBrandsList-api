# Modification 4 : Sécurisation du port d'écoute réseau (`PORT`)

## 1. Problème identifié
À la ligne 6 de `server.js`, la variable `PORT` était initialisée comme suit :

```javascript
const PORT = process.env.PORT;
```

### Cause technique :
Dans un environnement Node.js standard, si la commande est lancée via `npm start` ou `node server.js` sans outil externe comme `dotenv` ou sans l'argument `--env-file=.env`, la propriété `process.env.PORT` vaut `undefined`.
- Dans Express, appeler `app.listen(undefined)` délègue le choix du port au système d'exploitation (qui attribue un port éphémère aléatoire) ou tente d'écouter sur un port invalide.
- Les logs en console affichaient :
  ```text
  Serveur Démarré : http://localhost:undefined
  ```
  Rendant impossible la connexion via l'adresse attendue `http://localhost:5000`.

---

## 2. Ce qui a été fait dans le code pour que ça fonctionne
Nous avons ajouté l'opérateur logique de repli `||` avec la valeur par défaut `5000`.

### Code avant modification (`server.js` ligne 6) :
```javascript
const PORT = process.env.PORT;
```

### Code après modification (`server.js` ligne 6) :
```javascript
const PORT = process.env.PORT || 5000;
```

---

## 3. Bénéfices et Résultat
- Si une variable d'environnement `PORT` est fournie (comme sur Vercel, Heroku, Render ou via un conteneur Docker), elle est respectée.
- Si aucune variable d'environnement n'est détectée, le serveur démarre automatiquement sur le port de secours `5000`.
- Élimination des URLs tronquées `localhost:undefined` dans le terminal.
