// Screens/Games/ReactionRush.js
//
// HOW TO PLAY:
//   Wait for the screen to flash green → tap as fast as possible.
//   5 rounds per game. Average reaction time is your score.
//   Tap early (red screen) = penalty round (+600 ms).
//
// No extra installs — uses Vibration + Lucide + react-native-size-matters.

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, StyleSheet, Pressable,
  Animated, StatusBar, SafeAreaView,
  Platform, Vibration, Dimensions,
} from "react-native";
import { scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft, Zap, Timer, Trophy,
  RefreshCw, ChevronLeft, AlertTriangle,
  CheckCircle, PlayCircle, TrendingDown,
} from "lucide-react-native";
import GameBannerAd from "../../Components/GameBannerAd";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const TOTAL_ROUNDS = 5;

// ─── Haptics ──────────────────────────────────────────────────────────────────
const haptic = (key) => {
  const map = {
    go:      Platform.OS === "android" ? [0, 40, 30, 40] : 50,
    early:   Platform.OS === "android" ? [0, 80, 40, 80] : 80,
    tap:     Platform.OS === "android" ? [0, 25]         : 30,
    win:     Platform.OS === "android" ? [0, 60, 40, 60, 40, 100] : 100,
  };
  const p = map[key];
  if (!p) return;
  Array.isArray(p) ? Vibration.vibrate(p) : Vibration.vibrate(p);
};

// ─── Game states ──────────────────────────────────────────────────────────────
const STATE = { IDLE: "IDLE", WAITING: "WAITING", GO: "GO", EARLY: "EARLY", RESULT: "RESULT" };

// ─── Rating ───────────────────────────────────────────────────────────────────
function getRating(avg) {
  if (avg < 200) return { label: "Superhuman!",  color: "#ffd700", emoji: "⚡" };
  if (avg < 280) return { label: "Lightning!",   color: "#00ffff", emoji: "🌩️" };
  if (avg < 350) return { label: "Sharp!",        color: "#4caf50", emoji: "🎯" };
  if (avg < 450) return { label: "Average",       color: "#ff9800", emoji: "👌" };
  return              { label: "Keep Training",  color: "#ff4081", emoji: "💪" };
}

// ─── Reaction Bar ─────────────────────────────────────────────────────────────
function ReactionBar({ ms, max = 600 }) {
  const pct = Math.min(ms / max, 1);
  const color = ms < 250 ? "#4caf50" : ms < 400 ? "#ff9800" : "#ff4081";
  return (
    <View style={rb.bg}>
      <View style={[rb.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      <Text style={[rb.label, { color }]}>{ms} ms</Text>
    </View>
  );
}
const rb = StyleSheet.create({
  bg:    { width: "100%", height: scale(28), backgroundColor: "#1a0b2e", borderRadius: scale(8), justifyContent: "center", overflow: "hidden", marginBottom: scale(6) },
  fill:  { position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: scale(8), opacity: 0.8 },
  label: { textAlign: "right", paddingRight: scale(10), fontSize: scale(11), fontWeight: "800" },
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ReactionRush() {
  const navigation = useNavigation();

  const [phase, setPhase]       = useState(STATE.IDLE);
  const [round, setRound]       = useState(0);
  const [times, setTimes]       = useState([]);
  const [startMs, setStartMs]   = useState(0);
  const [lastMs, setLastMs]     = useState(null);
  const [earlyCount, setEarlyCount] = useState(0);

  const timeoutRef = useRef(null);
  const bgAnim     = useRef(new Animated.Value(0)).current;
  const pulseAnim  = useRef(new Animated.Value(1)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  // cleanup
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  // bg colour interpolation: 0=waiting(dark), 1=go(green), 2=early(red)
  const bgColor = bgAnim.interpolate({
    inputRange:  [0, 1, 2],
    outputRange: ["#0d0118", "#0a3320", "#3a0a0a"],
  });

  const scheduleGo = () => {
    const delay = 1500 + Math.random() * 3000; // 1.5 – 4.5 s
    timeoutRef.current = setTimeout(() => {
      setPhase(STATE.GO);
      setStartMs(Date.now());
      haptic("go");
      Animated.timing(bgAnim, { toValue: 1, duration: 80, useNativeDriver: false }).start();
      // pulse the zap icon
      Animated.loop(
        Animated.sequence([
          Animated.spring(pulseAnim, { toValue: 1.3, tension: 200, friction: 4, useNativeDriver: true }),
          Animated.spring(pulseAnim, { toValue: 1,   tension: 200, friction: 4, useNativeDriver: true }),
        ]),
        { iterations: 3 }
      ).start();
    }, delay);
  };

  const startRound = () => {
    clearTimeout(timeoutRef.current);
    setPhase(STATE.WAITING);
    setLastMs(null);
    Animated.timing(bgAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    scheduleGo();
  };

  const startGame = () => {
    setRound(1);
    setTimes([]);
    setEarlyCount(0);
    overlayAnim.setValue(0);
    startRound();
  };

  const handleTap = useCallback(() => {
    if (phase === STATE.WAITING) {
      // Tapped too early!
      clearTimeout(timeoutRef.current);
      haptic("early");
      setEarlyCount((c) => c + 1);
      setPhase(STATE.EARLY);
      Animated.timing(bgAnim, { toValue: 2, duration: 80, useNativeDriver: false }).start();
      // add penalty
      const penaltyTimes = [...times, 600];
      setTimes(penaltyTimes);
      const nextRound = round + 1;
      if (nextRound > TOTAL_ROUNDS) {
        finishGame(penaltyTimes);
      } else {
        setRound(nextRound);
        setTimeout(() => startRound(), 1200);
      }
      return;
    }

    if (phase === STATE.GO) {
      const reaction = Date.now() - startMs;
      haptic("tap");
      setLastMs(reaction);
      const newTimes = [...times, reaction];
      setTimes(newTimes);
      setPhase(STATE.IDLE);
      Animated.timing(bgAnim, { toValue: 0, duration: 300, useNativeDriver: false }).start();

      const nextRound = round + 1;
      if (nextRound > TOTAL_ROUNDS) {
        finishGame(newTimes);
      } else {
        setRound(nextRound);
        setTimeout(() => startRound(), 900);
      }
    }
  }, [phase, round, times, startMs]);

  const finishGame = (finalTimes) => {
    haptic("win");
    setPhase(STATE.RESULT);
    Animated.spring(overlayAnim, { toValue: 1, tension: 50, friction: 9, useNativeDriver: true }).start();
  };

  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  const best = times.length ? Math.min(...times) : 0;
  const rating = getRating(avg);

  // ── IDLE / start screen ────────────────────────────────────────────────────
  if (phase === STATE.IDLE && round === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
        <Header onBack={() => navigation.goBack()} onReset={startGame} showReset={false} />
        <View style={styles.startScreen}>
          <View style={styles.bigIconRing}>
            <Zap size={scale(52)} color="#ffd700" fill="#ffd70033" strokeWidth={1.5} />
          </View>
          <Text style={styles.gameTitle}>Reaction Rush</Text>
          <Text style={styles.gameSubtitle}>
            Wait for the screen to turn{" "}
            <Text style={{ color: "#4caf50", fontWeight: "900" }}>GREEN</Text>
            {"\n"}then tap as fast as you can!
          </Text>
          <View style={styles.rulesBox}>
            <RuleRow icon={<CheckCircle size={scale(13)} color="#4caf50" />} text="5 rounds per game" />
            <RuleRow icon={<AlertTriangle size={scale(13)} color="#ff9800" />} text="Early tap = +600 ms penalty" />
            <RuleRow icon={<TrendingDown size={scale(13)} color="#00ffff" />} text="Lower average = better score" />
          </View>
          <Pressable style={styles.startBtn} onPress={startGame}>
            <PlayCircle size={scale(18)} color="#0d0118" strokeWidth={2.5} />
            <Text style={styles.startBtnText}>  Start Game</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
      <Header onBack={() => navigation.goBack()} onReset={startGame} showReset />

      {/* Round indicator */}
      <View style={styles.roundRow}>
        {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.roundDot,
              i < round - 1 && styles.roundDotDone,
              i === round - 1 && styles.roundDotActive,
            ]}
          />
        ))}
      </View>
      <Text style={styles.roundLabel}>Round {Math.min(round, TOTAL_ROUNDS)} / {TOTAL_ROUNDS}</Text>

      {/* Tap zone */}
      <Animated.View style={[styles.tapZone, { backgroundColor: bgColor }]}>
        <Pressable style={styles.tapZoneInner} onPress={handleTap}>
          {phase === STATE.WAITING && (
            <>
              <Timer size={scale(40)} color="#9e86b8" strokeWidth={1.5} />
              <Text style={styles.tapHint}>Wait for it…</Text>
            </>
          )}
          {phase === STATE.GO && (
            <>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Zap size={scale(64)} color="#4caf50" fill="#4caf5055" strokeWidth={1.5} />
              </Animated.View>
              <Text style={styles.tapGoText}>TAP NOW!</Text>
            </>
          )}
          {phase === STATE.EARLY && (
            <>
              <AlertTriangle size={scale(44)} color="#ff4081" strokeWidth={1.5} />
              <Text style={styles.tapEarlyText}>TOO EARLY!</Text>
              <Text style={styles.tapEarlySubtext}>+600 ms penalty</Text>
            </>
          )}
          {phase === STATE.IDLE && lastMs !== null && (
            <>
              <CheckCircle size={scale(44)} color="#00ffff" strokeWidth={1.5} />
              <Text style={styles.tapResultMs}>{lastMs} ms</Text>
              <Text style={styles.tapHint}>Get ready…</Text>
            </>
          )}
        </Pressable>
      </Animated.View>

      {/* Previous times */}
      {times.length > 0 && (
        <View style={styles.timesPanel}>
          <Text style={styles.timesPanelTitle}>Round History</Text>
          {times.map((t, i) => (
            <ReactionBar key={i} ms={t} />
          ))}
        </View>
      )}

      {/* Result overlay */}
      {phase === STATE.RESULT && (
        <Animated.View
          style={[styles.overlay, {
            opacity: overlayAnim,
            transform: [{ scale: overlayAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
          }]}
        >
          <View style={styles.winCard}>
            <View style={styles.trophyRing}>
              <Trophy size={scale(40)} color="#ffd700" fill="#ffd70033" strokeWidth={1.5} />
            </View>
            <Text style={styles.winTitle}>Game Over!</Text>
            <Text style={styles.winEmoji}>{rating.emoji}</Text>
            <View style={styles.perfBadge}>
              <Text style={[styles.winPerf, { color: rating.color }]}>{rating.label}</Text>
            </View>

            <View style={styles.winStatsRow}>
              <WinStat label="Avg Time" value={`${avg} ms`} color="#00ffff" />
              <View style={styles.winStatDivider} />
              <WinStat label="Best" value={`${best} ms`} color="#ffd700" />
              <View style={styles.winStatDivider} />
              <WinStat label="Penalties" value={earlyCount} color="#ff4081" />
            </View>

            <View style={{ width: "100%", marginBottom: scale(20) }}>
              {times.map((t, i) => <ReactionBar key={i} ms={t} />)}
            </View>

            <Pressable style={styles.playAgainBtn} onPress={startGame}>
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
        <GameBannerAd bottom size="adaptive" />   
       
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
        <Zap size={scale(14)} color="#ffd700" strokeWidth={2} style={{ marginRight: 5 }} />
        <Text style={[styles.headerTitle, { color: "#ffd700" }]}>Reaction Rush</Text>
      </View>
      {showReset ? (
        <Pressable style={styles.iconBtn} onPress={onReset}>
          <RefreshCw size={scale(16)} color="#fff" strokeWidth={2.5} />
        </Pressable>
      ) : <View style={styles.iconBtn} />}
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

  // Start screen
  startScreen: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: scale(28) },
  bigIconRing: { width: scale(110), height: scale(110), borderRadius: scale(55), backgroundColor: "#1f0a3a", borderWidth: 2, borderColor: "#ffd70044", justifyContent: "center", alignItems: "center", marginBottom: scale(22), shadowColor: "#ffd700", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 16 },
  gameTitle: { fontSize: scale(28), fontWeight: "900", color: "#ffd700", letterSpacing: 2, marginBottom: scale(10), textShadowColor: "#ffd70099", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  gameSubtitle: { fontSize: scale(14), color: "#9e86b8", textAlign: "center", lineHeight: scale(21), marginBottom: scale(24) },
  rulesBox: { backgroundColor: "#160728", borderRadius: scale(14), padding: scale(16), width: "100%", marginBottom: scale(28), gap: scale(10), borderWidth: 1, borderColor: "#ffffff10" },
  ruleRow: { flexDirection: "row", alignItems: "center", gap: scale(8) },
  ruleText: { fontSize: scale(12), color: "#c9b8e8", fontWeight: "500" },
  startBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#ffd700", paddingHorizontal: scale(36), paddingVertical: scale(14), borderRadius: scale(25), shadowColor: "#ffd700", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 6 },
  startBtnText: { fontSize: scale(15), fontWeight: "900", color: "#0d0118" },

  // Round dots
  roundRow: { flexDirection: "row", gap: scale(8), marginTop: scale(4), marginBottom: scale(6) },
  roundDot: { width: scale(10), height: scale(10), borderRadius: 99, backgroundColor: "#1f0a3a", borderWidth: 1, borderColor: "#ffffff20" },
  roundDotDone: { backgroundColor: "#ffd70099", borderColor: "#ffd700" },
  roundDotActive: { backgroundColor: "#ffd700", borderColor: "#ffd700", shadowColor: "#ffd700", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6 },
  roundLabel: { fontSize: scale(11), color: "#9e86b8", fontWeight: "700", marginBottom: scale(16), letterSpacing: 0.5 },

  // Tap zone
  tapZone: { width: SCREEN_WIDTH - scale(32), height: SCREEN_WIDTH - scale(32), borderRadius: scale(24), borderWidth: 1.5, borderColor: "#ffffff14", marginBottom: scale(20), overflow: "hidden" },
  tapZoneInner: { flex: 1, justifyContent: "center", alignItems: "center", gap: scale(12) },
  tapHint: { fontSize: scale(16), color: "#9e86b8", fontWeight: "600" },
  tapGoText: { fontSize: scale(32), fontWeight: "900", color: "#4caf50", letterSpacing: 3, textShadowColor: "#4caf5099", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12 },
  tapEarlyText: { fontSize: scale(26), fontWeight: "900", color: "#ff4081", letterSpacing: 2 },
  tapEarlySubtext: { fontSize: scale(13), color: "#ff408188", fontWeight: "700" },
  tapResultMs: { fontSize: scale(40), fontWeight: "900", color: "#00ffff", textShadowColor: "#00ffff88", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12 },

  // Times panel
  timesPanel: { width: SCREEN_WIDTH - scale(32), backgroundColor: "#160728", borderRadius: scale(14), padding: scale(14), borderWidth: 1, borderColor: "#ffffff10" },
  timesPanelTitle: { fontSize: scale(11), color: "#9e86b8", fontWeight: "700", letterSpacing: 1, marginBottom: scale(8) },

  // Overlay
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.93)", justifyContent: "center", alignItems: "center", zIndex: 99 },
  winCard: { backgroundColor: "#100520", borderRadius: scale(24), borderWidth: 1.5, borderColor: "#ffd70044", padding: scale(24), alignItems: "center", width: SCREEN_WIDTH - scale(48) },
  trophyRing: { width: scale(76), height: scale(76), borderRadius: scale(38), backgroundColor: "#1f0a3a", borderWidth: 2, borderColor: "#ffd70044", justifyContent: "center", alignItems: "center", marginBottom: scale(12) },
  winTitle: { fontSize: scale(26), fontWeight: "900", color: "#ffd700", letterSpacing: 3, marginBottom: scale(6) },
  winEmoji: { fontSize: scale(28), marginBottom: scale(4) },
  perfBadge: { backgroundColor: "#1a0b2e", borderRadius: scale(20), paddingHorizontal: scale(14), paddingVertical: scale(6), marginBottom: scale(16), borderWidth: 1, borderColor: "#ffffff14" },
  winPerf: { fontSize: scale(15), fontWeight: "800" },
  winStatsRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#0d0118", borderRadius: scale(14), paddingVertical: scale(12), paddingHorizontal: scale(16), marginBottom: scale(16), gap: scale(16), borderWidth: 1, borderColor: "#ffffff0e", width: "100%", justifyContent: "center" },
  winStat: { alignItems: "center", gap: scale(3) },
  winStatValue: { fontSize: scale(16), fontWeight: "900" },
  winStatLabel: { fontSize: scale(9), color: "#9e86b8", fontWeight: "600", letterSpacing: 0.5 },
  winStatDivider: { width: 1, height: scale(36), backgroundColor: "#ffffff14" },
  playAgainBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#ffd700", paddingHorizontal: scale(30), paddingVertical: scale(12), borderRadius: scale(25), marginBottom: scale(10), shadowColor: "#ffd700", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 5 },
  playAgainText: { fontSize: scale(14), fontWeight: "900", color: "#0d0118" },
  exitBtn: { flexDirection: "row", alignItems: "center", paddingVertical: scale(6) },
  exitText: { fontSize: scale(12), color: "#9e86b8", fontWeight: "600" },
});