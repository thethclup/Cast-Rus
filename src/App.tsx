import React, { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { GameCanvas } from './components/game/GameCanvas';
import { HUD } from './components/ui/HUD';
import { Controls } from './components/ui/Controls';
import { MainMenu } from './components/ui/MainMenu';
import { GameOver } from './components/ui/GameOver';
import { AnimatePresence } from 'motion/react';
import { useAccount, useSendTransaction } from 'wagmi';
import { useSendCalls } from 'wagmi/experimental';
import { useCastRus } from './hooks/useCastRus';
import { parseAbi, encodeFunctionData } from 'viem';
import { DATA_SUFFIX_HEX } from './lib/erc8021';

function App() {
  const gameState = useGameStore(state => state.gameState);
  const { isConnected } = useAccount();
  const { pullTrigger, history, isPending } = useCastRus();
  const { sendTransactionAsync } = useSendTransaction();
  const { sendCallsAsync } = useSendCalls();
  const [showHistory, setShowHistory] = useState(false);
  const [isGMPending, setIsGMPending] = useState(false);

  const sendGMTransaction = async () => {
    setIsGMPending(true);
    try {
      const data = encodeFunctionData({
        abi: parseAbi(['function gm() external']),
        functionName: 'gm',
      });
      
      try {
        await sendCallsAsync({
          calls: [{
            to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
            data,
            value: 0n,
          }],
          capabilities: {
            dataSuffix: { value: DATA_SUFFIX_HEX, optional: true }
          }
        });
      } catch (e) {
        console.log('sendCalls rejected or unsupported, falling back to sendTransaction', e);
        await sendTransactionAsync({
          to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
          data: `${data}${DATA_SUFFIX_HEX}` as `0x${string}`,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGMPending(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 touch-none select-none">
      <GameCanvas />
      
      {isConnected && (
        <div className="absolute top-4 right-4 z-30 flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <button
              onClick={sendGMTransaction}
              disabled={isGMPending}
              className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 15a5 5 0 100-10 5 5 0 000 10zm7.07-12.07a1 1 0 010 1.41l-.71.71a1 1 0 11-1.41-1.41l.71-.71a1 1 0 011.41 0zM21 11h1a1 1 0 110 2h-1a1 1 0 110-2zM4.93 4.93a1 1 0 011.41 0l.71.71A1 1 0 115.64 7.05l-.71-.71a1 1 0 010-1.41zM3 11H2a1 1 0 100 2h1a1 1 0 100-2zm1.93 6.07l.71-.71a1 1 0 00-1.41-1.41l-.71.71a1 1 0 001.41 1.41zm13.14 0a1 1 0 001.41-1.41l-.71-.71a1 1 0 00-1.41 1.41l.71.71zM12 20a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z"/>
              </svg>
              {isGMPending ? 'Sending...' : 'Say GM'}
            </button>
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
