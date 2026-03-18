// Screens/Games/BallBlast.js

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import {
  View, Text, StyleSheet, Pressable,
  Animated, StatusBar, SafeAreaView,
  Platform, Vibration, Dimensions,
  PanResponder, ScrollView,
} from "react-native";
import { scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft, RefreshCw, PlayCircle,
  Trophy, ChevronLeft, Star,
  Flame, Award, Zap, Target,
} from "lucide-react-native";
import GameBannerAd from "../../Components/GameBannerAd";
import { useInterstitialAd } from "../../Components/Useinterstitialad";

// ─── Board config ─────────────────────────────────────────────────────────────
const { width: SW, height: SH } = Dimensions.get("window");
const GAME_W     = SW - scale(24);
// Increased banner slot from 62 → 90 so the ad never gets clipped
const GAME_H     = Math.max(scale(280), SH - scale(68 + 52 + 90 + 44));
const COLS       = 5;
const BLOCK_GAP  = scale(5);
const BLOCK_W    = (GAME_W - BLOCK_GAP * (COLS + 1)) / COLS;
const BLOCK_H    = scale(44);
const CANNON_Y   = GAME_H - scale(28);
const NOZZLE_H   = scale(22);
const BALL_R     = scale(6);
const BALL_SPEED = scale(16);
const CANNON_W   = scale(48);
const FIRE_EVERY = 4;
const FALL_BASE  = 0.48;
const SPAWN_FRAMES   = 88;
const DANGER_Y       = CANNON_Y - scale(8);
const POWERUP_SPEED  = 1.3;
const POWERUP_DUR    = 240; // frames (~4 s at 60 fps)

// Bomb blast radius — blocks within this many px of explosion center get hit
const BOMB_RADIUS = BLOCK_W * 2.4;

// Caps — keep total element count low for smooth renders
const MAX_BALLS     = 14;
const MAX_PARTICLES = 24;   // bumped up to allow chain-blast particles
const MAX_POPS      = 6;
const MAX_BLOCKS    = 28;

// ─── Block types ─────────────────────────────────────────────────────────────
const BT = { NORMAL: 0, BOMB: 1, HARD: 2 };

// ─── Power-up types ──────────────────────────────────────────────────────────
const PU = { SPEED: "speed", MULTI: "multi" };

// ─── Colour ramp ─────────────────────────────────────────────────────────────
const RAMP = [
  "#5b21b6","#7c3aed","#9333ea","#a855f7",
  "#ec4899","#f43f5e","#ef4444","#f97316",
  "#f59e0b","#fbbf24",
];
const blockColor = (hp, maxHp) => {
  const idx = Math.round((hp / maxHp) * (RAMP.length - 1));
  return RAMP[Math.min(idx, RAMP.length - 1)];
};

// ─── Haptics ─────────────────────────────────────────────────────────────────
const haptic = (key) => {
  const map = {
    hit:     [0, 10],
    explode: [0, 30, 15, 30],
    bomb:    [0, 50, 25, 50, 25, 80],
    chain:   [0, 60, 20, 60, 20, 60, 20, 100],
    powerup: [0, 35, 20, 35],
    die:     [0, 80, 50, 80],
  };
  const p = map[key];
  if (p) Vibration.vibrate(p);
};

// ─── Rating ──────────────────────────────────────────────────────────────────
const getRating = (s) => {
  if (s >= 40) return { label: "Blaster Pro!",   color: "#ffd700", emoji: "👑", Icon: Trophy };
  if (s >= 25) return { label: "Sharpshooter!",  color: "#00ffff", emoji: "🌟", Icon: Star   };
  if (s >= 15) return { label: "On Fire!",        color: "#f97316", emoji: "🔥", Icon: Flame  };
  if (s >= 8)  return { label: "Good Aim!",       color: "#fb923c", emoji: "⚡", Icon: Zap    };
  return              { label: "Keep Blasting!",  color: "#f43f5e", emoji: "💪", Icon: Award  };
};

let _id = 0;
const uid = () => ++_id;
const hpForLevel = (l) => Math.max(1, 1 + Math.floor(l * 1.4));

const spawnRow = (level) => {
  const count = 3 + Math.floor(Math.random() * 3);
  const cols = Array.from({ length: COLS }, (_, i) => i)
    .sort(() => Math.random() - 0.5).slice(0, count);
  return cols.map(col => {
    const roll = Math.random();
    const type = (level >= 2 && roll < 0.12) ? BT.BOMB
               : (level >= 4 && roll < 0.27) ? BT.HARD
               : BT.NORMAL;
    const hpBase = hpForLevel(level) + Math.floor(Math.random() * Math.ceil(level / 2));
    const hp = type === BT.HARD ? Math.round(hpBase * 1.7) : hpBase;
    return { id: uid(), col, y: -BLOCK_H, hp, maxHp: hp, type };
  });
};

const initState = () => ({
  cannonX: GAME_W / 2,
  balls: [], blocks: [], particles: [], scorePops: [], powerupItems: [],
  score: 0, level: 1, blocksDestroyed: 0,
  rowTimer: 0, fireTimer: 0, dead: false,
  activePU: null, puTimer: 0,
  multiBurst: 0,
  // Stores pending blast rings for visual effect: [{cx, cy, frame}]
  blastRings: [],
});

// ─── Static background — memoised, never re-renders ──────────────────────────
const BoardBg = memo(() => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {Array.from({ length: 10 }, (_, r) =>
      Array.from({ length: 7 }, (_, c) => (
        <View key={`${r}-${c}`} style={[styles.bgDot, {
          left: (c + 0.5) * (GAME_W / 7),
          top:  (r + 0.5) * (GAME_H / 10),
        }]} />
      ))
    )}
  </View>
));

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BallBlast() {
  const navigation = useNavigation();
  const { showAd } = useInterstitialAd();
 
  const [phase,      setPhase]      = useState("idle");
  const [renderSeed, setRenderSeed] = useState(0);
  const [highScore,  setHighScore]  = useState(0);
  const [deathScore, setDeathScore] = useState(0);

  const gameRef    = useRef(initState());
  const rafRef     = useRef(null);
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const boardAnim   = useRef(new Animated.Value(0)).current;
  const shakeAnim   = useRef(new Animated.Value(0)).current;
  const dangerAnim  = useRef(new Animated.Value(0)).current;
  const puFlashAnim = useRef(new Animated.Value(0)).current;
  const headerAnim  = useRef(new Animated.Value(0)).current;

  // Cannon uses Animated.Value so drag updates bypass React reconciliation
  const cannonXAnim = useRef(new Animated.Value(GAME_W / 2 - CANNON_W / 2)).current;

  const dangerLoopRef = useRef(null);
  const isDangerRef   = useRef(false);

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    return () => {
      cancelAnimationFrame(rafRef.current);
      dangerLoopRef.current?.stop();
    };
  }, []);

  const startDanger = useCallback(() => {
    if (isDangerRef.current) return;
    isDangerRef.current = true;
    dangerLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(dangerAnim, { toValue: 1, duration: 280, useNativeDriver: false }),
        Animated.timing(dangerAnim, { toValue: 0, duration: 280, useNativeDriver: false }),
      ])
    );
    dangerLoopRef.current.start();
  }, []);

  const stopDanger = useCallback(() => {
    if (!isDangerRef.current) return;
    isDangerRef.current = false;
    dangerLoopRef.current?.stop();
    dangerAnim.setValue(0);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // BOMB CHAIN RESOLVER
  // Takes a list of exploded bomb centres and recursively blasts every block
  // whose centre is within BOMB_RADIUS. Newly killed bombs are added to the
  // next wave so chains propagate automatically.
  // Returns { removeBlocks: Set<id>, extraScore: number, particles: [], pops: [] }
  // ─────────────────────────────────────────────────────────────────────────
  const resolveBombChain = (initialBombs, blocks, existingRemove) => {
    const removeBlocks = new Set(existingRemove);
    let   extraScore   = 0;
    const newParticles = [];
    const newPops      = [];
    const pendingBombs = [...initialBombs]; // {cx, cy}

    while (pendingBombs.length > 0) {
      const bomb = pendingBombs.shift();

      for (const blk of blocks) {
        if (removeBlocks.has(blk.id)) continue;
        const bcx = blk.col * (BLOCK_W + BLOCK_GAP) + BLOCK_GAP + BLOCK_W / 2;
        const bcy = blk.y + BLOCK_H / 2;
        const dist = Math.hypot(bcx - bomb.cx, bcy - bomb.cy);

        if (dist <= BOMB_RADIUS) {
          // Damage proportional to distance — full damage at centre, 50% at edge
          const dmg = Math.max(1, Math.ceil(blk.maxHp * (0.5 + 0.5 * (1 - dist / BOMB_RADIUS))));
          blk.hp -= dmg;

          if (blk.hp <= 0) {
            removeBlocks.add(blk.id);
            extraScore++;

            // If this block was also a bomb → chain continues
            if (blk.type === BT.BOMB) {
              pendingBombs.push({ cx: bcx, cy: bcy });
              // Big orange shockwave particles for chain bomb
              for (let p = 0; p < Math.min(12, MAX_PARTICLES); p++) {
                const a  = (p / 12) * Math.PI * 2;
                const sp = 3 + Math.random() * 5;
                newParticles.push({ id: uid(), x: bcx, y: bcy, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp - 2, life: 1, r: scale(4 + Math.random() * 4), color: "#ff6600" });
              }
            } else {
              const col = blk.type === BT.HARD ? "#aaaaaa" : blockColor(1, blk.maxHp);
              for (let p = 0; p < Math.min(7, MAX_PARTICLES); p++) {
                const a  = (p / 7) * Math.PI * 2;
                const sp = 1.5 + Math.random() * 3.5;
                newParticles.push({ id: uid(), x: bcx, y: bcy, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp - 1.2, life: 1, r: scale(3 + Math.random() * 3), color: col });
              }
            }

            if (newPops.length < MAX_POPS)
              newPops.push({ id: uid(), x: bcx, y: bcy, life: 1, bonus: true });
          }
        }
      }
    }

    return { removeBlocks, extraScore, newParticles, newPops };
  };

  // ── Game loop ─────────────────────────────────────────────────────────────
  const loop = useCallback(() => {
    const g = gameRef.current;
    if (g.dead) { rafRef.current = requestAnimationFrame(loop); return; }

    // Auto-fire
    g.fireTimer++;
    const fInterval = g.activePU === PU.SPEED ? Math.floor(FIRE_EVERY / 2) : FIRE_EVERY;
    if (g.fireTimer >= fInterval && g.balls.length < MAX_BALLS) {
      g.fireTimer = 0;
      if (g.multiBurst > 0) {
        g.balls.push({ id: uid(), x: g.cannonX,             y: CANNON_Y - NOZZLE_H - BALL_R, vx: 0,                   vy: -BALL_SPEED });
        g.balls.push({ id: uid(), x: g.cannonX - scale(28), y: CANNON_Y - NOZZLE_H - BALL_R, vx: -BALL_SPEED * 0.24,  vy: -BALL_SPEED * 0.97 });
        g.balls.push({ id: uid(), x: g.cannonX + scale(28), y: CANNON_Y - NOZZLE_H - BALL_R, vx:  BALL_SPEED * 0.24,  vy: -BALL_SPEED * 0.97 });
        g.multiBurst--;
      } else {
        g.balls.push({ id: uid(), x: g.cannonX, y: CANNON_Y - NOZZLE_H - BALL_R, vx: 0, vy: -BALL_SPEED });
      }
    }

    // Move balls — wall bounce for diagonal balls
    const nextBalls = [];
    for (let i = 0; i < g.balls.length; i++) {
      const b = g.balls[i];
      let nvx = b.vx;
      let nx  = b.x + nvx;
      if (nx < BALL_R)          { nx = BALL_R;           nvx =  Math.abs(nvx); }
      if (nx > GAME_W - BALL_R) { nx = GAME_W - BALL_R;  nvx = -Math.abs(nvx); }
      const ny = b.y + b.vy;
      if (ny > -BALL_R * 3) nextBalls.push({ ...b, x: nx, y: ny, vx: nvx });
    }
    g.balls = nextBalls;

    // Fall blocks
    const fallSpeed = FALL_BASE + g.level * 0.06;
    for (let i = 0; i < g.blocks.length; i++) g.blocks[i].y += fallSpeed;

    // Spawn row
    g.rowTimer++;
    if (g.rowTimer >= SPAWN_FRAMES && g.blocks.length < MAX_BLOCKS) {
      g.rowTimer = 0;
      g.blocks   = [...g.blocks, ...spawnRow(g.level)];
    }

    // Collision
    const removeBalls  = new Set();
    const removeBlocks = new Set();
    const initialBombs = []; // bombs directly hit by a ball this frame

    for (let bi = 0; bi < g.balls.length; bi++) {
      const ball = g.balls[bi];
      for (let ki = 0; ki < g.blocks.length; ki++) {
        const blk = g.blocks[ki];
        if (removeBlocks.has(blk.id)) continue;
        const bx    = blk.col * (BLOCK_W + BLOCK_GAP) + BLOCK_GAP;
        const nearX = Math.max(bx,    Math.min(ball.x, bx + BLOCK_W));
        const nearY = Math.max(blk.y, Math.min(ball.y, blk.y + BLOCK_H));
        if (Math.hypot(ball.x - nearX, ball.y - nearY) < BALL_R) {
          removeBalls.add(ball.id);
          blk.hp--;
          haptic("hit");

          if (blk.hp <= 0) {
            removeBlocks.add(blk.id);
            const cx  = bx + BLOCK_W / 2;
            const cy  = blk.y + BLOCK_H / 2;
            const col = blk.type === BT.HARD ? "#aaaaaa" : blockColor(1, blk.maxHp);

            if (blk.type === BT.BOMB) {
              // ── Direct bomb hit: queue for chain resolution ──────────────
              haptic("bomb");
              initialBombs.push({ cx, cy });

              // Blast ring visual
              g.blastRings.push({ id: uid(), cx, cy, frame: 0 });

              // Primary orange shockwave particles
              for (let p = 0; p < Math.min(14, MAX_PARTICLES - g.particles.length); p++) {
                const a  = (p / 14) * Math.PI * 2;
                const sp = 3 + Math.random() * 5;
                g.particles.push({ id: uid(), x: cx, y: cy, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp - 2, life: 1, r: scale(4 + Math.random() * 5), color: "#f97316" });
              }
              // Yellow core flash
              for (let p = 0; p < Math.min(6, MAX_PARTICLES - g.particles.length); p++) {
                const a  = (p / 6) * Math.PI * 2;
                g.particles.push({ id: uid(), x: cx, y: cy, vx: Math.cos(a)*1.5, vy: Math.sin(a)*1.5, life: 1, r: scale(6 + Math.random() * 4), color: "#fbbf24" });
              }
            } else {
              haptic("explode");
              for (let p = 0; p < Math.min(6, MAX_PARTICLES - g.particles.length); p++) {
                const a  = (p / 6) * Math.PI * 2;
                const sp = 1.5 + Math.random() * 3;
                g.particles.push({ id: uid(), x: cx, y: cy, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp - 1, life: 1, r: scale(2 + Math.random() * 2.5), color: col });
              }
            }

            if (g.scorePops.length < MAX_POPS)
              g.scorePops.push({ id: uid(), x: cx, y: cy, life: 1, bonus: false });

            g.score++;
            g.blocksDestroyed++;
            if (g.blocksDestroyed % 5 === 0) g.level++;

            // Power-up drop: 18% chance at level 2+
            if (g.level >= 2 && Math.random() < 0.18) {
              g.powerupItems.push({ id: uid(), x: cx, y: cy, type: Math.random() < 0.5 ? PU.SPEED : PU.MULTI });
            }

            // Auto multi-burst every 10 blocks
            if (g.blocksDestroyed % 10 === 0) g.multiBurst += FIRE_EVERY * 5;
          }
          break;
        }
      }
    }

    // ── Chain-bomb blast resolution ──────────────────────────────────────────
    if (initialBombs.length > 0) {
      const { removeBlocks: chainRemove, extraScore, newParticles, newPops } =
        resolveBombChain(initialBombs, g.blocks, removeBlocks);

      // Merge sets
      chainRemove.forEach(id => removeBlocks.add(id));

      // Add chain particles (capped)
      for (const p of newParticles) {
        if (g.particles.length < MAX_PARTICLES) g.particles.push(p);
      }
      for (const p of newPops) {
        if (g.scorePops.length < MAX_POPS) g.scorePops.push(p);
      }

      if (extraScore > 0) {
        g.score         += extraScore;
        g.blocksDestroyed += extraScore;
        haptic("chain");
        // Re-check level ups from chain
        if (Math.floor((g.blocksDestroyed - extraScore) / 5) < Math.floor(g.blocksDestroyed / 5))
          g.level++;
      }
    }

    g.balls  = g.balls.filter(b  => !removeBalls.has(b.id));
    g.blocks = g.blocks.filter(b => !removeBlocks.has(b.id));

    // Blast rings — expand & fade
    const nextRings = [];
    for (const ring of g.blastRings) {
      const nf = ring.frame + 1;
      if (nf < 18) nextRings.push({ ...ring, frame: nf });
    }
    g.blastRings = nextRings;

    // Particles
    const nextParts = [];
    for (let i = 0; i < g.particles.length; i++) {
      const p  = g.particles[i];
      const nl = p.life - 0.055;
      if (nl > 0) nextParts.push({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.14, life: nl });
    }
    g.particles = nextParts;

    // Score pops
    const nextPops = [];
    for (let i = 0; i < g.scorePops.length; i++) {
      const p  = g.scorePops[i];
      const nl = p.life - 0.05;
      if (nl > 0) nextPops.push({ ...p, y: p.y - 1.3, life: nl });
    }
    g.scorePops = nextPops;

    // Power-up items fall + collect
    const nextPU = [];
    for (const pu of g.powerupItems) {
      const ny = pu.y + POWERUP_SPEED;
      const collected =
        ny >= CANNON_Y - scale(32) &&
        ny <= CANNON_Y + scale(12) &&
        Math.abs(pu.x - g.cannonX) < scale(38);

      if (collected) {
        haptic("powerup");
        g.activePU = pu.type;
        g.puTimer  = POWERUP_DUR;
        if (pu.type === PU.MULTI) g.multiBurst += FIRE_EVERY * 8;
        puFlashAnim.setValue(1);
        Animated.timing(puFlashAnim, { toValue: 0, duration: 800, useNativeDriver: false }).start();
      } else if (ny < GAME_H + scale(20)) {
        nextPU.push({ ...pu, y: ny });
      }
    }
    g.powerupItems = nextPU;

    // Active power-up countdown
    if (g.activePU) {
      g.puTimer--;
      if (g.puTimer <= 0) g.activePU = null;
    }

    // Danger pulse
    const closest = g.blocks.length ? Math.min(...g.blocks.map(b => b.y + BLOCK_H)) : GAME_H;
    if (closest > DANGER_Y - scale(70)) startDanger();
    else stopDanger();

    // Lose
    if (g.blocks.some(b => b.y + BLOCK_H >= DANGER_Y)) {
      killGame(g.score); return;
    }

    setRenderSeed(s => s + 1);
    rafRef.current = requestAnimationFrame(loop);
  }, [startDanger, stopDanger]);

  const killGame = useCallback((finalScore) => {
    gameRef.current.dead = true;
    cancelAnimationFrame(rafRef.current);
    stopDanger();
    haptic("die");
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue:  10, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:   6, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:  -4, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:   0, duration: 45, useNativeDriver: true }),
    ]).start();
    setDeathScore(finalScore);
    setHighScore(h => Math.max(h, finalScore));
    setPhase("dead");
    setTimeout(() => {
      Animated.spring(overlayAnim, { toValue: 1, tension: 50, friction: 9, useNativeDriver: true }).start();
    }, 400);
  }, [stopDanger]);

  const startGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    overlayAnim.setValue(0);
    boardAnim.setValue(0);
    stopDanger();
    _id = 0;
    cannonXAnim.setValue(GAME_W / 2 - CANNON_W / 2);
    const state = initState();
    state.blocks = spawnRow(1);
    gameRef.current = state;
    setPhase("playing");
    setRenderSeed(0);
    Animated.spring(boardAnim, { toValue: 1, tension: 55, friction: 8, useNativeDriver: true }).start();
    rafRef.current = requestAnimationFrame(loop);
  }, [loop, stopDanger]);

  // ── PanResponder — no setState, native speed ──────────────────────────────
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,
      onPanResponderMove: (_, g) => {
        if (!g) return;
        const game = gameRef.current;
        if (game.dead) return;
        const nx = Math.max(CANNON_W / 2, Math.min(GAME_W - CANNON_W / 2, g.moveX ?? GAME_W / 2));
        game.cannonX = nx;
        cannonXAnim.setValue(nx - CANNON_W / 2);
      },
    })
  ).current;

  // ── Board render ──────────────────────────────────────────────────────────
  const renderGame = () => {
    const g = gameRef.current;

    const dangerColor = dangerAnim.interpolate({
      inputRange: [0, 1], outputRange: ["#ff408122", "#ff4081cc"],
    });
    const puFlashColor = puFlashAnim.interpolate({
      inputRange: [0, 1], outputRange: ["transparent", g.activePU === PU.SPEED ? "#00ffff18" : "#ffd70018"],
    });
    const cannonAccent = g.activePU === PU.SPEED ? "#00ffff" : g.activePU === PU.MULTI ? "#ffd700" : "#f97316";

    return (
      <Animated.View style={[styles.boardWrap, {
        opacity: boardAnim,
        transform: [
          { scale: boardAnim.interpolate({ inputRange:[0,1], outputRange:[0.95,1] }) },
          { translateX: shakeAnim },
        ],
      }]}>
        {/* Power-up collect flash */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.puFlash, { backgroundColor: puFlashColor }]} pointerEvents="none" />

        <View style={styles.board} {...pan.panHandlers}>
          <BoardBg />

          {/* Power-up timer bar */}
          {g.activePU && (
            <View style={styles.puBar}>
              <View style={[styles.puBarFill, {
                width: `${(g.puTimer / POWERUP_DUR) * 100}%`,
                backgroundColor: g.activePU === PU.SPEED ? "#00ffff" : "#ffd700",
              }]} />
              <Text style={[styles.puBarLabel, { color: g.activePU === PU.SPEED ? "#00ffff" : "#ffd700" }]}>
                {g.activePU === PU.SPEED ? "⚡ SPEED MODE" : "🔵 MULTI-BALL"}
              </Text>
            </View>
          )}

          {/* Blast rings — expanding shockwave circles */}
          {g.blastRings.map(ring => {
            const progress = ring.frame / 18;
            const radius   = BOMB_RADIUS * progress;
            const opacity  = 1 - progress;
            return (
              <View
                key={ring.id}
                pointerEvents="none"
                style={{
                  position: "absolute",
                  left:    ring.cx - radius,
                  top:     ring.cy - radius,
                  width:   radius * 2,
                  height:  radius * 2,
                  borderRadius: radius,
                  borderWidth: 2.5,
                  borderColor: `rgba(249,115,22,${opacity * 0.9})`,
                  backgroundColor: `rgba(251,191,36,${opacity * 0.07})`,
                }}
              />
            );
          })}

          {/* Blocks */}
          {g.blocks.map(b => {
            const x      = b.col * (BLOCK_W + BLOCK_GAP) + BLOCK_GAP;
            const isBomb = b.type === BT.BOMB;
            const isHard = b.type === BT.HARD;
            const col    = isHard ? "#aaaaaa" : blockColor(b.hp, b.maxHp);
            return (
              <View key={b.id} style={[styles.block, {
                left: x, top: b.y, width: BLOCK_W, height: BLOCK_H,
                backgroundColor: isBomb ? "#f9731628" : col + "28",
                borderColor: isBomb ? "#f97316" : col,
                borderWidth: isBomb ? 2.5 : 1.5,
                shadowColor: isBomb ? "#f97316" : col,
              }]}>
                <View style={[styles.blockShine, { backgroundColor: col + "40" }]} />
                <View style={styles.hpTrack}>
                  <View style={[styles.hpFill, { width: `${(b.hp / b.maxHp) * 100}%`, backgroundColor: col }]} />
                </View>
                {isBomb ? (
                  <Text style={styles.bombEmoji}>💣</Text>
                ) : (
                  <Text style={[styles.blockNum, { color: col }]} numberOfLines={1}>{b.hp}</Text>
                )}
                {isHard && <View style={styles.hardOverlay} />}
              </View>
            );
          })}

          {/* Balls */}
          {g.balls.map(b => (
            <View key={b.id} style={[styles.ball, {
              left: b.x - BALL_R, top: b.y - BALL_R,
              shadowColor: "#00ffff",
            }]} />
          ))}

          {/* Power-up items */}
          {g.powerupItems.map(pu => (
            <View key={pu.id} style={[styles.puItem, {
              left: pu.x - scale(15), top: pu.y - scale(15),
              borderColor: pu.type === PU.SPEED ? "#00ffff" : "#ffd700",
              backgroundColor: pu.type === PU.SPEED ? "#00ffff22" : "#ffd70022",
            }]}>
              <Text style={styles.puItemEmoji}>{pu.type === PU.SPEED ? "⚡" : "🔵"}</Text>
            </View>
          ))}

          {/* Particles */}
          {g.particles.map(p => (
            <View key={p.id} style={[styles.particle, {
              left: p.x - p.r, top: p.y - p.r,
              width: p.r * 2, height: p.r * 2, borderRadius: p.r,
              backgroundColor: p.color, opacity: p.life,
            }]} />
          ))}

          {/* Score pops */}
          {g.scorePops.map(p => (
            <Text key={p.id} style={[styles.scorePop, {
              left: p.x - scale(12), top: p.y - scale(10),
              opacity: p.life, color: p.bonus ? "#f97316" : "#fbbf24",
            }]}>
              {p.bonus ? "💥" : "+1"}
            </Text>
          ))}

          {/* Danger line */}
          <Animated.View style={[styles.dangerLine, { backgroundColor: dangerColor }]} />

          {/* ── CANNON — improved shooter UI ── */}
          <Animated.View style={[styles.cannonWrap, { transform: [{ translateX: cannonXAnim }] }]}>
            {/* Outer pulse glow */}
            <View style={[styles.cannonGlow, { backgroundColor: cannonAccent + "18" }]} />
            {/* Inner tight glow ring */}
            <View style={[styles.cannonInnerGlow, {
              borderColor: cannonAccent + "55",
              shadowColor: cannonAccent,
            }]} />
            {/* Barrel assembly — cap + shaft */}
            <View style={styles.cannonBarrelWrap}>
              <View style={[styles.cannonBarrelCap, { backgroundColor: cannonAccent, shadowColor: cannonAccent }]} />
              <View style={[styles.cannonBarrel, { backgroundColor: cannonAccent + "cc", shadowColor: cannonAccent }]} />
            </View>
            {/* Base turret */}
            <View style={[styles.cannonTurret, { backgroundColor: cannonAccent, shadowColor: cannonAccent }]}>
              <View style={styles.cannonTurretShine} />
              {/* Side fins */}
              <View style={[styles.cannonFin, styles.cannonFinLeft,  { backgroundColor: cannonAccent + "bb" }]} />
              <View style={[styles.cannonFin, styles.cannonFinRight, { backgroundColor: cannonAccent + "bb" }]} />
              {/* Centre crosshair dot */}
              <View style={[styles.cannonDot, { borderColor: cannonAccent + "88" }]} />
            </View>
          </Animated.View>

          {g.score === 0 && (
            <View style={styles.dragHintWrap}>
              <Text style={styles.dragHintText}>← drag to aim →</Text>
            </View>
          )}

          <Text style={styles.liveScore}>{g.score}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>LV {g.level}</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const rating = getRating(deathScore);
  const g = gameRef.current;

  // ── IDLE ──────────────────────────────────────────────────────────────────
  if (phase === "idle") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
        <Animated.View style={{
          opacity: headerAnim,
          transform: [{ translateY: headerAnim.interpolate({ inputRange:[0,1], outputRange:[-16,0] }) }],
          width: "100%",
        }}>
          <Header onBack={() => navigation.goBack()} />
        </Animated.View>

        <ScrollView style={styles.flex} contentContainerStyle={styles.idleContent} showsVerticalScrollIndicator={false}>
          <View style={styles.heroRing}>
            <Target size={scale(50)} color="#f97316" strokeWidth={1.4} />
          </View>
          <View style={styles.idleTitleBlock}>
            <Text style={styles.idleSubLabel}>AUTO-FIRE ARCADE</Text>
            <Text style={styles.idleTitle}>Ball Blast</Text>
            <Text style={styles.idleTagline}>Drag to aim. Blast before they land.</Text>
          </View>

          {/* Demo */}
          <View style={styles.demoCard}>
            <Text style={styles.demoCardLabel}>BLOCK TYPES</Text>
            <View style={styles.demoInner}>
              {[
                { hp: 12, maxHp: 12, type: BT.NORMAL },
                { hp: 7,  maxHp: 12, type: BT.BOMB   },
                { hp: 3,  maxHp: 12, type: BT.NORMAL },
                { hp: 9,  maxHp: 12, type: BT.HARD   },
                { hp: 5,  maxHp: 12, type: BT.NORMAL },
              ].map((b, i) => {
                const isBomb = b.type === BT.BOMB;
                const isHard = b.type === BT.HARD;
                const col    = isHard ? "#aaaaaa" : blockColor(b.hp, b.maxHp);
                return (
                  <View key={i} style={[styles.demoBlock, {
                    backgroundColor: col + "28", borderColor: isBomb ? "#f97316" : col,
                    borderWidth: isBomb ? 2.5 : 1.5,
                  }]}>
                    {isBomb ? <Text style={{ fontSize: scale(14) }}>💣</Text>
                    : <Text style={[styles.demoBlockNum, { color: col }]}>{b.hp}</Text>}
                    {isHard && <View style={styles.hardOverlay} />}
                  </View>
                );
              })}
            </View>
            <View style={styles.demoLegend}>
              <Text style={styles.demoLegendItem}>🔴 Normal  </Text>
              <Text style={styles.demoLegendItem}>💣 Bomb — chain blasts nearby  </Text>
              <Text style={styles.demoLegendItem}>🛡️ Hard — high HP</Text>
            </View>
          </View>

          {/* Feature grid */}
          {/* <View style={styles.featGrid}>
            <FeatCard color="#f97316" emoji="⚡" title="Speed Power-up" desc="Catch ⚡ drops — cannon fires 2× faster for 4s" />
            <FeatCard color="#ffd700" emoji="🔵" title="Multi-Ball"    desc="Catch 🔵 drops — 3 balls at once!" />
            <FeatCard color="#ff4081" emoji="💣" title="Bomb Chain"    desc="Bomb blast destroys ALL nearby blocks. Chains propagate!" />
            <FeatCard color="#aaaaaa" emoji="🛡️" title="Hard Blocks"  desc="Silver blocks — high HP. Prioritize them early." />
          </View> */}

          <Pressable style={({ pressed }) => [styles.startBtn, pressed && { opacity: 0.88 }]} onPress={startGame}>
            <PlayCircle size={scale(18)} color="#fff" strokeWidth={2.5} />
            <Text style={styles.startBtnText}>  Start Blasting</Text>
          </Pressable>
        </ScrollView>
        <GameBannerAd bottom size="banner" />
      </SafeAreaView>
    );
  }

  // ── PLAYING / DEAD ────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
      <Header onBack={() => navigation.goBack()} onReset={startGame} showReset />

      <View style={styles.statsRow}>
        <StatPill label="SCORE" value={g.score}         color="#f97316" />
        <StatPill label="BEST"  value={highScore}        color="#fbbf24" />
        <StatPill label="LEVEL" value={`LV ${g.level}`} color="#a78bfa" />
        {g.activePU ? (
          <View style={[styles.activePuPill, {
            borderColor: g.activePU === PU.SPEED ? "#00ffff66" : "#ffd70066",
            backgroundColor: g.activePU === PU.SPEED ? "#00ffff15" : "#ffd70015",
          }]}>
            <Text style={[styles.activePuText, { color: g.activePU === PU.SPEED ? "#00ffff" : "#ffd700" }]}>
              {g.activePU === PU.SPEED ? "⚡ SPEED" : "🔵 MULTI"}
            </Text>
          </View>
        ) : (
          <StatPill label="BALLS" value={g.balls.length} color="#00ffff" />
        )}
      </View>

      {renderGame()}

      <GameBannerAd bottom size="banner" />

      {phase === "dead" && (
        <Animated.View style={[styles.overlay, {
          opacity: overlayAnim,
          transform: [{ scale: overlayAnim.interpolate({ inputRange:[0,1], outputRange:[0.88,1] }) }],
        }]}>
          <View style={[styles.winCard, { borderColor: rating.color + "44" }]}>
            <View style={[styles.trophyRing, { borderColor: rating.color + "66" }]}>
              <rating.Icon size={scale(38)} color={rating.color} fill={rating.color + "30"} strokeWidth={1.5} />
            </View>
            <Text style={styles.winTitle}>CRUSHED!</Text>
            <Text style={styles.winEmoji}>{rating.emoji}</Text>
            <View style={[styles.perfBadge, { borderColor: rating.color + "55", backgroundColor: rating.color + "12" }]}>
              <Text style={[styles.winPerf, { color: rating.color }]}>{rating.label}</Text>
            </View>
            <View style={styles.winStatsRow}>
              <WinStat label="BLOCKS" value={deathScore}       color="#f97316" />
              <View style={styles.winStatDivider} />
              <WinStat label="BEST"   value={highScore}         color="#fbbf24" />
              <View style={styles.winStatDivider} />
              <WinStat label="LEVEL"  value={`LV ${g.level}`}  color="#a78bfa" />
            </View>
            {deathScore > 0 && deathScore >= highScore && (
              <View style={styles.newBestBadge}>
                <Star size={scale(12)} color="#fbbf24" fill="#fbbf24" />
                <Text style={styles.newBestText}>  New High Score!</Text>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [styles.playAgainBtn, pressed && { opacity: 0.88 }]}
              onPress={() => showAd(startGame)}
            >
              <PlayCircle size={scale(16)} color="#fff" strokeWidth={2.5} />
              <Text style={styles.playAgainText}>  Blast Again</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.exitBtn, pressed && { opacity: 0.6 }]}
              onPress={() => showAd(() => navigation.goBack())}
            >
              <ChevronLeft size={scale(13)} color="#9e86b8" />
              <Text style={styles.exitText}>Back to Games</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Header({ onBack, onReset, showReset }) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.iconBtn} onPress={onBack}>
        <ArrowLeft size={scale(18)} color="#fff" strokeWidth={2.5} />
      </Pressable>
      <View style={styles.headerCenter}>
        <Target size={scale(14)} color="#f97316" strokeWidth={2} style={{ marginRight: scale(6) }} />
        <Text style={styles.headerTitle}>Ball Blast</Text>
      </View>
      {showReset
        ? <Pressable style={styles.iconBtn} onPress={onReset}>
            <RefreshCw size={scale(16)} color="#fff" strokeWidth={2.5} />
          </Pressable>
        : <View style={{ width: scale(38) }} />
      }
    </View>
  );
}

function StatPill({ label, value, color }) {
  return (
    <View style={[styles.statPill, { borderColor: color + "44" }]}>
      <Text style={[styles.statVal, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function FeatCard({ color, emoji, title, desc }) {
  return (
    <View style={[styles.featCard, { borderColor: color + "30" }]}>
      <Text style={styles.featEmoji}>{emoji}</Text>
      <Text style={[styles.featTitle, { color }]}>{title}</Text>
      <Text style={styles.featDesc}>{desc}</Text>
    </View>
  );
}

function WinStat({ label, value, color }) {
  return (
    <View style={styles.winStat}>
      <Text style={[styles.winStatValue, { color }]}>{value}</Text>
      <Text style={styles.winStatLabel}>{label}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex:      { flex: 1 },
  container: { flex: 1, backgroundColor: "#0d0118", alignItems: "center" },

  header: {
    width: "100%", flexDirection: "row", alignItems: "center",
    paddingHorizontal: scale(16), paddingTop: scale(12), paddingBottom: scale(8),
  },
  iconBtn: {
    width: scale(38), height: scale(38), borderRadius: scale(12),
    backgroundColor: "#1f0a3a", borderWidth: 1, borderColor: "#ffffff18",
    justifyContent: "center", alignItems: "center", elevation: 4,
  },
  headerCenter: { flex:1, flexDirection:"row", alignItems:"center", justifyContent:"center" },
  headerTitle: {
    fontSize: scale(17), fontWeight: "900", color: "#f97316", letterSpacing: 1.5,
    textShadowColor: "#f9731666", textShadowOffset:{width:0,height:0}, textShadowRadius:8,
  },

  // Idle
  idleContent: { alignItems:"center", paddingHorizontal:scale(20), paddingTop:scale(8), paddingBottom:scale(24), gap:scale(14) },
  heroRing: {
    width:scale(110), height:scale(110), borderRadius:scale(55),
    backgroundColor:"#f9731612", borderWidth:1.5, borderColor:"#f9731655",
    justifyContent:"center", alignItems:"center", elevation:6,
  },
  idleTitleBlock: { alignItems:"center", gap:scale(4) },
  idleSubLabel:   { fontSize:scale(9), fontWeight:"900", color:"#f9731688", letterSpacing:4 },
  idleTitle: {
    fontSize:scale(32), fontWeight:"900", color:"#ffffff", letterSpacing:1,
    textShadowColor:"#f9731644", textShadowOffset:{width:0,height:0}, textShadowRadius:10,
  },
  idleTagline: { fontSize:scale(12), color:"#9e86b8", fontWeight:"500", fontStyle:"italic" },

  demoCard: {
    width:"100%", backgroundColor:"#130824",
    borderRadius:scale(16), borderWidth:1, borderColor:"#f9731620",
    padding:scale(14), gap:scale(8),
  },
  demoCardLabel: { fontSize:scale(9), fontWeight:"900", color:"#9e86b8", letterSpacing:3 },
  demoInner: {
    flexDirection:"row", gap:scale(5), alignItems:"center",
    height:scale(52), backgroundColor:"#05010e",
    borderRadius:scale(10), padding:scale(5),
  },
  demoBlock: {
    flex:1, height:scale(42), borderRadius:scale(7), borderWidth:1.5,
    justifyContent:"center", alignItems:"center", overflow:"hidden", elevation:4,
  },
  demoBlockNum: { fontSize:scale(12), fontWeight:"900" },
  demoLegend: { flexDirection:"row", flexWrap:"wrap", gap:scale(4) },
  demoLegendItem: { fontSize:scale(10), color:"#9e86b8", fontWeight:"500" },

  featGrid: { width:"100%", flexDirection:"row", flexWrap:"wrap", gap:scale(8) },
  featCard: {
    width:(SW - scale(40) - scale(8)) / 2,
    backgroundColor:"#130824", borderRadius:scale(12), borderWidth:1,
    padding:scale(10), gap:scale(4),
  },
  featEmoji: { fontSize:scale(18) },
  featTitle: { fontSize:scale(11), fontWeight:"800", letterSpacing:0.3 },
  featDesc:  { fontSize:scale(9), color:"#9e86b8", fontWeight:"400", lineHeight:scale(13) },

  startBtn: {
    flexDirection:"row", alignItems:"center", backgroundColor:"#f97316",
    paddingHorizontal:scale(40), paddingVertical:scale(14), borderRadius:scale(25), elevation:8,
  },
  startBtnText: { fontSize:scale(15), fontWeight:"900", color:"#fff", letterSpacing:0.5 },

  // Stats
  statsRow: {
    flexDirection:"row", gap:scale(8),
    paddingHorizontal:scale(12), marginBottom:scale(8), width:"100%",
  },
  statPill: {
    flex:1, backgroundColor:"#160728", borderRadius:scale(10),
    borderWidth:1, paddingVertical:scale(7), alignItems:"center",
  },
  statVal:   { fontSize:scale(13), fontWeight:"900" },
  statLabel: { fontSize:scale(7), color:"#9e86b8", fontWeight:"700", letterSpacing:1, marginTop:scale(2) },
  activePuPill: {
    flex:1, borderRadius:scale(10), borderWidth:1.5,
    paddingVertical:scale(7), alignItems:"center", justifyContent:"center",
  },
  activePuText: { fontSize:scale(11), fontWeight:"900", letterSpacing:0.5 },

  // Board
  boardWrap: { marginBottom:scale(4) },
  board: {
    width:GAME_W, height:GAME_H,
    backgroundColor:"#050110",
    borderRadius:scale(18), overflow:"hidden",
    borderWidth:1.5, borderColor:"#f9731620",
    position:"relative", elevation:6,
  },
  bgDot: { position:"absolute", width:2, height:2, borderRadius:1, backgroundColor:"#ffffff07" },
  puFlash: { borderRadius:scale(18), zIndex:0, pointerEvents:"none" },

  // Power-up bar
  puBar: {
    position:"absolute", top:0, left:0, right:0, height:scale(20),
    backgroundColor:"#00000044", justifyContent:"center", overflow:"hidden", zIndex:5,
  },
  puBarFill: { position:"absolute", top:0, left:0, bottom:0, opacity:0.7 },
  puBarLabel: { textAlign:"center", fontSize:scale(9), fontWeight:"900", letterSpacing:1, zIndex:2 },

  // Blocks
  block: {
    position:"absolute", borderRadius:scale(10), overflow:"hidden",
    justifyContent:"center", alignItems:"center", elevation:4,
  },
  blockShine: { position:"absolute", top:0, left:0, right:0, height:scale(7), borderRadius:scale(3) },
  hpTrack:    { position:"absolute", bottom:0, left:0, right:0, height:scale(3), backgroundColor:"#00000040" },
  hpFill:     { height:"100%", borderRadius:99 },
  blockNum:   { fontSize:scale(13), fontWeight:"900", textShadowColor:"#00000088", textShadowOffset:{width:0,height:1}, textShadowRadius:3 },
  bombEmoji:  { fontSize:scale(20) },
  hardOverlay:{ ...StyleSheet.absoluteFillObject, opacity:0.12, backgroundColor:"#ffffff" },

  // Balls
  ball: {
    position:"absolute", width:BALL_R * 2, height:BALL_R * 2, borderRadius:BALL_R,
    backgroundColor:"#00ffff", shadowOffset:{width:0,height:0}, shadowOpacity:0.9, shadowRadius:7, elevation:5,
  },

  // Power-up items
  puItem: {
    position:"absolute", width:scale(30), height:scale(30), borderRadius:scale(15),
    borderWidth:2, justifyContent:"center", alignItems:"center", elevation:6,
  },
  puItemEmoji: { fontSize:scale(16) },

  // Particles / pops
  particle: { position:"absolute" },
  scorePop: {
    position:"absolute", fontSize:scale(12), fontWeight:"900",
    textShadowColor:"#00000088", textShadowOffset:{width:0,height:1}, textShadowRadius:3, zIndex:20,
  },

  // Danger line
  dangerLine: { position:"absolute", bottom:scale(28), left:0, right:0, height:scale(2), borderRadius:99 },

  // ── Cannon — improved shooter ────────────────────────────────────────────
  cannonWrap:        { position:"absolute", bottom:0, left:0, width:CANNON_W, alignItems:"center" },

  // Outer diffuse glow
  cannonGlow: {
    position:"absolute", bottom:scale(4),
    width:CANNON_W + scale(22), height:CANNON_W + scale(22),
    borderRadius:(CANNON_W + scale(22)) / 2,
  },

  // Inner sharp glow ring
  cannonInnerGlow: {
    position:"absolute", bottom:scale(9),
    width:CANNON_W + scale(8), height:CANNON_W + scale(8),
    borderRadius:(CANNON_W + scale(8)) / 2,
    borderWidth:1.5,
    shadowOffset:{width:0,height:0}, shadowOpacity:0.7, shadowRadius:8,
  },

  // Barrel cap — muzzle flash origin
  cannonBarrelWrap:  { alignItems:"center", marginBottom:-scale(2), zIndex:2 },
  cannonBarrelCap: {
    width:scale(11), height:scale(5), borderRadius:scale(3),
    shadowOffset:{width:0,height:0}, shadowOpacity:1, shadowRadius:7, elevation:6,
  },
  // Barrel shaft
  cannonBarrel: {
    width:scale(8), height:NOZZLE_H, borderRadius:scale(4),
    shadowOffset:{width:0,height:0}, shadowOpacity:0.85, shadowRadius:5, elevation:5,
  },

  // Turret base
  cannonTurret: {
    width:CANNON_W, height:scale(22), borderRadius:scale(11),
    overflow:"hidden", justifyContent:"center", alignItems:"center",
    shadowOffset:{width:0,height:2}, shadowOpacity:0.9, shadowRadius:9, elevation:7,
  },
  cannonTurretShine: {
    position:"absolute", top:0, left:0, right:0, height:scale(8),
    backgroundColor:"#ffffff28", borderRadius:scale(5),
  },

  // Side fins
  cannonFin: {
    position:"absolute", bottom:0,
    width:scale(11), height:scale(13), borderRadius:scale(3),
  },
  cannonFinLeft:  { left:-scale(7) },
  cannonFinRight: { right:-scale(7) },

  // Centre crosshair dot
  cannonDot: {
    width:scale(8), height:scale(8), borderRadius:scale(4),
    borderWidth:1.5, backgroundColor:"#00000040",
  },

  dragHintWrap: { position:"absolute", bottom:scale(58), left:0, right:0, alignItems:"center" },
  dragHintText: { fontSize:scale(12), color:"#ffffff44", fontWeight:"700", letterSpacing:0.5 },
  liveScore:    { position:"absolute", top:scale(22), left:0, right:0, textAlign:"center", fontSize:scale(30), fontWeight:"900", color:"#ffffff18" },
  levelBadge:   { position:"absolute", top:scale(14), right:scale(10), backgroundColor:"#a78bfa20", borderRadius:scale(8), paddingHorizontal:scale(7), paddingVertical:scale(3), borderWidth:1, borderColor:"#a78bfa40" },
  levelText:    { fontSize:scale(9), color:"#a78bfa", fontWeight:"900", letterSpacing:0.5 },

  // Overlay / death card
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor:"rgba(5,0,14,0.96)", justifyContent:"center", alignItems:"center", zIndex:99 },
  winCard: {
    backgroundColor:"#100520", borderRadius:scale(24), borderWidth:1.5,
    padding:scale(24), alignItems:"center", width:SW - scale(40), elevation:12,
  },
  trophyRing: {
    width:scale(76), height:scale(76), borderRadius:scale(38),
    backgroundColor:"#1f0a3a", borderWidth:2,
    justifyContent:"center", alignItems:"center", marginBottom:scale(12), elevation:6,
  },
  winTitle: { fontSize:scale(26), fontWeight:"900", color:"#f43f5e", letterSpacing:4, marginBottom:scale(6) },
  winEmoji: { fontSize:scale(28), marginBottom:scale(6) },
  perfBadge: { borderRadius:scale(20), paddingHorizontal:scale(16), paddingVertical:scale(7), borderWidth:1, marginBottom:scale(14) },
  winPerf:   { fontSize:scale(13), fontWeight:"900", letterSpacing:2 },
  winStatsRow: {
    flexDirection:"row", alignItems:"center",
    backgroundColor:"#0d0118", borderRadius:scale(14),
    paddingVertical:scale(12), paddingHorizontal:scale(16),
    marginBottom:scale(12), gap:scale(16),
    borderWidth:1, borderColor:"#ffffff0e",
    width:"100%", justifyContent:"center",
  },
  winStat:        { alignItems:"center", gap:scale(3) },
  winStatValue:   { fontSize:scale(18), fontWeight:"900" },
  winStatLabel:   { fontSize:scale(8), color:"#9e86b8", fontWeight:"700", letterSpacing:1 },
  winStatDivider: { width:1, height:scale(36), backgroundColor:"#ffffff14" },
  newBestBadge: {
    flexDirection:"row", alignItems:"center",
    backgroundColor:"#fbbf2418", borderRadius:scale(20),
    paddingHorizontal:scale(12), paddingVertical:scale(6),
    marginBottom:scale(12), borderWidth:1, borderColor:"#fbbf2455",
  },
  newBestText:  { fontSize:scale(12), color:"#fbbf24", fontWeight:"800" },
  playAgainBtn: {
    flexDirection:"row", alignItems:"center", backgroundColor:"#f97316",
    paddingHorizontal:scale(32), paddingVertical:scale(13),
    borderRadius:scale(25), marginBottom:scale(10), elevation:6,
  },
  playAgainText: { fontSize:scale(14), fontWeight:"900", color:"#fff" },
  exitBtn:       { flexDirection:"row", alignItems:"center", paddingVertical:scale(8) },
  exitText:      { fontSize:scale(12), color:"#9e86b8", fontWeight:"600" },
});