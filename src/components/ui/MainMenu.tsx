import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useAccount, useConnect } from 'wagmi';
import { motion } from 'motion/react';
import { Leaderboard } from '../Leaderboard';

export const MainMenu = () => {
  const setGameState = useGameStore(state => state.setGameState);
  const { isConnected, address } = useAccount();
  const { connectors, connect } = useConnect();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-8"
      >
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] tracking-tighter">
          CAST<br/>RUSH
        </h1>
        <p className="text-cyan-200 mt-4 text-sm md:text-base max-w-md mx-auto font-mono">
          ERC-8021 Attribution. Dash, cast, and survive.
        </p>
      </motion.div>

      <div className="flex flex-col gap-4 w-full max-w-xs mb-8">
        <button 
          onClick={() => setGameState('PLAYING')}
          className="py-4 px-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-bold text-xl uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] active:scale-95 transition-all"
        >
          START RUSH
        </button>

        {!isConnected ? (
          connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              className="py-3 px-6 bg-slate-800 border border-slate-600 rounded-xl text-slate-300 font-bold hover:bg-slate-700 active:scale-95 transition-all"
            >
              Connect {connector.name}
            </button>
          ))
        ) : (
          <div className="py-3 px-6 bg-slate-800/50 border border-emerald-500/30 rounded-xl text-emerald-400 font-mono text-sm">
            Connected: {address?.slice(0,6)}...{address?.slice(-4)}
          </div>
        )}
      </div>

      <div className="w-full max-w-md max-h-64 overflow-y-auto">
        <Leaderboard />
      </div>
    </motion.div>
  );
};

