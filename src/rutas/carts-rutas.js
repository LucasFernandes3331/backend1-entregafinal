const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const CartRepository = require('../repositories/CartRepository');
const { requireAuth, isUser } = require('../middleware/authMiddleware');

const cartRepo = new CartRepository();

router.post('/', async (req, res) => {
    try { const newCart = await cartController.create(); res.status(201).json(newCart); }
    catch (e) { res.status(500).json({ error: 'Error creating cart' }); }
});

router.get('/:cid', requireAuth, async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartController.getById(cid);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        res.json(cart);
    } catch (e) { res.status(500).json({ error: 'Error fetching cart' }); }
});

router.post('/:cid/products/:pid', requireAuth, isUser, async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity = 1 } = req.body;
        const updated = await cartRepo.addProduct(cid, pid, parseInt(quantity));
        res.json(updated);
    } catch (e) { 
        console.error(e);
        res.status(500).json({ error: e.message || 'Error adding product to cart' }); 
    }
});

router.delete('/:cid/products/:pid', requireAuth, isUser, async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updated = await cartRepo.removeProduct(cid, pid);
        res.json(updated);
    } catch (e) { res.status(500).json({ error: 'Error removing product from cart' }); }
});

router.delete('/:cid', requireAuth, isUser, async (req, res) => {
    try {
        const { cid } = req.params;
        const updated = await cartRepo.clear(cid);
        res.json({ message: 'Carrito vaciado', cart: updated });
    } catch (e) { res.status(500).json({ error: 'Error clearing cart' }); }
});

module.exports = router;