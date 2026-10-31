// ─────────────────────────────────────────────────────────────────────────────
//  PhysicsWorld.ts
//  60 FPS 2D Pendulum Physics, Facial Expressions & Realistic Trajectories
// ─────────────────────────────────────────────────────────────────────────────

import {
  AnchorPin,
  Trampoline,
  SpeedRing,
  HazardSaw,
  WindVent,
  LaserGate,
  BungeeWeb,
  BreakableBarrier,
  WreckingBall,
  CollectibleStar,
  PortalGate,
  PowerUpItem,
  ActivePowerUp,
  StickmanPlayer,
  HookLevelConfig,
  FaceExpression,
} from '../types/stickmanHookTypes';

export const GRAVITY = 1180; // px/s^2
export const AIR_DRAG_X = 0.035;
export const MAX_FALL_SPEED = 920;
export const HOOK_MAX_RADIUS = 240;
export const HOOK_MIN_RADIUS = 40;
export const TRAMPOLINE_DEFAULT_BOUNCE = 780;

export interface PhysicsStepResult {
  player: StickmanPlayer;
  activePin: AnchorPin | null;
  targetCandidatePin: AnchorPin | null;
  event: 'none' | 'trampoline' | 'speed_ring' | 'wind_vent' | 'hazard_hit' | 'fall_death' | 'victory' | 'star_collected' | 'portal_warp' | 'powerup_collected' | 'bungee_web' | 'barrier_smashed' | 'acrobatic_loop';
  eventPayload?: any;
}

export class PhysicsWorld {
  public player: StickmanPlayer;
  public level: HookLevelConfig;
  public pins: AnchorPin[];
  public trampolines: Trampoline[];
  public speedRings: SpeedRing[];
  public hazards: HazardSaw[];
  public windVents: WindVent[];
  public lasers: LaserGate[];
  public bungeeWebs: BungeeWeb[];
  public barriers: BreakableBarrier[];
  public wreckingBalls: WreckingBall[];
  public stars: CollectibleStar[];
  public portals: PortalGate[];
  public powerUps: PowerUpItem[];
  private fragileHoldTimer: number = 0;
  private lastTrampolineTime: number = 0;
  private accumulatedLoopAngle: number = 0;

  constructor(level: HookLevelConfig, skinId: string = 'classic_red') {
    this.level = level;
    this.pins = level.pins.map(p => ({ ...p }));
    this.trampolines = level.trampolines.map(t => ({ ...t }));
    this.speedRings = (level.speedRings || []).map(s => ({ ...s }));
    this.hazards = (level.hazards || []).map(h => ({
      ...h,
      pendulum: h.pendulum ? { ...h.pendulum } : undefined,
    }));
    this.windVents = (level.windVents || []).map(w => ({ ...w }));
    this.lasers = (level.lasers || []).map(l => ({ ...l }));
    this.bungeeWebs = (level.bungeeWebs || []).map(b => ({ ...b }));
    this.barriers = (level.barriers || []).map(b => ({ ...b }));
    this.wreckingBalls = (level.wreckingBalls || []).map(w => ({ ...w }));
    this.stars = (level.stars || []).map(s => ({ ...s }));
    this.portals = (level.portals || []).map(p => ({ ...p }));
    this.powerUps = (level.powerUps || []).map(pu => ({ ...pu }));

    this.player = {
      x: level.startX,
      y: level.startY,
      vx: 210,
      vy: -60,
      rotation: 0,
      angularVelocity: 180,
      isGrappling: false,
      activePinId: null,
      ropeLength: 0,
      swingAngle: 0,
      swingOmega: 0,
      skinId,
      faceExpression: 'focused',
      dangerDistance: 999,
      trail: [],
      activePowerUps: [],
    };
  }

  /**
   * Finds the best anchor pin to hook onto:
   * Prioritizes pins that are within range and forward/overhead of the player.
   */
  public findBestCandidatePin(): AnchorPin | null {
    let bestPin: AnchorPin | null = null;
    let minDistance = Infinity;

    for (const pin of this.pins) {
      if (pin.shattered) continue;

      const dx = pin.x - this.player.x;
      const dy = pin.y - this.player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= HOOK_MAX_RADIUS && dist >= HOOK_MIN_RADIUS) {
        // Bias towards forward pins (dx > -20)
        const forwardBiasScore = dist - Math.max(0, dx) * 0.45;
        if (forwardBiasScore < minDistance) {
          minDistance = forwardBiasScore;
          bestPin = pin;
        }
      }
    }

    return bestPin;
  }

  /**
   * Called when player taps & holds on screen
   */
  public attachHook(): boolean {
    if (this.player.isGrappling) return true;

    const candidate = this.findBestCandidatePin();
    if (!candidate) return false;

    const dx = this.player.x - candidate.x;
    const dy = this.player.y - candidate.y;
    const dist = Math.max(HOOK_MIN_RADIUS, Math.min(HOOK_MAX_RADIUS, Math.sqrt(dx * dx + dy * dy)));

    // Angle theta from downward vertical (0 = straight down, positive = clockwise / right)
    const theta = Math.atan2(dx, dy);

    // Tangential speed: v_tan = vx * cos(theta) - vy * sin(theta)
    const vTan = this.player.vx * Math.cos(theta) - this.player.vy * Math.sin(theta);
    let omega = vTan / dist;

    // Ensure brisk, satisfying minimum angular speed
    if (Math.abs(omega) < 1.4) {
      omega = this.player.vx >= 0 ? 2.4 : -2.4;
    }

    this.player.isGrappling = true;
    this.player.activePinId = candidate.id;
    this.player.ropeLength = dist;
    this.player.swingAngle = theta;
    this.player.swingOmega = omega;
    this.fragileHoldTimer = 0;

    return true;
  }

  /**
   * Called when player releases touch
   */
  public releaseHook() {
    if (!this.player.isGrappling) return;

    const activePin = this.pins.find(p => p.id === this.player.activePinId);
    if (activePin) {
      const theta = this.player.swingAngle;
      const omega = this.player.swingOmega;
      const L = this.player.ropeLength;

      // Tangential release velocity
      this.player.vx = L * omega * Math.cos(theta);
      this.player.vy = -L * omega * Math.sin(theta);

      // Boost forward momentum on good upward swing releases
      if (this.player.vx > 0) {
        this.player.vx = Math.max(this.player.vx, 240);
      }

      // Angular flip speed based on release speed
      this.player.angularVelocity = Math.max(-550, Math.min(550, omega * 150));
    }

    this.player.isGrappling = false;
    this.player.activePinId = null;
    this.fragileHoldTimer = 0;
    this.accumulatedLoopAngle = 0;
  }

  /**
   * Main Physics Step (dt in seconds, ~0.016s for 60 FPS)
   */
  public step(dt: number): PhysicsStepResult {
    let event: PhysicsStepResult['event'] = 'none';
    let eventPayload: any = null;
    const now = Date.now();

    // ── 0. UPDATE ACTIVE POWER-UPS & EFFECTIVE TIMESTEP ─────────────────────────
    if (this.player.activePowerUps && this.player.activePowerUps.length > 0) {
      this.player.activePowerUps = this.player.activePowerUps
        .map(p => ({ ...p, remainingTime: p.remainingTime - dt }))
        .filter(p => p.remainingTime > 0);
    }

    const hasSlowMo = (this.player.activePowerUps || []).some(p => p.type === 'slow_mo');
    const hasSpeedBoost = (this.player.activePowerUps || []).some(p => p.type === 'speed_boost');
    const hasMagnet = (this.player.activePowerUps || []).some(p => p.type === 'magnet');

    const effectiveDt = hasSlowMo ? dt * 0.5 : dt;

    // Apply Magnet Attraction to nearby stars
    if (hasMagnet) {
      for (const star of this.stars) {
        if (!star.collected) {
          const dx = this.player.x - star.x;
          const dy = this.player.y - star.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 340 && dist > 5) {
            star.x += (dx / dist) * 520 * effectiveDt;
            star.y += (dy / dist) * 520 * effectiveDt;
          }
        }
      }
    }

    // ── 1. UPDATE MOVING PINS & HAZARDS ─────────────────────────────────────────
    for (const pin of this.pins) {
      if (pin.moving) {
        const { axis, min, max, speed } = pin.moving;
        if (axis === 'x') {
          pin.x += speed * effectiveDt;
          if (pin.x >= max) {
            pin.x = max;
            pin.moving.speed = -Math.abs(speed);
          } else if (pin.x <= min) {
            pin.x = min;
            pin.moving.speed = Math.abs(speed);
          }
        } else {
          pin.y += speed * effectiveDt;
          if (pin.y >= max) {
            pin.y = max;
            pin.moving.speed = -Math.abs(speed);
          } else if (pin.y <= min) {
            pin.y = min;
            pin.moving.speed = Math.abs(speed);
          }
        }
      }
    }

    // Update swinging pendulum hazards
    for (const saw of this.hazards) {
      if (saw.pendulum) {
        saw.pendulum.angle += saw.pendulum.speed * effectiveDt;
        saw.x = saw.pendulum.originX + Math.sin(saw.pendulum.angle) * saw.pendulum.length;
        saw.y = saw.pendulum.originY + Math.cos(saw.pendulum.angle) * saw.pendulum.length;
      } else if (saw.moving) {
        const { axis, min, max, speed } = saw.moving;
        if (axis === 'x') {
          saw.x += speed * effectiveDt;
          if (saw.x >= max) {
            saw.x = max;
            saw.moving.speed = -Math.abs(speed);
          } else if (saw.x <= min) {
            saw.x = min;
            saw.moving.speed = Math.abs(speed);
          }
        } else {
          saw.y += speed * effectiveDt;
          if (saw.y >= max) {
            saw.y = max;
            saw.moving.speed = -Math.abs(speed);
          } else if (saw.y <= min) {
            saw.y = min;
            saw.moving.speed = Math.abs(speed);
          }
        }
      }
    }

    // Update laser pulses
    for (const laser of this.lasers) {
      laser.active = (now % laser.periodMs) < (laser.periodMs * 0.65);
    }

    // ── 2. PLAYER PHYSICS UPDATE ────────────────────────────────────────────────
    let activePin: AnchorPin | null = null;

    if (this.player.isGrappling && this.player.activePinId) {
      activePin = this.pins.find(p => p.id === this.player.activePinId) || null;

      if (!activePin || activePin.shattered) {
        this.releaseHook();
      } else {
        if (activePin.fragile) {
          this.fragileHoldTimer += effectiveDt;
          if (this.fragileHoldTimer >= 1.05) {
            activePin.shattered = true;
            this.releaseHook();
          }
        }

        // Pendulum Angular Acceleration
        const L = this.player.ropeLength;
        const g = GRAVITY;
        let alpha = -(g / L) * Math.sin(this.player.swingAngle) - 0.12 * this.player.swingOmega;

        // Pumping forward speed boost
        if (this.player.swingOmega > 0 && Math.sin(this.player.swingAngle) < 0) {
          alpha += 2.2;
        }

        if (hasSpeedBoost) {
          alpha += 3.5;
        }

        this.player.swingOmega += alpha * effectiveDt;
        this.player.swingAngle += this.player.swingOmega * effectiveDt;

        // 360° Acrobatic Loop Detection around current Anchor Pin
        const omegaDelta = this.player.swingOmega * effectiveDt;
        this.accumulatedLoopAngle += omegaDelta;
        if (Math.abs(this.accumulatedLoopAngle) >= 2 * Math.PI) {
          this.accumulatedLoopAngle = 0;
          this.player.swingOmega *= 1.25; // Satisfying centrifugal acceleration
          event = 'acrobatic_loop';
          eventPayload = { x: this.player.x, y: this.player.y };
        }

        // Position derived from pin + polar coordinates
        this.player.x = activePin.x + L * Math.sin(this.player.swingAngle);
        this.player.y = activePin.y + L * Math.cos(this.player.swingAngle);

        this.player.vx = L * this.player.swingOmega * Math.cos(this.player.swingAngle);
        this.player.vy = -L * this.player.swingOmega * Math.sin(this.player.swingAngle);

        // Rotation angles smoothly along rope
        this.player.rotation = (this.player.swingAngle * 180) / Math.PI;
      }
    } else {
      // Free flight state
      let currentGravity = GRAVITY;
      if (hasSpeedBoost) {
        this.player.vx = Math.max(this.player.vx, 640);
      }

      this.player.vy += currentGravity * effectiveDt;
      this.player.vy = Math.min(this.player.vy, MAX_FALL_SPEED);

      // Low air resistance
      this.player.vx *= Math.max(0.92, 1 - AIR_DRAG_X * effectiveDt);

      this.player.x += this.player.vx * effectiveDt;
      this.player.y += this.player.vy * effectiveDt;

      // Free somersault flip
      this.player.rotation = (this.player.rotation + this.player.angularVelocity * effectiveDt) % 360;
    }

    // ── 3. WIND VENTS INTERACTION ──────────────────────────────────────────────
    for (const vent of this.windVents) {
      if (
        this.player.x >= vent.x &&
        this.player.x <= vent.x + vent.width &&
        this.player.y >= vent.y &&
        this.player.y <= vent.y + vent.height
      ) {
        this.player.vy += vent.pushY * dt;
        this.player.vx += 120 * dt;
        event = 'wind_vent';
        eventPayload = vent;
      }
    }

    // ── 4. TRAIL EFFECT UPDATE ─────────────────────────────────────────────────
    this.player.trail.unshift({
      x: this.player.x,
      y: this.player.y,
      opacity: 0.85,
    });
    if (this.player.trail.length > 8) {
      this.player.trail.pop();
    }
    this.player.trail.forEach(t => (t.opacity *= 0.82));

    // ── 5. TRAMPOLINE COLLISIONS ───────────────────────────────────────────────
    const playerRadius = 14;
    for (const tramp of this.trampolines) {
      const inX =
        this.player.x + playerRadius >= tramp.x &&
        this.player.x - playerRadius <= tramp.x + tramp.width;
      const inY =
        this.player.y + playerRadius >= tramp.y - 4 &&
        this.player.y - playerRadius <= tramp.y + tramp.height + 6;

      if (inX && inY && this.player.vy > -120) {
        this.releaseHook();

        const bouncePower = tramp.superSpring
          ? (tramp.bouncePower || 1150)
          : (tramp.bouncePower || TRAMPOLINE_DEFAULT_BOUNCE);
        this.player.vy = -Math.max(bouncePower, Math.abs(this.player.vy) * 1.35);
        this.player.vx = tramp.superSpring
          ? Math.max(480, this.player.vx * 1.35)
          : Math.max(280, this.player.vx * 1.15);
        this.player.y = tramp.y - playerRadius - 2;
        this.player.angularVelocity = tramp.superSpring ? 540 : 380;

        tramp.squashTime = now;
        this.lastTrampolineTime = now;
        event = 'trampoline';
        eventPayload = tramp;
        break;
      }
    }

    // ── 6. SPEED RING COLLISIONS ───────────────────────────────────────────────
    if (event === 'none') {
      for (const ring of this.speedRings) {
        if (!ring.collected) {
          const dx = this.player.x - ring.x;
          const dy = this.player.y - ring.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= ring.radius + playerRadius) {
            ring.collected = true;
            this.player.vx = Math.max(520, this.player.vx + 320);
            this.player.vy = -140;
            event = 'speed_ring';
            eventPayload = ring;
            break;
          }
        }
      }
    }

    // ── 6b. COLLECTIBLE STAR GEMS ──────────────────────────────────────────────
    if (event === 'none') {
      for (const star of this.stars) {
        if (!star.collected) {
          const dx = this.player.x - star.x;
          const dy = this.player.y - star.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= 22 + playerRadius) {
            star.collected = true;
            event = 'star_collected';
            eventPayload = star;
            break;
          }
        }
      }
    }

    // ── 6c. QUANTUM PORTAL WARP GATES ──────────────────────────────────────────
    if (event === 'none') {
      for (const portal of this.portals) {
        if (portal.cooldown && now < portal.cooldown) continue;
        const dx = this.player.x - portal.inX;
        const dy = this.player.y - portal.inY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= portal.radius + playerRadius) {
          this.releaseHook();
          this.player.x = portal.outX;
          this.player.y = portal.outY;
          this.player.vx = Math.max(540, Math.abs(this.player.vx) + 220);
          this.player.vy = -160;
          portal.cooldown = now + 1200;
          event = 'portal_warp';
          eventPayload = portal;
          break;
        }
      }
    }

    // ── 6d. COLLECTIBLE TIMED POWER-UPS (JETPACK, SLOW-MO, SPEED, MAGNET) ──────
    if (event === 'none') {
      for (const pu of this.powerUps) {
        if (!pu.collected) {
          const dx = this.player.x - pu.x;
          const dy = this.player.y - pu.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= pu.radius + playerRadius) {
            pu.collected = true;
            this.player.activePowerUps = this.player.activePowerUps || [];
            const existing = this.player.activePowerUps.find(p => p.type === pu.type);
            if (existing) {
              existing.remainingTime = pu.durationSeconds;
            } else {
              this.player.activePowerUps.push({
                type: pu.type,
                remainingTime: pu.durationSeconds,
                duration: pu.durationSeconds,
              });
            }
            event = 'powerup_collected';
            eventPayload = pu;
            break;
          }
        }
      }
    }

    // ── 6e. SPIDER BUNGEE WEBS (ELASTIC SLINGSHOT CATAPULT) ────────────────────
    if (event === 'none') {
      for (const web of this.bungeeWebs) {
        const inX =
          this.player.x >= web.x - web.width / 2 &&
          this.player.x <= web.x + web.width / 2;
        const inY = Math.abs(this.player.y - web.y) <= playerRadius + 8;
        if (inX && inY && this.player.vy > -120) {
          this.releaseHook();
          const launchVy = web.launchVy || -840;
          const launchVx = Math.max(580, Math.abs(this.player.vx) * 1.35 + 260);
          this.player.vy = launchVy;
          this.player.vx = launchVx;
          this.player.y = web.y - playerRadius - 4;
          this.player.angularVelocity = 520;
          web.tensionTime = now;
          this.lastTrampolineTime = now;
          event = 'bungee_web';
          eventPayload = web;
          break;
        }
      }
    }

    // ── 6f. BREAKABLE SPEED BARRICADES (SMASH-THROUGH GLASS) ───────────────────
    if (event === 'none') {
      for (const barrier of this.barriers) {
        if (barrier.broken) continue;
        const inX =
          this.player.x + playerRadius >= barrier.x &&
          this.player.x - playerRadius <= barrier.x + barrier.width;
        const inY =
          this.player.y + playerRadius >= barrier.y &&
          this.player.y - playerRadius <= barrier.y + barrier.height;
        if (inX && inY) {
          const speed = Math.sqrt(this.player.vx * this.player.vx + this.player.vy * this.player.vy);
          if (speed >= barrier.minSpeed) {
            barrier.broken = true;
            barrier.shatterTime = now;
            this.player.vx = Math.max(this.player.vx, 520);
            event = 'barrier_smashed';
            eventPayload = barrier;
          } else {
            // Rebound bounce
            this.player.vx = -Math.abs(this.player.vx) * 0.45;
            this.player.vy *= 0.5;
            this.player.x = barrier.x - playerRadius - 2;
          }
          break;
        }
      }
    }

    // ── 7. HAZARD & LASER COLLISIONS ───────────────────────────────────────────
    let closestHazardDist = 999;
    for (const saw of this.hazards) {
      const dx = this.player.x - saw.x;
      const dy = this.player.y - saw.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < closestHazardDist) closestHazardDist = dist;

      if (dist <= saw.radius + playerRadius - 4) {
        event = 'hazard_hit';
        eventPayload = saw;
        break;
      }
    }

    if (event === 'none') {
      for (const laser of this.lasers) {
        if (laser.active) {
          if (laser.orientation === 'horizontal') {
            const inX = this.player.x >= laser.x && this.player.x <= laser.x + laser.length;
            const inY = Math.abs(this.player.y - laser.y) <= playerRadius + 4;
            if (inX && inY) {
              event = 'hazard_hit';
              eventPayload = laser;
              break;
            }
          } else {
            const inY = this.player.y >= laser.y && this.player.y <= laser.y + laser.length;
            const inX = Math.abs(this.player.x - laser.x) <= playerRadius + 4;
            if (inX && inY) {
              event = 'hazard_hit';
              eventPayload = laser;
              break;
            }
          }
        }
      }
    }

    // ── 7b. SWINGING WRECKING BALLS (HEAVY PENDULUMS) ──────────────────────────
    const timeSec = now / 1000;
    for (const ball of this.wreckingBalls) {
      const swingAngle = Math.sin(timeSec * ball.swingSpeed) * ball.maxAngle;
      ball.angle = swingAngle;
      ball.currentX = ball.pivotX + Math.sin(swingAngle) * ball.chainLength;
      ball.currentY = ball.pivotY + Math.cos(swingAngle) * ball.chainLength;

      const dx = this.player.x - ball.currentX;
      const dy = this.player.y - ball.currentY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < closestHazardDist) closestHazardDist = dist;

      if (event === 'none' && dist <= ball.radius + playerRadius - 4) {
        event = 'hazard_hit';
        eventPayload = ball;
        break;
      }
    }

    // ── 8. PIT FALL / DEATH BOUNDARY ───────────────────────────────────────────
    const distToPit = this.level.deathY - this.player.y;
    this.player.dangerDistance = Math.min(distToPit, closestHazardDist);

    if (event === 'none') {
      if (this.player.y >= this.level.deathY) {
        event = 'fall_death';
      }
    }

    // ── 9. FINISH LINE VICTORY ─────────────────────────────────────────────────
    if (event === 'none') {
      if (this.player.x >= this.level.finishX) {
        event = 'victory';
      }
    }

    // ── 10. DYNAMIC FACIAL EXPRESSION RESOLUTION ────────────────────────────────
    let expr: FaceExpression = 'focused';
    const totalSpeed = Math.sqrt(this.player.vx * this.player.vx + this.player.vy * this.player.vy);

    if (event === 'victory' || this.player.x >= this.level.finishX - 40) {
      expr = 'triumph';
    } else if (distToPit < 130 || closestHazardDist < 55) {
      expr = 'screaming'; // Near hazard or falling into abyss!
    } else if (now - this.lastTrampolineTime < 450) {
      expr = 'happy'; // Joyful face on trampoline bounce!
    } else if (this.player.isGrappling && Math.abs(this.player.swingOmega) > 2.8) {
      expr = 'grimacing'; // Determined gritted teeth under heavy swing tension!
    } else if (totalSpeed > 460) {
      expr = 'excited'; // Big open mouth wind-blown face at high speed!
    } else {
      expr = 'focused';
    }
    this.player.faceExpression = expr;

    const candidatePin = this.findBestCandidatePin();

    return {
      player: this.player,
      activePin,
      targetCandidatePin: candidatePin,
      event,
      eventPayload,
    };
  }

  /**
   * Revive at safe checkpoint
   */
  public reviveAtSafeCheckpoint() {
    this.releaseHook();

    let safeX = this.level.startX;
    let safeY = this.level.startY;

    for (const pin of this.pins) {
      if (pin.x < this.player.x && pin.x > safeX - 100) {
        safeX = pin.x - 30;
        safeY = pin.y + 60;
      }
    }

    for (const tramp of this.trampolines) {
      if (tramp.x < this.player.x && tramp.x > safeX) {
        safeX = tramp.x + tramp.width * 0.5;
        safeY = tramp.y - 50;
      }
    }

    this.player.x = safeX;
    this.player.y = safeY;
    this.player.vx = 250;
    this.player.vy = -360;
    this.player.rotation = 0;
    this.player.angularVelocity = 180;
    this.player.trail = [];
    this.player.faceExpression = 'focused';
  }
}

export default PhysicsWorld;
