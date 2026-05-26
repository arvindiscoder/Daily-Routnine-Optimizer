import React from 'react';
import { BookOpen } from 'lucide-react';
import { RoutineTemplate } from '../types';

interface LibraryViewProps {
  handleImportTemplate: (template: RoutineTemplate) => void;
}

const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: 'tmpl1',
    name: 'Andrew Huberman Morning',
    desc: 'A scientific blueprint focused on optimizing cortisol timing, circadian cycles, and early day energy peaks.',
    category: 'Circadian',
    blocks: [
      { title: 'Outside Sunlight Sync', startTime: '06:00', endTime: '06:15', category: 'Health', productivity: 'High', desc: 'Triggers morning cortisol release.' },
      { title: 'Cognitive Strategy Window', startTime: '08:00', endTime: '10:30', category: 'Work', productivity: 'High', desc: 'Capitalize on early dopamine waves.' },
      { title: 'Non-Sleep Deep Rest (NSDR)', startTime: '13:00', endTime: '13:30', category: 'Mind', productivity: 'Low', desc: 'Recharges nervous system reserves.' }
    ]
  },
  {
    id: 'tmpl2',
    name: 'Deep Work Specialist',
    desc: 'Structured to defend high attention blocks with integrated strategic mental rest gaps.',
    category: 'Productivity',
    blocks: [
      { title: 'Clean Architecture Planning', startTime: '08:30', endTime: '09:00', category: 'Work', productivity: 'Medium', desc: 'Isolate key goals.' },
      { title: 'Deep Concentration Loop I', startTime: '09:00', endTime: '11:30', category: 'Work', productivity: 'High', desc: 'Uninterrupted creative space.' },
      { title: 'Active Physical Recovery', startTime: '12:00', endTime: '13:00', category: 'Health', productivity: 'Low', desc: 'Full attention network rest.' }
    ]
  }
];

export const LibraryView: React.FC<LibraryViewProps> = ({ handleImportTemplate }) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-page">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Circadian Routine Blueprints</h2>
        <p className="text-xs text-slate-500 mt-0.5">Boot up pre-configured, peer-reviewed routine structures to calibrating energy pathways instantly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ROUTINE_TEMPLATES.map((tmpl) => (
          <div key={tmpl.id} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-slate-350 transition-all shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded tracking-wider">
                  {tmpl.category}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Scientific Blueprint</span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-800">{tmpl.name}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{tmpl.desc}</p>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Target Timeline:</span>
                <div className="space-y-2">
                  {tmpl.blocks.map((block, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-slate-650">
                      <span className="font-bold text-slate-700">{block.title}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{block.startTime} - {block.endTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleImportTemplate(tmpl)}
              className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-xs font-bold transition-all shadow shadow-indigo-100 cursor-pointer"
            >
              <span>Import & Calibrate Schedule</span>
              <BookOpen className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
