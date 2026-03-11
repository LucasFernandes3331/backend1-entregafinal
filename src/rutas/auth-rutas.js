const express = require('express');
const router = express.Router();
const { passport, generateToken } = require('../config/passport');
const userController = require('../controllers/userController');
const CartManager = require('../managers/CartManager');
const UserRepository = require('../repositories/UserRepository');
const EmailService = require('../services/EmailService');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Registro
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const existingUser = await userController.getByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Crear carrito para el nuevo usuario y asociarlo al mismo
        const cm = new CartManager();
        const cart = await cm.createCart();

        const userData = {
            first_name,
            last_name,
            email,
            age,
            password,
            cart: cart._id,
            role: 'user'
        };

        const newUser = await userController.create(userData);
        const token = generateToken(newUser);

        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: {
                id: newUser._id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                role: newUser.role,
                cart_id: newUser.cart
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error registrando usuario' });
    }
});

// Login con Passport Local 
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    try {
        const token = generateToken(req.user);
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({
            message: 'Login exitoso',
            user: {
                id: req.user._id,
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                role: req.user.role,
                cart_id: req.user.cart
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error en login' });
    }
});

// Logout borramos la cooki del token
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout exitoso' });
});

// Solicitar recuperación de contraseña
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email requerido' });
        }

        const userRepo = new UserRepository();
        const user = await userRepo.findByEmail(email);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Generar token de reset
        const resetToken = crypto.randomBytes(30).toString('hex');
        const expiresIn = 60 * 60 * 1000; // 1 hora

        await userRepo.setResetToken(user._id, resetToken, expiresIn);

        // Crear enlace de reset
        const resetLink = `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/reset-password/${resetToken}`;

        // Enviar email
        const emailService = new EmailService();
        await emailService.sendPasswordRecoveryEmail(user.email, resetLink, user.first_name);

        res.json({ message: 'Email de recuperación enviado' });
    } catch (error) {
        console.error('Error en recuperación de contraseña:', error);
        res.status(500).json({ error: 'Error enviando email de recuperación' });
    }
});

// Validar token de reset
router.get('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const userRepo = new UserRepository();
        const user = await userRepo.findByResetToken(token);

        if (!user) {
            return res.status(400).json({ error: 'Token inválido o expirado' });
        }

        res.json({ message: 'Token válido', email: user.email });
    } catch (error) {
        console.error('Error validando token:', error);
        res.status(500).json({ error: 'Error validando token' });
    }
});

// Restablecer contraseña
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;

        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ error: 'Contraseña requerida' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'Las contraseñas no coinciden' });
        }

        const userRepo = new UserRepository();
        const user = await userRepo.findByResetToken(token);

        if (!user) {
            return res.status(400).json({ error: 'Token inválido o expirado' });
        }

        // Verificar que no sea la misma contraseña anterior
        if (user.comparePassword(newPassword)) {
            return res.status(400).json({ error: 'La nueva contraseña no puede ser igual a la anterior' });
        }

        // Actualizar contraseña y limpiar token en una sola operación
        user.password = bcrypt.hashSync(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
        console.error('Error restableciendo contraseña:', error);
        res.status(500).json({ error: 'Error restableciendo contraseña' });
    }
});

module.exports = router;
