import Matter from 'matter-js';
import {
  LevelConfig,
  PlatformConfig,
  ObstacleConfig,
  ZombieConfig,
  ArrowEntity,
  ZombieEntity,
  ObstacleEntity,
  MovingPlatformEntity,
  TrajectoryPoint,
  ParticleEntity,
  FloatText,
} from '../types/gameTypes';
import ZombieAudio from '../services/zombieAudio';

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
    }
  }

  private handleArrowHit(arrowBody: Matter.Body, otherBody: Matter.Body) {
    const arrow = this.arrows.find(a => a.body === arrowBody);
    if (!arrow || !arrow.inFlight || arrow.stuck) return;

    const otherLabel = otherBody.label || '';

    // 1. Arrow hits Zombie
    if (otherLabel.startsWith('zombie:')) {
      const zombieId = otherLabel.replace('zombie:', '');
      const zombie = this.zombies.find(z => z.id === zombieId && z.health > 0);
      if (zombie) {
        const hitY = arrowBody.position.y;
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
          ZombieAudio.playZombieDefeat();

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

          // Spawn visceral cartoon blood, toxic slime, and flying skull/bones on headshot!
          this.spawnZombieDeathBlood(zombie.body.position.x, zombie.body.position.y, isHeadshot, knockDir);
          if (isHeadshot) {
            this.spawnHeadshotText(zombie.body.position.x, zombie.body.position.y);
          }

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

    // 6. Arrow hits Terrain / Platforms / Rocks -> Ricochet Reflection!
    if (otherLabel.startsWith('platform:') || otherBody.isStatic) {
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

        // Reflect velocity vector: v' = (v - 2*(v·n)*n) * 0.82
        const dot = curVx * nx + curVy * ny;
        let newVx = (curVx - 2 * dot * nx) * 0.82;
        let newVy = (curVy - 2 * dot * ny) * 0.82;

        // Ensure minimum speed so ricochet remains energetic and lethal
        const speed = Math.hypot(newVx, newVy);
        if (speed < 8) {
          const boost = 9 / Math.max(0.1, speed);
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

        ZombieAudio.playRicochet();
        this.spawnRicochetSparks(ax, ay, newAngle);
        return;
      }

      ZombieAudio.playArrowHitGround();
      this.lodgeArrow(arrow, otherBody);
      return;
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
          z.state = 'dead';
          ZombieAudio.playZombieDefeat();

          // Clean up stuck arrows
          this.arrows
            .filter(a => a.stuckToBodyId === z.body.id)
            .forEach(a => Matter.World.remove(this.world, a.body));
          this.arrows = this.arrows.filter(a => a.stuckToBodyId !== z.body.id);

          Matter.World.remove(this.world, z.body);
          this.spawnZombieDeathBlood(z.body.position.x, z.body.position.y, false);

          if (this.onZombieKilled) {
            this.onZombieKilled(z, false);
          }
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

  public shootArrow(startX: number, startY: number, angle: number, power: number): ArrowEntity {
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
      maxBounces: 2,
    };

    this.arrows.push(arrowEntity);
    ZombieAudio.playBowRelease();
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

        // Record trail points for smooth motion blur
        const arrowPos = arrow.body.position;
        if (!arrow.trail) arrow.trail = [];
        arrow.trail.unshift({ x: arrowPos.x, y: arrowPos.y });
        if (arrow.trail.length > 5) arrow.trail.pop();

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

    // Update Particles (Blood, Slime, Skull, Bones, Sparks)
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life++;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.shape === 'spark' ? 0.15 : 0.28; // parabolic gravity
      p.vx *= 0.95; // air drag
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

  private updateZombies() {
    const playerX = this.level.playerPos.x;
    const playerY = this.level.playerPos.y;

    this.zombies.forEach(z => {
      if (z.health <= 0) return;
      if (z.hitFlashTimer > 0) z.hitFlashTimer--;

      const zx = z.body.position.x;
      const zy = z.body.position.y;
      const dxToPlayer = playerX - zx;
      const distToPlayer = Math.abs(dxToPlayer);
      const dyToPlayer = Math.abs(playerY - zy);

      z.facingLeft = dxToPlayer < 0;

      if (z.type === 'flying') {
        z.flyPhase = (z.flyPhase ?? 0) + 0.05;
        const moveDir = dxToPlayer > 0 ? 1 : -1;
        const targetVx = moveDir * (z.speed * 1.3);
        const waveVy = Math.sin(z.flyPhase) * 1.8;
        Matter.Body.setVelocity(z.body, { x: targetVx, y: waveVy });
        Matter.Body.applyForce(z.body, z.body.position, { x: 0, y: -0.008 });
      } else {
        z.isGrounded = Math.abs(z.body.velocity.y) < 0.25;

        const attackRange = z.type === 'giant' || z.type === 'boss' ? 70 : 50;
        if (distToPlayer < attackRange && dyToPlayer < 65) {
          z.state = 'attack';
          z.attackTimer += 0.016;

          // Blood slash effect arriving at player!
          if (z.attackTimer > 0.15 && Math.random() < 0.28) {
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

        z.state = 'walk';
        z.walkCycle += 0.25;

        if (z.type === 'jumper') {
          z.jumpCooldown = (z.jumpCooldown ?? 0) - 1;
          if (z.jumpCooldown <= 0 && z.isGrounded && distToPlayer > 70) {
            z.jumpCooldown = 110;
            const jumpDir = dxToPlayer > 0 ? 1 : -1;
            Matter.Body.setVelocity(z.body, {
              x: jumpDir * (z.speed * 2.2),
              y: -8.5,
            });
            return;
          }
        }

        let currentSpeed = z.speed;
        if (z.type === 'sneaky') {
          currentSpeed = distToPlayer > 320 ? 0.4 : 2.6;
        }

        const moveDir = dxToPlayer > 0 ? 1 : -1;
        if (z.patrolMin !== undefined && zx < z.patrolMin && moveDir < 0) return;
        if (z.patrolMax !== undefined && zx > z.patrolMax && moveDir > 0) return;

        Matter.Body.setVelocity(z.body, {
          x: moveDir * currentSpeed,
          y: z.body.velocity.y,
        });
      }

      if (zy > this.level.worldHeight + 80 && z.health > 0) {
        z.health = 0;
        z.state = 'dead';
        ZombieAudio.playZombieDefeat();

        // Remove stuck arrows
        this.arrows
          .filter(a => a.stuckToBodyId === z.body.id)
          .forEach(a => Matter.World.remove(this.world, a.body));
        this.arrows = this.arrows.filter(a => a.stuckToBodyId !== z.body.id);
        Matter.World.remove(this.world, z.body);

        if (this.onZombieKilled) {
          this.onZombieKilled(z, false);
        }
      }
    });
  }

  // Spawn cartoon crimson blood, toxic green slime, decapitated flying skull & bones on death
  public spawnZombieDeathBlood(x: number, y: number, isHeadshot: boolean, knockDir: number = 1) {
    if (isHeadshot) {
      // 1. Flying Decapitated Zombie Skull Particle
      this.particles.push({
        id: this.nextParticleId++,
        x,
        y: y - 18,
        vx: knockDir * (Math.random() * 3 + 2.5),
        vy: -(Math.random() * 3 + 5.5),
        color: '#84CC16',
        size: 16,
        opacity: 1,
        life: 0,
        maxLife: 45,
        shape: 'skull',
      });

      // 2. Flying Bone Fragment Particles
      for (let b = 0; b < 4; b++) {
        this.particles.push({
          id: this.nextParticleId++,
          x: x + (Math.random() - 0.5) * 14,
          y: y - 10,
          vx: (Math.random() - 0.5) * 6,
          vy: -(Math.random() * 3 + 3.5),
          color: '#F1F5F9',
          size: 7,
          opacity: 1,
          life: 0,
          maxLife: 36,
          shape: 'bone',
        });
      }
    }

    const count = isHeadshot ? 24 : 14;
    const colors = ['#DC2626', '#EF4444', '#991B1B', '#84CC16', '#65A30D'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (isHeadshot ? 7.5 : 5.0) + 1.8;
      this.particles.push({
        id: this.nextParticleId++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isHeadshot ? 3.0 : 1.2),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 5 + 3,
        opacity: 1,
        life: 0,
        maxLife: Math.floor(Math.random() * 14) + 20,
        shape: Math.random() > 0.4 ? 'splat' : 'circle',
      });
    }

    if (this.particles.length > 35) {
      this.particles.splice(0, this.particles.length - 35);
    }
  }

  // Floating text badge for headshots
  public spawnHeadshotText(x: number, y: number) {
    this.floatTexts.push({
      id: this.nextFloatTextId++,
      text: '💥 HEADSHOT! +200',
      x,
      y: y - 26,
      vy: -2.2,
      color: '#EF4444',
      opacity: 1,
      scale: 1.4,
    });
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

  // Full widescreen landscape trajectory predictor with multi-bounce reflection preview!
  public calculateTrajectory(
    startX: number,
    startY: number,
    angle: number,
    power: number,
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
    const maxBounces = 2;

    for (let step = 0; step < maxSteps; step++) {
      vx += windAcc;
      vy += g;

      const nextX = curX + vx;
      const nextY = curY + vy;

      // Check collision against all level platforms
      let hitPlatform: PlatformConfig | null = null;
      let hitNx = 0;
      let hitNy = -1;

      for (const p of this.level.platforms) {
        const halfW = p.width / 2;
        const halfH = p.height / 2;
        const minX = p.x - halfW;
        const maxX = p.x + halfW;
        const minY = p.y - halfH;
        const maxY = p.y + halfH;

        if (this.segmentIntersectsAABB(curX, curY, nextX, nextY, minX, minY, maxX, maxY)) {
          hitPlatform = p;
          const relX = (nextX - p.x) / Math.max(1, halfW);
          const relY = (nextY - p.y) / Math.max(1, halfH);
          if (Math.abs(relX) > Math.abs(relY)) {
            hitNx = relX > 0 ? 1 : -1;
            hitNy = 0;
          } else {
            hitNx = 0;
            hitNy = relY > 0 ? 1 : -1;
          }
          break;
        }
      }

      if (hitPlatform) {
        // Mark collision bounce point
        points.push({ x: nextX, y: nextY, isBounce: true });
        bounces++;

        if (bounces <= maxBounces) {
          // Reflect trajectory
          const dot = vx * hitNx + vy * hitNy;
          vx = (vx - 2 * dot * hitNx) * 0.82;
          vy = (vy - 2 * dot * hitNy) * 0.82;
          const mag = Math.hypot(vx, vy);
          if (mag < 8) {
            const boost = 9 / Math.max(0.1, mag);
            vx *= boost;
            vy *= boost;
          }
          curX = nextX + hitNx * 4;
          curY = nextY + hitNy * 4;
          continue;
        } else {
          // Stop trajectory at final stick point
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

  // Exact 2D Line Segment to AABB intersection (Continuous Collision Detection)
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
    if (x1 >= minX && x1 <= maxX && y1 >= minY && y1 <= maxY) return true;
    if (x2 >= minX && x2 <= maxX && y2 >= minY && y2 <= maxY) return true;

    const segMinX = Math.min(x1, x2);
    const segMaxX = Math.max(x1, x2);
    const segMinY = Math.min(y1, y2);
    const segMaxY = Math.max(y1, y2);

    if (segMaxX < minX || segMinX > maxX || segMaxY < minY || segMinY > maxY) {
      return false;
    }

    const dx = x2 - x1;
    const dy = y2 - y1;

    let t0 = 0;
    let t1 = 1;

    const p = [-dx, dx, -dy, dy];
    const q = [x1 - minX, maxX - x1, y1 - minY, maxY - y1];

    for (let i = 0; i < 4; i++) {
      if (p[i] === 0) {
        if (q[i] < 0) return false;
      } else {
        const t = q[i] / p[i];
        if (p[i] < 0) {
          if (t > t1) return false;
          if (t > t0) t0 = t;
        } else {
          if (t < t0) return false;
          if (t < t1) t1 = t;
        }
      }
    }

    return t0 <= t1;
  }

  public destroy() {
    Matter.Events.off(this.engine, 'collisionStart', () => {});
    Matter.World.clear(this.world, false);
    Matter.Engine.clear(this.engine);
  }
}
