import React from 'react';
import { 
  PieChart, 
  Activity, 
  BarChart3 
} from 'lucide-react';
import { Habit, Task, ScheduleBlock } from '../types';

interface AnalyticsViewProps {
  habits: Habit[];
  tasks: Task[];
  scheduleBlocks: ScheduleBlock[];
  syncScore: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  habits,
  tasks,
  scheduleBlocks,
  syncScore
}) => {
  const workBlocks = scheduleBlocks.filter(b => b.category === 'Work').length;
  const healthBlocks = scheduleBlocks.filter(b => b.category === 'Health').length;
  const mindBlocks = scheduleBlocks.filter(b => b.category === 'Mind').length;
  const total = scheduleBlocks.length || 1;

  const workPct = Math.round((workBlocks / total) * 100);
  const healthPct = Math.round((healthBlocks / total) * 100);
  const mindPct = Math.round((mindBlocks / total) * 100);

  // Circular segments calculations for the Time Allocation chart
  const strokeOffsetWork = 0;
  const strokeOffsetHealth = -workPct;
  const strokeOffsetMind = -(workPct + healthPct);

  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-page">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Time & Sync Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">Biometric diagnostic analysis across sleep-wake and work timelines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* KPI Block: Dynamic Donut Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-600" />
              Dynamic Time Partitioning
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Ratio distribution of active timeline elements</p>
          </div>

          <div className="my-6 flex justify-center items-center">
            <div className="relative flex items-center justify-center">
              <svg width="160" height="160" viewBox="0 0 42 42" className="transform -rotate-90">
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="4.5"></circle>
                
                {/* Work - Indigo-600 */}
                {workPct > 0 && (
                  <circle 
                    cx="21" 
                    cy="21" 
                    r="15.915" 
                    fill="transparent" 
                    stroke="#4f46e5" 
                    strokeWidth="4.5" 
                    strokeDasharray={`${workPct} ${100 - workPct}`} 
                    strokeDashoffset={strokeOffsetWork}
                    className="transition-all duration-500"
                  />
                )}

                {/* Health - Amber-500 */}
                {healthPct > 0 && (
                  <circle 
                    cx="21" 
                    cy="21" 
                    r="15.915" 
                    fill="transparent" 
                    stroke="#f59e0b" 
                    strokeWidth="4.5" 
                    strokeDasharray={`${healthPct} ${100 - healthPct}`} 
                    strokeDashoffset={strokeOffsetHealth}
                    className="transition-all duration-500"
                  />
                )}

                {/* Mind - Emerald-500 */}
                {mindPct > 0 && (
                  <circle 
                    cx="21" 
                    cy="21" 
                    r="15.915" 
                    fill="transparent" 
                    stroke="#10b981" 
                    strokeWidth="4.5" 
                    strokeDasharray={`${mindPct} ${100 - mindPct}`} 
                    strokeDashoffset={strokeOffsetMind}
                    className="transition-all duration-500"
                  />
                )}
              </svg>
              <div className="absolute text-center">
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest block">Blocks</span>
                <span className="text-xs font-mono font-bold text-slate-700">{scheduleBlocks.length} Mapped</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-650">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded bg-indigo-600"></div>
                <span>Work focus Block</span>
              </div>
              <span className="font-mono font-bold text-slate-700">{workPct}%</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-650">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded bg-amber-500"></div>
                <span>Bio-Energy / Health</span>
              </div>
              <span className="font-mono font-bold text-slate-700">{healthPct}%</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-650">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded bg-emerald-550 bg-emerald-500"></div>
                <span>Mind / Recovery</span>
              </div>
              <span className="font-mono font-bold text-slate-700">{mindPct}%</span>
            </div>
          </div>
        </div>

        {/* KPI Block: Cognitive balance */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Cognitive Load Execution
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Task completion ratio tracking comparisons</p>
          </div>

          <div className="my-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Completed Tasks</span>
                <span className="font-bold text-slate-700">{completedTasks}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${tasks.length ? (completedTasks / tasks.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Active Priorities</span>
                <span className="font-bold text-slate-700">{pendingTasks}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                  style={{ width: `${tasks.length ? (pendingTasks / tasks.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-100 p-3.5 text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-800 block mb-0.5">Efficiency Rating</span>
            {completedTasks >= pendingTasks ? (
              'Excellent positive momentum. Your focused deep sessions are producing consistent output.'
            ) : (
              'System overload risk. Pivot administrative tasks to lower-energy afternoon loops.'
            )}
          </div>
        </div>

        {/* KPI Block: Circadian score gauge */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" />
              Circadian Lock Diagnostics
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Stability assessment across biometric parameters</p>
          </div>

          <div className="my-6 flex justify-center items-center">
            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="54" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="54" 
                  stroke="#4f46e5" 
                  strokeWidth="6" 
                  strokeDasharray="339.2" 
                  strokeDashoffset={339.2 - (339.2 * (syncScore / 100))}
                  fill="transparent" 
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute text-center bg-white p-2 rounded-full shadow-sm border border-slate-105">
                <span className="text-3xl font-black text-slate-800">{syncScore}%</span>
                <span className="text-[9px] uppercase font-bold text-slate-400 block mt-0.5">Index</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Circadian balance stability</span>
              <span className="font-bold text-slate-700">
                {syncScore >= 80 ? 'Optimal' : syncScore >= 60 ? 'Unbalanced' : 'Critical Reset Required'}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Adenosine clearance buffer</span>
              <span className="font-bold text-slate-755 font-semibold text-slate-700">Active</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
