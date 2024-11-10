import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Theme, Language } from '../types';
import { translations } from '../i18n/translations';

interface ThemeInputProps {
  themes: Theme[];
  setThemes: React.Dispatch<React.SetStateAction<Theme[]>>;
  language: Language;
}

export function ThemeInput({ themes, setThemes, language }: ThemeInputProps) {
  const t = (key: keyof typeof translations.scheduler) => translations.scheduler[key][language];

  const addTheme = () => {
    setThemes([...themes, { id: crypto.randomUUID(), name: '', weight: 1 }]);
  };

  const removeTheme = (id: string) => {
    setThemes(themes.filter(theme => theme.id !== id));
  };

  const updateTheme = (id: string, field: keyof Theme, value: string | number) => {
    setThemes(themes.map(theme => 
      theme.id === id ? { ...theme, [field]: value } : theme
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">{t('studyThemes')}</h2>
        <button
          onClick={addTheme}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
        >
          <Plus size={16} />
          {t('addTheme')}
        </button>
      </div>
      
      <div className="space-y-3">
        {themes.map(theme => (
          <div key={theme.id} className="flex gap-3 items-center">
            <input
              type="text"
              value={theme.name}
              onChange={(e) => updateTheme(theme.id, 'name', e.target.value)}
              placeholder={t('themeName')}
              className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <div className="flex flex-col w-20">
              <label className="text-xs text-gray-500 mb-1">
                {t('importance')}
              </label>
              <input
                type="number"
                value={theme.weight}
                onChange={(e) => updateTheme(theme.id, 'weight', Number(e.target.value))}
                min="1"
                max="10"
                title={t('importance')}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={() => removeTheme(theme.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              aria-label={`Remove ${theme.name}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}