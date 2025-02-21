import { Hono } from 'hono';
import records from './records';
import user from './user';
const app = new Hono();

app.get('/', (c) => {
  return c.json(
    {
      data: 'unauthorized',
    },
    401
  );
});

app.route('/user', user);
app.route('/records', records);
export default app;
