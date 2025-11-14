# Backend Proxy Server

This is a Node.js/Express backend server that acts as a proxy between the frontend and the Availity API to solve CORS issues.

## Why Backend Server?

When calling external APIs directly from the browser, you may encounter CORS (Cross-Origin Resource Sharing) errors. The backend server solves this by:

1. Receiving requests from the frontend (same origin, no CORS)
2. Making API calls to Availity (server-to-server, no CORS)
3. Returning the response to the frontend

## Setup

The backend is already configured. Just make sure your `.env` file has the required credentials:

```env
VITE_AVAILITY_CLIENT_ID=your_client_id
VITE_AVAILITY_CLIENT_SECRET=your_client_secret
VITE_AVAILITY_API_TOKEN_URL=https://api.availity.com/availity/v1/token
VITE_AVAILITY_API_BASE_URL=https://api.availity.com/availity/development-partner/v1

VITE_BACKEND_URL=http://localhost:3001
SERVER_PORT=3001
```

## Running the Server

### Option 1: Run backend and frontend separately

```bash
# Terminal 1 - Start backend server
npm run server

# Terminal 2 - Start frontend
npm run dev
```

### Option 2: Run both concurrently (Recommended)

```bash
npm run dev:all
```

This will start both the backend server (port 3001) and the frontend (port 5173) simultaneously.

## API Endpoints

The backend provides these proxy endpoints:

### POST /api/token
Get access token from Availity
- **Request**: No body needed
- **Response**: `{ access_token, token_type, expires_in }`

### GET /api/coverages/:id
Get coverage by ID
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Coverage data

### POST /api/coverages
Get coverages by Payer ID
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ payerId: "123456" }`
- **Response**: Coverages data

### GET /health
Health check endpoint
- **Response**: `{ status: "ok", message: "Server is running" }`

## Port Configuration

Default port is `3001`. You can change it by setting `SERVER_PORT` in your `.env` file.

## CORS

CORS is enabled for all origins to allow your frontend to communicate with the backend during development.
