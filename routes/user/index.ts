import { Hono } from 'hono';
import type { Context } from 'hono';
import { prismaDB } from '../../helpers/prisma';
const app = new Hono();

async function getUser(context: Context) {
  const user = context.get('user');
  if (!user) {
    return context.json({ status: 'unauthorized' }, 401);
  }

  const dbUser = await prismaDB.user.findUnique({
    where: {
      email: user.email,
    },
    select: {
      email: true,
      hasDexcom: true,
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
