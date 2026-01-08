import { DailyEntry, UserSettings } from '../types';

const ENTRY_KEY = 'ironwill_entries';
const SETTINGS_KEY = 'ironwill_settings';

export const getEntries = (): DailyEntry[] => {
  try {
    const data = localStorage.getItem(ENTRY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveEntry = (entry: DailyEntry): void => {
  const entries = getEntries();
  // Update if exists (same day), else push
  const index = entries.findIndex(e => e.date === entry.date);
  if (index >= 0) {
    entries[index] = entry;
  } else {
    entries.push(entry);
  }
  localStorage.setItem(ENTRY_KEY, JSON.stringify(entries));
};

export const getLatestEntry = (): DailyEntry | null => {
  const entries = getEntries();
  if (entries.length === 0) return null;
  return entries.sort((a, b) => b.timestamp - a.timestamp)[0];
};

export const getSettings = (): UserSettings => {
  const defaultSettings: UserSettings = {
    name: 'User',
    startDate: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    streak: 0,
    isShutdownPending: false
  };
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : defaultSettings;
  } catch (e) {
    return defaultSettings;
  }
};

export const saveSettings = (settings: UserSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const calculateDisciplineScore = (entry: Partial<DailyEntry>): number => {
  let score = 0;
  const maxScore = 100;

  // Base Logic
  if (entry.namaz && entry.namaz === 5) score += 20;
  else if (entry.namaz) score += entry.namaz * 3;

  if (entry.exercise) score += 15;
  if (entry.studyMinutes && entry.studyMinutes > 60) score += 15;
  if (entry.bookMinutes && entry.bookMinutes > 15) score += 10;
  if (entry.screenTimeMinutes && entry.screenTimeMinutes < 120) score += 10;
  if (entry.businessWork) score += 10;
  
  // Penalties
  if (entry.instagramMinutes && entry.instagramMinutes > 30) score -= 10;
  if (entry.minutesConsumed && entry.minutesCreated) {
     const ratio = entry.minutesCreated / (entry.minutesCreated + entry.minutesConsumed || 1);
     if (ratio < 0.3) score -= 10;
  }

  return Math.max(0, Math.min(maxScore, score));
};
