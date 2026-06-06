import React from 'react';
import { SpellType } from '../../store/gameStore';

export const Controls = () => {
  const handleJump = () => {
    (window as any).gameEngine?.jump();
  };

  const castSpell = (type: SpellType) => {
    (window as any).gameEngine?.castSpell(type);
  };

  return (
    <div className="absolute bottom-4 left-0 w-full px-4 flex justify-between items-end z-10 font-sans select-none">
      <div className="flex-1">
        <button 
          className="w-24 h-24 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md border border-white/20 text-white font-bold text-xl active:scale-95 transition-all shadow-xl"
          onTouchStart={handleJump}
          onMouseDown={handleJump}
        >
          JUMP
        </button>
      </div>
      
      <div className="flex-1 right-controls flex flex-wrap justify-end gap-3 max-w-[200px]">
        <button 
          className="w-16 h-16 rounded-full bg-red-500/80 hover:bg-red-400 active:bg-red-600 text-white font-bold text-sm shadow-[0_0_15px_rgba(239,68,68,0.6)] active:scale-90 transition-all border border-red-300/50"
          onTouchStart={() => castSpell('FIRE')}
          onMouseDown={() => castSpell('FIRE')}
        >
          FIRE
        </button>
        <button 
          className="w-16 h-16 rounded-full bg-blue-500/80 hover:bg-blue-400 active:bg-blue-600 text-white font-bold text-sm shadow-[0_0_15px_rgba(59,130,246,0.6)] active:scale-90 transition-all border border-blue-300/50"
          onTouchStart={() => castSpell('FROST')}
          onMouseDown={() => castSpell('FROST')}
        >
          FROST
        </button>
        <button 
          className="w-16 h-16 rounded-full bg-purple-500/80 hover:bg-purple-400 active:bg-purple-600 text-white font-bold text-sm shadow-[0_0_15px_rgba(168,85,247,0.6)] active:scale-90 transition-all border border-purple-300/50"
          onTouchStart={() => castSpell('ARCANE')}
          onMouseDown={() => castSpell('ARCANE')}
        >
          ARC
        </button>
        <button 
          className="w-16 h-16 rounded-full bg-yellow-500/80 hover:bg-yellow-400 active:bg-yellow-600 text-white font-bold text-sm shadow-[0_0_15px_rgba(234,179,8,0.6)] active:scale-90 transition-all border border-yellow-300/50"
          onTouchStart={() => castSpell('LIGHTNING')}
          onMouseDown={() => castSpell('LIGHTNING')}
        >
          LIT
        </button>
      </div>
    </div>
  );
};
