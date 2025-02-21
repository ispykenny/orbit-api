import type { MiddlewareHandler } from 'hono';
import jwt from 'jsonwebtoken';
import { prismaDB } from '../helpers/prisma';

interface JWTPayload {
  email: string;
}

export const authValidation = (): MiddlewareHandler => {
  return async (context, next) => {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(context);
    if (!token) {
      return unauthorizedResponse(context);
    }

    try {
      // Verify and decode JWT token
      const decoded = await verifyToken(token);
      if (!decoded) {
        return unauthorizedResponse(context);
      }

      // Validate user exists in database
      const user = await validateUser(decoded.email);
      if (!user) {
        return unauthorizedResponse(context);
      }

      // Set user in context and continue
      context.set('user', user);
      await next();
    } catch (err) {
      return unauthorizedResponse(context);
    }
  };
};

// Helper functions
const extractTokenFromHeader = (context: any): string | null => {
  const authHeader = context.req.header('Authorization');
  return authHeader?.split(' ')[1] || null;
};

const verifyToken = async (token: string): Promise<JWTPayload | null> => {
  const decoded = jwt.verify(
    token,
    Bun.env.ACCESS_SECRET as string
  ) as JWTPayload;

  return decoded && decoded.email ? decoded : null;
};

const validateUser = async (email: string) => {
  return await prismaDB.user.findUnique({
    where: { email },
    select: { id: true },
  });
};

const unauthorizedResponse = (context: any) => {
  return context.json({ status: 'unauthorized' }, 401);
};
