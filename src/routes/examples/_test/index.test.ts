import request from 'supertest';
import { CreateExampleDto } from "../dto";
import { appContainer, app as mainApp } from "../../../index";
import 'reflect-metadata';
import { SERVICE_TYPES } from "../../../globalTypes";
import { PrismaService } from "../../../database/prisma.service";
import { ExampleModel } from "@prisma/client";


describe('/example', () => {
  const { app, server } = mainApp;

  let example: ExampleModel = {
    id: 1,
    name: 'Example',
  };
  beforeAll(async () => {
    await server.close();
    await (appContainer.get(SERVICE_TYPES.PrismaService) as PrismaService).client.exampleModel.deleteMany({});
    await (appContainer.get(SERVICE_TYPES.PrismaService) as PrismaService).client.exampleModel
      .create({ data: { ...example } }).then((data) => {
        example = { ...example, ...data };
      });
  });
  afterAll(async () => {
    await server.close();
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
