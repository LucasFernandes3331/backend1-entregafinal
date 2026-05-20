const request = require('supertest');

jest.mock('../src/config/passport', () => ({
  passport: {
    initialize: () => (req, res, next) => next(),
    authenticate: (strategy) => (req, res, next) => {
      if (strategy === 'jwt' || strategy === 'current') {
        req.user = { _id: 'admin-id', role: 'admin' };
      } else if (strategy === 'local') {
        req.user = {
          _id: 'user-id',
          role: 'user',
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          cart: 'cart-id'
        };
      }
      next();
    }
  },
  generateToken: () => 'fake-jwt-token'
}));

jest.mock('../src/controllers/productController', () => ({
  list: jest.fn(async () => [
    { _id: '1', nombre: 'Remera Azul', precio: 10 },
    { _id: '2', nombre: 'Pantalón Negro', precio: 30 }
  ]),
  getById: jest.fn(async (id) => (id === '1' ? { _id: '1', nombre: 'Remera Azul' } : null)),
  create: jest.fn(async (data) => ({ _id: '3', ...data })),
  update: jest.fn(async (id, data) => (id === '1' ? { _id: '1', ...data } : null)),
  remove: jest.fn(async (id) => (id === '1' ? { _id: '1' } : null))
}));

const app = require('../src/app');

describe('Products router', () => {
  it('GET /api/products should return a product list', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2);
  });

  it('GET /api/products/:pid should return product when found', async () => {
    const response = await request(app).get('/api/products/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', '1');
  });

  it('GET /api/products/:pid should return 404 when not found', async () => {
    const response = await request(app).get('/api/products/999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Product not found');
  });

  it('POST /api/products should create a product as admin', async () => {
    const newProduct = { nombre: 'Sudadera', descripcion: 'Cómoda', precio: 25, stock: 10 };
    const response = await request(app).post('/api/products').send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ nombre: 'Sudadera', precio: 25, stock: 10 });
  });

  it('PUT /api/products/:pid should update a product as admin', async () => {
    const response = await request(app).put('/api/products/1').send({ precio: 12 });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ _id: '1', precio: 12 });
  });

  it('DELETE /api/products/:pid should delete a product as admin', async () => {
    const response = await request(app).delete('/api/products/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', '1');
  });
});
