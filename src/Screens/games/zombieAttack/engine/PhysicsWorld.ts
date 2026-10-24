import Matter from 'matter-js';
import {
  LevelConfig,
  ArrowEntity,
  ZombieEntity,
  ObstacleEntity,
  MovingPlatformEntity,
  TrajectoryPoint,
  ParticleEntity,
  FloatText,
  ArrowType,
} from '../types/gameTypes';
import ZombieAudio from '../services/zombieAudio';
import { LANDSCAPE_GROUND_Y } from '../levels/landscapeLevelAdapter';

export const COLLISION_CATEGORIES = {
  TERRAIN: 0x0001,
  PLAYER: 0x0002,
  ZOMBIE: 0x0004,
  ARROW: 0x0008,
  OBSTACLE: 0x0010,
  TRIGGER: 0x0020,
};

export class PhysicsWorld {
  public engine: Matter.Engine;
  public world: Matter.World;
  public level: LevelConfig;

  // Runtime Entities
  public arrows: ArrowEntity[] = [];
  public zombies: ZombieEntity[] = [];
  public obstacles: ObstacleEntity[] = [];
  public movingPlatforms: MovingPlatformEntity[] = [];
  public particles: ParticleEntity[] = [];
  public floatTexts: FloatText[] = [];

  // Player Body
  public playerBody: Matter.Body | null = null;

  // Game callbacks
  public onZombieKilled?: (zombie: ZombieEntity, isHeadshot: boolean) => void;
  public onPlayerAttacked?: () => void;
  public onExplosionTriggered?: (x: number, y: number, radius: number) => void;

  private nextArrowId: number = 1;
  private nextParticleId: number = 1;
  private nextFloatTextId: number = 1;

  constructor(level: LevelConfig) {
    this.level = level;
    this.engine = Matter.Engine.create({
      enableSleeping: false,
    });
    this.world = this.engine.world;

    // Fixed predictable gravity scale
    const gx = level.gravity?.x ?? 0;
    const gy = level.gravity?.y ?? 1.0;
    this.world.gravity.x = gx;
    this.world.gravity.y = gy;
    this.world.gravity.scale = 0.001;

    this.setupLevel(level);
    this.setupCollisionHandlers();
  }

  private setupLevel(level: LevelConfig) {
    // 1. Setup Platforms
    level.platforms.forEach(p => {
      if (p.type === 'moving' && p.movingPath) {
        const body = Matter.Bodies.rectangle(p.x, p.y, p.width, p.height, {
          isStatic: true,
          label: `platform:${p.id}`,
          collisionFilter: {
            category: COLLISION_CATEGORIES.TERRAIN,
            mask: COLLISION_CATEGORIES.ARROW | COLLISION_CATEGORIES.ZOMBIE,
          },
          friction: 0.8,
        });
        Matter.World.add(this.world, body);
        this.movingPlatforms.push({
          id: p.id,
          body,
          width: p.width,
          height: p.height,
          startX: p.movingPath.x1,
          startY: p.movingPath.y1,
          endX: p.movingPath.x2,
          endY: p.movingPath.y2,
          speed: p.movingPath.speed,
          progress: 0,
          direction: 1,
        });
      } else {
        const body = Matter.Bodies.rectangle(p.x, p.y, p.width, p.height, {
          isStatic: true,
          label: `platform:${p.id}`,
          collisionFilter: {
            category: COLLISION_CATEGORIES.TERRAIN,
            mask: COLLISION_CATEGORIES.ARROW | COLLISION_CATEGORIES.ZOMBIE | COLLISION_CATEGORIES.OBSTACLE,
          },
          friction: p.type === 'slippery' ? 0.02 : 0.8,
          restitution: 0.0,
        });
        Matter.World.add(this.world, body);
      }
    });

    // 2. Setup Player Body (sitting flush on platform)
    this.playerBody = Matter.Bodies.rectangle(
      level.playerPos.x,
      level.playerPos.y + 12,
      36,
      76,
      {
        isStatic: true,
        label: 'player',
        collisionFilter: {
          category: COLLISION_CATEGORIES.PLAYER,
          mask: COLLISION_CATEGORIES.ZOMBIE,
        },
      }
    );
    Matter.World.add(this.world, this.playerBody);

    // 3. Setup Zombies
    level.zombies.forEach(z => {
      const isGiant = z.type === 'giant' || z.type === 'boss';
      const isBoss = z.type === 'boss';
      // Widen regular zombie hitbox (44px) so edge arrows register reliably
      const width = isBoss ? 68 : isGiant ? 52 : 44;
      const height = isBoss ? 104 : isGiant ? 88 : 64;

      const baseHealth =
        z.health ??
        (isBoss
          ? 10
          : z.type === 'giant'
          ? 4
          : z.type === 'armored'
          ? 2
          : 1);

      const baseSpeed =
        z.speed ??
        (z.type === 'runner'
          ? 3.2
          : z.type === 'giant'
          ? 1.4
          : z.type === 'jumper'
          ? 2.4
          : isBoss
          ? 1.6
          : 2.2);

      const body = Matter.Bodies.rectangle(z.x, z.y, width, height, {
        inertia: Infinity, // Keep upright
        friction: 0.0, // Zero friction so ground never arrests or snags zombie running!
        frictionStatic: 0.0,
        frictionAir: 0.0,
        mass: isGiant ? 5 : 1,
        label: `zombie:${z.id}`,
        collisionFilter: {
          category: COLLISION_CATEGORIES.ZOMBIE,
          mask:
            COLLISION_CATEGORIES.TERRAIN |
            COLLISION_CATEGORIES.ARROW |
            COLLISION_CATEGORIES.OBSTACLE |
            COLLISION_CATEGORIES.PLAYER,
        },
      });

      Matter.World.add(this.world, body);

      this.zombies.push({
        id: z.id,
        type: z.type,
        body,
        health: baseHealth,
        maxHealth: baseHealth,
        speed: baseSpeed,
        state: 'walk',
        facingLeft: z.x > level.playerPos.x,
        attackTimer: 0,
        hitFlashTimer: 0,
        isGrounded: false,
        walkCycle: Math.random() * 10,
        width,
        height,
        patrolMin: z.patrolMin,
        patrolMax: z.patrolMax,
        jumpCooldown: 0,
        flyPhase: Math.random() * Math.PI * 2,
      });
    });

    // 4. Setup Obstacles
    level.obstacles.forEach(o => {
      let isStatic = true;
      let isSensor = false;
      let restitution = 0.0;
      let friction = 0.5;
      let mass = 1;

      if (o.type === 'crate') {
        isStatic = false;
        mass = 1.2;
      } else if (o.type === 'rock') {
        isStatic = false;
        mass = 5;
      } else if (o.type === 'tnt') {
        isStatic = false;
        mass = 1.5;
      } else if (o.type === 'bounce_pad') {
        isStatic = true;
        restitution = 1.35;
      } else if (o.type === 'switch' || o.type === 'portal' || o.type === 'wind') {
        isSensor = true;
      }

      const body = Matter.Bodies.rectangle(o.x, o.y, o.width, o.height, {
        isStatic,
        isSensor,
        restitution,
        friction,
        mass,
        label: `obstacle:${o.id}`,
        collisionFilter: {
          category: isSensor ? COLLISION_CATEGORIES.TRIGGER : COLLISION_CATEGORIES.OBSTACLE,
          mask:
            COLLISION_CATEGORIES.TERRAIN |
            COLLISION_CATEGORIES.ARROW |
            COLLISION_CATEGORIES.ZOMBIE |
            COLLISION_CATEGORIES.OBSTACLE,
        },
      });

      Matter.World.add(this.world, body);

      this.obstacles.push({
        id: o.id,
        type: o.type,
        body,
        width: o.width,
        height: o.height,
        health: o.health ?? (o.type === 'crate' ? 1 : o.type === 'tnt' ? 1 : 999),
        isTriggered: false,
        isOpen: false,
        gateId: o.gateId,
        targetPortalId: o.targetPortalId,
        windStrength: o.windStrength,
      });
    });
  }

  private setupCollisionHandlers() {
    Matter.Events.on(this.engine, 'collisionStart', event => {
      event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        this.handlePairCollision(bodyA, bodyB);
      });
    });
  }

  private handlePairCollision(bodyA: Matter.Body, bodyB: Matter.Body) {
    const labelA = bodyA.label || '';
    const labelB = bodyB.label || '';

    const isArrowA = labelA.startsWith('arrow:');
    const isArrowB = labelB.startsWith('arrow:');

    if (isArrowA || isArrowB) {
      const arrowBody = isArrowA ? bodyA : bodyB;
      const otherBody = isArrowA ? bodyB : bodyA;
      this.handleArrowHit(arrowBody, otherBody);
      return;
    }

    // Bounce Pad
    if (labelA.includes('bounce_pad') || labelB.includes('bounce_pad')) {
      const targetBody = labelA.includes('bounce_pad') ? bodyB : bodyA;
      if (!targetBody.isStatic) {
        Matter.Body.setVelocity(targetBody, {
          x: targetBody.velocity.x * 1.1,
          y: -14,
        });
        ZombieAudio.playBounce();
      }
      return;
    }

    // Spikes Hazard: Any zombie touching spikes is instantly defeated
    const spikesObstacle = this.obstacles.find(
      o => (o.body === bodyA || o.body === bodyB) && o.type === 'spikes'
    );
    if (spikesObstacle) {
      const otherBody = bodyA === spikesObstacle.body ? bodyB : bodyA;
      const otherLabel = otherBody.label || '';
      if (otherLabel.startsWith('zombie:')) {
        const zombieId = otherLabel.replace('zombie:', '');
        const z = this.zombies.find(zm => zm.id === zombieId && zm.health > 0);
        if (z) {
          this.killZombie(z, false);
          return;
        }
      }
    }
  }

  private handleArrowHit(arrowBody: Matter.Body, otherBody: Matter.Body) {
    const arrow = this.arrows.find(a => a.body === arrowBody);
    if (!arrow || !arrow.inFlight || arrow.stuck) return;

    const otherLabel = otherBody.label || '';
    const hitX = arrowBody.position.x;
    const hitY = arrowBody.position.y;

    // Special Arrow Types Detonate Immediately on First Solid Impact!
    if (arrow.arrowType === 'bomb') {
      Matter.World.remove(this.world, arrow.body);
      this.arrows = this.arrows.filter(a => a.id !== arrow.id);
      this.triggerBombExplosion(hitX, hitY);
      return;
    }

    // 1. Arrow hits Zombie
    if (otherLabel.startsWith('zombie:')) {
      const zombieId = otherLabel.replace('zombie:', '');
      const zombie = this.zombies.find(z => z.id === zombieId && z.health > 0);
      if (zombie) {
        // Hitting a FROZEN zombie with any arrow immediately SHATTERS it!
        if (zombie.isFrozen) {
          Matter.World.remove(this.world, arrow.body);
          this.arrows = this.arrows.filter(a => a.id !== arrow.id);
          this.triggerIceShatter(zombie);
          return;
        }

        const zombieCenterY = zombie.body.position.y;
        // Accurate headshot detection with generous fair threshold
        const isHeadshot = hitY < zombieCenterY - zombie.height * 0.18;

        let damage = isHeadshot ? 2 : 1;
        if (zombie.type === 'armored' && !zombie.armorLost) {
          zombie.armorLost = true;
          damage = 1;
          ZombieAudio.playArrowHitGround();
        } else {
          ZombieAudio.playArrowHitZombie(isHeadshot);
        }

        zombie.health -= damage;
        zombie.hitFlashTimer = 6;

        // Knockback impulse
        const knockDir = arrowBody.velocity.x >= 0 ? 1 : -1;
        Matter.Body.applyForce(zombie.body, zombie.body.position, {
          x: knockDir * (isHeadshot ? 0.08 : 0.05),
          y: -0.04,
        });

        if (zombie.health <= 0) {
          zombie.state = 'dead';
          if (!isHeadshot) {
            ZombieAudio.playZombieDefeat();
          }

          // FIX FLOATING ARROWS: Remove the hitting arrow immediately
          Matter.World.remove(this.world, arrow.body);
          this.arrows = this.arrows.filter(a => a.id !== arrow.id);

          // Remove any previously lodged arrows on this zombie body
          this.arrows
            .filter(a => a.stuckToBodyId === zombie.body.id)
            .forEach(a => Matter.World.remove(this.world, a.body));
          this.arrows = this.arrows.filter(a => a.stuckToBodyId !== zombie.body.id);

          // Remove dead zombie body from physics simulation
          Matter.World.remove(this.world, zombie.body);

          // Spawn fast lightweight cartoon blood particles (laggy skull completely removed!)
          this.spawnZombieDeathBlood(zombie.body.position.x, zombie.body.position.y, isHeadshot, knockDir);

          if (this.onZombieKilled) {
            this.onZombieKilled(zombie, isHeadshot);
          }
        } else {
          // Boss or armored enemy survived: lodge arrow into body
          this.lodgeArrow(arrow, otherBody);
        }
        return;
      }
    }

    // 2. Arrow hits TNT
    if (otherLabel.includes('tnt')) {
      const obstacle = this.obstacles.find(o => o.body === otherBody);
      if (obstacle && !obstacle.isTriggered) {
        obstacle.isTriggered = true;
        this.lodgeArrow(arrow, otherBody);
        this.detonateTNT(obstacle);
        return;
      }
    }

    // 3. Arrow hits Crate
    if (otherLabel.includes('crate')) {
      const crate = this.obstacles.find(o => o.body === otherBody);
      if (crate && !crate.isTriggered) {
        crate.health -= 1;
        ZombieAudio.playArrowHitGround();
        if (crate.health <= 0) {
          crate.isTriggered = true;
          Matter.World.remove(this.world, crate.body);
        } else {
          this.lodgeArrow(arrow, otherBody);
        }
        return;
      }
    }

    // 4. Arrow hits Switch
    if (otherLabel.includes('switch')) {
      const sw = this.obstacles.find(o => o.body === otherBody);
      if (sw && !sw.isTriggered) {
        sw.isTriggered = true;
        ZombieAudio.playSwitchTrigger();
        if (sw.gateId) {
          const gate = this.obstacles.find(o => o.id === sw.gateId);
          if (gate && !gate.isOpen) {
            gate.isOpen = true;
            Matter.World.remove(this.world, gate.body);
          }
        }
        this.lodgeArrow(arrow, otherBody);
        return;
      }
    }

    // 5. Arrow enters Portal
    if (otherLabel.includes('portal')) {
      const portal = this.obstacles.find(o => o.body === otherBody);
      if (portal && portal.targetPortalId) {
        const destPortal = this.obstacles.find(o => o.id === portal.targetPortalId);
        if (destPortal) {
          ZombieAudio.playPortal();
          Matter.Body.setPosition(arrow.body, {
            x: destPortal.body.position.x + (arrow.body.velocity.x >= 0 ? 25 : -25),
            y: destPortal.body.position.y,
          });
          return;
        }
      }
    }

    // 6. Arrow hits Terrain / Platforms / Rocks / Bounce Pads -> Logical Ricochet Reflection!
    if (
      otherLabel.startsWith('platform:') ||
      otherBody.isStatic ||
      otherLabel.includes('bounce_pad') ||
      otherLabel.includes('rock') ||
      otherLabel.includes('gate')
    ) {
      const isBouncePad = otherLabel.includes('bounce_pad');
      arrow.bounces = arrow.bounces ?? 0;
      const maxBounces = arrow.maxBounces ?? 2;

      if (arrow.bounces < maxBounces) {
        arrow.bounces++;
        const curVx = arrow.body.velocity.x;
        const curVy = arrow.body.velocity.y;

        const ax = arrow.body.position.x;
        const ay = arrow.body.position.y;
        const bx = otherBody.position.x;
        const by = otherBody.position.y;
        const halfW = (otherBody.bounds.max.x - otherBody.bounds.min.x) / 2 || 20;
        const halfH = (otherBody.bounds.max.y - otherBody.bounds.min.y) / 2 || 20;

        const relX = (ax - bx) / Math.max(1, halfW);
        const relY = (ay - by) / Math.max(1, halfH);

        let nx = 0;
        let ny = -1;
        if (Math.abs(relX) > Math.abs(relY)) {
          nx = relX > 0 ? 1 : -1;
          ny = 0;
        } else {
          nx = 0;
          ny = relY > 0 ? 1 : -1;
        }

        const restitution = isBouncePad ? 1.35 : 0.85;
        const dot = curVx * nx + curVy * ny;
        let newVx = (curVx - 2 * dot * nx) * restitution;
        let newVy = (curVy - 2 * dot * ny) * restitution;

        // Ensure minimum speed so ricochet remains energetic and lethal
        const speed = Math.hypot(newVx, newVy);
        if (speed < 9) {
          const boost = 9.5 / Math.max(0.1, speed);
          newVx *= boost;
          newVy *= boost;
        }

        const newAngle = Math.atan2(newVy, newVx);
        Matter.Body.setPosition(arrow.body, {
          x: ax + nx * 5,
          y: ay + ny * 5,
        });
        Matter.Body.setVelocity(arrow.body, { x: newVx, y: newVy });
        Matter.Body.setAngle(arrow.body, newAngle);
        arrow.angle = newAngle;

        if (isBouncePad) {
          ZombieAudio.playBounce();
        } else {
          ZombieAudio.playRicochet();
        }
        this.spawnRicochetSparks(ax, ay, newAngle);
        return;
      }

      ZombieAudio.playArrowHitGround();
      this.lodgeArrow(arrow, otherBody);
      return;
    }
  }

  // Trigger Fire Arrow Area of Effect Explosion
  public triggerFireExplosion(x: number, y: number) {
    const radius = 70;
    ZombieAudio.playFireExplosion();

    // Visual flame and smoke particles
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      this.particles.push({
        id: this.nextParticleId++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        color: Math.random() > 0.4 ? '#F97316' : '#EF4444',
        size: Math.random() * 5 + 3,
        opacity: 1,
        life: 0,
        maxLife: 20,
        shape: 'flame',
      });
    }

    this.floatTexts.push({
      id: this.nextFloatTextId++,
      text: '🔥 FIRE BLAST!',
      x,
      y: y - 24,
      vy: -1.8,
      color: '#F97316',
      opacity: 1,
      scale: 1.3,
    });

    // Detonate any nearby TNT
    this.obstacles.forEach(o => {
      if (o.type === 'tnt' && !o.isTriggered) {
        const dist = Math.hypot(o.body.position.x - x, o.body.position.y - y);
        if (dist < radius + 20) {
          o.isTriggered = true;
          this.detonateTNT(o);
        }
      } else if (o.type === 'crate' && !o.isTriggered) {
        const dist = Math.hypot(o.body.position.x - x, o.body.position.y - y);
        if (dist < radius) {
          o.isTriggered = true;
          Matter.World.remove(this.world, o.body);
        }
      }
    });

    // Damage & Ignite Zombies within blast radius
    this.zombies.forEach(z => {
      if (z.health <= 0) return;
      const dist = Math.hypot(z.body.position.x - x, z.body.position.y - y);
      if (dist < radius) {
        z.health -= 2;
        z.hitFlashTimer = 8;
        z.isBurning = true;
        z.burnTimer = 180;
        if (z.health <= 0) {
          this.killZombie(z, false);
        }
      }
    });
  }

  // Trigger Freeze Arrow Frost Nova
  public triggerFreezeNova(x: number, y: number) {
    const radius = 85;
    ZombieAudio.playFreezeImpact();

    // Ice crystal particles
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.2;
      this.particles.push({
        id: this.nextParticleId++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        color: Math.random() > 0.3 ? '#38BDF8' : '#BAE6FD',
        size: Math.random() * 4 + 2.5,
        opacity: 1,
        life: 0,
        maxLife: 24,
        shape: 'ice',
      });
    }

    this.floatTexts.push({
      id: this.nextFloatTextId++,
      text: '❄️ FROST NOVA!',
      x,
      y: y - 24,
      vy: -1.8,
      color: '#38BDF8',
      opacity: 1,
      scale: 1.3,
    });

    // Freeze living zombies within radius
    this.zombies.forEach(z => {
      if (z.health <= 0) return;
      const dist = Math.hypot(z.body.position.x - x, z.body.position.y - y);
      if (dist < radius) {
        if (z.isFrozen) {
          // If already frozen, shatter immediately!
          this.triggerIceShatter(z);
        } else {
          z.health -= 1;
          z.isFrozen = true;
          z.freezeTimer = 220; // ~3.5 seconds
          z.speed = 0;
          z.hitFlashTimer = 6;
          Matter.Body.setVelocity(z.body, { x: 0, y: 0 });
          if (z.health <= 0) {
            this.killZombie(z, false);
          }
        }
      }
    });
  }

  // Trigger Shatter on Frozen Zombie (Instant Kill + Bonus points!)
  public triggerIceShatter(zombie: ZombieEntity) {
    ZombieAudio.playIceShatter();
    zombie.health = 0;
    zombie.state = 'dead';

    const zx = zombie.body.position.x;
    const zy = zombie.body.position.y;

    // Burst of flying ice crystal shards
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.particles.push({
        id: this.nextParticleId++,
        x: zx,
        y: zy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color: Math.random() > 0.4 ? '#E0F2FE' : '#38BDF8',
        size: Math.random() * 4.5 + 2,
        opacity: 1,
        life: 0,
        maxLife: 22,
        shape: 'ice',
      });
    }

    this.floatTexts.push({
      id: this.nextFloatTextId++,
      text: '❄️ SHATTERED! +150',
      x: zx,
      y: zy - 26,
      vy: -2,
      color: '#38BDF8',
      opacity: 1,
      scale: 1.4,
    });

    // Remove stuck arrows and physics body
    this.arrows
      .filter(a => a.stuckToBodyId === zombie.body.id)
      .forEach(a => Matter.World.remove(this.world, a.body));
    this.arrows = this.arrows.filter(a => a.stuckToBodyId !== zombie.body.id);
    Matter.World.remove(this.world, zombie.body);

    if (this.onZombieKilled) {
      this.onZombieKilled(zombie, false);
    }
  }

  // Trigger Bomb Heavy Detonation Blast with rich visual shockwaves, fireballs, smoke & sound
  public triggerBombExplosion(x: number, y: number) {
    const radius = 135;
    ZombieAudio.playBombBlast();

    if (this.onExplosionTriggered) {
      this.onExplosionTriggered(x, y, radius);
    }

    // 1. High-Performance Single Core Expanding Shockwave
    this.particles.push({
      id: this.nextParticleId++,
      x,
      y,
      vx: 0,
      vy: 0,
      color: '#FACC15',
      size: 16,
      opacity: 1,
      life: 0,
      maxLife: 14,
      shape: 'shockwave',
    });

    // 2. High-energy explosive fireball puffs (compact, snappy)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 4.5 + 2.0;
      const colors = ['#FEF08A', '#FACC15', '#F97316', '#EF4444'];
      this.particles.push({
        id: this.nextParticleId++,
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.0,
        color: colors[i % colors.length],
        size: Math.random() * 8 + 8,
        opacity: 0.95,
        life: 0,
        maxLife: Math.floor(Math.random() * 6 + 10),
        shape: 'flame',
      });
    }

    // 3. Compact smoke clouds
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      const smokeColors = ['#334155', '#475569', '#64748B'];
      this.particles.push({
        id: this.nextParticleId++,
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed * 0.7,
        vy: -Math.random() * 1.8 - 0.6,
        color: smokeColors[i % smokeColors.length],
        size: Math.random() * 10 + 8,
        opacity: 0.8,
        life: 0,
        maxLife: Math.floor(Math.random() * 8 + 12),
        shape: 'smoke',
      });
    }

    // 4. Snappy radial shrapnel sparks
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const speed = Math.random() * 6 + 3.0;
      this.particles.push({
        id: this.nextParticleId++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.8,
        color: i % 2 === 0 ? '#FEF08A' : '#F97316',
        size: Math.random() * 3 + 2,
        opacity: 1,
        life: 0,
        maxLife: Math.floor(Math.random() * 6 + 8),
        shape: 'spark',
      });
    }

    // Obliteration float text badge
    this.floatTexts.push({
      id: this.nextFloatTextId++,
      text: '💣 BOMB BLAST! +350',
      x,
      y: y - 28,
      vy: -2,
      color: '#FACC15',
      opacity: 1,
      scale: 1.5,
    });

    this.obstacles.forEach(o => {
      const dist = Math.hypot(o.body.position.x - x, o.body.position.y - y);
      if (dist < radius) {
        if (o.type === 'tnt' && !o.isTriggered) {
          o.isTriggered = true;
          this.detonateTNT(o);
        } else if (o.type === 'crate' && !o.isTriggered) {
          o.isTriggered = true;
          Matter.World.remove(this.world, o.body);
        }
      }
    });

    this.zombies.forEach(z => {
      if (z.health <= 0) return;
      const dist = Math.hypot(z.body.position.x - x, z.body.position.y - y);
      if (dist < radius) {
        z.health -= 4;
        z.hitFlashTimer = 10;
        if (z.health <= 0) {
          this.killZombie(z, false);
        }
      }
    });
  }

  // Clean helper to eliminate zombie safely
  private killZombie(zombie: ZombieEntity, isHeadshot: boolean = false) {
    zombie.health = 0;
    zombie.state = 'dead';
    if (!isHeadshot) {
      ZombieAudio.playZombieDefeat();
    }

    this.arrows
      .filter(a => a.stuckToBodyId === zombie.body.id)
      .forEach(a => Matter.World.remove(this.world, a.body));
    this.arrows = this.arrows.filter(a => a.stuckToBodyId !== zombie.body.id);
    Matter.World.remove(this.world, zombie.body);

    this.spawnZombieDeathBlood(zombie.body.position.x, zombie.body.position.y, isHeadshot);
    if (this.onZombieKilled) {
      this.onZombieKilled(zombie, isHeadshot);
    }
  }

  private lodgeArrow(arrow: ArrowEntity, targetBody: Matter.Body) {
    arrow.inFlight = false;
    arrow.stuck = true;
    arrow.stuckAngle = arrow.body.angle;
    arrow.stuckToBodyId = targetBody.id;
    arrow.stuckOffset = {
      x: arrow.body.position.x - targetBody.position.x,
      y: arrow.body.position.y - targetBody.position.y,
    };
    Matter.Body.setVelocity(arrow.body, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(arrow.body, 0);
    Matter.Body.setStatic(arrow.body, true);
  }

  public detonateTNT(obstacle: ObstacleEntity) {
    const x = obstacle.body.position.x;
    const y = obstacle.body.position.y;
    const radius = 135;

    ZombieAudio.playExplosion();

    if (this.onExplosionTriggered) {
      this.onExplosionTriggered(x, y, radius);
    }

    // Blast zombies within radius
    this.zombies.forEach(z => {
      if (z.health <= 0) return;
      const dx = z.body.position.x - x;
      const dy = z.body.position.y - y;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        const forceMag = ((radius - dist) / radius) * 0.14;
        const angle = Math.atan2(dy, dx);
        Matter.Body.applyForce(z.body, z.body.position, {
          x: Math.cos(angle) * forceMag,
          y: Math.sin(angle) * forceMag - 0.08,
        });

        z.health -= 3;
        z.hitFlashTimer = 8;
        if (z.health <= 0) {
          this.killZombie(z, false);
        }
      }
    });

    // Blast nearby dynamic crates or rocks
    this.obstacles.forEach(o => {
      if (o.id === obstacle.id || o.body.isStatic) return;
      const dx = o.body.position.x - x;
      const dy = o.body.position.y - y;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        if (o.type === 'crate') {
          o.isTriggered = true;
          Matter.World.remove(this.world, o.body);
        } else if (!o.body.isStatic) {
          const forceMag = ((radius - dist) / radius) * 0.12;
          Matter.Body.applyForce(o.body, o.body.position, {
            x: (dx / dist) * forceMag,
            y: (dy / dist) * forceMag - 0.05,
          });
        }
      }
    });

    Matter.World.remove(this.world, obstacle.body);
  }

  public shootArrow(
    startX: number,
    startY: number,
    angle: number,
    power: number,
    arrowType: ArrowType = 'regular'
  ): ArrowEntity {
    // Arrow launch velocity matched with wide landscape trajectory
    const speed = Math.min(30, Math.max(10, power * 28));
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    const arrowBody = Matter.Bodies.rectangle(startX, startY, 44, 6, {
      frictionAir: 0, // Zero friction for 100% exact parabolic trajectory match
      density: 0.004,
      restitution: 0.0,
      label: `arrow:${this.nextArrowId}`,
      collisionFilter: {
        category: COLLISION_CATEGORIES.ARROW,
        mask:
          COLLISION_CATEGORIES.TERRAIN |
          COLLISION_CATEGORIES.ZOMBIE |
          COLLISION_CATEGORIES.OBSTACLE |
          COLLISION_CATEGORIES.TRIGGER,
      },
    });

    Matter.Body.setAngle(arrowBody, angle);
    Matter.Body.setVelocity(arrowBody, { x: vx, y: vy });
    Matter.World.add(this.world, arrowBody);

    const arrowEntity: ArrowEntity = {
      id: this.nextArrowId++,
      body: arrowBody,
      inFlight: true,
      stuck: false,
      angle,
      trail: [],
      bounces: 0,
      maxBounces: arrowType === 'bomb' ? 0 : 2,
      arrowType,
    };

    this.arrows.push(arrowEntity);
    if (arrowType === 'bomb') {
      ZombieAudio.playBombThrow();
    } else {
      ZombieAudio.playBowRelease();
    }

    // Point-blank check: If a living zombie is standing right in front of the bow launch point,
    // trigger immediate direct hit so the arrow never misses or ghosts through at close range
    const pointBlankZombie = this.zombies.find(z => {
      if (z.health <= 0) return false;
      const halfW = z.width / 2 + 10;
      const halfH = z.height / 2 + 10;
      const zx = z.body.position.x;
      const zy = z.body.position.y;
      return (
        startX >= zx - halfW &&
        startX <= zx + halfW &&
        startY >= zy - halfH &&
        startY <= zy + halfH
      );
    });

    if (pointBlankZombie) {
      this.handleArrowHit(arrowBody, pointBlankZombie.body);
    }

    return arrowEntity;
  }

  // Pure deterministic 60 FPS update
  public update() {
    const fixedDt = 1000 / 60;
    Matter.Engine.update(this.engine, fixedDt);

    // Update Moving Platforms
    this.movingPlatforms.forEach(mp => {
      mp.progress += mp.speed * mp.direction * 0.016;
      if (mp.progress >= 1) {
        mp.progress = 1;
        mp.direction = -1;
      } else if (mp.progress <= 0) {
        mp.progress = 0;
        mp.direction = 1;
      }
      const curX = mp.startX + (mp.endX - mp.startX) * mp.progress;
      const curY = mp.startY + (mp.endY - mp.startY) * mp.progress;
      Matter.Body.setPosition(mp.body, { x: curX, y: curY });
    });

    // Update Arrows in Flight
    const windAcc = (this.level.wind?.x ?? 0) * 0.015;
    this.arrows.forEach(arrow => {
      if (arrow.inFlight && !arrow.stuck) {
        if (windAcc !== 0) {
          arrow.body.velocity.x += windAcc;
        }

        const vx = arrow.body.velocity.x;
        const vy = arrow.body.velocity.y;
        if (Math.hypot(vx, vy) > 0.5) {
          const currentAngle = Math.atan2(vy, vx);
          Matter.Body.setAngle(arrow.body, currentAngle);
          arrow.angle = currentAngle;
        }

        // Trailing fuse sizzle particles for thrown bomb in flight
        if (arrow.arrowType === 'bomb') {
          if (Math.random() < 0.7) {
            // Sizzling spark from burning fuse
            this.particles.push({
              id: this.nextParticleId++,
              x: arrow.body.position.x - Math.cos(arrow.angle) * 12,
              y: arrow.body.position.y - Math.sin(arrow.angle) * 12,
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5 - 0.4,
              color: Math.random() > 0.4 ? '#FDE047' : '#F97316',
              size: Math.random() * 2.5 + 2,
              opacity: 0.95,
              life: 0,
              maxLife: 10,
              shape: 'spark',
            });
          }
          if (Math.random() < 0.45) {
            // Wisp of fuse smoke trailing behind
            this.particles.push({
              id: this.nextParticleId++,
              x: arrow.body.position.x - Math.cos(arrow.angle) * 14,
              y: arrow.body.position.y - Math.sin(arrow.angle) * 14,
              vx: (Math.random() - 0.5) * 0.8,
              vy: -Math.random() * 0.8 - 0.3,
              color: '#64748B',
              size: Math.random() * 3 + 2.5,
              opacity: 0.7,
              life: 0,
              maxLife: 14,
              shape: 'smoke',
            });
          }
        }

        // --- Continuous Collision Detection (CCD): Swept AABB checks against all living zombies ---
        const arrowPos = arrow.body.position;
        const prevX = arrowPos.x - vx;
        const prevY = arrowPos.y - vy;

        for (const zombie of this.zombies) {
          if (zombie.health <= 0) continue;

          const zx = zombie.body.position.x;
          const zy = zombie.body.position.y;
          const halfW = zombie.width / 2 + 10;
          const halfH = zombie.height / 2 + 8;

          if (
            this.segmentIntersectsAABB(
              prevX,
              prevY,
              arrowPos.x,
              arrowPos.y,
              zx - halfW,
              zy - halfH,
              zx + halfW,
              zy + halfH
            )
          ) {
            this.handleArrowHit(arrow.body, zombie.body);
            break;
          }
        }

        // CCD swept check against interactive obstacles (TNT, crates)
        if (arrow.inFlight && !arrow.stuck) {
          for (const obstacle of this.obstacles) {
            if (obstacle.isTriggered || obstacle.isOpen) continue;
            const ox = obstacle.body.position.x;
            const oy = obstacle.body.position.y;
            const halfW = obstacle.width / 2 + 6;
            const halfH = obstacle.height / 2 + 6;

            if (
              this.segmentIntersectsAABB(
                prevX,
                prevY,
                arrowPos.x,
                arrowPos.y,
                ox - halfW,
                oy - halfH,
                ox + halfW,
                oy + halfH
              )
            ) {
              this.handleArrowHit(arrow.body, obstacle.body);
              break;
            }
          }
        }

        // Out of world bounds
        if (
          arrow.body.position.y > this.level.worldHeight + 200 ||
          arrow.body.position.x < -200 ||
          arrow.body.position.x > this.level.worldWidth + 200
        ) {
          arrow.inFlight = false;
          Matter.World.remove(this.world, arrow.body);
        }
      } else if (arrow.stuck && arrow.stuckToBodyId && arrow.stuckOffset) {
        const targetBody = Matter.Composite.allBodies(this.world).find(
          b => b.id === arrow.stuckToBodyId
        );
        if (targetBody) {
          Matter.Body.setPosition(arrow.body, {
            x: targetBody.position.x + arrow.stuckOffset.x,
            y: targetBody.position.y + arrow.stuckOffset.y,
          });
        } else {
          // Target body no longer exists! Clean up stuck arrow immediately
          Matter.World.remove(this.world, arrow.body);
          arrow.inFlight = false;
        }
      }
    });

    // Remove any dead/orphaned arrows from array
    this.arrows = this.arrows.filter(
      a => a.inFlight || (a.stuck && (!a.stuckToBodyId || Matter.Composite.allBodies(this.world).some(b => b.id === a.stuckToBodyId)))
    );

    // Update Particles (Blood, Slime, Sparks, Shockwaves)
    if (this.particles.length > 25) {
      this.particles.splice(0, this.particles.length - 25);
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life++;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }
      if (p.shape === 'shockwave') {
        p.opacity = 1 - p.life / p.maxLife;
        continue;
      }
      p.x += p.vx;
      p.y += p.vy;
      if (p.shape === 'smoke') {
        p.vy -= 0.04; // buoyant smoke ascends into air
        p.vx *= 0.94;
      } else {
        p.vy += p.shape === 'spark' ? 0.15 : 0.28; // parabolic gravity
        p.vx *= 0.95; // air drag
      }
      p.opacity = 1 - p.life / p.maxLife;
    }

    // Update Float Texts (Headshot badges)
    for (let i = this.floatTexts.length - 1; i >= 0; i--) {
      const ft = this.floatTexts[i];
      ft.y += ft.vy;
      ft.vy *= 0.94;
      ft.opacity -= 0.024;
      if (ft.opacity <= 0) {
        this.floatTexts.splice(i, 1);
      }
    }

    // Update Zombies
    this.updateZombies();
  }

  // Helper to detect ANY big object (platform wall, cliff, pillar, crate, rock, barricade) ahead of zombie
  private getBigObjectAhead(
    zx: number,
    zy: number,
    zWidth: number,
    zHeight: number,
    moveDir: number,
    playerX: number
  ): { dist: number; topY: number; height: number; type: 'platform' | 'obstacle' } | null {
    const feetY = zy + zHeight / 2;
    const frontX = zx + moveDir * (zWidth / 2);
    let bestMatch: { dist: number; topY: number; height: number; type: 'platform' | 'obstacle' } | null = null;

    // 1. Check all platforms (walls, cliffs, pillars, high platforms)
    for (const p of this.level.platforms) {
      const halfW = p.width / 2;
      const halfH = p.height / 2;
      const topY = p.y - halfH;
      const bottomY = p.y + halfH;

      // Ignore platform if zombie is already standing firmly on top of it!
      const isStandingOnThisPlatform =
        zx >= p.x - halfW - 4 &&
        zx <= p.x + halfW + 4 &&
        Math.abs(feetY - topY) <= 16;
      if (isStandingOnThisPlatform) continue;

      const wallX = moveDir > 0 ? p.x - halfW : p.x + halfW;
      const distToFace = (wallX - frontX) * moveDir;

      // Platform wall must be in front towards player (between 0 and 52px away)
      const isAhead = distToFace >= 0 && distToFace <= 52;
      // Must be an actual wall/step significantly higher than feet (at least 20px step-up)
      const isElevationOrWall = topY < feetY - 20 && bottomY > zy - zHeight / 2;
      const isBetweenZombieAndPlayer = (wallX - zx) * moveDir > 0 && (playerX - wallX) * moveDir >= -10;

      if (isAhead && isElevationOrWall && isBetweenZombieAndPlayer) {
        if (!bestMatch || distToFace < bestMatch.dist) {
          bestMatch = { dist: distToFace, topY, height: p.height, type: 'platform' };
        }
      }
    }

    // 2. Check interactive obstacles (single or stacked crates, rocks, barriers, tnt)
    for (const o of this.obstacles) {
      if (o.isTriggered || o.isOpen) continue;
      const ox = o.body.position.x;
      const oy = o.body.position.y;
      const halfW = o.width / 2;
      const halfH = o.height / 2;
      const topY = oy - halfH;
      const bottomY = oy + halfH;

      // Ignore obstacle if zombie is already standing on top of it!
      const isStandingOnThisObstacle =
        zx >= ox - halfW - 4 &&
        zx <= ox + halfW + 4 &&
        Math.abs(feetY - topY) <= 16;
      if (isStandingOnThisObstacle) continue;

      const faceX = moveDir > 0 ? ox - halfW : ox + halfW;
      const distToFace = (faceX - frontX) * moveDir;

      // Must be directly in front
      const isAhead = distToFace >= 0 && distToFace <= 54;
      // Must be an obstacle sticking up in front of zombie (at least 20px step-up)
      const isBlocking = topY < feetY - 20 && bottomY > zy - zHeight / 2;
      const isBetweenZombieAndPlayer = (faceX - zx) * moveDir > 0 && (playerX - faceX) * moveDir >= -10;

      if (isAhead && isBlocking && isBetweenZombieAndPlayer) {
        if (!bestMatch) {
          bestMatch = { dist: distToFace, topY, height: o.height, type: 'obstacle' };
        } else {
          const highestTop = Math.min(topY, bestMatch.topY);
          const closestDist = Math.min(distToFace, bestMatch.dist);
          bestMatch = { dist: closestDist, topY: highestTop, height: Math.max(o.height, bestMatch.height), type: 'obstacle' };
        }
      }
    }

    return bestMatch;
  }

  // Helper to check if a position has solid walkable ground within safe step or small drop range
  public hasWalkableGroundAhead(checkX: number, zy: number, zHeight: number): boolean {
    const feetY = zy + zHeight / 2;
    // Check static platforms
    const onPlatform = this.level.platforms.some(p => {
      const halfW = p.width / 2;
      const halfH = p.height / 2;
      const topY = p.y - halfH;
      if (checkX >= p.x - halfW && checkX <= p.x + halfW) {
        const dropDist = topY - feetY;
        return dropDist >= -18 && dropDist <= 70;
      }
      return false;
    });
    if (onPlatform) return true;

    // Check solid obstacles (e.g. stepping along tops of crates or rocks)
    const onObstacle = this.obstacles.some(o => {
      if (o.isTriggered || o.isOpen) return false;
      const ox = o.body.position.x;
      const oy = o.body.position.y;
      const halfW = o.width / 2;
      const halfH = o.height / 2;
      const topY = oy - halfH;
      if (checkX >= ox - halfW && checkX <= ox + halfW) {
        const dropDist = topY - feetY;
        return dropDist >= -18 && dropDist <= 70;
      }
      return false;
    });

    return onObstacle;
  }

  // Robust grounded detection: checks static platforms, moving platforms, obstacles, and world floor
  public isZombieGrounded(z: ZombieEntity): boolean {
    const feetY = z.body.position.y + z.height / 2;
    const zx = z.body.position.x;

    // 1. Static Platforms
    const onPlatform = this.level.platforms.some(p => {
      const halfW = p.width / 2;
      const halfH = p.height / 2;
      const topY = p.y - halfH;
      return zx >= p.x - halfW - 14 && zx <= p.x + halfW + 14 && Math.abs(feetY - topY) <= 20;
    });

    // 2. Moving Platforms (using real-time dynamic body position)
    const onMovingPlatform = this.movingPlatforms.some(mp => {
      const halfW = mp.width / 2;
      const halfH = mp.height / 2;
      const topY = mp.body.position.y - halfH;
      return (
        zx >= mp.body.position.x - halfW - 14 &&
        zx <= mp.body.position.x + halfW + 14 &&
        Math.abs(feetY - topY) <= 22
      );
    });

    // 3. Solid Obstacles (crates, rocks, bounce pads, spikes in pits)
    const onObstacle = this.obstacles.some(o => {
      if (o.isTriggered || o.isOpen) return false;
      const ox = o.body.position.x;
      const oy = o.body.position.y;
      const halfW = o.width / 2;
      const halfH = o.height / 2;
      const topY = oy - halfH;
      return zx >= ox - halfW - 14 && zx <= ox + halfW + 14 && Math.abs(feetY - topY) <= 22;
    });

    // 4. World Floor / Pit Bottom
    const onWorldFloor = feetY >= this.level.worldHeight - 45;

    return (onPlatform || onMovingPlatform || onObstacle || onWorldFloor) && Math.abs(z.body.velocity.y) < 4.5;
  }

  private updateZombies() {
    const playerX = this.level.playerPos.x;
    const playerY = this.level.playerPos.y;

    this.zombies.forEach(z => {
      if (z.health <= 0) return;
      if (z.hitFlashTimer > 0) z.hitFlashTimer--;

      // Decrement jump and climb cooldowns
      if (z.jumpCooldown && z.jumpCooldown > 0) z.jumpCooldown--;
      if (z.climbCooldown && z.climbCooldown > 0) z.climbCooldown--;

      // Handle FROZEN Zombie State (Immobilized completely in solid ice block!)
      if (z.isFrozen) {
        if (z.freezeTimer && z.freezeTimer > 0) {
          z.freezeTimer--;
        } else {
          z.isFrozen = false;
        }
        Matter.Body.setVelocity(z.body, { x: 0, y: Math.min(z.body.velocity.y, 1) });
        return;
      }

      // Handle BURNING Zombie State
      if (z.isBurning) {
        if (z.burnTimer && z.burnTimer > 0) {
          z.burnTimer--;
          if (z.burnTimer % 28 === 0) {
            z.health -= 1;
            z.hitFlashTimer = 6;
            this.particles.push({
              id: this.nextParticleId++,
              x: z.body.position.x + (Math.random() - 0.5) * 16,
              y: z.body.position.y - 12,
              vx: (Math.random() - 0.5) * 1,
              vy: -Math.random() * 2 - 1,
              color: '#F97316',
              size: 4,
              opacity: 0.9,
              life: 0,
              maxLife: 14,
              shape: 'flame',
            });
            if (z.health <= 0) {
              this.killZombie(z, false);
              return;
            }
          }
        } else {
          z.isBurning = false;
        }
      }

      const zx = z.body.position.x;
      const zy = z.body.position.y;
      const dxToPlayer = playerX - zx;
      const distToPlayer = Math.abs(dxToPlayer);
      const verticalDiff = playerY - zy; // Negative means player is ABOVE zombie
      const dyToPlayer = Math.abs(verticalDiff);

      const moveTowardsPlayer = dxToPlayer > 0 ? 1 : -1;

      // 1. Flying Zombie Full 2D Navigation
      if (z.type === 'flying') {
        z.facingLeft = moveTowardsPlayer < 0;
        z.flyPhase = (z.flyPhase ?? 0) + 0.05;
        const targetVx = moveTowardsPlayer * (z.speed * 1.3);
        const verticalVel = dyToPlayer > 15
          ? (verticalDiff > 0 ? 1.8 : -2.4)
          : Math.sin(z.flyPhase) * 1.2;
        Matter.Body.setVelocity(z.body, { x: targetVx, y: verticalVel });
        Matter.Body.applyForce(z.body, z.body.position, { x: 0, y: -0.008 });

        const movedDist = Math.abs(zx - (z.lastX ?? zx));
        if (movedDist < 0.35 && distToPlayer > 60) {
          z.stuckTotalFrames = (z.stuckTotalFrames ?? 0) + 1;
        } else {
          z.stuckTotalFrames = 0;
        }
        z.lastX = zx;

        if ((z.stuckTotalFrames ?? 0) >= 270) {
          this.killZombie(z, false);
          return;
        }
      } else {
        z.isGrounded = this.isZombieGrounded(z);

        // Reset jump state when landed firmly on ground or obstacle
        if (z.isGrounded && z.state === 'jump') {
          z.state = 'walk';
          z.jumpVx = undefined;
          z.stuckFrames = 0;
          z.jumpCooldown = Math.max(z.jumpCooldown ?? 0, 55);
        }

        // 2. Attack Check: Melee slashing when in front combat range
        const attackRange = z.type === 'giant' || z.type === 'boss' ? 75 : 65;
        if (distToPlayer <= attackRange && dyToPlayer < 75) {
          z.facingLeft = moveTowardsPlayer < 0;
          z.state = 'attack';
          z.attackTimer += 0.016;

          // Blood slash effect arriving at player!
          if (z.attackTimer > 0.18 && Math.random() < 0.28) {
            this.spawnPlayerBloodSlash(playerX, playerY + 8);
          }

          if (z.attackTimer >= 0.85) {
            this.spawnPlayerBloodSlash(playerX, playerY + 8);
            if (this.onPlayerAttacked) {
              this.onPlayerAttacked();
            }
          }
          Matter.Body.setVelocity(z.body, { x: 0, y: z.body.velocity.y });
          return;
        }

        let currentSpeed = z.speed;
        if (z.type === 'sneaky') {
          currentSpeed = distToPlayer > 320 ? 0.4 : 2.6;
        }

        const feetY = zy + z.height / 2;
        const playerFeetY = playerY + 50;

        // Detect player's platform and elevation
        const playerPlatform = this.level.platforms.find(p => {
          const halfW = p.width / 2;
          const halfH = p.height / 2;
          const topY = p.y - halfH;
          return (
            playerX >= p.x - halfW - 40 &&
            playerX <= p.x + halfW + 40 &&
            Math.abs(playerY + 50 - topY) <= 50
          );
        });
        const playerPlatformTop = playerPlatform
          ? playerPlatform.y - playerPlatform.height / 2
          : playerY + 50;

        // Check if zombie is already on the exact same platform or elevation as the player
        const isZombieOnSameElevation = Math.abs(feetY - playerFeetY) <= 24;
        const isZombieOnPlayerPlatform = playerPlatform &&
          zx >= playerPlatform.x - playerPlatform.width / 2 - 20 &&
          zx <= playerPlatform.x + playerPlatform.width / 2 + 20 &&
          isZombieOnSameElevation;

        // Player is only considered truly "above" if player feet are at least 32px higher than zombie feet!
        const isPlayerAbove = !isZombieOnSameElevation && (playerFeetY < feetY - 32);

        // Track whether zombie is blocked/stuck against an actual obstacle or wall while grounded
        const movedDist = Math.abs(zx - (z.lastX ?? zx));
        if (z.isGrounded && Math.abs(moveTowardsPlayer) > 0) {
          if (movedDist < 0.22) {
            z.stuckFrames = (z.stuckFrames ?? 0) + 1;
          } else {
            z.stuckFrames = 0;
          }
        } else {
          z.stuckFrames = 0;
        }

        // Global stuck watchdog: tracks lack of net horizontal progress regardless of jump state
        if (movedDist < 0.35 && distToPlayer > 60) {
          z.stuckTotalFrames = (z.stuckTotalFrames ?? 0) + 1;
        } else {
          z.stuckTotalFrames = 0;
        }
        z.lastX = zx;

        // Escalation 1: If stuck for ~1.5s (90 frames) without forward progress, force a high unstick leap
        if ((z.stuckTotalFrames ?? 0) === 90) {
          Matter.Body.setPosition(z.body, { x: zx - moveTowardsPlayer * 8, y: zy - 8 });
          Matter.Body.setVelocity(z.body, { x: moveTowardsPlayer * 4.6, y: -11.5 });
          z.state = 'jump';
          z.isGrounded = false;
          z.jumpCooldown = 60;
          return;
        }

        // Escalation 2: Universal Stuck Watchdog Fail-Safe!
        // If stuck/trapped in impossible geometry anywhere for 4.5s (270 frames), eliminate cleanly to prevent soft-lock
        if ((z.stuckTotalFrames ?? 0) >= 270) {
          this.killZombie(z, false);
          return;
        }

        // Only consider stuck if blocked for at least 28 frames (~0.47s) AND not already on same flat platform near player!
        const isStuckAgainstObject = (z.stuckFrames ?? 0) >= 28 && !isZombieOnPlayerPlatform;

        // Check if zombie is directly underneath the player's platform ceiling
        let isUnderPlatformCeiling = false;
        if (isPlayerAbove && playerPlatform) {
          const halfW = playerPlatform.width / 2;
          const pLeft = playerPlatform.x - halfW;
          const pRight = playerPlatform.x + halfW;
          const pBottom = playerPlatform.y + playerPlatform.height / 2;
          if (zx >= pLeft + 10 && zx <= pRight - 10 && zy >= pBottom - 10) {
            isUnderPlatformCeiling = true;
          }
        }

        // Comprehensive Big Object Detection (walls, cliffs, pillars, crates, rocks, barriers)
        const bigObjectAhead = this.getBigObjectAhead(zx, zy, z.width, z.height, moveTowardsPlayer, playerX);

        // 3. BIG JUMP ACTION:
        // Launch a powerful, clean jump when facing any wall, cliff, crate, pit, or upper platform!
        const canJumpTowardsPlayer = distToPlayer >= 50;
        const hasGroundAhead = this.hasWalkableGroundAhead(zx + moveTowardsPlayer * 30, zy, z.height);
        const isNoSpaceAhead = canJumpTowardsPlayer && !hasGroundAhead && !isZombieOnPlayerPlatform;
        const isJumperReady = z.type === 'jumper' && (z.jumpCooldown ?? 0) <= 0 && canJumpTowardsPlayer && !isZombieOnPlayerPlatform;
        const shouldJumpToUpper =
          isPlayerAbove &&
          !isZombieOnPlayerPlatform &&
          distToPlayer < 360 &&
          !isUnderPlatformCeiling;
        const shouldJumpOverBigObject = bigObjectAhead !== null && !isUnderPlatformCeiling;

        const isReadyToJump =
          (z.jumpCooldown ?? 0) <= 0 &&
          (z.isGrounded || Math.abs(z.body.velocity.y) < 2.5);

        if (
          (shouldJumpOverBigObject || isStuckAgainstObject || isNoSpaceAhead || shouldJumpToUpper || isJumperReady) &&
          isReadyToJump &&
          canJumpTowardsPlayer
        ) {
          z.facingLeft = moveTowardsPlayer < 0;
          z.jumpCooldown = z.type === 'jumper' ? 45 : 65;
          z.stuckFrames = 0;

          let jumpPower: number;
          let forwardSpeed: number;

          if (bigObjectAhead) {
            // Big jump to clear the big object (wall, cliff, stacked crates, rock, barricade)
            const objectElevation = Math.max(0, feetY - bigObjectAhead.topY);
            const targetClearanceHeight = Math.max(90, Math.min(220, objectElevation + 40));
            // In Matter.js: v_y = sqrt(2 * g * H) with effective gravity scale
            jumpPower = Math.min(11.8, Math.max(9.0, Math.sqrt(0.56 * targetClearanceHeight)));
            forwardSpeed = 3.8;
          } else if (shouldJumpToUpper) {
            // Big jump up to upper platform where player is perched
            const heightDiff = Math.max(dyToPlayer, Math.abs(zy - playerPlatformTop));
            const targetClearanceHeight = Math.max(90, Math.min(220, heightDiff + 42));
            jumpPower = Math.min(11.8, Math.max(9.0, Math.sqrt(0.56 * targetClearanceHeight)));
            forwardSpeed = 3.6;
          } else if (isStuckAgainstObject) {
            // Blocked against an unexpected object or debris - launch powerful big jump to clear it
            jumpPower = 9.6;
            forwardSpeed = 3.8;
          } else if (isNoSpaceAhead) {
            // Big jump across pit / chasm gap
            jumpPower = 8.4;
            forwardSpeed = 4.2;
          } else {
            // Standard Jumper athletic leap
            jumpPower = 7.8;
            forwardSpeed = 3.4;
          }

          // Nudge 6px away from the obstacle/wall and 3px upward to break rigid friction contact before launching!
          if (bigObjectAhead || isStuckAgainstObject) {
            Matter.Body.setPosition(z.body, { x: zx - moveTowardsPlayer * 6, y: zy - 4 });
          }

          const targetVx = moveTowardsPlayer * forwardSpeed;
          z.jumpVx = targetVx;
          Matter.Body.setVelocity(z.body, { x: targetVx, y: -jumpPower });
          z.state = 'jump';
          z.isGrounded = false;
          return;
        }

        // 5. Airborne forward momentum
        if (!z.isGrounded) {
          z.state = 'jump';

          // Prevent overshooting behind player
          const isPastPlayer =
            (moveTowardsPlayer < 0 && zx <= playerX + 25) ||
            (moveTowardsPlayer > 0 && zx >= playerX - 25);

          if (isPastPlayer) {
            Matter.Body.setVelocity(z.body, { x: 0, y: z.body.velocity.y });
          } else {
            // Crucial: keep forward velocity active throughout the jump arc
            // so touching an obstacle edge or corner never kills forward velocity!
            const targetVx = z.jumpVx ?? (moveTowardsPlayer * 3.6);
            Matter.Body.setVelocity(z.body, { x: targetVx, y: z.body.velocity.y });
          }
          return;
        }

        // If directly underneath a solid platform ceiling, step out toward open edge first
        if (isUnderPlatformCeiling && playerPlatform) {
          const halfW = playerPlatform.width / 2;
          const pRight = playerPlatform.x + halfW;
          const pLeft = playerPlatform.x - halfW;
          const exitDir = Math.abs(zx - pRight) < Math.abs(zx - pLeft) ? 1 : -1;
          z.state = 'walk';
          z.facingLeft = exitDir < 0;
          z.walkCycle += 0.3;
          Matter.Body.setVelocity(z.body, {
            x: exitDir * Math.max(currentSpeed * 1.6, 4.0),
            y: z.body.velocity.y,
          });
          return;
        }

        // 6. Ground Walking / Running towards the player
        z.state = 'walk';
        z.facingLeft = moveTowardsPlayer < 0;
        z.walkCycle += z.type === 'runner' ? 0.45 : 0.25;

        // Front combat boundary: When reaching melee range of player, attack!
        if (distToPlayer <= 55 && dyToPlayer <= 75) {
          z.state = 'attack';
          Matter.Body.setVelocity(z.body, { x: 0, y: z.body.velocity.y });
          return;
        }

        Matter.Body.setVelocity(z.body, {
          x: moveTowardsPlayer * currentSpeed,
          y: z.body.velocity.y,
        });
      }

      // Pit / Abyss Hazard: Any zombie falling below walkable ground level into a pit/chasm
      const pitHazardY = this.level.worldHeight <= 450 ? (LANDSCAPE_GROUND_Y + 34) : (this.level.worldHeight - 40);
      if (zy > pitHazardY && z.health > 0) {
        this.killZombie(z, false);
        return;
      }

      // Out of bounds death (when blasted off-screen by TNT/explosions)
      if (zy > this.level.worldHeight + 80 && z.health > 0) {
        this.killZombie(z, false);
        return;
      }
    });
  }

  // Fast, crisp cartoon blood burst on zombie defeat (high FPS, low node overhead)
  public spawnZombieDeathBlood(x: number, y: number, isHeadshot: boolean, knockDir: number = 1) {
    const count = isHeadshot ? 4 : 3;
    const colors = ['#DC2626', '#EF4444', '#84CC16'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (isHeadshot ? 4.0 : 2.5) + 1.2;
      this.particles.push({
        id: this.nextParticleId++,
        x,
        y: isHeadshot ? y - 14 : y,
        vx: Math.cos(angle) * speed + knockDir * 0.8,
        vy: Math.sin(angle) * speed - (isHeadshot ? 2.0 : 0.8),
        color: colors[i % colors.length],
        size: Math.random() * 3 + 2,
        opacity: 1,
        life: 0,
        maxLife: 9,
        shape: 'circle',
      });
    }
  }

  // Floating text badge for headshots (removed per user request - headshot_icon used in center)
  public spawnHeadshotText(_x: number, _y: number) {
    // In-game floating headshot text animations removed
  }

  // Golden spark burst when arrow ricochets off solid surfaces
  public spawnRicochetSparks(x: number, y: number, angle: number) {
    for (let i = 0; i < 9; i++) {
      const sparkAngle = angle + Math.PI + (Math.random() - 0.5) * 1.6;
      const speed = Math.random() * 5 + 2.5;
      this.particles.push({
        id: this.nextParticleId++,
        x,
        y,
        vx: Math.cos(sparkAngle) * speed,
        vy: Math.sin(sparkAngle) * speed - 1.2,
        color: Math.random() > 0.4 ? '#F59E0B' : '#FEF08A',
        size: Math.random() * 3 + 2,
        opacity: 1,
        life: 0,
        maxLife: Math.floor(Math.random() * 10) + 12,
        shape: 'spark',
      });
    }
  }

  // Spawn sharp blood claw slash marks at player location when under zombie attack
  public spawnPlayerBloodSlash(x: number, y: number) {
    for (let i = 0; i < 7; i++) {
      this.particles.push({
        id: this.nextParticleId++,
        x: x + (Math.random() - 0.5) * 22,
        y: y + (Math.random() - 0.5) * 32,
        vx: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 3 + 2),
        vy: -Math.random() * 2.5,
        color: '#DC2626',
        size: Math.random() * 4 + 2,
        opacity: 1,
        life: 0,
        maxLife: 18,
        shape: 'spark',
      });
    }
  }

  // Full widescreen landscape trajectory predictor with logical obstacle & platform reflection!
  public calculateTrajectory(
    startX: number,
    startY: number,
    angle: number,
    power: number,
    arrowType: ArrowType = 'regular',
    maxSteps: number = 85
  ): TrajectoryPoint[] {
    const points: TrajectoryPoint[] = [{ x: startX, y: startY }];
    const speed = Math.min(30, Math.max(10, power * 28));
    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;

    const dt = 1000 / 60;
    const g = (this.world.gravity.y ?? 1.0) * (this.world.gravity.scale ?? 0.001) * dt * dt;
    const windAcc = (this.level.wind?.x ?? 0) * 0.015;

    let curX = startX;
    let curY = startY;
    let bounces = 0;
    const maxBounces = arrowType === 'bomb' ? 0 : 2;

    for (let step = 0; step < maxSteps; step++) {
      vx += windAcc;
      vy += g;

      const nextX = curX + vx;
      const nextY = curY + vy;

      // Find closest intersection among all platforms, solid obstacles, moving platforms, and zombies
      let closestHit: { t: number; nx: number; ny: number; isBouncePad: boolean; isZombie: boolean } | null = null;

      // 1. Check Platforms
      for (const p of this.level.platforms) {
        const halfW = p.width / 2;
        const halfH = p.height / 2;
        const hit = this.getSegmentAABBIntersection(
          curX,
          curY,
          nextX,
          nextY,
          p.x - halfW,
          p.y - halfH,
          p.x + halfW,
          p.y + halfH
        );
        if (hit && (!closestHit || hit.t < closestHit.t)) {
          closestHit = { ...hit, isBouncePad: false, isZombie: false };
        }
      }

      // 2. Check Solid Obstacles (crates, rocks, bounce pads, closed gates, tnt)
      for (const o of this.obstacles) {
        if (o.isTriggered || o.isOpen) continue;
        const halfW = o.width / 2;
        const halfH = o.height / 2;
        const ox = o.body.position.x;
        const oy = o.body.position.y;
        const hit = this.getSegmentAABBIntersection(
          curX,
          curY,
          nextX,
          nextY,
          ox - halfW,
          oy - halfH,
          ox + halfW,
          oy + halfH
        );
        if (hit && (!closestHit || hit.t < closestHit.t)) {
          closestHit = { ...hit, isBouncePad: o.type === 'bounce_pad', isZombie: false };
        }
      }

      // 3. Check Moving Platforms
      for (const mp of this.movingPlatforms) {
        const halfW = mp.width / 2;
        const halfH = mp.height / 2;
        const mpx = mp.body.position.x;
        const mpy = mp.body.position.y;
        const hit = this.getSegmentAABBIntersection(
          curX,
          curY,
          nextX,
          nextY,
          mpx - halfW,
          mpy - halfH,
          mpx + halfW,
          mpy + halfH
        );
        if (hit && (!closestHit || hit.t < closestHit.t)) {
          closestHit = { ...hit, isBouncePad: false, isZombie: false };
        }
      }

      // 4. Check Living Zombies
      for (const z of this.zombies) {
        if (z.health <= 0) continue;
        const halfW = z.width / 2;
        const halfH = z.height / 2;
        const zx = z.body.position.x;
        const zy = z.body.position.y;
        const hit = this.getSegmentAABBIntersection(
          curX,
          curY,
          nextX,
          nextY,
          zx - halfW,
          zy - halfH,
          zx + halfW,
          zy + halfH
        );
        if (hit && (!closestHit || hit.t < closestHit.t)) {
          closestHit = { ...hit, isBouncePad: false, isZombie: true };
        }
      }

      if (closestHit) {
        const hitX = curX + (nextX - curX) * closestHit.t;
        const hitY = curY + (nextY - curY) * closestHit.t;

        if (closestHit.isZombie) {
          // Arrow directly strikes the zombie! Stop trajectory at zombie target
          points.push({ x: hitX, y: hitY, isTargetingZombie: true });
          break;
        }

        // Arrow strikes platform or solid obstacle
        points.push({ x: hitX, y: hitY, isBounce: true });
        bounces++;

        if (bounces <= maxBounces) {
          // Dynamic reflection calculation: v' = (v - 2*(v·n)*n) * restitution
          const restitution = closestHit.isBouncePad ? 1.35 : 0.85;
          const dot = vx * closestHit.nx + vy * closestHit.ny;
          vx = (vx - 2 * dot * closestHit.nx) * restitution;
          vy = (vy - 2 * dot * closestHit.ny) * restitution;

          const speedMag = Math.hypot(vx, vy);
          if (speedMag < 9) {
            const boost = 9.5 / Math.max(0.1, speedMag);
            vx *= boost;
            vy *= boost;
          }

          curX = hitX + closestHit.nx * 3;
          curY = hitY + closestHit.ny * 3;
          continue;
        } else {
          // Final bounce reached: stop trajectory
          break;
        }
      }

      points.push({ x: nextX, y: nextY });
      curX = nextX;
      curY = nextY;

      if (curY > this.level.worldHeight || curX < -50 || curX > this.level.worldWidth + 50) {
        break;
      }
    }

    return points;
  }

  // Exact 2D Line Segment to AABB intersection with face normal calculation (Liang-Barsky)
  public getSegmentAABBIntersection(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    minX: number,
    minY: number,
    maxX: number,
    maxY: number
  ): { t: number; nx: number; ny: number } | null {
    const dx = x2 - x1;
    const dy = y2 - y1;

    let t0 = 0;
    let t1 = 1;
    let nx0 = 0;
    let ny0 = 0;

    const sides = [
      { p: -dx, q: x1 - minX, nx: -1, ny: 0 },
      { p: dx, q: maxX - x1, nx: 1, ny: 0 },
      { p: -dy, q: y1 - minY, nx: 0, ny: -1 },
      { p: dy, q: maxY - y1, nx: 0, ny: 1 },
    ];

    for (let i = 0; i < 4; i++) {
      const { p, q, nx, ny } = sides[i];
      if (p === 0) {
        if (q < 0) return null;
      } else {
        const t = q / p;
        if (p < 0) {
          if (t > t1) return null;
          if (t > t0) {
            t0 = t;
            nx0 = nx;
            ny0 = ny;
          }
        } else {
          if (t < t0) return null;
          if (t < t1) {
            t1 = t;
          }
        }
      }
    }

    if (t0 >= 0 && t0 <= 1) {
      return { t: t0, nx: nx0, ny: ny0 };
    }
    return null;
  }

  // Backward compatibility CCD helper
  public segmentIntersectsAABB(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    minX: number,
    minY: number,
    maxX: number,
    maxY: number
  ): boolean {
    return this.getSegmentAABBIntersection(x1, y1, x2, y2, minX, minY, maxX, maxY) !== null;
  }

  public destroy() {
    Matter.Events.off(this.engine, 'collisionStart', () => {});
    Matter.World.clear(this.world, false);
    Matter.Engine.clear(this.engine);
  }
}
