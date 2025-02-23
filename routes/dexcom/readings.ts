import { Hono, type Context } from 'hono';

const dexcom = new Hono();
const DEXCOM_READINGS_URL = process.env.DEXCOM_BASE_URL + '/v3/users/self/egvs';

dexcom.get('/', async (context: Context) => {
  const query = new URLSearchParams({
    startDate: '2025-02-06T09:12:35',
    endDate: '2025-02-23T09:12:35',
  }).toString();
  const { access_token } = await context.req.json();
  console.log(access_token);
  // const response = await fetch(`${DEXCOM_READINGS_URL}?${query}`, {
  //   headers: {
  //     Authorization: `Bearer ${access_token}`,
  //   },
  // });
  // const data = await response.json();
  // return context.json(data);
  return context.json({
    status: 'ok',
  });
});

export default dexcom;
