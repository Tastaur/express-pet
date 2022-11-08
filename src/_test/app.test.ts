import request from "supertest";
import { CreateUserDto, UpdateUserDto } from "../routes/users/dto";
import { appContainer, app as mainApp } from "../index";
import { ExampleModel, PetModel, UserModel } from "@prisma/client";
import { hash } from "bcryptjs";
import { SERVICE_TYPES } from "../globalTypes";
import { PrismaService } from "../database/prisma.service";
import 'reflect-metadata';
import { CreatePetDto, UpdatePetDto } from "../routes/pets/dto";
import { CreateExampleDto } from "../routes/examples/dto";


const { app, server } = mainApp;


const prisma = appContainer.get(SERVICE_TYPES.PrismaService) as PrismaService;


afterAll(async () => {
  await server.close();
});

describe('End to end test', () => {
  describe('/users', () => {
    let token: string;

    const newCreatedUserInitialPassword = 'password';
    let mockObject: UserModel = {
      id: 1,
      name: 'Name',
      email: 'email@mail.com',
      age: 24,
      password: newCreatedUserInitialPassword,
    };

    beforeAll(async () => {
      const newPas = await hash(newCreatedUserInitialPassword, Number.parseInt(process.env.SALT || '0', 10));
      mockObject = {
        ...mockObject,
        password: newPas,
      };
      await prisma.client.userModel.deleteMany({});
      await prisma.client.userModel.create({
        data: mockObject,
      });
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
          .expect(401, done);
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
  describe('/pets', () => {
    let mockPet: PetModel = {
      id: 1,
      name: 'Bober',
      hasTail: false,
    };

    const pets = [mockPet];

    beforeAll(async () => {
      await prisma.client.petModel.deleteMany({});
      await prisma.client.petModel.create({ data: mockPet })
        .then(data => {
          mockPet = { ...mockPet, ...data };
        });
    });

    it('GET /pets', async () => {
      await request(app)
        .get('/pets')
        .expect(200, pets);
    });

    it('GET /pets with query', async () => {
      const getExpectedValue = (withTails: boolean) => {
        return pets
          .filter(item => withTails ? item.hasTail : !item.hasTail);
      };
      await request(app)
        .get('/pets?hasTail=true')
        .expect(200, getExpectedValue(true));
      await request(app)
        .get('/pets?hasTail=false')
        .expect(200, getExpectedValue(false));
      await request(app)
        .get('/pets?hasTail=random')
        .expect(200, pets);
    });

    it('GET /pets/1', async () => {
      await request(app)
        .get(`/pets/${mockPet.id}`)
        .expect(200, mockPet);
    });

    it('GET /pets/321', async () => {
      const findItemId = 321;
      await request(app).get(`/pets/${findItemId}`).expect(404);
    });

    it('PUT /pets', (done) => {
      const id = 1;
      const changes: UpdatePetDto = {
        name: 'changes',
        hasTail: false,
      };
      mockPet = { ...mockPet, ...changes };
      request(app)
        .get(`/pets/${id}`)
        .expect(200, mockPet);

      request(app)
        .put(`/pets/${id}`)
        .send(changes)
        .expect(200, done);

      request(app)
        .get(`/pets/${id}`)
        .expect(200, mockPet);
    });

    it('PUT /pets bad request', (done) => {
      const currentPet = { ...mockPet };
      const changes = {
        ne: 'changes',
      };
      request(app)
        .put(`/pets/${mockPet.id}`)
        .send(changes)
        .expect(404, done);

      request(app)
        .get(`/pets/${mockPet.id}`)
        .expect(200, currentPet);

    });

    it('DELETE /pets/1', async () => {
      const findItemId = 1;
      await request(app).get(`/pets/${findItemId}`).expect(200, mockPet);
      await request(app).delete(`/pets/${findItemId}`).expect(200);
      await request(app).delete(`/pets/${findItemId}`).expect(404);
    });

    it('POST /pets', (done) => {
      const item: CreatePetDto = {
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
        .expect(422, done);

      request(app)
        .get(`/pets/${item.id}`)
        .expect(400);
    });
  });
  describe('/example', () => {

    let example: ExampleModel = {
      id: 1,
      name: 'Example',
    };

    beforeAll(async () => {
      await prisma.client.exampleModel.deleteMany({});
      await prisma.client.exampleModel
        .create({ data: { ...example } }).then((data) => {
          example = { ...example, ...data };
        });
    });

    it('GET /example', async () => {
      await request(app)
        .get('/example')
        .expect(200, [example]);
    });

    it('GET /example/1', async () => {
      await request(app)
        .get(`/example/${example.id}`)
        .expect(200, example);
    });

    it('GET /example/321', async () => {
      const findItemId = 321;
      await request(app).get(`/example/${findItemId}`).expect(404);
    });

    it('PUT /example', (done) => {
      const changes = {
        name: 'changes',
      };
      example = { ...example, ...changes };
      request(app)
        .get(`/example/${example.id}`)
        .expect(200, example);

      request(app)
        .put('/example/1')
        .send(changes)
        .expect(200, done);

      request(app)
        .get('/example/1')
        .expect(200, example);
    });

    it('PUT /example bad request', (done) => {
      const changes = {
        ne: 'changes',
      };
      request(app)
        .put('/example/1')
        .send(changes)
        .expect(422, done);
    });

    it('DELETE /example/1', async () => {
      await request(app).get(`/example/${example.id}`).expect(200, example);
      await request(app).delete(`/example/${example.id}`).expect(200);
      await request(app).delete(`/example/${example.id}`).expect(404);
    });

    it('POST /example', (done) => {
      const item: CreateExampleDto = {
        name: 'Example',
      };
      request(app)
        .post('/example')
        .send(item)
        .expect(201, done);
    });

    it('POST /example bad request', (done) => {
      const item = {
        ame: 'Example',
      };
      request(app)
        .post('/example')
        .send(item)
        .expect(422, done);
    });
  });
});
