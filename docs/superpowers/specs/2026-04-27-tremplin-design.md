# Tremplin — Design Spec

**Date:** 2026-04-27  
**Auteure:** Louise Heraud  
**Statut:** Approuvé

---

## Contexte

Site de coaching pour étudiants en prépa. Louise propose des sessions individuelles en visio pour les aider à préparer leurs candidatures post-prépa (grandes écoles). Les étudiants arrivent sur le site, choisissent leur besoin, lisent la présentation de la session, et réservent un créneau directement.

---

## Services proposés

| Service | Durée | Format | Bonus |
|---|---|---|---|
| Lettre de motivation | 30 min | Visio | Relecture incluse |
| CV | 20 min | Visio | PDF de conseils envoyé |
| Entraînement aux oraux | 45 min | Visio | Fiche de feedback J+1 |

---

## Architecture

**Stack :** Next.js (App Router) + TypeScript, déployé sur Vercel  
**Booking :** Calendly embed (un lien par service)  
**Styling :** Tailwind CSS  
**Composants :** 21st.dev Magic MCP pour les composants UI  

Une seule app Next.js, pas de backend, pas de base de données.

---

## Structure des pages

```
/                   → Redirect vers /oraux (ou page d'accueil minimaliste)
/lettre             → Page service Lettre de motivation
/cv                 → Page service CV
/oraux              → Page service Entraînement aux oraux
```

Layout global : sidebar fixe à gauche + zone de contenu à droite.

---

## Design

- **Style :** Clean & Modern — fond blanc/gris clair, accent indigo (#6366f1), sans-serif (Inter)
- **Sidebar :** fond sombre (#111827), logo "Tremplin" en haut, 3 nav items, footer avec nom
- **Page service :**
  1. Top bar (titre + badge durée/format)
  2. Hero card (gradient indigo, accroche, sous-titre)
  3. Stats row (3 chiffres clés)
  4. Steps (4 étapes numérotées du déroulé)
  5. CTA (bouton "Réserver un créneau" → Calendly + bouton secondaire "Des questions ?")

---

## Comportement

- Navigation sidebar : clic sur un service → l'URL change, la page se met à jour
- Bouton "Réserver un créneau" : ouvre le widget Calendly (popup ou inline selon la page)
- Bouton "Des questions ?" : ouvre le client mail avec adresse pré-remplie
- Responsive : sur mobile, la sidebar devient un menu hamburger en haut

---

## Ce qui est hors scope

- Authentification / espace élève
- Paiement en ligne
- Blog ou contenu éditorial
- CMS
