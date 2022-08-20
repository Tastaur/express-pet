import express from 'express';


export const app = express();
const port = process.env.PORT || 3003;
app.use(express.json());

export interface Entity {
  id: number,
  name: string
}

export const exampleObject: Record<string, Entity> = {
  // todo mock
  '1': {
    id: 1,
    name: 'Example',
  },
};


app.get('/', (request, response) => {
  response.json({
    a: 1,
    b: 2,
  });
});

app.get('/example', (request, response) => {
  response.status(200).json(exampleObject);
});

app.post('/example', (request, response) => {
  const payload = request.body;
  if ('id' in payload && 'name' in payload) {
    exampleObject[payload.id] = payload;
    response.status(201).json(payload);
    return;
  }
  response.sendStatus(400);
});

app.delete('/example/:id', (request, response) => {
  const { id } = request.params;
  if (id in exampleObject) {
    delete exampleObject[id];
    response.sendStatus(200);
    return;
  }
  response.sendStatus(404);
});

app.get('/example/:id', (request, response) => {
  const { id } = request.params;
  if (id in exampleObject) {
    response.status(200).json(exampleObject[id]);
    return;
  }
  response.sendStatus(404);
});

app.put('/example', (request, response) => {
  const payload = request.body;
  if ('id' in payload && 'name' in payload) {
    if (exampleObject[payload.id]) {
      (exampleObject[payload.id] as Entity).name = payload.name;
      response.status(200).json(exampleObject[payload.id]);
      return;
    }
    response.sendStatus(400);
    return;
  }
  response.sendStatus(404);
});


app.listen(port);