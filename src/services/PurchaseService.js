const CartRepository = require('../repositories/CartRepository');
const ProductRepository = require('../repositories/ProductRepository');
const TicketRepository = require('../repositories/TicketRepository');
const EmailService = require('./EmailService');

class PurchaseService {
    constructor() {
        this.cartRepo = new CartRepository();
        this.productRepo = new ProductRepository();
        this.ticketRepo = new TicketRepository();
        this.emailService = new EmailService();
    }

    async processPurchase(userId, cart) {
        try {
            let totalAmount = 0;
            const processedProducts = [];
            const failedProducts = [];

            // Procesar cada producto en el carrito
            for (const item of cart.products) {
                try {
                    const product = await this.productRepo.findById(item.product._id);
                    if (!product) {
                        failedProducts.push({
                            product_id: item.product._id,
                            reason: 'Producto no encontrado'
                        });
                        continue;
                    }

                    if (product.stock < item.quantity) {
                        failedProducts.push({
                            product_id: item.product._id,
                            reason: 'Stock insuficiente'
                        });
                        continue;
                    }

                    // Disminuir stock
                    await this.productRepo.findByIdAndDecreaseStock(item.product._id, item.quantity);

                    // Agregar a productos procesados
                    const subtotal = product.precio * item.quantity;
                    totalAmount += subtotal;
                    processedProducts.push({
                        product_id: item.product._id,
                        quantity: item.quantity,
                        price: product.precio
                    });
                } catch (error) {
                    failedProducts.push({
                        product_id: item.product._id,
                        reason: error.message
                    });
                }
            }

            // Crear ticket
            const ticketData = {
                amount: totalAmount,
                purchaser: userId,
                products: processedProducts,
                status: failedProducts.length === 0 ? 'completed' : 'incomplete'
            };

            const ticket = await this.ticketRepo.create(ticketData);

            // Limpiar carrito
            await this.cartRepo.clear(cart._id);

            return {
                success: failedProducts.length === 0,
                ticket,
                processedProducts,
                failedProducts
            };
        } catch (error) {
            console.error('Error procesando compra:', error);
            throw error;
        }
    }
}

module.exports = PurchaseService;
