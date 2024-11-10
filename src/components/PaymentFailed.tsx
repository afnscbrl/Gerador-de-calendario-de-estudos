import React from 'react';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { Link } from 'react-router-dom';

interface PaymentFailedProps {
  language: Language;
}

export function PaymentFailed({ language }: PaymentFailedProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {translations.payment.failed.title[language]}
        </h1>
        <p className="text-gray-600 mb-8">
          {translations.payment.failed.description[language]}
        </p>
        <div className="space-y-4">
          <button 
            onClick={() => window.history.back()}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            {translations.payment.failed.tryAgain[language]}
          </button>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            {translations.payment.failed.backHome[language]}
          </Link>
        </div>
      </div>
    </div>
  );
}