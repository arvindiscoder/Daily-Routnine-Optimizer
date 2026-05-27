import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Loader2, 
  Zap,
  ArrowRight,
  HelpCircle,
  Clock
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Habit, Task, ScheduleBlock, IdentityCheck } from '../types';
import { SoundSynth } from '../lib/synth';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface ChatViewProps {
  habits: Habit[];
  tasks: Task[];
  scheduleBlocks: ScheduleBlock[];
  identityChecks: IdentityCheck[];
}

const STARTER_PROMPTS = [
  {
    title: "Optimize Circadian Morning",
    prompt: "How can I better align my 'Morning Outdoor Sunlight' habit with my biology? Give me precise timing tips.",
    tag: "Bio-Sync"
  },
  {
    title: "Structure Critical Thinker Identity",
    prompt: "I want to anchor a new core identity called 'A Ruthless Critical Thinker'. Suggest 3 supporting atomic habits I can start checking off.",
    tag: "Identity"
  },
  {
    title: "Analyze My Trackers",
    prompt: "Analyze my current AeroFlow dashboard (habits, tasks, and schedules) and give me a strict, scientifically backed feedback report.",
    tag: "Diagnostic"
  },
  {
    title: "Circadian Work Block Setup",
    prompt: "Show me how to structure high-impact focus workflow blocks for maximum cognitive output during cortisol peaks.",
    tag: "Time-Block"
  }
];

export const ChatView: React.FC<ChatViewProps> = ({
  habits,
  tasks,
  scheduleBlocks,
  identityChecks
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('aeroflow_chat_messages_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: 'welcome',
        role: 'assistant',
        text: "Greetings, Circadian Engineer. I am **AeroBot AI**, your biological routine architect. \n\nI have scanned your active workspace state map. Ask me how to optimize your daylight intervals, anchor atomic identities, or construct high-impact focus workflows. How shall we structure your biology today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save messages to LocalStorage
  useEffect(() => {
    localStorage.setItem('aeroflow_chat_messages_v4', JSON.stringify(messages));
  }, [messages]);

  // Handle auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    SoundSynth.playTick();
    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setErrorText(null);

    // Collect active workspace context map to feed the AI
    const systemContext = {
      activeHabits: habits.map(h => ({
        name: h.name,
        category: h.category,
        streak: h.streak,
        completedToday: h.completedToday
      })),
      activeTasks: tasks.map(t => ({
        text: t.text,
        priority: t.priority,
        completed: t.completed,
        poms: `${t.completedPomodoros}/${t.pomodoros}`
      })),
      scheduledBlocks: scheduleBlocks.map(b => ({
        title: b.title,
        time: `${b.startTime} - ${b.endTime}`,
        category: b.category,
        productivity: b.productivity
      })),
      coreIdentities: identityChecks.map(i => ({
        identity: i.identityName,
        provenToday: i.provenToday
      }))
    };

    try {
      const chatPayload = [
        ...messages,
        userMessage
      ].map(m => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: chatPayload,
          context: systemContext
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      
      SoundSynth.playSuccess();
      const assistantMessage: ChatMessage = {
        id: 'msg-' + Date.now() + '-reply',
        role: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      SoundSynth.playAlert();
      setErrorText(err.message || 'Connecting to AeroBot server failed. Check your local connection or API key settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    SoundSynth.playAlert();
    if (window.confirm("Do you want to clear your current conversation history with AeroBot?")) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          text: "System context re-initialized. Let's restart. Ask me anything about your current daily trackers or lifestyle goals.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setErrorText(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] lg:h-[calc(100vh-64px)] bg-slate-50 relative">
      {/* Bot Chat Header Info */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-200 flex items-center justify-center text-indigo-650 shadow-sm shadow-indigo-100">
            <Bot className="w-5.5 h-5.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black text-indigo-950 tracking-tight">AeroBot AI</h2>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider bg-emerald-550/10 text-emerald-600 border border-emerald-500/20">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                Context Active
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Circadian Architect & Lifestyle Feedback Engine</p>
          </div>
        </div>

        <button 
          onClick={handleClearChat}
          className="text-xs font-semibold px-3 py-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/60 rounded-lg transition-all cursor-pointer"
        >
          Clear History
        </button>
      </div>

      {/* Messages Thread Workspace */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        
        {/* Helper System Context Banner */}
        <div className="bg-indigo-950 text-white rounded-xl p-4 border border-indigo-900 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3 max-w-4xl mx-auto mb-4">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white mt-0.5 md:mt-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-tight text-white flex items-center gap-1">
                Real-Time State Mapping Loaded
              </h4>
              <p className="text-[10px] text-indigo-200 font-medium">
                AeroBot is actively parsing your tracking metrics: <strong className="text-emerald-300 font-semibold">{habits.length} habits</strong>, <strong className="text-amber-300 font-semibold">{tasks.length} tasks</strong>, <strong className="text-indigo-300 font-semibold">{scheduleBlocks.length} schedule blocks</strong>, and <strong className="text-rose-300 font-semibold">{identityChecks.length} active core identities</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Message bubbles sequence */}
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex gap-3.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role !== 'user' && (
                <div className="w-8 h-8 rounded-lg bg-indigo-650 flex items-center justify-center text-white shrink-0 shadow-sm shadow-indigo-200">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm border ${
                message.role === 'user'
                  ? 'bg-indigo-650 border-indigo-750 text-white rounded-tr-none'
                  : 'bg-white border-slate-200 text-slate-800 rounded-tl-none md:px-6'
              }`}>
                {/* Message Meta */}
                <div className="flex items-center gap-1.5 mb-1 text-[9px] font-bold uppercase tracking-wider">
                  <span className={message.role === 'user' ? 'text-indigo-200' : 'text-indigo-650'}>
                    {message.role === 'user' ? 'You' : 'AeroBot AI'}
                  </span>
                  <span className="opacity-40">•</span>
                  <span className="opacity-40 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {message.timestamp}
                  </span>
                </div>

                {/* Render Text Content with Custom Markdown Styling */}
                <div className={`text-xs leading-relaxed space-y-2 markdown-body ${
                  message.role === 'user' 
                    ? 'text-white' 
                    : 'text-slate-700 font-medium [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-1 [&_strong]:text-slate-950 [&_strong]:font-black'
                }`}>
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-indigo-550 text-white flex items-center justify-center shrink-0 shadow-sm select-none font-bold text-xs border border-indigo-400">
                  U
                </div>
              )}
            </div>
          ))}

          {/* Loading status */}
          {isLoading && (
            <div className="flex gap-3.5 justify-start">
              <div className="w-8 h-8 rounded-lg bg-indigo-650 flex items-center justify-center text-white shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm text-slate-600 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                <span className="text-xs font-semibold animate-pulse">AeroBot is synthesizing insights...</span>
              </div>
            </div>
          )}

          {/* Error notice */}
          {errorText && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 max-w-2xl text-rose-800 space-y-2.5">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold">AeroBot Connection Interface Error</p>
                  <p className="mt-1 text-rose-700 font-medium">{errorText}</p>
                </div>
              </div>
              <div className="text-[10px] bg-white border border-rose-100 rounded-lg p-2.5 text-slate-500 leading-normal">
                💡 <strong>How to configure your API Key:</strong> Open the <strong>Settings (Gear Icon)</strong> menu in the upper corner of the AI Studio workspace, choose <strong>Secrets</strong>, and insert a valid <code>GEMINI_API_KEY</code>. Once saved, AeroBot will establish communication immediately!
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Starter Suggestions & Interactive prompt input area */}
      <div className="bg-white border-t border-slate-200 p-4 sm:p-6 shrink-0 shadow-md">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Diagnostic Starters overlay */}
          {messages.length <= 1 && !isLoading && (
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-650" />
                Quick-Sync Recommended Diagnostics
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {STARTER_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p.prompt)}
                    className="text-left bg-slate-50 hover:bg-indigo-50/50 border border-slate-250/50 hover:border-indigo-200 rounded-xl p-3 flex flex-col justify-between transition-all group cursor-pointer"
                  >
                    <span className="text-[9px] font-bold text-indigo-650 bg-indigo-550/10 px-1.5 py-0.5 rounded-md uppercase tracking-wide self-start mb-1">
                      {p.tag}
                    </span>
                    <div className="flex items-center justify-between gap-2 w-full mt-1">
                      <p className="text-xs font-extrabold text-slate-800 leading-tight group-hover:text-indigo-950">
                        {p.title}
                      </p>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-450 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Real form typing space */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }} 
            className="flex gap-2.5"
          >
            <input 
              type="text"
              placeholder={isLoading ? "Please wait..." : "Ask AeroBot AI to optimize your circadian lifestyle..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-xl px-5 flex items-center justify-center transition-colors cursor-pointer gap-1.5 font-bold shadow-sm"
            >
              <Send className="w-4 h-4 text-white" />
              <span className="hidden sm:inline text-xs">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
