export type ZombieType =
  | 'walker'
  | 'runner'
  | 'armored'
  | 'jumper'
  | 'giant'
  | 'sneaky'
  | 'exploding'
  | 'flying'
  | 'boss';

export type ObstacleType =
  | 'tnt'
  | 'crate'
  | 'rock'
  | 'hanging_crate'
  | 'spikes'
  | 'bounce_pad'
  | 'wind'
  | 'gate'
  | 'switch'
  | 'portal';

export interface PlatformConfig {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type?: 'ground' | 'floating' | 'pillar' | 'moving' | 'slippery';
  movingPath?: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    speed: number;
  };
}

export interface ObstacleConfig {
  id: string;
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
  health?: number;
  gateId?: string; // For switch linked to gate
  targetPortalId?: string; // For portal teleportation pair
  windStrength?: { x: number; y: number };
}

export interface ZombieConfig {
  id: string;
  type: ZombieType;
  x: number;
  y: number;
  health?: number;
  speed?: number;
  patrolMin?: number;
  patrolMax?: number;
}

export type ArrowType = 'regular' | 'bomb';

export interface LevelConfig {
  id: number;
  title: string;
  chapter: number;
  worldWidth: number;
  worldHeight: number;
  playerPos: { x: number; y: number };
  platforms: PlatformConfig[];
  obstacles: ObstacleConfig[];
  zombies: ZombieConfig[];
  arrowLimit: number | null; // null means unlimited
  parArrows: number; // shoot <= parArrows for 3 stars
  gravity?: { x: number; y: number };
  wind?: { x: number; y: number };
  description?: string;
  weather?: 'clear' | 'rain' | 'snow' | 'hellfire' | 'toxic';
}

export interface TrajectoryPoint {
  x: number;
  y: number;
  isBounce?: boolean;
  isTargetingZombie?: boolean;
}

export interface ParticleEntity {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'star' | 'splat' | 'wood' | 'smoke' | 'spark' | 'ice' | 'flame' | 'shockwave';
}

export interface FloatText {
  id: number;
  text: string;
  x: number;
  y: number;
  vy: number;
  color: string;
  opacity: number;
  scale: number;
}

export interface ArrowEntity {
  id: number;
  body: any; // Matter.Body
  inFlight: boolean;
  stuck: boolean;
  stuckAngle?: number;
  stuckOffset?: { x: number; y: number };
  stuckToBodyId?: number;
  angle: number;
  trail: { x: number; y: number }[];
  penetration?: number;
  bounces?: number;
  maxBounces?: number;
  arrowType?: ArrowType;
}

export interface ZombieEntity {
  id: string;
  type: ZombieType;
  body: any; // Matter.Body
  health: number;
  maxHealth: number;
  speed: number;
  state: 'idle' | 'walk' | 'jump' | 'attack' | 'dead' | 'climb';
  facingLeft: boolean;
  attackTimer: number;
  hitFlashTimer: number;
  isGrounded: boolean;
  walkCycle: number;
  width: number;
  height: number;
  armorLost?: boolean;
  patrolMin?: number;
  patrolMax?: number;
  patrolDir?: number;
  jumpCooldown?: number;
  climbCooldown?: number;
  flyPhase?: number;
  isFrozen?: boolean;
  freezeTimer?: number;
  isBurning?: boolean;
  burnTimer?: number;
  jumpVx?: number;
  stuckFrames?: number;
  stuckTotalFrames?: number;
  lastX?: number;
}

export interface ObstacleEntity {
  id: string;
  type: ObstacleType;
  body: any; // Matter.Body
  width: number;
  height: number;
  health: number;
  isTriggered: boolean;
  isOpen: boolean;
  gateId?: string;
  targetPortalId?: string;
  windStrength?: { x: number; y: number };
}

export interface MovingPlatformEntity {
  id: string;
  body: any;
  width: number;
  height: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  speed: number;
  progress: number;
  direction: number;
}

export interface AimState {
  isAiming: boolean;
  dragStartX: number;
  dragStartY: number;
  dragCurrentX: number;
  dragCurrentY: number;
  pullDistance: number;
  angle: number;
  power: number;
  trajectory: TrajectoryPoint[];
}

export interface GameStats {
  levelId: number;
  arrowsShot: number;
  zombiesKilled: number;
  totalZombies: number;
  headshots: number;
  score: number;
  stars: number;
  coinsEarned: number;
}
