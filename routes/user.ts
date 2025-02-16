import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.text('Hello World'));

app.post('/', (c) => c.text('Hello World'));

app.put('/', (c) => c.text('Hello World'));

app.delete('/', (c) => c.text('Hello World'));

export default app;
