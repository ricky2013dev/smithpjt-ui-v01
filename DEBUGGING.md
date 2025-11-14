# Debugging Guide for Verify by ID

## Issue: "Verify by ID is not working"

If you're experiencing issues with the verification feature, follow these steps to debug:

## Step 1: Verify Environment Configuration

Check your `.env` file has the correct values:

```bash
cat .env
```

Should contain:
```
VITE_AVAILITY_CLIENT_ID=your_actual_client_id
VITE_AVAILITY_CLIENT_SECRET=your_actual_client_secret
VITE_AVAILITY_API_TOKEN_URL=https://api.availity.com/availity/v1/token
VITE_AVAILITY_API_BASE_URL=https://api.availity.com/availity/development-partner/v1
VITE_BACKEND_URL=http://localhost:3001
SERVER_PORT=3001
```

## Step 2: Test API Connection

Run the test script with a coverage ID:

```bash
npm run test:api YOUR_COVERAGE_ID
```

Example:
```bash
npm run test:api 6364793487228928
```

This will:
1. Test the token endpoint
2. Test the coverage endpoint
3. Show you the exact curl command to test manually

## Step 3: Check Backend Server Logs

When running the backend server, you should see logs like:

```
Backend server running on http://localhost:3001
CORS enabled for all origins
```

When making a request:
```
[GET /api/coverages/123456] Making request to Availity...
[GET /api/coverages/123456] Response status: 200
[GET /api/coverages/123456] Success
```

If you see errors, they will be logged here.

## Step 4: Test with cURL

The UI generates a cURL command when there's an error. You can copy and test it:

```bash
curl --request GET \
  --url https://api.availity.com/availity/development-partner/v1/coverages/YOUR_ID \
  --header 'Authorization: Bearer YOUR_TOKEN' \
  --header 'accept: application/json'
```

## Common Issues

### Issue 1: CORS Error in Browser
**Solution**: Make sure the backend server is running on port 3001

```bash
npm run server
# or
npm run dev:all
```

### Issue 2: 401 Unauthorized
**Solution**: Check your API credentials in `.env` file

### Issue 3: 404 Not Found
**Solution**: Verify the coverage ID exists in Availity's system

### Issue 4: Backend Server Not Running
**Symptom**: Frontend shows connection refused
**Solution**: Start the backend server

```bash
# Terminal 1
npm run server

# Terminal 2
npm run dev
```

Or run both together:
```bash
npm run dev:all
```

## API Endpoint Flow

Here's how the request flows:

1. **Frontend** → POST `http://localhost:3001/api/token`
   - Gets access token

2. **Backend** → POST `https://api.availity.com/availity/v1/token`
   - Forwards to Availity
   - Returns token to frontend

3. **Frontend** → GET `http://localhost:3001/api/coverages/{id}`
   - Sends token in Authorization header

4. **Backend** → GET `https://api.availity.com/availity/development-partner/v1/coverages/{id}`
   - Forwards to Availity
   - Returns coverage data to frontend

## Verifying the cURL Command

The cURL command generated should match this format:

```bash
curl --request GET \
  --url https://api.availity.com/availity/development-partner/v1/coverages/{COVERAGE_ID} \
  --header 'Authorization: Bearer {ACCESS_TOKEN}' \
  --header 'accept: application/json'
```

Key points:
- ✅ URL should be `/coverages/{id}` (singular)
- ✅ Method is GET
- ✅ Headers include Authorization with Bearer token
- ✅ Headers include accept: application/json

## Still Not Working?

Check:
1. Is the backend server running? (`npm run server`)
2. Is the frontend connecting to the right backend URL? (Check browser console)
3. Are the API credentials correct? (Test with `npm run test:api`)
4. Does the coverage ID exist? (Try with a known valid ID)
