import { prismaDB } from '@/helpers/prisma';
import type { Context } from 'hono';
import { Hono } from 'hono';
const app = new Hono();

async function getUser(context: Context) {
  const user = context.get('user');

  const dbUser = await prismaDB.user.findUnique({
    where: {
      id: user.id,
    },
    omit: {
      password: true,
    },
  });

  return dbUser;
}

app.get('/', async (context: Context) => {
  const user = await getUser(context);

  return context.json({
    user,
  });
});

export default app;
