import React from 'react';
import { useGameStore } from './store/gameStore';
import { GameCanvas } from './components/game/GameCanvas';
import { HUD } from './components/ui/HUD';
import { Controls } from './components/ui/Controls';
import { MainMenu } from './components/ui/MainMenu';
import { GameOver } from './components/ui/GameOver';
import { AnimatePresence } from 'motion/react';

function App() {
  const gameState = useGameStore(state => state.gameState);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 touch-none select-none">
      <GameCanvas />
      
      {gameState === 'PLAYING' && (
        <>
          <HUD />
          <Controls />
        </>
      )}

      <AnimatePresence>
        {gameState === 'MENU' && <MainMenu />}
        {gameState === 'GAME_OVER' && <GameOver />}
      </AnimatePresence>
    </div>
  );
}

export default App;
