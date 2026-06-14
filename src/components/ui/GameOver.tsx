import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useAccount } from 'wagmi';
import { motion } from 'motion/react';
import { useGM } from '../../hooks/useGM';
import { submitScoreViaMcp } from '../../lib/baseMcp';
import { McpApprovalModal } from '../McpApprovalModal';

export const GameOver = () => {
  const { score, distance, resetGame, setGameState } = useGameStore();
  const { isConnected } = useAccount();
  const { sendGM, submitScore, isGMPending } = useGM();
  
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isSendPending, setIsSendPending] = useState(false);
  const [mcpApproval, setMcpApproval] = useState<{ url: string; id: string } | null>(null);

  const sayGM = async () => {
    if (!isConnected) return;
    try {
      const hash = await sendGM();
      if (hash) setTxHash(hash);
    } catch (err) {
      console.error(err);
    }
  };

  const recordRunWagmi = async () => {
    if (!isConnected) return;
    try {
      const hash = await submitScore(Math.floor(score));
      if (hash) {
        alert("Score transaction sent! Hash: " + hash);
        setTxHash(hash);
      }
    } catch (err: any) {
      console.error(err);
      alert("Transaction failed: " + err.message);
    }
  };

  const recordRunMCP = async () => {
    setIsSendPending(true);
    try {
      const result = await submitScoreViaMcp(Math.floor(score));
      if (result?.approvalUrl && result?.requestId) {
        setMcpApproval({ url: result.approvalUrl, id: result.requestId });
      } else {
        alert("MCP failed");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit score via Agent MCP.");
    } finally {
      setIsSendPending(false);
    }
  };

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
          onClick={sayGM}
          disabled={isGMPending || !isConnected}
          className="py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl active:scale-95 transition-all disabled:opacity-50"
        >
          {isGMPending ? 'TRANSACTING...' : 'SAY GM (Wagmi)'}
        </button>

        <button 
          disabled={!isConnected || isSendPending}
          onClick={recordRunWagmi}
          className="py-3 px-6 bg-slate-800 border border-slate-600 text-slate-200 font-bold rounded-xl active:scale-95 transition-all disabled:opacity-50"
        >
          {isSendPending ? 'RECORDING...' : 'RECORD RUN (Wagmi)'}
        </button>

        <button 
          disabled={isSendPending}
          onClick={recordRunMCP}
          className="py-3 px-6 bg-blue-900/50 border border-blue-500/50 text-blue-200 font-bold rounded-xl active:scale-95 transition-all disabled:opacity-50"
        >
          RECORD RUN (Agent MCP)
        </button>

      </div>

      {txHash && (
        <a 
          href={`https://basescan.org/tx/${txHash}`} 
          target="_blank" 
          rel="noreferrer"
          className="mt-6 text-emerald-400 text-sm font-mono hover:underline"
        >
          View TX on Basescan
        </a>
      )}

      {mcpApproval && (
        <McpApprovalModal
          approvalUrl={mcpApproval.url}
          requestId={mcpApproval.id}
          onCompleted={() => {
            alert("Score successfully submitted on-chain via Agent!");
            setMcpApproval(null);
          }}
          onFailed={() => {
            alert("Agent transaction failed.");
            setMcpApproval(null);
          }}
          onClose={() => setMcpApproval(null)}
          onRetry={recordRunMCP}
        />
      )}

      <button 
        onClick={() => setGameState('MENU')}
        className="mt-8 text-slate-400 hover:text-white transition-colors"
      >
        Return to Main Menu
      </button>
    </motion.div>
  );
};
