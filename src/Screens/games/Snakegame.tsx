// Screens/Games/SnakeGame.js

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, StyleSheet, Pressable,
  Animated, StatusBar, SafeAreaView,
  Platform, Vibration, Dimensions,
  PanResponder, ScrollView,
} from "react-native";
import { scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft, RefreshCw,
  Trophy, ChevronLeft, PlayCircle,
  Zap, Skull, Star, Flame, Award,
  ChevronUp, ChevronDown, ChevronRight,
  Wind,
  ChevronLeft as ChevronLft,
} from "lucide-react-native";
import GameBannerAd from "../../Components/GameBannerAd";

// ─── Board ────────────────────────────────────────────────────────────────────
const SCREEN_W = Dimensions.get("window").width;
const COLS     = 20;
const ROWS     = 24;
const CELL     = Math.floor((SCREEN_W - scale(24)) / COLS);
const BOARD_W  = CELL * COLS;
const BOARD_H  = CELL * ROWS;
const MAX_SEGS = 150;

// ─── Directions ───────────────────────────────────────────────────────────────
const DIR = {
  UP:    { r: -1, c:  0 },
  DOWN:  { r:  1, c:  0 },
  LEFT:  { r:  0, c: -1 },
  RIGHT: { r:  0, c:  1 },
};
const OPPOSITE = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
const dirKey   = (d) => Object.keys(DIR).find((k) => DIR[k] === d) ?? "RIGHT";

// ─── Speed ────────────────────────────────────────────────────────────────────
const SPEED_TIERS   = [180, 155, 130, 110, 95, 82, 70, 60];
const speedForScore = (s) => SPEED_TIERS[Math.min(Math.floor(s / 5), SPEED_TIERS.length - 1)];

// ─── Food ─────────────────────────────────────────────────────────────────────
const FOOD_TYPES = {
  NORMAL: { emoji: "🍎", points:  1, color: "#ff4b4b", label: "+1"     },
  BONUS:  { emoji: "🍇", points:  3, color: "#a78bfa", label: "+3"     },
  POWER:  { emoji: "⚡", points:  2, color: "#ffd700", label: "FAST!"  },
  POISON: { emoji: "💀", points: -2, color: "#ff00ff", label: "POISON" },
};

// ─── Haptics ──────────────────────────────────────────────────────────────────
const haptic = (key) => {
  const map = {
    eat:    Platform.OS === "android" ? [0, 25]                  : 25,
    bonus:  Platform.OS === "android" ? [0, 40, 20, 40]          : 45,
    poison: Platform.OS === "android" ? [0, 80, 40, 80]          : 80,
    die:    Platform.OS === "android" ? [0, 80, 50, 120, 50, 80] : 100,
    turn:   Platform.OS === "android" ? [0, 12]                  : 12,
  };
  const p = map[key];
  if (!p) return;
  Array.isArray(p) ? Vibration.vibrate(p) : Vibration.vibrate(p);
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toPx   = (seg) => ({ x: seg.c * CELL, y: seg.r * CELL });
const isWrap = (f, t) =>
  Math.abs(t.x - f.x) > BOARD_W / 2 || Math.abs(t.y - f.y) > BOARD_H / 2;

const randCell = (snake = [], foods = []) => {
  const occ = new Set([
    ...snake.map((s) => `${s.r},${s.c}`),
    ...foods.map((f) => `${f.r},${f.c}`),
  ]);
  let r, c;
  do {
    r = Math.floor(Math.random() * ROWS);
    c = Math.floor(Math.random() * COLS);
  } while (occ.has(`${r},${c}`));
  return { r, c };
};

const spawnFood = (snake, existing) => {
  const pos  = randCell(snake, existing);
  const roll = Math.random();
  const type =
    roll < 0.60 ? "NORMAL" :
    roll < 0.80 ? "BONUS"  :
    roll < 0.92 ? "POWER"  : "POISON";
  return { ...pos, type };
};

// ─── Rating ───────────────────────────────────────────────────────────────────
const getRating = (score) => {
  if (score >= 50) return { label: "Legendary!",  color: "#ffd700", emoji: "👑", Icon: Trophy };
  if (score >= 30) return { label: "Snake God!",  color: "#00ffff", emoji: "🌟", Icon: Star   };
  if (score >= 18) return { label: "Slithering!", color: "#4caf50", emoji: "🔥", Icon: Flame  };
  if (score >= 8)  return { label: "Nice Run!",   color: "#ff9800", emoji: "👌", Icon: Award  };
  return                  { label: "Keep Going!", color: "#ff4081", emoji: "💪", Icon: Award  };
};

// Fade body colour from bright cyan → dim teal
const segColor = (i, total) => {
  if (i === 0) return "#00ffff";
  const fade = Math.max(0.2, 1 - i / (total + 2));
  return `rgba(0,210,210,${fade.toFixed(2)})`;
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SnakeGame() {
  const navigation = useNavigation();

  // Pre-allocate animated value pool (never re-created — required for useNativeDriver)
  const animX = useRef(
    Array.from({ length: MAX_SEGS }, () => new Animated.Value(-CELL * 3))
  ).current;
  const animY = useRef(
    Array.from({ length: MAX_SEGS }, () => new Animated.Value(-CELL * 3))
  ).current;

  // Game logic refs
  const snakeRef     = useRef([]);
  const dirRef       = useRef(DIR.RIGHT);
  const pendingDir   = useRef(DIR.RIGHT);
  const foodsRef     = useRef([]);
  const scoreRef     = useRef(0);
  const speedRef     = useRef(SPEED_TIERS[0]);
  const aliveRef     = useRef(false);
  const runningAnims = useRef([]);

  // React state
  const [snakeLen,   setSnakeLen]   = useState(0);
  const [foods,      setFoods]      = useState([]);
  const [score,      setScore]      = useState(0);
  const [phase,      setPhase]      = useState("idle");
  const [speed,      setSpeed]      = useState(SPEED_TIERS[0]);
  const [highScore,  setHighScore]  = useState(0);
  const [lastLabel,  setLastLabel]  = useState(null);

  const tickRef     = useRef(null);
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const labelY      = useRef(new Animated.Value(0)).current;
  const labelOpac   = useRef(new Animated.Value(0)).current;
  const boardShake  = useRef(new Animated.Value(0)).current;
  const headerAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    return () => {
      clearInterval(tickRef.current);
      runningAnims.current.forEach((a) => a.stop());
    };
  }, []);

  // ── Smooth-animate all segments ───────────────────────────────────────────
  const animateSegments = useCallback((oldSnake, newSnake, duration) => {
    runningAnims.current.forEach((a) => a.stop());
    runningAnims.current = [];
    const dur = Math.max(duration - 8, 28);

    newSnake.forEach((seg, i) => {
      if (i >= MAX_SEGS) return;
      const to   = toPx(seg);
      const prev = oldSnake[i] ?? oldSnake[oldSnake.length - 1];
      const from = toPx(prev);

      if (isWrap(from, to)) {
        animX[i].setValue(to.x);
        animY[i].setValue(to.y);
      } else {
        animX[i].setValue(from.x);
        animY[i].setValue(from.y);
        const ax = Animated.timing(animX[i], { toValue: to.x, duration: dur, useNativeDriver: true });
        const ay = Animated.timing(animY[i], { toValue: to.y, duration: dur, useNativeDriver: true });
        runningAnims.current.push(ax, ay);
        ax.start();
        ay.start();
      }
    });

    for (let i = newSnake.length; i < MAX_SEGS; i++) {
      animX[i].setValue(-CELL * 3);
      animY[i].setValue(-CELL * 3);
    }
  }, []);

  // ── Start ────────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    clearInterval(tickRef.current);
    runningAnims.current.forEach((a) => a.stop());
    runningAnims.current = [];
    overlayAnim.setValue(0);

    const initSnake = [
      { r: 12, c: 11 },
      { r: 12, c: 10 },
      { r: 12, c: 9  },
    ];
    const initFood = [spawnFood(initSnake, [])];

    initSnake.forEach((seg, i) => {
      const px = toPx(seg);
      animX[i].setValue(px.x);
      animY[i].setValue(px.y);
    });
    for (let i = initSnake.length; i < MAX_SEGS; i++) {
      animX[i].setValue(-CELL * 3);
      animY[i].setValue(-CELL * 3);
    }

    snakeRef.current   = initSnake;
    dirRef.current     = DIR.RIGHT;
    pendingDir.current = DIR.RIGHT;
    foodsRef.current   = initFood;
    scoreRef.current   = 0;
    speedRef.current   = SPEED_TIERS[0];
    aliveRef.current   = true;

    setSnakeLen(initSnake.length);
    setFoods(initFood);
    setScore(0);
    setSpeed(SPEED_TIERS[0]);
    setPhase("playing");
    setLastLabel(null);

    scheduleTick(SPEED_TIERS[0]);
  }, []);

  const scheduleTick = (ms) => {
    clearInterval(tickRef.current);
    tickRef.current = setInterval(tick, ms);
  };

  // ── Tick ─────────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    if (!aliveRef.current) return;

    dirRef.current = pendingDir.current;
    const oldSnake = snakeRef.current;
    const head     = oldSnake[0];

    const newHead = {
      r: ((head.r + dirRef.current.r) + ROWS) % ROWS,
      c: ((head.c + dirRef.current.c) + COLS) % COLS,
    };

    // Self collision
    if (oldSnake.slice(0, -1).some((s) => s.r === newHead.r && s.c === newHead.c)) {
      die(); return;
    }

    const hitIdx = foodsRef.current.findIndex((f) => f.r === newHead.r && f.c === newHead.c);
    let grow = false;

    if (hitIdx !== -1) {
      const food  = foodsRef.current[hitIdx];
      const ftype = food.type;
      const pts   = FOOD_TYPES[ftype].points;
      grow        = ftype !== "POISON";

      if      (ftype === "POISON")               haptic("poison");
      else if (ftype === "BONUS" || ftype === "POWER") haptic("bonus");
      else                                       haptic("eat");

      const newFoods = foodsRef.current.filter((_, i) => i !== hitIdx);
      newFoods.push(spawnFood([...oldSnake, newHead], newFoods));
      if (Math.random() < 0.2 && newFoods.length < 4)
        newFoods.push(spawnFood([...oldSnake, newHead], newFoods));
      foodsRef.current = newFoods;

      const newScore = Math.max(0, scoreRef.current + pts);
      scoreRef.current = newScore;

      setLastLabel({ text: FOOD_TYPES[ftype].label, color: FOOD_TYPES[ftype].color });
      labelY.setValue(0);
      labelOpac.setValue(1);
      Animated.parallel([
        Animated.timing(labelY,    { toValue: -scale(44), duration: 750, useNativeDriver: true }),
        Animated.timing(labelOpac, { toValue: 0,          duration: 750, useNativeDriver: true }),
      ]).start();

      setScore(newScore);
      setFoods([...newFoods]);

      const ns = speedForScore(newScore);
      if (ns !== speedRef.current) {
        speedRef.current = ns;
        setSpeed(ns);
        scheduleTick(ns);
      }
    }

    const newSnake = [newHead, ...oldSnake];
    if (!grow) newSnake.pop();

    animateSegments(oldSnake, newSnake, speedRef.current);
    snakeRef.current = newSnake;
    setSnakeLen(newSnake.length);
  }, [animateSegments]);

  // ── Die ──────────────────────────────────────────────────────────────────
  const die = () => {
    aliveRef.current = false;
    clearInterval(tickRef.current);
    haptic("die");
    Animated.sequence([
      Animated.timing(boardShake, { toValue:  10, duration: 50, useNativeDriver: true }),
      Animated.timing(boardShake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(boardShake, { toValue:   6, duration: 50, useNativeDriver: true }),
      Animated.timing(boardShake, { toValue:  -4, duration: 50, useNativeDriver: true }),
      Animated.timing(boardShake, { toValue:   0, duration: 50, useNativeDriver: true }),
    ]).start();
    setHighScore((h) => Math.max(h, scoreRef.current));
    setPhase("dead");
    setTimeout(() => {
      Animated.spring(overlayAnim, {
        toValue: 1, tension: 50, friction: 9, useNativeDriver: true,
      }).start();
    }, 450);
  };

  // ── Direction ─────────────────────────────────────────────────────────────
  const changeDir = useCallback((newDir) => {
    if (!aliveRef.current) return;
    const nk = dirKey(newDir);
    const ck = dirKey(dirRef.current);
    if (OPPOSITE[nk] !== ck) {
      pendingDir.current = newDir;
      haptic("turn");
    }
  }, []);

  // ── PanResponder — use a ref so the handler always sees latest changeDir ──
  const changeDirRef = useRef(changeDir);
  useEffect(() => { changeDirRef.current = changeDir; }, [changeDir]);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,
      onPanResponderRelease: (_, g) => {
        if (!g) return;                              // guard: gestureState undefined on tap
        const dx = g.dx ?? 0;
        const dy = g.dy ?? 0;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 15) return;
        if (Math.abs(dx) > Math.abs(dy))
          changeDirRef.current(dx > 0 ? DIR.RIGHT : DIR.LEFT);
        else
          changeDirRef.current(dy > 0 ? DIR.DOWN : DIR.UP);
      },
    })
  ).current;

  // ── Board renderer ────────────────────────────────────────────────────────
  const renderBoard = () => (
    <Animated.View
      style={[styles.boardWrap, { transform: [{ translateX: boardShake }] }]}
      {...pan.panHandlers}
    >
      <View style={styles.board}>
        {/* Snake segments */}
        {Array.from({ length: snakeLen }, (_, i) => {
          const isHead = i === 0;
          const sz = CELL - 2;
          const rr = isHead ? Math.round(CELL * 0.38) : Math.round(CELL * 0.30);
          return (
            <Animated.View
              key={`seg-${i}`}
              style={[
                styles.seg,
                {
                  width: sz, height: sz,
                  borderRadius: rr,
                  backgroundColor: segColor(i, snakeLen),
                  transform: [{ translateX: animX[i] }, { translateY: animY[i] }],
                  zIndex: isHead ? 5 : 2,
                  ...(isHead && {
                    shadowColor:   "#00ffff",
                    shadowOffset:  { width: 0, height: 0 },
                    shadowOpacity: 0.95,
                    shadowRadius:  8,
                    elevation:     8,
                  }),
                },
              ]}
            >
              {isHead && (
                <>
                  <View style={[styles.eye, styles.eyeL]} />
                  <View style={[styles.eye, styles.eyeR]} />
                </>
              )}
            </Animated.View>
          );
        })}

        {/* Food */}
        {foods.map((f, i) => (
          <View
            key={`food-${i}`}
            style={[styles.foodCell, { left: f.c * CELL, top: f.r * CELL, width: CELL, height: CELL }]}
          >
            <Text style={styles.foodEmoji}>{FOOD_TYPES[f.type].emoji}</Text>
          </View>
        ))}

        {/* Floating score pop */}
        {lastLabel && (
          <Animated.Text
            style={[
              styles.scoreLabel,
              {
                color:   lastLabel.color,
                opacity: labelOpac,
                transform: [{ translateY: labelY }],
                left: snakeRef.current[0] ? snakeRef.current[0].c * CELL - scale(4) : BOARD_W / 2,
                top:  snakeRef.current[0] ? snakeRef.current[0].r * CELL - scale(6) : BOARD_H / 2,
              },
            ]}
          >
            {lastLabel.text}
          </Animated.Text>
        )}
      </View>
    </Animated.View>
  );

  const rating = getRating(score);

  // ── IDLE ────────────────────────────────────────────────────────────────────
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
            <Wind size={scale(48)} color="#00ffff" strokeWidth={1.4} />
          </View>

          <View style={styles.idleTitleBlock}>
            <Text style={styles.idleSubLabel}>CLASSIC ARCADE</Text>
            <Text style={styles.idleTitle}>Snake</Text>
            <Text style={styles.idleTagline}>Eat. Grow. Survive. Don't bite yourself.</Text>
          </View>

          {/* Food legend */}
          <View style={styles.legendCard}>
            <Text style={styles.legendCardTitle}>FOOD GUIDE</Text>
            {Object.entries(FOOD_TYPES).map(([k, v]) => (
              <View key={k} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: v.color + "33", borderColor: v.color + "66" }]}>
                  <Text style={styles.legendEmoji}>{v.emoji}</Text>
                </View>
                <View style={styles.legendTextCol}>
                  <Text style={[styles.legendPts, { color: v.color }]}>
                    {v.points > 0 ? `+${v.points}` : `${v.points}`} pts
                  </Text>
                  <Text style={styles.legendDesc}>
                    {k === "NORMAL" && "Standard food"}
                    {k === "BONUS"  && "Rare — big reward!"}
                    {k === "POWER"  && "Speed boost"}
                    {k === "POISON" && "AVOID — shrinks score"}
                  </Text>
                </View>
                {k === "POISON" && (
                  <View style={styles.avoidBadge}>
                    <Text style={styles.avoidText}>AVOID</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

         

          {/* Controls note */}
          <View style={styles.controlsNote}>
            <Text style={styles.controlsText}>
              Swipe anywhere on the board  ·  or use the D-pad below
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.startBtn, pressed && { opacity: 0.88 }]}
            onPress={startGame}
          >
            <PlayCircle size={scale(18)} color="#0d0118" strokeWidth={2.5} />
            <Text style={styles.startBtnText}>  Start Game</Text>
          </Pressable>
        </ScrollView>

        <GameBannerAd bottom size="banner" />
      </SafeAreaView>
    );
  }

  // ── PLAYING / DEAD ─────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
      <Header onBack={() => navigation.goBack()} onReset={startGame} showReset />

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatBox label="SCORE"  value={score}     color="#00ffff" />
        <StatBox label="BEST"   value={highScore}  color="#ffd700" />
        <StatBox label="LENGTH" value={snakeLen}   color="#4caf50" />
        <StatBox
          label="SPEED"
          value={`×${SPEED_TIERS.indexOf(speed) + 1}`}
          color="#ff00ff"
        />
      </View>

      {renderBoard()}

      {/* D-Pad */}
      <View style={styles.dpad}>
        <Pressable style={styles.dpadBtn} onPress={() => changeDir(DIR.UP)}>
          <ChevronUp size={scale(22)} color="#9e86b8" strokeWidth={2.5} />
        </Pressable>
        <View style={styles.dpadMid}>
          <Pressable style={styles.dpadBtn} onPress={() => changeDir(DIR.LEFT)}>
            <ChevronLft size={scale(22)} color="#9e86b8" strokeWidth={2.5} />
          </Pressable>
          <View style={styles.dpadCenter} />
          <Pressable style={styles.dpadBtn} onPress={() => changeDir(DIR.RIGHT)}>
            <ChevronRight size={scale(22)} color="#9e86b8" strokeWidth={2.5} />
          </Pressable>
        </View>
        <Pressable style={styles.dpadBtn} onPress={() => changeDir(DIR.DOWN)}>
          <ChevronDown size={scale(22)} color="#9e86b8" strokeWidth={2.5} />
        </Pressable>
      </View>

      <GameBannerAd bottom size="banner" />

      {/* Game Over overlay */}
      {phase === "dead" && (
        <Animated.View style={[
          styles.overlay,
          {
            opacity: overlayAnim,
            transform: [{ scale: overlayAnim.interpolate({ inputRange:[0,1], outputRange:[0.85,1] }) }],
          },
        ]}>
          <View style={styles.winCard}>
            <View style={[styles.trophyRing, { borderColor: rating.color + "55" }]}>
              <rating.Icon size={scale(36)} color={rating.color} fill={rating.color + "33"} strokeWidth={1.5} />
            </View>
            <Text style={styles.winTitle}>GAME OVER</Text>
            <Text style={styles.winEmoji}>{rating.emoji}</Text>
            <View style={[styles.ratingPill, { borderColor: rating.color + "55", backgroundColor: rating.color + "12" }]}>
              <Text style={[styles.winPerf, { color: rating.color }]}>{rating.label}</Text>
            </View>
            <View style={styles.winStatsRow}>
              <WinStat label="SCORE"  value={score}    color="#00ffff" />
              <View style={styles.winStatDivider} />
              <WinStat label="BEST"   value={highScore} color="#ffd700" />
              <View style={styles.winStatDivider} />
              <WinStat label="LENGTH" value={snakeLen}  color="#4caf50" />
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
              <PlayCircle size={scale(16)} color="#0d0118" strokeWidth={2.5} />
              <Text style={styles.playAgainText}>  Play Again</Text>
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
        <Wind size={scale(15)} color="#00ffff" strokeWidth={2} style={{ marginRight: scale(6) }} />
        <Text style={styles.headerTitle}>Snake</Text>
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

function StatBox({ label, value, color }) {
  return (
    <View style={[styles.statBox, { borderColor: color + "44" }]}>
      <Text style={[styles.statVal, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function RuleTile({ color, icon, title, desc }) {
  return (
    <View style={[styles.ruleTile, { borderColor: color + "25" }]}>
      <View style={[styles.ruleTileIcon, { backgroundColor: color + "18" }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.ruleTileTitle, { color }]}>{title}</Text>
        <Text style={styles.ruleTileDesc}>{desc}</Text>
      </View>
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
      ios:     { shadowColor: "#7b2fff", shadowOffset:{width:0,height:2}, shadowOpacity:0.3, shadowRadius:6 },
      android: { elevation: 4 },
    }),
  },
  headerCenter: { flex:1, flexDirection:"row", alignItems:"center", justifyContent:"center" },
  headerTitle: {
    fontSize: scale(18), fontWeight: "900", color: "#00ffff", letterSpacing: 2,
    textShadowColor: "#00ffff88", textShadowOffset:{width:0,height:0}, textShadowRadius:8,
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
    backgroundColor: "#00ffff12", borderWidth: 1.5, borderColor: "#00ffff55",
    justifyContent: "center", alignItems: "center",
    ...Platform.select({
      ios:     { shadowColor:"#00ffff", shadowOffset:{width:0,height:0}, shadowOpacity:0.35, shadowRadius:18 },
      android: { elevation: 6 },
    }),
  },
  idleTitleBlock: { alignItems: "center", gap: scale(4) },
  idleSubLabel:   { fontSize: scale(9), fontWeight: "900", color: "#00ffff88", letterSpacing: 4 },
  idleTitle: {
    fontSize: scale(32), fontWeight: "900", color: "#ffffff", letterSpacing: 1,
    textShadowColor: "#00ffff44", textShadowOffset:{width:0,height:0}, textShadowRadius:10,
  },
  idleTagline: { fontSize: scale(12), color: "#9e86b8", fontWeight: "500", fontStyle: "italic" },

  legendCard: {
    width: "100%", backgroundColor: "#130824",
    borderRadius: scale(16), borderWidth: 1, borderColor: "#00ffff18",
    padding: scale(14), gap: scale(10),
  },
  legendCardTitle: {
    fontSize: scale(9), fontWeight: "900", color: "#9e86b8",
    letterSpacing: 3, marginBottom: scale(2),
  },
  legendRow: { flexDirection: "row", alignItems: "center", gap: scale(10) },
  legendDot: {
    width: scale(34), height: scale(34), borderRadius: scale(10),
    borderWidth: 1, justifyContent: "center", alignItems: "center",
  },
  legendEmoji:   { fontSize: scale(18) },
  legendTextCol: { flex: 1 },
  legendPts:     { fontSize: scale(13), fontWeight: "900" },
  legendDesc:    { fontSize: scale(10), color: "#9e86b8", fontWeight: "500" },
  avoidBadge: {
    backgroundColor: "#ff408120", borderRadius: scale(6),
    paddingHorizontal: scale(7), paddingVertical: scale(3),
    borderWidth: 1, borderColor: "#ff408160",
  },
  avoidText: { fontSize: scale(8), color: "#ff4081", fontWeight: "900", letterSpacing: 1 },

  rulesCard: {
    width: "100%", backgroundColor: "#130824",
    borderRadius: scale(16), borderWidth: 1, borderColor: "#ffffff10",
    padding: scale(14), gap: scale(8),
  },
  ruleTile: {
    flexDirection: "row", alignItems: "center", gap: scale(12),
    backgroundColor: "#0d0118", borderRadius: scale(12),
    borderWidth: 1, padding: scale(10),
  },
  ruleTileIcon:  { width: scale(30), height: scale(30), borderRadius: scale(8), justifyContent:"center", alignItems:"center" },
  ruleTileTitle: { fontSize: scale(12), fontWeight: "800", letterSpacing: 0.3, marginBottom: scale(1) },
  ruleTileDesc:  { fontSize: scale(10), color: "#9e86b8", fontWeight: "400" },

  controlsNote: {
    backgroundColor: "#ffffff08",
    borderRadius: scale(10), paddingHorizontal: scale(14), paddingVertical: scale(8),
    borderWidth: 1, borderColor: "#ffffff12",
  },
  controlsText: { fontSize: scale(11), color: "#9e86b8", fontWeight: "500", textAlign: "center" },

  startBtn: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#00ffff",
    paddingHorizontal: scale(40), paddingVertical: scale(14), borderRadius: scale(25),
    ...Platform.select({
      ios:     { shadowColor:"#00ffff", shadowOffset:{width:0,height:6}, shadowOpacity:0.5, shadowRadius:14 },
      android: { elevation: 8 },
    }),
  },
  startBtnText: { fontSize: scale(15), fontWeight: "900", color: "#0d0118", letterSpacing: 0.5 },

  // Stats
  statsRow: {
    flexDirection: "row", gap: scale(8),
    paddingHorizontal: scale(12), marginBottom: scale(8), width: "100%",
  },
  statBox: {
    flex: 1, backgroundColor: "#160728", borderRadius: scale(10),
    borderWidth: 1, paddingVertical: scale(6), alignItems: "center",
  },
  statVal:   { fontSize: scale(13), fontWeight: "900" },
  statLabel: { fontSize: scale(7), color: "#9e86b8", fontWeight: "700", letterSpacing: 1, marginTop: scale(2) },

  // Board
  boardWrap: { marginBottom: scale(8) },
  board: {
    width: BOARD_W, height: BOARD_H,
    backgroundColor: "#06011a",
    borderRadius: scale(8), borderWidth: 1.5, borderColor: "#a78bfa55",
    overflow: "hidden", position: "relative",
  },
  seg:  { position: "absolute", top: 0, left: 0 },
  eye:  {
    position: "absolute",
    width:  Math.max(3, Math.round(CELL * 0.22)),
    height: Math.max(3, Math.round(CELL * 0.22)),
    borderRadius: 99, backgroundColor: "#020a10",
  },
  eyeL: { top: Math.round(CELL * 0.18), left:  Math.round(CELL * 0.16) },
  eyeR: { top: Math.round(CELL * 0.18), right: Math.round(CELL * 0.16) },

  foodCell:   { position: "absolute", justifyContent: "center", alignItems: "center" },
  foodEmoji:  { fontSize: CELL - scale(3) },
  scoreLabel: {
    position: "absolute", fontSize: scale(13), fontWeight: "900", zIndex: 10,
    textShadowColor: "#00000099", textShadowOffset:{width:0,height:1}, textShadowRadius:3,
  },

  // D-pad
  dpad:      { alignItems: "center", gap: scale(2) },
  dpadMid:   { flexDirection: "row", alignItems: "center", gap: scale(2) },
  dpadBtn: {
    width: scale(44), height: scale(44), borderRadius: scale(12),
    backgroundColor: "#160728", borderWidth: 1, borderColor: "#ffffff14",
    justifyContent: "center", alignItems: "center",
  },
  dpadCenter: { width: scale(44), height: scale(44) },

  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5,0,14,0.95)",
    justifyContent: "center", alignItems: "center", zIndex: 99,
  },
  winCard: {
    backgroundColor: "#100520", borderRadius: scale(24),
    borderWidth: 1.5, borderColor: "#00ffff33",
    padding: scale(24), alignItems: "center", width: SCREEN_W - scale(48),
    ...Platform.select({
      ios:     { shadowColor:"#00ffff", shadowOffset:{width:0,height:0}, shadowOpacity:0.4, shadowRadius:24 },
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
    borderWidth: 1, marginBottom: scale(16),
  },
  winPerf: { fontSize: scale(13), fontWeight: "900", letterSpacing: 2 },
  winStatsRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#0d0118", borderRadius: scale(14),
    paddingVertical: scale(12), paddingHorizontal: scale(16),
    marginBottom: scale(12), gap: scale(16),
    borderWidth: 1, borderColor: "#ffffff0e",
    width: "100%", justifyContent: "center",
  },
  winStat:      { alignItems: "center", gap: scale(3) },
  winStatValue: { fontSize: scale(18), fontWeight: "900" },
  winStatLabel: { fontSize: scale(8), color: "#9e86b8", fontWeight: "700", letterSpacing: 1 },
  winStatDivider: { width: 1, height: scale(36), backgroundColor: "#ffffff14" },
  newBestBadge: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#ffd70018", borderRadius: scale(20),
    paddingHorizontal: scale(12), paddingVertical: scale(6),
    marginBottom: scale(12), borderWidth: 1, borderColor: "#ffd70055",
  },
  newBestText:  { fontSize: scale(12), color: "#ffd700", fontWeight: "800" },
  playAgainBtn: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#00ffff",
    paddingHorizontal: scale(30), paddingVertical: scale(12),
    borderRadius: scale(25), marginBottom: scale(10),
    ...Platform.select({
      ios:     { shadowColor:"#00ffff", shadowOffset:{width:0,height:4}, shadowOpacity:0.5, shadowRadius:10 },
      android: { elevation: 6 },
    }),
  },
  playAgainText: { fontSize: scale(14), fontWeight: "900", color: "#0d0118" },
  exitBtn:       { flexDirection: "row", alignItems: "center", paddingVertical: scale(8) },
  exitText:      { fontSize: scale(12), color: "#9e86b8", fontWeight: "600" },
});