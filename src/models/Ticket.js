const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number
    }],
    status: { type: String, enum: ['completed', 'incomplete'], default: 'incomplete' }
}, { timestamps: true });

ticketSchema.pre('save', function(next) {
    if (!this.code) {
        this.code = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
    next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
