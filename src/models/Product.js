const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: String,
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    categoria: String,
    disponible: { type: Boolean, default: true }
}, { timestamps: true });



productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;