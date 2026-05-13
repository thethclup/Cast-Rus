import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import TitleScreen from './components/TitleScreen';
import GameOverScreen from './components/GameOverScreen';
import WalletConnect from './components/WalletConnect';
import { useGameStore } from './store/useGameStore';

export default function App() {
  const screen = useGameStore((state) => state.screen);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505] touch-none select-none font-sans">
      <WalletConnect />
      
      {screen !== 'title' && <GameCanvas />}
      {screen === 'playing' && <HUD />}
      
      {screen === 'title' && <TitleScreen />}
      {screen === 'game_over' && <GameOverScreen />}
    </div>
  );
}

