export const APP_NAME = "IRONWILL OS";

export const GOOGLE_SHEETS_CONFIG = {
  // In a real app, these would be env vars or auth tokens
  spreadsheetId: "YOUR_SHEET_ID_HERE", 
};

export const EXCUSE_OPTIONS = [
  "Tired", "Bored", "Distracted", "Emotional", "No excuse"
];

export const PROTEIN_OPTIONS = ["Low", "Medium", "High"];

// We define the structure of the daily form here to keep it dynamic
export const DAILY_QUESTIONS = [
  { id: 'namaz', label: 'Namaz Prayed (0-5)', type: 'number', min: 0, max: 5 },
  { id: 'studyMinutes', label: 'Study Minutes', type: 'number' },
  { id: 'bookMinutes', label: 'Reading Minutes', type: 'number' },
  { id: 'newspaper', label: 'Read Newspaper?', type: 'boolean' },
  { id: 'exercise', label: 'Exercise Done?', type: 'boolean' },
  { id: 'protein', label: 'Protein Intake', type: 'select', options: ['low', 'medium', 'high'] },
  { id: 'waterLiters', label: 'Water (Liters)', type: 'number', step: 0.1 },
  { id: 'skincare', label: 'Skincare Routine?', type: 'boolean' },
  { id: 'screenTimeMinutes', label: 'Total Screen Time (min)', type: 'number' },
  { id: 'instagramMinutes', label: 'Instagram Minutes', type: 'number' },
  { id: 'youtubeMinutes', label: 'YouTube Minutes', type: 'number' },
  { id: 'businessWork', label: 'Business Work Done?', type: 'boolean' },
  { id: 'minutesConsumed', label: 'Passive Consumption (min)', type: 'number' },
  { id: 'minutesCreated', label: 'Active Creation (min)', type: 'number' },
  { id: 'learnedToday', label: 'One thing learned today', type: 'text' },
  { id: 'deepThought', label: 'What did you think deeply about?', type: 'text' },
  { id: 'internalExcuse', label: 'Primary Excuse Today', type: 'select', options: ['Tired', 'Bored', 'Distracted', 'Emotional', 'No excuse'] },
  { id: 'goodDecision', label: 'One Good Decision', type: 'text' },
  { id: 'badDecision', label: 'One Bad Decision', type: 'text' },
  { id: 'badDecisionCost', label: 'Cost of Bad Decision', type: 'text', placeholder: 'Time / Money / Energy' },
  { id: 'diaryEntry', label: 'Diary / Reflection', type: 'textarea' },
  { id: 'mood', label: 'Mood (1-10)', type: 'number', min: 1, max: 10 },
];
