const request = require('supertest');

jest.mock('../src/config/passport', () => ({
  passport: {
    initialize: () => (req, res, next) => next(),
    authenticate: (strategy) => (req, res, next) => {
      if (strategy === 'local') {
        req.user = {
          _id: 'user-id',
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          role: 'user',
          cart: 'cart-id'
        };
      }
      next();
    }
  },
  generateToken: () => 'fake-token'
}));

jest.mock('../src/controllers/userController', () => ({
  create: jest.fn(async (data) => ({ _id: 'user-id', ...data })),
  getByEmail: jest.fn(async (email) => null)
}));

jest.mock('../src/managers/CartManager', () => {
  return jest.fn().mockImplementation(() => ({ createCart: jest.fn(async () => ({ _id: 'cart-id' })) }));
});

jest.mock('../src/repositories/UserRepository', () => {
  return jest.fn().mockImplementation(() => ({
    findByEmail: jest.fn(async (email) => {
      if (email === 'juan@example.com') {
        return { _id: 'user-id', email: 'juan@example.com', first_name: 'Juan' };
      }
      return null;
    }),
    setResetToken: jest.fn(async () => true),
    findByResetToken: jest.fn(async (token) => (token === 'valid-token' ? { email: 'test@example.com', comparePassword: () => false, save: jest.fn() } : null))
  }));
});

jest.mock('../src/services/EmailService', () => {
  return jest.fn().mockImplementation(() => ({
    sendPasswordRecoveryEmail: jest.fn(async () => true)
  }));
});

const app = require('../src/app');

describe('Auth router', () => {
  it('POST /api/auth/register should create a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ first_name: 'Juan', last_name: 'Pérez', email: 'juan@example.com', password: 'SecurePass123!' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Usuario registrado exitosamente');
    expect(response.body.user).toHaveProperty('email', 'juan@example.com');
  });

  it('POST /api/auth/register should fail when missing required fields', async () => {
    const response = await request(app).post('/api/auth/register').send({ email: 'x@x.com' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Faltan campos requeridos');
  });

  it('POST /api/auth/login should return success and set cookie', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'pass' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login exitoso');
  });

  it('POST /api/auth/logout should clear the token cookie', async () => {
    const response = await request(app).post('/api/auth/logout');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Logout exitoso');
  });

  it('POST /api/auth/forgot-password should send recovery email', async () => {
    const response = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'juan@example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Email de recuperación enviado');
  });

  it('GET /api/auth/reset-password/:token should validate a valid token', async () => {
    const response = await request(app).get('/api/auth/reset-password/valid-token');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Token válido');
  });

  it('GET /api/auth/reset-password/:token should reject invalid token', async () => {
    const response = await request(app).get('/api/auth/reset-password/invalid-token');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Token inválido o expirado');
  });

  it('POST /api/auth/reset-password/:token should reject missing password fields', async () => {
    const response = await request(app).post('/api/auth/reset-password/valid-token').send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Contraseña requerida');
  });

  it('POST /api/auth/reset-password/:token should reject mismatched passwords', async () => {
    const response = await request(app)
      .post('/api/auth/reset-password/valid-token')
      .send({ newPassword: '123', confirmPassword: '456' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Las contraseñas no coinciden');
  });
});
