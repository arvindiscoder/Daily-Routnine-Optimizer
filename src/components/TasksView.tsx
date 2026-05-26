import React, { useState } from 'react';
import { Plus, Trash2, Check, Play, Pause, RotateCcw } from 'lucide-react';
import { Task } from '../types';

interface TasksViewProps {
  tasks: Task[];
  handleAddTask: (text: string, category: 'Health' | 'Work' | 'Mind', priority: 'High' | 'Medium' | 'Low', pomodoros: number) => void;
  toggleTask: (id: string) => void;
  handleDeleteTask: (id: string) => void;
  timerMode: 'focus' | 'shortBreak' | 'longBreak';
  timerMinutes: number;
  timerSeconds: number;
  timerActive: boolean;
  toggleTimer: () => void;
  resetTimer: (mode?: 'focus' | 'shortBreak' | 'longBreak') => void;
  setTimerMinutes: (m: number) => void;
  setTimerMode: (mode: 'focus' | 'shortBreak' | 'longBreak') => void;
  selectedTaskForTimer: string;
  setSelectedTaskForTimer: (id: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  handleAddTask,
  toggleTask,
  handleDeleteTask,
  timerMode,
  timerMinutes,
  timerSeconds,
  timerActive,
  toggleTimer,
  resetTimer,
  setTimerMinutes,
  setTimerMode,
  selectedTaskForTimer,
  setSelectedTaskForTimer
}) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<'Health' | 'Work' | 'Mind'>('Work');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [pomodoros, setPomodoros] = useState(1);

  const handlePreset = (mode: 'focus' | 'shortBreak' | 'longBreak', minutes: number) => {
    setTimerMode(mode);
    setTimerMinutes(minutes);
    resetTimer(mode);
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    handleAddTask(text, category, priority, pomodoros);
    setText('');
  };

  const activeTaskObj = tasks.find(t => t.id === selectedTaskForTimer);

  // Circular progress calculations (Radius = 86 => Perimeter = 2 * pi * r ~ 540.35)
  const circumference = 540.35;
  const currentTotalSeconds = timerMode === 'focus' ? 1500 : timerMode === 'shortBreak' ? 300 : 900;
  const remainingSeconds = timerMinutes * 60 + timerSeconds;
  const strokeOffset = circumference - (circumference * (remainingSeconds / currentTotalSeconds));

  const timerColors = {
    focus: 'stroke-indigo-650 text-indigo-600',
    shortBreak: 'stroke-emerald-500 text-emerald-500',
    longBreak: 'stroke-blue-500 text-blue-500'
  };

  const getLightPriorityStyle = (prio: string) => {
    switch (prio) {
      case 'High': return 'bg-rose-50 text-rose-700 border border-rose-100';
      case 'Medium': return 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'Low': return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      default: return 'bg-slate-50 text-slate-755 border border-slate-100';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-page">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cognitive Hub & Focus Lock</h2>
        <p className="text-xs text-slate-500 mt-0.5">Isolate critical goals and match them against structured focus intervals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Immersive Focus Clock */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-between min-h-[460px]">
          <div className="w-full">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Focus Controller</h3>
            
            {/* Preset options */}
            <div className="mt-4 flex items-center justify-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button 
                onClick={() => handlePreset('focus', 25)}
                className={`flex-1 text-center text-[10px] py-1.5 rounded-lg font-extrabold tracking-wider transition-all cursor-pointer ${
                  timerMode === 'focus' ? 'bg-indigo-600 text-white shadow shadow-indigo-100' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                FOCUS (25M)
              </button>
              <button 
                onClick={() => handlePreset('shortBreak', 5)}
                className={`flex-1 text-center text-[10px] py-1.5 rounded-lg font-extrabold tracking-wider transition-all cursor-pointer ${
                  timerMode === 'shortBreak' ? 'bg-emerald-500 text-white shadow shadow-emerald-500/10' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                REST (5M)
              </button>
              <button 
                onClick={() => handlePreset('longBreak', 15)}
                className={`flex-1 text-center text-[10px] py-1.5 rounded-lg font-extrabold tracking-wider transition-all cursor-pointer ${
                  timerMode === 'longBreak' ? 'bg-blue-600 text-white shadow shadow-blue-500/10' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                RECHARGE (15M)
              </button>
            </div>
          </div>

          {/* Main countdown circle */}
          <div className="relative flex items-center justify-center my-6">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle cx="96" cy="96" r="86" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
              <circle 
                cx="96" 
                cy="96" 
                r="86" 
                className={`${timerColors[timerMode]} transition-all duration-1000`} 
                strokeWidth="8" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeOffset}
                fill="transparent" 
              />
            </svg>
            <div className="absolute text-center space-y-0.5">
              <span className="text-4xl font-mono font-black text-slate-800 tracking-tight">
                {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-widest">{timerMode} mode</span>
            </div>
          </div>

          {/* Attuned Task */}
          <div className="w-full text-center space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Currently Attuned</span>
            <p className="text-xs font-bold text-slate-700 truncate">
              {activeTaskObj ? activeTaskObj.text : 'Select a goal from your focus list'}
            </p>
          </div>

          {/* Control triggers */}
          <div className="mt-6 flex items-center gap-3 w-full">
            <button 
              onClick={() => resetTimer()}
              className="flex items-center justify-center p-3 rounded-lg bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200 transition-all cursor-pointer"
              title="Reset Cycle"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleTimer}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-xs font-bold transition-all shadow cursor-pointer ${
                timerActive ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
              }`}
            >
              {timerActive ? <Pause className="w-4.5 h-4.5 text-white" /> : <Play className="w-4.5 h-4.5 text-white" />}
              <span>{timerActive ? 'Pause block' : 'Enter Focus Lock'}</span>
            </button>
          </div>
        </div>

        {/* Focus Queue List */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Entry Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Queue Strategic Priority</h3>
            <form onSubmit={submitForm} className="mt-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-6">
                <label className="block text-[10px] uppercase font-bold text-slate-500">Core Goal Objective</label>
                <input 
                  type="text" 
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="What demands peak attention block today?"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-655"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase font-bold text-slate-500">Dimension</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-655"
                >
                  <option value="Work">Work</option>
                  <option value="Health">Health</option>
                  <option value="Mind">Mind</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase font-bold text-slate-500">Priority</label>
                <select 
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-655"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="sm:col-span-1">
                <label className="block text-[10px] uppercase font-bold text-slate-500">Pomos</label>
                <input 
                  type="number" 
                  value={pomodoros}
                  onChange={e => setPomodoros(parseInt(e.target.value) || 1)}
                  min="1" 
                  max="10"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-655"
                />
              </div>
              <div className="sm:col-span-1">
                <button 
                  type="submit" 
                  className="w-full flex h-10 items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow shadow-indigo-100 cursor-pointer"
                >
                  <Plus className="w-5 h-5 text-white" />
                </button>
              </div>
            </form>
          </div>

          {/* Tasks selection box */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Focus List</h3>
            
            <div className="space-y-2.5">
              {tasks.map((task) => {
                const isSelected = selectedTaskForTimer === task.id;
                return (
                  <div 
                    key={task.id} 
                    onClick={() => setSelectedTaskForTimer(task.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                      ? 'bg-slate-50 border-indigo-500 shadow-sm' 
                      : 'bg-white border-slate-150 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTask(task.id);
                        }}
                        className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                          task.completed 
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow shadow-emerald-100' 
                          : 'bg-white border-slate-200 hover:border-slate-350 text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </button>
                      
                      <div>
                        <span className={`text-xs font-bold block ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                          {task.text}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${getLightPriorityStyle(task.priority)}`}>
                            {task.priority} Priority
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                            {task.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[8px] uppercase font-bold text-slate-400 block">Pomos</span>
                        <span className="text-xs font-semibold text-slate-700">
                          🍅 {task.completedPomodoros}/{task.pomodoros}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task.id);
                        }}
                        className="text-slate-405 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-105 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {tasks.length === 0 && (
                <p className="text-center text-xs text-slate-400 py-6">No tasks queued.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
