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
  Flame, Star, Target,
} from "lucide-react-native";
import GameBannerAd from "../../Components/GameBannerAd";
import { useInterstitialAd } from "../../Components/Useinterstitialad";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TOTAL_ROUNDS = 5;

// ─── Difficulty Config ────────────────────────────────────────────────────────
const DIFFICULTY = {
  easy:   { label: "Easy",   color: "#4caf50", minDelay: 2000, maxDelay: 4500, penalty: 500, icon: "🟢" },
  medium: { label: "Medium", color: "#ff9800", minDelay: 1500, maxDelay: 3500, penalty: 600, icon: "🟡" },
  hard:   { label: "Hard",   color: "#ff4081", minDelay: 800,  maxDelay: 2500, penalty: 800, icon: "🔴" },
};

// ─── Haptics ──────────────────────────────────────────────────────────────────
const haptic = (key) => {
  const map = {
    go:      [0, 40, 30, 40],
    early:   [0, 80, 40, 80],
    tap:     [0, 25],
    win:     [0, 60, 40, 60, 40, 100],
    streak:  [0, 30, 20, 30, 20, 50],
    countdown: [0, 20],
  };
  const p = map[key];
  if (p) Vibration.vibrate(p);
};

// ─── Game states ──────────────────────────────────────────────────────────────
const STATE = {
  IDLE: "IDLE", COUNTDOWN: "COUNTDOWN",
  WAITING: "WAITING", GO: "GO",
  EARLY: "EARLY", RESULT: "RESULT",
};

// ─── Rating ───────────────────────────────────────────────────────────────────
function getRating(avg) {
  if (avg < 180) return { label: "Superhuman!",   color: "#ffd700", emoji: "⚡" };
  if (avg < 250) return { label: "Lightning!",    color: "#00ffff", emoji: "🌩️" };
  if (avg < 320) return { label: "Sharp!",         color: "#4caf50", emoji: "🎯" };
  if (avg < 420) return { label: "Average",        color: "#ff9800", emoji: "👌" };
  return              { label: "Keep Training",   color: "#ff4081", emoji: "💪" };
}

// ─── Streak label ─────────────────────────────────────────────────────────────
function getStreakLabel(streak) {
  if (streak >= 4) return { label: "ON FIRE! 🔥", color: "#ffd700" };
  if (streak >= 3) return { label: "HOT STREAK!", color: "#ff9800" };
  if (streak >= 2) return { label: "COMBO! ⚡",   color: "#00ffff" };
  return null;
}

// ─── Reaction Bar ─────────────────────────────────────────────────────────────
function ReactionBar({ ms, index }) {
  const isPenalty = ms >= 600;
  const pct = Math.min(ms / 700, 1);
  const color = isPenalty ? "#ff4081" : ms < 250 ? "#4caf50" : ms < 380 ? "#ff9800" : "#ff6060";
  return (
    <View style={rb.row}>
      <Text style={[rb.idx, { color: color + "99" }]}>{index + 1}</Text>
      <View style={rb.bg}>
        <View style={[rb.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
        <Text style={[rb.label, { color }]}>
          {isPenalty ? `${ms} ms ⚠️` : `${ms} ms`}
        </Text>
      </View>
    </View>
  );
}
const rb = StyleSheet.create({
  row:   { flexDirection: "row", alignItems: "center", marginBottom: scale(6), gap: scale(6) },
  idx:   { fontSize: scale(10), fontWeight: "800", width: scale(12), textAlign: "center" },
  bg:    { flex: 1, height: scale(28), backgroundColor: "#1a0b2e", borderRadius: scale(8), justifyContent: "center", overflow: "hidden" },
  fill:  { position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: scale(8), opacity: 0.75 },
  label: { textAlign: "right", paddingRight: scale(10), fontSize: scale(11), fontWeight: "800" },
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ReactionRush() {
  const navigation = useNavigation();
  const { showAd } = useInterstitialAd();
 
  const [phase,       setPhase]       = useState(STATE.IDLE);
  const [round,       setRound]       = useState(0);
  const [times,       setTimes]       = useState([]);
  const [startMs,     setStartMs]     = useState(0);
  const [lastMs,      setLastMs]      = useState(null);
  const [earlyCount,  setEarlyCount]  = useState(0);
  const [difficulty,  setDifficulty]  = useState("medium");
  const [streak,      setStreak]      = useState(0);
  const [bestEver,    setBestEver]    = useState(null);   // session best
  const [countdown,   setCountdown]   = useState(3);
  const [streakLabel, setStreakLabel] = useState(null);

  const timeoutRef   = useRef(null);
  const countdownRef = useRef(null);
  const bgAnim       = useRef(new Animated.Value(0)).current;
  const pulseAnim    = useRef(new Animated.Value(1)).current;
  const overlayAnim  = useRef(new Animated.Value(0)).current;
  const streakAnim   = useRef(new Animated.Value(0)).current;
  const countdownAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => () => {
    clearTimeout(timeoutRef.current);
    clearInterval(countdownRef.current);
  }, []);

  const diff = DIFFICULTY[difficulty];

  const bgColor = bgAnim.interpolate({
    inputRange:  [0, 1, 2],
    outputRange: ["#0d0118", "#0a3320", "#3a0a0a"],
  });

  // ── Schedule green flash ──────────────────────────────────────────────────
  const scheduleGo = () => {
    const delay = diff.minDelay + Math.random() * (diff.maxDelay - diff.minDelay);
    timeoutRef.current = setTimeout(() => {
      setPhase(STATE.GO);
      setStartMs(Date.now());
      haptic("go");
      Animated.timing(bgAnim, { toValue: 1, duration: 80, useNativeDriver: false }).start();
      Animated.loop(
        Animated.sequence([
          Animated.spring(pulseAnim, { toValue: 1.35, tension: 220, friction: 4, useNativeDriver: true }),
          Animated.spring(pulseAnim, { toValue: 1,    tension: 200, friction: 4, useNativeDriver: true }),
        ]),
        { iterations: 4 }
      ).start();
    }, delay);
  };

  // ── Start a round (no countdown) ─────────────────────────────────────────
  const startRound = () => {
    clearTimeout(timeoutRef.current);
    setPhase(STATE.WAITING);
    setLastMs(null);
    Animated.timing(bgAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    scheduleGo();
  };

  // ── Countdown before game starts ─────────────────────────────────────────
  const startGame = (diffKey) => {
    clearTimeout(timeoutRef.current);
    clearInterval(countdownRef.current);
    const d = diffKey || difficulty;
    setDifficulty(d);
    setRound(0);
    setTimes([]);
    setEarlyCount(0);
    setStreak(0);
    setStreakLabel(null);
    setLastMs(null);
    overlayAnim.setValue(0);
    bgAnim.setValue(0);

    // 3-2-1 countdown
    setCountdown(3);
    setPhase(STATE.COUNTDOWN);
    let count = 3;
    countdownRef.current = setInterval(() => {
      haptic("countdown");
      countdownAnim.setValue(1.4);
      Animated.spring(countdownAnim, { toValue: 1, tension: 150, friction: 6, useNativeDriver: true }).start();
      count -= 1;
      if (count === 0) {
        clearInterval(countdownRef.current);
        setCountdown(null);
        setRound(1);
        startRound();
      } else {
        setCountdown(count);
      }
    }, 900);
  };

  // ── Show streak popup then clear ─────────────────────────────────────────
  const showStreakPopup = (newStreak) => {
    const sl = getStreakLabel(newStreak);
    if (!sl) return;
    setStreakLabel(sl);
    streakAnim.setValue(0);
    Animated.spring(streakAnim, { toValue: 1, tension: 100, friction: 6, useNativeDriver: true }).start(() => {
      setTimeout(() => {
        Animated.timing(streakAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => setStreakLabel(null));
      }, 900);
    });
    haptic("streak");
  };

  // ── Handle tap ───────────────────────────────────────────────────────────
  const handleTap = useCallback(() => {
    if (phase === STATE.WAITING) {
      clearTimeout(timeoutRef.current);
      haptic("early");
      setEarlyCount((c) => c + 1);
      setStreak(0);
      setStreakLabel(null);
      setPhase(STATE.EARLY);
      Animated.timing(bgAnim, { toValue: 2, duration: 80, useNativeDriver: false }).start();

      const penaltyTimes = [...times, diff.penalty];
      setTimes(penaltyTimes);
      const nextRound = round + 1;
      if (nextRound > TOTAL_ROUNDS) {
        finishGame(penaltyTimes, 0);
      } else {
        setRound(nextRound);
        setTimeout(() => startRound(), 1300);
      }
      return;
    }

    if (phase === STATE.GO) {
      const reaction = Date.now() - startMs;
      haptic("tap");
      setLastMs(reaction);

      // update best ever
      setBestEver((prev) => (prev === null || reaction < prev ? reaction : prev));

      // streak: consecutive rounds under 350 ms (not penalty)
      const newStreak = reaction < 350 ? streak + 1 : 0;
      setStreak(newStreak);
      showStreakPopup(newStreak);

      const newTimes = [...times, reaction];
      setTimes(newTimes);
      setPhase(STATE.IDLE);
      Animated.timing(bgAnim, { toValue: 0, duration: 300, useNativeDriver: false }).start();

      const nextRound = round + 1;
      if (nextRound > TOTAL_ROUNDS) {
        finishGame(newTimes, newStreak);
      } else {
        setRound(nextRound);
        setTimeout(() => startRound(), 900);
      }
    }
  }, [phase, round, times, startMs, streak, diff]);

  const finishGame = (finalTimes, finalStreak) => {
    haptic("win");
    setPhase(STATE.RESULT);
    Animated.spring(overlayAnim, { toValue: 1, tension: 50, friction: 9, useNativeDriver: true }).start();
  };

  const cleanTimes = times.filter((t) => t < diff.penalty);
  const avg  = times.length   ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  const best = cleanTimes.length ? Math.min(...cleanTimes) : 0;
  const rating = getRating(avg);

  // ── IDLE / Start screen ───────────────────────────────────────────────────
  if (phase === STATE.IDLE && round === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
        <Header onBack={() => navigation.goBack()} onReset={null} showReset={false} />
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

          {/* Difficulty selector */}
          <Text style={styles.diffLabel}>SELECT DIFFICULTY</Text>
          <View style={styles.diffRow}>
            {Object.entries(DIFFICULTY).map(([key, d]) => (
              <Pressable
                key={key}
                style={[
                  styles.diffBtn,
                  { borderColor: d.color + "66" },
                  difficulty === key && { backgroundColor: d.color + "22", borderColor: d.color },
                ]}
                onPress={() => setDifficulty(key)}
              >
                <Text style={styles.diffBtnIcon}>{d.icon}</Text>
                <Text style={[styles.diffBtnLabel, { color: difficulty === key ? d.color : "#9e86b8" }]}>
                  {d.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.rulesBox}>
            <RuleRow icon={<CheckCircle   size={scale(13)} color="#4caf50" />} text="5 rounds per game" />
            <RuleRow icon={<AlertTriangle size={scale(13)} color="#ff9800" />} text={`Early tap = +${DIFFICULTY[difficulty].penalty} ms penalty`} />
            <RuleRow icon={<Flame         size={scale(13)} color="#ff6030" />} text="3 fast taps in a row = streak bonus 🔥" />
            <RuleRow icon={<TrendingDown  size={scale(13)} color="#00ffff" />} text="Lower average = better score" />
          </View>

          {bestEver && (
            <View style={styles.sessionBestBanner}>
              <Star size={scale(12)} color="#ffd700" strokeWidth={2} />
              <Text style={styles.sessionBestText}>Session Best: {bestEver} ms</Text>
            </View>
          )}

          <Pressable style={[styles.startBtn, { backgroundColor: diff.color }]} onPress={() => startGame()}>
            <PlayCircle size={scale(18)} color="#0d0118" strokeWidth={2.5} />
            <Text style={styles.startBtnText}>  Start Game</Text>
          </Pressable>
        </View>
        <GameBannerAd bottom size="adaptive" />
      </SafeAreaView>
    );
  }

  // ── Countdown screen ──────────────────────────────────────────────────────
  if (phase === STATE.COUNTDOWN) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
        <Header onBack={() => navigation.goBack()} onReset={null} showReset={false} />
        <View style={styles.countdownScreen}>
          <Text style={styles.getReadyText}>GET READY!</Text>
          <Animated.Text
            style={[styles.countdownNumber, { transform: [{ scale: countdownAnim }] }]}
          >
            {countdown}
          </Animated.Text>
          <Text style={styles.diffIndicator}>
            {diff.icon}  {diff.label} Mode
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Active game ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
      <Header onBack={() => navigation.goBack()} onReset={() => startGame(difficulty)} showReset />

      {/* Round dots */}
      <View style={styles.roundRow}>
        {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.roundDot,
              i < round - 1  && styles.roundDotDone,
              i === round - 1 && styles.roundDotActive,
            ]}
          />
        ))}
      </View>
      <View style={styles.roundMeta}>
        <Text style={styles.roundLabel}>
          Round {Math.min(round, TOTAL_ROUNDS)} / {TOTAL_ROUNDS}
        </Text>
        <View style={[styles.diffPill, { borderColor: diff.color + "55", backgroundColor: diff.color + "18" }]}>
          <Text style={[styles.diffPillText, { color: diff.color }]}>{diff.icon} {diff.label}</Text>
        </View>
      </View>

      {/* Streak popup */}
      {streakLabel && (
        <Animated.View
          style={[
            styles.streakPopup,
            { borderColor: streakLabel.color + "66" },
            {
              opacity: streakAnim,
              transform: [{ scale: streakAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
            },
          ]}
        >
          <Text style={[styles.streakPopupText, { color: streakLabel.color }]}>
            {streakLabel.label}
          </Text>
        </Animated.View>
      )}

      {/* Tap zone */}
      <Animated.View style={[styles.tapZone, { backgroundColor: bgColor }]}>
        <Pressable style={styles.tapZoneInner} onPress={handleTap}>
          {phase === STATE.WAITING && (
            <>
              <Timer size={scale(40)} color="#9e86b8" strokeWidth={1.5} />
              <Text style={styles.tapHint}>Wait for it…</Text>
              {streak >= 2 && (
                <View style={styles.streakBadge}>
                  <Flame size={scale(11)} color="#ff6030" />
                  <Text style={styles.streakBadgeText}> {streak} streak</Text>
                </View>
              )}
            </>
          )}
          {phase === STATE.GO && (
            <>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Zap size={scale(68)} color="#4caf50" fill="#4caf5055" strokeWidth={1.5} />
              </Animated.View>
              <Text style={styles.tapGoText}>TAP NOW!</Text>
            </>
          )}
          {phase === STATE.EARLY && (
            <>
              <AlertTriangle size={scale(44)} color="#ff4081" strokeWidth={1.5} />
              <Text style={styles.tapEarlyText}>TOO EARLY!</Text>
              <Text style={styles.tapEarlySubtext}>+{diff.penalty} ms penalty</Text>
            </>
          )}
          {phase === STATE.IDLE && lastMs !== null && (
            <>
              <CheckCircle size={scale(44)} color="#00ffff" strokeWidth={1.5} />
              <Text style={styles.tapResultMs}>{lastMs} ms</Text>
              {lastMs < 200 && <Text style={styles.tapResultBadge}>⚡ Incredible!</Text>}
              {lastMs >= 200 && lastMs < 280 && <Text style={styles.tapResultBadge}>🎯 Great!</Text>}
              {bestEver === lastMs && <Text style={[styles.tapResultBadge, { color: "#ffd700" }]}>🏆 Session Best!</Text>}
              <Text style={styles.tapHint}>Get ready…</Text>
            </>
          )}
        </Pressable>
      </Animated.View>

      {/* Live history */}
      {times.length > 0 && (
        <View style={styles.timesPanel}>
          <Text style={styles.timesPanelTitle}>Round History</Text>
          {times.map((t, i) => <ReactionBar key={i} ms={t} index={i} />)}
          {times.length > 1 && (
            <Text style={styles.liveAvg}>
              Live Avg: <Text style={{ color: "#00ffff", fontWeight: "900" }}>
                {Math.round(times.reduce((a, b) => a + b, 0) / times.length)} ms
              </Text>
            </Text>
          )}
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
              <WinStat label="Avg"       value={`${avg} ms`}  color="#00ffff" />
              <View style={styles.winStatDivider} />
              <WinStat label="Best"      value={`${best || "—"} ms`} color="#ffd700" />
              <View style={styles.winStatDivider} />
              <WinStat label="Penalties" value={earlyCount}    color="#ff4081" />
              <View style={styles.winStatDivider} />
              <WinStat label="Streak"    value={`${streak}🔥`} color="#ff9800" />
            </View>

            {bestEver && bestEver === best && (
              <View style={styles.newBestBanner}>
                <Star size={scale(12)} color="#ffd700" />
                <Text style={styles.newBestText}> New Session Best!</Text>
              </View>
            )}

            <View style={{ width: "100%", marginBottom: scale(16) }}>
              {times.map((t, i) => <ReactionBar key={i} ms={t} index={i} />)}
            </View>

            {/* Play Again → show interstitial then restart */}
            <Pressable
              style={[styles.playAgainBtn, { backgroundColor: diff.color }]}
              onPress={() => showAd(() => startGame(difficulty))}
            >
              <PlayCircle size={scale(16)} color="#0d0118" strokeWidth={2.5} />
              <Text style={styles.playAgainText}>  Play Again</Text>
            </Pressable>

            {/* Change difficulty */}
            <Pressable
              style={styles.changeDiffBtn}
              onPress={() => {
                setPhase(STATE.IDLE);
                setRound(0);
              }}
            >
              <Target size={scale(13)} color="#9e86b8" strokeWidth={2} />
              <Text style={styles.changeDiffText}>  Change Difficulty</Text>
            </Pressable>

            {/* Back → show interstitial then go back */}
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
        <Text style={styles.headerTitle}>Reaction Rush</Text>
      </View>
      {showReset ? (
        <Pressable style={styles.iconBtn} onPress={onReset}>
          <RefreshCw size={scale(16)} color="#fff" strokeWidth={2.5} />
        </Pressable>
      ) : (
        <View style={styles.iconBtn} />
      )}
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

  // Header
  header: { width: "100%", flexDirection: "row", alignItems: "center", paddingHorizontal: scale(16), paddingTop: scale(12), paddingBottom: scale(8) },
  iconBtn: { width: scale(38), height: scale(38), borderRadius: scale(12), backgroundColor: "#1f0a3a", borderWidth: 1, borderColor: "#ffffff18", justifyContent: "center", alignItems: "center", elevation: 3 },
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: scale(17), fontWeight: "900", letterSpacing: 1.5, color: "#ffd700" },

  // Start screen
  startScreen: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: scale(24) },
  bigIconRing: { width: scale(110), height: scale(110), borderRadius: scale(55), backgroundColor: "#1f0a3a", borderWidth: 2, borderColor: "#ffd70044", justifyContent: "center", alignItems: "center", marginBottom: scale(20), elevation: 8 },
  gameTitle: { fontSize: scale(28), fontWeight: "900", color: "#ffd700", letterSpacing: 2, marginBottom: scale(8), textShadowColor: "#ffd70099", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  gameSubtitle: { fontSize: scale(13), color: "#9e86b8", textAlign: "center", lineHeight: scale(20), marginBottom: scale(18) },

  // Difficulty
  diffLabel: { fontSize: scale(10), color: "#9e86b8", fontWeight: "800", letterSpacing: 2, marginBottom: scale(10) },
  diffRow: { flexDirection: "row", gap: scale(8), marginBottom: scale(18), width: "100%" },
  diffBtn: { flex: 1, borderRadius: scale(12), borderWidth: 1.5, paddingVertical: scale(10), alignItems: "center", gap: scale(4), backgroundColor: "#160728" },
  diffBtnIcon: { fontSize: scale(16) },
  diffBtnLabel: { fontSize: scale(11), fontWeight: "800", letterSpacing: 0.5 },

  // Rules
  rulesBox: { backgroundColor: "#160728", borderRadius: scale(14), padding: scale(14), width: "100%", marginBottom: scale(16), gap: scale(9), borderWidth: 1, borderColor: "#ffffff10" },
  ruleRow: { flexDirection: "row", alignItems: "center", gap: scale(8) },
  ruleText: { fontSize: scale(12), color: "#c9b8e8", fontWeight: "500" },

  // Session best banner
  sessionBestBanner: { flexDirection: "row", alignItems: "center", gap: scale(5), backgroundColor: "#1f1400", borderRadius: scale(20), paddingHorizontal: scale(14), paddingVertical: scale(6), borderWidth: 1, borderColor: "#ffd70033", marginBottom: scale(16) },
  sessionBestText: { fontSize: scale(12), color: "#ffd700", fontWeight: "700" },

  startBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: scale(36), paddingVertical: scale(14), borderRadius: scale(25), elevation: 6 },
  startBtnText: { fontSize: scale(15), fontWeight: "900", color: "#0d0118" },

  // Countdown screen
  countdownScreen: { flex: 1, justifyContent: "center", alignItems: "center", gap: scale(16) },
  getReadyText: { fontSize: scale(18), fontWeight: "900", color: "#9e86b8", letterSpacing: 3 },
  countdownNumber: { fontSize: scale(100), fontWeight: "900", color: "#ffd700", textShadowColor: "#ffd70099", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20 },
  diffIndicator: { fontSize: scale(14), color: "#9e86b8", fontWeight: "700", letterSpacing: 1 },

  // Round dots
  roundRow: { flexDirection: "row", gap: scale(8), marginTop: scale(2), marginBottom: scale(4) },
  roundDot: { width: scale(10), height: scale(10), borderRadius: 99, backgroundColor: "#1f0a3a", borderWidth: 1, borderColor: "#ffffff20" },
  roundDotDone: { backgroundColor: "#ffd70088", borderColor: "#ffd700" },
  roundDotActive: { backgroundColor: "#ffd700", borderColor: "#ffd700", elevation: 4 },
  roundMeta: { flexDirection: "row", alignItems: "center", gap: scale(10), marginBottom: scale(12) },
  roundLabel: { fontSize: scale(11), color: "#9e86b8", fontWeight: "700", letterSpacing: 0.5 },
  diffPill: { borderRadius: 99, borderWidth: 1, paddingHorizontal: scale(10), paddingVertical: scale(3) },
  diffPillText: { fontSize: scale(10), fontWeight: "800", letterSpacing: 0.5 },

  // Streak popup
  streakPopup: { position: "absolute", top: scale(140), zIndex: 50, backgroundColor: "#1a0b2e", borderRadius: scale(20), paddingHorizontal: scale(18), paddingVertical: scale(8), borderWidth: 1.5 },
  streakPopupText: { fontSize: scale(14), fontWeight: "900", letterSpacing: 1 },

  // Tap zone
  tapZone: { width: SCREEN_WIDTH - scale(32), height: SCREEN_WIDTH - scale(32), borderRadius: scale(24), borderWidth: 1.5, borderColor: "#ffffff14", marginBottom: scale(16), overflow: "hidden" },
  tapZoneInner: { flex: 1, justifyContent: "center", alignItems: "center", gap: scale(10) },
  tapHint: { fontSize: scale(16), color: "#9e86b8", fontWeight: "600" },
  tapGoText: { fontSize: scale(34), fontWeight: "900", color: "#4caf50", letterSpacing: 3, textShadowColor: "#4caf5099", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12 },
  tapEarlyText: { fontSize: scale(26), fontWeight: "900", color: "#ff4081", letterSpacing: 2 },
  tapEarlySubtext: { fontSize: scale(13), color: "#ff408188", fontWeight: "700" },
  tapResultMs: { fontSize: scale(42), fontWeight: "900", color: "#00ffff", textShadowColor: "#00ffff88", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12 },
  tapResultBadge: { fontSize: scale(13), color: "#4caf50", fontWeight: "800" },
  streakBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#1f0a0a", borderRadius: 99, paddingHorizontal: scale(10), paddingVertical: scale(4), borderWidth: 1, borderColor: "#ff603044" },
  streakBadgeText: { fontSize: scale(11), color: "#ff6030", fontWeight: "800" },

  // Live history
  timesPanel: { width: SCREEN_WIDTH - scale(32), backgroundColor: "#160728", borderRadius: scale(14), padding: scale(12), borderWidth: 1, borderColor: "#ffffff10" },
  timesPanelTitle: { fontSize: scale(10), color: "#9e86b8", fontWeight: "700", letterSpacing: 1, marginBottom: scale(6) },
  liveAvg: { fontSize: scale(11), color: "#9e86b8", fontWeight: "600", textAlign: "right", marginTop: scale(2) },

  // Result overlay
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.93)", justifyContent: "center", alignItems: "center", zIndex: 99 },
  winCard: { backgroundColor: "#100520", borderRadius: scale(24), borderWidth: 1.5, borderColor: "#ffd70044", padding: scale(22), alignItems: "center", width: SCREEN_WIDTH - scale(48) },
  trophyRing: { width: scale(76), height: scale(76), borderRadius: scale(38), backgroundColor: "#1f0a3a", borderWidth: 2, borderColor: "#ffd70044", justifyContent: "center", alignItems: "center", marginBottom: scale(10), elevation: 6 },
  winTitle: { fontSize: scale(26), fontWeight: "900", color: "#ffd700", letterSpacing: 3, marginBottom: scale(4) },
  winEmoji: { fontSize: scale(28), marginBottom: scale(4) },
  perfBadge: { backgroundColor: "#1a0b2e", borderRadius: scale(20), paddingHorizontal: scale(14), paddingVertical: scale(5), marginBottom: scale(14), borderWidth: 1, borderColor: "#ffffff14" },
  winPerf: { fontSize: scale(14), fontWeight: "800" },
  winStatsRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#0d0118", borderRadius: scale(14), paddingVertical: scale(10), paddingHorizontal: scale(10), marginBottom: scale(12), gap: scale(10), borderWidth: 1, borderColor: "#ffffff0e", width: "100%", justifyContent: "center" },
  winStat: { alignItems: "center", gap: scale(2) },
  winStatValue: { fontSize: scale(14), fontWeight: "900" },
  winStatLabel: { fontSize: scale(9), color: "#9e86b8", fontWeight: "600", letterSpacing: 0.5 },
  winStatDivider: { width: 1, height: scale(34), backgroundColor: "#ffffff14" },

  newBestBanner: { flexDirection: "row", alignItems: "center", backgroundColor: "#1f1400", borderRadius: scale(20), paddingHorizontal: scale(14), paddingVertical: scale(5), borderWidth: 1, borderColor: "#ffd70044", marginBottom: scale(12) },
  newBestText: { fontSize: scale(12), color: "#ffd700", fontWeight: "800" },

  playAgainBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: scale(30), paddingVertical: scale(12), borderRadius: scale(25), marginBottom: scale(8), elevation: 5 },
  playAgainText: { fontSize: scale(14), fontWeight: "900", color: "#0d0118" },
  changeDiffBtn: { flexDirection: "row", alignItems: "center", paddingVertical: scale(6), marginBottom: scale(2) },
  changeDiffText: { fontSize: scale(12), color: "#9e86b8", fontWeight: "600" },
  exitBtn: { flexDirection: "row", alignItems: "center", paddingVertical: scale(6) },
  exitText: { fontSize: scale(12), color: "#9e86b8", fontWeight: "600" },
});