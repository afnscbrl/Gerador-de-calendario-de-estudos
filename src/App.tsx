import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Theme, DaySchedule, ScheduleOutput, Language, StudySettings } from './types';
import { ThemeInput } from './components/ThemeInput';
import { WeeklySchedule } from './components/WeeklySchedule';
import { ScheduleDisplay } from './components/ScheduleDisplay';
import { LanguageToggle } from './components/LanguageToggle';
import { LandingPage } from './components/LandingPage';
import { StudySettingsInput } from './components/StudySettings';
import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentFailed } from './components/PaymentFailed';
import { translations } from './i18n/translations';
import { generateSchedule } from './utils/scheduler';

function MainApp() {
  const [showScheduler, setShowScheduler] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'pt' ? 'pt' : 'en') as Language;
  });

  const [themes, setThemes] = useState<Theme[]>([
    { id: crypto.randomUUID(), name: '', weight: 3 },
  ]);
  
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>([
    { dayOfWeek: 1, minutes: 240 },
    { dayOfWeek: 2, minutes: 180 },
    { dayOfWeek: 3, minutes: 240 },
    { dayOfWeek: 4, minutes: 180 },
    { dayOfWeek: 5, minutes: 120 },
  ]);
  
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  
  const [schedule, setSchedule] = useState<ScheduleOutput[]>([]);

  const [studySettings, setStudySettings] = useState<StudySettings>({
    minMinutes: 45,
    maxMinutes: 90
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const handleGenerate = () => {
    if (!themes.some(theme => theme.name.trim())) {
      alert('Please enter at least one theme name');
      return;
    }

    if (!weeklySchedule.some(day => day.minutes > 0)) {
      alert('Please set study time for at least one day');
      return;
    }

    const validThemes = themes.filter(theme => theme.name.trim());
    const generatedSchedule = generateSchedule({
      themes: validThemes,
      availableTime: weeklySchedule,
      startDate,
      deadline,
      settings: studySettings
    });
    setSchedule(generatedSchedule);
  };

  if (!showScheduler) {
    return (
      <>
        <LanguageToggle
          currentLang={language}
          onLanguageChange={setLanguage}
        />
        <LandingPage
          language={language}
          onGetStarted={() => setShowScheduler(true)}
        />
      </>
    );
  }

  const maxDate = new Date(startDate);
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <LanguageToggle
        currentLang={language}
        onLanguageChange={setLanguage}
      />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <CalendarIcon className="text-indigo-600" size={32} />
            {translations.scheduler.title[language]}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8 bg-white p-6 rounded-lg shadow-lg">
            <ThemeInput
              themes={themes}
              setThemes={setThemes}
              language={language}
            />
            
            <StudySettingsInput
              settings={studySettings}
              setSettings={setStudySettings}
              language={language}
            />
            
            <WeeklySchedule 
              schedule={weeklySchedule}
              setSchedule={setWeeklySchedule}
              language={language}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {translations.scheduler.startDate[language]}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {translations.scheduler.deadline[language]}
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={startDate}
                  max={maxDateStr}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <button
              onClick={handleGenerate}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <CalendarIcon size={20} />
              {translations.scheduler.generate[language]}
            </button>
          </div>

          <div className="lg:mt-0 mt-8">
            <ScheduleDisplay
              schedule={schedule}
              language={language}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/payment/success" element={<PaymentSuccess language="en" />} />
        <Route path="/payment/failed" element={<PaymentFailed language="en" />} />
      </Routes>
    </Router>
  );
}