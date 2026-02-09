const User = require('../models/User');

class UserManager {
    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async getUserById(id) {
        return await User.findById(id).populate('cart');
    }

    async getUserByEmail(email) {
        return await User.findOne({ email });
    }

    async getAllUsers() {
        return await User.find().populate('cart');
    }

    async updateUser(id, userData) {
        return await User.findByIdAndUpdate(id, userData, { new: true });
    }

    async deleteUser(id) {
        return await User.findByIdAndDelete(id);
    }

    async getUserWithCart(id) {
        return await User.findById(id).populate('cart');
    }
}

module.exports = UserManager;
