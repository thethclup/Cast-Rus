import React from 'react';
import { useGameStore } from './store/gameStore';
import { GameCanvas } from './components/game/GameCanvas';
import { HUD } from './components/ui/HUD';
import { Controls } from './components/ui/Controls';
import { MainMenu } from './components/ui/MainMenu';
import { GameOver } from './components/ui/GameOver';
import { AnimatePresence } from 'motion/react';
import { useAccount } from 'wagmi';
import { useGM } from './hooks/useGM';

function App() {
  const gameState = useGameStore(state => state.gameState);
  const { isConnected } = useAccount();
  const { sendGM, isGMPending } = useGM();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 touch-none select-none">
      <GameCanvas />
      
      {isConnected && (
        <div className="absolute top-4 right-4 z-30">
          <button
            onClick={sendGM}
            disabled={isGMPending}
            className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 15a5 5 0 100-10 5 5 0 000 10zm7.07-12.07a1 1 0 010 1.41l-.71.71a1 1 0 11-1.41-1.41l.71-.71a1 1 0 011.41 0zM21 11h1a1 1 0 110 2h-1a1 1 0 110-2zM4.93 4.93a1 1 0 011.41 0l.71.71A1 1 0 115.64 7.05l-.71-.71a1 1 0 010-1.41zM3 11H2a1 1 0 100 2h1a1 1 0 100-2zm1.93 6.07l.71-.71a1 1 0 00-1.41-1.41l-.71.71a1 1 0 001.41 1.41zm13.14 0a1 1 0 001.41-1.41l-.71-.71a1 1 0 00-1.41 1.41l.71.71zM12 20a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z"/>
            </svg>
            {isGMPending ? 'Sending...' : 'Say GM'}
          </button>
        </div>
      )}

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
