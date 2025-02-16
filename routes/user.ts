import { Hono } from 'hono';
import type { Context } from 'hono';
const app = new Hono();

app.get('/', (context: Context) => {
  const user = context.get('user');
  return context.json({
    status: 'ok',
    user,
  });
});

export default app;
