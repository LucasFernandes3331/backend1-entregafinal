const request = require('supertest');

jest.mock('../src/config/passport', () => ({
  passport: {
    initialize: () => (req, res, next) => next(),
    authenticate: (strategy) => (req, res, next) => {
      if (strategy === 'jwt') {
        req.user = { _id: 'admin-id', role: 'admin' };
      }
      next();
    }
  }
}));

jest.mock('../src/controllers/userController', () => ({
  getAll: jest.fn(async () => [
    { _id: 'admin-id', email: 'admin@example.com' }
  ]),
  getById: jest.fn(async (id) => (id === 'user-id' ? { _id: 'user-id', email: 'test@example.com' } : null)),
  update: jest.fn(async (id, data) => (id === 'user-id' ? { _id: 'user-id', ...data } : null)),
  delete: jest.fn(async (id) => (id === 'user-id' ? { _id: 'user-id', email: 'test@example.com' } : null))
}));

const app = require('../src/app');

describe('Users router', () => {
  it('GET /api/users should return user list for admin', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('_id', 'admin-id');
  });

  it('GET /api/users/:id should return user when found', async () => {
    const response = await request(app).get('/api/users/user-id');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', 'test@example.com');
  });

  it('GET /api/users/:id should return 404 when not found', async () => {
    const response = await request(app).get('/api/users/unknown-id');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Usuario no encontrado');
  });

  it('PUT /api/users/:id should update user for admin', async () => {
    const response = await request(app).put('/api/users/user-id').send({ first_name: 'Updated' });
    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({ _id: 'user-id', first_name: 'Updated' });
  });

  it('DELETE /api/users/:id should delete user for admin', async () => {
    const response = await request(app).delete('/api/users/user-id');
    expect(response.status).toBe(200);
    expect(response.body.user).toHaveProperty('email', 'test@example.com');
  });
});
