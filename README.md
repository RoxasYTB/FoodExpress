# FoodExpress API

API REST pour la gestion de commandes de nourriture en ligne avec MongoDB.

## Prérequis

- Node.js (v14+)
- MongoDB (local sur port 27017)

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env` à la racine :

```
PORT=3000
JWT_SECRET=votre_secret_jwt_ici
MONGODB_URI=mongodb://localhost:27017/foodexpress
```

## Démarrage MongoDB

Assurez-vous que MongoDB est lancé :

```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

## Démarrage de l'API

```bash
npm start
```

Pour le développement :

```bash
npm run dev
```

## Tests

```bash
npm test
```

## Documentation

La documentation Swagger est disponible à : `http://localhost:3000/api-docs`

## Endpoints principaux

### Utilisateurs

- POST `/api/users/register` - Inscription
- POST `/api/users/login` - Connexion
- GET `/api/users` - Liste (admin)
- GET `/api/users/:id` - Détails
- PUT `/api/users/:id` - Modification
- DELETE `/api/users/:id` - Suppression

### Restaurants

- GET `/api/restaurants` - Liste (public)
- GET `/api/restaurants/:id` - Détails (public)
- POST `/api/restaurants` - Création (admin)
- PUT `/api/restaurants/:id` - Modification (admin)
- DELETE `/api/restaurants/:id` - Suppression (admin)

### Menus

- GET `/api/menus` - Liste (public)
- GET `/api/menus/:id` - Détails (public)
- POST `/api/menus` - Création (admin)
- PUT `/api/menus/:id` - Modification (admin)
- DELETE `/api/menus/:id` - Suppression (admin)

## Authentification

L'API utilise JWT. Après connexion, utiliser le token dans le header :

```
Authorization: Bearer <token>
```

## Base de données

Le projet utilise MongoDB avec Mongoose. Les données sont stockées dans la base `foodexpress` sur `localhost:27017`.

### Collections

- `users` - Utilisateurs
- `restaurants` - Restaurants
- `menus` - Menus des restaurants
