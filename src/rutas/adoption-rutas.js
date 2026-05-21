const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try {
        const items = await adoptionController.list();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching adoption requests' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const adoption = await adoptionController.getById(req.params.id);
        if (!adoption) {
            return res.status(404).json({ error: 'Adoption request not found' });
        }
        res.json(adoption);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching adoption request' });
    }
});

router.post('/', requireAuth, async (req, res) => {
    try {
        const { petName, adopterName, type } = req.body;
        if (!petName || !adopterName) {
            return res.status(400).json({ error: 'petName and adopterName are required' });
        }

        const created = await adoptionController.create({ petName, adopterName, type });
        res.status(201).json(created);
    } catch (error) {
        res.status(500).json({ error: 'Error creating adoption request' });
    }
});

router.put('/:id', requireAuth, async (req, res) => {
    try {
        const updates = req.body;
        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'At least one field is required to update' });
        }

        const updated = await adoptionController.update(req.params.id, updates);
        if (!updated) {
            return res.status(404).json({ error: 'Adoption request not found' });
        }
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Error updating adoption request' });
    }
});

router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const deleted = await adoptionController.remove(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Adoption request not found' });
        }
        res.json(deleted);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting adoption request' });
    }
});

module.exports = router;
