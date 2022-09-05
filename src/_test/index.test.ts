import request from 'supertest';
import { exampleObject } from "../controllers/examples/examples.controller";
import { Entity } from "../controllers/examples/example.interface";
import { usersObject } from "../controllers/users/users.controller";
import { IUserModel } from "../controllers/users/users.interface";
import { app as mainApp } from "../index";
import 'reflect-metadata';
import { petMockObjects } from "../controllers/pets/pets.controller";
import { IPetModel } from "../controllers/pets/pet.interface";


const app = mainApp.app;

describe('test app', () => {
  describe('/example', () => {
    it('GET /example', async () => {
      await request(app)
        .get('/example')
        .expect(200, exampleObject);
    });

    it('GET /example/1', async () => {
      const findItemId = 1;
      await request(app)
        .get(`/example/${findItemId}`)
        .expect(200, exampleObject[findItemId]);
    });
    it('GET /example/321', async () => {
      const findItemId = 321;
      await request(app).get(`/example/${findItemId}`).expect(404);
    });

    it('PUT /example', (done) => {
      const changes = {
        id: 1,
        name: 'changes',
      };
      request(app)
        .get(`/example/${changes.id}`)
        .expect(200, exampleObject[changes.id]);

      request(app)
        .put('/example')
        .send(changes)
        .expect(200, done);

      request(app)
        .get('/example/1')
        .expect(200, changes);
    });

    it('PUT /example bad request', (done) => {
      const changes = {
        id: 1,
        ne: 'changes',
      };
      request(app)
        .put('/example')
        .send(changes)
        .expect(400, done);
    });


    it('DELETE /example/1', async () => {
      const findItemId = 1;
      await request(app).get(`/example/${findItemId}`).expect(200, exampleObject[findItemId]);
      await request(app).delete(`/example/${findItemId}`).expect(200);
      await request(app).delete(`/example/${findItemId}`).expect(400);
    });

    it('POST /example', (done) => {
      const item: Entity = {
        id: 1,
        name: 'Example',
      };
      request(app)
        .post('/example')
        .send(item)
        .expect(201, done);
    });

    it('POST /example bad request', (done) => {
      const item = {
        id: 1,
        ame: 'Example',
      };
      request(app)
        .post('/example')
        .send(item)
        .expect(400, done);

      request(app)
        .get('/example')
        .expect(200, { [item.id]: item });
    });

  });

  describe('/users', () => {
    it('GET /users', async () => {
      await request(app)
        .get('/users')
        .expect(200, usersObject);
    });

    it('GET /users/1', async () => {
      const findItemId = 1;
      await request(app)
        .get(`/users/${findItemId}`)
        .expect(200, usersObject[findItemId]);
    });
    it('GET /users/321', async () => {
      const findItemId = 321;
      await request(app).get(`/users/${findItemId}`).expect(404);
    });

    it('PUT /users', (done) => {
      const changes: IUserModel = {
        id: 1,
        name: 'changes',
        age: 44,
      };
      request(app)
        .get(`/users/${changes.id}`)
        .expect(200, exampleObject[changes.id]);

      request(app)
        .put('/users')
        .send(changes)
        .expect(200, done);

      request(app)
        .get(`/users/${changes.id}`)
        .expect(200, changes);
    });

    it('PUT /users bad request', (done) => {
      const changes = {
        id: 1,
        ne: 'changes',
      };
      request(app)
        .put('/users')
        .send(changes)
        .expect(400, done);
    });

    it('DELETE /users/1', async () => {
      const findItemId = 1;
      await request(app).get(`/users/${findItemId}`).expect(200, usersObject[findItemId]);
      await request(app).delete(`/users/${findItemId}`).expect(200);
      await request(app).delete(`/users/${findItemId}`).expect(404);
    });

    it('POST /users', (done) => {
      const item: IUserModel = {
        id: 1,
        name: 'Example',
        age: 24,
      };
      request(app)
        .post('/users')
        .send(item)
        .expect(201, done);
    });

    it('POST /users bad request', (done) => {
      const item = {
        id: 14,
        name: 'Example',
      };
      request(app)
        .post('/users')
        .send(item)
        .expect(400, done);

      request(app)
        .get(`/users/${item.id}`)
        .expect(400);
    });
  });

  describe('/pets', () => {
    it('GET /pets', async () => {
      await request(app)
        .get('/pets')
        .expect(200, petMockObjects);
    });

    it('GET /pets/1', async () => {
      const findItemId = 1;
      await request(app)
        .get(`/pets/${findItemId}`)
        .expect(200, petMockObjects[findItemId]);
    });
    it('GET /pets/321', async () => {
      const findItemId = 321;
      await request(app).get(`/pets/${findItemId}`).expect(404);
    });

    it('PUT /pets', (done) => {
      const changes: IPetModel = {
        id: 1,
        name: 'changes',
        hasTail: false,
      };
      request(app)
        .get(`/pets/${changes.id}`)
        .expect(200, petMockObjects[changes.id]);

      request(app)
        .put(`/pets/${changes.id}`)
        .send(changes)
        .expect(200, done);

      request(app)
        .get(`/pets/${changes.id}`)
        .expect(200, changes);
    });

    it('PUT /pets bad request', (done) => {
      const changes = {
        id: 1,
        ne: 'changes',
      };
      request(app)
        .put('/pets/1')
        .send(changes)
        .expect(400, done);
    });

    it('DELETE /pets/1', async () => {
      const findItemId = 1;
      await request(app).get(`/pets/${findItemId}`).expect(200, petMockObjects[findItemId]);
      await request(app).delete(`/pets/${findItemId}`).expect(200);
      await request(app).delete(`/pets/${findItemId}`).expect(404);
    });

    it('POST /pets', (done) => {
      const item: Omit<IPetModel, 'id'> = {
        name: 'Cat',
        hasTail: true,
      };
      request(app)
        .post('/pets')
        .send(item)
        .expect(201, done);
    });

    it('POST /pets bad request', (done) => {
      const item = {
        id: 14,
        name: 'Example',
      };
      request(app)
        .post('/pets')
        .send(item)
        .expect(400, done);

      request(app)
        .get(`/pets/${item.id}`)
        .expect(400);
    });
  });
});