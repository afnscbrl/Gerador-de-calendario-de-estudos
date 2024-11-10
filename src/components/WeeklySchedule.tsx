import React from 'react';
import { Clock } from 'lucide-react';
import { DaySchedule, Language } from '../types';
import { translations } from '../i18n/translations';

interface WeeklyScheduleProps {
  schedule: DaySchedule[];
  setSchedule: React.Dispatch<React.SetStateAction<DaySchedule[]>>;
  language: Language;
}

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export function WeeklySchedule({ schedule, setSchedule, language }: WeeklyScheduleProps) {
  const updateMinutes = (dayOfWeek: number, hours: number) => {
    const minutes = Math.max(0, Math.round(hours * 60));
    setSchedule(prev => {
      const newSchedule = prev.filter(day => day.dayOfWeek !== dayOfWeek);
      if (minutes > 0) {
        newSchedule.push({ dayOfWeek, minutes });
      }
      return newSchedule;
    });
  };

  const getHoursForDay = (dayOfWeek: number): number => {
    const day = schedule.find(s => s.dayOfWeek === dayOfWeek);
    return day ? Math.round((day.minutes / 60) * 100) / 100 : 0;
  };

  const t = (key: keyof typeof translations.scheduler) => translations.scheduler[key][language];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">{t('availableHours')}</h2>
      <div className="grid grid-cols-7 gap-3">
        {DAYS.map((day, index) => (
          <div key={day} className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              {translations.scheduler.days[day][language].slice(0, 3)}
            </label>
            <div className="relative">
              <input
                type="number"
                value={getHoursForDay(index)}
                onChange={(e) => updateMinutes(index, Number(e.target.value))}
                min="0"
                max="24"
                step="0.5"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}