const request = require('supertest');
const app = require('../index');

describe('Users', () => {
  test('inscription utilisateur', async () => {
    const res = await request(app).post('/api/users/register').send({
      email: 'test@test.com',
      username: 'testeur',
      password: 'motdepasse123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty('_id');
    expect(res.body).toHaveProperty('token');
  });

  test('email dupliqué refusé', async () => {
    await request(app).post('/api/users/register').send({
      email: 'test@test.com',
      username: 'testeur',
      password: 'motdepasse123',
    });

    const res = await request(app).post('/api/users/register').send({
      email: 'test@test.com',
      username: 'autre',
      password: 'motdepasse123',
    });

    expect(res.statusCode).toBe(400);
  });

  test('connexion valide', async () => {
    await request(app).post('/api/users/register').send({
      email: 'login@test.com',
      username: 'user',
      password: 'pass123',
    });

    const res = await request(app).post('/api/users/login').send({
      email: 'login@test.com',
      password: 'pass123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('mauvais mdp refusé', async () => {
    await request(app).post('/api/users/register').send({
      email: 'login@test.com',
      username: 'user',
      password: 'pass123',
    });

    const res = await request(app).post('/api/users/login').send({
      email: 'login@test.com',
      password: 'mauvais',
    });

    expect(res.statusCode).toBe(401);
  });
});

