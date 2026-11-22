const mongoose = require('mongoose');

/**
 * Établit la connexion à MongoDB à partir de la variable d'environnement MONGO_URI.
 * En cas d'échec, le processus est arrêté avec un code de sortie non nul.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MONGO_URI n\'est pas défini dans les variables d\'environnement.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erreur de connexion MongoDB : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;