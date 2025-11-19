// Stripe Configuration
// Using test mode API keys - Replace with your actual Stripe test keys

export const STRIPE_CONFIG = {
  // Stripe Publishable Key (test mode)
  // Get your test keys from: https://dashboard.stripe.com/test/apikeys
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51QUxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',

  // Default currency
  currency: 'usd',

  // Payment configuration
  paymentMethods: ['card'],

  // Test mode flag
  testMode: true
};

export default STRIPE_CONFIG;
