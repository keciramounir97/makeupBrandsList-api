import express from "express";
import cors from "cors";
import { brands } from "./data/brands.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

app.get("/", (req, res) => {
  const { search = "", category = "", country = "" } = req.query;
  let list = [...brands];
  if (search)
    list = list.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase()),
    );
  if (category)
    list = list.filter(
      (b) => b.category.toLowerCase() === category.toLowerCase(),
    );
  if (country)
    list = list.filter(
      (b) => b.country.toLowerCase() === country.toLowerCase(),
    );

  const countries = [...new Set(brands.map((b) => b.country))].sort();

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

  const countryOptions = countries
    .map(
      (c) => `
    <option value="${escapeHTML(c)}" ${country === c ? "selected" : ""}>
    ${escapeHTML(c)}</option>

    `,
    )
    .join("");

  const categoryOptions = ["luxury", "prestige", "mass"]
    .map(
      (c) =>
        `<option value="${c}" ${category === c ? "selected" : ""}>${c}</option>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Marques de maquillage — Annuaire</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        font-family:
          system-ui,
          -apple-system,
          "Segoe UI",
          Roboto,
          sans-serif;
        margin: 0;
        padding: 2rem 1.5rem;
        background: #faf7fb;
        color: #1a1a1a;
        line-height: 1.5;
      }
      .container {
        max-width: 1100px;
        margin: 0 auto;
      }
      h1 {
        margin: 0 0 0.25rem;
        font-size: 1.9rem;
        font-weight: 700;
      }
      p.sub {
        color: #666;
        margin: 0 0 1.5rem;
        font-size: 0.95rem;
      }
      .filters {
        display: flex;
        gap: 0.6rem;
        margin-bottom: 1.25rem;
        flex-wrap: wrap;
        align-items: center;
      }
      .filters input,
      .filters select {
        padding: 0.55rem 0.8rem;
        border: 1px solid #e5e5e5;
        border-radius: 10px;
        font-size: 0.95rem;
        background: #fff;
        min-width: 180px;
      }
      .filters input:focus,
      .filters select:focus {
        outline: none;
        border-color: #d63384;
        box-shadow: 0 0 0 3px rgba(214, 51, 132, 0.1);
      }
      .filters button {
        padding: 0.55rem 1.1rem;
        border: none;
        border-radius: 10px;
        background: #d63384;
        color: #fff;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.95rem;
      }
      .filters button:hover {
        background: #c12a75;
      }
      .filters a {
        padding: 0.55rem 0.8rem;
        color: #7b2ff7;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.95rem;
      }
      .filters a:hover {
        text-decoration: underline;
      }
      .table-wrapper {
        background: #fff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
        overflow-x: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        min-width: 640px;
      }
      thead {
        background: linear-gradient(135deg, #d63384, #7b2ff7);
        color: #fff;
      }
      th,
      td {
        padding: 1rem 1.1rem;
        text-align: left;
        font-size: 0.95rem;
      }
      th {
        font-weight: 600;
        letter-spacing: 0.3px;
      }
      tbody tr {
        border-bottom: 1px solid #f3f3f3;
      }
      tbody tr:hover {
        background: #fdf6fa;
      }
      tbody tr:last-child {
        border-bottom: none;
      }
      a.brand-link {
        color: #7b2ff7;
        text-decoration: none;
        font-weight: 600;
      }
      a.brand-link:hover {
        text-decoration: underline;
      }
      .badge {
        display: inline-block;
        padding: 0.25rem 0.7rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: capitalize;
      }
      .luxury {
        background: #fff3cd;
        color: #8a6d00;
      }
      .prestige {
        background: #fde2ef;
        color: #a11f63;
      }
      .mass {
        background: #d4edda;
        color: #0a5c1c;
      }
      .empty {
        padding: 3rem 1.5rem;
        text-align: center;
        color: #888;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>💄 Annuaire des marques de maquillage</h1>
      <p class="sub">
        Affichage de <strong>${list.length}</strong> marque${
          list.length === 1 ? "" : "s"
        }
      </p>

      <form class="filters" method="GET" action="/">
        <input
          type="text"
          name="search"
          placeholder="Rechercher une marque..."
          value="${escapeHTML(search)}"
        />
        <select name="category">
          <option value="">Toutes les catégories</option>
          ${categoryOptions}
        </select>
        <select name="country">
          <option value="">Tous les pays</option>
          ${countryOptions}
        </select>
        <button type="submit">Filtrer</button>
        <a href="/">Réinitialiser</a>
      </form>

      ${
        list.length === 0
          ? `
      <div class="empty">Aucune marque ne correspond aux filtres.</div>
      `
          : `
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Marque</th>
              <th>Site web</th>
              <th>Pays</th>
              <th>Catégorie</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
      `
      }
    </div>
  </body>
</html>
`;

  res.send(html);
});

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

app.get("/api/brands-list", (req, res) => {
  res.json(brands.map(({ name, website }) => ({ name, website })));
});

app.get("/api/brands/:id", (req, res) => {
  const brand = brands.find((b) => b.id === parseInt(req.params.id));
  if (!brand) return res.status(404).json({ error: "marque Non Trouvée" });
  res.json(brand);
});

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Serveur Démarré : http://localhost:${PORT}`);
    console.log(`Tableau des Marques : http://localhost:${PORT}/`);
    console.log(`Api JSON : http://localhost:${PORT}/api/brands`);
  });
}

export default app;
