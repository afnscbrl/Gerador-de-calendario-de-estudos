import React from 'react';
import { Clock } from 'lucide-react';
import { StudySettings, Language } from '../types';
import { translations } from '../i18n/translations';

interface StudySettingsProps {
  settings: StudySettings;
  setSettings: React.Dispatch<React.SetStateAction<StudySettings>>;
  language: Language;
}

export function StudySettingsInput({ settings, setSettings, language }: StudySettingsProps) {
  const t = (key: keyof typeof translations.scheduler) => translations.scheduler[key][language];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <Clock className="text-indigo-600" size={20} />
        {t('studySettings')}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('minMinutes')}
          </label>
          <input
            type="number"
            value={settings.minMinutes}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              minMinutes: Math.min(Number(e.target.value), settings.maxMinutes)
            }))}
            min="15"
            max={settings.maxMinutes}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('maxMinutes')}
          </label>
          <input
            type="number"
            value={settings.maxMinutes}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              maxMinutes: Math.max(Number(e.target.value), settings.minMinutes)
            }))}
            min={settings.minMinutes}
            max="180"
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}