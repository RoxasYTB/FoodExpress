const request = require('supertest');
const app = require('../index');

describe('Restaurants', () => {
  let adminToken;

  beforeEach(async () => {
    const admin = await request(app).post('/api/users/register').send({
      email: 'admin@test.com',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
    });
    adminToken = admin.body.token;
  });

  test('création restaurant par admin', async () => {
    const res = await request(app).post('/api/restaurants').set('Authorization', `Bearer ${adminToken}`).send({
      name: 'Le Bon Resto',
      address: '123 rue Test',
      phone: '0102030405',
      opening_hours: '10h-22h',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Le Bon Resto');
  });

  test('liste publique restaurants', async () => {
    await request(app).post('/api/restaurants').set('Authorization', `Bearer ${adminToken}`).send({
      name: 'Resto 1',
      address: 'Adresse 1',
      phone: '0123456789',
      opening_hours: '9h-21h',
    });

    const res = await request(app).get('/api/restaurants');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
  });
});

