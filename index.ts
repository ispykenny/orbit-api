import { Hono } from 'hono';
import index from './routes/index';
import { authValidation } from './middleware/auth-validation';
import auth from './routes/auth';

const app = new Hono();

app.use('/auth/*', authValidation());
app.route('/auth', auth);
app.route('/', index);

Bun.serve({
  fetch: app.fetch,
  port: 3000,
});
