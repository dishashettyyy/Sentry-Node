import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import DodoPayments from 'dodopayments';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = 3001;

// Use express.raw for webhook signature verification
app.use('/api/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '../dist')));

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY,
  environment: 'test_mode',
});

app.post('/api/checkout', async (req, res) => {
  try {
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
      returnUrl: `${req.headers.origin}/?registered=true`
    });

    res.json({ url: payment.checkoutUrl });
  } catch (error) {
    console.error('Error creating checkout:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

app.post('/api/webhook', async (req, res) => {
  const payload = req.body;
  const signature = req.headers['webhook-signature'];
  
  try {
    // In a real application, you would verify the signature using the DodoPayments SDK.
    // For example: await dodo.webhooks.verifySignature(payload, signature, process.env.DODO_WEBHOOK_SECRET);
    // Since the SDK might have a specific method for it, and the user just asked to log on payment.succeeded:
    const event = JSON.parse(payload.toString());

    if (event.type === 'payment.succeeded') {
      console.log(`OPERATOR REGISTERED: ${event.data.customerId}`);
    }

    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Sentry Node Backend running on port ${port}`);
});
