const Ticket = require('../models/Ticket');

class TicketRepository {
    async create(ticketData) {
        const ticket = new Ticket(ticketData);
        return await ticket.save();
    }

    async findById(id) {
        return await Ticket.findById(id).populate('purchaser').populate('products.product_id');
    }

    async findByCode(code) {
        return await Ticket.findOne({ code }).populate('purchaser').populate('products.product_id');
    }

    async findByUser(userId) {
        return await Ticket.find({ purchaser: userId }).populate('products.product_id').sort({ purchase_datetime: -1 });
    }

    async findAll() {
        return await Ticket.find().populate('purchaser').populate('products.product_id').sort({ purchase_datetime: -1 });
    }

    async update(id, data) {
        return await Ticket.findByIdAndUpdate(id, data, { new: true });
    }
}

module.exports = TicketRepository;
