// ─────────────────────────────────────────────────────────────────────────────
//  MemoryCardGame.js  –  React Native CLI  (with Levels)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
  StatusBar,
  SafeAreaView,
  Platform,
  Vibration,
} from "react-native";
import { scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  RefreshCw,
  Trophy,
  Clock,
  Target,
  Layers,
  Star,
  Flame,
  ThumbsUp,
  Smile,
  Dumbbell,
  PlayCircle,
  ChevronLeft,
  Zap,
  Shield,
  ChevronRight,
  PartyPopper,
} from "lucide-react-native";
import GameBannerAd from "../../Components/GameBannerAd";
import { useInterstitialAd } from "../../Components/Useinterstitialad";

// ─── Screen size ──────────────────────────────────────────────────────────────
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_SIZE = 4;
const CARD_MARGIN = scale(5);
const CARD_SIZE =
  (SCREEN_WIDTH - scale(40) - CARD_MARGIN * GRID_SIZE * 2) / GRID_SIZE;

// ─── Level Config ─────────────────────────────────────────────────────────────
//  accentColor  – drives header title, progress bar, card front border, stat highlights
//  bgTint       – subtle board background tint
//  flipDelay    – ms before unmatched cards flip back (decreases = harder)
// ─────────────────────────────────────────────────────────────────────────────
const LEVELS = [
  {
    level: 1,
    name: "Fruits",
    icon: "🍎",
    cards: ["🍎", "🍌", "🍒", "🍇", "🍉", "🥝", "🍍", "🍓"],
    accentColor: "#00ffff",
    bgTint: "#001f2a",
    flipDelay: 1000,
  },
  {
    level: 2,
    name: "Animals",
    icon: "🐶",
    cards: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
    accentColor: "#ff9800",
    bgTint: "#1f0e00",
    flipDelay: 900,
  },
  {
    level: 3,
    name: "Space",
    icon: "🚀",
    cards: ["🚀", "🌙", "⭐", "🪐", "☄️", "🌍", "🛸", "👽"],
    accentColor: "#b84fff",
    bgTint: "#12002a",
    flipDelay: 800,
  },
  {
    level: 4,
    name: "Sports",
    icon: "⚽",
    cards: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱"],
    accentColor: "#4caf50",
    bgTint: "#001a04",
    flipDelay: 700,
  },
  {
    level: 5,
    name: "Vehicles",
    icon: "🚗",
    cards: ["🚗", "✈️", "🚀", "🚢", "🚂", "🏍️", "🚁", "⛵"],
    accentColor: "#ff4081",
    bgTint: "#1f0010",
    flipDelay: 600,
  },
  {
    level: 6,
    name: "Food",
    icon: "🍕",
    cards: ["🍕", "🍔", "🌮", "🍜", "🍣", "🍩", "🍦", "🧁"],
    accentColor: "#ffd700",
    bgTint: "#1f1600",
    flipDelay: 550,
  },
  {
    level: 7,
    name: "Weather",
    icon: "⚡",
    cards: ["⚡", "🌈", "❄️", "🌊", "🔥", "🌪️", "☀️", "🌙"],
    accentColor: "#00e5ff",
    bgTint: "#001418",
    flipDelay: 500,
  },
  {
    level: 8,
    name: "Gems",
    icon: "💎",
    cards: ["💎", "💰", "🏆", "👑", "🔮", "⚗️", "🗝️", "🧿"],
    accentColor: "#e040fb",
    bgTint: "#1a001f",
    flipDelay: 450,
  },
];

// ─── Vibration Patterns ───────────────────────────────────────────────────────
const VIBRATION_PATTERNS = {
  flip:    [0, 30],
  match:   [0, 40, 60, 40],
  noMatch: [0, 80, 40, 80],
  win:     [0, 60, 40, 60, 40, 100, 40, 60],
};

function useHaptics() {
  return useCallback((key) => {
    const pattern = VIBRATION_PATTERNS[key];
    if (!pattern) return;
    Vibration.vibrate(pattern);
  }, []);
}

// ─── Performance config ───────────────────────────────────────────────────────
const PERF_CONFIG = [
  { maxAttempts: 8,        label: "Flawless!",   emoji: "🌟", color: "#ffd700", Icon: Star },
  { maxAttempts: 12,       label: "Excellent!",  emoji: "🔥", color: "#00ffff", Icon: Flame },
  { maxAttempts: 16,       label: "Very Good!",  emoji: "👍", color: "#4caf50", Icon: ThumbsUp },
  { maxAttempts: 20,       label: "Good Job!",   emoji: "😊", color: "#ff9800", Icon: Smile },
  { maxAttempts: Infinity, label: "Keep Going!", emoji: "💪", color: "#ff4081", Icon: Dumbbell },
];

function evaluatePerformance(total) {
  return PERF_CONFIG.find((p) => total <= p.maxAttempts);
}

// ─── Card Component ───────────────────────────────────────────────────────────
function Card({ card, isFlipped, isMatched, onPress, accentColor }) {
  const flipAnim  = useRef(new Animated.Value(isFlipped ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 1 : 0,
      tension: 80,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  useEffect(() => {
    if (isMatched) {
      Animated.sequence([
        Animated.spring(scaleAnim, { toValue: 1.18, tension: 200, friction: 5, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1,    tension: 100, friction: 6, useNativeDriver: true }),
      ]).start(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(shineAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
            Animated.timing(shineAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
          ])
        ).start();
      });
    }
  }, [isMatched]);

  const frontRotate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg",   "180deg"] });
  const backRotate  = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ["180deg", "360deg"] });
  const frontOpacity = flipAnim.interpolate({ inputRange: [0.4, 0.5], outputRange: [1, 0] });
  const backOpacity  = flipAnim.interpolate({ inputRange: [0.4, 0.5], outputRange: [0, 1] });
  const matchedBorderOpacity = shineAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

  return (
    <Pressable onPress={onPress} disabled={isFlipped || isMatched}>
      <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>

        {/* Back face */}
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            { transform: [{ rotateY: frontRotate }], opacity: frontOpacity },
          ]}
        >
          <Shield size={scale(22)} color="#7b2fff" strokeWidth={1.5} />
          <View style={styles.cardBackPattern}>
            {[...Array(9)].map((_, i) => (
              <View key={i} style={styles.patternDot} />
            ))}
          </View>
        </Animated.View>

        {/* Front face */}
        <Animated.View
          style={[
            styles.card,
            styles.cardFront,
            isMatched && styles.cardMatched,
            { borderColor: isMatched ? "#4caf50" : accentColor },
            { transform: [{ rotateY: backRotate }], opacity: backOpacity, position: "absolute" },
          ]}
        >
          <Text style={styles.cardEmoji}>{card.value}</Text>
          {isMatched && (
            <Animated.View style={[styles.matchGlow, { opacity: matchedBorderOpacity }]} />
          )}
          {isMatched && (
            <View style={styles.matchCheckBadge}>
              <Zap size={scale(9)} color="#0d0118" fill="#0d0118" />
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

// ─── StatBox ──────────────────────────────────────────────────────────────────
function StatBox({ icon: Icon, label, value, color }) {
  return (
    <View style={[styles.statBox, { borderColor: color + "44" }]}>
      <Icon size={scale(12)} color={color} strokeWidth={2.5} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Level Badge (dots row) ───────────────────────────────────────────────────
function LevelDots({ currentIndex, total, accentColor }) {
  return (
    <View style={styles.levelDotsRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.levelDot,
            i < currentIndex  && { backgroundColor: accentColor + "99", width: scale(6) },
            i === currentIndex && { backgroundColor: accentColor, width: scale(14) },
            i > currentIndex  && { backgroundColor: "#ffffff22", width: scale(6) },
          ]}
        />
      ))}
    </View>
  );
} 

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function MemoryCardGame() {
  const navigation  = useNavigation();
  const playSound   = useHaptics();
  const { showAd }  = useInterstitialAd();
 
  // ── Level state ─────────────────────────────────────────────────────────────
  const [levelIndex,   setLevelIndex]   = useState(0);
  const [allComplete,  setAllComplete]  = useState(false);

  // ── Game state ──────────────────────────────────────────────────────────────
  const [cards,       setCards]       = useState([]);
  const [flipped,     setFlipped]     = useState([]);
  const [matched,     setMatched]     = useState([]);
  const [attempts,    setAttempts]    = useState(0);
  const [gameOver,    setGameOver]    = useState(false);
  const [performance, setPerformance] = useState(null);
  const [timer,       setTimer]       = useState(0);
  const [isLocked,    setIsLocked]    = useState(false);

  const timerRef    = useRef(null);
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const boardAnim   = useRef(new Animated.Value(0)).current;
  const headerAnim  = useRef(new Animated.Value(0)).current;
  const levelAnim   = useRef(new Animated.Value(0)).current;

  const currentLevel = LEVELS[levelIndex];
  const isLastLevel  = levelIndex === LEVELS.length - 1;

  // ── Init ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    startLevel(0);
    Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    return () => clearInterval(timerRef.current);
  }, []);

  // ── Timer ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!gameOver && cards.length > 0) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gameOver, cards.length]);

  // ── Board entrance animation ─────────────────────────────────────────────────
  useEffect(() => {
    if (cards.length > 0) {
      boardAnim.setValue(0);
      Animated.spring(boardAnim, {
        toValue: 1, tension: 50, friction: 9, useNativeDriver: true,
      }).start();
    }
  }, [cards.length]);

  // ── Start a specific level ────────────────────────────────────────────────
  const startLevel = (idx) => {
    clearInterval(timerRef.current);
    const lvl = LEVELS[idx];
    const deck = [...lvl.cards, ...lvl.cards]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({ id: index, value }));

    setLevelIndex(idx);
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setAttempts(0);
    setTimer(0);
    setGameOver(false);
    setPerformance(null);
    setIsLocked(false);
    setAllComplete(false);
    overlayAnim.setValue(0);

    // Flash the level label on transition
    levelAnim.setValue(0);
    Animated.spring(levelAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }).start();
  };

  // ── Replay same level ──────────────────────────────────────────────────────
  const replayLevel = () => startLevel(levelIndex);

  // ── Advance to next level (called AFTER ad dismisses) ──────────────────────
  const goNextLevel = () => {
    if (isLastLevel) {
      setAllComplete(true);
    } else {
      startLevel(levelIndex + 1);
    }
  };

  // ── Flip handler ──────────────────────────────────────────────────────────
  const handleFlip = (index) => {
    if (
      isLocked ||
      flipped.includes(index) ||
      matched.includes(index) ||
      flipped.length >= 2 ||
      gameOver
    ) return;

    playSound("flip");
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      const [a, b] = newFlipped;
      if (cards[a].value === cards[b].value) {
        playSound("match");
        setTimeout(() => {
          setMatched((prev) => {
            const updated = [...prev, a, b];
            if (updated.length === cards.length) {
              setGameOver(true);
              const perf = evaluatePerformance(newAttempts);
              setPerformance(perf);
              setTimeout(() => playSound("win"), 200);
              Animated.spring(overlayAnim, {
                toValue: 1, tension: 50, friction: 9, useNativeDriver: true,
              }).start();
            }
            return updated;
          });
          setFlipped([]);
          setIsLocked(false);
        }, 500);
      } else {
        playSound("noMatch");
        setTimeout(() => {
          setFlipped([]);
          setIsLocked(false);
        }, currentLevel.flipDelay); // ← difficulty: faster on higher levels
      }
    }
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const pairsFound  = matched.length / 2;
  const totalPairs  = currentLevel.cards.length;
  const progressPct = (pairsFound / totalPairs) * 100;
  const accent      = currentLevel.accentColor;

  // ── All levels complete screen ─────────────────────────────────────────────
  if (allComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
        <View style={styles.allCompleteContainer}>
          <Text style={styles.allCompleteEmoji}>🏆</Text>
          <Text style={styles.allCompleteTitle}>All Levels{"\n"}Complete!</Text>
          <Text style={styles.allCompleteSubtitle}>
            You mastered all {LEVELS.length} levels!
          </Text>
          <Pressable
            style={[styles.playAgainBtn, { backgroundColor: "#ffd700" }]}
            onPress={() => startLevel(0)}
          >
            <PlayCircle size={scale(17)} color="#0d0118" strokeWidth={2.5} />
            <Text style={styles.playAgainText}>  Play Again</Text>
          </Pressable>
          <Pressable style={styles.exitBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={scale(14)} color="#9e86b8" strokeWidth={2.5} />
            <Text style={styles.exitText}>Back to Games</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main game render ────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentLevel.bgTint }]}>
      <StatusBar barStyle="light-content" backgroundColor={currentLevel.bgTint} />

      {/* ── Header ── */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [{
              translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }),
            }],
          },
        ]}
      >
        <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={scale(18)} color="#ffffff" strokeWidth={2.5} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Animated.View
            style={{
              opacity: levelAnim,
              transform: [{
                scale: levelAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }),
              }],
              alignItems: "center",
            }}
          >
            <Text style={[styles.title, { color: accent }]}>
              {currentLevel.icon}  {currentLevel.name}
            </Text>
            <Text style={[styles.levelBadge, { color: accent + "bb" }]}>
              LEVEL {currentLevel.level} of {LEVELS.length}
            </Text>
          </Animated.View>
        </View>

        <Pressable style={styles.iconBtn} onPress={replayLevel}>
          <RefreshCw size={scale(17)} color="#ffffff" strokeWidth={2.5} />
        </Pressable>
      </Animated.View>

      {/* ── Level progress dots ── */}
      <LevelDots
        currentIndex={levelIndex}
        total={LEVELS.length}
        accentColor={accent}
      />

      {/* ── Stats Row ── */}
      <View style={styles.statsRow}>
        <StatBox icon={Target} label="Attempts" value={attempts}                     color={accent} />
        <StatBox icon={Layers} label="Pairs"    value={`${pairsFound}/${totalPairs}`} color="#ff00ff" />
        <StatBox icon={Clock}  label="Time"     value={formatTime(timer)}             color="#ffd700" />
      </View>

      {/* ── Progress Bar ── */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: accent }]} />
        {progressPct > 5 && (
          <Text style={styles.progressLabel}>{Math.round(progressPct)}%</Text>
        )}
      </View>

      {/* ── Board ── */}
      <Animated.View
        style={[
          styles.board,
          {
            opacity: boardAnim,
            transform: [{
              scale: boardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }),
            }],
          },
        ]}
      >
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            isFlipped={flipped.includes(index) || matched.includes(index)}
            isMatched={matched.includes(index)}
            onPress={() => handleFlip(index)}
            accentColor={accent}
          />
        ))}
      </Animated.View>

      {/* ── Win Overlay ── */}
      {gameOver && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayAnim,
              transform: [{
                scale: overlayAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }),
              }],
            },
          ]}
        >
          <View style={[styles.winCard, { borderColor: accent + "55" }]}>

            {/* Trophy */}
            <View style={[styles.trophyRing, { borderColor: accent + "55" }]}>
              <Trophy size={scale(44)} color={accent} fill={accent + "22"} strokeWidth={1.5} />
            </View>

            {/* Level cleared label */}
            <View style={[styles.levelClearedBadge, { backgroundColor: accent + "22", borderColor: accent + "44" }]}>
              <Text style={[styles.levelClearedText, { color: accent }]}>
                LEVEL {currentLevel.level} CLEARED  {currentLevel.icon}
              </Text>
            </View>

            <Text style={[styles.winTitle, { color: accent, textShadowColor: accent + "88" }]}>
              {isLastLevel ? "YOU WIN! 🎉" : "LEVEL UP!"}
            </Text>

            {performance && (
              <>
                <Text style={styles.winEmoji}>{performance.emoji}</Text>
                <View style={styles.perfBadge}>
                  <performance.Icon size={scale(13)} color={performance.color} strokeWidth={2.5} />
                  <Text style={[styles.winPerf, { color: performance.color }]}>
                    {"  "}{performance.label}
                  </Text>
                </View>
              </>
            )}

            {/* Win stats */}
            <View style={styles.winStatsRow}>
              <View style={styles.winStat}>
                <Target size={scale(16)} color={accent} strokeWidth={2} />
                <Text style={styles.winStatValue}>{attempts}</Text>
                <Text style={styles.winStatLabel}>Attempts</Text>
              </View>
              <View style={styles.winStatDivider} />
              <View style={styles.winStat}>
                <Clock size={scale(16)} color="#ffd700" strokeWidth={2} />
                <Text style={styles.winStatValue}>{formatTime(timer)}</Text>
                <Text style={styles.winStatLabel}>Time</Text>
              </View>
              <View style={styles.winStatDivider} />
              <View style={styles.winStat}>
                <Star size={scale(16)} color="#ff00ff" strokeWidth={2} />
                <Text style={styles.winStatValue}>{totalPairs}</Text>
                <Text style={styles.winStatLabel}>Pairs</Text>
              </View>
            </View>

            {/* ── Buttons ── */}

            {/* Next Level / Finish — shows interstitial then advances */}
            <Pressable
              style={({ pressed }) => [
                styles.playAgainBtn,
                { backgroundColor: accent },
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => showAd(goNextLevel)}
            >
              {isLastLevel ? (
                <>
                  <Trophy size={scale(17)} color="#0d0118" strokeWidth={2.5} />
                  <Text style={styles.playAgainText}>  Finish!</Text>
                </>
              ) : (
                <>
                  <ChevronRight size={scale(17)} color="#0d0118" strokeWidth={2.5} />
                  <Text style={styles.playAgainText}>  Next Level</Text>
                </>
              )}
            </Pressable>

            {/* Replay same level — no ad */}
            <Pressable
              style={({ pressed }) => [styles.replayBtn, pressed && { opacity: 0.7 }]}
              onPress={replayLevel}
            >
              <RefreshCw size={scale(13)} color="#9e86b8" strokeWidth={2.5} />
              <Text style={styles.replayText}>  Replay Level</Text>
            </Pressable>

            {/* Back to games — shows interstitial then navigates */}
            <Pressable
              style={({ pressed }) => [styles.exitBtn, pressed && { opacity: 0.6 }]}
              onPress={() => showAd(() => navigation.goBack())}
            >
              <ChevronLeft size={scale(14)} color="#9e86b8" strokeWidth={2.5} />
              <Text style={styles.exitText}>Back to Games</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}

      <GameBannerAd bottom size="adaptive" />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
    paddingBottom: scale(4),
  },
  iconBtn: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(12),
    backgroundColor: "#1f0a3a",
    borderWidth: 1,
    borderColor: "#ffffff18",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: scale(16),
    fontWeight: "900",
    letterSpacing: 1.2,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  levelBadge: {
    fontSize: scale(9),
    fontWeight: "700",
    letterSpacing: 1.5,
    marginTop: scale(2),
  },

  // ── Level dots ───────────────────────────────────────────────────────────────
  levelDotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    marginVertical: scale(6),
  },
  levelDot: {
    height: scale(6),
    borderRadius: 99,
  },

  // ── Stats ────────────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: "row",
    gap: scale(10),
    marginBottom: scale(10),
    paddingHorizontal: scale(16),
    width: "100%",
  },
  statBox: {
    flex: 1,
    backgroundColor: "#160728",
    borderRadius: scale(12),
    borderWidth: 1,
    paddingVertical: scale(8),
    alignItems: "center",
    gap: scale(2),
    elevation: 3,
  },
  statValue: {
    fontSize: scale(14),
    fontWeight: "900",
    letterSpacing: 0.5,
    marginTop: scale(2),
  },
  statLabel: {
    fontSize: scale(9),
    color: "#9e86b8",
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  // ── Progress ─────────────────────────────────────────────────────────────────
  progressBg: {
    width: SCREEN_WIDTH - scale(32),
    height: scale(6),
    backgroundColor: "#ffffff14",
    borderRadius: 99,
    marginBottom: scale(12),
    overflow: "hidden",
    justifyContent: "center",
  },
  progressFill: {
    height: "100%",
    borderRadius: 99,
  },
  progressLabel: {
    position: "absolute",
    right: scale(6),
    fontSize: scale(7),
    color: "#ffffff88",
    fontWeight: "700",
  },

  // ── Board ────────────────────────────────────────────────────────────────────
  board: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: scale(10),
    gap: CARD_MARGIN,
  },

  // ── Card ─────────────────────────────────────────────────────────────────────
  cardWrapper: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    margin: CARD_MARGIN,
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: scale(12),
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
  },
  cardBack: {
    backgroundColor: "#1a0b2e",
    borderWidth: 1.5,
    borderColor: "#4a1a7a",
    elevation: 4,
  },
  cardBackPattern: {
    position: "absolute",
    bottom: scale(5),
    right: scale(5),
    flexDirection: "row",
    flexWrap: "wrap",
    width: scale(12),
    gap: scale(2),
  },
  patternDot: {
    width: scale(2),
    height: scale(2),
    borderRadius: 99,
    backgroundColor: "#6a2faa44",
  },
  cardFront: {
    backgroundColor: "#0a2540",
    borderWidth: 1.5,
    elevation: 4,
  },
  cardMatched: {
    backgroundColor: "#0a2e1a",
    elevation: 6,
  },
  cardEmoji: {
    fontSize: scale(26),
  },
  matchGlow: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: scale(12),
    backgroundColor: "#4caf5033",
  },
  matchCheckBadge: {
    position: "absolute",
    top: scale(4),
    right: scale(4),
    width: scale(14),
    height: scale(14),
    borderRadius: 99,
    backgroundColor: "#4caf50",
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Win Overlay ───────────────────────────────────────────────────────────────
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.93)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
  },
  winCard: {
    backgroundColor: "#100520",
    borderRadius: scale(24),
    borderWidth: 1.5,
    padding: scale(24),
    alignItems: "center",
    width: SCREEN_WIDTH - scale(48),
    elevation: 12,
  },
  trophyRing: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: "#1f0a3a",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(12),
    elevation: 8,
  },
  levelClearedBadge: {
    borderRadius: scale(20),
    paddingHorizontal: scale(14),
    paddingVertical: scale(5),
    borderWidth: 1,
    marginBottom: scale(8),
  },
  levelClearedText: {
    fontSize: scale(10),
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  winTitle: {
    fontSize: scale(26),
    fontWeight: "900",
    letterSpacing: 3,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    marginBottom: scale(4),
  },
  winEmoji: {
    fontSize: scale(28),
    marginBottom: scale(4),
  },
  perfBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a0b2e",
    borderRadius: scale(20),
    paddingHorizontal: scale(14),
    paddingVertical: scale(5),
    marginBottom: scale(16),
    borderWidth: 1,
    borderColor: "#ffffff14",
  },
  winPerf: {
    fontSize: scale(14),
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  winStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d0118",
    borderRadius: scale(16),
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
    marginBottom: scale(18),
    gap: scale(20),
    borderWidth: 1,
    borderColor: "#ffffff0e",
    width: "100%",
    justifyContent: "center",
  },
  winStat: {
    alignItems: "center",
    gap: scale(3),
  },
  winStatValue: {
    fontSize: scale(18),
    fontWeight: "900",
    color: "#ffffff",
    marginTop: scale(2),
  },
  winStatLabel: {
    fontSize: scale(9),
    color: "#9e86b8",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  winStatDivider: {
    width: 1,
    height: scale(40),
    backgroundColor: "#ffffff14",
  },
  playAgainBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(32),
    paddingVertical: scale(13),
    borderRadius: scale(25),
    marginBottom: scale(10),
    elevation: 6,
  },
  playAgainText: {
    fontSize: scale(14),
    fontWeight: "900",
    color: "#0d0118",
    letterSpacing: 0.5,
  },
  replayBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(6),
    marginBottom: scale(4),
  },
  replayText: {
    fontSize: scale(12),
    color: "#9e86b8",
    fontWeight: "600",
  },
  exitBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(6),
    gap: scale(2),
  },
  exitText: {
    fontSize: scale(13),
    color: "#9e86b8",
    fontWeight: "600",
  },

  // ── All Complete screen ───────────────────────────────────────────────────────
  allCompleteContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(32),
  },
  allCompleteEmoji: {
    fontSize: scale(72),
    marginBottom: scale(16),
  },
  allCompleteTitle: {
    fontSize: scale(32),
    fontWeight: "900",
    color: "#ffd700",
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: scale(12),
    textShadowColor: "#ffd70088",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  allCompleteSubtitle: {
    fontSize: scale(14),
    color: "#9e86b8",
    textAlign: "center",
    marginBottom: scale(32),
    lineHeight: scale(22),
  },
});