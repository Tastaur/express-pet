import request from 'supertest';
import { CreateUserDto, UpdateUserDto } from "../dto";

import { appContainer, app as mainApp } from "../../../index";
import 'reflect-metadata';
import { SERVICE_TYPES } from "../../../globalTypes";
import { PrismaService } from "../../../database/prisma.service";
import { UserModel } from "@prisma/client";
import { hash } from "bcryptjs";


describe('/users', () => {
  const { app, server } = mainApp;
  const newCreatedUserInitialPassword = 'password';
  let mockObject: UserModel = {
    id: 1,
    name: 'Name',
    email: 'email@mail.com',
    age: 24,
    password: newCreatedUserInitialPassword,
  };

  let token: string;
  beforeAll(async () => {
    await server.close();
    const newPas = await hash(newCreatedUserInitialPassword, Number.parseInt(process.env.SALT || '0', 10));
    mockObject = {
      ...mockObject,
      password: newPas,
    };
    await (appContainer.get(SERVICE_TYPES.PrismaService) as PrismaService).client.userModel.deleteMany({});
    await (appContainer.get(SERVICE_TYPES.PrismaService) as PrismaService).client.userModel.create({
      data: mockObject,
    });
  });

  afterAll(async () => {
    await server.close();
  });

  describe('LOGIN USER', () => {
    it('POST /users/login correct', (done) => {
      request(app).post('/users/login')
        .send({ password: newCreatedUserInitialPassword, email: mockObject.email })
        .end((_, res) => {
          token = res.body?.token;
          done();
        });
    });
    it('POST /users/login user does not exist', (done) => {
      request(app)
        .post('/users/login')
        .send({ password: 'randomPass', email: 'random@email.com' })
        .expect(404, done);
    });

    it('POST /users/login invalid pass', (done) => {
      request(app).post('/users/login')
        .send({ password: 'randomPass', email: mockObject.email })
        .expect(400, done);
    });
  });

  describe('GET ALL USERS', () => {
    it('GET /users correct', async () => {
      await request(app)
        .get('/users')
        .set('Authorization', `Beraer ${token}`)
        .expect(200, [mockObject]);
    });
    it('GET /users unauthorized', async () => {
      await request(app)
        .get('/users')
        .expect(401);
    });
  });


  describe('GET USER BY ID', () => {
    it('GET /users/1 correct', async () => {
      await request(app)
        .get(`/users/${mockObject.id}`)
        .set('Authorization', `Beraer ${token}`)
        .expect(200, mockObject);
    });

    it('GET /users/1 unauthorized', async () => {
      await request(app)
        .get(`/users/${mockObject.id}`)
        .expect(401);
    });

    it('GET /users/321 incorrect', async () => {
      const findItemId = -1;
      await request(app)
        .get(`/users/${findItemId}`).expect(404)
        .set('Authorization', `Beraer ${token}`);
    });
  });

  describe('CHANGE USER', () => {
    it('PUT /users', (done) => {
      const changes: UpdateUserDto = {
        name: 'changes',
        age: 44,
      };
      request(app)
        .get(`/users/${mockObject.id}`)
        .set('Authorization', `Beraer ${token}`)
        .expect(200, mockObject);

      request(app)
        .put(`/users/${mockObject.id}`)
        .set('Authorization', `Beraer ${token}`)
        .send(changes)
        .expect(200, done);

      request(app)
        .get(`/users/${mockObject.id}`)
        .set('Authorization', `Beraer ${token}`)
        .expect(200, changes);
    });

    it('PUT /users unauthorized', (done) => {
      const changes: UpdateUserDto = {
        name: 'changes',
        age: 44,
      };
      request(app)
        .get(`/users/${mockObject.id}`)
        .set('Authorization', `Beraer ${token}`)
        .expect(200, mockObject);

      request(app)
        .put(`/users/${mockObject.id}`)
        .send(changes)
        .expect(401, done);
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
        .set('Authorization', `Beraer ${token}`)
        .expect(200, done);

      request(app)
        .get(`/users/${userId}`)
        .set('Authorization', `Beraer ${token}`)
        .expect(200, currentUser);
    });
  });

  describe('CREATE USER', () => {
    it('POST /users bad request', (done) => {
      const item = {
        id: 14,
        name: 'Example',
      };
      request(app)
        .post('/users')
        .send(item)
        .set('Authorization', `Beraer ${token}`)
        .expect(422, done);

      request(app)
        .get(`/users/${item.id}`)
        .set('Authorization', `Beraer ${token}`)
        .expect(400);
    });

    it('POST /users', (done) => {
      const data: CreateUserDto = {
        email: 'email11@yandex.com',
        age: 31,
        name: 'name',
        password: 'pass',
      };
      request(app)
        .post('/users')
        .set('Authorization', `Beraer ${token}`)
        .send(data)
        .expect(201, done);
    });

    it('POST /users unauthorized', (done) => {
      const data: CreateUserDto = {
        email: 'email11@yandex.com',
        age: 31,
        name: 'name',
        password: 'pass',
      };
      request(app)
        .post('/users')
        .send(data)
        .expect(401, done);
    });
  });

  describe('DELETE USER', () => {
    it('DELETE /users/1', async () => {
      const findItemId = mockObject.id;
      await request(app).get(`/users/${findItemId}`)
        .set('Authorization', `Beraer ${token}`)
        .expect(200);
      await request(app).delete(`/users/${findItemId}`)
        .set('Authorization', `Beraer ${token}`)
        .expect(200);

    });
    it('DELETE /user/123 invalid user', async () => {
      await request(app)
        .delete(`/users/${mockObject.id}`)
        .set('Authorization', `Beraer ${token}`)
        .expect(404);
    });
    it('DELETE /user/1 unauthorized', async () => {
      await request(app)
        .delete(`/users/${mockObject.id}`)
        .expect(401);
    });
  });
});
