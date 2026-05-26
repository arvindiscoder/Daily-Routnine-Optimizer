import React, { useState } from 'react';
import { Plus, Trash2, Flame, Check } from 'lucide-react';
import { Habit } from '../types';

interface HabitsViewProps {
  habits: Habit[];
  handleAddHabit: (name: string, category: 'Health' | 'Work' | 'Mind', frequency: 'daily' | 'weekly') => void;
  toggleHabit: (id: string) => void;
  handleDeleteHabit: (id: string) => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({
  habits,
  handleAddHabit,
  toggleHabit,
  handleDeleteHabit
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Health' | 'Work' | 'Mind'>('Health');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    handleAddHabit(name, category, frequency);
    setName('');
  };

  const getLightCategoryColorStyle = (cat: string) => {
    switch(cat) {
      case 'Work': return 'text-indigo-700 bg-indigo-50 border border-indigo-100';
      case 'Health': return 'text-amber-700 bg-amber-50 border border-amber-100';
      case 'Mind': return 'text-emerald-700 bg-emerald-50 border border-emerald-100';
      default: return 'text-slate-600 bg-slate-50 border border-slate-100';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-page">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Identity & Habit Architect</h2>
        <p className="text-xs text-slate-500 mt-0.5">Automate consistent performance loops with streak parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Entry form */}
        <div className="lg:col-span-12 xl:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 h-fit">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Formulate Habit Loop</h3>
          
          <form onSubmit={submitForm} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500">Habit Name / Intended Action</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. 10 Minutes Slow Breathing"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-850 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500">Category Dimension</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-850 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
                >
                  <option value="Health">Health</option>
                  <option value="Work">Work</option>
                  <option value="Mind">Mind</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500">Frequency Interval</label>
                <select 
                  value={frequency}
                  onChange={e => setFrequency(e.target.value as any)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-850 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 py-3 text-xs font-bold text-white transition-all shadow shadow-indigo-100 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Deploy Automated Loop</span>
            </button>
          </form>
        </div>

        {/* List & Streaks */}
        <div className="lg:col-span-12 xl:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Identity Loops</h3>
          
          <div className="space-y-2.5">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-white transition-all">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleHabit(habit.id)}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                      habit.completedToday 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow shadow-emerald-100' 
                        : 'bg-white border-slate-200 hover:border-slate-350 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </button>
                  <div>
                    <span className={`text-xs font-bold block ${habit.completedToday ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {habit.name}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${getLightCategoryColorStyle(habit.category)}`}>
                        {habit.category}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        {habit.frequency}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[8px] uppercase font-bold text-slate-400 block">Streak</span>
                    <span className="text-xs font-black text-slate-700 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      {habit.streak} d
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {habits.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-6">No habit loops established.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
