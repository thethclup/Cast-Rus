import { useState } from 'react';
import { useGM } from '../hooks/useGM';
import { useAccount } from 'wagmi';
import { useScore } from '../hooks/useScore';

export function AgentGMButton() {
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const { sendGM } = useGM();
  const { gmCount, refetch } = useScore(address);

  const handleAgentGM = async () => {
    setLoading(true);
    try {
      await sendGM();
      refetch();
    } catch (err) {
      console.error(err);
      alert('Failed to initiate agent GM.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={handleAgentGM}
        disabled={loading}
        className="py-3 px-6 bg-[#0052FF]/10 text-[#0052FF] border border-[#0052FF]/20 font-bold rounded-xl active:scale-95 transition-all hover:bg-[#0052FF]/20 flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        {loading ? 'INITIATING...' : 'AGENT GM'}
      </button>

      {gmCount !== null && gmCount > 0 && (
        <div className="text-sm text-center mt-2 text-slate-400 font-mono">
          Updated GM Count: {gmCount}
        </div>
      )}
    </>
  );
}
