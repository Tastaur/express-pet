import request from 'supertest';
import { exampleObject } from "../examples.controller";
import { CreateExampleDto } from "../dto";
import { app as mainApp } from "../../../index";
import 'reflect-metadata';
import { getArrayFromRecord } from "../../../utils/getArrayFromRecord";


const app = mainApp.app;
const server = mainApp.server;

describe('/example', () => {
  beforeAll(async () => {
    await server.close();
  });
  it('GET /example', async () => {
    await request(app)
      .get('/example')
      .expect(200, getArrayFromRecord(exampleObject).map(item => item.plainObject));
  });

  it('GET /example/1', async () => {
    const findItemId = 1;
    await request(app)
      .get(`/example/${findItemId}`)
      .expect(200, exampleObject[findItemId]?.plainObject);
  });
  it('GET /example/321', async () => {
    const findItemId = 321;
    await request(app).get(`/example/${findItemId}`).expect(404);
  });

  it('PUT /example', (done) => {
    const id = '1';
    const changes = {
      name: 'changes',
    };
    request(app)
      .get(`/example/${id}`)
      .expect(200, exampleObject[id]?.plainObject);

    request(app)
      .put('/example/1')
      .send(changes)
      .expect(200, done);

    request(app)
      .get('/example/1')
      .expect(200, changes);
  });

  it('PUT /example bad request', (done) => {
    const changes = {
      ne: 'changes',
    };
    request(app)
      .put('/example/1')
      .send(changes)
      .expect(400, done);
  });


  it('DELETE /example/1', async () => {
    const findItemId = 1;
    await request(app).get(`/example/${findItemId}`).expect(200, exampleObject[findItemId]?.plainObject);
    await request(app).delete(`/example/${findItemId}`).expect(200);
    await request(app).delete(`/example/${findItemId}`).expect(400);
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
      .expect(400, done);
  });

});