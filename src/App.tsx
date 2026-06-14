import React, { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { GameCanvas } from './components/game/GameCanvas';
import { HUD } from './components/ui/HUD';
import { Controls } from './components/ui/Controls';
import { MainMenu } from './components/ui/MainMenu';
import { GameOver } from './components/ui/GameOver';
import { AnimatePresence } from 'motion/react';
import { useAccount } from 'wagmi';
import { useCastRus } from './hooks/useCastRus';

function App() {
  const gameState = useGameStore(state => state.gameState);
  const { isConnected } = useAccount();
  const { pullTrigger, history, isPending } = useCastRus();
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 touch-none select-none">
      <GameCanvas />
      
      {isConnected && (
        <div className="absolute top-4 right-4 z-30 flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-400 transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
            >
              History
            </button>
            <button
              onClick={pullTrigger}
              disabled={isPending}
              className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="4"/>
                <line x1="21.17" y1="8" x2="12" y2="8"/>
                <line x1="3.95" y1="6.06" x2="8.54" y2="14"/>
                <line x1="10.88" y1="21.94" x2="15.46" y2="14"/>
              </svg>
              {isPending ? 'Pulling...' : 'Pull Trigger'}
            </button>
          </div>
          
          {showHistory && history && history.length > 0 && (
            <div className="bg-black/80 border border-white/10 rounded overflow-hidden mt-2 p-2 w-64 max-h-48 overflow-y-auto">
              <h3 className="text-white text-xs font-bold mb-2 uppercase">Your Survival Log</h3>
              <div className="flex flex-col gap-1">
                {history.map((record, i) => (
                  <div key={i} className={`text-xs p-1 rounded ${record.survived ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {record.survived ? 'Survived' : 'Eliminated'} - {new Date(Number(record.timestamp) * 1000).toLocaleTimeString()}
                  </div>
                ))}
              </div>
            </div>
          )}
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
