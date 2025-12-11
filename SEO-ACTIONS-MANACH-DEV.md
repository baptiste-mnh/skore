# Actions SEO à faire sur manach.dev

Ce document liste toutes les actions à effectuer sur votre domaine principal **manach.dev** pour améliorer le référencement de **skore.manach.dev**.

---

## 🎯 Objectif

Créer des backlinks depuis votre domaine principal (manach.dev) vers votre sous-domaine (skore.manach.dev). C'est le **facteur SEO #1** pour booster un sous-domaine car Google transmet l'autorité du domaine parent.

---

## ✅ Actions à réaliser

### 1. Ajouter une section "Projets" (Priorité : HAUTE)

**Impact SEO : ⭐⭐⭐⭐⭐**

Créez une section visible sur la page d'accueil ou page "Projects" :

```html
<section class="projects">
  <h2>My Projects</h2>

  <article class="project-card">
    <h3>
      <a href="https://skore.manach.dev" rel="noopener">
        Skore - Real-time Score Tracker
      </a>
    </h3>
    <p>
      Free peer-to-peer score tracking app for any game.
      No account needed, just share a room code and start tracking scores with friends.
      Built with React, WebRTC, and Socket.io.
    </p>
    <ul>
      <li>🎮 Perfect for board games, sports, and competitions</li>
      <li>🚀 Real-time sync across all devices</li>
      <li>🔒 Privacy-first with P2P connections</li>
    </ul>
    <a href="https://skore.manach.dev" class="cta-button" rel="noopener">
      Try Skore →
    </a>
  </article>

  <!-- Autres projets... -->
</section>
```

**Points clés :**
- Utilisez des mots-clés SEO : "score tracker", "real-time", "board games"
- Lien `rel="noopener"` pour la sécurité (mais pas `nofollow` !)
- Description claire et attractive

---

### 2. Ajouter dans le Footer (Priorité : HAUTE)

**Impact SEO : ⭐⭐⭐⭐**

Ajoutez un lien permanent dans le footer (présent sur toutes les pages) :

```html
<footer>
  <nav class="footer-links">
    <div class="footer-section">
      <h4>Projects</h4>
      <ul>
        <li><a href="https://skore.manach.dev">Skore</a></li>
        <!-- Autres projets -->
      </ul>
    </div>

    <div class="footer-section">
      <h4>Contact</h4>
      <!-- ... -->
    </div>
  </nav>

  <p>&copy; 2025 Baptiste Manach</p>
</footer>
```

**Pourquoi c'est important :**
- Lien présent sur **toutes** les pages de manach.dev
- Signal fort pour Google qu'il s'agit d'un projet officiel
- Améliore le PageRank transmis

---

### 3. Écrire un article de blog (Priorité : MOYENNE - Optionnel mais puissant)

**Impact SEO : ⭐⭐⭐⭐⭐**

Créez un article de blog sur manach.dev :

**Titre suggéré :**
- "How I Built Skore: A Real-time P2P Score Tracker with WebRTC"
- "Building a Peer-to-Peer Score Tracker with React and WebRTC"

**Structure de l'article :**

```markdown
# How I Built Skore: A Real-time P2P Score Tracker

## The Problem

When playing board games with friends, we needed a simple way to track scores
across multiple devices without creating accounts or downloading apps.

## The Solution

I built [Skore](https://skore.manach.dev), a free web-based score tracker
that uses WebRTC for peer-to-peer connections.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Real-time**: WebRTC + Socket.io signaling
- **Backend**: Node.js (signaling server only)

## Key Features

1. **No Backend Storage**: All data stays on your devices
2. **Room Codes**: Share a 6-character code to join
3. **Real-time Sync**: Scores update instantly via WebRTC
4. **Mobile-first**: Works on any device

## Architecture

[Expliquez comment fonctionne WebRTC, le signaling server, etc.]

## Challenges

[Les défis techniques que vous avez rencontrés]

## Try It Yourself

Check out [Skore](https://skore.manach.dev) and let me know what you think!

Source code: [GitHub](https://github.com/baptiste-mnh/skore)
```

**Optimisations SEO pour l'article :**
- Utilisez les mots-clés : "score tracker", "WebRTC", "real-time", "P2P"
- Incluez 3-5 liens vers `https://skore.manach.dev`
- Ajoutez des images/screenshots
- Partagez l'article sur Reddit (r/webdev, r/reactjs), Twitter, LinkedIn

---

### 4. Google Search Console (Priorité : HAUTE)

**Impact SEO : ⭐⭐⭐⭐⭐**

**Étapes :**

1. **Inscrivez-vous à Google Search Console**
   - URL : https://search.google.com/search-console
   - Cliquez sur "Ajouter une propriété"

2. **Ajoutez skore.manach.dev**
   - Type : "Préfixe de l'URL"
   - Entrez : `https://skore.manach.dev`

3. **Vérification du domaine**
   - Méthode recommandée : DNS (TXT record)
   - Ou : Upload d'un fichier HTML sur le serveur

4. **Soumettez le sitemap**
   - Dans Search Console → Sitemaps
   - Ajoutez : `https://skore.manach.dev/sitemap.xml`
   - Cliquez sur "Envoyer"

5. **Demandez une indexation**
   - Allez dans "Inspection de l'URL"
   - Entrez : `https://skore.manach.dev`
   - Cliquez sur "Demander une indexation"

**Résultat attendu :**
- Indexation dans les 24-48h
- Apparition dans les résultats Google sous 3-7 jours

---

### 5. Bing Webmaster Tools (Priorité : BASSE - Optionnel)

**Impact SEO : ⭐⭐**

Même processus que Google Search Console :
- URL : https://www.bing.com/webmasters
- Ajoutez `https://skore.manach.dev`
- Soumettez le sitemap

---

### 6. Social Media & Promotion (Priorité : MOYENNE)

**Impact SEO : ⭐⭐⭐**

Partagez Skore depuis vos comptes liés à manach.dev :

**Twitter/X :**
```
🎮 Just launched Skore - a free real-time score tracker for any game!

✨ No account needed
🔗 Share a code, track scores together
🚀 Built with React + WebRTC

Try it: https://skore.manach.dev

#webdev #react #WebRTC
```

**Reddit :**
- r/webdev : "I built a P2P score tracker with WebRTC"
- r/reactjs : "Built with React 19 + WebRTC"
- r/boardgames : "Free score tracker for board games"

**Product Hunt :**
- Soumettez Skore comme nouveau produit
- Lien vers skore.manach.dev

---

## 📊 Suivi & Analytics

### Ajouter Google Analytics (ou Plausible)

Sur **skore.manach.dev**, ajoutez un outil d'analytics :

**Option 1 : Plausible (Privacy-friendly)**
```html
<script defer data-domain="skore.manach.dev" src="https://plausible.io/js/script.js"></script>
```

**Option 2 : Google Analytics 4**
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🖼️ Améliorer l'image Open Graph

### Créer og-image.png (1200x630px)

**Option 1 : Screenshot de l'app**
1. Ouvrez Skore dans votre navigateur
2. Prenez un screenshot d'une partie en cours
3. Recadrez à 1200x630px
4. Compressez avec [TinyPNG](https://tinypng.com)

**Option 2 : Design sur Canva**
1. Canva → "Social Media" → "Facebook Post" (1200x630px)
2. Ajoutez :
   - Logo "Skore."
   - Tagline : "Real-time Score Tracker"
   - URL : skore.manach.dev
   - Mockup de l'interface
3. Exportez en PNG

**Option 3 : Figma**
Créez un design avec :
- Fond blanc ou avec dégradé subtil
- Logo + titre + description
- Screenshot de l'app en arrière-plan

**Déploiement :**
```bash
# Remplacez le fichier
mv og-image.png /Users/baptiste-mnh/Projects/skore/client/public/

# Ou convertissez le SVG actuel
# (nécessite Inkscape ou ImageMagick)
```

---

## 📝 Checklist Récapitulative

```markdown
### Sur manach.dev :
- [ ] Ajouter section "Projets" avec lien vers Skore
- [ ] Ajouter lien Skore dans le footer
- [ ] Écrire un article de blog sur la création de Skore (optionnel)
- [ ] Partager sur Twitter/LinkedIn

### Sur skore.manach.dev :
- [ ] Créer og-image.png (1200x630px)
- [ ] Ajouter Google Analytics ou Plausible

### Google :
- [ ] S'inscrire à Google Search Console
- [ ] Ajouter skore.manach.dev comme propriété
- [ ] Soumettre sitemap.xml
- [ ] Demander indexation manuelle

### Promotion :
- [ ] Partager sur Reddit (r/webdev, r/reactjs)
- [ ] Soumettre à Product Hunt
- [ ] Ajouter sur GitHub Topics/Tags
```

---

## 🎯 Résultats Attendus

**Court terme (1-7 jours) :**
- Indexation par Google
- Première apparition dans les résultats de recherche

**Moyen terme (2-4 semaines) :**
- Amélioration du classement pour "score tracker", "online scoreboard"
- Trafic depuis les recherches Google

**Long terme (2-6 mois) :**
- Autorité de domaine accrue
- Backlinks naturels depuis d'autres sites
- Trafic organique stable

---

## 💡 Conseils Supplémentaires

1. **Cohérence de la marque**
   - Utilisez toujours "Skore" (même capitalisation)
   - Signature : "by Manach.dev" ou "by Baptiste Manach"

2. **Contenu régulier**
   - Ajoutez des features → écrivez un article
   - Changelog visible sur le site

3. **Open Source**
   - GitHub bien documenté = backlinks naturels
   - README attractif avec screenshots

4. **Communauté**
   - Répondez aux questions sur Stack Overflow en mentionnant Skore
   - Créez une page "Uses" qui mentionne vos projets

---

## 📚 Ressources

- [Google Search Console Help](https://support.google.com/webmasters)
- [Moz Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo)
- [Schema.org Documentation](https://schema.org/docs/gs.html)

---

**Dernière mise à jour :** 2025-12-11
