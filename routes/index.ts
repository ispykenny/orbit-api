import type { Context } from 'hono';
import { Hono } from 'hono';
import dexcom from './dexcom';
import login from './login';
import passwordReset from './password-reset';
import refreshToken from './refresh-token';
import signUp from './sign-up';
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
app.route('/dexcom', dexcom);
export default app;
