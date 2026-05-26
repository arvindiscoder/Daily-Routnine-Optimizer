import React, { useState } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { ScheduleBlock } from '../types';

interface OptimizerViewProps {
  scheduleBlocks: ScheduleBlock[];
  handleAddScheduleBlock: (
    title: string, 
    startTime: string, 
    endTime: string, 
    category: 'Health' | 'Work' | 'Mind', 
    productivity: 'High' | 'Medium' | 'Low', 
    desc: string
  ) => void;
  handleDeleteScheduleBlock: (id: string) => void;
  syncScore: number;
  suggestions: { title: string; desc: string; color: string }[];
}

export const OptimizerView: React.FC<OptimizerViewProps> = ({
  scheduleBlocks,
  handleAddScheduleBlock,
  handleDeleteScheduleBlock,
  suggestions
}) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:30');
  const [category, setCategory] = useState<'Health' | 'Work' | 'Mind'>('Work');
  const [productivity, setProductivity] = useState<'High' | 'Medium' | 'Low'>('High');
  const [desc, setDesc] = useState('');

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startTime || !endTime) return;
    handleAddScheduleBlock(title, startTime, endTime, category, productivity, desc);
    setTitle('');
    setDesc('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-page">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Structured Timeline Planner</h2>
        <p className="text-xs text-slate-500 mt-0.5">Protect high-attention work windows and align active recovery spaces.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Entry form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Anchor Routine Block</h3>
          
          <form onSubmit={submitForm} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500">Objective / Target Name</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Focused Engineering Run"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500">Start Time</label>
                <input 
                  type="time" 
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500">End Time</label>
                <input 
                  type="time" 
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500">Dimension</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-850 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
                >
                  <option value="Work">Work</option>
                  <option value="Health">Health</option>
                  <option value="Mind">Mind</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500">Cognitive Load</label>
                <select 
                  value={productivity}
                  onChange={e => setProductivity(e.target.value as any)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-850 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500">Guidelines / Intention</label>
              <textarea 
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Add key parameters..."
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 h-16 resize-none"
              />
            </div>

            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 py-3 text-xs font-bold text-white transition-all shadow shadow-indigo-100 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Lock Block Into Timeline</span>
            </button>
          </form>
        </div>

        {/* Timeline & Feedback */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Analysis suggestions */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Real-time Optimization Engine Suggestions</h4>
            {suggestions.map((s, idx) => {
              const themeColor = s.color.includes('amber')
                ? 'border-amber-200 bg-amber-50 text-amber-900'
                : s.color.includes('emerald')
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-indigo-200 bg-indigo-50 text-indigo-900';
              return (
                <div key={idx} className={`p-3.5 rounded-xl border ${themeColor}`}>
                  <h5 className="text-xs font-bold mb-0.5">{s.title}</h5>
                  <p className="text-[11px] opacity-90 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Chronological list of schedule blocks */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Timeline Sequence</h3>
            <div className="relative pl-4 border-l border-slate-200 space-y-5">
              {scheduleBlocks.map((block) => (
                <div key={block.id} className="relative">
                  {/* Bullet connector */}
                  <div className={`absolute -left-[21px] top-1.5 h-3 w-3 rounded-full border-2 border-white ${
                    block.category === 'Work' ? 'bg-indigo-600' :
                    block.category === 'Health' ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`}></div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-white transition-all flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                          {block.startTime} - {block.endTime}
                        </span>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                          block.category === 'Work' ? 'bg-indigo-55 text-indigo-700 border border-indigo-100' :
                          block.category === 'Health' ? 'bg-amber-55 text-amber-700 border border-amber-100' :
                          'bg-emerald-55 text-emerald-700 border border-emerald-100'
                        }`}>
                          {block.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">{block.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{block.desc}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteScheduleBlock(block.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {scheduleBlocks.length === 0 && (
                <p className="text-center text-xs text-slate-400 py-6">Your routine flow timeline is currently blank.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
