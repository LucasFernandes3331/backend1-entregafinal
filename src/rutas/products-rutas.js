const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// metodos CRUD para productos
// metodo gets
router.get('/', async (req, res) => {
    try {
        const { limit, page, sort, query, value } = req.query;
        const products = await productController.list({ limit, page, sort, query, value });
        res.status(200).json(products);
    } catch (e) { res.status(500).json({ error: 'Error fetching products' }); }
});

router.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await productController.getById(pid);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (e) { res.status(500).json({ error: 'Error fetching product' }); }
});

//metodos post put delete
router.post('/', async (req, res) => {
    try {
        const newProduct = await productController.create(req.body);
        const io = req.app.get('io');
        if (io) io.emit('products', await productController.list());
        res.status(201).json(newProduct);
    } catch (e) { res.status(500).json({ error: 'Error adding product' }); }
});

router.put('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const updated = await productController.update(pid, req.body);
        if (!updated) return res.status(404).json({ error: 'Product not found' });
        const io = req.app.get('io'); if (io) io.emit('products', await productController.list());
        res.json(updated);
    } catch (e) { res.status(500).json({ error: 'Error updating product' }); }
});

router.delete('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const deleted = await productController.remove(pid);
        if (!deleted) return res.status(404).json({ error: 'Product not found' });
        const io = req.app.get('io'); if (io) io.emit('products', await productController.list());
        res.json(deleted);
    } catch (e) { res.status(500).json({ error: 'Error deleting product' }); }
});

module.exports = router;