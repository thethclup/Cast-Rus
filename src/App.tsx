import React, { useEffect } from 'react';
import { ConnectModal } from './components/ConnectModal';
import { Leaderboard } from './components/Leaderboard';
import { useGM } from './hooks/useGM';
import { useScore } from './hooks/useScore';

function App() {
  const { sendGM, submitScore, isPending: isGMing } = useGM();
  const { gmCount, score, isGMCountLoading, isScoreLoading, refreshStats } = useScore();
  const [scoreInput, setScoreInput] = React.useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      refreshStats();
    }, 10000); // Check for updates periodically
    return () => clearInterval(interval);
  }, [refreshStats]);

  return (
    <div className="min-h-screen bg-slate-950 font-sans p-6 text-white selection:bg-[#0052FF]/30">
      <div className="max-w-4xl mx-auto flex flex-col gap-12 pt-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500">
              Onchain GM Game
            </h1>
            <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">
              Powered by Base & ERC-8021
            </p>
          </div>
          <ConnectModal />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Actions Panel */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-8 shadow-xl">
            
            {/* Say GM Section */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end mb-2">
                <h2 className="text-xl font-bold uppercase tracking-widest text-[#0052FF]">Say GM</h2>
                <span className="font-mono text-xs text-slate-400">
                  Daily Check-in
                </span>
              </div>
              <button 
                onClick={sendGM}
                disabled={isGMing}
                className="w-full py-4 bg-gradient-to-b from-[#0052FF] to-[#003BBA] hover:from-[#216BFF] hover:to-[#0052FF] text-white font-black text-xl uppercase tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(0,82,255,0.2)] hover:shadow-[0_0_30px_rgba(0,82,255,0.4)]"
              >
                {isGMing ? 'Transacting...' : 'Send GM'}
              </button>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 font-mono text-sm uppercase tracking-wider">Your GM Count</span>
                <span className="text-2xl font-black text-white">
                  {isGMCountLoading ? '...' : (gmCount ? gmCount.toString() : '0')}
                </span>
              </div>
            </div>

            <hr className="border-slate-800" />

            {/* Record Score Section */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end mb-2">
                <h2 className="text-xl font-bold uppercase tracking-widest text-emerald-500">Record Score</h2>
                <span className="font-mono text-xs text-slate-400">
                  Custom Score Submission
                </span>
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="number"
                  placeholder="Enter score"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 font-mono text-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button 
                  onClick={() => {
                    const val = parseInt(scoreInput);
                    if (!isNaN(val)) submitScore(val);
                  }}
                  disabled={!scoreInput}
                  className="py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 disabled:opacity-50"
                >
                  Submit
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 font-mono text-sm uppercase tracking-wider">High Score</span>
                <span className="text-2xl font-black text-white">
                  {isScoreLoading ? '...' : (score ? score.toString() : '0')}
                </span>
              </div>
            </div>

          </div>

          {/* Leaderboard Panel */}
          <div>
            <Leaderboard />
          </div>

        </div>

      </div>
    </div>
  );
}

export default App;

