import { useLeaderboard } from '../hooks/useLeaderboard';

export function Leaderboard() {
  const { leaderboard, loading, error } = useLeaderboard(10);

  if (loading) {
    return <div className="p-4 text-center text-slate-400">Loading Leaderboard...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Failed to load leaderboard.</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-slate-900 rounded-xl border border-slate-800">
      <h2 className="text-xl font-bold text-white mb-4 text-center">Top Players</h2>
      <div className="flex flex-col gap-2">
        {leaderboard.length === 0 ? (
          <div className="text-center text-slate-500">No players yet.</div>
        ) : (
          leaderboard.map((entry, idx) => (
            <div key={idx} className="flex justify-between p-3 rounded-lg bg-slate-800/50">
              <span className="font-mono text-slate-300">
                {idx + 1}. {entry.address.slice(0,6)}...{entry.address.slice(-4)}
              </span>
              <span className="font-bold text-blue-400">{entry.score}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
