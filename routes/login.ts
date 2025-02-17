import { Hono, type Context } from 'hono';
import { prismaDB } from '../helpers/prisma';
import { generateRefreshToken } from '../helpers/token-generator';
import { generateAccessToken } from '../helpers/token-generator';

const app = new Hono();

app.post('/', async (context: Context) => {
  const { email, password } = await context.req.json();
  try {
    const user = await prismaDB.user.findUnique({ where: { email } });
    if (!user || !(await Bun.password.verify(password, user.password))) {
      return context.json({
        status: 401,
        data: { message: 'Incorrect email or password' },
      });
    }

    const accessToken = generateAccessToken({ email });
    const refreshToken = generateRefreshToken({ email });

    await prismaDB.token.create({
      data: { token: refreshToken, userId: user.id },
    });

    return context.json({
      status: 200,
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    return context.json({
      status: 500,
      data: { message: 'Error signing in' },
    });
  }
});

export default app;
