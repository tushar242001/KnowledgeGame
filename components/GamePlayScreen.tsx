import React, { useState, useEffect } from 'react';
import { Player, Question } from '../types';
import { PLAYER_CONFIG } from '../constants';
import Button from './Button';
import { Timer, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface GamePlayScreenProps {
  currentPlayer: Player;
  players: Player[];
  question: Question;
  currentRound: number;
  totalRounds: number;
  onAnswer: (isCorrect: boolean) => void;
}

const GamePlayScreen: React.FC<GamePlayScreenProps> = ({
  currentPlayer,
  players,
  question,
  currentRound,
  totalRounds,
  onAnswer,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  
  const playerTheme = currentPlayer.id === 'p1' ? PLAYER_CONFIG[0] : PLAYER_CONFIG[1];
  const opponent = players.find(p => p.id !== currentPlayer.id);
  const opponentTheme = currentPlayer.id === 'p1' ? PLAYER_CONFIG[1] : PLAYER_CONFIG[0];

  useEffect(() => {
    if (isRevealed) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Time run out
      handleAnswer(-1); 
    }
  }, [timeLeft, isRevealed]);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsRevealed(false);
    setTimeLeft(15);
  }, [question]);

  const handleAnswer = (index: number) => {
    if (isRevealed) return;
    
    setSelectedOption(index);
    setIsRevealed(true);
    
    // Delay reporting back to parent to allow animation
    setTimeout(() => {
        onAnswer(index === question.correctAnswerIndex);
    }, 2500); // 2.5 seconds to read the result/explanation
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 flex flex-col min-h-screen md:min-h-0 md:h-auto justify-center">
      
      {/* HUD */}
      <div className="flex justify-between items-end mb-8 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
        <div className="flex flex-col">
           <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Round {currentRound}/{totalRounds}</span>
           <div className={`flex items-center gap-3 ${playerTheme.text}`}>
             <div className={`w-3 h-3 rounded-full ${playerTheme.bg} animate-pulse`}></div>
             <span className="text-xl font-bold">{currentPlayer.name}'s Turn</span>
           </div>
        </div>

        <div className="flex flex-col items-center">
             <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                 timeLeft <= 5 ? 'border-red-500 text-red-500 scale-110' : 'border-slate-600 text-slate-300'
             }`}>
                <span className="font-mono font-bold text-lg">{timeLeft}</span>
             </div>
        </div>

        <div className="flex flex-col items-end opacity-60">
           <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Opponent</span>
           <div className={`flex items-center gap-2 ${opponentTheme.text}`}>
             <span className="font-medium">{opponent?.name}</span>
             <div className={`w-2 h-2 rounded-full ${opponentTheme.bg}`}></div>
           </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-panel p-8 rounded-3xl mb-6 shadow-2xl relative overflow-hidden group">
        <div className={`absolute top-0 left-0 w-1 h-full ${playerTheme.bg}`}></div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-snug">
          {question.text}
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {question.options.map((option, index) => {
            let stateClass = "border-slate-700 bg-slate-800/40 hover:bg-slate-700/60";
            
            if (isRevealed) {
                if (index === question.correctAnswerIndex) {
                    stateClass = "border-green-500 bg-green-500/20 text-green-200 shadow-[0_0_10px_rgba(34,197,94,0.3)]";
                } else if (index === selectedOption) {
                    stateClass = "border-red-500 bg-red-500/20 text-red-200";
                } else {
                    stateClass = "border-slate-800 bg-slate-900/40 opacity-50";
                }
            } else if (selectedOption === index) {
                 stateClass = `border-blue-500 bg-blue-600/20`; // Temporary selected state before reveal (unlikely to see due to instant setRevealed)
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={isRevealed}
                className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-300 flex items-center justify-between group ${stateClass}`}
              >
                <span className="font-medium text-lg">{option}</span>
                {isRevealed && index === question.correctAnswerIndex && <CheckCircle className="w-6 h-6 text-green-500" />}
                {isRevealed && index === selectedOption && index !== question.correctAnswerIndex && <XCircle className="w-6 h-6 text-red-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation Toast (Shows after answer) */}
      <div className={`transform transition-all duration-500 ${isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-start gap-3 shadow-xl">
            <AlertCircle className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
            <div>
                <h4 className="font-bold text-slate-200 text-sm uppercase mb-1">Did you know?</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{question.explanation}</p>
            </div>
        </div>
      </div>

    </div>
  );
};

export default GamePlayScreen;