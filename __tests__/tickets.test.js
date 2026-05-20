const request = require('supertest');

jest.mock('../src/config/passport', () => ({
  passport: {
    initialize: () => (req, res, next) => next(),
    authenticate: (strategy) => (req, res, next) => {
      if (strategy === 'jwt') {
        if (req.path.includes('/checkout')) {
          req.user = { _id: 'user-id', role: 'user' };
        } else {
          req.user = { _id: 'admin-id', role: 'admin' };
        }
      }
      next();
    }
  }
}));

jest.mock('../src/services/PurchaseService', () => {
  return jest.fn().mockImplementation(() => ({
    processPurchase: jest.fn(async () => ({
      ticket: {
        code: 'TICKET-123',
        amount: 100,
        purchaser: 'user-id',
        products: [{ product_id: 'product-id', quantity: 1, price: 100 }],
        status: 'completed'
      },
      processedProducts: [{ product_id: 'product-id', quantity: 1, price: 100 }],
      failedProducts: [],
      success: true
    }))
  }));
});

jest.mock('../src/repositories/TicketRepository', () => {
  return jest.fn().mockImplementation(() => ({
    findAll: jest.fn(async () => [{ _id: 'ticket-id', code: 'TICKET-123' }]),
    findById: jest.fn(async (id) => (id === 'ticket-id' ? { _id: 'ticket-id', code: 'TICKET-123', purchaser: { _id: 'user-id' } } : null)),
    findByUser: jest.fn(async (userId) => [{ _id: 'ticket-id', code: 'TICKET-123', purchaser: userId }])
  }));
});

jest.mock('../src/repositories/UserRepository', () => {
  return jest.fn().mockImplementation(() => ({
    findById: jest.fn(async (id) => ({ _id: id, role: 'user' })),
    findByIdWithCart: jest.fn(async (id) => ({
      _id: id,
      email: 'user@example.com',
      cart: {
        _id: 'cart-id',
        products: [{ product_id: 'product-id', quantity: 1, price: 100 }]
      }
    }))
  }));
});

jest.mock('../src/services/EmailService', () => {
  return jest.fn().mockImplementation(() => ({
    sendPurchaseConfirmationEmail: jest.fn(async () => true)
  }));
});

const app = require('../src/app');

describe('Tickets router', () => {
  it('GET /api/tickets should return a list of tickets for admin', async () => {
    const response = await request(app).get('/api/tickets');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('code', 'TICKET-123');
  });

  it('GET /api/tickets/:id should return ticket when found', async () => {
    const response = await request(app).get('/api/tickets/ticket-id');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', 'ticket-id');
  });

  it('GET /api/tickets/user/my-tickets should return ticket list for user', async () => {
    const response = await request(app).get('/api/tickets/user/my-tickets');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /api/tickets/checkout should process a purchase for a user', async () => {
    const response = await request(app).post('/api/tickets/checkout');
    expect(response.status).toBe(201);
    expect(response.body.ticket).toHaveProperty('code', 'TICKET-123');
    expect(response.body.ticket).toHaveProperty('status', 'completed');
  });
});
