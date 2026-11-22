# StockMaster

## Description

StockMaster est une application web de gestion et de suivi des stocks destinée aux petites et moyennes entreprises (PME). Elle permet de gérer les produits, les mouvements de stock et le suivi des inventaires.

## Objectif principal

Fournir une solution simple et efficace pour la gestion des stocks des PME, avec une séparation claire entre le backend (API) et le frontend (interface utilisateur).

## Technologies utilisées

- **Backend** : Node.js, Express.js, MongoDB (Mongoose)
- **Frontend** : React.js, Vite, JavaScript (JSX)
- **State management** : Redux Toolkit
- **HTTP client** : Axios
- **Routing** : React Router DOM

## Prérequis

- Node.js (v18 ou supérieur)
- npm
- MongoDB (local ou Atlas)
- Git

## Structure du projet

```text
StockMaster/
├── backend/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   └── services/
│   ├── .env.example
│   ├── package.json
│   └── ...
├── .gitignore
├── README.md
└── .env.example
```

## Installation des dépendances

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Démarrage

### Backend

```bash
cd backend
npm run dev
```

Le serveur démarre sur `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

## Variables d'environnement

Créer un fichier `.env` dans `backend/` à partir de `.env.example` :

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Créer un fichier `.env` dans `frontend/` à partir de `.env.example` :

```env
VITE_API_URL=http://localhost:5000/api
```

## URLs locales

- Frontend : `http://localhost:5173`
- API : `http://localhost:5000`
- Health check : `http://localhost:5000/api/health`