# BLOG_SPEC.md — Bible de publication ALUR42
# À lire OBLIGATOIREMENT avant chaque publication d'article

---

## 🔴 RÈGLES ABSOLUES — NE JAMAIS VIOLER

1. **Tu ne touches JAMAIS `style.css`**
2. **Tu ne touches JAMAIS les autres fichiers HTML** (index.html, faq.html, contact.html, formulaires.html, form-*.html, dossier-opco.html)
3. **Tu n'écris JAMAIS de CSS inline** dans les articles (pas de `style="..."` sauf ceux déjà présents dans le template)
4. **Tu n'inventes JAMAIS de classes CSS** — tu utilises uniquement les classes listées ci-dessous
5. **Tu ne modifies JAMAIS la structure HTML** des templates — tu remplis les variables, c'est tout
6. **Tu copies toujours le template EXACTEMENT** depuis `_templates/`

---

## 📋 PROCESSUS EN 3 ÉTAPES — À SUIVRE DANS L'ORDRE

### Étape 1 — Créer le fichier article
1. Copier `_templates/blog-article.html`
2. Renommer en `blog/{{SLUG}}.html` (ex: `blog/blog-financement-opco.html`)
3. Remplacer toutes les variables `{{...}}` par le contenu de l'article
4. Ne toucher à rien d'autre

### Étape 2 — Ajouter la card dans blog.html
1. Ouvrir `blog.html`
2. Copier le contenu de `_templates/blog-card.html`
3. Coller JUSTE AVANT le commentaire `<!-- ARTICLE 1 -->` (= tout en haut de la grille, nouvel article en premier)
4. Remplacer les variables `{{...}}`
5. Sauvegarder

### Étape 3 — Vérification
- Vérifier que le fichier article est bien dans `/blog/`
- Vérifier que le lien dans la card pointe vers `blog/{{SLUG}}.html`
- Vérifier qu'aucune classe inventée n'a été ajoutée

---

## ✅ VARIABLES DU TEMPLATE ARTICLE

| Variable | Description | Exemple |
|---|---|---|
| `{{META_TITRE}}` | Titre SEO (max 60 car.) | `Guide financement OPCO ALUR` |
| `{{META_DESC}}` | Description SEO (max 160 car.) | `Comment financer votre formation...` |
| `{{SLUG}}` | Nom du fichier sans .html | `blog-financement-opco` |
| `{{DATE_ISO}}` | Date ISO 8601 | `2025-03-15` |
| `{{BREADCRUMB_TITRE}}` | Fil d'Ariane (court) | `Financement OPCO` |
| `{{EMOJI_BADGE}}` | Emoji du badge hero | `💰` |
| `{{LABEL_BADGE}}` | Texte du badge | `Guide pratique` |
| `{{TITRE_H1}}` | H1 de l'article (peut contenir `<em>texte</em>`) | `Financement OPCO : <em>0€ reste à charge</em>` |
| `{{DATE_AFFICHAGE}}` | Date lisible | `Mis à jour : mars 2025` |
| `{{DUREE_LECTURE}}` | Durée estimée | `6 min de lecture` |
| `{{AUDIENCE}}` | Public cible | `Agents immobiliers, mandataires` |
| `{{INTRO_RESUME}}` | Résumé intro (après "En résumé :") | `La formation ALUR peut être...` |
| `{{STAT1_NUM}}` / `{{STAT1_UNITE}}` / `{{STAT1_LABEL}}` | Stats chiffres | `42` / `h` / `de formation sur 3 ans` |
| `{{CONTENU_ARTICLE}}` | Corps de l'article (HTML) | Voir balises autorisées ci-dessous |
| `{{TAGS}}` | Tags de l'article | `<span class="tag">OPCO</span>` |
| `{{SOMMAIRE}}` | Items TOC sidebar | `<li><a href="#ancre">1. Titre</a></li>` |

---

## ✅ VARIABLES DU TEMPLATE CARD

| Variable | Description | Exemple |
|---|---|---|
| `{{SLUG}}` | Nom du fichier sans .html | `blog-financement-opco` |
| `{{EMOJI}}` | Emoji principal | `💰` |
| `{{EMOJI_CAT}}` | Emoji catégorie | `💡` |
| `{{CATEGORIE}}` | Texte catégorie | `Financement` |
| `{{TITRE}}` | Titre de l'article | `Guide financement OPCO...` |
| `{{EXTRAIT}}` | Résumé court (max 160 car.) | `ATLAS, AGEFICE, FIFPL...` |
| `{{DATE}}` | Date | `Mars 2025` |
| `{{DUREE_LECTURE}}` | Durée | `6 min` |

---

## ✅ BALISES HTML AUTORISÉES dans `{{CONTENU_ARTICLE}}`

```html
<!-- Titres de section (avec id pour le sommaire) -->
<h2 id="ancre-unique">Titre de la section</h2>
<h3>Sous-titre</h3>

<!-- Texte -->
<p>Paragraphe normal.</p>
<p><strong>Texte en gras</strong> dans un paragraphe.</p>

<!-- Boîtes highlight -->
<div class="highlight-box">
  <div class="box-title">💡 Titre de la boîte</div>
  <p>Contenu de la boîte.</p>
</div>
<div class="highlight-box teal">...</div>   <!-- vert -->
<div class="highlight-box gold">...</div>   <!-- or/avertissement -->
<div class="highlight-box danger">...</div> <!-- rouge/danger -->

<!-- Tableau -->
<div class="table-wrap">
  <table>
    <thead><tr><th>Col 1</th><th>Col 2</th></tr></thead>
    <tbody>
      <tr><td>Valeur</td><td><span class="badge-ok">✓ Oui</span></td></tr>
      <tr><td>Valeur</td><td><span class="badge-warn">Variable</span></td></tr>
      <tr><td>Valeur</td><td><span class="badge-no">✗ Non</span></td></tr>
    </tbody>
  </table>
</div>

<!-- Timeline -->
<div class="timeline">
  <div class="timeline-item">
    <div class="tl-dot">2024</div>
    <div class="tl-content">
      <div class="tl-year">Janvier 2024</div>
      <div class="tl-title">Titre de l'étape</div>
      <div class="tl-text">Description de l'étape.</div>
    </div>
  </div>
</div>

<!-- Stats grid -->
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-num">42<span>h</span></div>
    <div class="stat-label">de formation obligatoire</div>
  </div>
</div>

<!-- Liste -->
<ul style="margin:16px 0 18px 20px;display:flex;flex-direction:column;gap:10px">
  <li style="color:#2d3f56;font-size:15.5px;line-height:1.7"><strong>Point 1</strong> : description.</li>
  <li style="color:#2d3f56;font-size:15.5px;line-height:1.7">Point 2.</li>
</ul>
```

---

## 🚫 BALISES INTERDITES dans `{{CONTENU_ARTICLE}}`

- `<style>` ou toute règle CSS
- `<div class="...">` avec des classes qui n'existent pas dans la liste ci-dessus
- `style="..."` inline inventé (sauf les listes ci-dessus qui sont dans le template)
- `<script>`
- `<iframe>`
- Toute modification de la navbar, footer, sidebar — ils sont figés dans le template

---

## 📁 STRUCTURE FINALE APRÈS PUBLICATION

```
alur42/
├── blog/
│   ├── blog-alur1.html         ← article existant (ne pas modifier)
│   └── blog-{{SLUG}}.html      ← nouvel article créé
├── blog.html                   ← modifié : nouvelle card ajoutée EN PREMIER
├── _templates/
│   ├── blog-article.html       ← template (ne jamais modifier)
│   └── blog-card.html          ← template (ne jamais modifier)
└── style.css                   ← JAMAIS TOUCHER
```
