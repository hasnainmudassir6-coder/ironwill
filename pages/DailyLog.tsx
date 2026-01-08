import React, { useState, useEffect } from 'react';
import { DAILY_QUESTIONS, PROTEIN_OPTIONS, EXCUSE_OPTIONS } from '../constants';
import { Button, Card, SectionHeader } from '../components/StrictUI';
import { DailyEntry } from '../types';
import { calculateDisciplineScore, saveEntry } from '../services/storageService';
import { analyzeDailyLog, analyzeIdentity } from '../services/geminiService';
import { syncEntryToSheets } from '../services/sheetsService';

interface Props {
  onComplete: () => void;
}

export const DailyLog: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<DailyEntry>>({
    date: new Date().toISOString().split('T')[0],
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Group questions for better UX
  const groups = [
    { title: "Core Habits", ids: ['namaz', 'exercise', 'skincare', 'protein', 'waterLiters'] },
    { title: "Intellect", ids: ['studyMinutes', 'bookMinutes', 'newspaper', 'learnedToday'] },
    { title: "Time Audit", ids: ['screenTimeMinutes', 'instagramMinutes', 'youtubeMinutes', 'businessWork', 'minutesCreated', 'minutesConsumed'] },
    { title: "Psychology", ids: ['mood', 'internalExcuse', 'deepThought', 'goodDecision', 'badDecision', 'badDecisionCost', 'diaryEntry'] }
  ];

  const handleInputChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhotoPreview(base64);
        setFormData(prev => ({ ...prev, photoBase64: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    
    // 1. Calculate Local Scores
    const disciplineScore = calculateDisciplineScore(formData);
    const timeIntegrityScore = 100 - (Math.min(100, ((formData.minutesConsumed || 0) + (formData.instagramMinutes || 0)) / 2));
    
    // 2. AI Analysis
    let aiResults = {};
    if (formData.photoBase64) {
        // Parallel execution for speed
        const [logAnalysis, identityAnalysis] = await Promise.all([
             analyzeDailyLog(formData as DailyEntry),
             analyzeIdentity(formData.photoBase64, formData)
        ]);
        
        aiResults = {
            aiFeedback: logAnalysis.feedback,
            aiDirectives: logAnalysis.directives,
            aiLearning: logAnalysis.learning,
            todaysDirection: logAnalysis.todaysDirection,
            pressureLevel: logAnalysis.pressure,
            visibleWeakness: identityAnalysis.match ? "None detected" : identityAnalysis.observations,
            visibleStrength: identityAnalysis.match ? identityAnalysis.observations : "None detected"
        };
    } else {
        const logAnalysis = await analyzeDailyLog(formData as DailyEntry);
        aiResults = {
            aiFeedback: logAnalysis.feedback,
            aiDirectives: logAnalysis.directives,
            aiLearning: logAnalysis.learning,
            todaysDirection: logAnalysis.todaysDirection,
            pressureLevel: logAnalysis.pressure
        };
    }

    const finalEntry: DailyEntry = {
      ...formData as DailyEntry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      disciplineScore,
      timeIntegrityScore,
      ...aiResults
    };

    // 3. Save & Sync
    saveEntry(finalEntry);
    syncEntryToSheets(finalEntry);

    setIsAnalyzing(false);
    onComplete();
  };

  // Render Form Input Helper
  const renderInput = (q: any) => {
    const val = (formData as any)[q.id] || '';
    
    if (q.type === 'boolean') {
      return (
        <div className="flex gap-2">
          <button 
            onClick={() => handleInputChange(q.id, true)}
            className={`flex-1 p-3 border ${val === true ? 'bg-white text-black' : 'border-dim text-gray-500'}`}
          >YES</button>
          <button 
             onClick={() => handleInputChange(q.id, false)}
             className={`flex-1 p-3 border ${val === false ? 'bg-white text-black' : 'border-dim text-gray-500'}`}
          >NO</button>
        </div>
      );
    }
    
    if (q.type === 'select') {
       return (
         <select 
            value={val} 
            onChange={(e) => handleInputChange(q.id, e.target.value)}
            className="w-full bg-surface border border-dim p-3 text-white rounded-none"
         >
            <option value="">Select...</option>
            {q.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
         </select>
       );
    }
    
    if (q.type === 'textarea') {
        return (
            <textarea 
                value={val}
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                className="w-full bg-surface border border-dim p-3 text-white h-32 rounded-none"
                placeholder="..."
            />
        );
    }

    return (
      <input 
        type={q.type}
        value={val}
        min={q.min}
        max={q.max}
        step={q.step}
        onChange={(e) => handleInputChange(q.id, q.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
        className="w-full bg-surface border border-dim p-3 text-white rounded-none focus:border-primary outline-none"
      />
    );
  };

  // IDENTITY CHECK STEP
  if (step === -1) { // Special Step for Photo
     return (
        <div className="p-4 animate-fade-in">
            <SectionHeader title="Identity Verification" />
            <Card>
                <p className="mb-4 text-gray-400 text-sm">Upload today's photo. No filters. No angles. Just truth.</p>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="mb-4 text-sm" />
                {photoPreview && (
                    <img src={photoPreview} alt="Preview" className="w-full h-64 object-cover grayscale mb-4 border border-dim" />
                )}
            </Card>
            <Button full onClick={() => setStep(0)} disabled={!photoPreview}>Confirm Identity</Button>
        </div>
     );
  }

  const currentGroup = groups[step];

  if (isAnalyzing) {
      return (
          <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <h2 className="text-xl font-bold uppercase tracking-widest animate-pulse">Analyzing Pattern...</h2>
              <p className="text-xs text-gray-500 mt-2">Judging your discipline.</p>
          </div>
      );
  }

  return (
    <div className="p-4 pb-20">
      {step === 0 && <Button variant="outline" className="mb-4" onClick={() => setStep(-1)}>+ Upload Photo (Required)</Button>}
      
      <SectionHeader title={`${step + 1} / ${groups.length} : ${currentGroup.title}`} />
      
      {currentGroup.ids.map(id => {
        const q = DAILY_QUESTIONS.find(que => que.id === id);
        if (!q) return null;
        return (
          <div key={id} className="mb-6">
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">{q.label}</label>
            {renderInput(q)}
          </div>
        );
      })}

      <div className="flex gap-4 mt-8">
        {step > 0 && <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1">Back</Button>}
        {step < groups.length - 1 ? (
          <Button onClick={() => setStep(s => s + 1)} full={step === 0}>Next</Button>
        ) : (
          <Button onClick={handleSubmit} variant="danger" full>Submit Log</Button>
        )}
      </div>
    </div>
  );
};