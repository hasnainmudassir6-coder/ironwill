export type PressureLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type Direction = 'UPWARD' | 'FLAT' | 'DECLINING';

export interface DailyEntry {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  timestamp: number;

  // Core Metrics
  namaz: number; // 0-5
  studyMinutes: number;
  bookMinutes: number;
  newspaper: boolean;
  exercise: boolean;
  protein: 'low' | 'medium' | 'high';
  waterLiters: number;
  skincare: boolean;
  
  // Time & Focus
  screenTimeMinutes: number;
  instagramMinutes: number;
  youtubeMinutes: number;
  businessWork: boolean;
  
  // Reflection
  learnedToday: string;
  diaryEntry: string;
  mood: number; // 1-10
  
  // Specific Modules
  visibleWeakness?: string;
  visibleStrength?: string;
  photoBase64?: string; // Identity Tracking
  
  // Decision Log
  goodDecision: string;
  badDecision: string;
  badDecisionCost: string; // Time/Energy/Money

  // Consumption vs Creation
  minutesConsumed: number;
  minutesCreated: number;

  // Thinking
  deepThought: string;
  internalExcuse: string; // Tired, Bored, etc.

  // Shutdown
  shutdownRespectedTime?: boolean;
  shutdownAvoidedStupidity?: boolean;
  shutdownMustNotRepeat?: string;

  // Calculated / AI
  disciplineScore: number;
  timeIntegrityScore: number;
  aiFeedback?: string;
  aiDirectives?: string[]; // 3 strict points
  aiLearning?: string;
  pressureLevel?: PressureLevel;
  todaysDirection?: string;
}

export interface UserSettings {
  name: string;
  startDate: string;
  lastLogin: string;
  streak: number;
  isShutdownPending: boolean;
}
