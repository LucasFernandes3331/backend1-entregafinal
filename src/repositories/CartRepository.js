const Cart = require('../models/Cart');

class CartRepository {
    async create() {
        const cart = new Cart({ products: [] });
        return await cart.save();
    }

    async findById(id) {
        return await Cart.findById(id).populate('products.product');
    }

    async addProduct(cartId, productId, quantity = 1) {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        const existing = cart.products.find(p => p.product && p.product.toString() === productId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        return await cart.save();
    }

    async removeProduct(cartId, productId) {
        return await Cart.findByIdAndUpdate(
            cartId,
            { $pull: { products: { product: productId } } },
            { new: true }
        );
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        const product = cart.products.find(p => p.product.toString() === productId);
        if (product) {
            product.quantity = quantity;
        }
        return await cart.save();
    }

    async clear(cartId) {
        return await Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true });
    }

    async update(cartId, products) {
        return await Cart.findByIdAndUpdate(cartId, { products }, { new: true });
    }
}

module.exports = CartRepository;
