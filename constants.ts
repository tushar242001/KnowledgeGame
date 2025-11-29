import { LucideIcon, Brain, Music, Globe, Code, Zap, Film } from 'lucide-react';

export const POPULAR_TOPICS = [
  { label: 'General Knowledge', icon: Globe },
  { label: 'Science & Nature', icon: Zap },
  { label: 'Pop Culture', icon: Music },
  { label: 'History', icon: Brain },
  { label: 'Movies', icon: Film },
  { label: 'Technology', icon: Code },
];

export const PLAYER_CONFIG = [
  { color: 'cyan', bg: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500', ring: 'ring-cyan-500' },
  { color: 'fuchsia', bg: 'bg-fuchsia-500', text: 'text-fuchsia-400', border: 'border-fuchsia-500', ring: 'ring-fuchsia-500' },
];

export const TOTAL_ROUNDS = 5; // Each player gets this many questions
