class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.products = cart.products ? cart.products.map(p => ({
            product_id: p.product ? p.product._id : p.product,
            product_name: p.product ? p.product.nombre : null,
            price: p.product ? p.product.precio : null,
            quantity: p.quantity
        })) : [];
        this.total = this.calculateTotal(cart.products);
    }

    calculateTotal(products) {
        if (!products) return 0;
        return products.reduce((acc, p) => {
            const price = p.product ? p.product.precio : 0;
            return acc + (price * p.quantity);
        }, 0);
    }
}

module.exports = CartDTO;
