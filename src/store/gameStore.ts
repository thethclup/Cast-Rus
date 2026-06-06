import { create } from 'zustand';

export type GameState = 'MENU' | 'PLAYING' | 'GAME_OVER';
export type SpellType = 'FIRE' | 'FROST' | 'ARCANE' | 'LIGHTNING';

interface GameStore {
  gameState: GameState;
  score: number;
  distance: number;
  combo: number;
  mana: number;
  maxMana: number;
  health: number;
  maxHealth: number;
  speed: number;
  
  setGameState: (state: GameState) => void;
  addScore: (points: number) => void;
  updateDistance: (dist: number) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  useMana: (amount: number) => boolean;
  addMana: (amount: number) => void;
  takeDamage: (amount: number) => void;
  resetGame: () => void;
  increaseSpeed: (amount: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: 'MENU',
  score: 0,
  distance: 0,
  combo: 0,
  mana: 100,
  maxMana: 100,
  health: 3,
  maxHealth: 3,
  speed: 5,

  setGameState: (state) => set({ gameState: state }),
  addScore: (points) => set((state) => ({ score: state.score + points * (1 + state.combo * 0.1) })),
  updateDistance: (dist) => set({ distance: dist }),
  incrementCombo: () => set((state) => ({ combo: state.combo + 1 })),
  resetCombo: () => set({ combo: 0 }),
  useMana: (amount) => {
    const { mana } = get();
    if (mana >= amount) {
      set({ mana: mana - amount });
      return true;
    }
    return false;
  },
  addMana: (amount) => set((state) => ({ mana: Math.min(state.maxMana, state.mana + amount) })),
  takeDamage: (amount) => {
    const { health } = get();
    const newHealth = Math.max(0, health - amount);
    set({ health: newHealth, combo: 0 }); // reset combo on hit
    if (newHealth <= 0) {
      set({ gameState: 'GAME_OVER' });
    }
  },
  resetGame: () => set({
    gameState: 'PLAYING',
    score: 0,
    distance: 0,
    combo: 0,
    mana: 100,
    health: 3,
    speed: 5
  }),
  increaseSpeed: (amount) => set((state) => ({ speed: state.speed + amount }))
}));
