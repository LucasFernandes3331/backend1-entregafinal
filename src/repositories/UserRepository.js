const User = require('../models/User');

class UserRepository {
    async create(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async findById(id) {
        return await User.findById(id).populate('cart');
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findAll() {
        return await User.find().populate('cart');
    }

    async update(id, userData) {
        return await User.findByIdAndUpdate(id, userData, { new: true });
    }

    async delete(id) {
        return await User.findByIdAndDelete(id);
    }

    async findByIdWithCart(id) {
        return await User.findById(id).populate({
            path: 'cart',
            populate: {
                path: 'products.product'
            }
        });
    }

    async findByResetToken(token) {
        return await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
    }

    async setResetToken(userId, token, expiresIn) {
        return await User.findByIdAndUpdate(userId, {
            resetPasswordToken: token,
            resetPasswordExpires: new Date(Date.now() + expiresIn)
        }, { new: true });
    }

    async clearResetToken(userId) {
        return await User.findByIdAndUpdate(userId, {
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined
        }, { new: true });
    }
}

module.exports = UserRepository;
