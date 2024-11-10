export interface Theme {
  id: string;
  name: string;
  weight: number;
}

export interface DaySchedule {
  minutes: number;
  dayOfWeek: number;
}

export interface ScheduleInput {
  themes: Theme[];
  availableTime: DaySchedule[];
  startDate: string;
  deadline: string;
  settings: StudySettings;
}

export interface ScheduleOutput {
  date: string;
  dayOfWeek: number;
  themes: {
    themeName: string;
    minutes: number;
  }[];
}

export type Language = 'en' | 'pt';

export interface StudySettings {
  minMinutes: number;
  maxMinutes: number;
}

export interface TranslationKey {
  en: string;
  pt: string;
}