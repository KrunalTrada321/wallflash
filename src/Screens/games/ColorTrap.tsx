// Screens/Games/ColorTrap.js
//
// HOW TO PLAY:
//   A color word is shown in a DIFFERENT ink color.
//   Tap the button that matches the INK COLOR — not the word text!
//   30 seconds. Every 5 correct raises the difficulty.

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, StyleSheet, Pressable,
  Animated, StatusBar, SafeAreaView,
  ScrollView, Platform, Vibration, Dimensions,
} from "react-native";
import { scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft, RefreshCw, Palette,
  Trophy, ChevronLeft, PlayCircle,
  CheckCircle, XCircle, Zap, Brain, Eye, EyeOff,
} from "lucide-react-native";
import GameBannerAd from "../../Components/GameBannerAd";
import { useInterstitialAd } from "../../Components/Useinterstitialad";

const SCREEN_WIDTH  = Dimensions.get("window").width;
const GAME_DURATION = 30;

// ─── Color pool ───────────────────────────────────────────────────────────────
const ALL_COLORS = [
  { name: "RED",    hex: "#ff4b4b" },
  { name: "BLUE",   hex: "#4b9fff" },
  { name: "GREEN",  hex: "#4caf50" },
  { name: "YELLOW", hex: "#ffd700" },
  { name: "PINK",   hex: "#ff00ff" },
  { name: "CYAN",   hex: "#00e5ff" },
  { name: "ORANGE", hex: "#ff9800" },
  { name: "WHITE",  hex: "#ffffff" },
];

// ─── Haptics ──────────────────────────────────────────────────────────────────
const haptic = (key) => {
  const map = {
    correct: Platform.OS === "android" ? [0, 35, 30, 35] : 40,
    wrong:   Platform.OS === "android" ? [0, 80, 40, 80] : 80,
    win:     Platform.OS === "android" ? [0, 60, 40, 60, 40, 100] : 100,
  };
  const p = map[key];
  if (!p) return;
  Array.isArray(p) ? Vibration.vibrate(p) : Vibration.vibrate(p);
};

// ─── Question generator ───────────────────────────────────────────────────────
function generateQuestion(level) {
  const pool    = ALL_COLORS.slice(0, Math.min(4 + level, ALL_COLORS.length));
  const inkIdx  = Math.floor(Math.random() * pool.length);
  let   wordIdx = Math.floor(Math.random() * pool.length);
  while (wordIdx === inkIdx) wordIdx = Math.floor(Math.random() * pool.length);

  const inkColor  = pool[inkIdx];
  const wordColor = pool[wordIdx];
  const wrong     = pool.filter((_, i) => i !== inkIdx).sort(() => Math.random() - 0.5).slice(0, 3);
  const choices   = [...wrong, inkColor].sort(() => Math.random() - 0.5);

  return { word: wordColor.name, inkColor, choices };
}

// ─── Rating ───────────────────────────────────────────────────────────────────
function getRating(score) {
  if (score >= 25) return { label: "UNTRAPABLE",  color: "#ffd700", icon: "🧠" };
  if (score >= 18) return { label: "SHARP MIND",  color: "#00ffff", icon: "⚡" };
  if (score >= 12) return { label: "FOCUSED",     color: "#4caf50", icon: "🎯" };
  if (score >= 6)  return { label: "GETTING IT",  color: "#ff9800", icon: "👌" };
  return                  { label: "DON'T READ",  color: "#ff4081", icon: "🤯" };
}

// ─── Pulsing glow ring (idle screen) ─────────────────────────────────────────
function GlowRing({ color, size, children }) {
  const pulse = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1,   duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.6, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={{
        position: "absolute",
        width: size + scale(24),
        height: size + scale(24),
        borderRadius: (size + scale(24)) / 2,
        backgroundColor: color + "1C",
        opacity: pulse,
      }} />
      <View style={{
        width: size, height: size,
        borderRadius: size / 2,
        backgroundColor: color + "12",
        borderWidth: 1.5,
        borderColor: color + "55",
        justifyContent: "center",
        alignItems: "center",
      }}>
        {children}
      </View>
    </View>
  );
}

// ─── Level dots ───────────────────────────────────────────────────────────────
function LevelDots({ level, max = 5 }) {
  return (
    <View style={{ flexDirection: "row", gap: scale(4), alignItems: "center" }}>
      {Array.from({ length: max }).map((_, i) => (
        <View key={i} style={{
          width: scale(6), height: scale(6), borderRadius: scale(3),
          backgroundColor: i < level ? "#ff00ff" : "#ffffff18",
        }} />
      ))}
    </View>
  );
}
 
// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ColorTrap() {
  const navigation = useNavigation();
  const { showAd } = useInterstitialAd(); // ← hook

  const [phase,    setPhase]    = useState("idle");
  const [q,        setQ]        = useState(null);
  const [score,    setScore]    = useState(0);
  const [streak,   setStreak]   = useState(0);
  const [level,    setLevel]    = useState(1);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [correct,  setCorrect]  = useState(0);
  const [wrong,    setWrong]    = useState(0);
  const [chosen,   setChosen]   = useState(null);
  const [feedback, setFeedback] = useState(null);

  const timerRef     = useRef(null);
  const overlayAnim  = useRef(new Animated.Value(0)).current;
  const shakeAnim    = useRef(new Animated.Value(0)).current;
  const popAnim      = useRef(new Animated.Value(1)).current;
  const wordGlowAnim = useRef(new Animated.Value(0)).current;
  const timerAnim    = useRef(new Animated.Value(1)).current;
  const flashAnim    = useRef(new Animated.Value(0)).current;
  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const headerAnim   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    return () => clearInterval(timerRef.current);
  }, []);

  const nextQuestion = useCallback((lvl) => {
    setQ(generateQuestion(lvl));
    setChosen(null);
    setFeedback(null);
    wordGlowAnim.setValue(0);
    Animated.sequence([
      Animated.timing(popAnim,      { toValue: 0.88, duration: 70,  useNativeDriver: true }),
      Animated.spring(popAnim,      { toValue: 1,    tension: 220, friction: 6, useNativeDriver: true }),
      Animated.timing(wordGlowAnim, { toValue: 1,    duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const startGame = () => {
    clearInterval(timerRef.current);
    setScore(0); setStreak(0); setLevel(1);
    setCorrect(0); setWrong(0);
    setTimeLeft(GAME_DURATION);
    setFeedback(null);
    overlayAnim.setValue(0);
    timerAnim.setValue(1);
    flashAnim.setValue(0);
    setPhase("playing");
    nextQuestion(1);

    Animated.timing(timerAnim, {
      toValue: 0, duration: GAME_DURATION * 1000, useNativeDriver: false,
    }).start();

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); endGame(); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    clearInterval(timerRef.current);
    setPhase("over");
    haptic("win");
    Animated.spring(overlayAnim, { toValue: 1, tension: 50, friction: 9, useNativeDriver: true }).start();
  };

  const flashScreen = (isCorrect) => {
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: isCorrect ? 1 : 2, duration: 80,  useNativeDriver: false }),
      Animated.timing(flashAnim, { toValue: 0,                  duration: 300, useNativeDriver: false }),
    ]).start();
  };

  const showFeedback = (isCorrect) => {
    setFeedback(isCorrect ? "correct" : "wrong");
    feedbackAnim.setValue(0);
    Animated.sequence([
      Animated.spring(feedbackAnim, { toValue: 1, tension: 200, friction: 6, useNativeDriver: true }),
      Animated.delay(280),
      Animated.timing(feedbackAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const handleAnswer = (choice) => {
    if (chosen !== null) return;
    setChosen(choice);

    const isCorrect = choice.name === q.inkColor.name;

    if (isCorrect) {
      haptic("correct");
      flashScreen(true);
      showFeedback(true);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore((s) => s + (newStreak >= 3 ? 2 : 1));
      setCorrect((c) => {
        const nc  = c + 1;
        const nlv = Math.min(5, Math.floor(nc / 5) + 1);
        setLevel(nlv);
        setTimeout(() => nextQuestion(nlv), 460);
        return nc;
      });
    } else {
      haptic("wrong");
      flashScreen(false);
      showFeedback(false);
      setStreak(0);
      setWrong((w) => w + 1);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 14,  duration: 45, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -14, duration: 45, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8,   duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0,   duration: 40, useNativeDriver: true }),
      ]).start();
      setTimeout(() => nextQuestion(level), 660);
    }
  };

  const bgColor = flashAnim.interpolate({
    inputRange:  [0, 1, 2],
    outputRange: ["#0d0118", "#091f12", "#200910"],
  });

  const timerBarColor = timerAnim.interpolate({
    inputRange:  [0, 0.3, 0.7, 1],
    outputRange: ["#ff4081", "#ff9800", "#ff00ff", "#ff00ff"],
  });

  // ── IDLE ────────────────────────────────────────────────────────────────────
  if (phase === "idle") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0d0118" />

        <Animated.View style={{
          opacity: headerAnim,
          transform: [{ translateY: headerAnim.interpolate({ inputRange: [0,1], outputRange: [-16,0] }) }],
          width: "100%",
        }}>
          <Header onBack={() => navigation.goBack()} />
        </Animated.View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.idleContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <GlowRing color="#ff00ff" size={scale(110)}>
            <Palette size={scale(48)} color="#ff00ff" strokeWidth={1.4} />
          </GlowRing>

          <View style={styles.idleTitleBlock}>
            <Text style={styles.idleSubLabel}>STROOP CHALLENGE</Text>
            <Text style={styles.idleTitle}>Color Trap</Text>
            <Text style={styles.idleTagline}>Your eyes will lie. Trust your brain.</Text>
          </View>

          {/* Demo card */}
          <View style={styles.demoCard}>
            <View style={styles.demoCardHeader}>
              <Eye size={scale(11)} color="#ff00ff" strokeWidth={2.5} />
              <Text style={styles.demoCardLabel}>  HOW TO PLAY</Text>
            </View>
            <View style={styles.demoWordBox}>
              <Text style={[styles.demoWordText, { color: "#4b9fff" }]}>RED</Text>
            </View>
            <View style={styles.demoRow}>
              <EyeOff size={scale(11)} color="#9e86b8" strokeWidth={2} />
              <Text style={styles.demoRowText}>  Don't read the word</Text>
            </View>
            <View style={styles.demoRow}>
              <Eye size={scale(11)} color="#4b9fff" strokeWidth={2} />
              <Text style={styles.demoRowText}>  Tap the INK color →{" "}
                <Text style={{ color: "#4b9fff", fontWeight: "900" }}>BLUE</Text>
              </Text>
            </View>
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

  // ── PLAYING + GAME OVER ───────────────────────────────────────────────────
  return (
    <Animated.View style={[styles.flex, { backgroundColor: bgColor }]}>
      <SafeAreaView style={[styles.flex, styles.playingRoot]}>
        <StatusBar barStyle="light-content" backgroundColor="#0d0118" />

        <Header onBack={() => navigation.goBack()} onReset={startGame} showReset />

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatPill label="SCORE"  value={String(score)}                                   color="#ff00ff" />
          <StatPill label="STREAK" value={streak >= 3 ? `🔥 ${streak}` : String(streak)}  color={streak >= 3 ? "#ffd700" : "#ff9800"} urgent={streak >= 3} />
          <StatPill label="LEVEL"  value={null} extra={<LevelDots level={level} />}         color="#a78bfa" />
          <StatPill label="TIME"   value={String(timeLeft)}                                 color={timeLeft <= 8 ? "#ff4081" : "#00ffff"} urgent={timeLeft <= 8} />
        </View>

        {/* Timer bar */}
        <View style={styles.timerTrack}>
          <Animated.View style={[
            styles.timerFill,
            {
              width: timerAnim.interpolate({ inputRange: [0,1], outputRange: ["0%","100%"] }),
              backgroundColor: timerBarColor,
            },
          ]} />
          {[...Array(5)].map((_, i) => (
            <View key={i} style={[styles.timerTick, { left: `${(i + 1) * 16.66}%` }]} />
          ))}
        </View>

        {/* Instruction pill */}
        <View style={styles.instructionPill}>
          <Eye size={scale(10)} color="#ff00ff" strokeWidth={2.5} />
          <Text style={styles.instructionText}>
            {"  "}Tap the{" "}
            <Text style={{ color: "#ff00ff", fontWeight: "900" }}>INK COLOR</Text>
            {" "}— not the word
          </Text>
        </View>

        {/* Word card */}
        {q && (
          <Animated.View style={[
            styles.wordCard,
            { borderColor: q.inkColor.hex + "50", transform: [{ translateX: shakeAnim }, { scale: popAnim }] },
          ]}>
            <Animated.View style={[
              styles.wordGlowBg,
              { backgroundColor: q.inkColor.hex + "0C", opacity: wordGlowAnim },
            ]} />

            {streak >= 3 && (
              <View style={styles.streakBadge}>
                <Zap size={scale(9)} color="#ffd700" fill="#ffd700" />
                <Text style={styles.streakBadgeText}>  ×2 POINTS ACTIVE</Text>
              </View>
            )}

            <Text style={[
              styles.wordText,
              { color: q.inkColor.hex, textShadowColor: q.inkColor.hex + "55" },
            ]}>
              {q.word}
            </Text>

            <View style={[styles.wordFooter, { backgroundColor: q.inkColor.hex + "22" }]}>
              <View style={[styles.inkDot, { backgroundColor: q.inkColor.hex }]} />
              <Text style={[styles.inkHint, { color: q.inkColor.hex + "99" }]}>tap the ink color</Text>
            </View>
          </Animated.View>
        )}

        {/* Floating feedback badge */}
        <Animated.View style={[
          styles.feedbackBadge,
          feedback === "correct" ? styles.fbCorrect : styles.fbWrong,
          {
            opacity: feedbackAnim,
            transform: [{
              scale: feedbackAnim.interpolate({ inputRange: [0,1], outputRange: [0.5,1] }),
            }],
            display: feedback ? "flex" : "none",
          },
        ]}>
          {feedback === "correct"
            ? <CheckCircle size={scale(13)} color="#4caf50" strokeWidth={3} />
            : <XCircle     size={scale(13)} color="#ff4081" strokeWidth={3} />}
          <Text style={[styles.feedbackText, { color: feedback === "correct" ? "#4caf50" : "#ff4081" }]}>
            {"  "}{feedback === "correct" ? (streak >= 3 ? "+2 pts" : "+1 pt") : "WRONG"}
          </Text>
        </Animated.View>

        {/* Choices grid */}
        {q && (
          <View style={styles.choicesGrid}>
            {q.choices.map((c, i) => {
              const isCorrect = c.name === q.inkColor.name;
              const isChosen  = chosen?.name === c.name;
              const revealed  = chosen !== null;

              let borderColor = "#ffffff14";
              let bgColor     = "#160728";
              let txtColor    = "#d4c8f0";
              let swatchOp    = 0.7;

              if (revealed) {
                if (isCorrect)    { borderColor = "#4caf5080"; bgColor = "#0a2e18"; txtColor = "#4caf50"; swatchOp = 1; }
                else if (isChosen){ borderColor = "#ff408180"; bgColor = "#2e0a14"; txtColor = "#ff4081"; swatchOp = 1; }
                else              { txtColor = "#ffffff28"; swatchOp = 0.25; }
              }

              return (
                <Pressable
                  key={i}
                  style={({ pressed }) => [
                    styles.colorBtn,
                    { borderColor, backgroundColor: bgColor },
                    !revealed && pressed && { backgroundColor: c.hex + "1E", borderColor: c.hex + "60" },
                  ]}
                  onPress={() => handleAnswer(c)}
                  disabled={revealed}
                >
                  <View style={[styles.colorSwatch, { backgroundColor: c.hex, opacity: swatchOp }]} />
                  <Text style={[styles.colorBtnText, { color: txtColor }]}>{c.name}</Text>
                  {revealed && isCorrect && (
                    <CheckCircle size={scale(13)} color="#4caf50" style={{ marginLeft: "auto" }} />
                  )}
                  {revealed && isChosen && !isCorrect && (
                    <XCircle size={scale(13)} color="#ff4081" style={{ marginLeft: "auto" }} />
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Game over overlay */}
        {phase === "over" && (
          <Animated.View style={[
            styles.overlay,
            {
              opacity: overlayAnim,
              transform: [{ scale: overlayAnim.interpolate({ inputRange:[0,1], outputRange:[0.88,1] }) }],
            },
          ]}>
            <View style={styles.winCard}>
              <View style={styles.trophyRing}>
                <Trophy size={scale(40)} color="#ffd700" fill="#ffd70022" strokeWidth={1.5} />
              </View>

              <Text style={styles.winTitle}>TIME'S UP!</Text>

              {(() => {
                const r = getRating(score);
                return (
                  <>
                    <Text style={styles.winEmoji}>{r.icon}</Text>
                    <View style={[styles.ratingPill, { borderColor: r.color + "55", backgroundColor: r.color + "12" }]}>
                      <Text style={[styles.ratingText, { color: r.color }]}>{r.label}</Text>
                    </View>
                  </>
                );
              })()}

              <View style={styles.winStatsRow}>
                <WinStat label="SCORE"   value={score}   color="#ff00ff" />
                <View style={styles.winStatDivider} />
                <WinStat label="CORRECT" value={correct} color="#4caf50" />
                <View style={styles.winStatDivider} />
                <WinStat label="WRONG"   value={wrong}   color="#ff4081" />
              </View>

              {(correct + wrong) > 0 && (
                <View style={styles.accuracyBlock}>
                  <View style={styles.accuracyLabelRow}>
                    <Text style={styles.accuracyLabel}>Accuracy</Text>
                    <Text style={styles.accuracyPct}>{Math.round((correct / (correct + wrong)) * 100)}%</Text>
                  </View>
                  <View style={styles.accuracyTrack}>
                    <View style={[styles.accuracyFill, { width: `${Math.round((correct / (correct + wrong)) * 100)}%` }]} />
                  </View>
                </View>
              )}

              {/* Play Again → interstitial then restart */}
              <Pressable
                style={({ pressed }) => [styles.playAgainBtn, pressed && { opacity: 0.88 }]}
                onPress={() => showAd(startGame)}
              >
                <PlayCircle size={scale(17)} color="#0d0118" strokeWidth={2.5} />
                <Text style={styles.playAgainText}>  Play Again</Text>
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

        <GameBannerAd bottom size="banner" />
      </SafeAreaView>
    </Animated.View>
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
        <Palette size={scale(14)} color="#ff00ff" strokeWidth={2} style={{ marginRight: scale(6) }} />
        <Text style={styles.headerTitle}>Color Trap</Text>
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

function StatPill({ label, value, color, urgent, extra }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (urgent) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.08, duration: 340, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1,    duration: 340, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulse.setValue(1);
    }
  }, [urgent]);
  return (
    <Animated.View style={[styles.statPill, { borderColor: color + "44", transform: [{ scale: pulse }] }]}>
      {value !== null && <Text style={[styles.statPillVal, { color }]}>{value}</Text>}
      {extra && <View style={{ marginTop: scale(2) }}>{extra}</View>}
      <Text style={styles.statPillLabel}>{label}</Text>
    </Animated.View>
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
  flex: { flex: 1 },
  container:    { flex: 1, backgroundColor: "#0d0118" },
  playingRoot:  { alignItems: "center" },

  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
    paddingBottom: scale(8),
  },
  iconBtn: {
    width: scale(38), height: scale(38),
    borderRadius: scale(12),
    backgroundColor: "#1f0a3a",
    borderWidth: 1, borderColor: "#ffffff18",
    justifyContent: "center", alignItems: "center",
    elevation: 4,
  },
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  headerTitle: {
    fontSize: scale(17), fontWeight: "900", color: "#ff00ff", letterSpacing: 1.5,
    textShadowColor: "#ff00ff66", textShadowOffset: { width:0, height:0 }, textShadowRadius: 8,
  },

  idleContent: {
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingTop: scale(8),
    paddingBottom: scale(24),
    gap: scale(16),
  },
  idleTitleBlock: { alignItems: "center", gap: scale(4) },
  idleSubLabel: { fontSize: scale(9), fontWeight: "900", color: "#ff00ff88", letterSpacing: 4 },
  idleTitle: {
    fontSize: scale(30), fontWeight: "900", color: "#ffffff", letterSpacing: 1,
    textShadowColor: "#ff00ff44", textShadowOffset: { width:0, height:0 }, textShadowRadius: 10,
  },
  idleTagline: { fontSize: scale(12), color: "#9e86b8", fontWeight: "500", fontStyle: "italic" },

  demoCard: {
    width: "100%", backgroundColor: "#130824",
    borderRadius: scale(16), borderWidth: 1, borderColor: "#ff00ff22",
    padding: scale(14), gap: scale(8),
  },
  demoCardHeader: { flexDirection: "row", alignItems: "center" },
  demoCardLabel:  { fontSize: scale(9), fontWeight: "900", color: "#ff00ff", letterSpacing: 3 },
  demoWordBox: {
    alignItems: "center", backgroundColor: "#0d0118",
    borderRadius: scale(10), paddingVertical: scale(10),
  },
  demoWordText: { fontSize: scale(40), fontWeight: "900", letterSpacing: 4 },
  demoRow:     { flexDirection: "row", alignItems: "center" },
  demoRowText: { fontSize: scale(11), color: "#9e86b8", fontWeight: "500" },

  startBtn: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#ff00ff",
    paddingHorizontal: scale(40), paddingVertical: scale(14),
    borderRadius: scale(25),
    elevation: 8,
  },
  startBtnText: { fontSize: scale(15), fontWeight: "900", color: "#0d0118", letterSpacing: 0.5 },

  statsRow: {
    flexDirection: "row", gap: scale(8),
    paddingHorizontal: scale(16),
    marginBottom: scale(10), width: "100%",
  },
  statPill: {
    flex: 1, backgroundColor: "#160728",
    borderRadius: scale(12), borderWidth: 1,
    paddingVertical: scale(7), alignItems: "center", gap: scale(1),
  },
  statPillVal:   { fontSize: scale(14), fontWeight: "900", letterSpacing: 0.3 },
  statPillLabel: { fontSize: scale(7), color: "#9e86b8", fontWeight: "700", letterSpacing: 1, marginTop: scale(1) },

  timerTrack: {
    width: SCREEN_WIDTH - scale(32), height: scale(7),
    backgroundColor: "#ffffff0e", borderRadius: 99,
    marginBottom: scale(12), overflow: "hidden", position: "relative",
  },
  timerFill: { height: "100%", borderRadius: 99 },
  timerTick:  { position: "absolute", top: "20%", width: 1, height: "60%", backgroundColor: "#ffffff18" },

  instructionPill: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#ff00ff0D",
    borderRadius: scale(20), paddingHorizontal: scale(12), paddingVertical: scale(5),
    borderWidth: 1, borderColor: "#ff00ff22",
    marginBottom: scale(12),
  },
  instructionText: { fontSize: scale(11), color: "#9e86b8", fontWeight: "600", letterSpacing: 0.2 },

  wordCard: {
    width: SCREEN_WIDTH - scale(32),
    backgroundColor: "#130824",
    borderRadius: scale(22), borderWidth: 1.5,
    paddingTop: scale(24), overflow: "hidden",
    alignItems: "center", marginBottom: scale(10),
    minHeight: scale(130),
    elevation: 5,
  },
  wordGlowBg: { ...StyleSheet.absoluteFillObject, borderRadius: scale(22) },
  streakBadge: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#ffd70015", borderRadius: scale(8),
    paddingHorizontal: scale(10), paddingVertical: scale(4),
    marginBottom: scale(10), borderWidth: 1, borderColor: "#ffd70050",
  },
  streakBadgeText: { fontSize: scale(9), color: "#ffd700", fontWeight: "900", letterSpacing: 1 },
  wordText: {
    fontSize: scale(54), fontWeight: "900", letterSpacing: 5,
    textShadowOffset: { width:0, height:0 }, textShadowRadius: 18,
    marginBottom: scale(16),
  },
  wordFooter: {
    width: "100%", flexDirection: "row", alignItems: "center",
    justifyContent: "center", paddingVertical: scale(8), gap: scale(6),
  },
  inkDot:  { width: scale(8), height: scale(8), borderRadius: scale(4) },
  inkHint: { fontSize: scale(9), fontWeight: "700", letterSpacing: 1.5 },

  feedbackBadge: {
    flexDirection: "row", alignItems: "center",
    borderRadius: scale(10), paddingHorizontal: scale(14), paddingVertical: scale(6),
    marginBottom: scale(8), borderWidth: 1,
  },
  fbCorrect: { backgroundColor: "#4caf5015", borderColor: "#4caf5050" },
  fbWrong:   { backgroundColor: "#ff408115", borderColor: "#ff408150" },
  feedbackText: { fontSize: scale(13), fontWeight: "900", letterSpacing: 1 },

  choicesGrid: {
    flexDirection: "row", flexWrap: "wrap",
    width: SCREEN_WIDTH - scale(32), gap: scale(10),
  },
  colorBtn: {
    width: (SCREEN_WIDTH - scale(32) - scale(10)) / 2,
    backgroundColor: "#160728", borderRadius: scale(16), borderWidth: 1.5,
    paddingVertical: scale(14), paddingHorizontal: scale(14),
    flexDirection: "row", alignItems: "center",
    elevation: 3,
  },
  colorSwatch: { width: scale(16), height: scale(16), borderRadius: scale(5), marginRight: scale(8) },
  colorBtnText: { fontSize: scale(13), fontWeight: "800", letterSpacing: 0.8, flex: 1 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5,0,14,0.96)",
    justifyContent: "center", alignItems: "center", zIndex: 99,
  },
  winCard: {
    backgroundColor: "#100520", borderRadius: scale(24),
    borderWidth: 1.5, borderColor: "#ff00ff44",
    padding: scale(24), alignItems: "center",
    width: SCREEN_WIDTH - scale(40),
    elevation: 12,
  },
  trophyRing: {
    width: scale(76), height: scale(76), borderRadius: scale(38),
    backgroundColor: "#1f0a3a", borderWidth: 2, borderColor: "#ffd70044",
    justifyContent: "center", alignItems: "center", marginBottom: scale(12),
    elevation: 6,
  },
  winTitle: {
    fontSize: scale(26), fontWeight: "900", color: "#ffd700", letterSpacing: 5,
    textShadowColor: "#ffd70066", textShadowOffset: { width:0, height:0 }, textShadowRadius: 10,
    marginBottom: scale(6),
  },
  winEmoji: { fontSize: scale(28), marginBottom: scale(6) },
  ratingPill: {
    borderRadius: scale(20), paddingHorizontal: scale(16), paddingVertical: scale(6),
    borderWidth: 1, marginBottom: scale(14),
  },
  ratingText: { fontSize: scale(13), fontWeight: "900", letterSpacing: 2 },

  winStatsRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#0d0118", borderRadius: scale(14),
    paddingVertical: scale(12), paddingHorizontal: scale(16),
    marginBottom: scale(12), gap: scale(16),
    borderWidth: 1, borderColor: "#ffffff0e",
    width: "100%", justifyContent: "center",
  },
  winStat:        { alignItems: "center", gap: scale(3) },
  winStatValue:   { fontSize: scale(20), fontWeight: "900" },
  winStatLabel:   { fontSize: scale(8), color: "#9e86b8", fontWeight: "700", letterSpacing: 1 },
  winStatDivider: { width: 1, height: scale(36), backgroundColor: "#ffffff14" },

  accuracyBlock: { width: "100%", marginBottom: scale(14), gap: scale(6) },
  accuracyLabelRow: { flexDirection: "row", justifyContent: "space-between" },
  accuracyLabel: { fontSize: scale(10), color: "#9e86b8", fontWeight: "700", letterSpacing: 1 },
  accuracyPct:   { fontSize: scale(10), color: "#ff00ff", fontWeight: "900" },
  accuracyTrack: { width: "100%", height: scale(6), backgroundColor: "#ffffff0e", borderRadius: 99, overflow: "hidden" },
  accuracyFill:  { height: "100%", backgroundColor: "#ff00ff", borderRadius: 99 },

  playAgainBtn: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#ff00ff",
    paddingHorizontal: scale(32), paddingVertical: scale(13),
    borderRadius: scale(25), marginBottom: scale(10),
    elevation: 6,
  },
  playAgainText: { fontSize: scale(14), fontWeight: "900", color: "#0d0118", letterSpacing: 0.5 },
  exitBtn: { flexDirection: "row", alignItems: "center", paddingVertical: scale(8) },
  exitText: { fontSize: scale(12), color: "#9e86b8", fontWeight: "600" },
});