import { Hono } from 'hono';
import type { Context } from 'hono';

const app = new Hono();

app.get('/', (context: Context) => {
  return context.json({
    status: 'ok',
  });
});

export default app;
