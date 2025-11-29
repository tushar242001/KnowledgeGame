export interface Player {
  id: string;
  name: string;
  score: number;
  color: string; // Tailwind class prefix e.g., 'blue', 'pink'
  avatar: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string; // Brief fun fact
}

export type GameStatus = 'SETUP' | 'LOADING' | 'PLAYING' | 'ROUND_TRANSITION' | 'FINISHED';

export interface GameState {
  status: GameStatus;
  topic: string;
  rounds: number;
  currentRound: number;
  currentPlayerIndex: number; // 0 or 1
  questions: Question[]; // All questions for the game
  currentQuestionIndex: number;
}

export type Theme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
};