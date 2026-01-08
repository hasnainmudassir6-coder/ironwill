import { DailyEntry } from '../types';

// In a real app, this would use the Google Sheets API via a backend proxy to protect secrets.
// For this client-side demo, we simulate the sync and log the payload.

export const syncEntryToSheets = async (entry: DailyEntry): Promise<boolean> => {
  console.log("--- SYNCING TO GOOGLE SHEETS ---");
  
  // Format data as a row
  const rowData = [
    entry.date,
    entry.namaz,
    entry.studyMinutes,
    entry.bookMinutes,
    entry.newspaper,
    entry.exercise,
    entry.protein,
    entry.waterLiters,
    entry.skincare,
    entry.screenTimeMinutes,
    entry.instagramMinutes,
    entry.youtubeMinutes,
    entry.businessWork,
    entry.minutesCreated,
    entry.minutesConsumed,
    entry.learnedToday,
    entry.diaryEntry,
    entry.mood,
    entry.disciplineScore,
    entry.goodDecision,
    entry.badDecision,
    entry.internalExcuse
  ];

  // Simulation of network request
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Payload synced:", rowData);
      // In production: POST /api/sync-sheets { row: rowData }
      resolve(true);
    }, 1000);
  });
};
