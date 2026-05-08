import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  markedForDeletion?: boolean;
}

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { screen, setDistance, addLikes, addScore, gameOver, isViralMode } = useGameStore();

  useEffect(() => {
    if (screen !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Game Variables
    let animationFrameId: number;
    let speed = 5;
    let distanceTraveled = 0;
    
    // Player
    const player = {
      x: 100,
      y: canvas.height / 2,
      width: 40,
      height: 60,
      vy: 0,
      gravity: 0.6,
      jumpPower: -12,
      isGrounded: false,
      isSliding: false,
    };

    // Entities
    const platforms: Entity[] = [];
    const hazards: Entity[] = [];
    const collectibles: Entity[] = [];

    // Procedural generation state
    let frameCount = 0;

    // Input Handling
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      if (player.isGrounded) {
        player.vy = player.jumpPower;
        player.isGrounded = false;
      }
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      if (touchEndY - touchStartY > 50) {
        // Swipe down -> slide
        player.isSliding = true;
        player.height = 30; // crouch
        if (player.isGrounded) player.y = canvas.height - 100 - player.height;
        if (navigator.vibrate) navigator.vibrate(20);
        setTimeout(() => {
          player.isSliding = false;
          player.height = 60;
          if (player.isGrounded) player.y = canvas.height - 100 - player.height;
        }, 500);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && player.isGrounded) {
        player.vy = player.jumpPower;
        player.isGrounded = false;
        if (navigator.vibrate) navigator.vibrate(20);
      } else if (e.code === 'ArrowDown') {
        player.isSliding = true;
        player.height = 30;
        if (player.isGrounded) player.y = canvas.height - 100 - player.height;
        if (navigator.vibrate) navigator.vibrate(20);
        setTimeout(() => {
          player.isSliding = false;
          player.height = 60;
          if (player.isGrounded) player.y = canvas.height - 100 - player.height;
        }, 500);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);

    // Initialization: add ground
    platforms.push({ x: 0, y: canvas.height - 100, width: canvas.width * 2, height: 100, type: 'ground' });

    // Game Loop
    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Increase difficulty
      speed += 0.001;
      distanceTraveled += speed / 10;
      frameCount++;

      if (frameCount % 10 === 0) {
        setDistance(Math.floor(distanceTraveled));
      }

      // Spawner
      if (frameCount % 120 === 0) {
        // Spawn Platform
        platforms.push({
          x: canvas.width,
          y: canvas.height - 150 - Math.random() * 150,
          width: 150 + Math.random() * 200,
          height: 30,
          type: 'platform'
        });
      }

      if (frameCount % 90 === 0 && Math.random() > 0.5) {
         // Spawns either a ground hazard (must jump over) or a high hazard (must slide under)
         const isHigh = Math.random() > 0.5;
         hazards.push({
           x: canvas.width,
           y: isHigh ? canvas.height - 180 : canvas.height - 140, 
           width: 40,
           height: 40,
           type: 'toxic'
         });
      }

      if (frameCount % 60 === 0 && Math.random() > 0.3) {
         // Spawn Collectible
         collectibles.push({
           x: canvas.width,
           y: canvas.height - 200 - Math.random() * 200,
           width: 30,
           height: 30,
           type: 'like'
         });
      }

      // Player Physics
      player.vy += player.gravity;
      player.y += player.vy;

      // Ground Collision (default ground)
      if (player.y + player.height > canvas.height - 100) {
        player.y = canvas.height - 100 - player.height;
        player.vy = 0;
        player.isGrounded = true;
      }

      // Draw and update entities
      const drawEntities = (arr: Entity[], color: string, isHazard = false) => {
        for (let i = arr.length - 1; i >= 0; i--) {
          const ent = arr[i];
          ent.x -= speed;
          
          ctx.fillStyle = color;
          
          if (ent.type === 'like') { // draw viral orb
             ctx.fillStyle = '#0052FF';
             ctx.beginPath();
             ctx.arc(ent.x + 15, ent.y + 15, 15, 0, Math.PI * 2);
             ctx.fill();
             // Inner star / shine
             ctx.fillStyle = '#FFFFFF';
             ctx.beginPath();
             ctx.arc(ent.x + 10, ent.y + 10, 4, 0, Math.PI * 2);
             ctx.fill();
          } else if (ent.type === 'toxic') {
             ctx.fillStyle = '#dc2626'; // red-600
             ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
          } else {
             ctx.fillStyle = '#111111'; // subtle platform
             ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
             
             // Top border for style
             ctx.fillStyle = '#0052FF';
             ctx.fillRect(ent.x, ent.y, ent.width, 2);
          }

          // Collision detection
          if (
            player.x < ent.x + ent.width &&
            player.x + player.width > ent.x &&
            player.y < ent.y + ent.height &&
            player.y + player.height > ent.y
          ) {
            if (isHazard) {
              if (isViralMode) {
                 // Invincible
                 ent.markedForDeletion = true;
                 if (navigator.vibrate) navigator.vibrate(50);
              } else {
                 if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                 gameOver();
              }
            } else if (ent.type === 'like') {
              addLikes(1);
              addScore(10);
              if (navigator.vibrate) navigator.vibrate(10);
              ent.markedForDeletion = true;
            } else if (ent.type === 'platform') {
              // Basic platform collision (top only)
              if (player.vy > 0 && player.y + player.height - player.vy <= ent.y) {
                player.y = ent.y - player.height;
                player.vy = 0;
                player.isGrounded = true;
              }
            }
          }

          if (ent.x + ent.width < 0 || ent.markedForDeletion) {
            arr.splice(i, 1);
          }
        }
      };

      drawEntities(platforms, '#111'); // Platforms
      drawEntities(hazards, '#dc2626', true); // Hazards
      drawEntities(collectibles, '#0052FF'); // Collectibles

      // Draw Player
      ctx.fillStyle = isViralMode ? '#0052FF' : '#ffffff'; // Editorial White or Blue
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Draw 'isSliding' visual
      if (player.isSliding) {
        ctx.fillStyle = '#0052FF';
        ctx.fillRect(player.x, player.y - 10, player.width, 10);
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [screen, isViralMode, gameOver, addLikes, addScore, setDistance]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${isViralMode ? 'bg-[#050505] opacity-90 transition-opacity' : 'bg-[#050505]'}`}
    />
  );
}
