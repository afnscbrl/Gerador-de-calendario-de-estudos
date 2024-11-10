import React from 'react';
import { Calendar, Clock, FileSpreadsheet, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface LandingPageProps {
  language: Language;
  onGetStarted: () => void;
}

export function LandingPage({ language, onGetStarted }: LandingPageProps) {
  const t = (key: keyof typeof translations.landing) => translations.landing[key][language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16">
        <div className="text-center">
          <div className="inline-block animate-float">
            <Calendar size={64} className="text-indigo-600 mx-auto mb-6" />
          </div>
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto"
          >
            {t('cta')}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent"></div>
        <div className="max-w-6xl mx-auto px-4 relative">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            {t('features')}
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <Calendar size={48} className="text-indigo-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">{t('feature1')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('feature1Description')}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <Clock size={48} className="text-indigo-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">{t('feature2')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('feature2Description')}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <FileSpreadsheet size={48} className="text-indigo-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">{t('feature3')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('feature3Description')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            {t('howItWorks')}
          </h2>
          <div className="grid md:grid-cols-4 gap-12">
            {[t('step1'), t('step2'), t('step3'), t('step4')].map((step, index) => (
              <div key={index} className="relative group">
                <div className="absolute left-0 right-0 h-0.5 bg-indigo-200 top-5 -z-10 hidden md:block">
                  {index < 3 && <div className="absolute right-0 w-4 h-4 bg-indigo-200 rounded-full -mt-1.5"></div>}
                </div>
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-6 group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                <p className="text-lg text-gray-700 leading-relaxed group-hover:text-indigo-600 transition-colors">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}