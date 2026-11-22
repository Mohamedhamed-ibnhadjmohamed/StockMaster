const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const healthRoutes = require('./routes/healthRoutes');
const errorHandler = require('./middlewares/errorHandler');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middlewares globaux
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenue sur l\'API StockMaster',
  });
});

app.use('/api', healthRoutes);

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
  });
});

// Gestion centralisée des erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connecter MongoDB puis démarrer le serveur
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Serveur StockMaster démarré sur le port ${PORT}`);
  });
};

startServer();

module.exports = app;