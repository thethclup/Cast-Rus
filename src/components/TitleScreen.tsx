import { useGameStore } from '../store/useGameStore';
import { motion } from 'motion/react';
import { useAccount, useSendTransaction } from 'wagmi';
import { AgentGMButton } from './AgentGMButton';

export default function TitleScreen() {
  const setScreen = useGameStore((state) => state.setScreen);
  const { isConnected, address } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const handleSayGM = () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first to say gm onchain!");
      return;
    }
    
    // Send 0 ETH to own address to record the transaction onchain.
    // The Base attribution indexer picks this up by reading the ERC-8021 payload in calldata.
    try {
      sendTransaction({
        to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3', // GM contract
        value: 0n,
        data: '0x676d' // "gm" in hex
      });
      alert('Transaction triggered: "gm" request sent!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-20 text-white border-8 border-[#0052FF]">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center w-full max-w-md px-6 flex flex-col items-center justify-center gap-12"
      >
        <div className="flex flex-col items-center">
          <span className="text-[#0052FF] font-mono text-xs tracking-widest uppercase mb-4">Active Build: bc_bf05u641</span>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none flex items-center gap-2 md:gap-4 justify-center">
            CAST<span className="text-[#0052FF] underline decoration-4">RUSH</span><span className="text-xl md:text-2xl not-italic font-mono bg-white text-black px-2 py-1 ml-2 md:ml-4 self-center">V1.0</span>
          </h1>
        </div>
        
        <div className="flex flex-col gap-4 items-center w-full">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('playing')}
            className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-sm hover:invert transition-all flex items-center justify-center shadow-[10px_10px_0px_#0052FF]"
          >
            TAP TO RUSH
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSayGM}
            className="w-full py-4 bg-[#050505] text-[#0052FF] border-2 border-[#0052FF] font-black uppercase tracking-widest text-sm hover:bg-[#0052FF] hover:text-black transition-all flex items-center justify-center shadow-[10px_10px_0px_white]"
          >
            SAY GM ONCHAIN
          </motion.button>

          <AgentGMButton />
        </div>
        
        <p className="mt-4 text-[10px] text-white/50 font-mono tracking-widest uppercase">
          Tap to Jump • Swipe Down to Slide
        </p>
      </motion.div>
    </div>
  );
}
