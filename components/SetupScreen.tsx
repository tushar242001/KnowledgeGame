import React, { useState } from 'react';
import { User, Sparkles, Zap } from 'lucide-react';
import Button from './Button';
import { POPULAR_TOPICS } from '../constants';

interface SetupScreenProps {
  onStart: (p1Name: string, p2Name: string, topic: string) => void;
  isLoading: boolean;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isLoading }) => {
  const [p1Name, setP1Name] = useState('Player 1');
  const [p2Name, setP2Name] = useState('Player 2');
  const [customTopic, setCustomTopic] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTopic = customTopic.trim() || selectedTopic;
    if (p1Name && p2Name && finalTopic) {
      onStart(p1Name, p2Name, finalTopic);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-slate-800 border border-slate-700 shadow-xl">
          <Zap className="w-8 h-8 text-yellow-400" />
        </div>
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 tracking-tight">
          Gemini Trivia Duel
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Challenge your friend to a battle of wits. AI generates the questions, you prove who's smarter.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Player Configuration Panel */}
        <div className="glass-panel p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" /> Contenders
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Player 1 (Cyan)</label>
              <input
                type="text"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-fuchsia-400 mb-2">Player 2 (Fuchsia)</label>
              <input
                type="text"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter name..."
              />
            </div>
          </div>
        </div>

        {/* Topic Selection Panel */}
        <div className="glass-panel p-8 rounded-2xl flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" /> Topic
          </h2>
          
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {POPULAR_TOPICS.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => {
                    setSelectedTopic(t.label);
                    setCustomTopic('');
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    selectedTopic === t.label 
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <t.icon className={`w-6 h-6 mb-2 ${selectedTopic === t.label ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-slate-500">Or type any topic</span>
              </div>
            </div>

            <input
              type="text"
              value={customTopic}
              onChange={(e) => {
                setCustomTopic(e.target.value);
                setSelectedTopic('');
              }}
              className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
              placeholder="e.g. 'Quantum Physics', '90s Cartoons'..."
            />
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Button 
          onClick={handleStart} 
          size="lg" 
          disabled={(!selectedTopic && !customTopic) || !p1Name || !p2Name}
          isLoading={isLoading}
          className="w-full md:w-auto min-w-[200px]"
        >
          {isLoading ? 'Summoning AI...' : 'Start Battle'}
        </Button>
      </div>
    </div>
  );
};

export default SetupScreen;