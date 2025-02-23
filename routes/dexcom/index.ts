import { Hono, type Context } from 'hono';
import readings from './readings';
import refreshTokens from './refresh-tokens';
import token from './token';
const dexcom = new Hono();
const DEXCOM_URL = process.env.DEXCOM_BASE_URL;

dexcom.get('/', (context: Context) => {
  const redirectUri = process.env.BASE_URL + '/dexcom/token';
  const clientId = process.env.DEXCOM_CLIENT_ID;
  const loginUrl = `${DEXCOM_URL}/v2/oauth2/login?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=offline_access`;
  return context.html(`<a href="${loginUrl}">Login with Dexcom</a>`);
});

dexcom.get('/token', async (context: Context) => {
  const code = context.req.query('code');
  const redirectUri = process.env.BASE_URL + '/dexcom/token';
  const clientId = process.env.DEXCOM_CLIENT_ID;
  const clientSecret = process.env.DEXCOM_SECRET;

  const response = await fetch(`${DEXCOM_URL}/v2/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId ?? '',
      client_secret: clientSecret ?? '',
      code: code ?? '',
      grant_type: 'authorization_code',
      redirect_uri: redirectUri ?? '',
    }),
  });

  const data = await response.json();
  return context.json(data);
});

dexcom.route('/token', token);
dexcom.route('/refresh-tokens', refreshTokens);
dexcom.route('/readings', readings);

export default dexcom;
