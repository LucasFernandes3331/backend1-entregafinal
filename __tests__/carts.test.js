const request = require('supertest');

jest.mock('../src/config/passport', () => ({
  passport: {
    initialize: () => (req, res, next) => next(),
    authenticate: (strategy) => (req, res, next) => {
      if (strategy === 'jwt') {
        req.user = { _id: 'user-id', role: 'user' };
      }
      next();
    }
  }
}));

jest.mock('../src/controllers/cartController', () => ({
  create: jest.fn(async () => ({ _id: 'cart-id', products: [] })),
  getById: jest.fn(async (id) => (id === 'cart-id' ? { _id: 'cart-id', products: [] } : null))
}));

jest.mock('../src/repositories/CartRepository', () => {
  return jest.fn().mockImplementation(() => ({
    addProduct: jest.fn(async () => ({ _id: 'cart-id', products: [{ product: 'product-id', quantity: 1 }] })),
    removeProduct: jest.fn(async () => ({ _id: 'cart-id', products: [] })),
    clear: jest.fn(async () => ({ _id: 'cart-id', products: [] }))
  }));
});

const app = require('../src/app');

describe('Carts router', () => {
  it('POST /api/carts should create a new cart', async () => {
    const response = await request(app).post('/api/carts');
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id', 'cart-id');
  });

  it('GET /api/carts/:cid should return cart when exists', async () => {
    const response = await request(app).get('/api/carts/cart-id');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', 'cart-id');
  });

  it('GET /api/carts/:cid should return 404 when cart not found', async () => {
    const response = await request(app).get('/api/carts/other-id');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Cart not found');
  });

  it('POST /api/carts/:cid/products/:pid should add a product to cart', async () => {
    const response = await request(app)
      .post('/api/carts/cart-id/products/product-id')
      .send({ quantity: 2 });
    expect(response.status).toBe(200);
    expect(response.body.products[0]).toMatchObject({ product: 'product-id', quantity: 1 });
  });

  it('DELETE /api/carts/:cid/products/:pid should remove a product from cart', async () => {
    const response = await request(app).delete('/api/carts/cart-id/products/product-id');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', 'cart-id');
  });

  it('DELETE /api/carts/:cid should clear cart', async () => {
    const response = await request(app).delete('/api/carts/cart-id');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Carrito vaciado');
    expect(response.body.cart).toHaveProperty('_id', 'cart-id');
  });
});
