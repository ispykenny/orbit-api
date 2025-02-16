import { Hono, type Context } from 'hono';
import { prismaDB } from '../helpers/prisma';

const app = new Hono();

app.post('/', async (context: Context) => {
  const { email, password } = await context.req.json();

  if (!email || !password) {
    return context.json({
      status: 400,
      message: 'Email and password are required',
    });
  }

  const hashedPassword = await Bun.password.hash(password, {
    algorithm: 'bcrypt',
    cost: 10,
  });

  try {
    await prismaDB.user.create({
      data: { email, password: hashedPassword },
    });
    return context.json({
      status: 200,
      message: 'User created',
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return context.json({
        status: 400,
        message: 'A user with this email already exists',
      });
    }
    return context.json({
      status: 500,
      message: 'Error creating user',
    });
  }
});

export default app;
