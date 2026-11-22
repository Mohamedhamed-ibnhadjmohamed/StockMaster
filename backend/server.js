const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Route de santé
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API StockMaster fonctionne correctement',
  });
});

const PORT = process.env.PORT || 5000;

// Connexion à MongoDB (optionnelle au démarrage, ne bloque pas le serveur)
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI && MONGO_URI !== 'your_mongodb_connection_string') {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log('Connecté à MongoDB'))
    .catch((err) => console.error('Erreur de connexion MongoDB :', err.message));
}

app.listen(PORT, () => {
  console.log(`Serveur StockMaster démarré sur le port ${PORT}`);
});

module.exports = app;