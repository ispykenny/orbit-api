import { prismaDB } from '@/helpers/prisma';
import {
  generateAccessToken,
  generateRefreshToken,
} from '@/helpers/token-generator';
import { Hono, type Context } from 'hono';

const app = new Hono();

app.post('/', async (context: Context) => {
  const { email, password } = await context.req.json();
  try {
    const user = await prismaDB.user.findUnique({ where: { email } });
    if (!user || !(await Bun.password.verify(password, user.password))) {
      return context.json(
        {
          data: { message: 'Incorrect email or password' },
        },
        401
      );
    }

    const accessToken = generateAccessToken({ email });
    const refreshToken = generateRefreshToken({ email });

    await prismaDB.token.create({
      data: { token: refreshToken, user_id: user.id },
    });

    return context.json(
      {
        data: { accessToken, refreshToken },
      },
      200
    );
  } catch (error) {
    return context.json(
      {
        data: { message: 'Error signing in' },
      },
      500
    );
  }
});

export default app;
