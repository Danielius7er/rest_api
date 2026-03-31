import request from 'supertest';
import { Express } from 'express';
import { createApp } from './api';

describe('User API', () => {
  let app: Express;

  beforeEach(() => {
    app = createApp();
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'João Silva',
        email: 'joao@example.com'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.email).toBe(newUser.email);
    });

    it('should reject invalid email', async () => {
      const invalidUser = {
        name: 'João',
        email: 'invalid-email'
      };

      await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);
    });

    it('should reject empty name', async () => {
      const invalidUser = {
        name: '',
        email: 'joao@example.com'
      };

      await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should retrieve a user by id', async () => {
      const newUser = { name: 'Maria', email: 'maria@example.com' };
      const createResponse = await request(app)
        .post('/api/users')
        .send(newUser);

      const userId = createResponse.body.id;

      const getResponse = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(getResponse.body.id).toBe(userId);
      expect(getResponse.body.name).toBe(newUser.name);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/users/9999')
        .expect(404);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user data', async () => {
      const newUser = { name: 'Pedro', email: 'pedro@example.com' };
      const createResponse = await request(app)
        .post('/api/users')
        .send(newUser);

      const userId = createResponse.body.id;
      const updateData = { name: 'Pedro Silva' };

      const updateResponse = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(updateResponse.body.name).toBe(updateData.name);
    });

    it('should reject empty name on update', async () => {
      const newUser = { name: 'Pedro', email: 'pedro@example.com' };
      const createResponse = await request(app)
        .post('/api/users')
        .send(newUser);

      const userId = createResponse.body.id;

      await request(app)
        .put(`/api/users/${userId}`)
        .send({ name: '' })
        .expect(400);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      const newUser = { name: 'Ana', email: 'ana@example.com' };
      const createResponse = await request(app)
        .post('/api/users')
        .send(newUser);

      const userId = createResponse.body.id;

      await request(app)
        .delete(`/api/users/${userId}`)
        .expect(204);

      await request(app)
        .get(`/api/users/${userId}`)
        .expect(404);
    });
  });
});
