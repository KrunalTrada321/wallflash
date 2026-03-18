// Screens/Games/StackTower.js

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, StyleSheet, Pressable,
  Animated, StatusBar, SafeAreaView,
  Platform, Vibration, Dimensions, ScrollView,
} from "react-native";
import { scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft, RefreshCw, Layers,
  Trophy, ChevronLeft, PlayCircle,
  Star, Flame, Award, Zap, CheckCircle,
} from "lucide-react-native";
import GameBannerAd from "../../Components/GameBannerAd";
import { useInterstitialAd } from "../../Components/Useinterstitialad";

// ─── Board dimensions ─────────────────────────────────────────────────────────
const { width: W, height: SCREEN_H } = Dimensions.get("window");
const BOARD_W       = W - scale(24);
const BLOCK_H       = scale(34);
const BOARD_H       = Math.floor(SCREEN_H * 0.58);
const VISIBLE_ROWS  = Math.floor(BOARD_H / BLOCK_H);

// ─── Speed tiers ─────────────────────────────────────────────────────────────
const SPEEDS        = [2.2, 2.8, 3.5, 4.3, 5.2, 6.1, 7.0];
const speedForScore = (s) => SPEEDS[Math.min(Math.floor(s / 5), SPEEDS.length - 1)];

// ─── Haptics ──────────────────────────────────────────────────────────────────
const haptic = (key) => {
  const map = {
    place:     [0, 30],
    perfect:   [0, 40, 20, 40],
    combo:     [0, 30, 15, 30, 15, 60],
    milestone: [0, 50, 30, 50, 30, 100],
    die:       [0, 80, 50, 80],
  };
  const p = map[key];
  if (p) Vibration.vibrate(p);
};

// ─── Colours ──────────────────────────────────────────────────────────────────
const COLORS = [
  "#00ffff", "#a78bfa", "#ff00ff", "#ffd700",
  "#4caf50", "#ff6b6b", "#00e5ff", "#ff9800",
  "#38bdf8", "#e879f9", "#34d399", "#fb923c",
];
const blockColor = (i) => COLORS[i % COLORS.length];

// ─── Rating ───────────────────────────────────────────────────────────────────
const getRating = (s) => {
  if (s >= 25) return { label: "Architect!",    color: "#ffd700", emoji: "🏗️", Icon: Trophy };
  if (s >= 15) return { label: "Stacker Pro!",  color: "#00ffff", emoji: "🌟", Icon: Star   };
  if (s >= 10) return { label: "Solid Stack!",  color: "#4caf50", emoji: "🔥", Icon: Flame  };
  if (s >= 5)  return { label: "Getting High!", color: "#ff9800", emoji: "⚡", Icon: Zap    };
  return              { label: "Stack Higher!", color: "#ff4081", emoji: "💪", Icon: Award  };
};

const PERFECT_THRESHOLD = scale(5);
const MILESTONES = [5, 10, 15, 20, 30, 50];

// ─── Particle ─────────────────────────────────────────────────────────────────
function Particle({ x, y, color, onDone }) {
  const px  = useRef(new Animated.Value(x)).current;
  const py  = useRef(new Animated.Value(y)).current;
  const op  = useRef(new Animated.Value(1)).current;
  const sc  = useRef(new Animated.Value(1)).current;
  const vx  = useRef((Math.random() - 0.5) * scale(80)).current;
  const vy  = useRef(-(Math.random() * scale(60) + scale(20))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(px, { toValue: x + vx,       duration: 600, useNativeDriver: true }),
      Animated.timing(py, { toValue: y + vy + scale(40), duration: 600, useNativeDriver: true }),
      Animated.timing(op, { toValue: 0,             duration: 600, useNativeDriver: true }),
      Animated.spring( sc, { toValue: 0, tension: 100, friction: 5, useNativeDriver: true }),
    ]).start(onDone);
  }, []);

  const size = scale(5 + Math.random() * 5);
  return (
    <Animated.View
      style={{
        position: "absolute",
        width: size, height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        transform: [{ translateX: px }, { translateY: py }, { scale: sc }],
        opacity: op,
        zIndex: 20,
      }}
    />
  );
}

// ─── CutPiece — the chopped-off shard that flies away ─────────────────────────
function CutPiece({ x, y, w, color, side }) {
  // side: "left" | "right"
  const tx = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(0)).current;
  const op = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(tx, { toValue: side === "left" ? -scale(40) : scale(40), duration: 500, useNativeDriver: true }),
      Animated.timing(ty, { toValue: scale(60), duration: 500, useNativeDriver: true }),
      Animated.timing(op, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: x, bottom: y,
        width: w, height: BLOCK_H - scale(3),
        backgroundColor: color,
        borderRadius: scale(4),
        opacity: op,
        transform: [{ translateX: tx }, { translateY: ty }],
        zIndex: 15,
      }}
    />
  );
}

// ─── MilestonePopup ───────────────────────────────────────────────────────────
function MilestonePopup({ score, color }) {
  const sc = useRef(new Animated.Value(0)).current;
  const op = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(sc, { toValue: 1, tension: 180, friction: 6, useNativeDriver: true }),
        Animated.timing(op, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
      Animated.delay(900),
      Animated.parallel([
        Animated.spring(sc, { toValue: 0, tension: 200, friction: 8, useNativeDriver: true }),
        Animated.timing(op, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.milestone, { borderColor: color + "88", opacity: op, transform: [{ scale: sc }] }]}>
      <Text style={[styles.milestoneText, { color }]}>🎉  {score} FLOORS!</Text>
    </Animated.View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function StackTower() {
  const navigation = useNavigation();
  const { showAd } = useInterstitialAd(); // ← hook
 
  const [phase,        setPhase]        = useState("idle");
  const [score,        setScore]        = useState(0);
  const [highScore,    setHighScore]    = useState(0);
  const [blocks,       setBlocks]       = useState([]);
  const [moving,       setMoving]       = useState(null);
  const [cameraOffset, setCameraOffset] = useState(0);
  const [perfectCount, setPerfectCount] = useState(0);
  const [combo,        setCombo]        = useState(0);
  const [particles,    setParticles]    = useState([]); // [{ id, x, y, color }]
  const [cutPieces,    setCutPieces]    = useState([]); // [{ id, x, y, w, color, side }]
  const [milestone,    setMilestone]    = useState(null); // { score, color }
  const [countdown,    setCountdown]    = useState(null); // 3|2|1|null

  const rafRef       = useRef(null);
  const movingRef    = useRef(null);
  const blocksRef    = useRef([]);
  const scoreRef     = useRef(0);
  const aliveRef     = useRef(false);
  const perfectRef   = useRef(0);
  const comboRef     = useRef(0);
  const particleId   = useRef(0);
  const cutId        = useRef(0);

  const overlayAnim  = useRef(new Animated.Value(0)).current;
  const boardAnim    = useRef(new Animated.Value(0)).current;
  const perfectAnim  = useRef(new Animated.Value(0)).current;
  const perfectOpac  = useRef(new Animated.Value(0)).current;
  const comboAnim    = useRef(new Animated.Value(1)).current;
  const headerAnim   = useRef(new Animated.Value(0)).current;
  const missAnim     = useRef(new Animated.Value(0)).current;
  const perfectFlash = useRef(new Animated.Value(0)).current;
  const cdAnim       = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── rAF loop ───────────────────────────────────────────────────────────────
  const loop = useCallback(() => {
    if (!aliveRef.current) return;
    const m = movingRef.current;
    if (!m) { rafRef.current = requestAnimationFrame(loop); return; }

    const speed = speedForScore(scoreRef.current);
    let newX = m.x + speed * m.dir;

    if (newX < 0)              { newX = 0;             m.dir = 1;  }
    if (newX + m.w > BOARD_W)  { newX = BOARD_W - m.w; m.dir = -1; }

    m.x = newX;
    movingRef.current = { ...m };
    setMoving({ ...m });
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  // ── Countdown then start ───────────────────────────────────────────────────
  const startGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    overlayAnim.setValue(0);
    boardAnim.setValue(0);
    aliveRef.current = false;
    setPhase("countdown");
    setCountdown(3);

    let count = 3;
    const tick = () => {
      cdAnim.setValue(1.4);
      Animated.spring(cdAnim, { toValue: 1, tension: 150, friction: 6, useNativeDriver: true }).start();
      haptic("place");
      count -= 1;
      if (count === 0) {
        setTimeout(() => {
          setCountdown(null);
          launchGame();
        }, 850);
      } else {
        setCountdown(count);
        setTimeout(tick, 850);
      }
    };
    setTimeout(tick, 800);
  }, []);

  const launchGame = useCallback(() => {
    const initW    = BOARD_W * 0.62;
    const first    = { x: (BOARD_W - initW) / 2, w: initW, color: COLORS[0] };
    const firstMov = { x: 0, w: initW, dir: 1, color: COLORS[1] };

    blocksRef.current  = [first];
    movingRef.current  = firstMov;
    scoreRef.current   = 0;
    perfectRef.current = 0;
    comboRef.current   = 0;
    aliveRef.current   = true;

    setBlocks([first]);
    setMoving(firstMov);
    setScore(0);
    setPerfectCount(0);
    setCombo(0);
    setPhase("playing");
    setCameraOffset(0);
    setParticles([]);
    setCutPieces([]);
    setMilestone(null);

    Animated.spring(boardAnim, { toValue: 1, tension: 55, friction: 9, useNativeDriver: true }).start();
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  // ── Spawn particles ────────────────────────────────────────────────────────
  const spawnParticles = useCallback((blockX, blockW, blockRowIdx, color, count = 8) => {
    const fromBottom = blockRowIdx * BLOCK_H - 0; // cameraOffset is 0 for the top block always
    const centerX    = blockX + blockW / 2;
    const y          = BOARD_H - fromBottom - BLOCK_H;
    const newPs = Array.from({ length: count }, () => ({
      id: particleId.current++,
      x:  centerX + (Math.random() - 0.5) * blockW * 0.6,
      y,
      color,
    }));
    setParticles((prev) => [...prev, ...newPs]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newPs.find((np) => np.id === p.id)));
    }, 700);
  }, []);

  // ── Place block ────────────────────────────────────────────────────────────
  const placeBlock = useCallback(() => {
    if (!aliveRef.current) return;
    const m    = movingRef.current;
    const prev = blocksRef.current[blocksRef.current.length - 1];

    const overlapL = Math.max(m.x, prev.x);
    const overlapR = Math.min(m.x + m.w, prev.x + prev.w);
    const overlapW = overlapR - overlapL;

    if (overlapW <= 0) {
      cancelAnimationFrame(rafRef.current);
      aliveRef.current = false;
      haptic("die");
      Animated.sequence([
        Animated.timing(missAnim, { toValue: 1, duration: 80,  useNativeDriver: false }),
        Animated.timing(missAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
      ]).start();
      setHighScore(h => Math.max(h, scoreRef.current));
      setPhase("dead");
      setTimeout(() => {
        Animated.spring(overlayAnim, { toValue: 1, tension: 50, friction: 9, useNativeDriver: true }).start();
      }, 400);
      return;
    }

    const isPerfect = Math.abs(overlapW - prev.w) < PERFECT_THRESHOLD &&
                      Math.abs(m.x - prev.x)       < PERFECT_THRESHOLD;

    const newW     = isPerfect ? prev.w : overlapW;
    const newX     = isPerfect ? prev.x : overlapL;
    const newScore = scoreRef.current + 1;
    scoreRef.current = newScore;

    // Cut piece animation (only if not perfect)
    if (!isPerfect) {
      const cutW    = m.w - overlapW;
      const cutX    = m.x < prev.x ? m.x : overlapR;
      const cutSide = m.x < prev.x ? "left" : "right";
      const fromBot = blocksRef.current.length * BLOCK_H;
      setCutPieces((prev2) => {
        const piece = { id: cutId.current++, x: cutX, y: fromBot, w: cutW, color: m.color, side: cutSide };
        setTimeout(() => setCutPieces((p) => p.filter((cp) => cp.id !== piece.id)), 550);
        return [...prev2, piece];
      });
    }

    if (isPerfect) {
      haptic("perfect");
      perfectRef.current += 1;
      setPerfectCount(perfectRef.current);
      comboRef.current += 1;

      // Perfect flash
      Animated.sequence([
        Animated.timing(perfectFlash, { toValue: 1, duration: 80,  useNativeDriver: false }),
        Animated.timing(perfectFlash, { toValue: 0, duration: 250, useNativeDriver: false }),
      ]).start();

      perfectOpac.setValue(1);
      perfectAnim.setValue(0);
      Animated.parallel([
        Animated.timing(perfectAnim, { toValue: -scale(50), duration: 900, useNativeDriver: true }),
        Animated.timing(perfectOpac, { toValue: 0,          duration: 900, useNativeDriver: true }),
      ]).start();

      spawnParticles(newX, newW, blocksRef.current.length, m.color, 14);
    } else {
      haptic(comboRef.current >= 2 ? "combo" : "place");
      comboRef.current = 0;
    }

    // Combo haptic burst
    if (comboRef.current >= 3) {
      haptic("combo");
      // Pulse combo badge
      comboAnim.setValue(1.4);
      Animated.spring(comboAnim, { toValue: 1, tension: 200, friction: 6, useNativeDriver: true }).start();
    }
    setCombo(comboRef.current);

    // Milestone check
    if (MILESTONES.includes(newScore)) {
      haptic("milestone");
      const col = blockColor(newScore);
      setMilestone({ score: newScore, color: col });
      setTimeout(() => setMilestone(null), 1800);
    }

    const newBlock  = { x: newX, w: newW, color: blockColor(blocksRef.current.length) };
    const newBlocks = [...blocksRef.current, newBlock];
    blocksRef.current = newBlocks;

    const newOffset = Math.max(0, (newBlocks.length - VISIBLE_ROWS + 2) * BLOCK_H);
    setCameraOffset(newOffset);
    setBlocks(newBlocks);
    setScore(newScore);

    const nextMov = { x: Math.random() < 0.5 ? 0 : BOARD_W - newW, w: newW, dir: Math.random() < 0.5 ? 1 : -1, color: blockColor(newBlocks.length + 1) };
    movingRef.current = nextMov;
    setMoving(nextMov);
  }, [spawnParticles]);

  const rating = getRating(score);

  const boardBg = missAnim.interpolate({
    inputRange: [0, 1], outputRange: ["#06011a", "#2e0a0a"],
  });
  const perfectBg = perfectFlash.interpolate({
    inputRange: [0, 1], outputRange: ["#06011a", "#0a2e1a"],
  });

  // ── IDLE ───────────────────────────────────────────────────────────────────
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
            <Layers size={scale(50)} color="#a78bfa" strokeWidth={1.4} />
          </View>
          <View style={styles.idleTitleBlock}>
            <Text style={styles.idleSubLabel}>ONE-TAP CHALLENGE</Text>
            <Text style={styles.idleTitle}>Stack Tower</Text>
            <Text style={styles.idleTagline}>Tap to drop. Stack to the sky.</Text>
          </View>

          <View style={styles.demoCard}>
            <Text style={styles.demoCardLabel}>PREVIEW</Text>
            <View style={styles.demoTower}>
              {[
                { w: "88%", color: "#00ffff"  },
                { w: "74%", color: "#a78bfa"  },
                { w: "62%", color: "#ff00ff"  },
                { w: "50%", color: "#ffd700"  },
                { w: "40%", color: "#4caf50"  },
              ].reverse().map((b, i) => (
                <View key={i} style={[styles.demoBlock, { width: b.w, backgroundColor: b.color }]} />
              ))}
              <View style={[styles.demoMovingBlock, { backgroundColor: "#ff6b6b" }]}>
                <Text style={styles.demoArrow}>← TAP TO DROP →</Text>
              </View>
            </View>
          </View>

          {/* Tips grid */}
          {/* <View style={styles.tipsGrid}>
            <TipCard color="#ffd700" emoji="⭐" title="Perfect Drop"  desc="Land exactly on the block below for a PERFECT bonus + particles" />
            <TipCard color="#00ffff" emoji="🔥" title="Combo Chain"  desc="String perfects together to build a combo multiplier" />
            <TipCard color="#4caf50" emoji="🎉" title="Milestones"    desc="Hit 5, 10, 15, 20+ floors for celebration popups" />
            <TipCard color="#ff6b6b" emoji="⚡" title="Speed Up"      desc="Every 5 floors the block moves faster — stay sharp!" />
          </View> */}

          <Pressable style={({ pressed }) => [styles.startBtn, pressed && { opacity: 0.88 }]} onPress={startGame}>
            <PlayCircle size={scale(18)} color="#0d0118" strokeWidth={2.5} />
            <Text style={styles.startBtnText}>  Start Stacking</Text>
          </Pressable>
        </ScrollView>
        <GameBannerAd bottom size="banner" />
      </SafeAreaView>
    );
  }

  // ── COUNTDOWN ──────────────────────────────────────────────────────────────
  if (phase === "countdown") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
        <Header onBack={() => navigation.goBack()} />
        <View style={styles.countdownScreen}>
          <Text style={styles.getReadyText}>GET READY!</Text>
          <Animated.Text style={[styles.countdownNumber, { transform: [{ scale: cdAnim }] }]}>
            {countdown}
          </Animated.Text>
          <Text style={styles.countdownSub}>Tap to drop the block</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── PLAYING / DEAD ──────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
      <Header onBack={() => navigation.goBack()} onReset={startGame} showReset />

      {/* Stats strip */}
      <View style={styles.statsRow}>
        <StatPill label="SCORE"   value={score}     color="#a78bfa" />
        <StatPill label="BEST"    value={highScore}  color="#ffd700" />
        <StatPill label="PERFECT" value={perfectCount} color="#00ffff" />
        {combo >= 2
          ? <Animated.View style={[styles.comboPill, { transform: [{ scale: comboAnim }] }]}>
              <Text style={styles.comboPillText}>🔥 ×{combo}</Text>
              <Text style={styles.comboPillLabel}>COMBO</Text>
            </Animated.View>
          : <StatPill label="SPEED" value={`×${Math.min(Math.floor(score / 5) + 1, SPEEDS.length)}`} color="#ff00ff" />
        }
      </View>

      {/* Board */}
      <Animated.View style={[
        styles.boardOuter,
        {
          opacity: boardAnim,
          transform: [{ scale: boardAnim.interpolate({ inputRange:[0,1], outputRange:[0.95,1] }) }],
        },
      ]}>
        <Pressable onPress={placeBlock} activeOpacity={1} style={{ flex: 1 }}>
          <Animated.View style={[styles.board, { backgroundColor: phase === "playing" ? perfectBg : boardBg }]}>

            {/* Grid lines */}
            {Array.from({ length: Math.ceil(BOARD_H / BLOCK_H) + 1 }).map((_, i) => (
              <View key={`grid-${i}`} style={[styles.gridLine, { bottom: i * BLOCK_H }]} />
            ))}

            {/* Ghost line — shows ideal alignment zone */}
            {moving && phase === "playing" && blocks.length > 0 && (() => {
              const prev = blocks[blocks.length - 1];
              const fromBottom = blocks.length * BLOCK_H - cameraOffset;
              return (
                <View style={[styles.ghostLine, {
                  left:   prev.x,
                  width:  prev.w,
                  bottom: fromBottom,
                  borderColor: moving.color + "30",
                }]} />
              );
            })()}

            {/* Placed blocks */}
            {blocks.map((b, i) => {
              const fromBottom = i * BLOCK_H - cameraOffset;
              if (fromBottom < -BLOCK_H || fromBottom > BOARD_H + BLOCK_H) return null;
              const isTop = i === blocks.length - 1;
              return (
                <View key={`block-${i}`} style={[
                  styles.block,
                  {
                    left: b.x, bottom: fromBottom,
                    width: b.w, height: BLOCK_H - scale(3),
                    backgroundColor: b.color,
                    borderRadius: isTop ? scale(8) : scale(5),
                    elevation: isTop ? 6 : 3,
                  },
                ]} />
              );
            })}

            {/* Cut pieces */}
            {cutPieces.map((cp) => (
              <CutPiece key={cp.id} x={cp.x} y={cp.y} w={cp.w} color={cp.color} side={cp.side} />
            ))}

            {/* Moving block */}
            {moving && phase === "playing" && (
              <View style={[
                styles.block,
                styles.movingBlock,
                {
                  left:   moving.x,
                  bottom: blocks.length * BLOCK_H - cameraOffset,
                  width:  moving.w,
                  height: BLOCK_H - scale(3),
                  backgroundColor: moving.color,
                  elevation: 8,
                },
              ]} />
            )}

            {/* Particles */}
            {particles.map((p) => (
              <Particle key={p.id} x={p.x} y={p.y} color={p.color} onDone={() => {}} />
            ))}

            {/* PERFECT! float */}
            <Animated.Text style={[
              styles.perfectLabel,
              { opacity: perfectOpac, transform: [{ translateY: perfectAnim }] },
            ]}>
              ⭐  PERFECT!
            </Animated.Text>

            {/* Milestone popup */}
            {milestone && (
              <MilestonePopup score={milestone.score} color={milestone.color} />
            )}

            {/* Live score watermark */}
            <Text style={styles.liveScore}>{score}</Text>

            {/* Tap hint */}
            {score === 0 && phase === "playing" && (
              <View style={styles.tapHintBox}>
                <Text style={styles.tapHintText}>TAP ANYWHERE TO DROP</Text>
              </View>
            )}

            {/* Width indicator bar */}
            {moving && phase === "playing" && (
              <View style={styles.widthBar}>
                <View style={[styles.widthFill, {
                  width: `${Math.round((moving.w / BOARD_W) * 100)}%`,
                  backgroundColor: moving.color,
                }]} />
              </View>
            )}
          </Animated.View>
        </Pressable>
      </Animated.View>

      <GameBannerAd bottom size="banner" />

      {/* Game Over overlay */}
      {phase === "dead" && (
        <Animated.View style={[
          styles.overlay,
          {
            opacity: overlayAnim,
            transform: [{ scale: overlayAnim.interpolate({ inputRange:[0,1], outputRange:[0.88,1] }) }],
          },
        ]}>
          <View style={styles.winCard}>
            <View style={[styles.trophyRing, { borderColor: rating.color + "55" }]}>
              <rating.Icon size={scale(38)} color={rating.color} fill={rating.color + "30"} strokeWidth={1.5} />
            </View>
            <Text style={styles.winTitle}>TOPPLED!</Text>
            <Text style={styles.winEmoji}>{rating.emoji}</Text>
            <View style={[styles.ratingPill, { borderColor: rating.color + "55", backgroundColor: rating.color + "12" }]}>
              <Text style={[styles.winPerf, { color: rating.color }]}>{rating.label}</Text>
            </View>

            <View style={styles.winStatsRow}>
              <WinStat label="SCORE"   value={score}         color="#a78bfa" />
              <View style={styles.winStatDivider} />
              <WinStat label="BEST"    value={highScore}      color="#ffd700" />
              <View style={styles.winStatDivider} />
              <WinStat label="PERFECT" value={perfectCount}   color="#00ffff" />
              <View style={styles.winStatDivider} />
              <WinStat label="FLOORS"  value={blocks.length}  color="#4caf50" />
            </View>

            {score > 0 && score >= highScore && (
              <View style={styles.newBestBadge}>
                <Star size={scale(12)} color="#ffd700" fill="#ffd700" />
                <Text style={styles.newBestText}>  New High Score!</Text>
              </View>
            )}

            {/* Stack Again → interstitial then restart */}
            <Pressable
              style={({ pressed }) => [styles.playAgainBtn, pressed && { opacity: 0.88 }]}
              onPress={() => showAd(startGame)}
            >
              <PlayCircle size={scale(17)} color="#0d0118" strokeWidth={2.5} />
              <Text style={styles.playAgainText}>  Stack Again</Text>
            </Pressable>

            {/* Back to Games → interstitial then navigate */}
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
        <Layers size={scale(15)} color="#a78bfa" strokeWidth={2} style={{ marginRight: scale(6) }} />
        <Text style={styles.headerTitle}>Stack Tower</Text>
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

function TipCard({ color, emoji, title, desc }) {
  return (
    <View style={[styles.tipCard, { borderColor: color + "30" }]}>
      <Text style={styles.tipEmoji}>{emoji}</Text>
      <Text style={[styles.tipTitle, { color }]}>{title}</Text>
      <Text style={styles.tipDesc}>{desc}</Text>
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
    fontSize: scale(17), fontWeight: "900", color: "#a78bfa", letterSpacing: 1.5,
    textShadowColor: "#a78bfa66", textShadowOffset:{width:0,height:0}, textShadowRadius:8,
  },

  // Idle
  idleContent: { alignItems: "center", paddingHorizontal: scale(20), paddingTop: scale(8), paddingBottom: scale(24), gap: scale(14) },
  heroRing: {
    width: scale(110), height: scale(110), borderRadius: scale(55),
    backgroundColor: "#a78bfa12", borderWidth: 1.5, borderColor: "#a78bfa55",
    justifyContent: "center", alignItems: "center", elevation: 6,
  },
  idleTitleBlock: { alignItems: "center", gap: scale(4) },
  idleSubLabel:   { fontSize: scale(9), fontWeight: "900", color: "#a78bfa88", letterSpacing: 4 },
  idleTitle: {
    fontSize: scale(32), fontWeight: "900", color: "#ffffff", letterSpacing: 1,
    textShadowColor: "#a78bfa44", textShadowOffset:{width:0,height:0}, textShadowRadius:10,
  },
  idleTagline: { fontSize: scale(12), color: "#9e86b8", fontWeight: "500", fontStyle: "italic" },

  demoCard: {
    width: "100%", backgroundColor: "#130824",
    borderRadius: scale(16), borderWidth: 1, borderColor: "#a78bfa22",
    padding: scale(14), alignItems: "center", gap: scale(8),
  },
  demoCardLabel: { fontSize: scale(9), fontWeight: "900", color: "#9e86b8", letterSpacing: 3 },
  demoTower: { width: "70%", gap: scale(3), alignItems: "center" },
  demoBlock: { height: scale(22), borderRadius: scale(6), opacity: 0.85, elevation: 2 },
  demoMovingBlock: {
    width: "85%", height: scale(22), borderRadius: scale(6),
    justifyContent: "center", alignItems: "center", opacity: 0.9, marginTop: scale(4),
  },
  demoArrow: { fontSize: scale(10), color: "#0d0118", fontWeight: "900", letterSpacing: 1 },

  tipsGrid: { width: "100%", flexDirection: "row", flexWrap: "wrap", gap: scale(8) },
  tipCard: {
    width: (W - scale(40) - scale(8)) / 2,
    backgroundColor: "#130824", borderRadius: scale(12), borderWidth: 1,
    padding: scale(10), gap: scale(4),
  },
  tipEmoji: { fontSize: scale(18) },
  tipTitle: { fontSize: scale(11), fontWeight: "800", letterSpacing: 0.3 },
  tipDesc:  { fontSize: scale(9),  color: "#9e86b8", fontWeight: "400", lineHeight: scale(13) },

  startBtn: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#a78bfa",
    paddingHorizontal: scale(40), paddingVertical: scale(14), borderRadius: scale(25), elevation: 8,
  },
  startBtnText: { fontSize: scale(15), fontWeight: "900", color: "#0d0118", letterSpacing: 0.5 },

  // Countdown
  countdownScreen: { flex: 1, justifyContent: "center", alignItems: "center", gap: scale(14) },
  getReadyText:    { fontSize: scale(16), fontWeight: "900", color: "#9e86b8", letterSpacing: 3 },
  countdownNumber: {
    fontSize: scale(96), fontWeight: "900", color: "#a78bfa",
    textShadowColor: "#a78bfa99", textShadowOffset:{width:0,height:0}, textShadowRadius:20,
  },
  countdownSub: { fontSize: scale(13), color: "#9e86b8", fontWeight: "600", letterSpacing: 1 },

  // Stats
  statsRow: {
    flexDirection: "row", gap: scale(8),
    paddingHorizontal: scale(12), marginBottom: scale(8), width: "100%",
  },
  statPill: {
    flex: 1, backgroundColor: "#160728", borderRadius: scale(10),
    borderWidth: 1, paddingVertical: scale(6), alignItems: "center",
  },
  statVal:   { fontSize: scale(13), fontWeight: "900" },
  statLabel: { fontSize: scale(7), color: "#9e86b8", fontWeight: "700", letterSpacing: 1, marginTop: scale(2) },

  comboPill: {
    flex: 1, backgroundColor: "#ffd70018", borderRadius: scale(10),
    borderWidth: 1.5, borderColor: "#ffd70066",
    paddingVertical: scale(6), alignItems: "center",
  },
  comboPillText:  { fontSize: scale(13), fontWeight: "900", color: "#ffd700" },
  comboPillLabel: { fontSize: scale(7), color: "#ffd70099", fontWeight: "700", letterSpacing: 1, marginTop: scale(2) },

  // Board
  boardOuter: {
    width: BOARD_W, height: BOARD_H,
    borderRadius: scale(16), overflow: "hidden",
    borderWidth: 1.5, borderColor: "#a78bfa30",
    marginBottom: scale(6), elevation: 6,
  },
  board: { flex: 1, position: "relative", overflow: "hidden" },
  gridLine: {
    position: "absolute", left: 0, right: 0,
    height: StyleSheet.hairlineWidth, backgroundColor: "#ffffff06",
  },
  ghostLine: {
    position: "absolute",
    height: BLOCK_H - scale(3),
    borderWidth: 1.5, borderStyle: "dashed",
    borderRadius: scale(5),
    backgroundColor: "transparent",
    zIndex: 1,
  },
  block: { position: "absolute", elevation: 3 },
  movingBlock: { opacity: 0.95, elevation: 8 },

  widthBar:  { position: "absolute", top: 0, left: 0, right: 0, height: scale(4), backgroundColor: "#ffffff0A" },
  widthFill: { height: "100%" },

  perfectLabel: {
    position: "absolute", top: scale(50), left: 0, right: 0,
    textAlign: "center", fontSize: scale(22), fontWeight: "900", color: "#ffd700",
    textShadowColor: "#ffd70088", textShadowOffset:{width:0,height:0}, textShadowRadius:10,
    zIndex: 10,
  },

  milestone: {
    position: "absolute", top: "35%", left: scale(20), right: scale(20),
    alignItems: "center",
    backgroundColor: "#0d0118ee", borderRadius: scale(16), borderWidth: 1.5,
    paddingVertical: scale(12), paddingHorizontal: scale(20), zIndex: 30,
  },
  milestoneText: { fontSize: scale(20), fontWeight: "900", letterSpacing: 2 },

  liveScore: {
    position: "absolute", top: scale(14), left: 0, right: 0,
    textAlign: "center", fontSize: scale(52), fontWeight: "900", color: "#ffffff18",
  },

  tapHintBox: { position: "absolute", bottom: scale(50), left: 0, right: 0, alignItems: "center" },
  tapHintText: {
    fontSize: scale(12), fontWeight: "900", color: "#ffffff50", letterSpacing: 2,
    backgroundColor: "#ffffff08", paddingHorizontal: scale(16), paddingVertical: scale(8),
    borderRadius: scale(20), borderWidth: 1, borderColor: "#ffffff14",
  },

  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5,0,14,0.96)",
    justifyContent: "center", alignItems: "center", zIndex: 99,
  },
  winCard: {
    backgroundColor: "#100520", borderRadius: scale(24), borderWidth: 1.5, borderColor: "#a78bfa33",
    padding: scale(24), alignItems: "center", width: W - scale(40), elevation: 12,
  },
  trophyRing: {
    width: scale(76), height: scale(76), borderRadius: scale(38),
    backgroundColor: "#1f0a3a", borderWidth: 2,
    justifyContent: "center", alignItems: "center", marginBottom: scale(12), elevation: 6,
  },
  winTitle: {
    fontSize: scale(26), fontWeight: "900", color: "#ff4081", letterSpacing: 4,
    textShadowColor:"#ff408166", textShadowOffset:{width:0,height:0}, textShadowRadius:10, marginBottom: scale(6),
  },
  winEmoji:  { fontSize: scale(28), marginBottom: scale(6) },
  ratingPill: { borderRadius: scale(20), paddingHorizontal: scale(16), paddingVertical: scale(6), borderWidth: 1, marginBottom: scale(14) },
  winPerf: { fontSize: scale(13), fontWeight: "900", letterSpacing: 2 },
  winStatsRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#0d0118", borderRadius: scale(14),
    paddingVertical: scale(12), paddingHorizontal: scale(10),
    marginBottom: scale(12), gap: scale(8),
    borderWidth: 1, borderColor: "#ffffff0e",
    width: "100%", justifyContent: "center",
  },
  winStat:        { alignItems: "center", gap: scale(3) },
  winStatValue:   { fontSize: scale(16), fontWeight: "900" },
  winStatLabel:   { fontSize: scale(8), color: "#9e86b8", fontWeight: "700", letterSpacing: 1 },
  winStatDivider: { width: 1, height: scale(32), backgroundColor: "#ffffff14" },
  newBestBadge: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#ffd70018", borderRadius: scale(20),
    paddingHorizontal: scale(12), paddingVertical: scale(6),
    marginBottom: scale(12), borderWidth: 1, borderColor: "#ffd70055",
  },
  newBestText: { fontSize: scale(12), color: "#ffd700", fontWeight: "800" },
  playAgainBtn: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#a78bfa",
    paddingHorizontal: scale(30), paddingVertical: scale(12),
    borderRadius: scale(25), marginBottom: scale(10), elevation: 6,
  },
  playAgainText: { fontSize: scale(14), fontWeight: "900", color: "#0d0118" },
  exitBtn:       { flexDirection: "row", alignItems: "center", paddingVertical: scale(8) },
  exitText:      { fontSize: scale(12), color: "#9e86b8", fontWeight: "600" },
});