// Screens/Games/TwentyFortyEight.js
//
// Classic 2048 puzzle — swipe to merge tiles, reach 2048!
//
// No extra installs beyond lucide-react-native + react-native-size-matters.
// Swipe detection uses PanResponder (built-in).

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, StyleSheet, Pressable,
  Animated, StatusBar, SafeAreaView,
  Platform, Vibration, PanResponder,
  Dimensions,
} from "react-native";
import { scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft, RefreshCw, Grid2x2,
  Trophy, ChevronLeft, PlayCircle,
  ArrowRight, Star, Flame, Award, Zap,
} from "lucide-react-native";
import GameBannerAd from "../../Components/GameBannerAd";
import { useInterstitialAd } from "../../Components/Useinterstitialad";

const SCREEN_WIDTH = Dimensions.get("window").width;
const GRID_SIZE    = 4;
const GAP          = scale(8);
const BOARD_PAD    = scale(10);
const TILE_SIZE    = (SCREEN_WIDTH - scale(32) - BOARD_PAD * 2 - GAP * (GRID_SIZE - 1)) / GRID_SIZE;

// ─── Haptics ──────────────────────────────────────────────────────────────────
const haptic = (key) => {
  const map = {
    merge:  Platform.OS === "android" ? [0, 30, 20, 30] : 35,
    move:   Platform.OS === "android" ? [0, 15]         : 15,
    win:    Platform.OS === "android" ? [0, 60, 40, 60, 40, 100] : 100,
    over:   Platform.OS === "android" ? [0, 80, 50, 80, 50, 80]  : 80,
  };
  const p = map[key];
  if (!p) return;
  Array.isArray(p) ? Vibration.vibrate(p) : Vibration.vibrate(p);
};

// ─── Tile colours ─────────────────────────────────────────────────────────────
const TILE_STYLE = {
  0:    { bg: "#1a0b2e", text: "transparent" },
  2:    { bg: "#2a1a4e", text: "#c9b8e8" },
  4:    { bg: "#3b1f6e", text: "#d8c8f8" },
  8:    { bg: "#4a2090", text: "#ffffff" },
  16:   { bg: "#6b00c2", text: "#ffffff" },
  32:   { bg: "#9c00e0", text: "#ffffff" },
  64:   { bg: "#cc00ff", text: "#ffffff" },
  128:  { bg: "#ff00cc", text: "#ffffff" },
  256:  { bg: "#ff0088", text: "#ffffff" },
  512:  { bg: "#ff2244", text: "#ffffff" },
  1024: { bg: "#ff6600", text: "#ffffff" },
  2048: { bg: "#ffd700", text: "#0d0118" },
};
const getTileStyle = (v) => TILE_STYLE[v] || { bg: "#ffd700", text: "#0d0118" };

// ─── Grid helpers ─────────────────────────────────────────────────────────────
const emptyGrid = () => Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));

function addRandomTile(grid) {
  const empty = [];
  grid.forEach((row, r) => row.forEach((v, c) => { if (v === 0) empty.push([r, c]); }));
  if (!empty.length) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next   = grid.map((row) => [...row]);
  next[r][c]   = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function slideRow(row) {
  let tiles   = row.filter((v) => v !== 0);
  let merged  = 0;
  let points  = 0;
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] === tiles[i + 1]) {
      tiles[i] *= 2;
      points  += tiles[i];
      tiles[i + 1] = 0;
      merged++;
    }
  }
  tiles = tiles.filter((v) => v !== 0);
  while (tiles.length < GRID_SIZE) tiles.push(0);
  return { row: tiles, points, merged };
}

function moveLeft(grid) {
  let totalPoints = 0, totalMerged = 0, changed = false;
  const next = grid.map((row) => {
    const { row: newRow, points, merged } = slideRow(row);
    if (newRow.join() !== row.join()) changed = true;
    totalPoints += points;
    totalMerged += merged;
    return newRow;
  });
  return { grid: next, points: totalPoints, merged: totalMerged, changed };
}

function rotateRight(grid) {
  return grid[0].map((_, c) => grid.map((row) => row[c]).reverse());
}
function rotateLeft(grid) {
  return grid[0].map((_, c) => grid.map((row) => row[GRID_SIZE - 1 - c]));
}

function move(grid, dir) {
  let rotated = grid;
  if (dir === "right") { rotated = rotateRight(rotateRight(grid)); }
  else if (dir === "up")    { rotated = rotateLeft(grid); }
  else if (dir === "down")  { rotated = rotateRight(grid); }

  const result = moveLeft(rotated);

  let finalGrid = result.grid;
  if (dir === "right") { finalGrid = rotateRight(rotateRight(result.grid)); }
  else if (dir === "up")   { finalGrid = rotateRight(result.grid); }
  else if (dir === "down") { finalGrid = rotateLeft(result.grid); }

  return { ...result, grid: finalGrid };
}

function hasWon(grid) {
  return grid.some((row) => row.some((v) => v >= 2048));
}

function canMove(grid) {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c < GRID_SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < GRID_SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

// ─── Rating ───────────────────────────────────────────────────────────────────
function getRating(best) {
  if (best >= 2048) return { label: "Legendary!",   color: "#ffd700", emoji: "👑", Icon: Trophy };
  if (best >= 1024) return { label: "Master!",       color: "#00ffff", emoji: "🌟", Icon: Star   };
  if (best >= 512)  return { label: "Expert!",       color: "#ff00ff", emoji: "🔥", Icon: Flame  };
  if (best >= 256)  return { label: "Promising!",    color: "#ff9800", emoji: "⚡", Icon: Zap    };
  return                   { label: "Keep Going!",   color: "#ff4081", emoji: "💪", Icon: Award  };
}

// ─── Animated Tile ────────────────────────────────────────────────────────────
function Tile({ value, isNew, isMerged }) {
  const scaleAnim = useRef(new Animated.Value(isNew ? 0 : 1)).current;
  const ts = getTileStyle(value);

  useEffect(() => {
    if (isNew) {
      Animated.spring(scaleAnim, { toValue: 1, tension: 200, friction: 6, useNativeDriver: true }).start();
    } else if (isMerged) {
      Animated.sequence([
        Animated.spring(scaleAnim, { toValue: 1.18, tension: 200, friction: 5, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1,    tension: 200, friction: 6, useNativeDriver: true }),
      ]).start();
    }
  }, [isNew, isMerged]);

  if (value === 0) return <View style={styles.emptyTile} />;

  const fontSize = value >= 1024 ? scale(16) : value >= 128 ? scale(20) : scale(24);

  return (
    <Animated.View style={[styles.tile, { backgroundColor: ts.bg, transform: [{ scale: scaleAnim }] },
      value === 2048 && styles.tile2048,
    ]}>
      <Text style={[styles.tileText, { color: ts.text, fontSize }]}>
        {value}
      </Text>
    </Animated.View>
  );
}

// ─── Score Pop ────────────────────────────────────────────────────────────────
function ScorePop({ points }) {
  const y   = useRef(new Animated.Value(0)).current;
  const opa = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(y,   { toValue: -scale(40), duration: 700, useNativeDriver: true }),
      Animated.timing(opa, { toValue: 0,          duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.Text style={[styles.scorePop, { transform: [{ translateY: y }], opacity: opa }]}>
      +{points}
    </Animated.Text>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function TwentyFortyEight() {
  const navigation = useNavigation();
  const { showAd } = useInterstitialAd(); // ← hook
 
  const [grid, setGrid]       = useState(emptyGrid);
  const [score, setScore]     = useState(0);
  const [best, setBest]       = useState(0);
  const [phase, setPhase]     = useState("idle");
  const [newCells, setNewCells]         = useState(new Set());
  const [mergedCells, setMergedCells]   = useState(new Set());
  const [scorePops, setScorePops]       = useState([]);
  const [keepPlaying, setKeepPlaying]   = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const overlayAnim = useRef(new Animated.Value(0)).current;
  const popId       = useRef(0);
  const gridRef     = useRef(grid);
  gridRef.current   = grid;

  // ── New game ────────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    let g = emptyGrid();
    g = addRandomTile(g);
    g = addRandomTile(g);
    setGrid(g);
    setScore(0);
    setPhase("playing");
    setKeepPlaying(false);
    setShowTutorial(true);
    setNewCells(new Set());
    setMergedCells(new Set());
    setScorePops([]);
    overlayAnim.setValue(0);
  }, []);

  // ── Handle swipe ────────────────────────────────────────────────────────────
  const handleMove = useCallback((dir) => {
    if (phase !== "playing" && !(phase === "won" && keepPlaying)) return;

    const result = move(gridRef.current, dir);
    if (!result.changed) return;

    haptic(result.merged > 0 ? "merge" : "move");

    const nextGrid = addRandomTile(result.grid);
    setGrid(nextGrid);

    const newSet    = new Set();
    const mergedSet = new Set();
    nextGrid.forEach((row, r) => row.forEach((v, c) => {
      if (result.grid[r][c] !== gridRef.current[r][c] && v !== 0) {
        if (v === result.grid[r][c]) mergedSet.add(`${r}-${c}`);
      }
    }));
    nextGrid.forEach((row, r) => row.forEach((v, c) => {
      if (result.grid[r][c] === 0 && v !== 0) newSet.add(`${r}-${c}`);
    }));
    setNewCells(newSet);
    setMergedCells(mergedSet);

    const newScore = score + result.points;
    setScore(newScore);
    setBest((b) => Math.max(b, newScore));

    if (result.points > 0) {
      const id = ++popId.current;
      setScorePops((prev) => [...prev, { id, pts: result.points }]);
      setTimeout(() => setScorePops((prev) => prev.filter((p) => p.id !== id)), 800);
    }

    if (!keepPlaying && hasWon(nextGrid)) {
      setPhase("won");
      haptic("win");
      Animated.spring(overlayAnim, { toValue: 1, tension: 50, friction: 9, useNativeDriver: true }).start();
      return;
    }

    if (!canMove(nextGrid)) {
      setPhase("over");
      haptic("over");
      Animated.spring(overlayAnim, { toValue: 1, tension: 50, friction: 9, useNativeDriver: true }).start();
    }
  }, [phase, score, keepPlaying]);

  const handleMoveRef = useRef(handleMove);
  useEffect(() => { handleMoveRef.current = handleMove; }, [handleMove]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  (_, g) =>
        Math.max(Math.abs(g.dx), Math.abs(g.dy)) > 5,
      onPanResponderRelease: (_, g) => {
        const { dx, dy } = g;
        if (!dx && !dy) return;
        const absDx = Math.abs(dx ?? 0);
        const absDy = Math.abs(dy ?? 0);
        if (Math.max(absDx, absDy) < 20) return;
        if (absDx > absDy) handleMoveRef.current(dx > 0 ? "right" : "left");
        else               handleMoveRef.current(dy > 0 ? "down"  : "up");
      },
      onPanResponderTerminate: () => {},
    })
  ).current;

  const highestTile = Math.max(...grid.flat());
  const rating = getRating(highestTile);

  // ── IDLE ───────────────────────────────────────────────────────────────────
  if (phase === "idle") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
        <Header onBack={() => navigation.goBack()} />
        <View style={styles.startScreen}>
          <View style={[styles.bigIconRing, { borderColor: "#ffd70044" }]}>
            <Grid2x2 size={scale(50)} color="#ffd700" strokeWidth={1.5} />
          </View>
          <Text style={[styles.gameTitle, { color: "#ffd700" }]}>2048</Text>
          <Text style={styles.gameSubtitle}>
            Swipe to merge matching tiles.{"\n"}Reach the <Text style={{ color: "#ffd700", fontWeight: "900" }}>2048</Text> tile to win!
          </Text>

          <View style={styles.demoGrid}>
            {[2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 0].map((v, i) => {
              const ts = getTileStyle(v);
              return (
                <View key={i} style={[styles.demoTile, { backgroundColor: ts.bg }]}>
                  {v > 0 && <Text style={[styles.demoTileText, { color: ts.text }]}>{v}</Text>}
                </View>
              );
            })}
          </View>

          <View style={styles.rulesBox}>
            <RuleRow icon={<ArrowRight size={scale(13)} color="#ffd700" />} text="Swipe in any direction to slide all tiles" />
            <RuleRow icon={<Star       size={scale(13)} color="#4caf50" />} text="Matching tiles merge into their sum" />
            <RuleRow icon={<Trophy     size={scale(13)} color="#00ffff" />} text="Reach 2048 to win — then keep going!" />
          </View>
          <Pressable style={[styles.startBtn, { backgroundColor: "#ffd700" }]} onPress={startGame}>
            <PlayCircle size={scale(18)} color="#0d0118" strokeWidth={2.5} />
            <Text style={styles.startBtnText}>  Start Game</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ── PLAYING ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
      <Header onBack={() => navigation.goBack()} onReset={startGame} showReset />

      <View style={styles.scoreRow}>
        <ScoreBox label="SCORE" value={score} color="#ffd700" />
        <ScoreBox label="BEST"  value={best}  color="#ff00ff" />
        <View style={[styles.highTileBox, { borderColor: getTileStyle(highestTile).bg + "99" }]}>
          <Text style={styles.highTileLabel}>BEST TILE</Text>
          <Text style={[styles.highTileVal, { color: getTileStyle(highestTile).bg }]}>{highestTile}</Text>
        </View>
      </View>

      <Text style={styles.hintText}>⬅  Swipe to move tiles  ➡</Text>

      <View style={styles.board} {...panResponder.panHandlers}>
        {scorePops.map((p) => <ScorePop key={p.id} points={p.pts} />)}
        {grid.map((row, r) => (
          <View key={r} style={styles.boardRow}>
            {row.map((v, c) => (
              <Tile
                key={`${r}-${c}`}
                value={v}
                isNew={newCells.has(`${r}-${c}`)}
                isMerged={mergedCells.has(`${r}-${c}`)}
              />
            ))}
          </View>
        ))}
      </View>

      {showTutorial && (
        <SwipeTutorial onDismiss={() => setShowTutorial(false)} />
      )}

      {(phase === "won" || phase === "over") && (
        <Animated.View style={[styles.overlay, {
          opacity: overlayAnim,
          transform: [{ scale: overlayAnim.interpolate({ inputRange: [0,1], outputRange: [0.85,1] }) }],
        }]}>
          <View style={[styles.winCard, { borderColor: phase === "won" ? "#ffd70044" : "#ff408144" }]}>
            <View style={[styles.trophyRing, { borderColor: phase === "won" ? "#ffd70066" : "#ff408166" }]}>
              {phase === "won"
                ? <Trophy size={scale(38)} color="#ffd700" fill="#ffd70033" strokeWidth={1.5} />
                : <Grid2x2 size={scale(38)} color="#ff4081" strokeWidth={1.5} />}
            </View>

            <Text style={[styles.winTitle, { color: phase === "won" ? "#ffd700" : "#ff4081" }]}>
              {phase === "won" ? "YOU WIN!" : "GAME OVER"}
            </Text>

            <Text style={styles.winEmoji}>{rating.emoji}</Text>
            <View style={styles.perfBadge}>
              <rating.Icon size={scale(12)} color={rating.color} strokeWidth={2} />
              <Text style={[styles.winPerf, { color: rating.color }]}>  {rating.label}</Text>
            </View>

            <View style={styles.winStatsRow}>
              <WinStat label="Score"    value={score}       color="#ffd700" />
              <View style={styles.winStatDivider} />
              <WinStat label="Best"     value={best}        color="#ff00ff" />
              <View style={styles.winStatDivider} />
              <WinStat label="Top Tile" value={highestTile} color={getTileStyle(highestTile).bg} />
            </View>

            {phase === "won" && (
              <Pressable
                style={styles.keepGoingBtn}
                onPress={() => {
                  setKeepPlaying(true);
                  setPhase("playing");
                  overlayAnim.setValue(0);
                }}
              >
                <Zap size={scale(15)} color="#ffd700" strokeWidth={2.5} />
                <Text style={styles.keepGoingText}>  Keep Playing</Text>
              </Pressable>
            )}

            {/* New Game → interstitial then restart */}
            <Pressable
              style={[styles.playAgainBtn, { backgroundColor: "#ffd700" }]}
              onPress={() => showAd(startGame)}
            >
              <PlayCircle size={scale(16)} color="#0d0118" strokeWidth={2.5} />
              <Text style={styles.playAgainText}>  New Game</Text>
            </Pressable>

            {/* Back to Games → interstitial then navigate */}
            <Pressable
              style={styles.exitBtn}
              onPress={() => showAd(() => navigation.goBack())}
            >
              <ChevronLeft size={scale(13)} color="#9e86b8" />
              <Text style={styles.exitText}>Back to Games</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}

      <GameBannerAd bottom size="banner" />
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
        <Grid2x2 size={scale(14)} color="#ffd700" strokeWidth={2} style={{ marginRight: 5 }} />
        <Text style={[styles.headerTitle, { color: "#ffd700" }]}>2048</Text>
      </View>
      {showReset
        ? <Pressable style={styles.iconBtn} onPress={onReset}><RefreshCw size={scale(16)} color="#fff" strokeWidth={2.5} /></Pressable>
        : <View style={styles.iconBtn} />}
    </View>
  );
}

function ScoreBox({ label, value, color }) {
  return (
    <View style={[styles.scoreBox, { borderColor: color + "44" }]}>
      <Text style={styles.scoreBoxLabel}>{label}</Text>
      <Text style={[styles.scoreBoxVal, { color }]}>{value}</Text>
    </View>
  );
}

function RuleRow({ icon, text }) {
  return (
    <View style={styles.ruleRow}>
      {icon}
      <Text style={styles.ruleText}>{text}</Text>
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

// ─── Swipe Tutorial Overlay ───────────────────────────────────────────────────
const SWIPE_STEPS = [
  { label: "Swipe LEFT",  sub: "Tiles slide left",   dx: -1, dy:  0, color: "#00ffff" },
  { label: "Swipe RIGHT", sub: "Tiles slide right",  dx:  1, dy:  0, color: "#ffd700" },
  { label: "Swipe UP",    sub: "Tiles slide up",     dx:  0, dy: -1, color: "#4caf50" },
  { label: "Swipe DOWN",  sub: "Tiles slide down",   dx:  0, dy:  1, color: "#ff00ff" },
];

function SwipeTutorial({ onDismiss }) {
  const fingerX    = useRef(new Animated.Value(0)).current;
  const fingerY    = useRef(new Animated.Value(0)).current;
  const fingerOpac = useRef(new Animated.Value(0)).current;
  const trailScale = useRef(new Animated.Value(0)).current;
  const cardScale  = useRef(new Animated.Value(0.85)).current;
  const stepRef    = useRef(0);
  const [step, setStep] = useState(0);

  const DIST = scale(54);

  useEffect(() => {
    Animated.spring(cardScale, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }).start();
    runStep(0);
  }, []);

  const runStep = (idx) => {
    const s = SWIPE_STEPS[idx];
    stepRef.current = idx;
    setStep(idx);
    fingerX.setValue(0);
    fingerY.setValue(0);
    fingerOpac.setValue(0);
    trailScale.setValue(0);

    Animated.sequence([
      Animated.timing(fingerOpac, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(trailScale, { toValue: 1, tension: 120, friction: 6, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(fingerX, { toValue: s.dx * DIST, duration: 480, useNativeDriver: true }),
        Animated.timing(fingerY, { toValue: s.dy * DIST, duration: 480, useNativeDriver: true }),
      ]),
      Animated.delay(260),
      Animated.timing(fingerOpac, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.delay(180),
    ]).start(() => {
      const next = (idx + 1) % SWIPE_STEPS.length;
      runStep(next);
    });
  };

  const current = SWIPE_STEPS[step];

  return (
    <View style={tutStyles.backdrop}>
      <Animated.View style={[tutStyles.card, { transform: [{ scale: cardScale }] }]}>
        <Text style={tutStyles.title}>How to Play</Text>
        <Text style={tutStyles.subtitle}>Swipe the board in any direction</Text>

        <View style={tutStyles.demoArea}>
          <View style={tutStyles.gridHint}>
            {[0,1,2,3].map(r => (
              <View key={r} style={tutStyles.gridRow}>
                {[0,1,2,3].map(c => (
                  <View key={c} style={tutStyles.gridCell} />
                ))}
              </View>
            ))}
          </View>

          <Animated.View
            style={[
              tutStyles.trail,
              { borderColor: current.color, transform: [{ scale: trailScale }] },
            ]}
          />

          <Animated.Text
            style={[
              tutStyles.finger,
              { transform: [{ translateX: fingerX }, { translateY: fingerY }], opacity: fingerOpac },
            ]}
          >
            👆
          </Animated.Text>

          <Animated.Text
            style={[
              tutStyles.dirArrow,
              { color: current.color, opacity: fingerOpac },
              current.dx === -1 && { left: scale(10)  },
              current.dx ===  1 && { right: scale(10) },
              current.dy === -1 && { top: scale(10)   },
              current.dy ===  1 && { bottom: scale(10)},
            ]}
          >
            { current.dx === -1 ? "←"
            : current.dx ===  1 ? "→"
            : current.dy === -1 ? "↑"
            : "↓" }
          </Animated.Text>
        </View>

        <Text style={[tutStyles.stepLabel, { color: current.color }]}>{current.label}</Text>
        <Text style={tutStyles.stepSub}>{current.sub}</Text>

        <View style={tutStyles.dots}>
          {SWIPE_STEPS.map((_, i) => (
            <View
              key={i}
              style={[tutStyles.dot, i === step && { backgroundColor: current.color, width: scale(18) }]}
            />
          ))}
        </View>

        <View style={tutStyles.rulesList}>
          <Text style={tutStyles.rulesItem}>🟰  Same tiles merge into their sum</Text>
          <Text style={tutStyles.rulesItem}>🏆  Reach <Text style={{ color: "#ffd700", fontWeight: "900" }}>2048</Text> to win!</Text>
          <Text style={tutStyles.rulesItem}>♾️   Keep going beyond 2048</Text>
        </View>

        <Pressable style={[tutStyles.gotItBtn, { backgroundColor: current.color }]} onPress={onDismiss}>
          <Text style={tutStyles.gotItText}>Got it!  Let's Play 🎮</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const tutStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.88)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 200,
  },
  card: {
    backgroundColor: "#100520",
    borderRadius: scale(24),
    borderWidth: 1.5,
    borderColor: "#ffd70033",
    padding: scale(22),
    alignItems: "center",
    width: SCREEN_WIDTH - scale(40),
  },
  title: {
    fontSize: scale(22), fontWeight: "900", color: "#ffd700",
    letterSpacing: 2, marginBottom: scale(4),
    textShadowColor: "#ffd70066", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8,
  },
  subtitle: { fontSize: scale(12), color: "#9e86b8", marginBottom: scale(18), fontWeight: "500" },
  demoArea: {
    width: scale(140), height: scale(140),
    backgroundColor: "#0e0222",
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: "#ffffff0a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(16),
    overflow: "hidden",
  },
  gridHint: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, padding: scale(8), gap: scale(3) },
  gridRow:  { flex: 1, flexDirection: "row", gap: scale(3) },
  gridCell: { flex: 1, backgroundColor: "#1a0b2e", borderRadius: scale(4) },
  trail: {
    position: "absolute",
    width: scale(44), height: scale(44),
    borderRadius: scale(22),
    borderWidth: 2,
    backgroundColor: "transparent",
    opacity: 0.4,
  },
  finger:   { position: "absolute", fontSize: scale(28), zIndex: 5 },
  dirArrow: { position: "absolute", fontSize: scale(22), fontWeight: "900", zIndex: 4 },
  stepLabel: { fontSize: scale(18), fontWeight: "900", letterSpacing: 1, marginBottom: scale(2) },
  stepSub:   { fontSize: scale(12), color: "#9e86b8", marginBottom: scale(14), fontWeight: "500" },
  dots: { flexDirection: "row", gap: scale(6), marginBottom: scale(16) },
  dot: {
    width: scale(8), height: scale(8), borderRadius: scale(4),
    backgroundColor: "#2a1a4e",
  },
  rulesList: {
    backgroundColor: "#160728", borderRadius: scale(12), padding: scale(12),
    width: "100%", marginBottom: scale(18), gap: scale(6),
    borderWidth: 1, borderColor: "#ffffff0e",
  },
  rulesItem: { fontSize: scale(11), color: "#c9b8e8", fontWeight: "500", lineHeight: scale(17) },
  gotItBtn: {
    paddingHorizontal: scale(32), paddingVertical: scale(13),
    borderRadius: scale(25), elevation: 6,
  },
  gotItText: { fontSize: scale(14), fontWeight: "900", color: "#0d0118" },
});

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0118", alignItems: "center" },

  header: { width: "100%", flexDirection: "row", alignItems: "center", paddingHorizontal: scale(16), paddingTop: scale(12), paddingBottom: scale(8) },
  iconBtn: { width: scale(38), height: scale(38), borderRadius: scale(12), backgroundColor: "#1f0a3a", borderWidth: 1, borderColor: "#ffffff18", justifyContent: "center", alignItems: "center", elevation: 3 },
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: scale(20), fontWeight: "900", letterSpacing: 3 },

  startScreen: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: scale(24) },
  bigIconRing: { width: scale(100), height: scale(100), borderRadius: scale(50), backgroundColor: "#1f0a3a", borderWidth: 2, justifyContent: "center", alignItems: "center", marginBottom: scale(16), elevation: 5 },
  gameTitle: { fontSize: scale(42), fontWeight: "900", letterSpacing: 4, marginBottom: scale(8), textShadowColor: "#ffd70088", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12 },
  gameSubtitle: { fontSize: scale(13), color: "#9e86b8", textAlign: "center", lineHeight: scale(20), marginBottom: scale(18) },

  demoGrid: { flexDirection: "row", flexWrap: "wrap", width: scale(180), gap: scale(4), marginBottom: scale(18), justifyContent: "center" },
  demoTile: { width: scale(40), height: scale(40), borderRadius: scale(6), justifyContent: "center", alignItems: "center" },
  demoTileText: { fontSize: scale(9), fontWeight: "900" },

  rulesBox: { backgroundColor: "#160728", borderRadius: scale(14), padding: scale(14), minWidth: "100%", marginBottom: scale(24), gap: scale(10), borderWidth: 1, borderColor: "#ffffff10" },
  ruleRow:  { flexDirection: "row", alignItems: "center", gap: scale(8) },
  ruleText: { fontSize: scale(12), color: "#c9b8e8", fontWeight: "500", flex: 1 },
  startBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: scale(36), paddingVertical: scale(14), borderRadius: scale(25), elevation: 6 },
  startBtnText: { fontSize: scale(15), fontWeight: "900", color: "#0d0118" },

  scoreRow: { flexDirection: "row", gap: scale(8), paddingHorizontal: scale(16), marginBottom: scale(8), width: "100%" },
  scoreBox: { flex: 1, backgroundColor: "#160728", borderRadius: scale(12), borderWidth: 1, paddingVertical: scale(8), alignItems: "center" },
  scoreBoxLabel: { fontSize: scale(8), color: "#9e86b8", fontWeight: "800", letterSpacing: 1 },
  scoreBoxVal: { fontSize: scale(16), fontWeight: "900", marginTop: scale(2) },
  highTileBox: { flex: 1, backgroundColor: "#160728", borderRadius: scale(12), borderWidth: 1.5, paddingVertical: scale(8), alignItems: "center" },
  highTileLabel: { fontSize: scale(8), color: "#9e86b8", fontWeight: "800", letterSpacing: 1 },
  highTileVal: { fontSize: scale(16), fontWeight: "900", marginTop: scale(2) },

  hintText: { fontSize: scale(11), color: "#ffffff22", fontWeight: "600", textAlign: "center", marginBottom: scale(10), letterSpacing: 0.5 },

  board: {
    width: SCREEN_WIDTH - scale(32),
    backgroundColor: "#0e0222",
    borderRadius: scale(16),
    padding: BOARD_PAD,
    borderWidth: 1,
    borderColor: "#ffffff0a",
    gap: GAP,
    position: "relative",
    elevation: 6,
  },
  boardRow: { flexDirection: "row", gap: GAP },

  emptyTile: { width: TILE_SIZE, height: TILE_SIZE, borderRadius: scale(8), backgroundColor: "#1a0b2e" },
  tile: { width: TILE_SIZE, height: TILE_SIZE, borderRadius: scale(8), justifyContent: "center", alignItems: "center", elevation: 3 },
  tile2048: { elevation: 8 },
  tileText: { fontWeight: "900", letterSpacing: 0.5 },

  scorePop: { position: "absolute", top: BOARD_PAD + TILE_SIZE / 2, left: SCREEN_WIDTH / 2 - scale(24), fontSize: scale(16), fontWeight: "900", color: "#ffd700", zIndex: 10, textShadowColor: "#ffd70088", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.92)", justifyContent: "center", alignItems: "center", zIndex: 99 },
  winCard: { backgroundColor: "#100520", borderRadius: scale(24), borderWidth: 1.5, padding: scale(24), alignItems: "center", width: SCREEN_WIDTH - scale(48), elevation: 12 },
  trophyRing: { width: scale(76), height: scale(76), borderRadius: scale(38), backgroundColor: "#1f0a3a", borderWidth: 2, justifyContent: "center", alignItems: "center", marginBottom: scale(12), elevation: 6 },
  winTitle: { fontSize: scale(28), fontWeight: "900", letterSpacing: 3, marginBottom: scale(6) },
  winEmoji: { fontSize: scale(28), marginBottom: scale(4) },
  perfBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#1a0b2e", borderRadius: scale(20), paddingHorizontal: scale(14), paddingVertical: scale(6), marginBottom: scale(16), borderWidth: 1, borderColor: "#ffffff14" },
  winPerf: { fontSize: scale(14), fontWeight: "800" },
  winStatsRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#0d0118", borderRadius: scale(14), paddingVertical: scale(12), paddingHorizontal: scale(16), marginBottom: scale(16), gap: scale(16), borderWidth: 1, borderColor: "#ffffff0e", width: "100%", justifyContent: "center" },
  winStat:        { alignItems: "center", gap: scale(3) },
  winStatValue:   { fontSize: scale(16), fontWeight: "900" },
  winStatLabel:   { fontSize: scale(9), color: "#9e86b8", fontWeight: "600" },
  winStatDivider: { width: 1, height: scale(36), backgroundColor: "#ffffff14" },
  keepGoingBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#1f0a3a", borderWidth: 1.5, borderColor: "#ffd70066", paddingHorizontal: scale(28), paddingVertical: scale(11), borderRadius: scale(25), marginBottom: scale(10), elevation: 4 },
  keepGoingText: { fontSize: scale(13), fontWeight: "800", color: "#ffd700" },
  playAgainBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: scale(30), paddingVertical: scale(12), borderRadius: scale(25), marginBottom: scale(10), elevation: 5 },
  playAgainText: { fontSize: scale(14), fontWeight: "900", color: "#0d0118" },
  exitBtn: { flexDirection: "row", alignItems: "center", paddingVertical: scale(6) },
  exitText: { fontSize: scale(12), color: "#9e86b8", fontWeight: "600" },
});