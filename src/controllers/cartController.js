const CartManager = require('../managers/CartManager');
const cm = new CartManager();

module.exports = {
    create: async () => await cm.createCart(),
    getById: async (id) => await cm.getCartById(id),
    addProduct: async (cartId, productId, qty) => await cm.addProductToCart(cartId, productId, qty),
    removeProduct: async (cartId, productId) => await cm.removeProductFromCart(cartId, productId),
    update: async (cartId, products) => await cm.updateCart(cartId, products),
    updateQuantity: async (cartId, productId, quantity) => await cm.updateProductQuantity(cartId, productId, quantity),
    clear: async (cartId) => await cm.clearCart(cartId)
};

