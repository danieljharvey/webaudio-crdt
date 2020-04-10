import express from 'express';

const cors = require('cors');

const app = express();
const port = 3006;

let events: Map<number, object> = new Map();

app.use(cors());

app.get('/', (_req, res) => res.send('Hello World!'));

app.use(express.json());

app.post('/pushEvents', (req, res) => {
  const items = req.body.items.map((a: any) => [a.timestamp, a.event]);

  events = new Map([...events, ...items]);
  return res.send('great!');
});

app.get('/events', (_req, res) => {
  const eventList = Array.from(events);
  res.json(eventList);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
