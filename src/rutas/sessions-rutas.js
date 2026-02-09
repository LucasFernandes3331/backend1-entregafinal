const express = require('express');
const router = express.Router();
const { passport } = require('../config/passport');

// Endpoint para obtener el usuario actual autenticado
router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        res.json({
            user: {
                id: req.user._id,
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                role: req.user.role,
                cart: req.user.cart
            }
        });
    } catch (error) {
        console.error('Error en /current:', error);
        res.status(500).json({ error: 'Error validando usuario' });
    }
});

module.exports = router;
