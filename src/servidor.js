const app = require("./app");
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const ProductManager = require('./managers/ProductManager');


app.set('io', io);

// Configuración del socket.io 
io.on('connection', async (socket) => {
    const pm = new ProductManager();
    const products = await pm.getProducts();
    socket.emit('products', products);

    socket.on('newProduct', async (productData) => {
        await pm.addProduct(productData);
        const updated = await pm.getProducts();
        io.emit('products', updated);
    });

    socket.on('deleteProduct', async (id) => {
        await pm.deleteProduct(id);
        const updated = await pm.getProducts();
        io.emit('products', updated);
    });
});



const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});