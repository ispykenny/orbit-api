import { Hono } from 'hono';
import type { Context } from 'hono';
import login from './login';
import signUp from './sign-up';
import refreshToken from './refresh-token';
const app = new Hono();

app.get('/', (context: Context) => {
  return context.json({
    status: 'ok',
  });
});

app.route('/login', login);
app.route('/sign-up', signUp);
app.route('/refresh-token', refreshToken);
export default app;
