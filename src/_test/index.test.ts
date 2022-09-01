import request from 'supertest';
import { App } from "app";
import { Express } from "express";
import { LoggerService } from "services/logger/logger.service";
import { ExampleController, exampleObject } from "controllers/examples/examples.controller";
import { Entity } from "controllers/examples/example.interface";
import { ROUTE_NAME } from "globalConstants";
import { UsersController, usersObject } from "controllers/users/users.controller";
import { IUserModel } from "controllers/users/users.interface";
import { ExceptionFilter } from "services/exceptionFIlter/exception.filter.service";


const logger = new LoggerService();
const application = new App({
  logger,
  example: new ExampleController(logger, ROUTE_NAME.EXAMPLE),
  users: new UsersController(logger, ROUTE_NAME.USERS),
  exceptionFilter: new ExceptionFilter(logger),
});

describe('test app', () => {
  let app: Express;
  beforeAll(() => {
    application.init();
    app = application.app;
  });

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
});