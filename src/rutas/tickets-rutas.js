const express = require('express');
const router = express.Router();
const TicketRepository = require('../repositories/TicketRepository');
const UserRepository = require('../repositories/UserRepository');
const PurchaseService = require('../services/PurchaseService');
const EmailService = require('../services/EmailService');
const { requireAuth, isUser, isAdmin } = require('../middleware/authMiddleware');

const ticketRepo = new TicketRepository();
const userRepo = new UserRepository();
const purchaseService = new PurchaseService();
const emailService = new EmailService();

// Obtener todos los tickets (solo admin)
router.get('/', requireAuth, isAdmin, async (req, res) => {
    try {
        const tickets = await ticketRepo.findAll();
        res.json(tickets);
    } catch (error) {
        console.error('Error obteniendo tickets:', error);
        res.status(500).json({ error: 'Error obteniendo tickets' });
    }
});

// Obtener ticket por ID (admin o propietario)
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const ticket = await ticketRepo.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket no encontrado' });
        }
        // Verificar que sea admin o el dueño del ticket
        if (req.user.role !== 'admin' && ticket.purchaser._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'No tienes permiso para ver este ticket' });
        }
        res.json(ticket);
    } catch (error) {
        console.error('Error obteniendo ticket:', error);
        res.status(500).json({ error: 'Error obteniendo ticket' });
    }
});

// Obtener tickets del usuario actual
router.get('/user/my-tickets', requireAuth, async (req, res) => {
    try {
        const tickets = await ticketRepo.findByUser(req.user._id);
        res.json(tickets);
    } catch (error) {
        console.error('Error obteniendo tickets del usuario:', error);
        res.status(500).json({ error: 'Error obteniendo tickets' });
    }
});

// Procesar compra
router.post('/checkout', requireAuth, isUser, async (req, res) => {
    try {
        const user = await userRepo.findByIdWithCart(req.user._id);
        if (!user || !user.cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        if (user.cart.products.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' });
        }

        const purchaseResult = await purchaseService.processPurchase(req.user._id, user.cart);

        // Enviar email de confirmación
        try {
            await emailService.sendPurchaseConfirmationEmail(user.email, purchaseResult.ticket);
        } catch (emailError) {
            console.error('Error enviando email:', emailError);
        }

        res.status(201).json({
            message: 'Compra procesada',
            ticket: purchaseResult.ticket,
            processedProducts: purchaseResult.processedProducts,
            failedProducts: purchaseResult.failedProducts,
            success: purchaseResult.success
        });
    } catch (error) {
        console.error('Error procesando compra:', error);
        res.status(500).json({ error: 'Error procesando compra' });
    }
});

module.exports = router;
