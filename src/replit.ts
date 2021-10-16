import env from './env';
import express from 'express';

const app = express();

const port = env.PORT ? Number(env.PORT) : 8080;

app.get('/*', (req, res) => res.send('Hello world.'));
app.listen(port, () => require('./'));