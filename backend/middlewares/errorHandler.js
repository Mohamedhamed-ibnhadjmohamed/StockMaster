/**
 * Middleware de gestion centralisée des erreurs Express.
 * Doit être enregistré en dernier dans la chaîne de middlewares.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Erreur interne du serveur',
  });
};

module.exports = errorHandler;