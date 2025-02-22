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
      user_id: user.id,
    },
  });

  return context.json({
    data: 'Record created',
  });
});

app.get('/', async (context: Context) => {
  const user = context.get('user');

  const records = await prismaDB.record.findMany({
    where: {
      user_id: user.id,
    },
  });

  return context.json({
    records,
  });
});

app.delete('/:id', async (context: Context) => {
  const user = context.get('user');
  const { id } = context.req.param();

  try {
    await prismaDB.record.delete({
      where: { id: parseInt(id), user_id: user.id },
    });
  } catch (error) {
    return context.json(
      {
        data: 'Record not found',
      },
      404
    );
  }

  return context.json({
    data: 'Record deleted',
  });
});

app.patch('/:id', async (context: Context) => {
  const user = context.get('user');
  const { id } = context.req.param();
  const { message } = await context.req.json();

  try {
    await prismaDB.record.update({
      where: { id: parseInt(id), user_id: user.id },
      data: { message },
    });
  } catch (error) {
    return context.json(
      {
        data: 'Record not found',
      },
      404
    );
  }

  return context.json({
    data: 'Record updated',
  });
});

export default app;
