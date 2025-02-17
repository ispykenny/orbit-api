import type { MiddlewareHandler } from 'hono';
import jwt from 'jsonwebtoken';
import { prismaDB } from '../helpers/prisma';

interface JWTPayload {
  email: string;
}

export const authValidation = (): MiddlewareHandler => {
  return async (context, next) => {
    const authHeader = context.req.header('Authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) return context.json({ status: 'unauthorized' }, 401);

    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_SECRET as string
      ) as JWTPayload;
      if (!decoded || !decoded.email)
        return context.json({ status: 'unauthorized' }, 401);
      const user = await prismaDB.user.findUnique({
        where: {
          email: decoded.email,
        },
        select: {
          id: true,
        },
      });
      if (!user) return context.json({ status: 'unauthorized' }, 401);
      context.set('user', user);
      await next();
    } catch (err) {
      return context.json({ status: 'unauthorized' }, 401);
    }
  };
};
