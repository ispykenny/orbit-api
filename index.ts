import { Hono } from 'hono';
import index from './routes/index';
import user from './routes/user';

const app = new Hono();

app.route('/user', user);
app.route('/', index);
Bun.serve({
  fetch: app.fetch,
  port: 3000,
});
