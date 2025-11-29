const express = require('express');
const router = express.Router();

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
 * POST /api/availity/token
 * Get access token from Availity
 */
router.post('/token', async (req, res) => {
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
 * GET /api/availity/coverages/:id
 * Get coverage by ID
 */
router.get('/coverages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    console.log(`[GET /api/availity/coverages/${id}] Making request to Availity...`);
    const response = await fetch(`${AVAILITY_BASE_URL}/coverages/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'accept': 'application/json'
      }
    });

    console.log(`[GET /api/availity/coverages/${id}] Response status: ${response.status}`);

    // Try to parse response as JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      console.error(`[GET /api/availity/coverages/${id}] Error response:`, data);
      return res.status(response.status).json({
        error: `Failed to get coverage: ${response.status} ${response.statusText}`,
        details: data
      });
    }

    console.log(`[GET /api/availity/coverages/${id}] Success`);
    res.json(data);
  } catch (error) {
    console.error('Error getting coverage by ID:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/availity/coverages
 * Get coverages by Payer ID
 */
router.post('/coverages', async (req, res) => {
  try {
    const { payerId } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    if (!payerId) {
      return res.status(400).json({ error: 'payerId is required' });
    }

    console.log(`[POST /api/availity/coverages] Making request to Availity with payerId: ${payerId}`);
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

    console.log(`[POST /api/availity/coverages] Response status: ${response.status}`);

    // Try to parse response as JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      console.error(`[POST /api/availity/coverages] Error response:`, data);
      return res.status(response.status).json({
        error: `Failed to get coverages by payer ID: ${response.status} ${response.statusText}`,
        details: data
      });
    }

    console.log(`[POST /api/availity/coverages] Success`);
    res.json(data);
  } catch (error) {
    console.error('Error getting coverages by payer ID:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
