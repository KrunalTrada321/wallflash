// Screens/Games/WhackAMoji.js
//
// HOW TO PLAY:
//   Emojis pop up in a 3×3 grid. Tap them before they disappear!
//   💣 Bombs appear at higher levels — DON'T tap them! (-3 pts)
//   Game lasts 30 seconds. Speed increases with score.

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
  CheckCircle, AlertTriangle, Target,
} from "lucide-react-native";
import GameBannerAd from "../../Components/GameBannerAd";

const SCREEN_WIDTH = Dimensions.get("window").width;
const GRID = 3;
const CELLS = GRID * GRID; // 9
const GAME_DURATION = 30;
const CELL_SIZE = (SCREEN_WIDTH - scale(32) - scale(10) * (GRID - 1)) / GRID;

const EMOJIS = ["🐸", "🐶", "🐱", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐸", "🦝", "🐺"];
const BOMB = "💣";

// ─── Haptics ──────────────────────────────────────────────────────────────────
const haptic = (key) => {
  const map = {
    hit: Platform.OS === "android" ? [0, 30, 20, 30] : 35,
    bomb: Platform.OS === "android" ? [0, 80, 40, 80] : 80,
    miss: Platform.OS === "android" ? [0, 20] : 20,
    win: Platform.OS === "android" ? [0, 60, 40, 60, 40, 100] : 100,
  };
  const p = map[key];
  if (!p) return;
  Array.isArray(p) ? Vibration.vibrate(p) : Vibration.vibrate(p);
};

// ─── Rating ───────────────────────────────────────────────────────────────────
function getRating(score, misses) {
  const acc = score + misses > 0 ? Math.round((score / (score + misses + 1)) * 100) : 0;
  if (score >= 30) return { label: "Ninja Tapper!", color: "#ffd700", emoji: "🥷" };
  if (score >= 20) return { label: "Lightning Fist!", color: "#00ffff", emoji: "⚡" };
  if (score >= 12) return { label: "Quick Hands!", color: "#4caf50", emoji: "🎯" };
  if (score >= 6) return { label: "Getting Faster!", color: "#ff9800", emoji: "👊" };
  return { label: "Keep Tapping!", color: "#ff4081", emoji: "💪" };
}

// ─── Cell component ───────────────────────────────────────────────────────────
function Cell({ slot, onTap }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (slot.visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, tension: 200, friction: 6, useNativeDriver: true }),
        Animated.timing(opacAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 0, tension: 200, friction: 8, useNativeDriver: true }),
        Animated.timing(opacAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [slot.visible]);

  const handleTap = () => {
    if (!slot.visible) return;
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -8, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
    onTap(slot.index, slot.emoji);
  };

  const isBomb = slot.emoji === BOMB;
  const borderC = isBomb ? "#ff4081" : "#4caf5044";
  const bgC = isBomb ? "#3a0a0a" : "#160728";

  return (
    <Pressable onPress={handleTap} style={styles.cellPressable}>
      <Animated.View
        style={[
          styles.cell,
          { backgroundColor: bgC, borderColor: borderC },
          { transform: [{ scale: scaleAnim }, { translateX: shakeAnim }], opacity: opacAnim },
        ]}
      >
        <Text style={styles.cellEmoji}>{slot.emoji}</Text>
      </Animated.View>
    </Pressable>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function WhackAMoji() {
  const navigation = useNavigation();

  // slots: array of { index, emoji, visible }
  const [slots, setSlots] = useState(Array.from({ length: CELLS }, (_, i) => ({ index: i, emoji: "", visible: false })));
  const [phase, setPhase] = useState("idle");
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [bombs, setBombs] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [hitFlash, setHitFlash] = useState(null); // index that was just hit

  const timerRef = useRef(null);
  const spawnRef = useRef(null);
  const scoreRef = useRef(0);
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const timerAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => () => { clearInterval(timerRef.current); clearTimeout(spawnRef.current); }, []);

  const spawnCycle = useCallback((currentScore) => {
    // Speed: starts at 1200 ms, drops to 550 ms
    const speed = Math.max(550, 1200 - currentScore * 20);
    // Number of visible slots: 1-3
    const count = Math.min(3, 1 + Math.floor(currentScore / 8));
    // Bomb probability: 0% at start, up to 25%
    const bombProb = Math.min(0.25, currentScore * 0.01);

    setSlots((prev) => {
      const next = prev.map((s) => ({ ...s, visible: false, emoji: "" }));
      const indices = [...Array(CELLS).keys()].sort(() => Math.random() - 0.5).slice(0, count);
      indices.forEach((i) => {
        const isBomb = Math.random() < bombProb;
        next[i] = {
          ...next[i],
          visible: true,
          emoji: isBomb ? BOMB : EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        };
      });
      return next;
    });

    spawnRef.current = setTimeout(() => {
      // hide unhit slots (miss penalty only if non-bomb)
      setSlots((prev) => {
        const next = prev.map((s) => {
          if (s.visible && s.emoji !== BOMB) {
            setMisses((m) => m + 1);
          }
          return { ...s, visible: false, emoji: "" };
        });
        return next;
      });
      spawnCycle(scoreRef.current);
    }, speed);
  }, []);

  const startGame = () => {
    clearInterval(timerRef.current);
    clearTimeout(spawnRef.current);
    setScore(0); setMisses(0); setBombs(0);
    scoreRef.current = 0;
    setTimeLeft(GAME_DURATION);
    overlayAnim.setValue(0);
    timerAnim.setValue(1);
    setSlots(Array.from({ length: CELLS }, (_, i) => ({ index: i, emoji: "", visible: false })));
    setPhase("playing");

    Animated.timing(timerAnim, {
      toValue: 0, duration: GAME_DURATION * 1000, useNativeDriver: false,
    }).start();

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          clearTimeout(spawnRef.current);
          setPhase("over");
          haptic("win");
          setSlots(Array.from({ length: CELLS }, (_, i) => ({ index: i, emoji: "", visible: false })));
          Animated.spring(overlayAnim, { toValue: 1, tension: 50, friction: 9, useNativeDriver: true }).start();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    spawnCycle(0);
  };

  const handleTap = useCallback((idx, emoji) => {
    if (emoji === BOMB) {
      haptic("bomb");
      setBombs((b) => b + 1);
      setScore((s) => { const next = Math.max(0, s - 3); scoreRef.current = next; return next; });
    } else {
      haptic("hit");
      setScore((s) => { const next = s + 1; scoreRef.current = next; return next; });
      setHitFlash(idx);
      setTimeout(() => setHitFlash(null), 300);
    }
    setSlots((prev) => prev.map((s) => s.index === idx ? { ...s, visible: false, emoji: "" } : s));
  }, []);

  const timerColor = timerAnim.interpolate({
    inputRange: [0, 0.33, 1],
    outputRange: ["#ff4081", "#ff9800", "#4caf50"],
  });

  // ── IDLE ───────────────────────────────────────────────────────────────────
  if (phase === "idle") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
        <Header onBack={() => navigation.goBack()} />
        <View style={styles.startScreen}>
          <View style={[styles.bigIconRing, { borderColor: "#4caf5044" }]}>
            <Crosshair size={scale(50)} color="#4caf50" strokeWidth={1.5} />
          </View>
          <Text style={[styles.gameTitle, { color: "#4caf50" }]}>Whack-a-Moji</Text>
          <Text style={styles.gameSubtitle}>Smash emojis before they disappear!{"\n"}Avoid the 💣 bombs!</Text>
          <View style={styles.rulesBox}>
            <RuleRow icon={<CheckCircle size={scale(13)} color="#4caf50" />} text="Tap emoji = +1 point" />
            <RuleRow icon={<AlertTriangle size={scale(13)} color="#ff4081" />} text="Tap bomb 💣 = -3 points" />
            <RuleRow icon={<Target size={scale(13)} color="#ff9800" />} text="Speed increases as you score higher" />
          </View>
          <Pressable style={[styles.startBtn, { backgroundColor: "#4caf50" }]} onPress={startGame}>
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

      {/* Stats */}
      <View style={styles.statsRow}>
        <MiniStat label="Score" value={score} color="#4caf50" />
        <MiniStat label="Misses" value={misses} color="#ff9800" />
        <MiniStat label="Bombs" value={bombs} color="#ff4081" />
        <MiniStat label="Time" value={timeLeft} color={timeLeft <= 8 ? "#ff4081" : "#ffd700"} />
      </View>

      {/* Timer bar */}
      <View style={styles.timerBg}>
        <Animated.View style={[styles.timerFill, { width: timerAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }), backgroundColor: timerColor }]} />
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {slots.map((slot) => (
          <View
            key={slot.index}
            style={[
              styles.cellBg,
              hitFlash === slot.index && styles.cellBgHit,
            ]}
          >
            <Cell slot={slot} onTap={handleTap} />
          </View>
        ))}
      </View>

      {/* Result overlay */}
      {phase === "over" && (
        <Animated.View style={[styles.overlay, {
          opacity: overlayAnim,
          transform: [{ scale: overlayAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
        }]}>
          <View style={styles.winCard}>
            <View style={[styles.trophyRing, { borderColor: "#4caf5044" }]}>
              <Trophy size={scale(38)} color="#ffd700" fill="#ffd70033" strokeWidth={1.5} />
            </View>
            <Text style={styles.winTitle}>Game Over!</Text>
            {(() => {
              const r = getRating(score, misses);
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
              <WinStat label="Score" value={score} color="#4caf50" />
              <View style={styles.winStatDivider} />
              <WinStat label="Misses" value={misses} color="#ff9800" />
              <View style={styles.winStatDivider} />
              <WinStat label="Bombs" value={bombs} color="#ff4081" />
            </View>
            <Pressable style={[styles.playAgainBtn, { backgroundColor: "#4caf50" }]} onPress={startGame}>
              <PlayCircle size={scale(16)} color="#0d0118" strokeWidth={2.5} />
              <Text style={styles.playAgainText}>  Play Again</Text>
            </Pressable>
            <Pressable style={styles.exitBtn} onPress={() => navigation.goBack()}>
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
        <Text style={[styles.headerTitle, { color: "#4caf50" }]}>Whack-a-Moji</Text>
      </View>
      {showReset
        ? <Pressable style={styles.iconBtn} onPress={onReset}><RefreshCw size={scale(16)} color="#fff" strokeWidth={2.5} /></Pressable>
        : <View style={styles.iconBtn} />}
    </View>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <View style={[styles.miniStat, { borderColor: color + "44" }]}>
      <Text style={[styles.miniStatVal, { color }]}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
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

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0118", alignItems: "center" },

  header: { width: "100%", flexDirection: "row", alignItems: "center", paddingHorizontal: scale(16), paddingTop: scale(12), paddingBottom: scale(8) },
  iconBtn: { width: scale(38), height: scale(38), borderRadius: scale(12), backgroundColor: "#1f0a3a", borderWidth: 1, borderColor: "#ffffff18", justifyContent: "center", alignItems: "center" },
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: scale(17), fontWeight: "900", letterSpacing: 1.5 },

  // Start
  startScreen: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: scale(28) },
  bigIconRing: { width: scale(100), height: scale(100), borderRadius: scale(50), backgroundColor: "#1f0a3a", borderWidth: 2, justifyContent: "center", alignItems: "center", marginBottom: scale(20) },
  gameTitle: { fontSize: scale(28), fontWeight: "900", letterSpacing: 2, marginBottom: scale(10) },
  gameSubtitle: { fontSize: scale(14), color: "#9e86b8", textAlign: "center", lineHeight: scale(21), marginBottom: scale(24) },
  rulesBox: { backgroundColor: "#160728", borderRadius: scale(14), padding: scale(16), width: "100%", marginBottom: scale(28), gap: scale(10), borderWidth: 1, borderColor: "#ffffff10" },
  ruleRow: { flexDirection: "row", alignItems: "center", gap: scale(8) },
  ruleText: { fontSize: scale(12), color: "#c9b8e8", fontWeight: "500", flex: 1 },
  startBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: scale(36), paddingVertical: scale(14), borderRadius: scale(25), elevation: 6 },
  startBtnText: { fontSize: scale(15), fontWeight: "900", color: "#0d0118" },

  // Playing
  statsRow: { flexDirection: "row", gap: scale(8), paddingHorizontal: scale(16), marginBottom: scale(10), width: "100%" },
  miniStat: { flex: 1, backgroundColor: "#160728", borderRadius: scale(10), borderWidth: 1, paddingVertical: scale(7), alignItems: "center" },
  miniStatVal: { fontSize: scale(13), fontWeight: "900" },
  miniStatLabel: { fontSize: scale(8), color: "#9e86b8", fontWeight: "600", marginTop: scale(1) },
  timerBg: { width: SCREEN_WIDTH - scale(32), height: scale(6), backgroundColor: "#ffffff14", borderRadius: 99, marginBottom: scale(20), overflow: "hidden" },
  timerFill: { height: "100%", borderRadius: 99 },

  // Grid
  grid: { flexDirection: "row", flexWrap: "wrap", width: SCREEN_WIDTH - scale(32), gap: scale(10) },
  cellBg: { width: CELL_SIZE, height: CELL_SIZE, borderRadius: scale(16), backgroundColor: "#0e0222", borderWidth: 1, borderColor: "#ffffff0e", justifyContent: "center", alignItems: "center" },
  cellBgHit: { backgroundColor: "#0a2e1a", borderColor: "#4caf5044" },
  cellPressable: { width: "100%", height: "100%", justifyContent: "center", alignItems: "center" },
  cell: { width: "80%", height: "80%", borderRadius: scale(12), borderWidth: 1.5, justifyContent: "center", alignItems: "center" },
  cellEmoji: { fontSize: scale(34) },

  // Overlay
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.93)", justifyContent: "center", alignItems: "center", zIndex: 99 },
  winCard: { backgroundColor: "#100520", borderRadius: scale(24), borderWidth: 1.5, borderColor: "#4caf5044", padding: scale(24), alignItems: "center", width: SCREEN_WIDTH - scale(48) },
  trophyRing: { width: scale(76), height: scale(76), borderRadius: scale(38), backgroundColor: "#1f0a3a", borderWidth: 2, justifyContent: "center", alignItems: "center", marginBottom: scale(12) },
  winTitle: { fontSize: scale(26), fontWeight: "900", color: "#ffd700", letterSpacing: 3, marginBottom: scale(6) },
  winEmoji: { fontSize: scale(28), marginBottom: scale(4) },
  perfBadge: { backgroundColor: "#1a0b2e", borderRadius: scale(20), paddingHorizontal: scale(14), paddingVertical: scale(6), marginBottom: scale(16), borderWidth: 1, borderColor: "#ffffff14" },
  winPerf: { fontSize: scale(15), fontWeight: "800" },
  winStatsRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#0d0118", borderRadius: scale(14), paddingVertical: scale(12), paddingHorizontal: scale(16), marginBottom: scale(20), gap: scale(16), borderWidth: 1, borderColor: "#ffffff0e", width: "100%", justifyContent: "center" },
  winStat: { alignItems: "center", gap: scale(3) },
  winStatValue: { fontSize: scale(18), fontWeight: "900" },
  winStatLabel: { fontSize: scale(9), color: "#9e86b8", fontWeight: "600" },
  winStatDivider: { width: 1, height: scale(36), backgroundColor: "#ffffff14" },
  playAgainBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: scale(30), paddingVertical: scale(12), borderRadius: scale(25), marginBottom: scale(10) },
  playAgainText: { fontSize: scale(14), fontWeight: "900", color: "#0d0118" },
  exitBtn: { flexDirection: "row", alignItems: "center", paddingVertical: scale(6) },
  exitText: { fontSize: scale(12), color: "#9e86b8", fontWeight: "600" },
});