import { Hono, type Context } from 'hono';

const dexcom = new Hono();
const DEXCOM_READINGS_URL = process.env.DEXCOM_BASE_URL + '/v3/users/self/egvs';

dexcom.get('/', async (context: Context) => {
  const auth = await context.req.header('Authorization');
  const access_token = auth?.split(' ')[1];

  const query = new URLSearchParams({
    startDate: '2025-02-06T09:12:35',
    endDate: '2025-02-23T09:12:35',
  }).toString();

  const response = await fetch(`${DEXCOM_READINGS_URL}?${query}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const data = await response.json();
  return context.json(data);
});

export default dexcom;
