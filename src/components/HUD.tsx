import { useGameStore } from '../store/useGameStore';

export default function HUD() {
  const { score, likes, combo, isViralMode, distance } = useGameStore();

  return (
    <div className="absolute top-0 left-0 w-full p-6 pointer-events-none flex justify-between items-start z-10 text-white">
      <div className="flex flex-col gap-4">
        <div className="space-y-1 text-left">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#0052FF] font-bold">Farthest Run</p>
          <p className="text-4xl md:text-6xl font-black tracking-tighter leading-none">{distance}<span className="text-sm uppercase font-mono ml-2">m</span></p>
        </div>
        <div className="space-y-1 text-left opacity-60">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Viral Score</p>
          <p className="text-2xl md:text-4xl font-black tracking-tighter leading-none">{score}</p>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2 min-w-[120px] mt-12 md:mt-0">
        <div className="flex justify-between items-center border-b border-white/10 pb-2 w-full gap-4">
          <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">Likes</span>
          <span className="text-xl font-black text-[#0052FF]">{likes}</span>
        </div>
        {combo > 1 && (
          <div className="flex justify-between items-center border-b border-white/10 pb-2 w-full gap-4 animate-pulse">
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">Combo</span>
            <span className="text-xl font-black text-green-400">x{combo}</span>
          </div>
        )}
        {isViralMode && (
          <div className="bg-[#0052FF] p-2 text-black w-full text-center rotate-[-2deg] mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest">Viral Mode</p>
            <p className="text-xl font-black tracking-tighter leading-none">ACTIVE</p>
          </div>
        )}
      </div>
    </div>
  );
}
