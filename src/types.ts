export type GameState = 'start' | 'playing' | 'end' | 'victory' | 'leaderboard';

export type Difficulty = 'normal' | 'hard';

export interface Player {
  health: number;
  attack: number;
  defense: number;
  mana: number;
}

export interface Enemy {
  name: string;
  health: number;
  attack: number;
  defense: number;
  isEnraged: boolean;
}

export interface Skill {
  name: string;
  manaCost: number;
  damage?: number;
  effect?: 'defense';
}

export interface EasterEgg {
  name: string;
  description: string;
  effect: 'damage' | 'buff' | 'heal' | 'skipEnemyTurn' | 'debuff' | 'evasion' | 'speed' | 'invincible' | 'allBuff' | 'cooldown' | 'accuracy' | 'block' | 'criticalHit' | 'dot' | 'extraTurn' | 'elementalAttack' | 'confusion' | 'clone' | 'skillEvolution' | 'mutualHeal';
  value?: number;
  duration?: number;
  animation: string;
}

export interface LeaderboardEntry {
  playerName: string;
  difficulty: Difficulty;
  clearTime: number;
}