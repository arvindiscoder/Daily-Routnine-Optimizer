import React from 'react';
import { 
  Sparkles, 
  Clock, 
  Check, 
  Play, 
  Pause, 
  Flame,
  Calendar,
  UserCheck,
  Plus,
  Trash2
} from 'lucide-react';
import { Habit, Task, ScheduleBlock, TabType, IdentityCheck } from '../types';

interface DashboardViewProps {
  habits: Habit[];
  toggleHabit: (id: string) => void;
  tasks: Task[];
  scheduleBlocks: ScheduleBlock[];
  syncScore: number;
  suggestions: { title: string; desc: string; color: string }[];
  timerActive: boolean;
  timerMinutes: number;
  timerSeconds: number;
  timerMode: 'focus' | 'shortBreak' | 'longBreak';
  toggleTimer: () => void;
  setCurrentTab: (tab: TabType) => void;
  identityChecks: IdentityCheck[];
  toggleIdentityCheck: (id: string) => void;
  handleAddIdentityCheck: (name: string, color?: string) => void;
  handleDeleteIdentityCheck: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  habits,
  toggleHabit,
  tasks,
  scheduleBlocks,
  syncScore,
  suggestions,
  timerActive,
  timerMinutes,
  timerSeconds,
  timerMode,
  toggleTimer,
  setCurrentTab,
  identityChecks,
  toggleIdentityCheck,
  handleAddIdentityCheck,
  handleDeleteIdentityCheck
}) => {
  const [newIdenName, setNewIdenName] = React.useState('');

  const handleIdenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdenName.trim()) return;
    handleAddIdentityCheck(newIdenName.trim());
    setNewIdenName('');
  };

  const completedHabits = habits.filter(h => h.completedToday).length;
  const habitPct = habits.length ? Math.round((completedHabits / habits.length) * 100) : 0;
  const openTasks = tasks.filter(t => !t.completed);

  // Focus timer background and stroke alignment
  const timerColorMap = {
    focus: 'stroke-indigo-600 text-indigo-600',
    shortBreak: 'stroke-emerald-500 text-emerald-500',
    longBreak: 'stroke-blue-500 text-blue-500'
  };

  const circumference = 314.15; // 2 * pi * r (where r = 50)
  const currentTotalSeconds = timerMode === 'focus' ? 1500 : timerMode === 'shortBreak' ? 300 : 900;
  const remainingSeconds = timerMinutes * 60 + timerSeconds;
  const strokeOffset = circumference - (circumference * (remainingSeconds / currentTotalSeconds));

  const syncColorText = 
    syncScore >= 80 ? 'text-emerald-600' : 
    syncScore >= 60 ? 'text-amber-600' : 'text-rose-600';

  const syncColorStroke = 
    syncScore >= 80 ? 'stroke-emerald-600' : 
    syncScore >= 60 ? 'stroke-amber-600' : 'stroke-rose-600';

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-page">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Daily Dashboard</h2>
          <p className="text-xs text-slate-500 mt-0.5">Keep track of your daily routine, habits, focus time, and goals.</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-xl self-start">
          <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
          <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-widest">Daily Sync</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Sync Score Gauge */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Flow Score</span>
            <span className={`text-3xl font-black block tracking-tight ${syncColorText}`}>{syncScore}%</span>
            <span className="text-[10px] text-slate-500 block font-medium">Daily balance score</span>
          </div>
          <div className="relative flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle cx="28" cy="28" r="23" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
              <circle 
                cx="28" 
                cy="28" 
                r="23" 
                className={`${syncColorStroke} transition-all duration-500`} 
                strokeWidth="4" 
                strokeDasharray="144.5" 
                strokeDashoffset={144.5 - (144.5 * (syncScore / 100))}
                fill="transparent" 
              />
            </svg>
            <span className="absolute text-[9px] font-black text-slate-400">Score</span>
          </div>
        </div>

        {/* KPI 2: Habit loop completion */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Habit Routine</span>
            <span className="text-3xl font-black text-indigo-600 block tracking-tight">{habitPct}%</span>
            <span className="text-[10px] text-slate-500 block font-medium">{completedHabits} of {habits.length} done</span>
          </div>
          <div className="relative flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle cx="28" cy="28" r="23" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
              <circle 
                cx="28" 
                cy="28" 
                r="23" 
                className="stroke-indigo-600 transition-all duration-500" 
                strokeWidth="4" 
                strokeDasharray="144.5" 
                strokeDashoffset={144.5 - (144.5 * (habitPct / 100))}
                fill="transparent" 
              />
            </svg>
            <span className="absolute text-[9px] font-black text-indigo-500">Habit</span>
          </div>
        </div>

        {/* KPI 3: Task count queue */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Tasks Left</span>
            <span className="text-3xl font-black text-blue-600 block tracking-tight">{openTasks.length}</span>
            <span className="text-[10px] text-slate-500 block font-medium">To-do steps remaining</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Timeline items */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Planned Blocks</span>
            <span className="text-3xl font-black text-emerald-600 block tracking-tight">{scheduleBlocks.length}</span>
            <span className="text-[10px] text-slate-500 block font-medium">Active routine intervals</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Focus Hub & Schedule Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Timeline (Col span 8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* AI suggestion alerts */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-3.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-800">Daily Routine Assistant</h3>
            </div>
            {suggestions.map((s, idx) => {
              // Convert dark classes to elegant light classes
              const lightColor = s.color.includes('amber') 
                ? 'border-amber-200 bg-amber-50 text-amber-900' 
                : s.color.includes('emerald')
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-indigo-200 bg-indigo-50 text-indigo-900';
              return (
                <div key={idx} className={`p-4 rounded-xl border ${lightColor} transition-all`}>
                  <h4 className="text-xs font-bold mb-0.5">{s.title}</h4>
                  <p className="text-[11px] leading-relaxed opacity-90">{s.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Core Identity Alignment System */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-950 tracking-tight flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-indigo-650" />
                  Your Core Identities
                </h3>
                <p className="text-[10px] text-slate-500">Connecting your habits to who you want to be helps them stick. Check off what you proved today!</p>
              </div>
              
              {/* Inline identity creator form */}
              <form onSubmit={handleIdenSubmit} className="flex gap-2 w-full sm:w-auto">
                <input 
                  type="text"
                  placeholder="e.g., A Prolific Writer"
                  value={newIdenName}
                  onChange={(e) => setNewIdenName(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 w-full sm:w-[160px]"
                />
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-2.5 flex items-center justify-center transition-colors cursor-pointer"
                  title="Add Custom Identity"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-1">
              {identityChecks.map((iden) => (
                <div 
                  key={iden.id} 
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    iden.provenToday 
                      ? 'bg-indigo-50/40 border-indigo-200/80 text-indigo-950' 
                      : 'bg-slate-50/50 border-slate-100/80 hover:border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <button 
                      onClick={() => toggleIdentityCheck(iden.id)}
                      className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all cursor-pointer ${
                        iden.provenToday 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-100' 
                          : 'bg-white border-slate-200 hover:border-slate-350 text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </button>
                    <div>
                      <span className={`text-xs font-semibold block leading-tight ${iden.provenToday ? 'text-indigo-950 font-bold' : 'text-slate-700'}`}>
                        {iden.identityName}
                      </span>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-405">
                        {iden.provenToday ? '✨ Proven Today' : '⏳ Untracked'}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleDeleteIdentityCheck(iden.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white transition-all cursor-pointer"
                    title="Remove Identity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              
              {identityChecks.length === 0 && (
                <div className="col-span-full text-center py-6">
                  <p className="text-xs text-slate-400 font-medium">Verify your life patterns. Define a custom identity above!</p>
                </div>
              )}
            </div>
          </div>

          {/* Active Day-Block Timeline Progression */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Schedule Sequence</h3>
              <button 
                onClick={() => setCurrentTab('optimizer')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                Edit Blocks
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="space-y-2.5">
              {scheduleBlocks.map((block) => (
                <div key={block.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-600">
                      {block.startTime} - {block.endTime}
                    </span>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">{block.title}</span>
                      <span className={`inline-block mt-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                        block.category === 'Work' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                        block.category === 'Health' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {block.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium hidden md:block max-w-[200px] truncate">{block.desc}</span>
                </div>
              ))}
              {scheduleBlocks.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-xs text-slate-400 font-medium">Timeline is vacant. Head over to Optimization to anchor blocks.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Focus / Pomodoro Mini Widget (Col span 4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Core Focus clock component */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest block mb-4">Focus Control</span>
            
            <div className="relative flex items-center justify-center mb-5">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle cx="72" cy="72" r="50" stroke="#f1f5f9" strokeWidth="5" fill="transparent" />
                <circle 
                  cx="72" 
                  cy="72" 
                  r="50" 
                  className={`${timerColorMap[timerMode]} transition-all duration-1000`} 
                  strokeWidth="5" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={strokeOffset}
                  fill="transparent" 
                />
              </svg>
              <div className="absolute text-center space-y-0.5">
                <span className="text-2xl font-mono font-black text-slate-800 tracking-tight">
                  {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                </span>
                <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-widest">{timerMode}</span>
              </div>
            </div>

            <button 
              onClick={toggleTimer}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all shadow cursor-pointer ${
                timerActive ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
              }`}
            >
              {timerActive ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
              <span>{timerActive ? 'Pause Session' : 'Start Focus Clock'}</span>
            </button>
          </div>

          {/* Habit quick checklist */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Bio-Habit Sync Loop</h3>
            <div className="space-y-2">
              {habits.map((habit) => (
                <div key={habit.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleHabit(habit.id)}
                      className={`flex h-6 w-6 items-center justify-center rounded-md border transition-all cursor-pointer ${
                        habit.completedToday 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : 'bg-white border-slate-200 hover:border-slate-350 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 text-white" />
                    </button>
                    <span className={`text-xs font-medium ${habit.completedToday ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {habit.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-600 font-mono font-bold flex items-center gap-0.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    {habit.streak}d
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
