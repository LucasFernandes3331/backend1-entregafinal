const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/', async (req, res) => {
    try { const newCart = await cartController.create(); res.status(201).json(newCart); }
    catch (e) { res.status(500).json({ error: 'Error creating cart' }); }
});

router.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartController.getById(cid);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        res.json(cart);
    } catch (e) { res.status(500).json({ error: 'Error fetching cart' }); }
});

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const updated = await cartController.addProduct(cid, pid);
        res.json(updated);
    } catch (e) { res.status(500).json({ error: 'Error adding product to cart' }); }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const updated = await cartController.removeProduct(cid, pid);
        res.json(updated);
    } catch (e) { res.status(500).json({ error: 'Error removing product from cart' }); }
});

module.exports = router;