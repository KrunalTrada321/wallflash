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

// ─── Board dimensions ─────────────────────────────────────────────────────────
const { width: W, height: SCREEN_H } = Dimensions.get("window");
const BOARD_W  = W - scale(24);
const BLOCK_H  = scale(34);

// Board takes ~60% of screen height — much bigger than before
const BOARD_H  = Math.floor(SCREEN_H * 0.58);
const VISIBLE_ROWS = Math.floor(BOARD_H / BLOCK_H);

// ─── Speed tiers ─────────────────────────────────────────────────────────────
const SPEEDS        = [2.2, 2.8, 3.5, 4.3, 5.2, 6.1, 7.0];
const speedForScore = (s) => SPEEDS[Math.min(Math.floor(s / 5), SPEEDS.length - 1)];

// ─── Haptics ──────────────────────────────────────────────────────────────────
const haptic = (key) => {
  const map = {
    place:   Platform.OS === "android" ? [0, 30]                   : 30,
    perfect: Platform.OS === "android" ? [0, 40, 20, 40]           : 50,
    die:     Platform.OS === "android" ? [0, 80, 50, 80]           : 80,
  };
  const p = map[key];
  if (!p) return;
  Array.isArray(p) ? Vibration.vibrate(p) : Vibration.vibrate(p);
};

// ─── Colours (cycle) ──────────────────────────────────────────────────────────
const COLORS = [
  "#00ffff", "#a78bfa", "#ff00ff", "#ffd700",
  "#4caf50", "#ff6b6b", "#00e5ff", "#ff9800",
  "#38bdf8", "#e879f9", "#34d399", "#fb923c",
];
const blockColor = (i) => COLORS[i % COLORS.length];

// ─── Rating ───────────────────────────────────────────────────────────────────
const getRating = (s) => {
  if (s >= 25) return { label: "Architect!",   color: "#ffd700", emoji: "🏗️", Icon: Trophy };
  if (s >= 15) return { label: "Stacker Pro!", color: "#00ffff", emoji: "🌟", Icon: Star   };
  if (s >= 10) return { label: "Solid Stack!", color: "#4caf50", emoji: "🔥", Icon: Flame  };
  if (s >= 5)  return { label: "Getting High!",color: "#ff9800", emoji: "⚡", Icon: Zap    };
  return              { label: "Stack Higher!",color: "#ff4081", emoji: "💪", Icon: Award  };
};

const PERFECT_THRESHOLD = scale(5);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function StackTower() {
  const navigation = useNavigation();

  const [phase,        setPhase]        = useState("idle");
  const [score,        setScore]        = useState(0);
  const [highScore,    setHighScore]    = useState(0);
  const [blocks,       setBlocks]       = useState([]);
  const [moving,       setMoving]       = useState(null);
  const [cameraOffset, setCameraOffset] = useState(0);
  const [perfectCount, setPerfectCount] = useState(0);

  const rafRef      = useRef(null);
  const movingRef   = useRef(null);
  const blocksRef   = useRef([]);
  const scoreRef    = useRef(0);
  const aliveRef    = useRef(false);
  const perfectRef  = useRef(0);

  const overlayAnim  = useRef(new Animated.Value(0)).current;
  const boardAnim    = useRef(new Animated.Value(0)).current;
  const perfectAnim  = useRef(new Animated.Value(0)).current;
  const perfectOpac  = useRef(new Animated.Value(0)).current;
  const headerAnim   = useRef(new Animated.Value(0)).current;
  const missAnim     = useRef(new Animated.Value(0)).current;

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

    if (newX < 0)              { newX = 0;            m.dir = 1;  }
    if (newX + m.w > BOARD_W)  { newX = BOARD_W - m.w; m.dir = -1; }

    m.x = newX;
    movingRef.current = { ...m };
    setMoving({ ...m });

    rafRef.current = requestAnimationFrame(loop);
  }, []);

  // ── Start ──────────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    overlayAnim.setValue(0);
    boardAnim.setValue(0);

    const initW    = BOARD_W * 0.62;
    const first    = { x: (BOARD_W - initW) / 2, w: initW, color: COLORS[0] };
    const firstMov = { x: 0, w: initW, dir: 1, color: COLORS[1] };

    blocksRef.current = [first];
    movingRef.current = firstMov;
    scoreRef.current  = 0;
    perfectRef.current= 0;
    aliveRef.current  = true;

    setBlocks([first]);
    setMoving(firstMov);
    setScore(0);
    setPerfectCount(0);
    setPhase("playing");
    setCameraOffset(0);

    Animated.spring(boardAnim, { toValue: 1, tension: 55, friction: 9, useNativeDriver: true }).start();
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  // ── Place ──────────────────────────────────────────────────────────────────
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
      // Screen flash red
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

    const newW    = isPerfect ? prev.w : overlapW;
    const newX    = isPerfect ? prev.x : overlapL;
    const newScore = scoreRef.current + 1;
    scoreRef.current = newScore;

    if (isPerfect) {
      haptic("perfect");
      perfectRef.current += 1;
      setPerfectCount(perfectRef.current);
      perfectOpac.setValue(1);
      perfectAnim.setValue(0);
      Animated.parallel([
        Animated.timing(perfectAnim, { toValue: -scale(50), duration: 900, useNativeDriver: true }),
        Animated.timing(perfectOpac, { toValue: 0,          duration: 900, useNativeDriver: true }),
      ]).start();
    } else {
      haptic("place");
    }

    const newBlock  = { x: newX, w: newW, color: blockColor(blocksRef.current.length) };
    const newBlocks = [...blocksRef.current, newBlock];
    blocksRef.current = newBlocks;

    const newOffset = Math.max(0, (newBlocks.length - VISIBLE_ROWS + 2) * BLOCK_H);
    setCameraOffset(newOffset);
    setBlocks(newBlocks);
    setScore(newScore);

    const nextMov = { x: 0, w: newW, dir: 1, color: blockColor(newBlocks.length + 1) };
    movingRef.current = nextMov;
    setMoving(nextMov);
  }, []);

  const rating = getRating(score);

  const boardBg = missAnim.interpolate({
    inputRange: [0, 1], outputRange: ["#06011a", "#2e0a0a"],
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

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.idleContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.heroRing}>
            <Layers size={scale(50)} color="#a78bfa" strokeWidth={1.4} />
          </View>

          <View style={styles.idleTitleBlock}>
            <Text style={styles.idleSubLabel}>ONE-TAP CHALLENGE</Text>
            <Text style={styles.idleTitle}>Stack Tower</Text>
            <Text style={styles.idleTagline}>Tap to drop. Stack to the sky.</Text>
          </View>

          {/* Animated demo tower */}
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
                <Text style={styles.demoArrow}>← MOVING →</Text>
              </View>
            </View>
          </View>

        

          <Pressable
            style={({ pressed }) => [styles.startBtn, pressed && { opacity: 0.88 }]}
            onPress={startGame}
          >
            <PlayCircle size={scale(18)} color="#0d0118" strokeWidth={2.5} />
            <Text style={styles.startBtnText}>  Start Stacking</Text>
          </Pressable>
        </ScrollView>

        <GameBannerAd bottom size="banner" />
      </SafeAreaView>
    );
  }

  // ── PLAYING / DEAD ──────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
      <Header onBack={() => navigation.goBack()} onReset={startGame} showReset />

      {/* Compact stats strip */}
      <View style={styles.statsRow}>
        <StatPill label="SCORE"    value={score}          color="#a78bfa" />
        <StatPill label="BEST"     value={highScore}       color="#ffd700" />
        <StatPill label="PERFECT"  value={perfectCount}    color="#00ffff" />
        <StatPill label="SPEED"    value={`×${Math.min(Math.floor(score / 5) + 1, SPEEDS.length)}`} color="#ff00ff" />
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
          <Animated.View style={[styles.board, { backgroundColor: boardBg }]}>

            {/* Grid lines — subtle depth */}
            {Array.from({ length: Math.ceil(BOARD_H / BLOCK_H) + 1 }).map((_, i) => (
              <View
                key={`grid-${i}`}
                style={[styles.gridLine, { bottom: i * BLOCK_H }]}
              />
            ))}

            {/* Placed blocks */}
            {blocks.map((b, i) => {
              const fromBottom = i * BLOCK_H - cameraOffset;
              if (fromBottom < -BLOCK_H || fromBottom > BOARD_H + BLOCK_H) return null;
              const isTop = i === blocks.length - 1;
              return (
                <View
                  key={`block-${i}`}
                  style={[
                    styles.block,
                    {
                      left:   b.x,
                      bottom: fromBottom,
                      width:  b.w,
                      height: BLOCK_H - scale(3),
                      backgroundColor: b.color,
                      borderRadius: isTop ? scale(8) : scale(5),
                      ...(isTop && {
                        shadowColor:   b.color,
                        shadowOffset:  { width: 0, height: 0 },
                        shadowOpacity: 0.7,
                        shadowRadius:  8,
                        elevation: 6,
                      }),
                    },
                  ]}
                />
              );
            })}

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
                  shadowColor: moving.color,
                },
              ]} />
            )}

            {/* PERFECT! float */}
            <Animated.Text style={[
              styles.perfectLabel,
              { opacity: perfectOpac, transform: [{ translateY: perfectAnim }] },
            ]}>
              ⭐  PERFECT!
            </Animated.Text>

            {/* Score watermark */}
            <Text style={styles.liveScore}>{score}</Text>

            {/* Tap hint on first block */}
            {score === 0 && phase === "playing" && (
              <View style={styles.tapHintBox}>
                <Text style={styles.tapHintText}>TAP ANYWHERE TO DROP</Text>
              </View>
            )}

            {/* Width indicator bar at top */}
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
              <WinStat label="SCORE"   value={score}           color="#a78bfa" />
              <View style={styles.winStatDivider} />
              <WinStat label="BEST"    value={highScore}        color="#ffd700" />
              <View style={styles.winStatDivider} />
              <WinStat label="PERFECT" value={perfectCount}     color="#00ffff" />
              <View style={styles.winStatDivider} />
              <WinStat label="FLOORS"  value={blocks.length}   color="#4caf50" />
            </View>

            {score > 0 && score >= highScore && (
              <View style={styles.newBestBadge}>
                <Star size={scale(12)} color="#ffd700" fill="#ffd700" />
                <Text style={styles.newBestText}>  New High Score!</Text>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [styles.playAgainBtn, pressed && { opacity: 0.88 }]}
              onPress={startGame}
            >
              <PlayCircle size={scale(17)} color="#0d0118" strokeWidth={2.5} />
              <Text style={styles.playAgainText}>  Stack Again</Text>
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

  // Header
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
    fontSize: scale(17), fontWeight: "900", color: "#a78bfa", letterSpacing: 1.5,
    textShadowColor: "#a78bfa66", textShadowOffset:{width:0,height:0}, textShadowRadius:8,
  },

  // Idle
  idleContent: {
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingTop: scale(8),
    paddingBottom: scale(24),
    gap: scale(16),
  },
  heroRing: {
    width: scale(110), height: scale(110), borderRadius: scale(55),
    backgroundColor: "#a78bfa12", borderWidth: 1.5, borderColor: "#a78bfa55",
    justifyContent: "center", alignItems: "center",
    ...Platform.select({
      ios:     { shadowColor:"#a78bfa", shadowOffset:{width:0,height:0}, shadowOpacity:0.35, shadowRadius:18 },
      android: { elevation: 6 },
    }),
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
  demoBlock: {
    height: scale(22), borderRadius: scale(6), opacity: 0.85,
    ...Platform.select({
      ios:     { shadowColor:"#000", shadowOffset:{width:0,height:2}, shadowOpacity:0.3, shadowRadius:4 },
      android: { elevation: 2 },
    }),
  },
  demoMovingBlock: {
    width: "85%", height: scale(22), borderRadius: scale(6),
    justifyContent: "center", alignItems: "center",
    opacity: 0.9, marginTop: scale(4),
  },
  demoArrow: { fontSize: scale(10), color: "#0d0118", fontWeight: "900", letterSpacing: 1 },

  rulesGrid: {
    width: "100%", flexDirection: "row", flexWrap: "wrap", gap: scale(10),
  },
  ruleTile: {
    width: (W - scale(40) - scale(10)) / 2,
    backgroundColor: "#130824", borderRadius: scale(14),
    borderWidth: 1, padding: scale(12), gap: scale(6),
  },
  ruleTileIcon:  { width: scale(28), height: scale(28), borderRadius: scale(8), justifyContent:"center", alignItems:"center" },
  ruleTileTitle: { fontSize: scale(12), fontWeight: "800", letterSpacing: 0.3 },
  ruleTileDesc:  { fontSize: scale(10), color: "#9e86b8", fontWeight: "400", lineHeight: scale(14) },

  startBtn: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#a78bfa",
    paddingHorizontal: scale(40), paddingVertical: scale(14), borderRadius: scale(25),
    ...Platform.select({
      ios:     { shadowColor:"#a78bfa", shadowOffset:{width:0,height:6}, shadowOpacity:0.5, shadowRadius:14 },
      android: { elevation: 8 },
    }),
  },
  startBtnText: { fontSize: scale(15), fontWeight: "900", color: "#0d0118", letterSpacing: 0.5 },

  // Playing
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

  // Board
  boardOuter: {
    width: BOARD_W, height: BOARD_H,
    borderRadius: scale(16), overflow: "hidden",
    borderWidth: 1.5, borderColor: "#a78bfa30",
    marginBottom: scale(6),
    ...Platform.select({
      ios:     { shadowColor:"#a78bfa", shadowOffset:{width:0,height:0}, shadowOpacity:0.25, shadowRadius:16 },
      android: { elevation: 6 },
    }),
  },
  board: {
    flex: 1, position: "relative",
    overflow: "hidden",
  },
  gridLine: {
    position: "absolute", left: 0, right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ffffff06",
  },

  block: {
    position: "absolute",
    ...Platform.select({
      ios:     { shadowColor:"#000", shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:3 },
      android: { elevation: 3 },
    }),
  },
  movingBlock: {
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius:  10,
    elevation: 8,
    opacity: 0.95,
  },

  // Width bar (top of board — shows current block width)
  widthBar: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: scale(4), backgroundColor: "#ffffff0A",
  },
  widthFill: {
    height: "100%",
    borderRadius: 0,
  },

  perfectLabel: {
    position: "absolute", top: scale(50), left: 0, right: 0,
    textAlign: "center", fontSize: scale(22), fontWeight: "900", color: "#ffd700",
    textShadowColor: "#ffd70088", textShadowOffset:{width:0,height:0}, textShadowRadius:10,
    zIndex: 10,
  },

  liveScore: {
    position: "absolute", top: scale(14), left: 0, right: 0,
    textAlign: "center", fontSize: scale(52), fontWeight: "900", color: "#ffffff18",
  },

  tapHintBox: {
    position: "absolute", bottom: scale(50), left: 0, right: 0, alignItems: "center",
  },
  tapHintText: {
    fontSize: scale(12), fontWeight: "900", color: "#ffffff50",
    letterSpacing: 2,
    backgroundColor: "#ffffff08",
    paddingHorizontal: scale(16), paddingVertical: scale(8),
    borderRadius: scale(20), borderWidth: 1, borderColor: "#ffffff14",
  },

  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5,0,14,0.96)",
    justifyContent: "center", alignItems: "center", zIndex: 99,
  },
  winCard: {
    backgroundColor: "#100520", borderRadius: scale(24),
    borderWidth: 1.5, borderColor: "#a78bfa33",
    padding: scale(24), alignItems: "center", width: W - scale(40),
    ...Platform.select({
      ios:     { shadowColor:"#a78bfa", shadowOffset:{width:0,height:0}, shadowOpacity:0.5, shadowRadius:24 },
      android: { elevation: 12 },
    }),
  },
  trophyRing: {
    width: scale(76), height: scale(76), borderRadius: scale(38),
    backgroundColor: "#1f0a3a", borderWidth: 2,
    justifyContent: "center", alignItems: "center", marginBottom: scale(12),
    ...Platform.select({
      ios:     { shadowColor:"#ffd700", shadowOffset:{width:0,height:0}, shadowOpacity:0.4, shadowRadius:14 },
      android: { elevation: 6 },
    }),
  },
  winTitle: {
    fontSize: scale(26), fontWeight: "900", color: "#ff4081", letterSpacing: 4,
    textShadowColor:"#ff408166", textShadowOffset:{width:0,height:0}, textShadowRadius:10,
    marginBottom: scale(6),
  },
  winEmoji:  { fontSize: scale(28), marginBottom: scale(6) },
  ratingPill: {
    borderRadius: scale(20), paddingHorizontal: scale(16), paddingVertical: scale(6),
    borderWidth: 1, marginBottom: scale(14),
  },
  winPerf: { fontSize: scale(13), fontWeight: "900", letterSpacing: 2 },

  winStatsRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#0d0118", borderRadius: scale(14),
    paddingVertical: scale(12), paddingHorizontal: scale(12),
    marginBottom: scale(12), gap: scale(10),
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
    borderRadius: scale(25), marginBottom: scale(10),
    ...Platform.select({
      ios:     { shadowColor:"#a78bfa", shadowOffset:{width:0,height:4}, shadowOpacity:0.5, shadowRadius:10 },
      android: { elevation: 6 },
    }),
  },
  playAgainText: { fontSize: scale(14), fontWeight: "900", color: "#0d0118" },
  exitBtn:       { flexDirection: "row", alignItems: "center", paddingVertical: scale(8) },
  exitText:      { fontSize: scale(12), color: "#9e86b8", fontWeight: "600" },
});