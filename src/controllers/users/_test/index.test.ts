import request from 'supertest';
import { usersObject } from "../users.controller";
import { IUserModel } from "../users.interface";
import { app as mainApp } from "../../../index";
import 'reflect-metadata';


const app = mainApp.app;
const server = mainApp.server;

describe('/users', () => {
  beforeAll( async ()=>{
    await server.close();
  });
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
      .expect(200, usersObject[changes.id]);

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