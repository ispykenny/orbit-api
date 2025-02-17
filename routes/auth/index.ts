import { Hono } from 'hono';
import user from './user';
import records from './records';
const app = new Hono();

app.get('/', (c) => {
  return c.json(
    {
      message: 'unauthorized',
    },
    401
  );
});

app.route('/user', user);
app.route('/records', records);
export default app;
