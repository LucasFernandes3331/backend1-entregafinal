const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambiar_en_produccion';

// Estrategia Local (para login)
passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }
        if (!user.comparePassword(password)) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Estrategia JWT (para validar tokens)
passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
            if (req && req.cookies && req.cookies.token) {
                return req.cookies.token;
            }
            return null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken()
    ]),
    secretOrKey: JWT_SECRET
}, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error);
    }
}));

// Estrategia Current (para validar usuario actual)
passport.use('current', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
            if (req && req.cookies && req.cookies.token) {
                return req.cookies.token;
            }
            return null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken()
    ]),
    secretOrKey: JWT_SECRET
}, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id).populate('cart');
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error);
    }
}));

// Serialización (para sesiones si las usamos)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// Función para generar JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

module.exports = {
    passport,
    generateToken,
    JWT_SECRET
};
