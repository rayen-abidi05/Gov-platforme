# MARHP — Plateforme Nationale d'Exportation de l'Huile d'Olive

> **Confidentiel — Usage gouvernemental restreint**
> Ce dépôt contient le code source d'une plateforme officielle développée pour le Ministère de l'Agriculture, des Ressources Hydrauliques et de la Pêche (République Tunisienne). L'accès, la distribution et l'utilisation de ce code sont strictement réservés aux personnes autorisées. Toute divulgation non autorisée est interdite.

## À propos

La Tunisie figure parmi les plus grands exportateurs mondiaux d'huile d'olive. Cette plateforme numérise et centralise le processus d'autorisation d'exportation — historiquement manuel et cloisonné entre plusieurs administrations — en un système unique, traçable et sécurisé.

Elle relie les exportateurs, le Ministère, la Douane, l'INSPA et les instances de décision autour d'un même flux : de l'inscription d'une société exportatrice jusqu'à l'autorisation finale d'exporter, avec un contrôle documentaire et une traçabilité complète à chaque étape.

## Stack technique

### Frontend
- **Next.js 14** (App Router) — rendu hybride serveur/client selon le contexte de chaque page
- **TypeScript** — typage strict de bout en bout
- **Tailwind CSS** — système de design personnalisé (charte visuelle du Ministère)
- **TanStack Query** — gestion de l'état serveur, cache et synchronisation
- **Axios** — client HTTP avec intercepteurs pour la gestion automatique du rafraîchissement de session
- **React Hook Form + Zod** — validation de formulaires typée et partagée entre client et schéma
- **Recharts** — visualisation de données (tableaux de bord administratifs)
- **Lucide React** — iconographie

### Backend
- **Node.js / Express** — API REST
- **Prisma ORM** — accès base de données typé, migrations versionnées
- **PostgreSQL** — base de données relationnelle
- **JWT (jose)** — authentification par jetons, stockés en cookies `httpOnly`
- **Multer** — gestion des téléversements de documents

### Architecture

- **Multi-portails par rôle** — chaque type d'utilisateur (exportateur, administrateur, membre douanier, ministre, inspecteur) dispose d'un espace dédié avec des permissions et des vues distinctes, sur une base de code unique.
- **Contrôle d'accès par rôle (RBAC)** — appliqué à la fois côté serveur (middleware) et côté client (garde de route), avec vérification systématique de propriété des ressources.
- **Flux de validation documentaire** — chaque dossier suit un cycle de révision structuré (soumission → examen → décision), avec journalisation des actions et notifications ciblées.
- **Révision collégiale** — certaines décisions passent par une instance de délibération constituée dynamiquement, dont les délibérations internes restent confidentielles vis-à-vis des parties externes.
- **Stockage et accès aux documents** — chaque document est lié à son dossier d'origine et son accès est strictement limité aux parties autorisées et aux rôles de supervision habilités.

## Statut

Projet en développement actif.

---

© Ministère de l'Agriculture, des Ressources Hydrauliques et de la Pêche — République Tunisienne. Tous droits réservés.
