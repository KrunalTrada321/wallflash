// Screens/Games/TicTacToe.js
//
// HOW TO PLAY:
//   Choose Single (vs Robot) or Multiplayer (vs Friend)
//   Pick difficulty & grid size: 3×3 / 4×4 / 5×5 / 6×6
//   3×3 → get 3 in a row  |  4×4 → get 4  |  5×5 / 6×6 → get 4 in a row
//   First to complete a line wins. Full board = draw!

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  View, Text, StyleSheet, Pressable,
  Animated, StatusBar, SafeAreaView,
  ScrollView, Platform, Vibration, Dimensions,
} from "react-native";
import { scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft, RefreshCw, Grid3x3,
  ChevronLeft, PlayCircle, ChevronRight,
  Bot, Users, Crown, Minus,
} from "lucide-react-native";
import GameBannerAd from "../../Components/GameBannerAd";
import { useInterstitialAd } from "../../Components/Useinterstitialad";

const SCREEN_WIDTH = Dimensions.get("window").width;
const BOARD_PAD    = scale(20);
const BOARD_SIZE   = SCREEN_WIDTH - BOARD_PAD * 2;
const CELL_GAP     = scale(4);

// ─── Grid configs ─────────────────────────────────────────────────────────────
// winCount = consecutive marks needed to win
const GRID_CONFIGS = [
  { size: 3, winCount: 3, label: "3×3", tag: "CLASSIC",      color: "#a78bfa", emoji: "🟣", desc: "Classic 3-in-a-row"    },
  { size: 4, winCount: 4, label: "4×4", tag: "INTERMEDIATE",  color: "#00e5ff", emoji: "🔵", desc: "4-in-a-row to win"     }
];

// ─── Haptics ──────────────────────────────────────────────────────────────────
const haptic = (key) => {
  const map = {
    tap:  Platform.OS === "android" ? [0, 25]          : 20,
    win:  Platform.OS === "android" ? [0, 60, 40, 100] : 100,
    draw: Platform.OS === "android" ? [0, 40, 30, 40]  : 50,
  };
  const p = map[key];
  if (!p) return;
  Array.isArray(p) ? Vibration.vibrate(p) : Vibration.vibrate(p);
};

// ─── Win-line generator (NxN, K in a row) ────────────────────────────────────
function generateWinLines(N, K) {
  const lines = [];
  for (let r = 0; r < N; r++)
    for (let c = 0; c <= N - K; c++)
      lines.push(Array.from({ length: K }, (_, i) => r * N + c + i));
  for (let c = 0; c < N; c++)
    for (let r = 0; r <= N - K; r++)
      lines.push(Array.from({ length: K }, (_, i) => (r + i) * N + c));
  for (let r = 0; r <= N - K; r++)
    for (let c = 0; c <= N - K; c++)
      lines.push(Array.from({ length: K }, (_, i) => (r + i) * N + c + i));
  for (let r = 0; r <= N - K; r++)
    for (let c = K - 1; c < N; c++)
      lines.push(Array.from({ length: K }, (_, i) => (r + i) * N + c - i));
  return lines;
}

// ─── Win checker ──────────────────────────────────────────────────────────────
function checkWinner(board, N, K, winLines) {
  for (const line of winLines) {
    const first = board[line[0]];
    if (first && line.every(i => board[i] === first))
      return { winner: first, line };
  }
  if (board.every(Boolean)) return { winner: "draw", line: [] };
  return null;
}

// ─── Minimax for 3×3 ─────────────────────────────────────────────────────────
function minimax3(board, isMax, depth, alpha, beta, winLines) {
  const result = checkWinner(board, 3, 3, winLines);
  if (result) {
    if (result.winner === "O") return 10 - depth;
    if (result.winner === "X") return depth - 10;
    return 0;
  }
  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        best = Math.max(best, minimax3(board, false, depth + 1, alpha, beta, winLines));
        board[i] = null;
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "X";
        best = Math.min(best, minimax3(board, true, depth + 1, alpha, beta, winLines));
        board[i] = null;
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  }
}

// ─── Heuristic AI (all sizes) ─────────────────────────────────────────────────
function getAIMove(board, N, K, winLines, difficulty) {
  const empty = board.map((v, i) => (v === null ? i : null)).filter(i => i !== null);
  if (!empty.length) return -1;

  if (difficulty === "easy" && Math.random() < 0.65)
    return empty[Math.floor(Math.random() * empty.length)];

  // Win now
  for (const line of winLines) {
    const vals   = line.map(i => board[i]);
    const nulls  = vals.reduce((a, v, i) => (v === null ? [...a, line[i]] : a), []);
    if (vals.filter(v => v === "O").length === K - 1 && nulls.length === 1) return nulls[0];
  }
  // Block win
  for (const line of winLines) {
    const vals  = line.map(i => board[i]);
    const nulls = vals.reduce((a, v, i) => (v === null ? [...a, line[i]] : a), []);
    if (vals.filter(v => v === "X").length === K - 1 && nulls.length === 1) return nulls[0];
  }

  if (difficulty === "medium" && Math.random() < 0.30)
    return empty[Math.floor(Math.random() * empty.length)];

  // 3×3 hard: full minimax
  if (N === 3 && difficulty === "hard") {
    let bestVal = -Infinity, bestIdx = empty[0];
    const bc = [...board];
    for (const i of empty) {
      bc[i] = "O";
      const val = minimax3([...bc], false, 0, -Infinity, Infinity, winLines);
      bc[i] = null;
      if (val > bestVal) { bestVal = val; bestIdx = i; }
    }
    return bestIdx;
  }

  // Larger boards: heuristic scoring
  const scores = new Array(N * N).fill(0);
  for (const idx of empty) {
    for (const line of winLines) {
      if (!line.includes(idx)) continue;
      const vals   = line.map(i => board[i]);
      const oCount = vals.filter(v => v === "O").length;
      const xCount = vals.filter(v => v === "X").length;
      if (xCount === 0) scores[idx] += Math.pow(3, oCount);
      if (oCount === 0) scores[idx] += Math.pow(3, xCount);
    }
    const r = Math.floor(idx / N), c = idx % N;
    const dist = Math.abs(r - (N - 1) / 2) + Math.abs(c - (N - 1) / 2);
    scores[idx] += Math.max(0, N * 1.5 - dist);
  }
  let best = -Infinity, bestIdx = empty[0];
  for (const idx of empty) {
    if (scores[idx] > best) { best = scores[idx]; bestIdx = idx; }
  }
  return bestIdx;
}

// ─── X Mark ───────────────────────────────────────────────────────────────────
function XMark({ color, size }) {
  const arm = size * 0.62;
  const thick = Math.max(2, size * 0.1);
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View style={{ position:"absolute", width:arm, height:thick, backgroundColor:color, borderRadius:3,
        transform:[{rotate:"45deg"}], shadowColor:color, shadowOffset:{width:0,height:0}, shadowOpacity:0.9, shadowRadius:5 }} />
      <View style={{ position:"absolute", width:arm, height:thick, backgroundColor:color, borderRadius:3,
        transform:[{rotate:"-45deg"}], shadowColor:color, shadowOffset:{width:0,height:0}, shadowOpacity:0.9, shadowRadius:5 }} />
    </View>
  );
}

// ─── O Mark ───────────────────────────────────────────────────────────────────
function OMark({ color, size }) {
  const s = size * 0.62;
  const thick = Math.max(2, size * 0.1);
  return (
    <View style={{ width:s, height:s, borderRadius:s/2, borderWidth:thick, borderColor:color,
      shadowColor:color, shadowOffset:{width:0,height:0}, shadowOpacity:0.9, shadowRadius:5 }} />
  );
}

// ─── Animated Cell ────────────────────────────────────────────────────────────
function Cell({ value, onPress, isWinCell, disabled, cellSize }) {
  const popAnim  = useRef(new Animated.Value(0)).current;
  const prevVal  = useRef(null);

  useEffect(() => {
    if (value && value !== prevVal.current) {
      prevVal.current = value;
      popAnim.setValue(0);
      Animated.spring(popAnim, { toValue:1, tension:220, friction:7, useNativeDriver:true }).start();
    }
  }, [value]);

  const markColor = value === "X" ? "#00e5ff" : "#ff00ff";
  const markSize  = cellSize * 0.52;

  return (
    <Pressable
      style={({ pressed }) => [{
        width: cellSize, height: cellSize,
        backgroundColor: isWinCell ? markColor + "18" : "#160728",
        borderRadius: scale(10), borderWidth: 1,
        borderColor: isWinCell ? markColor + "66" : "#ffffff10",
        justifyContent:"center", alignItems:"center", overflow:"hidden", elevation:2,
      }, !value && !disabled && pressed && { backgroundColor:"#ffffff0A" }]}
      onPress={onPress}
      disabled={!!value || disabled}
    >
      {isWinCell && (
        <View style={[StyleSheet.absoluteFillObject, { borderRadius:scale(10), backgroundColor:markColor+"0C" }]} />
      )}
      {value ? (
        <Animated.View style={{ transform:[{ scale:popAnim }] }}>
          {value === "X" ? <XMark color="#00e5ff" size={markSize} /> : <OMark color="#ff00ff" size={markSize} />}
        </Animated.View>
      ) : null}
    </Pressable>
  );
}

// ─── Glow Ring ────────────────────────────────────────────────────────────────
function GlowRing({ color, size, children }) {
  const pulse = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue:1,   duration:1400, useNativeDriver:true }),
      Animated.timing(pulse, { toValue:0.6, duration:1400, useNativeDriver:true }),
    ])).start();
  }, []);
  return (
    <View style={{ alignItems:"center", justifyContent:"center" }}>
      <Animated.View style={{ position:"absolute", width:size+scale(24), height:size+scale(24),
        borderRadius:(size+scale(24))/2, backgroundColor:color+"1C", opacity:pulse }} />
      <View style={{ width:size, height:size, borderRadius:size/2, backgroundColor:color+"12",
        borderWidth:1.5, borderColor:color+"55", justifyContent:"center", alignItems:"center" }}>
        {children}
      </View>
    </View>
  );
}

// ─── Score Badge ──────────────────────────────────────────────────────────────
function ScoreBadge({ label, icon, value, color, isActive }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (isActive) {
      Animated.loop(Animated.sequence([
        Animated.timing(pulse, { toValue:1.06, duration:500, useNativeDriver:true }),
        Animated.timing(pulse, { toValue:1,    duration:500, useNativeDriver:true }),
      ])).start();
    } else { pulse.stopAnimation(); pulse.setValue(1); }
  }, [isActive]);
  return (
    <Animated.View style={[styles.scoreBadge,
      { borderColor: color + (isActive ? "88" : "30"), transform:[{scale:pulse}] },
      isActive && { backgroundColor: color + "14" },
    ]}>
      <Text style={{ fontSize:scale(13) }}>{icon}</Text>
      <Text style={[styles.scoreBadgeVal, { color }]}>{value}</Text>
      <Text style={styles.scoreBadgeLabel}>{label}</Text>
    </Animated.View>
  );
}

// ─── Mode Card ────────────────────────────────────────────────────────────────
function ModeCard({ icon, title, desc, color, onPress }) {
  const sc = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPressIn ={() => Animated.spring(sc, { toValue:0.95, tension:200, friction:10, useNativeDriver:true }).start()}
      onPressOut={() => Animated.spring(sc, { toValue:1,    tension:200, friction:10, useNativeDriver:true }).start()}
      onPress={onPress}
    >
      <Animated.View style={[styles.modeCard, { borderColor:color+"44", transform:[{scale:sc}] }]}>
        <View style={[styles.modeCardAccent, { backgroundColor:color }]} />
        <View style={[styles.modeIconWrap, { backgroundColor:color+"18", borderColor:color+"44" }]}>{icon}</View>
        <View style={{ flex:1 }}>
          <Text style={[styles.modeCardTitle, { color }]}>{title}</Text>
          <Text style={styles.modeCardDesc}>{desc}</Text>
        </View>
        <ChevronRight size={scale(16)} color={color+"88"} />
      </Animated.View>
    </Pressable>
  );
}

// ─── Difficulty Button ────────────────────────────────────────────────────────
function DiffBtn({ label, emoji, color, selected, onPress }) {
  return (
    <Pressable
      style={[styles.diffBtn, { borderColor:color+(selected?"88":"28"), backgroundColor:selected?color+"18":"#130824" }]}
      onPress={onPress}
    >
      <Text style={{ fontSize:scale(16) }}>{emoji}</Text>
      <Text style={[styles.diffBtnText, { color:selected?color:"#9e86b8" }]}>{label}</Text>
      {selected && <View style={[styles.diffBtnDot, { backgroundColor:color }]} />}
    </Pressable>
  );
}

// ─── Grid Size Card ───────────────────────────────────────────────────────────
function GridCard({ cfg, selected, onPress }) {
  const sc = useRef(new Animated.Value(1)).current;
  const dotSize = (scale(30) - (cfg.size - 1) * 1.5) / cfg.size;
  return (
    <Pressable
      onPressIn ={() => Animated.spring(sc, { toValue:0.95, tension:200, friction:10, useNativeDriver:true }).start()}
      onPressOut={() => Animated.spring(sc, { toValue:1,    tension:200, friction:10, useNativeDriver:true }).start()}
      onPress={onPress}
    >
      <Animated.View style={[styles.gridCard,
        { borderColor: cfg.color + (selected ? "88" : "28"), transform:[{scale:sc}] },
        selected && { backgroundColor: cfg.color + "12" },
      ]}>
        {selected && <View style={[styles.gridCardAccent, { backgroundColor:cfg.color }]} />}

        {/* Mini grid preview */}
        <View style={{ width:scale(32), height:scale(32), flexDirection:"row", flexWrap:"wrap", gap:1.5, alignContent:"flex-start" }}>
          {Array.from({ length: cfg.size * cfg.size }).map((_, i) => (
            <View key={i} style={{ width:dotSize, height:dotSize,
              backgroundColor: selected ? cfg.color+"55" : "#ffffff18", borderRadius:2 }} />
          ))}
        </View>

        <View style={{ flex:1 }}>
          <View style={{ flexDirection:"row", alignItems:"center", gap:scale(6), marginBottom:scale(2) }}>
            <Text style={[styles.gridCardLabel, { color: selected ? cfg.color : "#ffffff" }]}>{cfg.label}</Text>
            <View style={[styles.gridCardTag, { borderColor:cfg.color+"55", backgroundColor:cfg.color+"14" }]}>
              <Text style={[styles.gridCardTagText, { color:cfg.color }]}>{cfg.tag}</Text>
            </View>
          </View>
          <Text style={styles.gridCardDesc}>{cfg.desc}</Text>
          <Text style={[styles.gridCardWin, { color:cfg.color+"99" }]}>{cfg.winCount}-in-a-row to win</Text>
        </View>

        {selected && (
          <View style={[styles.gridCardCheck, { backgroundColor:cfg.color }]}>
            <Text style={{ color:"#0d0118", fontSize:scale(8), fontWeight:"900" }}>✓</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ onBack, onReset, showReset }) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.iconBtn} onPress={onBack}>
        <ArrowLeft size={scale(18)} color="#fff" strokeWidth={2.5} />
      </Pressable>
      <View style={styles.headerCenter}>
        <Grid3x3 size={scale(14)} color="#a78bfa" strokeWidth={2} style={{ marginRight:scale(6) }} />
        <Text style={styles.headerTitle}>Tic Tac Toe</Text>
      </View>
      {showReset
        ? <Pressable style={styles.iconBtn} onPress={onReset}>
            <RefreshCw size={scale(16)} color="#fff" strokeWidth={2.5} />
          </Pressable>
        : <View style={{ width:scale(38) }} />}
    </View>
  );
}

function WinStat({ label, icon, value, color }) {
  return (
    <View style={styles.winStat}>
      <Text style={{ fontSize:scale(15) }}>{icon}</Text>
      <Text style={[styles.winStatValue, { color }]}>{value}</Text>
      <Text style={styles.winStatLabel}>{label}</Text>
    </View>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function TicTacToe() {
  const navigation = useNavigation();
  const { showAd } = useInterstitialAd();

  // phases: "idle" | "diffSelect" | "gridSelect" | "playing" | "over"
  const [phase,      setPhase]      = useState("idle");
  const [mode,       setMode]       = useState(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [gridCfg,    setGridCfg]    = useState(GRID_CONFIGS[0]);
  const [board,      setBoard]      = useState([]);
  const [current,    setCurrent]    = useState("X");
  const [result,     setResult]     = useState(null);
  const [scores,     setScores]     = useState({ X:0, O:0, draw:0 });
  const [aiThinking, setAiThinking] = useState(false);
  const [moveCount,  setMoveCount]  = useState(0);

  const winLines = useMemo(() => generateWinLines(gridCfg.size, gridCfg.winCount), [gridCfg]);

  const cellSize = useMemo(() => {
    const totalGap = CELL_GAP * (gridCfg.size - 1);
    return (BOARD_SIZE - totalGap) / gridCfg.size;
  }, [gridCfg]);

  const overlayAnim = useRef(new Animated.Value(0)).current;
  const boardAnim   = useRef(new Animated.Value(0)).current;
  const headerAnim  = useRef(new Animated.Value(0)).current;
  const aiDotAnims  = useRef([0,1,2].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.timing(headerAnim, { toValue:1, duration:500, useNativeDriver:true }).start();
  }, []);

  useEffect(() => {
    if (aiThinking) {
      aiDotAnims.forEach((a, i) => {
        Animated.loop(Animated.sequence([
          Animated.delay(i * 180),
          Animated.timing(a, { toValue:1, duration:350, useNativeDriver:true }),
          Animated.timing(a, { toValue:0, duration:350, useNativeDriver:true }),
        ])).start();
      });
    } else {
      aiDotAnims.forEach(a => { a.stopAnimation(); a.setValue(0); });
    }
  }, [aiThinking]);

  const startGame = useCallback((cfg) => {
    const N = (cfg ?? gridCfg).size;
    setBoard(Array(N * N).fill(null));
    setCurrent("X"); setResult(null);
    setAiThinking(false); setMoveCount(0);
    overlayAnim.setValue(0); boardAnim.setValue(0);
    setPhase("playing");
    Animated.spring(boardAnim, { toValue:1, tension:55, friction:9, useNativeDriver:true }).start();
  }, [gridCfg]);

  const resetGame = useCallback(() => {
    const N = gridCfg.size;
    setBoard(Array(N * N).fill(null));
    setCurrent("X"); setResult(null);
    setAiThinking(false); setMoveCount(0);
    overlayAnim.setValue(0); boardAnim.setValue(0);
    Animated.spring(boardAnim, { toValue:1, tension:55, friction:9, useNativeDriver:true }).start();
  }, [gridCfg]);

  const finishGame = useCallback((res) => {
    setResult(res); setPhase("over");
    haptic(res.winner === "draw" ? "draw" : "win");
    setScores(s => res.winner === "draw" ? { ...s, draw:s.draw+1 } : { ...s, [res.winner]:s[res.winner]+1 });
    Animated.spring(overlayAnim, { toValue:1, tension:50, friction:9, useNativeDriver:true }).start();
  }, []);

  const handleCellPress = useCallback((idx) => {
    if (result || board[idx] || aiThinking) return;
    haptic("tap");
    const newBoard = [...board];
    newBoard[idx] = current;
    setBoard(newBoard);
    setMoveCount(m => m + 1);

    const res = checkWinner(newBoard, gridCfg.size, gridCfg.winCount, winLines);
    if (res) { finishGame(res); return; }

    if (mode === "single" && current === "X") {
      setCurrent("O"); setAiThinking(true);
      const delay = difficulty === "easy" ? 450 : difficulty === "medium" ? 700 : 1050;
      setTimeout(() => {
        const aiIdx = getAIMove([...newBoard], gridCfg.size, gridCfg.winCount, winLines, difficulty);
        if (aiIdx === -1) { setAiThinking(false); return; }
        haptic("tap");
        const after = [...newBoard]; after[aiIdx] = "O";
        setBoard(after); setMoveCount(m => m + 1); setAiThinking(false);
        const aiRes = checkWinner(after, gridCfg.size, gridCfg.winCount, winLines);
        if (aiRes) { finishGame(aiRes); return; }
        setCurrent("X");
      }, delay);
    } else {
      setCurrent(current === "X" ? "O" : "X");
    }
  }, [board, current, result, aiThinking, mode, difficulty, gridCfg, winLines, finishGame]);

  const DIFF_MAP = {
    easy:   { label:"Easy",   emoji:"😊", color:"#4caf50" },
    medium: { label:"Medium", emoji:"🤔", color:"#ff9800" },
    hard:   { label:"Hard",   emoji:"💀", color:"#ff4081" },
  };

  const P1_NAME = "Player 1";
  const P2_NAME = mode === "single" ? "Robot" : "Player 2";
  const P1_COLOR = "#00e5ff", P2_COLOR = "#ff00ff";
  const P1_ICON  = "🧑",     P2_ICON  = mode === "single" ? "🤖" : "👾";

  const turnColor = result
    ? result.winner === "draw" ? "#ffd700" : result.winner === "X" ? P1_COLOR : P2_COLOR
    : aiThinking ? P2_COLOR : current === "X" ? P1_COLOR : P2_COLOR;

  const turnLabel = result
    ? result.winner === "draw" ? "It's a draw!" : `${result.winner === "X" ? P1_NAME : P2_NAME} wins!`
    : aiThinking ? `${P2_NAME} is thinking...`
    : `${current === "X" ? P1_NAME : P2_NAME}'s turn`;

  // ── IDLE ────────────────────────────────────────────────────────────────────
  if (phase === "idle") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
        <Animated.View style={{ opacity:headerAnim,
          transform:[{ translateY:headerAnim.interpolate({ inputRange:[0,1], outputRange:[-16,0] }) }], width:"100%" }}>
          <Header onBack={() => navigation.goBack()} />
        </Animated.View>

        <ScrollView style={styles.flex} contentContainerStyle={styles.idleContent} showsVerticalScrollIndicator={false}>
          <GlowRing color="#a78bfa" size={scale(100)}>
            <Grid3x3 size={scale(44)} color="#a78bfa" strokeWidth={1.4} />
          </GlowRing>

          <View style={styles.idleTitleBlock}>
            <Text style={styles.idleSubLabel}>STRATEGY GAME</Text>
            <Text style={styles.idleTitle}>Tic Tac Toe</Text>
            <Text style={styles.idleTagline}>3×3 to 6×6 — pick your battlefield!</Text>
          </View>

          <View style={{ width:"100%", gap:scale(12) }}>
            <ModeCard
              icon={<Bot size={scale(22)} color="#00e5ff" strokeWidth={1.8} />}
              title="vs Robot" desc="Face the AI in single player mode" color="#00e5ff"
              onPress={() => { setMode("single"); setPhase("diffSelect"); }}
            />
            <ModeCard
              icon={<Users size={scale(22)} color="#ff00ff" strokeWidth={1.8} />}
              title="vs Friend" desc="Pass & play multiplayer on one device" color="#ff00ff"
              onPress={() => { setMode("multi"); setPhase("gridSelect"); }}
            />
          </View>

          {/* Grid preview pills */}
          <View style={styles.previewRow}>
            {GRID_CONFIGS.map(g => (
              <View key={g.size} style={[styles.previewPill, { borderColor:g.color+"44" }]}>
                <Text style={{ fontSize:scale(10) }}>{g.emoji}</Text>
                <Text style={[styles.previewPillText, { color:g.color }]}>{g.label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
        <GameBannerAd bottom size="banner" />
      </SafeAreaView>
    );
  }

  // ── DIFFICULTY SELECT ───────────────────────────────────────────────────────
  if (phase === "diffSelect") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
        <Header onBack={() => setPhase("idle")} />

        <ScrollView style={styles.flex} contentContainerStyle={styles.idleContent} showsVerticalScrollIndicator={false}>
          <GlowRing color="#00e5ff" size={scale(90)}>
            <Bot size={scale(38)} color="#00e5ff" strokeWidth={1.4} />
          </GlowRing>

          <View style={styles.idleTitleBlock}>
            <Text style={styles.idleSubLabel}>STEP 1 OF 2</Text>
            <Text style={[styles.idleTitle, { fontSize:scale(24) }]}>Choose Difficulty</Text>
          </View>

          <View style={{ width:"100%", gap:scale(10) }}>
            {["easy","medium","hard"].map(d => (
              <DiffBtn key={d} label={DIFF_MAP[d].label} emoji={DIFF_MAP[d].emoji}
                color={DIFF_MAP[d].color} selected={difficulty === d} onPress={() => setDifficulty(d)} />
            ))}
          </View>

          <View style={styles.diffDesc}>
            <Text style={styles.diffDescTitle}>{DIFF_MAP[difficulty].emoji}  {DIFF_MAP[difficulty].label}</Text>
            <Text style={styles.diffDescText}>
              {difficulty === "easy"   && "The robot plays mostly random moves. Great for beginners!"}
              {difficulty === "medium" && "The robot is smart but makes occasional mistakes. A fair fight!"}
              {difficulty === "hard"   && "The robot uses AI (minimax + heuristics). Can you beat it?"}
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.startBtn, { backgroundColor:DIFF_MAP[difficulty].color }, pressed && { opacity:0.88 }]}
            onPress={() => setPhase("gridSelect")}
          >
            <ChevronRight size={scale(18)} color="#0d0118" strokeWidth={2.5} />
            <Text style={styles.startBtnText}>  Choose Grid</Text>
          </Pressable>
        </ScrollView>
        <GameBannerAd bottom size="banner" />
      </SafeAreaView>
    );
  }

  // ── GRID SELECT ─────────────────────────────────────────────────────────────
  if (phase === "gridSelect") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
        <Header onBack={() => mode === "single" ? setPhase("diffSelect") : setPhase("idle")} />

        <ScrollView style={styles.flex} contentContainerStyle={styles.idleContent} showsVerticalScrollIndicator={false}>
          <GlowRing color="#ffd700" size={scale(90)}>
            <Grid3x3 size={scale(38)} color="#ffd700" strokeWidth={1.4} />
          </GlowRing>

          <View style={styles.idleTitleBlock}>
            <Text style={styles.idleSubLabel}>{mode === "single" ? "STEP 2 OF 2" : "STEP 1 OF 1"}</Text>
            <Text style={[styles.idleTitle, { fontSize:scale(24) }]}>Choose Grid Size</Text>
            <Text style={styles.idleTagline}>Bigger board = more strategy!</Text>
          </View>

          <View style={{ width:"100%", gap:scale(10) }}>
            {GRID_CONFIGS.map(cfg => (
              <GridCard key={cfg.size} cfg={cfg} selected={gridCfg.size === cfg.size} onPress={() => setGridCfg(cfg)} />
            ))}
          </View>

          <Pressable
            style={({ pressed }) => [styles.startBtn, { backgroundColor:gridCfg.color }, pressed && { opacity:0.88 }]}
            onPress={() => { setScores({ X:0, O:0, draw:0 }); startGame(gridCfg); }}
          >
            <PlayCircle size={scale(18)} color="#0d0118" strokeWidth={2.5} />
            <Text style={styles.startBtnText}>  Start Game</Text>
          </Pressable>
        </ScrollView>
        <GameBannerAd bottom size="banner" />
      </SafeAreaView>
    );
  }

  // ── PLAYING + GAME OVER ─────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, styles.playingRoot]}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0118" />
      <Header onBack={() => setPhase("idle")} onReset={resetGame} showReset />

      {/* Score row */}
      <View style={styles.scoreRow}>
        <ScoreBadge label={P1_NAME} icon={P1_ICON} value={scores.X} color={P1_COLOR}
          isActive={!result && current === "X" && !aiThinking} />
        <View style={styles.scoreCenter}>
          {scores.draw > 0
            ? <Text style={styles.scoreDraw}>{scores.draw} DRAW{scores.draw > 1 ? "S" : ""}</Text>
            : <Minus size={scale(12)} color="#ffffff22" />}
          <View style={[styles.gridBadge, { borderColor:gridCfg.color+"44", backgroundColor:gridCfg.color+"12" }]}>
            <Text style={{ fontSize:scale(9) }}>{gridCfg.emoji}</Text>
            <Text style={[styles.gridBadgeText, { color:gridCfg.color }]}>{gridCfg.label}</Text>
          </View>
        </View>
        <ScoreBadge label={P2_NAME} icon={P2_ICON} value={scores.O} color={P2_COLOR}
          isActive={!result && (current === "O" || aiThinking)} />
      </View>

      {/* Turn indicator */}
      <View style={[styles.turnPill, { borderColor:turnColor+"44", backgroundColor:turnColor+"0D" }]}>
        {aiThinking ? (
          <View style={{ flexDirection:"row", alignItems:"center", gap:scale(5) }}>
            <Bot size={scale(11)} color={P2_COLOR} strokeWidth={2.5} />
            <Text style={[styles.turnText, { color:P2_COLOR }]}>Robot is thinking</Text>
            <View style={{ flexDirection:"row", gap:scale(3) }}>
              {aiDotAnims.map((a, i) => (
                <Animated.View key={i} style={{ width:scale(5), height:scale(5), borderRadius:9,
                  backgroundColor:P2_COLOR, opacity:a }} />
              ))}
            </View>
          </View>
        ) : (
          <Text style={[styles.turnText, { color:turnColor }]}>{turnLabel}</Text>
        )}
      </View>

      {/* Board */}
      <Animated.View style={[styles.board, { width:BOARD_SIZE,
        opacity:boardAnim, transform:[{ scale:boardAnim.interpolate({ inputRange:[0,1], outputRange:[0.85,1] }) }] }]}>
        {Array.from({ length: gridCfg.size }).map((_, row) => (
          <View key={row} style={{ flexDirection:"row", gap:CELL_GAP, marginBottom: row < gridCfg.size - 1 ? CELL_GAP : 0 }}>
            {Array.from({ length: gridCfg.size }).map((_, col) => {
              const idx = row * gridCfg.size + col;
              return (
                <Cell key={col} value={board[idx]}
                  onPress={() => handleCellPress(idx)}
                  isWinCell={result?.line?.includes(idx)}
                  disabled={!!result || aiThinking || (mode === "single" && current === "O")}
                  cellSize={cellSize}
                />
              );
            })}
          </View>
        ))}
      </Animated.View>

      {/* Info strip */}
      <View style={styles.infoStrip}>
        {mode === "single"
          ? <><Bot size={scale(10)} color="#9e86b8" /><Text style={styles.infoStripText}>  AI · {DIFF_MAP[difficulty].label}  ·  </Text></>
          : <><Users size={scale(10)} color="#9e86b8" /><Text style={styles.infoStripText}>  Pass & Play  ·  </Text></>}
        <Text style={[styles.infoStripText, { color:gridCfg.color+"aa" }]}>{gridCfg.winCount}-in-a-row wins</Text>
        <Text style={styles.infoStripText}>  ·  {moveCount} moves</Text>
      </View>

      {/* Game Over Overlay */}
      {phase === "over" && result && (
        <Animated.View style={[styles.overlay, {
          opacity:overlayAnim,
          transform:[{ scale:overlayAnim.interpolate({ inputRange:[0,1], outputRange:[0.88,1] }) }],
        }]}>
          <ScrollView contentContainerStyle={{ flexGrow:1, justifyContent:"center", alignItems:"center", paddingVertical:scale(20) }}
            showsVerticalScrollIndicator={false}>
            <View style={styles.winCard}>

              <View style={styles.trophyRing}>
                {result.winner === "draw"
                  ? <Text style={{ fontSize:scale(36) }}>🤝</Text>
                  : result.winner === "X"
                    ? <Crown size={scale(36)} color="#ffd700" fill="#ffd70022" strokeWidth={1.5} />
                    : mode === "single"
                      ? <Bot size={scale(36)} color="#ff00ff" strokeWidth={1.4} />
                      : <Crown size={scale(36)} color="#ff00ff" fill="#ff00ff22" strokeWidth={1.5} />}
              </View>

              <Text style={styles.winTitle}>
                {result.winner === "draw"
                  ? "IT'S A DRAW!"
                  : `${result.winner === "X" ? P1_NAME.toUpperCase() : P2_NAME.toUpperCase()} WINS!`}
              </Text>

              {result.winner !== "draw" && (
                <Text style={[styles.winMark, { color: result.winner === "X" ? P1_COLOR : P2_COLOR }]}>
                  {result.winner === "X" ? "✕" : "○"}
                </Text>
              )}

              {/* Game info badge */}
              <View style={[styles.gridWinBadge, { borderColor:gridCfg.color+"55", backgroundColor:gridCfg.color+"14" }]}>
                <Text style={{ fontSize:scale(12) }}>{gridCfg.emoji}</Text>
                <Text style={[styles.gridWinBadgeText, { color:gridCfg.color }]}>
                  {gridCfg.label}  ·  {mode === "single" ? DIFF_MAP[difficulty].label : "Pass & Play"}  ·  {moveCount} moves
                </Text>
              </View>

              {/* Scores */}
              <View style={styles.winStatsRow}>
                <WinStat label={P1_NAME} icon={P1_ICON} value={scores.X}    color={P1_COLOR} />
                <View style={styles.winStatDivider} />
                <WinStat label="DRAWS"   icon="🤝"      value={scores.draw} color="#ffd700" />
                <View style={styles.winStatDivider} />
                <WinStat label={P2_NAME} icon={P2_ICON} value={scores.O}    color={P2_COLOR} />
              </View>

              {/* Play Again */}
              <Pressable
                style={({ pressed }) => [styles.playAgainBtn, { backgroundColor:gridCfg.color }, pressed && { opacity:0.88 }]}
                onPress={() => showAd(resetGame)}
              >
                <RefreshCw size={scale(16)} color="#0d0118" strokeWidth={2.5} />
                <Text style={styles.playAgainText}>  Play Again</Text>
              </Pressable>

              {/* Change Grid */}
              <Pressable
                style={({ pressed }) => [styles.changeModeBtn, { borderColor:gridCfg.color+"44" }, pressed && { opacity:0.88 }]}
                onPress={() => showAd(() => setPhase("gridSelect"))}
              >
                <Grid3x3 size={scale(13)} color={gridCfg.color} strokeWidth={2} />
                <Text style={[styles.changeModeText, { color:gridCfg.color }]}>  Change Grid Size</Text>
              </Pressable>

              {/* Change Mode */}
              <Pressable
                style={({ pressed }) => [styles.changeModeBtn, pressed && { opacity:0.88 }]}
                onPress={() => showAd(() => setPhase("idle"))}
              >
                <Users size={scale(13)} color="#a78bfa" strokeWidth={2} />
                <Text style={[styles.changeModeText, { color:"#a78bfa" }]}>  Change Mode</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.exitBtn, pressed && { opacity:0.6 }]}
                onPress={() => showAd(() => navigation.goBack())}
              >
                <ChevronLeft size={scale(13)} color="#9e86b8" />
                <Text style={styles.exitText}>Back to Games</Text>
              </Pressable>
            </View>
          </ScrollView>
        </Animated.View>
      )}

      <GameBannerAd bottom size="banner" />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex:        { flex:1 },
  container:   { flex:1, backgroundColor:"#0d0118" },
  playingRoot: { alignItems:"center" },

  header: {
    width:"100%", flexDirection:"row", alignItems:"center",
    paddingHorizontal:scale(16), paddingTop:scale(12), paddingBottom:scale(8),
  },
  iconBtn: {
    width:scale(38), height:scale(38), borderRadius:scale(12),
    backgroundColor:"#1f0a3a", borderWidth:1, borderColor:"#ffffff18",
    justifyContent:"center", alignItems:"center", elevation:4,
  },
  headerCenter: { flex:1, flexDirection:"row", alignItems:"center", justifyContent:"center" },
  headerTitle: {
    fontSize:scale(17), fontWeight:"900", color:"#a78bfa", letterSpacing:1.5,
    textShadowColor:"#a78bfa66", textShadowOffset:{width:0,height:0}, textShadowRadius:8,
  },

  idleContent: {
    alignItems:"center", paddingHorizontal:scale(20),
    paddingTop:scale(8), paddingBottom:scale(24), gap:scale(16),
  },
  idleTitleBlock: { alignItems:"center", gap:scale(4) },
  idleSubLabel:   { fontSize:scale(9), fontWeight:"900", color:"#a78bfa88", letterSpacing:4 },
  idleTitle: {
    fontSize:scale(30), fontWeight:"900", color:"#ffffff", letterSpacing:1,
    textShadowColor:"#a78bfa44", textShadowOffset:{width:0,height:0}, textShadowRadius:10,
  },
  idleTagline: { fontSize:scale(12), color:"#9e86b8", fontWeight:"500", fontStyle:"italic" },

  modeCard: {
    width:"100%", backgroundColor:"#130824",
    borderRadius:scale(16), borderWidth:1,
    paddingHorizontal:scale(16), paddingVertical:scale(14),
    flexDirection:"row", alignItems:"center", gap:scale(12), overflow:"hidden", elevation:4,
  },
  modeCardAccent: { position:"absolute", left:0, top:0, bottom:0, width:3, borderRadius:2 },
  modeIconWrap: {
    width:scale(44), height:scale(44), borderRadius:scale(12),
    borderWidth:1, justifyContent:"center", alignItems:"center",
  },
  modeCardTitle: { fontSize:scale(15), fontWeight:"900", letterSpacing:0.3 },
  modeCardDesc:  { fontSize:scale(11), color:"#9e86b8", fontWeight:"400", marginTop:scale(2) },

  previewRow:     { flexDirection:"row", gap:scale(8), flexWrap:"wrap", justifyContent:"center" },
  previewPill: {
    flexDirection:"row", alignItems:"center", gap:scale(4),
    paddingHorizontal:scale(10), paddingVertical:scale(5),
    borderRadius:scale(20), borderWidth:1, backgroundColor:"#130824",
  },
  previewPillText: { fontSize:scale(10), fontWeight:"800" },

  diffBtn: {
    width:"100%", flexDirection:"row", alignItems:"center",
    borderRadius:scale(14), borderWidth:1,
    paddingHorizontal:scale(16), paddingVertical:scale(14), gap:scale(12),
  },
  diffBtnText: { fontSize:scale(15), fontWeight:"800", flex:1 },
  diffBtnDot:  { width:scale(8), height:scale(8), borderRadius:scale(4) },
  diffDesc: {
    width:"100%", backgroundColor:"#130824",
    borderRadius:scale(14), borderWidth:1, borderColor:"#ffffff0f",
    padding:scale(14), gap:scale(6),
  },
  diffDescTitle: { fontSize:scale(13), fontWeight:"900", color:"#ffffff" },
  diffDescText:  { fontSize:scale(12), color:"#9e86b8", lineHeight:scale(17) },

  startBtn: {
    flexDirection:"row", alignItems:"center",
    paddingHorizontal:scale(40), paddingVertical:scale(14),
    borderRadius:scale(25), elevation:8,
  },
  startBtnText: { fontSize:scale(15), fontWeight:"900", color:"#0d0118", letterSpacing:0.5 },

  gridCard: {
    width:"100%", backgroundColor:"#130824",
    borderRadius:scale(16), borderWidth:1,
    paddingHorizontal:scale(14), paddingVertical:scale(14),
    flexDirection:"row", alignItems:"center", gap:scale(12), overflow:"hidden", elevation:3,
  },
  gridCardAccent: { position:"absolute", left:0, top:0, bottom:0, width:3, borderRadius:2 },
  gridCardLabel:  { fontSize:scale(16), fontWeight:"900" },
  gridCardTag: {
    borderRadius:scale(6), borderWidth:1,
    paddingHorizontal:scale(5), paddingVertical:scale(2),
  },
  gridCardTagText: { fontSize:scale(7), fontWeight:"900", letterSpacing:1 },
  gridCardDesc:    { fontSize:scale(11), color:"#9e86b8", fontWeight:"400" },
  gridCardWin:     { fontSize:scale(10), fontWeight:"700", marginTop:scale(2) },
  gridCardCheck: {
    width:scale(18), height:scale(18), borderRadius:scale(9),
    justifyContent:"center", alignItems:"center",
  },

  scoreRow: {
    flexDirection:"row", alignItems:"center",
    width:"100%", paddingHorizontal:scale(16),
    marginBottom:scale(8), gap:scale(8),
  },
  scoreBadge: {
    flex:1, backgroundColor:"#130824",
    borderRadius:scale(14), borderWidth:1,
    paddingVertical:scale(8), alignItems:"center", gap:scale(2),
  },
  scoreBadgeVal:   { fontSize:scale(20), fontWeight:"900" },
  scoreBadgeLabel: { fontSize:scale(8), color:"#9e86b8", fontWeight:"700", letterSpacing:0.5 },
  scoreCenter:     { alignItems:"center", gap:scale(4) },
  scoreDraw:       { fontSize:scale(8), color:"#ffd700", fontWeight:"800", letterSpacing:0.5 },
  gridBadge: {
    flexDirection:"row", alignItems:"center", gap:scale(4),
    borderRadius:scale(8), borderWidth:1,
    paddingHorizontal:scale(7), paddingVertical:scale(3),
  },
  gridBadgeText: { fontSize:scale(9), fontWeight:"900", letterSpacing:0.5 },

  turnPill: {
    borderRadius:scale(20), borderWidth:1,
    paddingHorizontal:scale(16), paddingVertical:scale(6),
    marginBottom:scale(10),
  },
  turnText: { fontSize:scale(12), fontWeight:"800", letterSpacing:0.3 },

  board: { alignSelf:"center" },

  infoStrip: {
    flexDirection:"row", alignItems:"center",
    opacity:0.55, marginTop:scale(8),
  },
  infoStripText: { fontSize:scale(10), color:"#9e86b8", fontWeight:"600" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:"rgba(5,0,14,0.96)",
    zIndex:99,
  },
  winCard: {
    backgroundColor:"#100520", borderRadius:scale(24),
    borderWidth:1.5, borderColor:"#a78bfa44",
    padding:scale(22), alignItems:"center",
    width:SCREEN_WIDTH - scale(40), elevation:12,
  },
  trophyRing: {
    width:scale(76), height:scale(76), borderRadius:scale(38),
    backgroundColor:"#1f0a3a", borderWidth:2, borderColor:"#a78bfa44",
    justifyContent:"center", alignItems:"center",
    marginBottom:scale(10), elevation:6,
  },
  winTitle: {
    fontSize:scale(20), fontWeight:"900", color:"#ffd700", letterSpacing:3,
    textShadowColor:"#ffd70066", textShadowOffset:{width:0,height:0}, textShadowRadius:10,
    marginBottom:scale(4), textAlign:"center",
  },
  winMark: { fontSize:scale(32), fontWeight:"900", marginBottom:scale(8) },
  gridWinBadge: {
    flexDirection:"row", alignItems:"center", gap:scale(6),
    borderRadius:scale(20), borderWidth:1,
    paddingHorizontal:scale(14), paddingVertical:scale(6), marginBottom:scale(14),
  },
  gridWinBadgeText: { fontSize:scale(10), fontWeight:"800", letterSpacing:0.3 },

  winStatsRow: {
    flexDirection:"row", alignItems:"center",
    backgroundColor:"#0d0118", borderRadius:scale(14),
    paddingVertical:scale(12), paddingHorizontal:scale(16),
    marginBottom:scale(14), gap:scale(12),
    borderWidth:1, borderColor:"#ffffff0e",
    width:"100%", justifyContent:"center",
  },
  winStat:        { alignItems:"center", gap:scale(3), flex:1 },
  winStatValue:   { fontSize:scale(18), fontWeight:"900" },
  winStatLabel:   { fontSize:scale(8), color:"#9e86b8", fontWeight:"700", letterSpacing:0.5 },
  winStatDivider: { width:1, height:scale(38), backgroundColor:"#ffffff14" },

  playAgainBtn: {
    flexDirection:"row", alignItems:"center", justifyContent:"center",
    paddingHorizontal:scale(32), paddingVertical:scale(12),
    borderRadius:scale(25), marginBottom:scale(10), elevation:6, width:"100%",
  },
  playAgainText: { fontSize:scale(14), fontWeight:"900", color:"#0d0118", letterSpacing:0.5 },
  changeModeBtn: {
    flexDirection:"row", alignItems:"center", justifyContent:"center",
    backgroundColor:"#a78bfa16", borderWidth:1, borderColor:"#a78bfa33",
    paddingHorizontal:scale(20), paddingVertical:scale(9),
    borderRadius:scale(20), marginBottom:scale(8), width:"100%",
  },
  changeModeText: { fontSize:scale(12), fontWeight:"700" },
  exitBtn: { flexDirection:"row", alignItems:"center", paddingVertical:scale(8) },
  exitText: { fontSize:scale(12), color:"#9e86b8", fontWeight:"600" },
});