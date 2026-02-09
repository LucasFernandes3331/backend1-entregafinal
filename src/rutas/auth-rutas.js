const express = require('express');
const router = express.Router();
const { passport, generateToken } = require('../config/passport');
const userController = require('../controllers/userController');
const CartManager = require('../managers/CartManager');

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
                role: newUser.role
            },
            token
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
                role: req.user.role
            },
            token
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

module.exports = router;
