import request from 'supertest';
import { CreateUserDto, UpdateUserDto } from "../dto";

import { appContainer, app as mainApp } from "../../../index";
import 'reflect-metadata';
import { SERVICE_TYPES } from "../../../globalTypes";
import { PrismaService } from "../../../database/prisma.service";


const app = mainApp.app;
const server = mainApp.server;
const container = appContainer;

describe('/users', () => {
  const mockObject = {
    id: 1,
    name: 'Name',
    email: 'email',
    age: 24,
    password: 'password',
  };

  const newCreatedUser: CreateUserDto = {
    name: 'Example',
    age: 24,
    email: 'email@email.com',
    password: 'password',
  };

  beforeAll(async () => {
    await server.close();
    await (container.get(SERVICE_TYPES.PrismaService) as PrismaService).client.userModel.deleteMany({});
    await (container.get(SERVICE_TYPES.PrismaService) as PrismaService).client.userModel.create({
      data: mockObject,
    });
  });
  it('GET /users', async () => {
    await request(app)
      .get('/users')
      .expect(200, [mockObject]);
  });

  it('GET /users/1', async () => {
    await request(app)
      .get(`/users/${mockObject.id}`)
      .expect(200, mockObject);
  });
  it('GET /users/321', async () => {
    const findItemId = 321;
    await request(app).get(`/users/${findItemId}`).expect(404);
  });

  it('PUT /users', (done) => {
    const changes: UpdateUserDto = {
      name: 'changes',
      age: 44,
    };
    request(app)
      .get(`/users/${mockObject.id}`)
      .expect(200, mockObject);

    request(app)
      .put(`/users/${mockObject.id}`)
      .send(changes)
      .expect(200, done);

    request(app)
      .get(`/users/${mockObject.id}`)
      .expect(200, changes);
  });

  it('PUT /users bad request', (done) => {
    const userId = 1;

    const currentUser = { ...mockObject };
    const changes = {
      id: 1,
      ne: 'changes',
    };
    request(app)
      .put(`/users/${userId}`)
      .send(changes)
      .expect(200, done);

    request(app)
      .get(`/users/${userId}`)
      .expect(200, currentUser);
  });

  it('DELETE /users/1', async () => {
    const findItemId = mockObject.id;
    await request(app).get(`/users/${findItemId}`).expect(200);
    await request(app).delete(`/users/${findItemId}`).expect(200);
    await request(app).delete(`/users/${findItemId}`).expect(404);
  });

  it('POST /users', (done) => {

    request(app)
      .post('/users')
      .send(newCreatedUser)
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
      .expect(422, done);

    request(app)
      .get(`/users/${item.id}`)
      .expect(400);
  });
  it('POST /users/login correct', (done) => {
    request(app).post('/users/login')
      .send({ password: newCreatedUser.password, email: newCreatedUser.email })
      .expect(200, done);
  });

  it('POST /users/login user does not exist', (done) => {
    request(app).post('/users/login')
      .send({ password: 'randomPass', email: 'random@email.com' })
      .expect(404, done);
  });

  it('POST /users/login invalid pass', (done) => {
    request(app).post('/users/login')
      .send({ password: 'randomPass', email: newCreatedUser.email })
      .expect(400, done);
  });
});
