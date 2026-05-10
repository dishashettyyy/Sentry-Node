import DodoPayments from 'dodopayments';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const dodo = new DodoPayments({
    bearerToken: process.env.DODO_API_KEY,
    environment: 'test_mode',
  });

  try {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
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

    res.status(200).json({ url: payment.checkoutUrl });
  } catch (error) {
    console.error('Error creating checkout:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
