import { useGameStore } from '../store/gameStore';
import { motion } from 'motion/react';
import { useAccount, useWriteContract } from 'wagmi';

const GAME_ABI = [
  {
    type: 'function',
    name: 'recordScore',
    inputs: [{ name: 'score', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable'
  }
] as const;

export default function GameOverScreen() {
  const { score, distance, resetGame } = useGameStore();
  const { isConnected, address } = useAccount();
  const { writeContract } = useWriteContract();

  const handleSubmitScore = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first!");
      return;
    }
    
    try {
      writeContract({
        address: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3', // standard GM contract
        abi: GAME_ABI,
        functionName: 'recordScore',
        args: [BigInt(Math.floor(score))]
      });
      alert("Score verification transaction sent! (Simulated)");
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505]/95 backdrop-blur-sm z-30 text-white font-mono p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-black p-8 border-l-8 border-red-600 shadow-[10px_10px_0px_#0052FF] max-w-md w-full"
      >
        <div className="bg-red-600/10 border-l-4 border-red-600 p-4 mb-8">
          <h2 className="text-4xl font-black text-red-500 italic tracking-tighter leading-none">FEED CRASHED</h2>
        </div>
        
        <div className="space-y-4 mb-8 font-sans">
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-mono uppercase tracking-widest opacity-60">Status</span>
            <span className="font-bold text-red-500 uppercase text-xs tracking-widest">Ratioed</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-mono uppercase tracking-widest opacity-60">Distance</span>
            <span className="font-black text-2xl">{distance}m</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-mono uppercase tracking-widest opacity-60">Score</span>
            <span className="font-black text-2xl text-[#0052FF]">{score}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 font-sans">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetGame}
            className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-sm hover:invert transition-all"
          >
            PLAY AGAIN
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmitScore}
            className="w-full py-4 bg-[#050505] text-green-400 border border-green-400/30 font-black uppercase tracking-widest text-sm hover:bg-green-400 hover:text-black transition-all flex items-center justify-center gap-2"
          >
            RECORD ON BASE <span className="text-[10px] border border-current px-1 select-none">SIWE</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
