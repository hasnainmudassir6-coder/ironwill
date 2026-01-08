import React, { useState } from 'react';
import { Button, Card, SectionHeader } from '../components/StrictUI';
import { DailyEntry } from '../types';
import { saveEntry } from '../services/storageService';

interface Props {
    latestEntry: DailyEntry;
    onComplete: () => void;
}

export const Shutdown: React.FC<Props> = ({ latestEntry, onComplete }) => {
    const [q1, setQ1] = useState<boolean | null>(null);
    const [q2, setQ2] = useState<boolean | null>(null);
    const [q3, setQ3] = useState('');

    const handleSave = () => {
        const updated: DailyEntry = {
            ...latestEntry,
            shutdownRespectedTime: q1 || false,
            shutdownAvoidedStupidity: q2 || false,
            shutdownMustNotRepeat: q3
        };
        saveEntry(updated);
        onComplete();
    };

    return (
        <div className="p-6 h-screen flex flex-col justify-center bg-black">
            <SectionHeader title="Daily Shutdown Ritual" />
            <p className="text-gray-500 text-xs mb-8 uppercase tracking-widest">Close the loop. Truth only.</p>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm mb-2">1. Did I respect my time today?</label>
                    <div className="flex gap-2">
                        <Button variant={q1 === true ? 'primary' : 'outline'} onClick={() => setQ1(true)} className="flex-1">Yes</Button>
                        <Button variant={q1 === false ? 'primary' : 'outline'} onClick={() => setQ1(false)} className="flex-1">No</Button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm mb-2">2. Did I avoid obvious stupidity?</label>
                    <div className="flex gap-2">
                        <Button variant={q2 === true ? 'primary' : 'outline'} onClick={() => setQ2(true)} className="flex-1">Yes</Button>
                        <Button variant={q2 === false ? 'primary' : 'outline'} onClick={() => setQ2(false)} className="flex-1">No</Button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm mb-2">3. What must NOT repeat tomorrow?</label>
                    <input 
                        type="text" 
                        value={q3}
                        onChange={(e) => setQ3(e.target.value)}
                        className="w-full bg-surface border border-dim p-3 text-white"
                        placeholder="One line..."
                    />
                </div>
            </div>

            <div className="mt-12">
                <Button full disabled={q1 === null || q2 === null || !q3} onClick={handleSave}>
                    Finalize Day
                </Button>
            </div>
        </div>
    );
};
