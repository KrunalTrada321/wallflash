// ─────────────────────────────────────────────────────────────────────────────
//  MemoryCardGame.js  –  React Native CLI
//
//  Dependencies to install:
//    npm install lucide-react-native react-native-svg
//    npx pod-install   (iOS only)
//
//  Sound feedback uses React Native's built-in Vibration API — no extra
//  packages or audio files needed.
//
//  NOTE: On iOS, Vibration only works on physical devices (not simulator).
//        On Android, add <uses-permission android:name="android.permission.VIBRATE"/>
//        to AndroidManifest.xml (it's usually there by default).
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
} from "lucide-react-native";
import SqareAd from "../../Components/SqareAd";
import ShortBanner from "../../Components/ShortBanner";
import GameBannerAd from "../../Components/GameBannerAd";

// ─── Constants ────────────────────────────────────────────────────────────────
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_SIZE = 4;
const CARD_MARGIN = scale(5);
const CARD_SIZE =
  (SCREEN_WIDTH - scale(40) - CARD_MARGIN * GRID_SIZE * 2) / GRID_SIZE;

const CARD_VALUES = ["🍎", "🍌", "🍒", "🍇", "🍉", "🥝", "🍍", "🍓"];

// ─── Vibration Patterns ───────────────────────────────────────────────────────
//  Each pattern is [wait, vibrate, wait, vibrate, ...]  (ms)
//  Android: full pattern support
//  iOS:     only a single short pulse (ignore pattern, just calls Vibration.vibrate())
const VIBRATION_PATTERNS = {
  flip: Platform.OS === "android" ? [0, 30] : 30,   // quick light tick
  match: Platform.OS === "android" ? [0, 40, 60, 40] : 50,   // double-tap "yes!"
  noMatch: Platform.OS === "android" ? [0, 80, 40, 80] : 80,   // two heavy pulses "no"
  win: Platform.OS === "android" ? [0, 60, 40, 60, 40, 100, 40, 60] : 100, // celebratory rumble
};

// ─── useHaptics hook ──────────────────────────────────────────────────────────
function useHaptics() {
  return useCallback((key) => {
    const pattern = VIBRATION_PATTERNS[key];
    if (!pattern) return;
    if (Array.isArray(pattern)) {
      Vibration.vibrate(pattern);
    } else {
      Vibration.vibrate(pattern);
    }
  }, []);
}

// ─── Card Component ───────────────────────────────────────────────────────────
function Card({ card, isFlipped, isMatched, onPress }) {
  const flipAnim = useRef(new Animated.Value(isFlipped ? 1 : 0)).current;
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
        Animated.spring(scaleAnim, {
          toValue: 1.18,
          tension: 200,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(shineAnim, {
              toValue: 1,
              duration: 1200,
              useNativeDriver: true,
            }),
            Animated.timing(shineAnim, {
              toValue: 0,
              duration: 1200,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    }
  }, [isMatched]);

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0.4, 0.5],
    outputRange: [1, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0.4, 0.5],
    outputRange: [0, 1],
  });
  const matchedBorderOpacity = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <Pressable onPress={onPress} disabled={isFlipped || isMatched}>
      <Animated.View
        style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}
      >
        {/* Back face */}
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            {
              transform: [{ rotateY: frontRotate }],
              opacity: frontOpacity,
            },
          ]}
        >
          <Shield
            size={scale(22)}
            color="#7b2fff"
            strokeWidth={1.5}
          />
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
            {
              transform: [{ rotateY: backRotate }],
              opacity: backOpacity,
              position: "absolute",
            },
          ]}
        >
          <Text style={styles.cardEmoji}>{card.value}</Text>
          {isMatched && (
            <Animated.View
              style={[styles.matchGlow, { opacity: matchedBorderOpacity }]}
            />
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

// ─── Performance config ───────────────────────────────────────────────────────
const PERF_CONFIG = [
  { maxAttempts: 8, label: "Flawless!", emoji: "🌟", color: "#ffd700", Icon: Star },
  { maxAttempts: 12, label: "Excellent!", emoji: "🔥", color: "#00ffff", Icon: Flame },
  { maxAttempts: 16, label: "Very Good!", emoji: "👍", color: "#4caf50", Icon: ThumbsUp },
  { maxAttempts: 20, label: "Good Job!", emoji: "😊", color: "#ff9800", Icon: Smile },
  { maxAttempts: Infinity, label: "Keep Going!", emoji: "💪", color: "#ff4081", Icon: Dumbbell },
];

function evaluatePerformance(total) {
  return PERF_CONFIG.find((p) => total <= p.maxAttempts);
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function MemoryCardGame() {
  const navigation = useNavigation();
  const playSound = useHaptics();

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [performance, setPerformance] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const timerRef = useRef(null);
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const boardAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    resetGame();
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    return () => clearInterval(timerRef.current);
  }, []);

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!gameOver && cards.length > 0) {
      timerRef.current = setInterval(
        () => setTimer((t) => t + 1),
        1000
      );
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gameOver, cards.length]);

  // ── Board entrance animation ───────────────────────────────────────────────
  useEffect(() => {
    if (cards.length > 0) {
      boardAnim.setValue(0);
      Animated.spring(boardAnim, {
        toValue: 1,
        tension: 50,
        friction: 9,
        useNativeDriver: true,
      }).start();
    }
  }, [cards.length]);

  // ── Reset ──────────────────────────────────────────────────────────────────
  const resetGame = () => {
    clearInterval(timerRef.current);
    const deck = [...CARD_VALUES, ...CARD_VALUES]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({ id: index, value }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setAttempts(0);
    setTimer(0);
    setGameOver(false);
    setPerformance(null);
    setIsLocked(false);
    overlayAnim.setValue(0);
  };

  // ── Flip handler ───────────────────────────────────────────────────────────
  const handleFlip = (index) => {
    if (
      isLocked ||
      flipped.includes(index) ||
      matched.includes(index) ||
      flipped.length >= 2 ||
      gameOver
    )
      return;

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
                toValue: 1,
                tension: 50,
                friction: 9,
                useNativeDriver: true,
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
        }, 1000);
      }
    }
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const pairsFound = matched.length / 2;
  const totalPairs = CARD_VALUES.length;
  const progressPct = (pairsFound / totalPairs) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0118" />

      {/* ── Header ── */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={scale(18)} color="#ffffff" strokeWidth={2.5} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Layers size={scale(14)} color="#00ffff" strokeWidth={2} style={{ marginRight: 5 }} />
          <Text style={styles.title}>Memory Match</Text>
        </View>

        <Pressable style={styles.iconBtn} onPress={resetGame}>
          <RefreshCw size={scale(17)} color="#ffffff" strokeWidth={2.5} />
        </Pressable>
      </Animated.View>

      {/* ── Stats Row ── */}
      <View style={styles.statsRow}>
        <StatBox
          icon={Target}
          label="Attempts"
          value={attempts}
          color="#00ffff"
        />
        <StatBox
          icon={Layers}
          label="Pairs"
          value={`${pairsFound}/${totalPairs}`}
          color="#ff00ff"
        />
        <StatBox
          icon={Clock}
          label="Time"
          value={formatTime(timer)}
          color="#ffd700"
        />
      </View>

      {/* ── Progress Bar ── */}
      <View style={styles.progressBg}>
        <Animated.View
          style={[styles.progressFill, { width: `${progressPct}%` }]}
        />
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
            transform: [
              {
                scale: boardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
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
              transform: [
                {
                  scale: overlayAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.85, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.winCard}>
            {/* Trophy */}
            <View style={styles.trophyRing}>
              <Trophy size={scale(44)} color="#ffd700" fill="#ffd70033" strokeWidth={1.5} />
            </View>

            <Text style={styles.winTitle}>YOU WIN!</Text>

            {performance && (
              <>
                <Text style={styles.winEmoji}>{performance.emoji}</Text>
                <View style={styles.perfBadge}>
                  <performance.Icon
                    size={scale(13)}
                    color={performance.color}
                    strokeWidth={2.5}
                  />
                  <Text style={[styles.winPerf, { color: performance.color }]}>
                    {"  "}{performance.label}
                  </Text>
                </View>
              </>
            )}

            {/* Win stats */}
            <View style={styles.winStatsRow}>
              <View style={styles.winStat}>
                <Target size={scale(16)} color="#00ffff" strokeWidth={2} />
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

            {/* Buttons */}
            <Pressable
              style={({ pressed }) => [
                styles.playAgainBtn,
                pressed && { opacity: 0.85 },
              ]}
              onPress={resetGame}
            >
              <PlayCircle size={scale(17)} color="#0d0118" strokeWidth={2.5} />
              <Text style={styles.playAgainText}>  Play Again</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.exitBtn,
                pressed && { opacity: 0.6 },
              ]}
              onPress={() => navigation.goBack()}
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
    backgroundColor: "#0d0118",
    alignItems: "center",
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
    paddingBottom: scale(8),
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
    ...Platform.select({
      ios: {
        shadowColor: "#7b2fff",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: { elevation: 4 },
    }),
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: scale(17),
    fontWeight: "900",
    color: "#00ffff",
    letterSpacing: 1.5,
    textShadowColor: "#00ffff88",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  // ── Stats ────────────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: "row",
    gap: scale(10),
    marginTop: scale(4),
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
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
    marginBottom: scale(14),
    overflow: "hidden",
    justifyContent: "center",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#ff00ff",
    borderRadius: 99,
    ...Platform.select({
      ios: {
        shadowColor: "#ff00ff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 6,
      },
    }),
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
    ...Platform.select({
      ios: {
        shadowColor: "#7b2fff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
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
    borderColor: "#00bcd4",
    ...Platform.select({
      ios: {
        shadowColor: "#00bcd4",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: { elevation: 4 },
    }),
  },
  cardMatched: {
    backgroundColor: "#0a2e1a",
    borderColor: "#4caf50",
    ...Platform.select({
      ios: {
        shadowColor: "#4caf50",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
    }),
  },
  cardEmoji: {
    fontSize: scale(26),
  },
  matchGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    borderColor: "#ff00ff44",
    padding: scale(28),
    alignItems: "center",
    width: SCREEN_WIDTH - scale(48),
    ...Platform.select({
      ios: {
        shadowColor: "#ff00ff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 24,
      },
      android: { elevation: 12 },
    }),
  },
  trophyRing: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: "#1f0a3a",
    borderWidth: 2,
    borderColor: "#ffd70044",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(14),
    ...Platform.select({
      ios: {
        shadowColor: "#ffd700",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 14,
      },
      android: { elevation: 8 },
    }),
  },
  winTitle: {
    fontSize: scale(30),
    fontWeight: "900",
    color: "#ffd700",
    letterSpacing: 4,
    textShadowColor: "#ffd70099",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    marginBottom: scale(6),
  },
  winEmoji: {
    fontSize: scale(32),
    marginBottom: scale(4),
  },
  perfBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a0b2e",
    borderRadius: scale(20),
    paddingHorizontal: scale(14),
    paddingVertical: scale(6),
    marginBottom: scale(20),
    borderWidth: 1,
    borderColor: "#ffffff14",
  },
  winPerf: {
    fontSize: scale(15),
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  winStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d0118",
    borderRadius: scale(16),
    paddingVertical: scale(14),
    paddingHorizontal: scale(20),
    marginBottom: scale(22),
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
    backgroundColor: "#00ffff",
    paddingHorizontal: scale(32),
    paddingVertical: scale(13),
    borderRadius: scale(25),
    marginBottom: scale(12),
    ...Platform.select({
      ios: {
        shadowColor: "#00ffff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.55,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  playAgainText: {
    fontSize: scale(14),
    fontWeight: "900",
    color: "#0d0118",
    letterSpacing: 0.5,
  },
  exitBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(8),
    gap: scale(2),
  },
  exitText: {
    fontSize: scale(13),
    color: "#9e86b8",
    fontWeight: "600",
  },
});