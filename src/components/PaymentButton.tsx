import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Mail } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentButtonProps {
  email: string;
  language: Language;
  schedule: any; // Replace with proper type
}

export function PaymentButton({ email, language, schedule }: PaymentButtonProps) {
  const navigate = useNavigate();
  const t = (key: keyof typeof translations.scheduler) => translations.scheduler[key][language];

  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          schedule,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const session = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      navigate('/payment/failed');
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] font-medium flex items-center justify-center gap-2"
    >
      <Mail size={20} />
      {t('sendSchedule')}
    </button>
  );
}