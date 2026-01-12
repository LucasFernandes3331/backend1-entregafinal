const express = require("express");
const { engine } = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

// conexión a mongodb
mongoose.connect('mongodb://localhost:27017/coder-fernandes')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine({
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// rutas de api
const productsRouter = require("./rutas/products-rutas");
const cartsRouter = require("./rutas/carts-rutas");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// DEBUG: endpoint para ver los productos crudos
app.get("/api/debug/products", async (req, res) => {
    const ProductManager = require('./managers/ProductManager');
    const pm = new ProductManager();
    const products = await pm.getProducts();
    res.json({ debug: true, products, count: products.length });
});

// vistas
app.get("/", async (req, res) => {
    const ProductManager = require('./managers/ProductManager');
    const pm = new ProductManager();
    const products = await pm.getProducts(); // Sin paginación para home
    res.render('home', { products, title: 'Home' });
});

app.get("/products/:pid", async (req, res) => {
    const ProductManager = require('./managers/ProductManager');
    const pm = new ProductManager();
    const product = await pm.getProductById(req.params.pid);
    res.render('productDetail', { product });
});

app.get("/carts/:cid", async (req, res) => {
    const CartManager = require('./managers/CartManager');
    const cm = new CartManager();
    const cart = await cm.getCartById(req.params.cid);
    res.render('cartDetail', { cart });
});

app.get("/realtimeproducts", (req, res) => {
    res.render('realtimeproducts');
});

module.exports = app;