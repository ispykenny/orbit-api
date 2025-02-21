import { validAuthUser } from '@/helpers/credential';
import { prismaDB } from '@/helpers/prisma';
import { Hono, type Context } from 'hono';

const app = new Hono();

app.post('/', async (context: Context) => {
  const { email, password } = await context.req.json();

  if (!email || !password) {
    return context.json({
      status: 400,
      data: { message: 'Email and password are required' },
    });
  }
  const errors = validAuthUser(email, password);

  // is valid email
  // valid password with atleast 8 characters
  if (errors.email || errors.password) {
    return context.json({
      status: 400,
      data: errors,
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
      data: { message: 'User created' },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return context.json({
        status: 400,
        data: { message: 'A user with this email already exists' },
      });
    }
    return context.json({
      status: 500,
      data: { message: 'Error creating user' },
    });
  }
});

export default app;
