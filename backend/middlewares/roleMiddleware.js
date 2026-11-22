/**
 * Middleware de contrôle des rôles.
 * Usage : authorizeRoles('Admin') ou authorizeRoles('Admin', 'User')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Permissions insuffisantes',
      });
    }
    next();
  };
};

module.exports = { authorizeRoles };