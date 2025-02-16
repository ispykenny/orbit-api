import { Hono } from 'hono';
import index from './routes/index';
import user from './routes/user';
import { authValidation } from './middleware/auth-validation';

const app = new Hono();

app.use('/auth/*', authValidation());

app.route('/auth/user', user);
app.route('/', index);

Bun.serve({
  fetch: app.fetch,
  port: 3000,
});
