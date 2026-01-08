import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { DailyEntry } from '../types';
import { Card, Metric, SectionHeader, AlertBanner } from '../components/StrictUI';

interface Props {
  entries: DailyEntry[];
}

export const Dashboard: React.FC<Props> = ({ entries }) => {
  const today = entries[0]; // Assumes sorted desc
  const history = [...entries].reverse().slice(-7); // Last 7 days for charts

  if (!today) {
      return <div className="p-8 text-center text-gray-500">NO DATA LOGGED TODAY.</div>;
  }

  // Time Integrity Check
  const timeIntegrityLow = today.timeIntegrityScore < 60;

  return (
    <div className="p-4 pb-24 space-y-6">
      
      {/* HEADER STATUS */}
      <div className="flex justify-between items-end border-b border-dim pb-4">
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest">Pressure Level</div>
          <div className={`text-xl font-bold font-mono tracking-widest ${
              today.pressureLevel === 'HIGH' ? 'text-alert' : today.pressureLevel === 'MEDIUM' ? 'text-yellow-500' : 'text-success'
          }`}>
            {today.pressureLevel || 'CALIBRATING'}
          </div>
        </div>
        <div className="text-right">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Discipline Score</div>
            <div className="text-3xl font-bold text-white">{today.disciplineScore}</div>
        </div>
      </div>

      {/* DAILY DIRECTIVE */}
      <div className="bg-surface border-l-4 border-primary p-4">
          <div className="text-[10px] text-primary uppercase tracking-widest mb-1">Today's Direction</div>
          <p className="font-mono text-sm leading-relaxed">
            "{today.todaysDirection || 'Submit log to generate direction.'}"
          </p>
      </div>

      {timeIntegrityLow && (
          <AlertBanner message="TIME INTEGRITY CRITICAL. Dashboard visibility reduced." />
      )}

      {/* CORE STATS GRID */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
            <Metric label="Study" value={`${Math.floor(today.studyMinutes / 60)}h ${today.studyMinutes % 60}m`} />
        </Card>
        <Card>
            <Metric 
                label="Screen Time" 
                value={`${Math.floor(today.screenTimeMinutes / 60)}h ${today.screenTimeMinutes % 60}m`} 
                trend={today.screenTimeMinutes > 180 ? 'down' : 'up'}
            />
        </Card>
        <Card>
            <Metric label="Creation Ratio" value={((today.minutesCreated / (today.minutesCreated + today.minutesConsumed || 1)) * 100).toFixed(0) + '%'} />
        </Card>
         <Card>
            <Metric label="Namaz" value={`${today.namaz}/5`} />
        </Card>
      </div>

      {/* AI ANALYSIS */}
      <SectionHeader title="Tactical Analysis" />
      <div className="space-y-4">
        <Card title="Directives (Strict)">
            <ul className="list-decimal pl-4 space-y-2 text-sm text-gray-300">
                {today.aiDirectives?.map((d, i) => <li key={i}>{d}</li>) || <li>No directives generated.</li>}
            </ul>
        </Card>
        <Card title="Learning Assignment">
            <p className="text-sm text-primary underline">{today.aiLearning || "None assigned."}</p>
        </Card>
        <Card title="Identity Match">
             <div className="flex items-center justify-between">
                <span className="text-xs uppercase text-gray-400">Weakness Detected:</span>
                <span className="text-sm text-alert">{today.visibleWeakness || "None"}</span>
             </div>
        </Card>
      </div>

      {/* WEEKLY TRENDS */}
      {!timeIntegrityLow && (
          <>
            <SectionHeader title="Weekly Arc" />
            <div className="h-48 w-full bg-surface border border-dim p-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={history}>
                        <XAxis dataKey="date" tick={{fontSize: 10}} stroke="#333" />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#000', border: '1px solid #333'}} 
                            itemStyle={{color: '#fff', fontSize: '12px'}}
                        />
                        <Bar dataKey="disciplineScore" fill="#333" stroke="#fff" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="text-center text-[10px] text-gray-500 mt-2 uppercase">Discipline Score (Last 7 Days)</div>
          </>
      )}

      {/* REALITY CHECK */}
      <Card className="border-red-900 bg-red-900/10 mt-8">
          <h3 className="text-red-500 text-xs uppercase font-bold mb-2">Reality Check</h3>
          <p className="text-xs text-red-200">
             "At your current pace of {today.studyMinutes} mins/day, you are underperforming elite performers by 41%."
          </p>
      </Card>

    </div>
  );
};
