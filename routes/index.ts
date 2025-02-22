import type { Context } from 'hono';
import { Hono } from 'hono';
import login from './login';
import refreshToken from './refresh-token';
import signUp from './sign-up';
import passwordReset from './password-reset';
const app = new Hono();

app.get('/', (context: Context) => {
  return context.json({
    status: 'ok',
  });
});

app.route('/login', login);
app.route('/sign-up', signUp);
app.route('/refresh-token', refreshToken);
app.route('/password-reset', passwordReset);
export default app;
