export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const payload = req.body;
  // const signature = req.headers['webhook-signature'];
  
  try {
    // In a real application, you would verify the signature using the DodoPayments SDK.
    const event = typeof payload === 'string' ? JSON.parse(payload) : payload;

    if (event.type === 'payment.succeeded') {
      console.log(`OPERATOR REGISTERED: ${event.data.customerId}`);
    }

    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
}
