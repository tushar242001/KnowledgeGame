import React, { useState } from 'react';
import SetupScreen from './components/SetupScreen';
import GamePlayScreen from './components/GamePlayScreen';
import ResultsScreen from './components/ResultsScreen';
import { GameState, GameStatus, Player } from './types';
import { generateQuestions } from './services/gemini';
import { TOTAL_ROUNDS } from './constants';
import { Loader2 } from 'lucide-react';

const INITIAL_PLAYERS: Player[] = [
  { id: 'p1', name: 'Player 1', score: 0, color: 'cyan', avatar: '' },
  { id: 'p2', name: 'Player 2', score: 0, color: 'fuchsia', avatar: '' },
];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    status: 'SETUP',
    topic: '',
    rounds: TOTAL_ROUNDS,
    currentRound: 1,
    currentPlayerIndex: 0,
    questions: [],
    currentQuestionIndex: 0,
  });

  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartGame = async (p1Name: string, p2Name: string, topic: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Need 2 questions per round (one for each player) * total rounds
      const questionsNeeded = TOTAL_ROUNDS * 2;
      const questions = await generateQuestions(topic, questionsNeeded);

      setPlayers([
        { ...players[0], name: p1Name, score: 0 },
        { ...players[1], name: p2Name, score: 0 },
      ]);

      setGameState({
        status: 'PLAYING',
        topic,
        rounds: TOTAL_ROUNDS,
        currentRound: 1,
        currentPlayerIndex: 0, // Player 1 starts
        questions,
        currentQuestionIndex: 0,
      });

    } catch (err) {
      setError("Failed to generate questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      const updatedPlayers = [...players];
      updatedPlayers[gameState.currentPlayerIndex].score += 100;
      setPlayers(updatedPlayers);
    }

    // Determine next step
    const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % 2;
    const nextQuestionIndex = gameState.currentQuestionIndex + 1;
    
    // If we just finished Player 2's turn, increment round
    const isRoundComplete = nextPlayerIndex === 0;
    const nextRound = isRoundComplete ? gameState.currentRound + 1 : gameState.currentRound;

    if (nextQuestionIndex >= gameState.questions.length) {
      setGameState(prev => ({ ...prev, status: 'FINISHED' }));
    } else {
      setGameState(prev => ({
        ...prev,
        currentPlayerIndex: nextPlayerIndex,
        currentQuestionIndex: nextQuestionIndex,
        currentRound: nextRound
      }));
    }
  };

  const handleRestart = async () => {
     // Replay with same players and topic? Or same players new questions?
     // Let's keep players, regenerate questions for same topic
     if (gameState.topic) {
        await handleStartGame(players[0].name, players[1].name, gameState.topic);
     }
  };

  const handleHome = () => {
    setGameState({
        status: 'SETUP',
        topic: '',
        rounds: TOTAL_ROUNDS,
        currentRound: 1,
        currentPlayerIndex: 0,
        questions: [],
        currentQuestionIndex: 0,
    });
    setPlayers(INITIAL_PLAYERS);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambient Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <div className="relative z-10 w-full">
        {gameState.status === 'SETUP' && (
          <SetupScreen onStart={handleStartGame} isLoading={isLoading} />
        )}

        {gameState.status === 'PLAYING' && (
          <GamePlayScreen 
            currentPlayer={players[gameState.currentPlayerIndex]}
            players={players}
            question={gameState.questions[gameState.currentQuestionIndex]}
            currentRound={gameState.currentRound}
            totalRounds={gameState.rounds}
            onAnswer={handleAnswer}
          />
        )}

        {gameState.status === 'FINISHED' && (
          <ResultsScreen 
            players={players}
            onRestart={handleRestart}
            onHome={handleHome}
          />
        )}
        
        {error && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4">
                {error}
                <button onClick={() => setError(null)} className="ml-4 underline">Dismiss</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default App;