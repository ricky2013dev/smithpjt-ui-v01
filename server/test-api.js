// Simple test script to verify Availity API connectivity
const dotenv = require('dotenv');
dotenv.config();

const AVAILITY_TOKEN_URL = process.env.VITE_AVAILITY_API_TOKEN_URL;
const AVAILITY_BASE_URL = process.env.VITE_AVAILITY_API_BASE_URL;
const CLIENT_ID = process.env.VITE_AVAILITY_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_AVAILITY_CLIENT_SECRET;

console.log('Testing Availity API Connection...\n');
console.log('Configuration:');
console.log('- Token URL:', AVAILITY_TOKEN_URL);
console.log('- Base URL:', AVAILITY_BASE_URL);
console.log('- Client ID:', CLIENT_ID ? CLIENT_ID.substring(0, 8) + '...' : 'NOT SET');
console.log('- Client Secret:', CLIENT_SECRET ? '***' : 'NOT SET');
console.log('\n');

async function testToken() {
  console.log('Step 1: Getting access token...');

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: 'hipaa'
  });

  try {
    const response = await fetch(AVAILITY_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    console.log('Token response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token error:', errorText);
      return null;
    }

    const data = await response.json();
    console.log('✓ Token obtained successfully');
    console.log('Token (first 20 chars):', data.access_token.substring(0, 20) + '...');
    console.log('Expires in:', data.expires_in, 'seconds');
    return data.access_token;
  } catch (error) {
    console.error('Token fetch error:', error.message);
    return null;
  }
}

async function testCoverageById(token, coverageId) {
  console.log(`\nStep 2: Testing GET /coverages/${coverageId}...`);

  try {
    const response = await fetch(`${AVAILITY_BASE_URL}/coverages/${coverageId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      }
    });

    console.log('Coverage response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      console.error('✗ Coverage error:', data);
      console.log('\nGenerated curl command:');
      console.log(`curl --request GET \\
  --url ${AVAILITY_BASE_URL}/coverages/${coverageId} \\
  --header 'Authorization: Bearer ${token}' \\
  --header 'accept: application/json'`);
    } else {
      console.log('✓ Coverage retrieved successfully');
      console.log('Response data:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
    }
  } catch (error) {
    console.error('Coverage fetch error:', error.message);
  }
}

async function main() {
  const token = await testToken();

  if (token) {
    // Test with a sample coverage ID - replace with actual ID
    const testCoverageId = process.argv[2] || 'TEST_ID';
    console.log('\nUsing coverage ID:', testCoverageId);
    await testCoverageById(token, testCoverageId);
  } else {
    console.log('\n✗ Failed to get token, cannot test coverage endpoint');
  }
}

main();
