import { Hono, type Context } from 'hono';

const dexcom = new Hono();
const DEXCOM_URL = process.env.DEXCOM_BASE_URL;

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

export default dexcom;
