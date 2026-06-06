import React, { useEffect, useRef } from 'react';
import { GameEngine } from './engine';
import { useGameStore } from '../../store/gameStore';

export const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const gameState = useGameStore(state => state.gameState);

  useEffect(() => {
    if (canvasRef.current && !engineRef.current) {
      engineRef.current = new GameEngine(canvasRef.current);
    }

    if (gameState === 'PLAYING' && engineRef.current) {
      engineRef.current.start();
    } else if (gameState === 'GAME_OVER' && engineRef.current) {
      engineRef.current.stop();
    }

    return () => {
      engineRef.current?.stop();
    };
  }, [gameState]);

  // Expose the engine globally so UI can interact with it (simplistic approach for this scope)
  useEffect(() => {
    if (engineRef.current) {
      (window as any).gameEngine = engineRef.current;
    }
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      width={window.innerWidth} 
      height={window.innerHeight} 
      className="absolute inset-0 w-full h-full block" 
    />
  );
};
