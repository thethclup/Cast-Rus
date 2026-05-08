import { create } from 'zustand';

export type GameScreen = 'title' | 'playing' | 'game_over' | 'leaderboard';

interface GameState {
  screen: GameScreen;
  score: number;
  likes: number;
  combo: number;
  isViralMode: boolean;
  memeEnergy: number;
  distance: number;
  highScore: number;
  
  setScreen: (screen: GameScreen) => void;
  addScore: (points: number) => void;
  addLikes: (amount: number) => void;
  setCombo: (combo: number) => void;
  setViralMode: (isViral: boolean) => void;
  addMemeEnergy: (amount: number) => void;
  setDistance: (distance: number) => void;
  gameOver: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  screen: 'title',
  score: 0,
  likes: 0,
  combo: 1,
  isViralMode: false,
  memeEnergy: 0,
  distance: 0,
  highScore: 0,

  setScreen: (screen) => set({ screen }),
  addScore: (points) => set((state) => ({ score: state.score + points * state.combo })),
  addLikes: (amount) => set((state) => ({ 
    likes: state.likes + amount,
    isViralMode: state.likes + amount >= 50 ? true : state.isViralMode // triggers viral mode at 50 likes
  })),
  setCombo: (combo) => set({ combo }),
  setViralMode: (isViralMode) => set({ isViralMode }),
  addMemeEnergy: (amount) => set((state) => ({ memeEnergy: Math.min(100, state.memeEnergy + amount) })),
  setDistance: (distance) => set({ distance }),
  
  gameOver: () => set((state) => {
    const newHighScore = Math.max(state.highScore, state.distance);
    return { screen: 'game_over', highScore: newHighScore };
  }),
  
  resetGame: () => set({
    screen: 'playing',
    score: 0,
    likes: 0,
    combo: 1,
    isViralMode: false,
    memeEnergy: 0,
    distance: 0,
  }),
}));
