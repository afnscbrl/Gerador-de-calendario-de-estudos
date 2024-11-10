import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../types';

interface LanguageToggleProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export function LanguageToggle({ currentLang, onLanguageChange }: LanguageToggleProps) {
  return (
    <div className="fixed top-4 right-4 flex items-center gap-2">
      <Globe size={20} className="text-gray-600" />
      <select
        value={currentLang}
        onChange={(e) => onLanguageChange(e.target.value as Language)}
        className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="en">English</option>
        <option value="pt">Português</option>
      </select>
    </div>
  );
}