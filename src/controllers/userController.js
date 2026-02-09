const UserManager = require('../managers/UserManager');
const um = new UserManager();

module.exports = {
    create: async (userData) => await um.createUser(userData),
    getById: async (id) => await um.getUserById(id),
    getByEmail: async (email) => await um.getUserByEmail(email),
    getAll: async () => await um.getAllUsers(),
    update: async (id, userData) => await um.updateUser(id, userData),
    delete: async (id) => await um.deleteUser(id),
    getUserWithCart: async (id) => await um.getUserWithCart(id)
};
