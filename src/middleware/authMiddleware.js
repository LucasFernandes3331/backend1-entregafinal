const { passport } = require('../config/passport');

const authMiddleware = passport.authenticate('jwt', { session: false });

const requireAuth = (req, res, next) => {
    authMiddleware(req, res, (err) => {
        if (err) {
            return res.status(401).json({ error: 'No autorizado', details: err });
        }
        if (!req.user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        next();
    });
};

const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'No tienes permiso para acceder a este recurso' });
        }
        next();
    };
};

module.exports = {
    authMiddleware,
    requireAuth,
    requireRole
};
