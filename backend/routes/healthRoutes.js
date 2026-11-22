const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

/**
 * GET /api/health
 * Vérifie que l'API fonctionne et renvoie l'état réel de la base de données.
 */
router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  // 1 = connected
  const database = dbState === 1 ? 'connected' : 'disconnected';

  res.status(200).json({
    success: true,
    message: 'StockMaster API is running',
    database,
  });
});

module.exports = router;