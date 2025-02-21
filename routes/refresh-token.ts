import { prismaDB } from '@/helpers/prisma';
import { generateAccessToken } from '@/helpers/token-generator';
import { Hono, type Context } from 'hono';
import jwt from 'jsonwebtoken';

const app = new Hono();

app.post('/', async (context: Context) => {
  const { refresh_token } = await context.req.json();
  if (!refresh_token) return context.json({ status: 'unauthorized' }, 401);

  try {
    const dbToken = await prismaDB.token.findUnique({
      where: { token: refresh_token },
    });

    if (!dbToken) return context.json({ status: 'unauthorized' }, 401);

    return new Promise((resolve) => {
      jwt.verify(
        refresh_token,
        Bun.env.REFRESH_SECRET as string,
        async (err: any, user: any) => {
          if (err) {
            resolve(context.json({ status: 'unauthorized' }, 401));
            return;
          }
          const newAccessToken = generateAccessToken({ email: user.email });
          resolve(context.json({ accessToken: newAccessToken }));
        }
      );
    });
  } catch (error) {
    console.log('?');
    return context.json({ status: 'unauthorized' }, 401);
  }
});

export default app;
