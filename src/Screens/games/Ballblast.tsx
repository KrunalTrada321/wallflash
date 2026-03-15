// Screens/Games/BallBlast.js — Performance-optimized

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

// ─── Board config ─────────────────────────────────────────────────────────────
const SW         = Dimensions.get("window").width;
const GAME_W     = SW - scale(24);
const GAME_H     = scale(400);
const COLS       = 5;
const BLOCK_GAP  = scale(5);
const BLOCK_W    = (GAME_W - BLOCK_GAP * (COLS + 1)) / COLS;
const BLOCK_H    = scale(44);
const CANNON_Y   = GAME_H - scale(28);
const NOZZLE_H   = scale(20);
const BALL_R     = scale(6);
const BALL_SPEED = scale(16);
const CANNON_W   = scale(44);
const FIRE_EVERY = 4;          // frames between auto-fires
const FALL_BASE  = 0.55;       // block fall speed (px/frame)
const SPAWN_FRAMES = 90;       // frames between new rows
const DANGER_Y   = CANNON_Y - scale(10);
const MAX_PARTICLES = 18;      // hard cap — keeps render cheap
const MAX_POPS      = 4;       // score pops cap
const RENDER_EVERY  = 2;       // only re-render React every N rAF frames

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
    hit:     Platform.OS === "android" ? [0, 10]         : 10,
    explode: Platform.OS === "android" ? [0, 30, 15, 30] : 35,
    die:     Platform.OS === "android" ? [0, 80, 50, 80] : 80,
  };
  const p = map[key];
  if (!p) return;
  Array.isArray(p) ? Vibration.vibrate(p) : Vibration.vibrate(p);
};

// ─── Rating ──────────────────────────────────────────────────────────────────
const getRating = (s) => {
  if (s >= 40) return { label: "Blaster Pro!",  color: "#ffd700", emoji: "👑", Icon: Trophy };
  if (s >= 25) return { label: "Sharpshooter!", color: "#00ffff", emoji: "🌟", Icon: Star   };
  if (s >= 15) return { label: "On Fire!",       color: "#f97316", emoji: "🔥", Icon: Flame  };
  if (s >= 8)  return { label: "Good Aim!",      color: "#fb923c", emoji: "⚡", Icon: Zap    };
  return              { label: "Keep Blasting!", color: "#f43f5e", emoji: "💪", Icon: Award  };
};

let _id = 0;
const uid = () => ++_id;
const hpForLevel = (l) => Math.max(1, 1 + Math.floor(l * 1.4));

const spawnRow = (level) => {
  const count = 3 + Math.floor(Math.random() * 3);
  const cols = Array.from({ length: COLS }, (_, i) => i)
    .sort(() => Math.random() - 0.5).slice(0, count);
  return cols.map(col => {
    const hp = hpForLevel(level) + Math.floor(Math.random() * Math.ceil(level / 2));
    return { id: uid(), col, y: -BLOCK_H, hp, maxHp: hp };
  });
};

const initState = () => ({
  cannonX: GAME_W / 2,
  balls: [], blocks: [], particles: [], scorePops: [],
  score: 0, level: 1, blocksDestroyed: 0,
  rowTimer: 0, fireTimer: 0, dead: false,
});

// ─── Static background (memoized — renders only once) ─────────────────────────
const BoardBackground = memo(() => (
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

  const [phase,      setPhase]      = useState("idle");
  const [renderSeed, setRenderSeed] = useState(0); // throttled re-render trigger
  const [highScore,  setHighScore]  = useState(0);
  const [deathScore, setDeathScore] = useState(0);

  const gameRef     = useRef(initState());
  const rafRef      = useRef(null);
  const frameCount  = useRef(0);           // counts rAF frames for throttling
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const boardAnim   = useRef(new Animated.Value(0)).current;
  const shakeAnim   = useRef(new Animated.Value(0)).current;
  const dangerAnim  = useRef(new Animated.Value(0)).current;
  const dangerLoopRef = useRef(null);
  const isDangerRef   = useRef(false);
  const headerAnim    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    return () => {
      cancelAnimationFrame(rafRef.current);
      dangerLoopRef.current?.stop();
    };
  }, []);

  // ── Danger pulse ─────────────────────────────────────────────────────────
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

  // ── rAF game loop ─────────────────────────────────────────────────────────
  const loop = useCallback(() => {
    const g = gameRef.current;
    if (g.dead) { rafRef.current = requestAnimationFrame(loop); return; }

    // Auto-fire
    g.fireTimer++;
    if (g.fireTimer >= FIRE_EVERY) {
      g.fireTimer = 0;
      g.balls.push({ id: uid(), x: g.cannonX, y: CANNON_Y - NOZZLE_H - BALL_R, vx: 0, vy: -BALL_SPEED });
    }

    // Move balls (no trail — saves N*3 views per ball)
    const nextBalls = [];
    for (let i = 0; i < g.balls.length; i++) {
      const b = g.balls[i];
      const ny = b.y + b.vy;
      if (ny > -BALL_R * 3) nextBalls.push({ ...b, x: b.x + b.vx, y: ny });
    }
    g.balls = nextBalls;

    // Fall blocks
    const fallSpeed = FALL_BASE + g.level * 0.07;
    for (let i = 0; i < g.blocks.length; i++) g.blocks[i].y += fallSpeed;

    // Spawn row
    g.rowTimer++;
    if (g.rowTimer >= SPAWN_FRAMES) {
      g.rowTimer = 0;
      g.blocks = [...g.blocks, ...spawnRow(g.level)];
    }

    // Collision — O(balls × blocks) but both are small
    const removeBalls  = new Set();
    const removeBlocks = new Set();

    for (let bi = 0; bi < g.balls.length; bi++) {
      const ball = g.balls[bi];
      for (let ki = 0; ki < g.blocks.length; ki++) {
        const block = g.blocks[ki];
        if (removeBlocks.has(block.id)) continue;
        const bx    = block.col * (BLOCK_W + BLOCK_GAP) + BLOCK_GAP;
        const nearX = Math.max(bx,         Math.min(ball.x, bx + BLOCK_W));
        const nearY = Math.max(block.y,    Math.min(ball.y, block.y + BLOCK_H));
        if (Math.hypot(ball.x - nearX, ball.y - nearY) < BALL_R) {
          removeBalls.add(ball.id);
          block.hp -= 1;
          haptic("hit");
          if (block.hp <= 0) {
            removeBlocks.add(block.id);
            haptic("explode");
            const cx = bx + BLOCK_W / 2;
            const cy = block.y + BLOCK_H / 2;
            const col = blockColor(1, block.maxHp);
            // Fewer particles (6 instead of 12) — big render win
            if (g.particles.length < MAX_PARTICLES) {
              for (let p = 0; p < 6; p++) {
                const a  = (p / 6) * Math.PI * 2;
                const sp = 1.5 + Math.random() * 3;
                g.particles.push({
                  id: uid(), x: cx, y: cy,
                  vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1,
                  life: 1, r: scale(2 + Math.random() * 2.5), color: col,
                });
              }
            }
            // Score pop cap
            if (g.scorePops.length < MAX_POPS)
              g.scorePops.push({ id: uid(), x: cx, y: cy, life: 1 });
            g.score++;
            g.blocksDestroyed++;
            if (g.blocksDestroyed % 5 === 0) g.level++;
          }
          break; // one ball hits one block per frame
        }
      }
    }

    g.balls  = g.balls.filter(b  => !removeBalls.has(b.id));
    g.blocks = g.blocks.filter(b => !removeBlocks.has(b.id));

    // Particles — bulk update in place
    const nextParts = [];
    for (let i = 0; i < g.particles.length; i++) {
      const p = g.particles[i];
      const nl = p.life - 0.065;
      if (nl > 0) nextParts.push({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.14, life: nl });
    }
    g.particles = nextParts;

    // Score pops
    const nextPops = [];
    for (let i = 0; i < g.scorePops.length; i++) {
      const p = g.scorePops[i];
      const nl = p.life - 0.05;
      if (nl > 0) nextPops.push({ ...p, y: p.y - 1.3, life: nl });
    }
    g.scorePops = nextPops;

    // Danger
    const closest = g.blocks.length
      ? Math.min(...g.blocks.map(b => b.y + BLOCK_H))
      : GAME_H;
    if (closest > DANGER_Y - scale(70)) startDanger();
    else stopDanger();

    // Lose check
    if (g.blocks.some(b => b.y + BLOCK_H >= DANGER_Y)) {
      killGame(g.score); return;
    }

    // Throttle React re-render to every RENDER_EVERY frames
    frameCount.current++;
    if (frameCount.current % RENDER_EVERY === 0) setRenderSeed(s => s + 1);

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
    frameCount.current = 0;
    const state = initState();
    state.blocks = spawnRow(1);
    gameRef.current = state;
    setPhase("playing");
    setRenderSeed(0);
    Animated.spring(boardAnim, { toValue: 1, tension: 55, friction: 8, useNativeDriver: true }).start();
    rafRef.current = requestAnimationFrame(loop);
  }, [loop, stopDanger]);

  // ── PanResponder — created once, reads game state via ref ────────────────
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
      },
    })
  ).current;

  // ── Board render (called on throttled ticks only) ─────────────────────────
  const renderGame = () => {
    const g = gameRef.current;

    const dangerLineColor = dangerAnim.interpolate({
      inputRange: [0, 1], outputRange: ["#ff408122", "#ff4081cc"],
    });

    return (
      <Animated.View style={[styles.boardWrap, {
        opacity: boardAnim,
        transform: [
          { scale: boardAnim.interpolate({ inputRange:[0,1], outputRange:[0.95,1] }) },
          { translateX: shakeAnim },
        ],
      }]}>
        <View style={styles.board} {...pan.panHandlers}>

          {/* Static BG — memoized, never re-renders */}
          <BoardBackground />

          {/* Blocks */}
          {g.blocks.map(b => {
            const x   = b.col * (BLOCK_W + BLOCK_GAP) + BLOCK_GAP;
            const col = blockColor(b.hp, b.maxHp);
            return (
              <View key={b.id} style={[styles.block, {
                left: x, top: b.y, width: BLOCK_W, height: BLOCK_H,
                backgroundColor: col + "28",
                borderColor: col,
                shadowColor: col,
              }]}>
                <View style={[styles.blockShine, { backgroundColor: col + "40" }]} />
                <View style={styles.hpTrack}>
                  <View style={[styles.hpFill, { width: `${(b.hp / b.maxHp) * 100}%`, backgroundColor: col }]} />
                </View>
                <Text style={[styles.blockNum, { color: col }]} numberOfLines={1}>{b.hp}</Text>
              </View>
            );
          })}

          {/* Balls — no trail */}
          {g.balls.map(b => (
            <View key={b.id} style={[styles.ball, { left: b.x - BALL_R, top: b.y - BALL_R }]} />
          ))}

          {/* Particles */}
          {g.particles.map(p => (
            <View key={p.id} style={[styles.particle, {
              left: p.x - p.r, top: p.y - p.r,
              width: p.r * 2, height: p.r * 2,
              borderRadius: p.r,
              backgroundColor: p.color,
              opacity: p.life,
            }]} />
          ))}

          {/* Score pops */}
          {g.scorePops.map(p => (
            <Text key={p.id} style={[styles.scorePop, {
              left: p.x - scale(10), top: p.y - scale(10), opacity: p.life,
            }]}>+1</Text>
          ))}

          {/* Danger line */}
          <Animated.View style={[styles.dangerLine, { backgroundColor: dangerLineColor }]} />

          {/* Cannon */}
          <View style={[styles.cannonWrap, { left: g.cannonX - CANNON_W / 2 }]}>
            <View style={styles.cannonGlow} />
            <View style={styles.cannonNozzle} />
            <View style={styles.cannonBase}>
              <View style={styles.cannonBaseHighlight} />
            </View>
          </View>

          {/* Drag hint */}
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

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.idleContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.heroRing}>
            <Target size={scale(50)} color="#f97316" strokeWidth={1.4} />
          </View>

          <View style={styles.idleTitleBlock}>
            <Text style={styles.idleSubLabel}>AUTO-FIRE ARCADE</Text>
            <Text style={styles.idleTitle}>Ball Blast</Text>
            <Text style={styles.idleTagline}>Drag to aim. Blast before they land.</Text>
          </View>

          {/* Static demo preview */}
          <View style={styles.demoCard}>
            <Text style={styles.demoCardLabel}>PREVIEW</Text>
            <View style={styles.demoInner}>
              {[
                { col: 0, hp: 12, maxHp: 12 },
                { col: 1, hp: 7,  maxHp: 12 },
                { col: 2, hp: 3,  maxHp: 12 },
                { col: 3, hp: 9,  maxHp: 12 },
                { col: 4, hp: 5,  maxHp: 12 },
              ].map((b, i) => {
                const col = blockColor(b.hp, b.maxHp);
                return (
                  <View key={i} style={[styles.demoBlock, {
                    backgroundColor: col + "28", borderColor: col, shadowColor: col,
                  }]}>
                    <Text style={[styles.demoBlockNum, { color: col }]}>{b.hp}</Text>
                  </View>
                );
              })}
              {/* Demo balls */}
              {[22, 45, 68].map((pct, i) => (
                <View key={i} style={[styles.demoBall, { left: `${pct}%`, top: scale(50) }]} />
              ))}
              {/* Demo cannon */}
              <View style={[styles.demoCannonNozzle, { left: "45%" }]} />
              <View style={[styles.demoCannonBase, { left: "40%" }]} />
            </View>
          </View>

       

          <Pressable
            style={({ pressed }) => [styles.startBtn, pressed && { opacity: 0.88 }]}
            onPress={startGame}
          >
            <PlayCircle size={scale(18)} color="#fff" strokeWidth={2.5} />
            <Text style={styles.startBtnText}>  Start Blasting</Text>
          </Pressable>
        </ScrollView>

        <GameBannerAd bottom size="banner" />
      </SafeAreaView>
    );
  }

  // ── PLAYING / DEAD ────────────────────────────────────────────────────────
  const g = gameRef.current;
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
      <Header onBack={() => navigation.goBack()} onReset={startGame} showReset />

      <View style={styles.statsRow}>
        <StatPill label="SCORE" value={g.score}          color="#f97316" />
        <StatPill label="BEST"  value={highScore}         color="#fbbf24" />
        <StatPill label="LEVEL" value={`LV ${g.level}`}  color="#a78bfa" />
      </View>

      {renderGame()}

      <GameBannerAd bottom size="banner" />

      {phase === "dead" && (
        <Animated.View style={[styles.overlay, {
          opacity: overlayAnim,
          transform: [{ scale: overlayAnim.interpolate({ inputRange:[0,1], outputRange:[0.88,1] }) }],
        }]}>
          <View style={[styles.winCard, { borderColor: rating.color + "44" }]}>
            <View style={[styles.trophyRing, { borderColor: rating.color + "66", shadowColor: rating.color }]}>
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
              onPress={startGame}
            >
              <PlayCircle size={scale(16)} color="#fff" strokeWidth={2.5} />
              <Text style={styles.playAgainText}>  Blast Again</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.exitBtn, pressed && { opacity: 0.6 }]}
              onPress={() => navigation.goBack()}
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

function RuleTile({ color, icon, title, desc }) {
  return (
    <View style={[styles.ruleTile, { borderColor: color + "30" }]}>
      <View style={[styles.ruleTileIcon, { backgroundColor: color + "18" }]}>{icon}</View>
      <Text style={[styles.ruleTileTitle, { color }]}>{title}</Text>
      <Text style={styles.ruleTileDesc}>{desc}</Text>
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
    justifyContent: "center", alignItems: "center",
    ...Platform.select({
      ios:     { shadowColor:"#7b2fff", shadowOffset:{width:0,height:2}, shadowOpacity:0.3, shadowRadius:6 },
      android: { elevation: 4 },
    }),
  },
  headerCenter: { flex:1, flexDirection:"row", alignItems:"center", justifyContent:"center" },
  headerTitle: {
    fontSize: scale(17), fontWeight: "900", color: "#f97316", letterSpacing: 1.5,
    textShadowColor: "#f9731666", textShadowOffset:{width:0,height:0}, textShadowRadius:8,
  },

  // Idle
  idleContent: {
    alignItems: "center", paddingHorizontal: scale(20),
    paddingTop: scale(8), paddingBottom: scale(24), gap: scale(16),
  },
  heroRing: {
    width: scale(110), height: scale(110), borderRadius: scale(55),
    backgroundColor: "#f9731612", borderWidth: 1.5, borderColor: "#f9731655",
    justifyContent: "center", alignItems: "center",
    ...Platform.select({
      ios:     { shadowColor:"#f97316", shadowOffset:{width:0,height:0}, shadowOpacity:0.35, shadowRadius:18 },
      android: { elevation: 6 },
    }),
  },
  idleTitleBlock: { alignItems: "center", gap: scale(4) },
  idleSubLabel:   { fontSize: scale(9), fontWeight: "900", color: "#f9731688", letterSpacing: 4 },
  idleTitle: {
    fontSize: scale(32), fontWeight: "900", color: "#ffffff", letterSpacing: 1,
    textShadowColor: "#f9731644", textShadowOffset:{width:0,height:0}, textShadowRadius:10,
  },
  idleTagline: { fontSize: scale(12), color: "#9e86b8", fontWeight: "500", fontStyle: "italic" },

  demoCard: {
    width: "100%", backgroundColor: "#130824",
    borderRadius: scale(16), borderWidth: 1, borderColor: "#f9731620",
    padding: scale(14), gap: scale(8),
  },
  demoCardLabel: { fontSize: scale(9), fontWeight: "900", color: "#9e86b8", letterSpacing: 3 },
  demoInner: {
    height: scale(100), backgroundColor: "#05010e",
    borderRadius: scale(10), position: "relative", overflow: "hidden",
    flexDirection: "row", alignItems: "flex-start", paddingTop: scale(8), paddingHorizontal: scale(4), gap: scale(4),
  },
  demoBlock: {
    flex: 1, height: scale(36), borderRadius: scale(7), borderWidth: 1.5,
    justifyContent: "center", alignItems: "center",
    ...Platform.select({
      ios:     { shadowOffset:{width:0,height:0}, shadowOpacity:0.7, shadowRadius:6 },
      android: { elevation: 4 },
    }),
  },
  demoBlockNum: { fontSize: scale(12), fontWeight: "900" },
  demoBall: {
    position: "absolute", width: BALL_R * 2, height: BALL_R * 2, borderRadius: BALL_R,
    backgroundColor: "#00ffff",
    shadowColor:"#00ffff", shadowOffset:{width:0,height:0}, shadowOpacity:0.9, shadowRadius:5, elevation:3,
  },
  demoCannonNozzle: {
    position: "absolute", bottom: scale(18), width: scale(10), height: scale(18),
    backgroundColor: "#f97316", borderRadius: scale(4),
  },
  demoCannonBase: {
    position: "absolute", bottom: scale(6), width: scale(36), height: scale(13),
    backgroundColor: "#f97316cc", borderRadius: scale(6),
  },

  rulesGrid: { width: "100%", flexDirection: "row", flexWrap: "wrap", gap: scale(10) },
  ruleTile: {
    width: (SW - scale(40) - scale(10)) / 2,
    backgroundColor: "#130824", borderRadius: scale(14),
    borderWidth: 1, padding: scale(12), gap: scale(6),
  },
  ruleTileIcon:  { width: scale(28), height: scale(28), borderRadius: scale(8), justifyContent:"center", alignItems:"center" },
  ruleTileTitle: { fontSize: scale(12), fontWeight: "800", letterSpacing: 0.3 },
  ruleTileDesc:  { fontSize: scale(10), color: "#9e86b8", fontWeight: "400", lineHeight: scale(14) },

  startBtn: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#f97316",
    paddingHorizontal: scale(40), paddingVertical: scale(14), borderRadius: scale(25),
    ...Platform.select({
      ios:     { shadowColor:"#f97316", shadowOffset:{width:0,height:6}, shadowOpacity:0.5, shadowRadius:14 },
      android: { elevation: 8 },
    }),
  },
  startBtnText: { fontSize: scale(15), fontWeight: "900", color: "#fff", letterSpacing: 0.5 },

  // Stats
  statsRow: {
    flexDirection: "row", gap: scale(8),
    paddingHorizontal: scale(12), marginBottom: scale(8), width: "100%",
  },
  statPill: {
    flex: 1, backgroundColor: "#160728", borderRadius: scale(10),
    borderWidth: 1, paddingVertical: scale(7), alignItems: "center",
  },
  statVal:   { fontSize: scale(13), fontWeight: "900" },
  statLabel: { fontSize: scale(7), color: "#9e86b8", fontWeight: "700", letterSpacing: 1, marginTop: scale(2) },

  // Board
  boardWrap: { marginBottom: scale(4) },
  board: {
    width: GAME_W, height: GAME_H,
    backgroundColor: "#050110",
    borderRadius: scale(18), overflow: "hidden",
    borderWidth: 1.5, borderColor: "#f9731620",
    position: "relative",
    ...Platform.select({
      ios:     { shadowColor:"#f97316", shadowOffset:{width:0,height:4}, shadowOpacity:0.12, shadowRadius:16 },
      android: { elevation: 6 },
    }),
  },
  bgDot: { position: "absolute", width: 2, height: 2, borderRadius: 1, backgroundColor: "#ffffff07" },

  block: {
    position: "absolute", borderRadius: scale(10), borderWidth: 1.5,
    overflow: "hidden", justifyContent: "center", alignItems: "center",
    ...Platform.select({
      ios:     { shadowOffset:{width:0,height:0}, shadowOpacity:0.75, shadowRadius:8 },
      android: { elevation: 4 },
    }),
  },
  blockShine: { position:"absolute", top:0, left:0, right:0, height:scale(7), borderRadius:scale(3) },
  hpTrack:    { position:"absolute", bottom:0, left:0, right:0, height:scale(3), backgroundColor:"#00000040" },
  hpFill:     { height:"100%", borderRadius:99 },
  blockNum:   {
    fontSize: scale(13), fontWeight: "900",
    textShadowColor:"#00000088", textShadowOffset:{width:0,height:1}, textShadowRadius:3,
  },

  ball: {
    position: "absolute", width: BALL_R * 2, height: BALL_R * 2, borderRadius: BALL_R,
    backgroundColor: "#00ffff",
    shadowColor:"#00ffff", shadowOffset:{width:0,height:0}, shadowOpacity:0.9, shadowRadius:7, elevation:5,
  },
  particle: { position: "absolute" },
  scorePop: {
    position: "absolute", fontSize: scale(12), fontWeight: "900", color: "#fbbf24",
    textShadowColor:"#00000088", textShadowOffset:{width:0,height:1}, textShadowRadius:3, zIndex:20,
  },

  dangerLine: {
    position: "absolute", bottom: scale(28), left:0, right:0, height: scale(2), borderRadius: 99,
  },

  cannonWrap: { position:"absolute", bottom:0, width:CANNON_W, alignItems:"center" },
  cannonGlow: {
    position:"absolute", bottom:scale(6),
    width:CANNON_W + scale(10), height:CANNON_W + scale(10),
    borderRadius:(CANNON_W + scale(10)) / 2,
    backgroundColor:"#f9731612",
  },
  cannonNozzle: {
    width:scale(12), height:NOZZLE_H, backgroundColor:"#fb923c",
    borderRadius:scale(5), marginBottom:-scale(2),
    shadowColor:"#f97316", shadowOffset:{width:0,height:0}, shadowOpacity:0.9, shadowRadius:7, elevation:5,
  },
  cannonBase: {
    width:CANNON_W, height:scale(18), backgroundColor:"#f97316",
    borderRadius:scale(8), overflow:"hidden",
    shadowColor:"#f97316", shadowOffset:{width:0,height:2}, shadowOpacity:0.7, shadowRadius:7, elevation:4,
  },
  cannonBaseHighlight: {
    position:"absolute", top:0, left:0, right:0, height:scale(6),
    backgroundColor:"#ffffff22", borderRadius:scale(4),
  },

  dragHintWrap: { position:"absolute", bottom:scale(55), left:0, right:0, alignItems:"center" },
  dragHintText: { fontSize:scale(12), color:"#ffffff44", fontWeight:"700", letterSpacing:0.5 },
  liveScore:    {
    position:"absolute", top:scale(12), left:0, right:0,
    textAlign:"center", fontSize:scale(30), fontWeight:"900", color:"#ffffff1A",
  },
  levelBadge: {
    position:"absolute", top:scale(14), right:scale(10),
    backgroundColor:"#a78bfa20", borderRadius:scale(8),
    paddingHorizontal:scale(7), paddingVertical:scale(3),
    borderWidth:1, borderColor:"#a78bfa40",
  },
  levelText: { fontSize:scale(9), color:"#a78bfa", fontWeight:"900", letterSpacing:0.5 },

  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor:"rgba(5,0,14,0.96)",
    justifyContent:"center", alignItems:"center", zIndex:99,
  },
  winCard: {
    backgroundColor:"#100520", borderRadius:scale(24), borderWidth:1.5,
    padding:scale(24), alignItems:"center", width:SW - scale(40),
    ...Platform.select({
      ios:     { shadowColor:"#f97316", shadowOffset:{width:0,height:0}, shadowOpacity:0.3, shadowRadius:24 },
      android: { elevation: 12 },
    }),
  },
  trophyRing: {
    width:scale(76), height:scale(76), borderRadius:scale(38),
    backgroundColor:"#1f0a3a", borderWidth:2,
    justifyContent:"center", alignItems:"center", marginBottom:scale(12),
    shadowOffset:{width:0,height:0}, shadowOpacity:0.5, shadowRadius:14, elevation:6,
  },
  winTitle: {
    fontSize:scale(26), fontWeight:"900", color:"#f43f5e", letterSpacing:4,
    textShadowColor:"#f43f5e66", textShadowOffset:{width:0,height:0}, textShadowRadius:10,
    marginBottom:scale(6),
  },
  winEmoji: { fontSize:scale(28), marginBottom:scale(6) },
  perfBadge: {
    borderRadius:scale(20), paddingHorizontal:scale(16), paddingVertical:scale(7),
    borderWidth:1, marginBottom:scale(14),
  },
  winPerf: { fontSize:scale(13), fontWeight:"900", letterSpacing:2 },
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
    borderRadius:scale(25), marginBottom:scale(10),
    ...Platform.select({
      ios:     { shadowColor:"#f97316", shadowOffset:{width:0,height:4}, shadowOpacity:0.5, shadowRadius:10 },
      android: { elevation: 6 },
    }),
  },
  playAgainText: { fontSize:scale(14), fontWeight:"900", color:"#fff" },
  exitBtn:       { flexDirection:"row", alignItems:"center", paddingVertical:scale(8) },
  exitText:      { fontSize:scale(12), color:"#9e86b8", fontWeight:"600" },
});