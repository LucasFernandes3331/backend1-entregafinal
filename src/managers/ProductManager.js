const Product = require('../models/Product');

class ProductManager {
    async getProducts(limit = 10, page = 1, sort = null, query = null, value = null) {
        const filter = {};
        if (query && value) {
            if (query === 'categoria') filter.categoria = value;
            if (query === 'disponible') filter.disponible = value === 'true';
        }
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { precio: sort === 'asc' ? 1 : -1 } : null
        };
        const result = await Product.paginate(filter, options);
        // Convertir documentos a objetos simples
        return result.docs.map(doc => doc.toObject ? doc.toObject() : doc);
    }

    async getProductById(id) {
        return await Product.findById(id);
    }

    async addProduct(data) {
        const product = new Product(data);
        return await product.save();
    }

    async updateProduct(id, data) {
        return await Product.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }
}

module.exports = ProductManager;