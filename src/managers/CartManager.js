const Cart = require('../models/Cart');

class CartManager {
    async createCart() {
        const cart = new Cart({ products: [] });
        return await cart.save();
    }

    async getCartById(id) {
        return await Cart.findById(id).populate('products.product');
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Cart not found');
        const existing = cart.products.find(p => p.product && p.product.toString() === productId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        return await cart.save();
    }

    async updateCart(cartId, products) {
        return await Cart.findByIdAndUpdate(cartId, { products }, { new: true });
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Cart not found');
        const prod = cart.products.find(p => p.product && p.product.toString() === productId);
        if (prod) prod.quantity = quantity;
        return await cart.save();
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Cart not found');
        // en el caso que p.product sea null, no hacer el match
        cart.products = cart.products.filter(p => {
            if (!p.product) return true; // mantener si product es null
            return p.product.toString() !== productId;
        });
        return await cart.save();
    }

    async clearCart(cartId) {
        return await Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true });
    }
}

module.exports = CartManager;