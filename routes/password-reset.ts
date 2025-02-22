import { prismaDB } from '@/helpers/prisma';

import { Hono, type Context } from 'hono';

const app = new Hono();

app.post('/', async (context: Context) => {
  try {
    const { email } = await context.req.json();
    if (!email) {
      return context.json(
        {
          data: { message: 'Email is required' },
        },
        400
      );
    }

    const uniqueCode = Math.floor(100000 + Math.random() * 900000);

    const user = await prismaDB.user.findUnique({ where: { email } });

    if (!user) {
      return context.json({
        data: { message: 'User not found' },
      });
    }

    const resetToken = await prismaDB.resetToken.create({
      data: {
        token: uniqueCode.toString(),
        user_id: user.id,
        expires_at: new Date(Date.now() + 3600000), // expires in 1 hour
      },
    });

    const resetTokenUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken.token}`;

    console.log(resetTokenUrl);
    return context.json({
      data: {
        message: 'Password reset email sent',
      },
    });
  } catch (error) {
    return context.json(
      {
        data: {
          message:
            'Invalid request body. Please provide valid JSON with an email field',
        },
      },
      400
    );
  }
});

app.post('/verified', async (context: Context) => {
  try {
    const { token, email, newPassword } = await context.req.json();

    if (!token || !newPassword || !email) {
      return context.json(
        {
          data: { message: 'Token, email, and new password are required' },
        },
        400
      );
    }

    const resetToken = await prismaDB.resetToken.findFirst({
      where: {
        token: token,
        expires_at: {
          gt: new Date(), // token hasn't expired
        },
        used: false, // token hasn't been used
        user: {
          email: email, // ensure token belongs to the correct user
        },
      },
      include: {
        user: true,
      },
    });

    if (!resetToken) {
      return context.json(
        {
          data: { message: 'Invalid or expired reset token' },
        },
        400
      );
    }

    // Hash the new password
    const hashedPassword = await Bun.password.hash(newPassword);

    // Update user's password and mark token as used
    await prismaDB.$transaction([
      prismaDB.user.update({
        where: { id: resetToken.user_id },
        data: { password: hashedPassword },
      }),
      prismaDB.resetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    return context.json({
      data: { message: 'Password updated successfully' },
    });
  } catch (error) {
    return context.json(
      {
        data: {
          message: 'An error occurred while resetting the password',
        },
      },
      500
    );
  }
});

export default app;
