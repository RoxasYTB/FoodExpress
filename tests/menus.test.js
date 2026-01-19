const request = require('supertest');
const app = require('../index');

describe('Menus', () => {
  let adminToken, restoId;

  beforeEach(async () => {
    const admin = await request(app).post('/api/users/register').send({
      email: 'admin@test.com',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
    });
    adminToken = admin.body.token;

    const resto = await request(app).post('/api/restaurants').set('Authorization', `Bearer ${adminToken}`).send({
      name: 'Test Resto',
      address: 'Adresse',
      phone: '0123456789',
      opening_hours: '9h-22h',
    });
    restoId = resto.body._id;
  });

  test('création menu par admin', async () => {
    const res = await request(app).post('/api/menus').set('Authorization', `Bearer ${adminToken}`).send({
      restaurant_id: restoId,
      name: 'Pizza',
      description: 'Une bonne pizza',
      price: 12.5,
      category: 'plat',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Pizza');
  });

  test('liste publique menus', async () => {
    await request(app).post('/api/menus').set('Authorization', `Bearer ${adminToken}`).send({
      restaurant_id: restoId,
      name: 'Burger',
      description: 'Burger maison',
      price: 10,
      category: 'plat',
    });

    const res = await request(app).get('/api/menus');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
  });
});

