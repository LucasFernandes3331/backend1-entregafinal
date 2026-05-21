const request = require('supertest');

jest.mock('../src/config/passport', () => ({
  passport: {
    initialize: () => (req, res, next) => next(),
    authenticate: (strategy) => (req, res, next) => {
      if (strategy === 'jwt' || strategy === 'current') {
        req.user = { _id: 'user-id', role: 'user' };
      }
      next();
    }
  }
}));

jest.mock('../src/controllers/adoptionController', () => ({
  list: jest.fn(async () => [
    { _id: 'adopt-1', petName: 'Luna', adopterName: 'Ana', type: 'perro', status: 'pending' }
  ]),
  getById: jest.fn(async (id) => (id === 'adopt-1' ? { _id: 'adopt-1', petName: 'Luna', adopterName: 'Ana' } : null)),
  create: jest.fn(async (data) => ({ _id: 'adopt-2', ...data, status: 'pending' })),
  update: jest.fn(async (id, data) => (id === 'adopt-1' ? { _id: 'adopt-1', petName: 'Luna', adopterName: 'Ana', ...data } : null)),
  remove: jest.fn(async (id) => (id === 'adopt-1' ? { _id: 'adopt-1', petName: 'Luna', adopterName: 'Ana' } : null))
}));

const app = require('../src/app');

describe('Adoption router', () => {
  it('GET /api/adoption should return adoption requests list', async () => {
    const response = await request(app).get('/api/adoption');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('_id', 'adopt-1');
  });

  it('GET /api/adoption/:id should return item when found', async () => {
    const response = await request(app).get('/api/adoption/adopt-1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', 'adopt-1');
  });

  it('GET /api/adoption/:id should return 404 when not found', async () => {
    const response = await request(app).get('/api/adoption/unknown');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Adoption request not found');
  });

  it('POST /api/adoption should create a new request with auth', async () => {
    const newRequest = { petName: 'Leo', adopterName: 'Carlos', type: 'gato' };
    const response = await request(app).post('/api/adoption').send(newRequest);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ petName: 'Leo', adopterName: 'Carlos', type: 'gato' });
  });

  it('POST /api/adoption should validate required fields', async () => {
    const response = await request(app).post('/api/adoption').send({ adopterName: 'Carlos' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'petName and adopterName are required');
  });

  it('PUT /api/adoption/:id should update request when found', async () => {
    const response = await request(app).put('/api/adoption/adopt-1').send({ status: 'approved' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'approved');
  });

  it('PUT /api/adoption/:id should return 404 when not found', async () => {
    const response = await request(app).put('/api/adoption/unknown').send({ status: 'approved' });
    expect(response.status).toBe(404);
  });

  it('DELETE /api/adoption/:id should delete request when found', async () => {
    const response = await request(app).delete('/api/adoption/adopt-1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', 'adopt-1');
  });

  it('DELETE /api/adoption/:id should return 404 when not found', async () => {
    const response = await request(app).delete('/api/adoption/unknown');
    expect(response.status).toBe(404);
  });
});
