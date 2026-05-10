import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const DodoPayments = require('dodopayments');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.DODO_API_KEY || !process.env.DODO_PRODUCT_ID) {
    return res.status(500).json({ error: 'Server misconfigured: missing API keys' });
  }

  const dodo = new DodoPayments.default({
    bearerToken: process.env.DODO_API_KEY,
    environment: 'test_mode',
  });

  try {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const origin = `${protocol}://${host}`;

    const payment = await dodo.payments.create({
      billing: {
        city: 'San Francisco',
        country: 'US',
        state: 'CA',
        street: '123 Fake St',
        zipcode: '94105'
      },
      customer: {
        email: 'test@example.com',
        name: 'Sentry Operator'
      },
      productCart: [
        {
          productId: process.env.DODO_PRODUCT_ID,
          quantity: 1
        }
      ],
      returnUrl: `${origin}/?registered=true`
    });

    return res.status(200).json({ url: payment.checkoutUrl });
  } catch (error) {
    console.error('Dodo API error:', error?.message, error?.status);
    return res.status(500).json({
      error: 'Failed to create checkout session',
      detail: error?.message
    });
  }
}
