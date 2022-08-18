import express from 'express';


const app = express();
const port = process.env.PORT || 3003;
app.use(express.json());

interface Entity {
  id: number,
  name: string
}

const example: Record<string, Entity> = {
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
  response.status(200).json(example);
});

app.post('/example', (request, response) => {
  const payload = request.body;
  if ('id' in payload && 'name' in payload) {
    example[payload.id] = payload;
    response.status(201).json(payload);
    return;
  }
  response.sendStatus(400);
});

app.delete('/example/:id', (request, response) => {
  const {id} = request.params;
  if (id in example) {
    delete example[id];
    response.sendStatus(200);
    return;
  }
  response.sendStatus(404);
});

app.get('/example/:id', (request, response) => {
  const {id} = request.params;
  if (id in example) {
    response.status(200).json(example[id]);
    return;
  }
  response.sendStatus(404);
});

app.put('/example', (request, response) => {
  const payload = request.body;
  if ('id' in payload && 'name' in payload) {
    if (example[payload.id]) {
      (example[payload.id] as Entity).name = payload.name;
      response.status(200).json(example[payload.id]);
      return;
    }
    response.sendStatus(400);
    return;
  }
  response.sendStatus(404);
});


app.listen(port);