const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// Obtener todos los usuarios solo para admin
router.get('/', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
        const users = await userController.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo usuarios' });
    }
});

// Obtener usuario por ID 
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const user = await userController.getById(req.params.id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo usuario' });
    }
});

// Actualizar usuario 
router.put('/:id', requireAuth, async (req, res) => {
    try {
        // Los usuarios solo pueden actualizar sus propios datos 
        if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'No tienes permiso para actualizar este usuario' });
        }

        // No permitir cambiar valores
        const { email, role, password, ...allowedUpdates } = req.body;

        const updated = await userController.update(req.params.id, allowedUpdates);
        if (!updated) return res.status(404).json({ error: 'Usuario no encontrado' });
        
        res.json({
            message: 'Usuario actualizado exitosamente',
            user: updated
        });
    } catch (error) {
        res.status(500).json({ error: 'Error actualizando usuario' });
    }
});

// Eliminar usuario solo admin puede eliminar usuarios
router.delete('/:id', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
        const deleted = await userController.delete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Usuario no encontrado' });
        
        res.json({
            message: 'Usuario eliminado exitosamente',
            user: deleted
        });
    } catch (error) {
        res.status(500).json({ error: 'Error eliminando usuario' });
    }
});

module.exports = router;
