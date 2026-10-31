// ─────────────────────────────────────────────────────────────────────────────
//  stickmanHookTypes.ts
//  Type definitions for Stickman Hook: Swing Hero (Spider-Web & Realism Update)
// ─────────────────────────────────────────────────────────────────────────────

export type FaceExpression =
  | 'focused'    // default forward gaze during normal swing
  | 'excited'    // wide eyes & smile on high speed / big launches
  | 'screaming'  // terrified wide eyes & open mouth near hazard or pit
  | 'grimacing'  // gritted teeth under heavy swing tension
  | 'happy'      // joyful eyes on trampoline bounce
  | 'triumph';   // giant grin with sparkle eyes on finish line

export type BackgroundTheme =
  | 'city_sunset'    // Chapter 1: Sunset City Rooftops & Skyscrapers
  | 'neon_skyway'    // Chapter 2: Cyber Neon Night Skyline with Billboards
  | 'steampunk'      // Chapter 3: Industrial Foundry with Pipes & Girders
  | 'hazard_foundry' // Chapter 4: Molten Red Sky with Lightning & Heavy Industry
  | 'cosmic_void';   // Chapter 5: Orbiting Space Metropolis & Stars

export interface MovingPinConfig {
  axis: 'x' | 'y';
  min: number;
  max: number;
  speed: number;
}

export interface AnchorPin {
  id: string;
  x: number;
  y: number;
  range?: number; // max hook reach, default ~230
  moving?: MovingPinConfig;
  fragile?: boolean; // cracks after 1 swing
  shattered?: boolean;
}

export interface Trampoline {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  bouncePower: number; // default ~750
  angle?: number; // tilt in degrees
  squashTime?: number; // ms timestamp of last bounce
  superSpring?: boolean; // golden high-launch spring (1100+ power)
}

export interface CollectibleStar {
  id: string;
  x: number;
  y: number;
  collected?: boolean;
}

export interface PortalGate {
  id: string;
  inX: number;
  inY: number;
  outX: number;
  outY: number;
  radius: number;
  cooldown?: number;
}

export type PowerUpType = 'slow_mo' | 'speed_boost' | 'magnet';

export interface PowerUpItem {
  id: string;
  type: PowerUpType;
  x: number;
  y: number;
  radius: number;
  durationSeconds: number;
  collected?: boolean;
}

export interface ActivePowerUp {
  type: PowerUpType;
  remainingTime: number;
  duration: number;
}

export interface SpeedRing {
  id: string;
  x: number;
  y: number;
  radius: number;
  collected?: boolean;
}

export interface HazardSaw {
  id: string;
  x: number;
  y: number;
  radius: number;
  rotationSpeed?: number;
  moving?: MovingPinConfig;
  pendulum?: { originX: number; originY: number; length: number; speed: number; angle: number };
}

export interface WindVent {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pushY: number; // upward force, e.g. -600
}

export interface LaserGate {
  id: string;
  x: number;
  y: number;
  length: number;
  orientation: 'horizontal' | 'vertical';
  periodMs: number; // cycle time
  active: boolean;
}

export interface BungeeWeb {
  id: string;
  x: number;
  y: number;
  width: number;
  launchVy?: number;
  launchVx?: number;
  tensionTime?: number;
}

export interface BreakableBarrier {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minSpeed: number; // minimum velocity to smash through (e.g. 460)
  broken?: boolean;
  shatterTime?: number;
}

export interface WreckingBall {
  id: string;
  pivotX: number;
  pivotY: number;
  chainLength: number;
  radius: number;
  swingSpeed: number;
  maxAngle: number;
  currentX?: number;
  currentY?: number;
  angle?: number;
}

export interface StickmanSkin {
  id: string;
  name: string;
  primaryColor: string;
  headColor: string;
  ropeColor: string;
  trailColor: string;
  requiredStars: number;
  isUnlocked: boolean;
  isRewardedUnlock?: boolean;
  description: string;
}

export interface HookLevelConfig {
  id: number;
  title: string;
  chapter: number;
  theme: BackgroundTheme;
  startX: number;
  startY: number;
  finishX: number;
  pins: AnchorPin[];
  trampolines: Trampoline[];
  speedRings?: SpeedRing[];
  hazards?: HazardSaw[];
  windVents?: WindVent[];
  lasers?: LaserGate[];
  bungeeWebs?: BungeeWeb[];
  barriers?: BreakableBarrier[];
  wreckingBalls?: WreckingBall[];
  stars?: CollectibleStar[];
  portals?: PortalGate[];
  powerUps?: PowerUpItem[];
  deathY: number; // fall boundary, default ~880
  parTimeSeconds: number; // 3-star time benchmark
}

export interface StickmanPlayer {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number; // degrees
  angularVelocity: number; // deg/s
  isGrappling: boolean;
  activePinId: string | null;
  ropeLength: number;
  swingAngle: number; // radians from vertical
  swingOmega: number; // angular velocity (rad/s)
  skinId: string;
  faceExpression: FaceExpression;
  dangerDistance: number; // distance to nearest hazard or pit
  trail: { x: number; y: number; opacity: number }[];
  activePowerUps?: ActivePowerUp[];
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number; // 0 to 1
}
