import { Hono } from 'hono';
import type { Context } from 'hono';
import { prismaDB } from '../../../helpers/prisma';

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
