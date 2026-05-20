const request = require('supertest');

jest.mock('../src/config/passport', () => ({
  passport: {
    initialize: () => (req, res, next) => next(),
    authenticate: (strategy) => (req, res, next) => {
      if (strategy === 'current') {
        req.user = {
          _id: 'user-id',
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          age: 30,
          role: 'user',
          cart: 'cart-id'
        };
      }
      next();
    }
  }
}));

const app = require('../src/app');

describe('Sessions router', () => {
  it('GET /api/sessions/current should return current user data', async () => {
    const response = await request(app).get('/api/sessions/current');
    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({
      id: 'user-id',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      role: 'user'
    });
  });
});
