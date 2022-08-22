import request from 'supertest';
import { app, Entity, exampleObject } from '../index';

describe('test /example', () => {
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
  it('DELETE /example/1', async () => {
    const findItemId = 1;
    await request(app).get(`/example/${findItemId}`).expect(200, exampleObject[findItemId]);
    await request(app).delete(`/example/${findItemId}`).expect(200);
    await request(app).delete(`/example/${findItemId}`).expect(404);
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

    request(app)
      .get('/example')
      .expect(200,{ [item.id] : item });
  });


  it('PUT /example',  (done) => {
    const changes = {
      id: 1,
      name: 'changes',
    };
    request(app)
      .get('/example/1')
      .expect(200, exampleObject[changes.id]);

    request(app)
      .put('/example')
      .send(changes)
      .expect(200, done);

    request(app)
      .get('/example/1')
      .expect(200, changes);
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