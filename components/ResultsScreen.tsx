import React from 'react';
import { Player } from '../types';
import Button from './Button';
import { Trophy, Award, Repeat, Home } from 'lucide-react';
import { PLAYER_CONFIG } from '../constants';

interface ResultsScreenProps {
  players: Player[];
  onRestart: () => void;
  onHome: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ players, onRestart, onHome }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  const isTie = sortedPlayers[0].score === sortedPlayers[1].score;
  const winnerTheme = winner.id === 'p1' ? PLAYER_CONFIG[0] : PLAYER_CONFIG[1];

  return (
    <div className="w-full max-w-2xl mx-auto p-6 text-center animate-in zoom-in duration-500">
      
      <div className="mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl"></div>
        <Trophy className={`w-24 h-24 mx-auto mb-6 ${isTie ? 'text-slate-300' : 'text-yellow-400'} drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]`} />
        
        <h1 className="text-4xl md:text-6xl font-black text-white mb-2 uppercase tracking-tight">
          {isTie ? "It's a Draw!" : "Winner!"}
        </h1>
        {!isTie && (
          <p className={`text-2xl font-bold ${winnerTheme.text} animate-pulse`}>
            {winner.name}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-12">
        {players.map((p, idx) => {
            const config = p.id === 'p1' ? PLAYER_CONFIG[0] : PLAYER_CONFIG[1];
            const isWinner = !isTie && p.id === winner.id;
            
            return (
                <div key={p.id} className={`relative glass-panel rounded-2xl p-6 transition-all duration-500 ${isWinner ? 'border-yellow-500/50 scale-105 shadow-2xl bg-slate-800' : 'border-slate-700 opacity-80'}`}>
                    {isWinner && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <Award className="w-3 h-3" /> VICTOR
                        </div>
                    )}
                    <h3 className={`text-lg font-bold mb-2 ${config.text}`}>{p.name}</h3>
                    <div className="text-4xl font-black text-white">{p.score}</div>
                    <span className="text-xs text-slate-500 uppercase font-medium">Points</span>
                </div>
            )
        })}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={onRestart} variant="primary" size="lg">
           <Repeat className="w-5 h-5" /> Rematch
        </Button>
        <Button onClick={onHome} variant="secondary" size="lg">
           <Home className="w-5 h-5" /> New Topic
        </Button>
      </div>
    </div>
  );
};

export default ResultsScreen;