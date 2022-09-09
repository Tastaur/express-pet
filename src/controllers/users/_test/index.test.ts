import request from 'supertest';
import { usersObject } from "../users.controller";
import { CreateUserDto, UpdateUserDto } from "../dto";

import { app as mainApp } from "../../../index";
import 'reflect-metadata';
import { getArrayFromRecord } from "../../../utils/getArrayFromRecord";


const app = mainApp.app;
const server = mainApp.server;

describe('/users', () => {
  beforeAll( async ()=>{
    await server.close();
  });
  it('GET /users', async () => {
    await request(app)
      .get('/users')
      .expect(200, getArrayFromRecord(usersObject));
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
    const id = '1';
    const changes: UpdateUserDto = {
      name: 'changes',
      age: 44,
    };
    request(app)
      .get(`/users/${id}`)
      .expect(200, usersObject[id]);

    request(app)
      .put(`/users/${id}`)
      .send(changes)
      .expect(200, done);

    request(app)
      .get(`/users/${id}`)
      .expect(200, changes);
  });

  it('PUT /users bad request', (done) => {
    const changes = {
      id: 1,
      ne: 'changes',
    };
    request(app)
      .put('/users/1')
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
    const item: CreateUserDto = {
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