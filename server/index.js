const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Stripe = require('stripe');

// Load environment variables
dotenv.config();

// Initialize Stripe
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration
const AVAILITY_TOKEN_URL = process.env.VITE_AVAILITY_API_TOKEN_URL || 'https://api.availity.com/availity/v1/token';
const AVAILITY_BASE_URL = process.env.VITE_AVAILITY_API_BASE_URL || 'https://api.availity.com/availity/development-partner/v1';
const CLIENT_ID = process.env.VITE_AVAILITY_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_AVAILITY_CLIENT_SECRET;

// In-memory token cache
let tokenCache = {
  token: null,
  expiry: null
};

/**
 * POST /api/token
 * Get access token from Availity
 */
app.post('/api/token', async (req, res) => {
  try {
    // Check if we have a valid cached token
    if (tokenCache.token && tokenCache.expiry && Date.now() < tokenCache.expiry) {
      return res.json({ access_token: tokenCache.token });
    }

    // Get new token
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: 'hipaa'
    });

    const response = await fetch(AVAILITY_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Failed to get access token: ${response.status} ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();

    // Cache the token (subtract 60 seconds for safety margin)
    tokenCache.token = data.access_token;
    tokenCache.expiry = Date.now() + (data.expires_in - 60) * 1000;

    res.json(data);
  } catch (error) {
    console.error('Error getting token:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/coverages/:id
 * Get coverage by ID
 */
app.get('/api/coverages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    console.log(`[GET /api/coverages/${id}] Making request to Availity...`);
    const response = await fetch(`${AVAILITY_BASE_URL}/coverages/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'accept': 'application/json'
      }
    });

    console.log(`[GET /api/coverages/${id}] Response status: ${response.status}`);

    // Try to parse response as JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      console.error(`[GET /api/coverages/${id}] Error response:`, data);
      return res.status(response.status).json({
        error: `Failed to get coverage: ${response.status} ${response.statusText}`,
        details: data
      });
    }

    console.log(`[GET /api/coverages/${id}] Success`);
    res.json(data);
  } catch (error) {
    console.error('Error getting coverage by ID:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/coverages
 * Get coverages by Payer ID
 */
app.post('/api/coverages', async (req, res) => {
  try {
    const { payerId } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    if (!payerId) {
      return res.status(400).json({ error: 'payerId is required' });
    }

    console.log(`[POST /api/coverages] Making request to Availity with payerId: ${payerId}`);
    const params = new URLSearchParams({ payerId });

    const response = await fetch(`${AVAILITY_BASE_URL}/coverages`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    console.log(`[POST /api/coverages] Response status: ${response.status}`);

    // Try to parse response as JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      console.error(`[POST /api/coverages] Error response:`, data);
      return res.status(response.status).json({
        error: `Failed to get coverages by payer ID: ${response.status} ${response.statusText}`,
        details: data
      });
    }

    console.log(`[POST /api/coverages] Success`);
    res.json(data);
  } catch (error) {
    console.error('Error getting coverages by payer ID:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/payment/create-intent
 * Create a Stripe payment intent
 */
app.post('/api/payment/create-intent', async (req, res) => {
  try {
    const { amount, patientId, patientName } = req.body;

    // Validate input
    if (!amount || amount < 50) {
      return res.status(400).json({ error: 'Amount must be at least $0.50 (50 cents)' });
    }

    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    console.log(`[POST /api/payment/create-intent] Creating payment intent for patient: ${patientId}, amount: $${amount / 100}`);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        patientId: patientId,
        patientName: patientName || 'N/A',
      },
      description: `Payment for patient ${patientName || patientId}`,
    });

    console.log(`[POST /api/payment/create-intent] Payment intent created: ${paymentIntent.id}`);

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      error: error.message || 'Failed to create payment intent',
      details: error.type
    });
  }
});

/**
 * GET /api/payment/status/:paymentIntentId
 * Get payment intent status
 */
app.get('/api/payment/status/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    console.log(`[GET /api/payment/status/${paymentIntentId}] Retrieving payment intent status...`);

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    console.log(`[GET /api/payment/status/${paymentIntentId}] Status: ${paymentIntent.status}`);

    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
    });
  } catch (error) {
    console.error('Error retrieving payment status:', error);
    res.status(500).json({
      error: error.message || 'Failed to retrieve payment status'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`CORS enabled for all origins`);
  console.log(`Stripe integration ${process.env.STRIPE_SECRET_KEY ? 'enabled' : 'disabled (no API key)'}`);
});
