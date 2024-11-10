import { ScheduleInput, ScheduleOutput, Theme, DaySchedule } from '../types';

interface ThemeWithStatus extends Theme {
  lastStudied: string | null;
}

export function generateSchedule(input: ScheduleInput): ScheduleOutput[] {
  const { themes, availableTime, startDate, deadline, settings } = input;
  const schedule: ScheduleOutput[] = [];
  
  // Ensure we have valid themes
  if (!themes.length) return schedule;
  
  let themesWithStatus: ThemeWithStatus[] = themes.map(theme => ({
    ...theme,
    lastStudied: null
  }));
  
  const startDateTime = new Date(startDate);
  const deadlineDate = new Date(deadline);
  const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - startDateTime.getTime()) / (1000 * 60 * 60 * 24));
  
  for (let i = 0; i < daysUntilDeadline; i++) {
    const currentDate = new Date(startDateTime);
    currentDate.setDate(currentDate.getDate() + i);
    const dayOfWeek = currentDate.getDay();
    const currentDateStr = currentDate.toISOString().split('T')[0];
    
    const daySchedule = availableTime.find(day => day.dayOfWeek === dayOfWeek);
    if (!daySchedule || daySchedule.minutes === 0) continue;
    
    const dailyThemes = distributeMinutesWithConstraints(
      themesWithStatus,
      daySchedule.minutes,
      currentDateStr,
      settings
    );
    
    if (dailyThemes.some(theme => theme.minutes > 0)) {
      dailyThemes.forEach(({ themeName, minutes }) => {
        if (minutes > 0) {
          const themeIndex = themesWithStatus.findIndex(t => t.name === themeName);
          if (themeIndex !== -1) {
            themesWithStatus[themeIndex].lastStudied = currentDateStr;
          }
        }
      });
      
      schedule.push({
        date: currentDateStr,
        dayOfWeek,
        themes: dailyThemes
      });
    }
  }
  
  return schedule;
}

function distributeMinutesWithConstraints(
  themes: ThemeWithStatus[],
  totalMinutes: number,
  currentDate: string,
  settings: { minMinutes: number; maxMinutes: number }
): { themeName: string; minutes: number; }[] {
  let remainingMinutes = totalMinutes;
  const result: { themeName: string; minutes: number; }[] = [];
  
  const sortedThemes = [...themes].sort((a, b) => {
    if (!a.lastStudied && b.lastStudied) return -1;
    if (a.lastStudied && !b.lastStudied) return 1;
    if (a.lastStudied === b.lastStudied) return b.weight - a.weight;
    return a.lastStudied! < b.lastStudied! ? -1 : 1;
  });
  
  for (const theme of sortedThemes) {
    if (remainingMinutes < settings.minMinutes) break;
    
    const minutes = Math.min(settings.maxMinutes, Math.max(settings.minMinutes, 
      (theme.weight / Math.max(...themes.map(t => t.weight))) * settings.maxMinutes
    ));
    
    if (remainingMinutes >= minutes) {
      result.push({
        themeName: theme.name,
        minutes: Math.round(minutes)
      });
      remainingMinutes -= minutes;
    }
  }
  
  // Add remaining themes with 0 minutes
  themes.forEach(theme => {
    if (!result.find(r => r.themeName === theme.name)) {
      result.push({
        themeName: theme.name,
        minutes: 0
      });
    }
  });
  
  return result;
}