import type { MiddlewareHandler } from 'hono';

const userObject = {
  name: 'kenny',
  age: 35,
};

export const authValidation = (): MiddlewareHandler => {
  return async (c, next) => {
    if (!userObject) {
      return c.json(
        {
          status: 'unauthorized',
        },
        401
      );
    }
    c.set('user', userObject);
    await next();
  };
};
