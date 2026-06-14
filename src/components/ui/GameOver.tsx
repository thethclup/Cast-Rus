import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useAccount } from 'wagmi';
import { motion } from 'motion/react';
import { useCastRus } from '../../hooks/useCastRus';

export const GameOver = () => {
  const { score, distance, resetGame, setGameState } = useGameStore();
  const { isConnected } = useAccount();
  const { pullTrigger, isPending } = useCastRus();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 bg-red-950/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center"
    >
      <h2 className="text-5xl md:text-7xl font-black text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] mb-8 tracking-widest uppercase">
        RUN OVER
      </h2>
      
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-red-500/20 mb-8 w-full max-w-sm">
        <div className="text-slate-400 font-mono mb-1 text-sm">FINAL SCORE</div>
        <div className="text-4xl font-bold text-white mb-4">{Math.floor(score)}</div>
        
        <div className="text-slate-400 font-mono mb-1 text-sm">DISTANCE</div>
        <div className="text-2xl font-bold text-blue-400">{Math.floor(distance)}m</div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button 
          onClick={() => resetGame()}
          className="py-3 px-6 bg-white text-slate-900 font-bold rounded-xl active:scale-95 transition-all text-lg"
        >
          TRY AGAIN
        </button>
        
        <button 
          disabled={!isConnected || isPending}
          onClick={pullTrigger}
          className="py-3 px-6 bg-slate-800 border border-slate-600 text-slate-200 font-bold rounded-xl active:scale-95 transition-all disabled:opacity-50"
        >
          {isPending ? 'PULLING TRIGGER...' : 'PULL TRIGGER'}
        </button>

      </div>

      <button 
        onClick={() => setGameState('MENU')}
        className="mt-8 text-slate-400 hover:text-white transition-colors"
      >
        Return to Main Menu
      </button>
    </motion.div>
  );
};
