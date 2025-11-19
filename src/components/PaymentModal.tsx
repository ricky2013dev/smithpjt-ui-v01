import React, { useState } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Patient } from '../types/patient';
import STRIPE_CONFIG from '../config/stripe';

// Load Stripe
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
}

interface CheckoutFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  amount: number;
  patientName: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onSuccess,
  onError,
  amount,
  patientName
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (err) {
      onError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Payment Details
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Patient: {patientName}
        </p>
        <p className="text-2xl font-bold text-primary mb-6">
          ${(amount / 100).toFixed(2)}
        </p>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <PaymentElement />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-primary/30 hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <span className="animate-spin material-symbols-outlined">refresh</span>
              Processing...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">credit_card</span>
              Pay ${(amount / 100).toFixed(2)}
            </>
          )}
        </button>
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
        <p className="flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-sm">lock</span>
          Secured by Stripe | Test Mode
        </p>
        <p className="mt-1">Use test card: 4242 4242 4242 4242 | Any future date | Any CVC</p>
      </div>
    </form>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, patient }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(5000); // Default $50.00
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const getFullName = () => {
    const given = patient.name.given.join(' ');
    return `${given} ${patient.name.family}`.trim();
  };

  const handleInitiatePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/payment/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          patientId: patient.id,
          patientName: getFullName(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate payment');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      onClose();
      // Reset state after modal closes
      setTimeout(() => {
        setPaymentSuccess(false);
        setClientSecret(null);
        setAmount(5000);
      }, 300);
    }, 2000);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Reset state after modal closes
      setTimeout(() => {
        setClientSecret(null);
        setError(null);
        setPaymentSuccess(false);
        setAmount(5000);
      }, 300);
    }
  };

  if (!isOpen) return null;

  const stripeOptions = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: 'stripe' as const,
        },
      }
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <span className="material-symbols-outlined text-primary text-2xl">payment</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Patient Payment
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {getFullName()} - ID: {patient.id}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {paymentSuccess ? (
            <div className="text-center py-8">
              <div className="rounded-full bg-status-green/10 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-status-green text-5xl">check_circle</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Payment Successful!
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                The payment has been processed successfully.
              </p>
            </div>
          ) : !clientSecret ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Payment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount / 100}
                    onChange={(e) => setAmount(Math.round(parseFloat(e.target.value) * 100))}
                    className="w-full pl-8 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter the amount to charge the patient
                </p>
              </div>

              {error && (
                <div className="p-4 bg-status-red/10 border border-status-red/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-status-red">error</span>
                    <div className="flex-1">
                      <p className="font-semibold text-status-red">Error</p>
                      <p className="text-sm text-status-red/80">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleInitiatePayment}
                disabled={isLoading || amount < 50}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-primary/30 hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin material-symbols-outlined">refresh</span>
                    Initializing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">payment</span>
                    Continue to Payment
                  </>
                )}
              </button>

              {amount < 50 && (
                <p className="text-xs text-status-orange text-center">
                  Minimum payment amount is $0.50
                </p>
              )}
            </div>
          ) : (
            <Elements stripe={stripePromise} options={stripeOptions}>
              <CheckoutForm
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                amount={amount}
                patientName={getFullName()}
              />
            </Elements>
          )}

          {error && clientSecret && (
            <div className="mt-4 p-4 bg-status-red/10 border border-status-red/20 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-status-red">error</span>
                <div className="flex-1">
                  <p className="font-semibold text-status-red">Payment Failed</p>
                  <p className="text-sm text-status-red/80">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
