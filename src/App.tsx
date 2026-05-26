import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  Calendar, 
  CheckCircle2, 
  Timer, 
  LineChart, 
  BookOpen,
  Volume2,
  Download,
  CheckSquare
} from 'lucide-react';

import { Habit, Task, ScheduleBlock, RoutineTemplate, TabType, IdentityCheck } from './types';
import { SoundSynth } from './lib/synth';

// Subcomponents
import { DashboardView } from './components/DashboardView';
import { OptimizerView } from './components/OptimizerView';
import { HabitsView } from './components/HabitsView';
import { TasksView } from './components/TasksView';
import { AnalyticsView } from './components/AnalyticsView';
import { LibraryView } from './components/LibraryView';

const DEFAULT_HABITS: Habit[] = [
  { id: 'h1', name: 'Morning Outdoor Sunlight', frequency: 'daily', category: 'Health', streak: 6, completedToday: true, color: 'text-amber-400 bg-amber-400/10' },
  { id: 'h2', name: 'Focus Session (90 Mins)', frequency: 'daily', category: 'Work', streak: 4, completedToday: false, color: 'text-blue-400 bg-blue-400/10' },
  { id: 'h3', name: 'Mindful Slow Breathing', frequency: 'daily', category: 'Mind', streak: 2, completedToday: false, color: 'text-emerald-400 bg-emerald-400/10' }
];

const DEFAULT_IDENTITIES: IdentityCheck[] = [
  { id: 'i1', identityName: 'A Prolific Software Craftsman', provenToday: false, color: 'text-indigo-650 bg-indigo-50 border-indigo-200' },
  { id: 'i2', identityName: 'An Athletic and Healthy Person', provenToday: true, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'i3', identityName: 'A Fully Mindful Leader & Partner', provenToday: false, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
];

const DEFAULT_TASKS: Task[] = [
  { id: 't1', text: 'Define Core Application State Maps', category: 'Work', completed: false, priority: 'High', pomodoros: 3, completedPomodoros: 1 },
  { id: 't2', text: 'Perform Hydration Intake System Sweep', category: 'Health', completed: true, priority: 'Medium', pomodoros: 1, completedPomodoros: 1 },
  { id: 't3', text: 'Cleanse Workspace Desk Layout', category: 'Mind', completed: false, priority: 'Low', pomodoros: 1, completedPomodoros: 0 }
];

const DEFAULT_SCHEDULE: ScheduleBlock[] = [
  { id: 's1', title: 'Awakening & Sunlight Exposure', startTime: '06:30', endTime: '07:30', category: 'Health', productivity: 'Medium', desc: 'Step outdoors immediately to lock sleep-wake schedules.' },
  { id: 's2', title: 'System-Critical Coding Flow', startTime: '08:30', endTime: '11:00', category: 'Work', productivity: 'High', desc: 'Protect early cognitive energy from message feeds.' },
  { id: 's3', title: 'Post-Lunch Restorative Walk', startTime: '12:30', endTime: '13:15', category: 'Mind', productivity: 'Low', desc: 'No-input natural recovery phase.' },
  { id: 's4', title: 'Collaboration & Group Alignment', startTime: '14:00', endTime: '16:00', category: 'Work', productivity: 'Medium', desc: 'Answer messages, run reviews, clear inbox layers.' }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('aeroflow_habits');
    return saved ? JSON.parse(saved) : DEFAULT_HABITS;
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('aeroflow_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>(() => {
    const saved = localStorage.getItem('aeroflow_schedule');
    return saved ? JSON.parse(saved) : DEFAULT_SCHEDULE;
  });
  const [identityChecks, setIdentityChecks] = useState<IdentityCheck[]>(() => {
    const saved = localStorage.getItem('aeroflow_identities');
    return saved ? JSON.parse(saved) : DEFAULT_IDENTITIES;
  });

  const [toast, setToast] = useState<string | null>(null);
  const [zipIsLoading, setZipIsLoading] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('aeroflow_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('aeroflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('aeroflow_schedule', JSON.stringify(scheduleBlocks));
  }, [scheduleBlocks]);

  useEffect(() => {
    localStorage.setItem('aeroflow_identities', JSON.stringify(identityChecks));
  }, [identityChecks]);

  // Focus pomodoro states
  const [timerMode, setTimerMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timerMinutes, setTimerMinutes] = useState<number>(25);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [selectedTaskForTimer, setSelectedTaskForTimer] = useState<string>(DEFAULT_TASKS[0]?.id || '');

  const triggerToast = (msg: string) => {
    setToast(msg);
  };

  // Auto-expire toasting notices
  useEffect(() => {
    if (toast) {
      const handle = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(handle);
    }
  }, [toast]);

  // Main countdown ticking logic
  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(prev => prev - 1);
        } else if (timerSeconds === 0) {
          if (timerMinutes > 0) {
            setTimerMinutes(prev => prev - 1);
            setTimerSeconds(59);
            SoundSynth.playTick();
          } else {
            handleTimerFinish();
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerMinutes, timerSeconds]);

  const handleTimerFinish = () => {
    setTimerActive(false);
    SoundSynth.playAlert();
    if (timerMode === 'focus') {
      if (selectedTaskForTimer) {
        setTasks(prev => prev.map(t => {
          if (t.id === selectedTaskForTimer) {
            const nextVal = Math.min(t.pomodoros, t.completedPomodoros + 1);
            if (nextVal === t.pomodoros) {
              triggerToast(`🏆 Completed all Pomodoros for "${t.text}"!`);
              SoundSynth.playSuccess();
              return { ...t, completedPomodoros: nextVal, completed: true };
            }
            return { ...t, completedPomodoros: nextVal };
          }
          return t;
        }));
      }
      triggerToast("🔥 Focus session complete! Take a step back.");
      setTimerMode('shortBreak');
      setTimerMinutes(5);
    } else {
      triggerToast("⚡ Break finished! Re-enter your deep workspace.");
      setTimerMode('focus');
      setTimerMinutes(25);
    }
    setTimerSeconds(0);
  };

  const toggleTimer = () => {
    SoundSynth.playTick();
    setTimerActive(!timerActive);
  };

  const resetTimer = (mode?: 'focus' | 'shortBreak' | 'longBreak') => {
    SoundSynth.playTick();
    setTimerActive(false);
    const targetMode = mode || timerMode;
    if (targetMode === 'focus') {
      setTimerMinutes(25);
    } else if (targetMode === 'shortBreak') {
      setTimerMinutes(5);
    } else {
      setTimerMinutes(15);
    }
    setTimerSeconds(0);
  };

  // Habits Operations
  const toggleHabit = (id: string) => {
    SoundSynth.playTick();
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const state = !h.completedToday;
        if (state) SoundSynth.playSuccess();
        return { 
          ...h, 
          completedToday: state, 
          streak: state ? h.streak + 1 : Math.max(0, h.streak - 1) 
        };
      }
      return h;
    }));
  };

  const handleAddHabit = (name: string, category: 'Health' | 'Work' | 'Mind', frequency: 'daily' | 'weekly') => {
    SoundSynth.playTick();
    const colors = {
      Health: 'text-amber-400 bg-amber-400/10',
      Work: 'text-blue-400 bg-blue-400/10',
      Mind: 'text-emerald-400 bg-emerald-400/10'
    };
    const newHabit: Habit = {
      id: 'h_' + Date.now(),
      name,
      category,
      frequency,
      streak: 0,
      completedToday: false,
      color: colors[category] || 'text-slate-400 bg-slate-400/10'
    };
    setHabits(prev => [...prev, newHabit]);
    triggerToast("🌱 New automated loop started!");
  };

  const handleDeleteHabit = (id: string) => {
    SoundSynth.playTick();
    setHabits(prev => prev.filter(h => h.id !== id));
    triggerToast("Habit loop dismantled.");
  };

  // Tasks Operations
  const toggleTask = (id: string) => {
    SoundSynth.playTick();
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const state = !t.completed;
        if (state) SoundSynth.playSuccess();
        return { ...t, completed: state };
      }
      return t;
    }));
  };

  const handleAddTask = (text: string, category: 'Health' | 'Work' | 'Mind', priority: 'High' | 'Medium' | 'Low', pomodoros: number) => {
    SoundSynth.playTick();
    const newTask: Task = {
      id: 't_' + Date.now(),
      text,
      category,
      priority,
      pomodoros: pomodoros || 1,
      completedPomodoros: 0,
      completed: false
    };
    setTasks(prev => [...prev, newTask]);
    triggerToast("📌 New priority queued!");
  };

  const handleDeleteTask = (id: string) => {
    SoundSynth.playTick();
    setTasks(prev => prev.filter(t => t.id !== id));
    triggerToast("Task cleared.");
  };

  // Timeline Operations
  const handleAddScheduleBlock = (
    title: string, 
    startTime: string, 
    endTime: string, 
    category: 'Health' | 'Work' | 'Mind', 
    productivity: 'High' | 'Medium' | 'Low', 
    desc: string
  ) => {
    SoundSynth.playTick();
    const newBlock: ScheduleBlock = {
      id: 's_' + Date.now(),
      title,
      startTime,
      endTime,
      category,
      productivity,
      desc
    };
    setScheduleBlocks(prev => [...prev, newBlock].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    triggerToast("⏰ Flow block registered!");
  };

  const handleDeleteScheduleBlock = (id: string) => {
    SoundSynth.playTick();
    setScheduleBlocks(prev => prev.filter(b => b.id !== id));
    triggerToast("Flow block removed.");
  };

  // Template Import
  const handleImportTemplate = (template: RoutineTemplate) => {
    SoundSynth.playSuccess();
    const blocksWithIds: ScheduleBlock[] = template.blocks.map((b, idx) => ({
      ...b,
      id: `s_imported_${idx}_${Date.now()}`
    }));
    setScheduleBlocks(blocksWithIds);
    triggerToast(`🧬 Integrated "${template.name}" blueprint!`);
    setCurrentTab('optimizer');
  };

  // Identity Checks Operations
  const toggleIdentityCheck = (id: string) => {
    SoundSynth.playTick();
    setIdentityChecks(prev => prev.map(item => {
      if (item.id === id) {
        const state = !item.provenToday;
        if (state) SoundSynth.playSuccess();
        return { ...item, provenToday: state };
      }
      return item;
    }));
  };

  const handleAddIdentityCheck = (name: string, colorClassDefault?: string) => {
    SoundSynth.playTick();
    const colors = [
      'text-indigo-650 bg-indigo-50 border-indigo-200',
      'text-amber-600 bg-amber-50 border-amber-200',
      'text-emerald-700 bg-emerald-50 border-emerald-200',
      'text-rose-600 bg-rose-50 border-rose-200',
    ];
    const pickedColor = colorClassDefault || colors[Math.floor(Math.random() * colors.length)];
    const newIden: IdentityCheck = {
      id: 'i_' + Date.now(),
      identityName: name,
      provenToday: false,
      color: pickedColor
    };
    setIdentityChecks(prev => [...prev, newIden]);
    triggerToast("✨ Custom Identity Anchored!");
  };

  const handleDeleteIdentityCheck = (id: string) => {
    SoundSynth.playTick();
    setIdentityChecks(prev => prev.filter(item => item.id !== id));
    triggerToast("Identity dismantled.");
  };

  const handleDownloadZip = async () => {
    try {
      setZipIsLoading(true);
      triggerToast("📦 Packaging codebase into a ZIP... Please wait.");
      
      const response = await fetch("/api/download-zip");
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "AeroFlowPro-Project.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      triggerToast("🚀 Download complete! Enjoy your code!");
      SoundSynth.playSuccess();
    } catch (error) {
      console.error(error);
      triggerToast("❌ Download failed. Try again.");
      SoundSynth.playAlert();
    } finally {
      setZipIsLoading(false);
    }
  };

  // Sync Diagnostics Calculations
  const calculateSyncScore = (): number => {
    let score = 40;
    
    // Habits contribution matching (0-25 points)
    const habitDoneCount = habits.filter(h => h.completedToday).length;
    score += (habitDoneCount / (habits.length || 1)) * 20;

    // Identities proven (0-20 points)
    const identityDoneCount = identityChecks.filter(i => i.provenToday).length;
    score += (identityDoneCount / (identityChecks.length || 1)) * 20;

    // Routine diversity balance (0-20 points)
    const categories = new Set(scheduleBlocks.map(b => b.category));
    score += categories.size * 6;

    // Completed Tasks contribution (0-20 points)
    const doneTasks = tasks.filter(t => t.completed).length;
    score += (doneTasks / (tasks.length || 1)) * 10;

    return Math.min(100, Math.round(score));
  };

  const syncScore = calculateSyncScore();

  // Recommendations builder
  const getSystemSuggestions = () => {
    const s = [];
    const workBlocksCount = scheduleBlocks.filter(b => b.category === 'Work').length;
    const healthBlocksCount = scheduleBlocks.filter(b => b.category === 'Health').length;

    if (workBlocksCount >= 3 && healthBlocksCount < 2) {
      s.push({
        title: 'Intense Cognitive Saturation Alert',
        desc: 'Your routine outlines high mental output without corresponding micro-movement buffers. Integrate an active restoration zone.',
        color: 'border-amber-500/50 bg-amber-500/5'
      });
    }

    const hasSunlight = scheduleBlocks.some(b => b.title.toLowerCase().includes('sunlight'));
    if (!hasSunlight) {
      s.push({
        title: 'Missing Morning Photons',
        desc: 'No outdoor light anchoring observed. Catching morning sunlight calibrates systemic cellular clocks and optimizes energy curves.',
        color: 'border-blue-500/50 bg-blue-500/5'
      });
    }

    if (s.length === 0) {
      s.push({
        title: 'Circadian Alignment Secured',
        desc: 'Outstanding balance. Active work, deep mental recovery windows, and physical parameters are perfectly configured.',
        color: 'border-emerald-500/50 bg-emerald-500/5'
      });
    }

    return s;
  };

  const suggestions = getSystemSuggestions();

  return (
    <div className="flex h-screen flex-col bg-slate-50 text-slate-900 lg:flex-row overflow-hidden font-sans">
      
      {/* Toast Trigger */}
      {toast && (
        <div className="fixed bottom-20 right-4 lg:top-6 lg:right-6 z-50 flex items-center gap-3 rounded-xl bg-white border border-slate-200 px-4 py-3 shadow-lg animate-pulse">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <span className="text-xs font-semibold text-slate-800">{toast}</span>
        </div>
      )}

      {/* Side Navigation Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between border-r border-slate-200 bg-white p-6 lg:w-72 shrink-0">
        <div className="flex flex-col">
          
          {/* Logo Headings matching "Stratos" template */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-indigo-600 rounded-sm flex items-center justify-center">
              <div className="w-4 h-4 bg-white rotate-45"></div>
            </div>
            <span className="font-bold text-xl tracking-tight text-indigo-950">AeroFlow Pro</span>
          </div>

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Sync Navigation</p>
          
          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', name: 'Dashboard Sphere', icon: LayoutDashboard },
              { id: 'optimizer', name: 'Schedule Optimizer', icon: Calendar },
              { id: 'habits', name: 'Habit Architect', icon: CheckCircle2 },
              { id: 'tasks', name: 'Task Hub & Pomo', icon: Timer },
              { id: 'analytics', name: 'Time & Sync Analytics', icon: LineChart },
              { id: 'library', name: 'Routine Blueprints', icon: BookOpen }
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { SoundSynth.playTick(); setCurrentTab(item.id as TabType); }}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                    ? 'bg-indigo-50 text-indigo-700 rounded-md border-r-4 border-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-md'
                  }`}
                >
                  <IconComp className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dynamic audio Synthesizer sidebar footer card */}
        <div className="p-4 bg-indigo-950 rounded-xl text-white shadow-md space-y-3.5">
          <div>
            <p className="text-[10px] text-indigo-300 font-bold mb-0.5 uppercase tracking-wider">Dynamic Engine</p>
            <h4 className="text-[11px] font-bold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Workspace Active
            </h4>
          </div>
          
          <button 
            onClick={() => { SoundSynth.playSuccess(); }}
            className="w-full py-1.5 bg-indigo-900/60 hover:bg-indigo-900 border border-indigo-750/50 text-[10px] font-bold rounded transition-colors uppercase tracking-wider cursor-pointer"
          >
            Test Sound 🔊
          </button>
          
          <button 
            onClick={handleDownloadZip}
            disabled={zipIsLoading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-black rounded transition-colors uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 shadow shadow-indigo-900/30 text-white"
          >
            <Download className="w-4.5 h-4.5 text-white" />
            <span>{zipIsLoading ? 'Zipping...' : 'Download Code ZIP'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8 pb-24 lg:pb-8">
        <div>
          {currentTab === 'dashboard' && (
            <DashboardView 
              habits={habits}
              toggleHabit={toggleHabit}
              tasks={tasks}
              scheduleBlocks={scheduleBlocks}
              syncScore={syncScore}
              suggestions={suggestions}
              timerActive={timerActive}
              timerMinutes={timerMinutes}
              timerSeconds={timerSeconds}
              timerMode={timerMode}
              toggleTimer={toggleTimer}
              setCurrentTab={setCurrentTab}
              identityChecks={identityChecks}
              toggleIdentityCheck={toggleIdentityCheck}
              handleAddIdentityCheck={handleAddIdentityCheck}
              handleDeleteIdentityCheck={handleDeleteIdentityCheck}
            />
          )}

          {currentTab === 'optimizer' && (
            <OptimizerView 
              scheduleBlocks={scheduleBlocks}
              handleAddScheduleBlock={handleAddScheduleBlock}
              handleDeleteScheduleBlock={handleDeleteScheduleBlock}
              syncScore={syncScore}
              suggestions={suggestions}
            />
          )}

          {currentTab === 'habits' && (
            <HabitsView 
              habits={habits}
              handleAddHabit={handleAddHabit}
              toggleHabit={toggleHabit}
              handleDeleteHabit={handleDeleteHabit}
            />
          )}

          {currentTab === 'tasks' && (
            <TasksView 
              tasks={tasks}
              handleAddTask={handleAddTask}
              toggleTask={toggleTask}
              handleDeleteTask={handleDeleteTask}
              timerMode={timerMode}
              timerMinutes={timerMinutes}
              timerSeconds={timerSeconds}
              timerActive={timerActive}
              toggleTimer={toggleTimer}
              resetTimer={resetTimer}
              setTimerMinutes={setTimerMinutes}
              setTimerMode={setTimerMode}
              selectedTaskForTimer={selectedTaskForTimer}
              setSelectedTaskForTimer={setSelectedTaskForTimer}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView 
              habits={habits}
              tasks={tasks}
              scheduleBlocks={scheduleBlocks}
              syncScore={syncScore}
            />
          )}

          {currentTab === 'library' && (
            <LibraryView 
              handleImportTemplate={handleImportTemplate}
            />
          )}
        </div>
      </main>

      {/* Mobile Tabbed Bottom bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-45 flex items-center justify-around border-t border-slate-200 bg-white/95 backdrop-blur px-2 py-3 shadow-lg">
        {[
          { id: 'dashboard', name: 'Home', icon: LayoutDashboard },
          { id: 'optimizer', name: 'Optimize', icon: Calendar },
          { id: 'habits', name: 'Habits', icon: CheckCircle2 },
          { id: 'tasks', name: 'Focus', icon: Timer },
          { id: 'analytics', name: 'Analytics', icon: LineChart },
          { id: 'library', name: 'Templates', icon: BookOpen }
        ].map((item) => {
          const IconComp = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { SoundSynth.playTick(); setCurrentTab(item.id as TabType); }}
              className={`flex flex-col items-center gap-1 px-3 min-w-[50px] transition-all cursor-pointer ${
                isActive ? 'text-indigo-650 scale-105 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <IconComp className="w-5.5 h-5.5" />
              <span className="text-[9px] tracking-tight">{item.name}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
