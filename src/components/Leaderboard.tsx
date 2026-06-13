import { useScore } from "../hooks/useScore";

export function Leaderboard() {
  const { topPlayers, isLeaderboardLoading } = useScore();

  if (isLeaderboardLoading) {
    return <div className="text-slate-400 font-mono text-center animate-pulse">Loading Leaderboard...</div>;
  }

  if (!topPlayers || topPlayers[0].length === 0) {
    return <div className="text-slate-500 font-mono text-center italic">No scores recorded yet.</div>;
  }

  const addresses = topPlayers[0];
  const scores = topPlayers[1];

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <div className="bg-slate-800 py-3 px-4 border-b border-slate-700">
        <h3 className="text-white font-black italic tracking-widest text-center">ONCHAIN LEADERBOARD</h3>
      </div>
      <div className="flex flex-col">
        {addresses.map((addr, index) => {
          if (addr === '0x0000000000000000000000000000000000000000') return null;
          
          return (
            <div key={`${addr}-${index}`} className="flex justify-between items-center py-3 px-4 border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-slate-500 font-bold tabular-nums w-4">{index + 1}.</span>
                <span className="font-mono text-[#0052FF]">
                  {addr.substring(0, 6)}...{addr.substring(addr.length - 4)}
                </span>
              </div>
              <span className="font-bold text-white tabular-nums">{scores[index].toString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
