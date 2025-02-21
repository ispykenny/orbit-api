import { prismaDB } from '@/helpers/prisma';
import type { Context } from 'hono';
import { Hono } from 'hono';

const app = new Hono();

app.post('/', async (context: Context) => {
  const user = context.get('user');
  const { message } = await context.req.json();

  await prismaDB.record.create({
    data: {
      message,
      userId: user.id,
    },
  });

  return context.json({
    message: 'Record created',
  });
});

export default app;
