import type { MiddlewareHandler } from 'hono';
import jwt from 'jsonwebtoken';

const userObject = {
  name: 'kenny',
  age: 35,
};

export const authValidation = (): MiddlewareHandler => {
  return async (context, next) => {
    const authHeader = context.req.header('Authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) return context.json({ status: 'unauthorized' }, 401);

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET as string);
      context.set('user', decoded);
      await next();
    } catch (err) {
      console.log(err);
      return context.json({ status: 'unauthorized' }, 401);
    }
  };
};
