// Screens/Games/WhackAMoji.js
//
// HOW TO PLAY:
//   Emojis pop up independently in a 3×3 grid. Tap them before they disappear!
//   ⭐ Golden emoji = +3 pts (rare!)
//   💣 Bombs appear at higher levels — DON'T tap them! (-3 pts)
//   Game lasts 30 seconds. Speed increases with score.
//
// FIX: Each cell now has its own independent timer — tapping one emoji
//      no longer causes others to vanish immediately.

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, StyleSheet, Pressable,
  Animated, StatusBar, SafeAreaView,
  Platform, Vibration, Dimensions,
} from "react-native";
import { scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft, RefreshCw, Crosshair,
  Trophy, ChevronLeft, PlayCircle,
  CheckCircle, AlertTriangle, Target, Flame, Zap,
} from "lucide-react-native";
import GameBannerAd from "../../Components/GameBannerAd";
import { useInterstitialAd } from "../../Components/Useinterstitialad";

const SCREEN_WIDTH = Dimensions.get("window").width;
const GRID  = 3;
const CELLS = GRID * GRID; // 9
const GAME_DURATION = 30;
const CELL_SIZE = (SCREEN_WIDTH - scale(32) - scale(10) * (GRID - 1)) / GRID;

const EMOJIS = ["🐸", "🐶", "🐱", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🦝", "🐺", "🐮"];
const BOMB   = "💣";
const GOLDEN = "⭐"; // +3 points, rare

// ─── Haptics ──────────────────────────────────────────────────────────────────
const haptic = (key) => {
  const map = {
    hit:    [0, 30, 20, 30],
    golden: [0, 40, 20, 40, 20, 60],
    bomb:   [0, 80, 40, 80],
    win:    [0, 60, 40, 60, 40, 100],
    streak: [0, 30, 20, 30, 20, 50],
  };
  const p = map[key];
  if (p) Vibration.vibrate(p);
};

// ─── Rating ───────────────────────────────────────────────────────────────────
function getRating(score) {
  if (score >= 35) return { label: "Ninja Tapper!",    color: "#ffd700", emoji: "🥷" };
  if (score >= 25) return { label: "Lightning Fist!",  color: "#00ffff", emoji: "⚡" };
  if (score >= 15) return { label: "Quick Hands!",     color: "#4caf50", emoji: "🎯" };
  if (score >= 7)  return { label: "Getting Faster!",  color: "#ff9800", emoji: "👊" };
  return                  { label: "Keep Tapping!",    color: "#ff4081", emoji: "💪" };
}

// ─── getDifficulty — returns spawn params based on current score ──────────────
function getDifficulty(score) {
  return {
    // How long each emoji stays visible (ms). Shrinks as score rises.
    visibleDuration: Math.max(900, 2000 - score * 35),
    // How often the spawner tries to fill an empty slot (ms).
    spawnInterval:   Math.max(500, 1100 - score * 18),
    // Max simultaneous emojis on screen.
    maxVisible:      Math.min(4, 1 + Math.floor(score / 7)),
    // Bomb probability (0 → 0.28).
    bombProb:        Math.min(0.28, score * 0.012),
    // Golden emoji probability (0 → 0.12).
    goldenProb:      Math.min(0.12, score * 0.005),
  };
}

// ─── FloatingScore — "+1", "+3", "-3" bubble that floats up then fades ────────
function FloatingScore({ value, color, id }) {
  const y    = useRef(new Animated.Value(0)).current;
  const opac = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(y,    { toValue: -scale(40), duration: 700, useNativeDriver: true }),
      Animated.timing(opac, { toValue: 0,          duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.Text
      style={[
        styles.floatingScore,
        { color, transform: [{ translateY: y }], opacity: opac },
      ]}
    >
      {value}
    </Animated.Text>
  );
}

// ─── Cell ─────────────────────────────────────────────────────────────────────
function Cell({ slot, onTap }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacAnim  = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (slot.visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, tension: 220, friction: 6, useNativeDriver: true }),
        Animated.timing(opacAnim,  { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 0, tension: 220, friction: 8, useNativeDriver: true }),
        Animated.timing(opacAnim,  { toValue: 0, duration: 120, useNativeDriver: true }),
      ]).start();
    }
  }, [slot.visible]);

  const handleTap = () => {
    if (!slot.visible) return;
    // Squish animation on tap
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.75, tension: 300, friction: 4, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 0,    tension: 200, friction: 6, useNativeDriver: true }),
    ]).start();
    onTap(slot.index, slot.emoji);
  };

  const isBomb   = slot.emoji === BOMB;
  const isGolden = slot.emoji === GOLDEN;
  const borderC = isBomb ? "#ff4081" : isGolden ? "#ffd700" : "#4caf5044";
  const bgC     = isBomb ? "#3a0a0a" : isGolden ? "#2a1f00" : "#160728";

  return (
    <Pressable onPress={handleTap} style={styles.cellPressable}>
      <Animated.View
        style={[
          styles.cell,
          { backgroundColor: bgC, borderColor: borderC },
          isGolden && styles.cellGolden,
          { transform: [{ scale: scaleAnim }], opacity: opacAnim },
        ]}
      >
        <Text style={styles.cellEmoji}>{slot.emoji}</Text>
        {isGolden && (
          <View style={styles.goldenBadge}>
            <Text style={styles.goldenBadgeText}>+3</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function WhackAMoji() {
  const navigation = useNavigation();
  const { showAd } = useInterstitialAd();
 
  const emptySlots = () =>
    Array.from({ length: CELLS }, (_, i) => ({ index: i, emoji: "", visible: false }));

  const [slots,    setSlots]    = useState(emptySlots());
  const [phase,    setPhase]    = useState("idle");
  const [score,    setScore]    = useState(0);
  const [misses,   setMisses]   = useState(0);
  const [bombHits, setBombHits] = useState(0);
  const [streak,   setStreak]   = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  // Floating score bubbles: [{ id, value, color, cellIndex }]
  const [floaters, setFloaters] = useState([]);

  const timerRef    = useRef(null);
  const spawnerRef  = useRef(null);
  // Per-cell hide timers: { [cellIndex]: timeoutId }
  const cellTimers  = useRef({});
  const scoreRef    = useRef(0);
  const streakRef   = useRef(0);
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const timerAnim   = useRef(new Animated.Value(1)).current;
  const floaterIdRef = useRef(0);

  // Cleanup all timers
  const clearAllTimers = () => {
    clearInterval(timerRef.current);
    clearInterval(spawnerRef.current);
    Object.values(cellTimers.current).forEach(clearTimeout);
    cellTimers.current = {};
  };

  useEffect(() => () => clearAllTimers(), []);

  // ── Hide a single cell ────────────────────────────────────────────────────
  const hideCell = useCallback((idx, isMiss) => {
    if (isMiss) setMisses((m) => m + 1);
    setSlots((prev) =>
      prev.map((s) => s.index === idx ? { ...s, visible: false, emoji: "" } : s)
    );
    delete cellTimers.current[idx];
  }, []);

  // ── Spawn one emoji into a random empty slot ──────────────────────────────
  const spawnOne = useCallback(() => {
    const diff = getDifficulty(scoreRef.current);

    setSlots((prev) => {
      // Count how many are currently visible
      const visibleCount = prev.filter((s) => s.visible).length;
      if (visibleCount >= diff.maxVisible) return prev;

      // Pick a random empty slot
      const empty = prev.filter((s) => !s.visible);
      if (empty.length === 0) return prev;
      const slot = empty[Math.floor(Math.random() * empty.length)];

      // Decide emoji
      const roll = Math.random();
      let emoji;
      if (roll < diff.bombProb)                         emoji = BOMB;
      else if (roll < diff.bombProb + diff.goldenProb)  emoji = GOLDEN;
      else                                              emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

      // Set a per-cell hide timer (miss if not tapped)
      if (cellTimers.current[slot.index]) clearTimeout(cellTimers.current[slot.index]);
      cellTimers.current[slot.index] = setTimeout(
        () => hideCell(slot.index, emoji !== BOMB), // bombs don't count as misses
        diff.visibleDuration
      );

      return prev.map((s) =>
        s.index === slot.index ? { ...s, visible: true, emoji } : s
      );
    });
  }, [hideCell]);

  // ── Start game ────────────────────────────────────────────────────────────
  const startGame = () => {
    clearAllTimers();
    setScore(0); setMisses(0); setBombHits(0);
    setStreak(0); setFloaters([]);
    scoreRef.current  = 0;
    streakRef.current = 0;
    setTimeLeft(GAME_DURATION);
    setSlots(emptySlots());
    overlayAnim.setValue(0);
    timerAnim.setValue(1);
    setPhase("playing");

    Animated.timing(timerAnim, {
      toValue: 0, duration: GAME_DURATION * 1000, useNativeDriver: false,
    }).start();

    // Countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearAllTimers();
          setPhase("over");
          haptic("win");
          setSlots(emptySlots());
          Animated.spring(overlayAnim, { toValue: 1, tension: 50, friction: 9, useNativeDriver: true }).start();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    // Spawner — fires periodically, each call tries to fill one empty slot
    spawnerRef.current = setInterval(() => {
      spawnOne();
    }, 420); // tries frequently; getDifficulty.maxVisible caps how many show
  };

  // ── Handle tap ────────────────────────────────────────────────────────────
  const handleTap = useCallback((idx, emoji) => {
    // Cancel this cell's hide timer (player beat it)
    if (cellTimers.current[idx]) {
      clearTimeout(cellTimers.current[idx]);
      delete cellTimers.current[idx];
    }
    // Hide the cell immediately
    setSlots((prev) =>
      prev.map((s) => s.index === idx ? { ...s, visible: false, emoji: "" } : s)
    );

    if (emoji === BOMB) {
      haptic("bomb");
      setBombHits((b) => b + 1);
      streakRef.current = 0;
      setStreak(0);
      setScore((s) => { const n = Math.max(0, s - 3); scoreRef.current = n; return n; });
      addFloater("-3", "#ff4081", idx);
    } else {
      const pts = emoji === GOLDEN ? 3 : 1;
      haptic(emoji === GOLDEN ? "golden" : "hit");
      const newStreak = streakRef.current + 1;
      streakRef.current = newStreak;
      setStreak(newStreak);
      if (newStreak > 0 && newStreak % 5 === 0) haptic("streak");
      setScore((s) => { const n = s + pts; scoreRef.current = n; return n; });
      addFloater(pts === 3 ? "+3 ⭐" : "+1", pts === 3 ? "#ffd700" : "#4caf50", idx);
    }
  }, []);

  const addFloater = (value, color, cellIndex) => {
    const id = floaterIdRef.current++;
    setFloaters((prev) => [...prev, { id, value, color, cellIndex }]);
    setTimeout(() => setFloaters((prev) => prev.filter((f) => f.id !== id)), 750);
  };

  const timerColor = timerAnim.interpolate({
    inputRange:  [0, 0.33, 1],
    outputRange: ["#ff4081", "#ff9800", "#4caf50"],
  });

  // ── IDLE ──────────────────────────────────────────────────────────────────
  if (phase === "idle") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
        <Header onBack={() => navigation.goBack()} />
        <View style={styles.startScreen}>
          <View style={styles.bigIconRing}>
            <Crosshair size={scale(50)} color="#4caf50" strokeWidth={1.5} />
          </View>
          <Text style={styles.gameTitle}>Whack-a-Moji</Text>
          <Text style={styles.gameSubtitle}>
            Each emoji has its own timer!{"\n"}
            Tap fast — don't hit the 💣 bombs!
          </Text>
          <View style={styles.rulesBox}>
            <RuleRow icon={<CheckCircle   size={scale(13)} color="#4caf50" />} text="Tap emoji = +1 point" />
            <RuleRow icon={<Text style={styles.ruleEmoji}>⭐</Text>}           text="Golden emoji = +3 points (rare!)" />
            <RuleRow icon={<AlertTriangle size={scale(13)} color="#ff4081" />} text="Tap bomb 💣 = −3 points & streak reset" />
            <RuleRow icon={<Flame         size={scale(13)} color="#ff6030" />} text="5-tap streak = bonus haptic feedback 🔥" />
            <RuleRow icon={<Target        size={scale(13)} color="#ff9800" />} text="Each emoji vanishes independently" />
          </View>
          <Pressable style={styles.startBtn} onPress={startGame}>
            <PlayCircle size={scale(18)} color="#0d0118" strokeWidth={2.5} />
            <Text style={styles.startBtnText}>  Start Game</Text>
          </Pressable>
        </View>
        <GameBannerAd bottom size="banner" />
      </SafeAreaView>
    );
  }

  // ── PLAYING + GAME OVER ───────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
      <Header onBack={() => navigation.goBack()} onReset={startGame} showReset />

      {/* Stats */}
      <View style={styles.statsRow}>
        <MiniStat label="Score"  value={score}    color="#4caf50" />
        <MiniStat label="Streak" value={streak >= 3 ? `🔥${streak}` : streak} color={streak >= 3 ? "#ffd700" : "#ff9800"} />
        <MiniStat label="Bombs"  value={bombHits}  color="#ff4081" />
        <MiniStat label="Time"   value={timeLeft}  color={timeLeft <= 8 ? "#ff4081" : "#ffd700"} urgent={timeLeft <= 8} />
      </View>

      {/* Timer bar */}
      <View style={styles.timerBg}>
        <Animated.View style={[
          styles.timerFill,
          {
            width: timerAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
            backgroundColor: timerColor,
          },
        ]} />
      </View>

      {/* Grid + floating score bubbles */}
      <View style={styles.gridWrapper}>
        <View style={styles.grid}>
          {slots.map((slot) => (
            <View key={slot.index} style={[styles.cellBg, slot.visible && slot.emoji !== BOMB && styles.cellBgActive]}>
              <Cell slot={slot} onTap={handleTap} />
              {/* Render floaters anchored to this cell */}
              {floaters
                .filter((f) => f.cellIndex === slot.index)
                .map((f) => (
                  <FloatingScore key={f.id} value={f.value} color={f.color} id={f.id} />
                ))}
            </View>
          ))}
        </View>
      </View>

      {/* Streak banner */}
      {streak >= 5 && (
        <View style={styles.streakBanner}>
          <Flame size={scale(13)} color="#ff6030" />
          <Text style={styles.streakBannerText}>  {streak} COMBO!</Text>
          {streak >= 10 && <Zap size={scale(13)} color="#ffd700" />}
        </View>
      )}

      {/* Result overlay */}
      {phase === "over" && (
        <Animated.View style={[styles.overlay, {
          opacity: overlayAnim,
          transform: [{ scale: overlayAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
        }]}>
          <View style={styles.winCard}>
            <View style={styles.trophyRing}>
              <Trophy size={scale(38)} color="#ffd700" fill="#ffd70033" strokeWidth={1.5} />
            </View>
            <Text style={styles.winTitle}>Game Over!</Text>

            {(() => {
              const r = getRating(score);
              return (
                <>
                  <Text style={styles.winEmoji}>{r.emoji}</Text>
                  <View style={styles.perfBadge}>
                    <Text style={[styles.winPerf, { color: r.color }]}>{r.label}</Text>
                  </View>
                </>
              );
            })()}

            <View style={styles.winStatsRow}>
              <WinStat label="Score"   value={score}    color="#4caf50" />
              <View style={styles.winStatDivider} />
              <WinStat label="Misses"  value={misses}   color="#ff9800" />
              <View style={styles.winStatDivider} />
              <WinStat label="Bombs"   value={bombHits} color="#ff4081" />
            </View>

            {/* Accuracy bar */}
            {(score + misses) > 0 && (() => {
              const total = score + misses + bombHits;
              const acc   = Math.round((score / Math.max(total, 1)) * 100);
              return (
                <View style={styles.accuracyBlock}>
                  <View style={styles.accuracyRow}>
                    <Text style={styles.accuracyLabel}>Accuracy</Text>
                    <Text style={[styles.accuracyPct, { color: acc >= 70 ? "#4caf50" : acc >= 40 ? "#ff9800" : "#ff4081" }]}>
                      {acc}%
                    </Text>
                  </View>
                  <View style={styles.accuracyTrack}>
                    <View style={[styles.accuracyFill, { width: `${acc}%` }]} />
                  </View>
                </View>
              );
            })()}

            {/* Play Again → interstitial then restart */}
            <Pressable
              style={styles.playAgainBtn}
              onPress={() => showAd(startGame)}
            >
              <PlayCircle size={scale(16)} color="#0d0118" strokeWidth={2.5} />
              <Text style={styles.playAgainText}>  Play Again</Text>
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
        <Crosshair size={scale(14)} color="#4caf50" strokeWidth={2} style={{ marginRight: 5 }} />
        <Text style={styles.headerTitle}>Whack-a-Moji</Text>
      </View>
      {showReset
        ? <Pressable style={styles.iconBtn} onPress={onReset}>
            <RefreshCw size={scale(16)} color="#fff" strokeWidth={2.5} />
          </Pressable>
        : <View style={styles.iconBtn} />}
    </View>
  );
}

function MiniStat({ label, value, color, urgent }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (urgent) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.1, duration: 320, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1,   duration: 320, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulse.setValue(1);
    }
  }, [urgent]);
  return (
    <Animated.View style={[styles.miniStat, { borderColor: color + "44", transform: [{ scale: pulse }] }]}>
      <Text style={[styles.miniStatVal, { color }]}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
    </Animated.View>
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

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0118", alignItems: "center" },

  header: {
    width: "100%", flexDirection: "row", alignItems: "center",
    paddingHorizontal: scale(16), paddingTop: scale(12), paddingBottom: scale(8),
  },
  iconBtn: {
    width: scale(38), height: scale(38), borderRadius: scale(12),
    backgroundColor: "#1f0a3a", borderWidth: 1, borderColor: "#ffffff18",
    justifyContent: "center", alignItems: "center", elevation: 3,
  },
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: scale(17), fontWeight: "900", letterSpacing: 1.5, color: "#4caf50" },

  // Start
  startScreen: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingHorizontal: scale(28),
  },
  bigIconRing: {
    width: scale(100), height: scale(100), borderRadius: scale(50),
    backgroundColor: "#1f0a3a", borderWidth: 2, borderColor: "#4caf5044",
    justifyContent: "center", alignItems: "center",
    marginBottom: scale(20), elevation: 6,
  },
  gameTitle: {
    fontSize: scale(28), fontWeight: "900", letterSpacing: 2,
    color: "#4caf50", marginBottom: scale(10),
    textShadowColor: "#4caf5066", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10,
  },
  gameSubtitle: {
    fontSize: scale(13), color: "#9e86b8", textAlign: "center",
    lineHeight: scale(20), marginBottom: scale(22),
  },
  rulesBox: {
    backgroundColor: "#160728", borderRadius: scale(14), padding: scale(14),
    minWidth: "100%", marginBottom: scale(26), gap: scale(9),
    borderWidth: 1, borderColor: "#ffffff10",
  },
  ruleRow:  { flexDirection: "row", alignItems: "center", gap: scale(8) },
  ruleEmoji:{ fontSize: scale(13) },
  ruleText: { fontSize: scale(12), color: "#c9b8e8", fontWeight: "500", flex: 1 },
  startBtn: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#4caf50",
    paddingHorizontal: scale(36), paddingVertical: scale(14),
    borderRadius: scale(25), elevation: 6,
  },
  startBtnText: { fontSize: scale(15), fontWeight: "900", color: "#0d0118" },

  // Playing
  statsRow: {
    flexDirection: "row", gap: scale(8),
    paddingHorizontal: scale(16), marginBottom: scale(10), width: "100%",
  },
  miniStat: {
    flex: 1, backgroundColor: "#160728", borderRadius: scale(10),
    borderWidth: 1, paddingVertical: scale(7), alignItems: "center",
  },
  miniStatVal:   { fontSize: scale(13), fontWeight: "900" },
  miniStatLabel: { fontSize: scale(8), color: "#9e86b8", fontWeight: "600", marginTop: scale(1) },

  timerBg: {
    width: SCREEN_WIDTH - scale(32), height: scale(6),
    backgroundColor: "#ffffff14", borderRadius: 99,
    marginBottom: scale(16), overflow: "hidden",
  },
  timerFill: { height: "100%", borderRadius: 99 },

  // Grid
  gridWrapper: { position: "relative" },
  grid: {
    flexDirection: "row", flexWrap: "wrap",
    width: SCREEN_WIDTH - scale(32), gap: scale(10),
  },
  cellBg: {
    width: CELL_SIZE, height: CELL_SIZE, borderRadius: scale(16),
    backgroundColor: "#0e0222", borderWidth: 1, borderColor: "#ffffff0a",
    justifyContent: "center", alignItems: "center",
    position: "relative",       // anchor for FloatingScore
  },
  cellBgActive: {
    borderColor: "#4caf5022",
  },
  cellPressable: { width: "100%", height: "100%", justifyContent: "center", alignItems: "center" },
  cell: {
    width: "80%", height: "80%", borderRadius: scale(12),
    borderWidth: 1.5, justifyContent: "center", alignItems: "center",
  },
  cellGolden: {
    borderColor: "#ffd700",
    backgroundColor: "#2a1f00",
    elevation: 6,
  },
  cellEmoji: { fontSize: scale(34) },
  goldenBadge: {
    position: "absolute", top: scale(-4), right: scale(-4),
    backgroundColor: "#ffd700", borderRadius: 99,
    paddingHorizontal: scale(4), paddingVertical: scale(1),
  },
  goldenBadgeText: { fontSize: scale(8), fontWeight: "900", color: "#0d0118" },

  // Floating score bubble
  floatingScore: {
    position: "absolute",
    top: "20%",
    alignSelf: "center",
    fontSize: scale(14),
    fontWeight: "900",
    zIndex: 99,
    textShadowColor: "#00000088",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // Streak banner
  streakBanner: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#1f0a00", borderRadius: scale(20),
    paddingHorizontal: scale(16), paddingVertical: scale(7),
    borderWidth: 1, borderColor: "#ff603044",
    marginTop: scale(12),
  },
  streakBannerText: { fontSize: scale(13), color: "#ff9800", fontWeight: "900", letterSpacing: 1 },

  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.93)",
    justifyContent: "center", alignItems: "center", zIndex: 99,
  },
  winCard: {
    backgroundColor: "#100520", borderRadius: scale(24),
    borderWidth: 1.5, borderColor: "#4caf5044",
    padding: scale(24), alignItems: "center",
    width: SCREEN_WIDTH - scale(48), elevation: 12,
  },
  trophyRing: {
    width: scale(76), height: scale(76), borderRadius: scale(38),
    backgroundColor: "#1f0a3a", borderWidth: 2, borderColor: "#ffd70044",
    justifyContent: "center", alignItems: "center",
    marginBottom: scale(12), elevation: 6,
  },
  winTitle: {
    fontSize: scale(26), fontWeight: "900", color: "#ffd700",
    letterSpacing: 3, marginBottom: scale(6),
  },
  winEmoji:  { fontSize: scale(28), marginBottom: scale(4) },
  perfBadge: {
    backgroundColor: "#1a0b2e", borderRadius: scale(20),
    paddingHorizontal: scale(14), paddingVertical: scale(6),
    marginBottom: scale(16), borderWidth: 1, borderColor: "#ffffff14",
  },
  winPerf: { fontSize: scale(15), fontWeight: "800" },
  winStatsRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#0d0118", borderRadius: scale(14),
    paddingVertical: scale(12), paddingHorizontal: scale(16),
    marginBottom: scale(12), gap: scale(16),
    borderWidth: 1, borderColor: "#ffffff0e",
    width: "100%", justifyContent: "center",
  },
  winStat:        { alignItems: "center", gap: scale(3) },
  winStatValue:   { fontSize: scale(18), fontWeight: "900" },
  winStatLabel:   { fontSize: scale(9), color: "#9e86b8", fontWeight: "600" },
  winStatDivider: { width: 1, height: scale(36), backgroundColor: "#ffffff14" },

  // Accuracy
  accuracyBlock: { width: "100%", marginBottom: scale(16), gap: scale(5) },
  accuracyRow:   { flexDirection: "row", justifyContent: "space-between" },
  accuracyLabel: { fontSize: scale(10), color: "#9e86b8", fontWeight: "700", letterSpacing: 1 },
  accuracyPct:   { fontSize: scale(10), fontWeight: "900" },
  accuracyTrack: { width: "100%", height: scale(6), backgroundColor: "#ffffff0e", borderRadius: 99, overflow: "hidden" },
  accuracyFill:  { height: "100%", backgroundColor: "#4caf50", borderRadius: 99 },

  playAgainBtn: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#4caf50",
    paddingHorizontal: scale(30), paddingVertical: scale(12),
    borderRadius: scale(25), marginBottom: scale(10), elevation: 5,
  },
  playAgainText: { fontSize: scale(14), fontWeight: "900", color: "#0d0118" },
  exitBtn:       { flexDirection: "row", alignItems: "center", paddingVertical: scale(6) },
  exitText:      { fontSize: scale(12), color: "#9e86b8", fontWeight: "600" },
});