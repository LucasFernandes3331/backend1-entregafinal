const express = require('express');
const router = express.Router();
const { passport } = require('../config/passport');
const UserDTO = require('../dtos/UserDTO');

// Endpoint para obtener el usuario actual autenticado
router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        const userDTO = new UserDTO(req.user);
        res.json({
            user: userDTO
        });
    } catch (error) {
        console.error('Error en /current:', error);
        res.status(500).json({ error: 'Error validando usuario' });
    }
});

module.exports = router;
