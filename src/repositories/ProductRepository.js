const Product = require('../models/Product');

class ProductRepository {
    async find(filter = {}, options = {}) {
        const { limit = 10, page = 1, sort = null } = options;
        const skip = (page - 1) * limit;
        
        const query = Product.find(filter);
        if (sort) {
            query.sort(sort);
        }
        query.limit(limit).skip(skip);
        
        const docs = await query.exec();
        const total = await Product.countDocuments(filter);
        
        return {
            docs,
            totalDocs: total,
            limit,
            page,
            pages: Math.ceil(total / limit)
        };
    }

    async findById(id) {
        return await Product.findById(id);
    }

    async create(data) {
        const product = new Product(data);
        return await product.save();
    }

    async update(id, data) {
        return await Product.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }

    async findByIdAndDecreaseStock(id, quantity) {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        if (product.stock < quantity) {
            throw new Error('Stock insuficiente');
        }
        product.stock -= quantity;
        if (product.stock === 0) {
            product.disponible = false;
        }
        return await product.save();
    }
}

module.exports = ProductRepository;
