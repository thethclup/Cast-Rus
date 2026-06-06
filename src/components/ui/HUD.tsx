import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const HUD = () => {
  const { score, distance, combo, mana, maxMana, health, maxHealth } = useGameStore();

  return (
    <div className="absolute top-0 left-0 w-full p-4 pointer-events-none flex justify-between items-start z-10 text-white font-mono">
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-bold tracking-wider drop-shadow-md">
          SCORE: {Math.floor(score)}
        </div>
        <div className="text-xl drop-shadow-md">
          DIST: {Math.floor(distance)}m
        </div>
        {combo > 1 && (
          <div className="text-3xl text-yellow-400 font-black animate-pulse drop-shadow-lg mt-2">
            {combo}x COMBO
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex gap-1">
          {Array.from({ length: maxHealth }).map((_, i) => (
            <div 
              key={i} 
              className={`w-6 h-6 rounded-full border-2 border-red-500 ${i < health ? 'bg-red-500' : 'bg-transparent'}`}
            />
          ))}
        </div>
        <div className="w-48 h-4 bg-gray-800 rounded-full mt-2 overflow-hidden border border-cyan-900">
          <div 
            className="h-full bg-cyan-400 transition-all duration-200" 
            style={{ width: `${(mana / maxMana) * 100}%` }}
          />
        </div>
        <div className="text-xs text-cyan-200">MANA</div>
      </div>
    </div>
  );
};
