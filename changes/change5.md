# Modification 5 : Configuration et Export pour le Déploiement Serverless Vercel

## 1. Problème identifié
Pour déployer une application Express sur **Vercel** et la rendre accessible publiquement à l'adresse demandée `makeupBrandsList-api.vercel.app`, le serveur ne peut pas fonctionner comme un simple processus Node.js permanent démarrant un port TCP local.

### Cause technique :
1. **Nature Serverless de Vercel :** Vercel n'exécute pas un serveur en arrière-plan permanent ; il transforme les points d'entrée en fonctions serverless exécutées à la demande.
2. **Gestion des fichiers racine :** Si un fichier `server.js` est présent à la racine sans fonction serverless déclarée, Vercel le sert comme simple fichier statique JavaScript téléchargeable au lieu de l'exécuter.
3. **Absence d'exportation de `app` :** Dans le code original, `server.js` créait l'application `const app = express();` et appelait `app.listen(PORT)`, mais n'exportait jamais l'instance `app` (`export default app`).
4. **Absence de routage Vercel :** Sans règle de réécriture, Vercel ne sait pas rediriger les requêtes `/(.*)` vers le gestionnaire serverless.

---

## 2. Ce qui a été fait dans le code pour que ça fonctionne

### A. Export de `app` et conditionnement de `app.listen()` dans `server.js`
À la fin de `server.js`, nous avons exporté l'application pour Vercel, et conditionné l'écoute `app.listen()` pour qu'elle s'exécute uniquement hors environnement serverless Vercel (ou en développement local) :

```javascript
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Serveur Démarré : http://localhost:${PORT}`);
    console.log(`Tableau des Marques : http://localhost:${PORT}/`);
    console.log(`Api JSON : http://localhost:${PORT}/api/brands`);
  });
}

export default app;
```

### B. Point d'entrée Serverless `api/index.js`
Conformément aux conventions de Vercel qui détecte automatiquement les fonctions serverless dans le répertoire `api/`, nous avons créé le pont `api/index.js` :

```javascript
import app from "../server.js";

export default app;
```

### C. Configuration de routage `vercel.json`
Nous avons configuré `vercel.json` pour rediriger l'ensemble des routes vers `api/index.js` :

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api/index.js"
    }
  ]
}
```

---

## 3. Bénéfices et Résultat
- Compatibilité native avec le moteur Serverless de Vercel.
- L'application fonctionne de manière transparente à la fois en local (`npm run dev` / `node server.js`) et dans le Cloud Vercel.
- Toutes les requêtes HTTP (`/`, `/api/brands`, `/api/brands-list`, `/api/brands/:id`) sont traitées dynamiquement par Express.
- L'alias de domaine public `https://makeupbrandslist-api.vercel.app` sert fidèlement l'API et l'annuaire.
