const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware de protection : vérifie le JWT dans l'en-tête Authorization.
 * Ajoute l'utilisateur authentifié à req.user.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé, token manquant',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Configuration JWT manquante',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    req.user = { id: user._id, role: user.role, name: user.name, email: user.email };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token invalide',
    });
  }
};

module.exports = { protect };