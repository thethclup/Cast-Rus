import { useGameStore, SpellType } from '../../store/gameStore';

interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  type: string;
  active: boolean;
  velocityX: number;
  velocityY: number;
  spellType?: SpellType;
}

interface Particle {
  x: number;
  y: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number = 0;
  private lastTime: number = 0;
  
  private player = { x: 50, y: 0, width: 40, height: 60, velocityY: 0, isJumping: false, lane: 1 };
  private enemies: Entity[] = [];
  private spells: Entity[] = [];
  private particles: Particle[] = [];
  private collectables: Entity[] = [];
  
  private groundY: number = 0;
  private accumulator: number = 0;

  // Internal state to decouple from React rendering loop 
  private internalState = {
    score: 0,
    distance: 0,
    combo: 0,
    mana: 100,
    maxMana: 100,
    health: 3,
    maxHealth: 3,
    speed: 5,
  };

  // Keep track of what we last synced to React to avoid re-renders unless meaningful int changes occur
  private lastSyncedState = {
    score: 0,
    distance: 0,
    combo: 0,
    mana: 100,
    health: 3,
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.groundY = canvas.height - 100;
    this.player.y = this.groundY - this.player.height;
  }

  public start() {
    this.lastTime = performance.now();
    // Sync initial internal state from store
    const store = useGameStore.getState();
    this.internalState.score = store.score;
    this.internalState.distance = store.distance;
    this.internalState.combo = store.combo;
    this.internalState.mana = store.mana;
    this.internalState.health = store.health;
    this.internalState.speed = store.speed;

    this.lastSyncedState = {
      score: Math.floor(store.score),
      distance: Math.floor(store.distance),
      combo: store.combo,
      mana: Math.floor(store.mana),
      health: store.health,
    };
    
    this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
  }

  public stop() {
    cancelAnimationFrame(this.animationFrameId);
  }

  public jump() {
    if (!this.player.isJumping) {
      this.player.velocityY = -15;
      this.player.isJumping = true;
    }
  }

  public castSpell(type: SpellType) {
    const spellConfig = {
      FIRE: { color: '#ef4444', speed: 10, cost: 10 },
      FROST: { color: '#3b82f6', speed: 8, cost: 5 },
      ARCANE: { color: '#a855f7', speed: 12, cost: 15 },
      LIGHTNING: { color: '#eab308', speed: 15, cost: 12 }
    };
    
    const config = spellConfig[type];
    
    if (this.internalState.mana >= config.cost) {
      this.internalState.mana -= config.cost;

      this.spells.push({
        x: this.player.x + this.player.width,
        y: this.player.y + this.player.height / 2 - 10,
        width: 20,
        height: 20,
        color: config.color,
        type: 'spell',
        active: true,
        velocityX: config.speed,
        velocityY: 0,
        spellType: type
      });
      this.spawnParticles(this.player.x + this.player.width, this.player.y + this.player.height / 2, config.color, 5);
      
      this.syncStateIfNeeded();
    }
  }

  private spawnParticles(x: number, y: number, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x, y, color,
        size: Math.random() * 5 + 2,
        velocityX: (Math.random() - 0.5) * 10,
        velocityY: (Math.random() - 0.5) * 10,
        life: 0,
        maxLife: Math.random() * 20 + 10
      });
    }
  }

  private loop(timestamp: number) {
    const dt = timestamp - this.lastTime;
    this.lastTime = timestamp;
    
    const store = useGameStore.getState();

    if (store.gameState !== 'PLAYING') {
      this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
      return;
    }

    this.update(dt);
    this.draw();

    this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
  }

  private update(dt: number) {
    // Player physics
    this.player.velocityY += 0.8; // Gravity
    this.player.y += this.player.velocityY;

    if (this.player.y >= this.groundY - this.player.height) {
      this.player.y = this.groundY - this.player.height;
      this.player.velocityY = 0;
      this.player.isJumping = false;
    }

    // Distance and speed
    this.internalState.distance += this.internalState.speed * (dt / 16);
    
    // Spawn Logic
    this.accumulator += dt;
    if (this.accumulator > 1500 - Math.min(this.internalState.speed * 50, 1000)) {
      this.accumulator = 0;
      // Spawn enemy
      if (Math.random() > 0.3) {
        this.enemies.push({
          x: this.canvas.width,
          y: this.groundY - 50,
          width: 40,
          height: 50,
          color: '#10b981', // green goblin/orc
          type: 'enemy',
          active: true,
          velocityX: -(this.internalState.speed * 0.8),
          velocityY: 0
        });
      }
      // Spawn mana
      if (Math.random() > 0.5) {
        this.collectables.push({
          x: this.canvas.width + 100,
          y: this.groundY - 80 - Math.random() * 100,
          width: 15,
          height: 15,
          color: '#06b6d4', // cyan mana orb
          type: 'mana',
          active: true,
          velocityX: -(this.internalState.speed),
          velocityY: 0
        });
      }
    }

    // Spells
    for (const spell of this.spells) {
      if (!spell.active) continue;
      spell.x += spell.velocityX;
      if (spell.x > this.canvas.width) spell.active = false;

      // Spell - Enemy Collision
      for (const enemy of this.enemies) {
        if (!enemy.active) continue;
        if (this.checkCollision(spell, enemy)) {
          spell.active = false;
          enemy.active = false;
          this.spawnParticles(enemy.x, enemy.y, spell.color, 15);
          
          this.internalState.score += Math.floor(100 * (1 + this.internalState.combo * 0.1));
          this.internalState.combo += 1;
        }
      }
    }

    // Enemies
    for (const enemy of this.enemies) {
      if (!enemy.active) continue;
      enemy.x += enemy.velocityX;
      if (enemy.x < -enemy.width) {
        enemy.active = false;
        this.internalState.combo = 0; // Missed an enemy? reset combo
      }

      // Enemy - Player collision
      if (this.checkCollision(this.player, enemy)) {
        enemy.active = false;
        this.internalState.health = Math.max(0, this.internalState.health - 1);
        this.internalState.combo = 0;
        this.spawnParticles(this.player.x, this.player.y, '#ef4444', 20); // Player hit effect

        if (this.internalState.health <= 0) {
          this.syncStateIfNeeded(true);
          const store = useGameStore.getState();
          store.setGameState('GAME_OVER');
        }
      }
    }

    // Collectables
    for (const item of this.collectables) {
      if (!item.active) continue;
      item.x += item.velocityX;
      if (item.x < -item.width) item.active = false;

      if (this.checkCollision(this.player, item)) {
        item.active = false;
        if (item.type === 'mana') {
          this.internalState.mana = Math.min(this.internalState.maxMana, this.internalState.mana + 20);
        }
      }
    }

    // Particles
    for (const p of this.particles) {
      p.x += p.velocityX;
      p.y += p.velocityY;
      p.life++;
    }

    // Cleanup
    this.spells = this.spells.filter(s => s.active);
    this.enemies = this.enemies.filter(e => e.active);
    this.collectables = this.collectables.filter(c => c.active);
    this.particles = this.particles.filter(p => p.life < p.maxLife);

    // Increase speed subtly
    if (Math.random() < 0.01) {
      this.internalState.speed += 0.01;
    }

    this.syncStateIfNeeded();
  }

  // Only sync to Zustand store if the value crossed an integer boundary or a major event occurred
  private syncStateIfNeeded(force = false) {
    const s = this.internalState;
    const l = this.lastSyncedState;
    
    if (
      force ||
      Math.floor(s.distance) > l.distance ||
      Math.floor(s.score) > l.score ||
      Math.floor(s.mana) !== l.mana ||
      s.combo !== l.combo ||
      s.health !== l.health
    ) {
      this.lastSyncedState = {
        distance: Math.floor(s.distance),
        score: Math.floor(s.score),
        mana: Math.floor(s.mana),
        combo: s.combo,
        health: s.health
      };
      
      const store = useGameStore.getState();
      useGameStore.setState({
        distance: s.distance, // Store exact floats but only trigger updates sparingly
        score: s.score,
        mana: s.mana,
        combo: s.combo,
        health: s.health,
        speed: s.speed
      });
    }
  }

  private draw() {
    // Clear
    this.ctx.fillStyle = '#0f172a'; // Slate 900 background
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Ground
    this.ctx.fillStyle = '#1e293b';
    this.ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);

    // Player
    this.ctx.fillStyle = '#e2e8f0'; // player color
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    
    // Player glow
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = '#eab308'; // glowing aura when combo is high?
    
    // Enemies
    this.enemies.forEach(e => {
      this.ctx.fillStyle = e.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = e.color;
      this.ctx.fillRect(e.x, e.y, e.width, e.height);
    });

    // Collectables
    this.collectables.forEach(c => {
      this.ctx.fillStyle = c.color;
      this.ctx.beginPath();
      this.ctx.arc(c.x + c.width/2, c.y + c.height/2, c.width/2, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Spells
    this.spells.forEach(s => {
      this.ctx.fillStyle = s.color;
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = s.color;
      this.ctx.beginPath();
      this.ctx.arc(s.x + s.width/2, s.y + s.height/2, s.width/2, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Reset shadow
    this.ctx.shadowBlur = 0;

    // Particles
    this.particles.forEach(p => {
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = 1 - (p.life / p.maxLife);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalAlpha = 1.0;
    });
  }

  private checkCollision(rect1: any, rect2: any) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.height + rect1.y > rect2.y
    );
  }
}
