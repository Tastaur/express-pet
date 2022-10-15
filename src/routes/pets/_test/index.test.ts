import request from 'supertest';
import { app as mainApp } from "../../../index";
import 'reflect-metadata';
import { petMockObjects } from "../pets.controller";
import { CreatePetDto, UpdatePetDto } from "../dto";
import { getArrayFromRecord } from "../../../utils/getArrayFromRecord";


const app = mainApp.app;
const server = mainApp.server;


describe('/pets', () => {
  beforeAll( async ()=>{
    await server.close();
  });
  const pets = getArrayFromRecord(petMockObjects);
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
    const findItemId = 1;
    await request(app)
      .get(`/pets/${findItemId}`)
      .expect(200, petMockObjects[findItemId]);
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
    request(app)
      .get(`/pets/${id}`)
      .expect(200, petMockObjects[id]);

    request(app)
      .put(`/pets/${id}`)
      .send(changes)
      .expect(200, done);

    request(app)
      .get(`/pets/${id}`)
      .expect(200, changes);
  });

  it('PUT /pets bad request', (done) => {
    const id = 1;
    const currentPet = { ...petMockObjects[id] };
    const changes = {
      ne: 'changes',
    };

    request(app)
      .put(`/pets/${id}`)
      .send(changes)
      .expect(200, done);

    request(app)
      .get(`/pets/${id}`)
      .expect(200, currentPet);

  });

  it('DELETE /pets/1', async () => {
    const findItemId = 1;
    await request(app).get(`/pets/${findItemId}`).expect(200, petMockObjects[findItemId]);
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