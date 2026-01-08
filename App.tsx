import React, { useState, useEffect } from 'react';
import { DailyLog } from './pages/DailyLog';
import { Dashboard } from './pages/Dashboard';
import { Shutdown } from './pages/Shutdown';
import { getLatestEntry, getEntries, getSettings } from './services/storageService';
import { DailyEntry } from './types';
import { APP_NAME } from './constants';

type View = 'DASHBOARD' | 'LOG' | 'SHUTDOWN' | 'LOCKED';

// Helper to calculate streak based on consecutive days
const calculateCurrentStreak = (entries: DailyEntry[]): number => {
  if (entries.length === 0) return 0;
  
  // Sort descending by date string just to be safe
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  
  // Get Today and Yesterday in YYYY-MM-DD format (UTC)
  const today = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  const latest = sorted[0].date;

  // If the last entry isn't today or yesterday, the streak is broken
  if (latest !== today && latest !== yesterday) {
    return 0;
  }

  let streak = 1;
  
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = new Date(sorted[i].date);
    const prev = new Date(sorted[i+1].date);
    
    // Calculate difference in days
    const diffTime = Math.abs(current.getTime() - prev.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays === 1) {
      streak++;
    } else {
      break; // Streak broken (gap > 1 day)
    }
  }
  
  return streak;
};

export default function App() {
  const [view, setView] = useState<View>('DASHBOARD');
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    const data = getEntries();
    // Sort by timestamp descending
    data.sort((a, b) => b.timestamp - a.timestamp);
    setEntries(data);
    setStreak(calculateCurrentStreak(data));
    return data;
  };

  useEffect(() => {
    const data = loadData();
    const todayStr = new Date().toISOString().split('T')[0];
    const latest = data[0];

    // Anti-Escape Logic
    if (latest) {
      const lastDate = new Date(latest.date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays > 2) {
        setView('LOG'); // Force log if missed > 2 days
      } else if (latest.date === todayStr) {
         // Logged today, check shutdown
         const hour = new Date().getHours();
         if (hour >= 21 && !latest.shutdownMustNotRepeat) {
             setView('SHUTDOWN');
         } else {
             setView('DASHBOARD');
         }
      } else {
         // Hasn't logged today
         setView('LOG');
      }
    } else {
        // First time user
        setView('LOG');
    }
    
    setLoading(false);
  }, []);

  const handleLogComplete = () => {
    loadData();
    setView('DASHBOARD');
  };

  if (loading) return <div className="bg-void h-screen w-screen flex items-center justify-center text-dim font-mono tracking-widest">LOADING OS...</div>;

  return (
    <div className="min-h-screen bg-void text-gray-200 font-mono">
      {/* Top Bar */}
      <nav className="fixed top-0 w-full z-50 bg-void/90 backdrop-blur border-b border-dim px-4 py-3 flex justify-between items-center">
        <h1 className="text-sm font-bold tracking-widest">{APP_NAME}</h1>
        <div className="flex gap-4 text-[10px] uppercase text-gray-500">
           <span className={streak > 0 ? "text-success font-bold" : "text-gray-500"}>
             Streak: {streak}
           </span>
           <button onClick={() => setView('LOG')} className={view === 'LOG' ? 'text-white' : ''}>+ Log</button>
           <button onClick={() => setView('DASHBOARD')} className={view === 'DASHBOARD' ? 'text-white' : ''}>Dash</button>
        </div>
      </nav>

      <main className="pt-16 max-w-md mx-auto">
        {view === 'LOG' && <DailyLog onComplete={handleLogComplete} />}
        {view === 'DASHBOARD' && <Dashboard entries={entries} />}
        {view === 'SHUTDOWN' && entries[0] && (
            <Shutdown latestEntry={entries[0]} onComplete={handleLogComplete} />
        )}
      </main>
    </div>
  );
}