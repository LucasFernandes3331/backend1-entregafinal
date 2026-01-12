const ProductManager = require('../managers/ProductManager');
const pm = new ProductManager();

module.exports = {
    list: async (opts) => {
        const { limit, page, sort, query, value } = opts || {};
        return await pm.getProducts(limit, page, sort, query, value);
    },
    getById: async (id) => {
        return await pm.getProductById(id);
    },
    create: async (data) => {
        return await pm.addProduct(data);
    },
    update: async (id, data) => {
        return await pm.updateProduct(id, data);
    },
    remove: async (id) => {
        return await pm.deleteProduct(id);
    }
};
