import React, { useState } from 'react';
import { Calendar, Mail } from 'lucide-react';
import { ScheduleOutput, Language } from '../types';
import { translations } from '../i18n/translations';
import { PaymentButton } from './PaymentButton';

interface ScheduleDisplayProps {
  schedule: ScheduleOutput[];
  language: Language;
}

export function ScheduleDisplay({ schedule, language }: ScheduleDisplayProps) {
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  const t = (key: keyof typeof translations.scheduler) => translations.scheduler[key][language];

  if (!schedule.length) return null;

  const formatTime = (minutes: number): string => {
    if (minutes === 0) return '0h';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins ? ` ${mins}m` : ''}`;
  };

  const calculateTotalsByTheme = () => {
    const totals: { [key: string]: number } = {};
    schedule.forEach(day => {
      day.themes.forEach(theme => {
        totals[theme.themeName] = (totals[theme.themeName] || 0) + theme.minutes;
      });
    });
    return totals;
  };

  const getDayTotal = (themes: { themeName: string; minutes: number }[]): number => {
    return themes.reduce((total, theme) => total + theme.minutes, 0);
  };

  const totalsByTheme = calculateTotalsByTheme();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Calendar className="text-indigo-600" />
        {t('schedule')}
      </h2>

      {/* Theme Totals Summary Card */}
      <div className="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-medium text-gray-800 mb-4">{t('totalsByTheme')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(totalsByTheme).map(([theme, minutes]) => (
            <div key={theme} className="bg-white p-3 rounded-lg shadow-sm">
              <div className="font-medium text-gray-800">{theme}</div>
              <div className="text-indigo-600 font-semibold">{formatTime(minutes)}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Schedule Display - First 10 Days */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full min-w-max">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Theme</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Duration</th>
            </tr>
          </thead>
          <tbody>
            {schedule.slice(0, 10).map((day, dayIndex) => {
              const activeThemes = day.themes.filter(theme => theme.minutes > 0);
              const dayTotal = getDayTotal(day.themes);
              
              return activeThemes.map((theme, themeIndex) => (
                <tr 
                  key={`${day.date}-${themeIndex}`}
                  className={`${dayIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-t border-gray-100`}
                >
                  {themeIndex === 0 && (
                    <td 
                      className="px-4 py-3 text-gray-800"
                      rowSpan={activeThemes.length}
                    >
                      <div className="font-medium">
                        {new Date(day.date).toLocaleDateString(
                          language === 'pt' ? 'pt-BR' : 'en-US',
                          { weekday: 'long', month: 'long', day: 'numeric' }
                        )}
                      </div>
                      <div className="text-sm text-indigo-600 font-medium mt-1">
                        {formatTime(dayTotal)}
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {theme.themeName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatTime(theme.minutes)}
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>

      {/* Preview Disclaimer */}
      <div className="mb-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
        <p className="text-indigo-900 font-medium mb-1">{t('previewDisclaimer')}</p>
        <p className="text-indigo-700 text-sm">{t('previewNote')}</p>
      </div>

      {/* Email Input Section */}
      {!showEmailInput ? (
        <button
          onClick={() => setShowEmailInput(true)}
          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] font-medium flex items-center justify-center gap-2"
        >
          <Mail size={20} />
          {t('sendSchedule')}
        </button>
      ) : (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('emailInput')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <PaymentButton 
            email={email}
            language={language}
            schedule={schedule}
          />
        </form>
      )}
    </div>
  );
}