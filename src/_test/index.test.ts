import request from 'supertest';
import { app, Entity, exampleObject } from '../index';

describe('test /example', () => {
  it('GET /example', async () => {
    const res = await request(app).get('/example');
    expect(exampleObject).toEqual(res.body);
    expect(200).toEqual(res.statusCode);
  });

  it('GET /example/1', async () => {
    const findItemId = 1;
    const res = await request(app).get(`/example/${findItemId}`);
    expect(exampleObject[findItemId]).toEqual(res.body);
    expect(200).toEqual(res.statusCode);
  });
  it('GET /example/321', async () => {
    const findItemId = 321;
    const res = await request(app).get(`/example/${findItemId}`);
    expect(404).toEqual(res.statusCode);
  });
  it('DELETE /example/1', async () => {
    const findItemId = 1;
    const res = await request(app).get(`/example/${findItemId}`);
    expect(exampleObject[findItemId]).toEqual(res.body);
    expect(200).toEqual(res.statusCode);
    const res1 = await request(app).delete(`/example/${findItemId}`);
    expect(res1.status).toEqual(200);
    const res3 = await request(app).delete(`/example/${findItemId}`);
    expect(res3.status).toEqual(404);
  });

  it('POST /example',  (done) => {
    const item: Entity = {
      id: 1,
      name: 'Example',
    };
    request(app)
      .post('/example')
      .send(item)
      .expect(201, done);
  });

  it('POST /example bad request',  (done) => {
    const item = {
      id: 1,
      ame: 'Example',
    };
    request(app)
      .post('/example')
      .send(item)
      .expect(400, done);
  });

  it('PUT /example',  (done) => {
    const changes = {
      id: 1,
      name: 'changes',
    };
    request(app)
      .put('/example')
      .send(changes)
      .expect(200, done);
  });

  it('PUT /example bad request',  (done) => {
    const changes = {
      id: 1,
      ne: 'changes',
    };
    request(app)
      .put('/example')
      .send(changes)
      .expect(404, done);
  });
});