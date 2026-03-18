// Screens/Games/FlowFreeGame.js
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated,
  Dimensions, StatusBar, SafeAreaView, Platform, ScrollView,
} from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, RefreshCw, PlayCircle, ChevronLeft, Share2, CheckCircle } from 'lucide-react-native';
import GameBannerAd from '../../Components/GameBannerAd';
import { useInterstitialAd } from '../../Components/Useinterstitialad';

const SCREEN_W   = Dimensions.get('window').width;
const BOARD_SIZE = SCREEN_W - scale(16);
 
// ─── VERIFIED LEVELS — every path+solution fills 100% of the grid ─────────────
const LEVELS = [
  // ── LVL 1: 5×5, 3 colors ─────────────────────────────────────────────────
  {
    id:1, size:5, label:'EASY', badge:'LVL 1',
    colors:[
      { key:'red',   color:'#ff4b4b', a:[0,0], b:[4,4] },
      { key:'blue',  color:'#4499ff', a:[0,4], b:[3,4] },
      { key:'green', color:'#4caf50', a:[2,1], b:[3,1] },
    ],
  },
  // ── LVL 2: 5×5, 4 colors ─────────────────────────────────────────────────
  {
    id:2, size:5, label:'EASY', badge:'LVL 2',
    colors:[
      { key:'red',    color:'#ff4b4b', a:[0,0], b:[0,4] },
      { key:'blue',   color:'#4499ff', a:[1,0], b:[1,4] },
      { key:'green',  color:'#4caf50', a:[1,1], b:[3,3] },
      { key:'yellow', color:'#ffd700', a:[2,1], b:[3,1] },
    ],
  },
  // ── LVL 3: 5×5, 5 colors ─────────────────────────────────────────────────
  {
    id:3, size:5, label:'EASY', badge:'LVL 3',
    colors:[
      { key:'red',    color:'#ff4b4b', a:[0,0], b:[2,0] },
      { key:'blue',   color:'#4499ff', a:[0,4], b:[1,4] },
      { key:'green',  color:'#4caf50', a:[2,1], b:[4,4] },
      { key:'yellow', color:'#ffd700', a:[3,0], b:[4,3] },
      { key:'pink',   color:'#ff69b4', a:[3,1], b:[3,3] },
    ],
  },
  // ── LVL 4: 6×6, 5 colors ─────────────────────────────────────────────────
  {
    id:4, size:6, label:'MEDIUM', badge:'LVL 4',
    colors:[
      { key:'red',    color:'#ff4b4b', a:[0,0], b:[0,5] },
      { key:'blue',   color:'#4499ff', a:[1,0], b:[1,5] },
      { key:'green',  color:'#4caf50', a:[1,1], b:[3,1] },
      { key:'yellow', color:'#ffd700', a:[3,2], b:[4,4] },
      { key:'pink',   color:'#ff69b4', a:[4,1], b:[4,3] },
    ],
  },
  // ── LVL 5: 6×6, 5 colors ─────────────────────────────────────────────────
  {
    id:5, size:6, label:'MEDIUM', badge:'LVL 5',
    colors:[
      { key:'red',    color:'#ff4b4b', a:[0,0], b:[5,0] },
      { key:'blue',   color:'#4499ff', a:[0,5], b:[5,5] },
      { key:'green',  color:'#4caf50', a:[0,1], b:[1,1] },
      { key:'orange', color:'#ff8c00', a:[2,1], b:[3,1] },
      { key:'yellow', color:'#ffd700', a:[4,1], b:[5,1] },
    ],
  },
  // ── LVL 6: 6×6, 6 colors ─────────────────────────────────────────────────
  {
    id:6, size:6, label:'MEDIUM', badge:'LVL 6',
    colors:[
      { key:'red',    color:'#ff4b4b', a:[0,0], b:[0,5] },
      { key:'blue',   color:'#4499ff', a:[5,0], b:[5,5] },
      { key:'green',  color:'#4caf50', a:[1,0], b:[4,0] },
      { key:'yellow', color:'#ffd700', a:[1,5], b:[4,5] },
      { key:'pink',   color:'#ff69b4', a:[1,1], b:[2,1] },
      { key:'orange', color:'#ff8c00', a:[3,1], b:[4,1] },
    ],
  },
  // ── LVL 7: 7×7, 5 colors ─────────────────────────────────────────────────
  {
    id:7, size:7, label:'HARD', badge:'LVL 7',
    colors:[
      { key:'red',    color:'#ff4b4b', a:[0,0], b:[0,6] },
      { key:'blue',   color:'#4499ff', a:[1,0], b:[6,6] },
      { key:'green',  color:'#4caf50', a:[1,6], b:[5,1] },
      { key:'yellow', color:'#ffd700', a:[1,1], b:[2,1] },
      { key:'pink',   color:'#ff69b4', a:[3,1], b:[4,1] },
    ],
  },
  // ── LVL 8: 7×7, 6 colors ─────────────────────────────────────────────────
  {
    id:8, size:7, label:'HARD', badge:'LVL 8',
    colors:[
      { key:'red',    color:'#ff4b4b', a:[0,0], b:[0,6] },
      { key:'blue',   color:'#4499ff', a:[1,0], b:[6,0] },
      { key:'orange', color:'#ff8c00', a:[6,1], b:[6,6] },
      { key:'green',  color:'#4caf50', a:[1,6], b:[5,1] },
      { key:'yellow', color:'#ffd700', a:[1,1], b:[2,1] },
      { key:'pink',   color:'#ff69b4', a:[3,1], b:[4,1] },
    ],
  },
  // ── LVL 9: 8×8, 7 colors ─────────────────────────────────────────────────
  {
    id:9, size:8, label:'EXPERT', badge:'LVL 9',
    colors:[
      { key:'red',    color:'#ff4b4b', a:[0,0], b:[0,7] },
      { key:'blue',   color:'#4499ff', a:[1,7], b:[7,7] },
      { key:'cyan',   color:'#00e5ff', a:[7,6], b:[7,0] },
      { key:'green',  color:'#4caf50', a:[1,0], b:[6,0] },
      { key:'yellow', color:'#ffd700', a:[1,1], b:[2,1] },
      { key:'orange', color:'#ff8c00', a:[3,1], b:[4,1] },
      { key:'pink',   color:'#ff69b4', a:[5,1], b:[6,1] },
    ],
  },
  // ── LVL 10: 8×8, 8 colors ────────────────────────────────────────────────
  {
    id:10, size:8, label:'EXPERT', badge:'LVL 10',
    colors:[
      { key:'red',    color:'#ff4b4b', a:[0,0], b:[0,3] },
      { key:'cyan',   color:'#00e5ff', a:[0,4], b:[0,7] },
      { key:'blue',   color:'#4499ff', a:[1,7], b:[7,7] },
      { key:'green',  color:'#4caf50', a:[7,0], b:[7,6] },
      { key:'purple', color:'#a78bfa', a:[1,0], b:[6,0] },
      { key:'yellow', color:'#ffd700', a:[1,1], b:[2,1] },
      { key:'maroon', color:'#e91e63', a:[3,1], b:[5,6] },
      { key:'orange', color:'#ff8c00', a:[6,1], b:[6,6] },
    ],
  },
];

const DIFF_COLORS = { EASY:'#4caf50', MEDIUM:'#ff9800', HARD:'#ff4081', EXPERT:'#a78bfa' };

// ─── Pure helpers ─────────────────────────────────────────────────────────────
const isAdj = (a, b) => Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]) === 1;

const isComplete = (colorDef, path) => {
  if (!path || path.length < 2) return false;
  const f = path[0], l = path[path.length-1];
  const { a, b } = colorDef;
  return (f[0]===a[0]&&f[1]===a[1]&&l[0]===b[0]&&l[1]===b[1]) ||
         (f[0]===b[0]&&f[1]===b[1]&&l[0]===a[0]&&l[1]===a[1]);
};

const checkWin = (lvl, currentPaths) => {
  if (!lvl.colors.every(c => isComplete(c, currentPaths[c.key] || []))) return false;
  const covered = new Set();
  for (const path of Object.values(currentPaths))
    for (const cell of path) covered.add(`${cell[0]},${cell[1]}`);
  return covered.size === lvl.size * lvl.size;
};

const absToCell = (absX, absY, bx, by, gridSize) => {
  const cs = BOARD_SIZE / gridSize;
  const lx = absX - bx, ly = absY - by;
  if (lx < 0 || ly < 0 || lx >= BOARD_SIZE || ly >= BOARD_SIZE) return null;
  const r = Math.floor(ly / cs), c = Math.floor(lx / cs);
  if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return null;
  return [r, c];
};

const bridgeCells = (from, to, maxSteps = 12) => {
  const result = [];
  let cur = from;
  for (let i = 0; i < maxSteps; i++) {
    const dr = to[0] - cur[0], dc = to[1] - cur[1];
    if (dr === 0 && dc === 0) break;
    const next = Math.abs(dr) >= Math.abs(dc)
      ? [cur[0] + Math.sign(dr), cur[1]]
      : [cur[0], cur[1] + Math.sign(dc)];
    result.push(next);
    if (next[0] === to[0] && next[1] === to[1]) break;
    cur = next;
  }
  return result;
};

// ─── Pipe Cell ────────────────────────────────────────────────────────────────
const PipeCell = React.memo(({ r, c, paths, endpoints, level, cellSize }) => {
  const PIPE = cellSize * 0.46;
  const HALF = cellSize / 2;

  let activeKey = endpoints[`${r},${c}`] ?? null;
  if (!activeKey) {
    for (const [key, path] of Object.entries(paths)) {
      if (path.some(p => p[0]===r && p[1]===c)) { activeKey = key; break; }
    }
  }
  const isDot = !!endpoints[`${r},${c}`];

  if (!activeKey) {
    return (
      <View style={{ width:cellSize, height:cellSize, padding:1 }}>
        <View style={{ flex:1, backgroundColor:'#0c0220', borderRadius:3 }}/>
      </View>
    );
  }

  const colorDef = level.colors.find(cd => cd.key === activeKey);
  const col = colorDef?.color ?? '#fff';
  const path = paths[activeKey] || [];
  const idx  = path.findIndex(p => p[0]===r && p[1]===c);
  const prev = idx > 0               ? path[idx-1] : null;
  const next = idx < path.length - 1 ? path[idx+1] : null;

  const dirOf = nb => {
    if (!nb) return null;
    const dr=nb[0]-r, dc=nb[1]-c;
    if(dr===-1) return 'T'; if(dr===1) return 'B';
    if(dc===-1) return 'L'; if(dc===1) return 'R';
    return null;
  };
  const dirs = new Set([dirOf(prev), dirOf(next)]);
  const off  = (cellSize - 2 - PIPE) / 2;
  const doff = (cellSize - 2 - cellSize * 0.72) / 2;

  return (
    <View style={{ width:cellSize, height:cellSize, padding:1 }}>
      <View style={{ flex:1, backgroundColor:'#0c0220', borderRadius:3, overflow:'hidden' }}>
        {dirs.has('T') && <View style={{ position:'absolute', left:off, top:0,    width:PIPE, height:HALF, backgroundColor:col }}/>}
        {dirs.has('B') && <View style={{ position:'absolute', left:off, top:HALF, width:PIPE, height:HALF, backgroundColor:col }}/>}
        {dirs.has('L') && <View style={{ position:'absolute', top:off,  left:0,   width:HALF, height:PIPE, backgroundColor:col }}/>}
        {dirs.has('R') && <View style={{ position:'absolute', top:off,  left:HALF,width:HALF, height:PIPE, backgroundColor:col }}/>}
        {isDot ? (
          <View style={{
            position:'absolute', zIndex:3,
            left:doff, top:doff,
            width:cellSize*0.72, height:cellSize*0.72,
            borderRadius:cellSize*0.36,
            backgroundColor:col,
            borderWidth:Math.max(2.5, cellSize*0.08),
            borderColor:'rgba(255,255,255,0.5)',
          }}/>
        ) : path.length > 0 ? (
          <View style={{
            position:'absolute', zIndex:2,
            left:off, top:off,
            width:PIPE, height:PIPE,
            borderRadius:PIPE/2,
            backgroundColor:col,
          }}/>
        ) : null}
      </View>
    </View>
  );
});

// ─── Win Overlay ──────────────────────────────────────────────────────────────
// showAd is passed in so the overlay itself can gate Next/Back behind the ad.
// Auto-advance calls showAd(goToNext) after 2.2 s.
function WinOverlay({ visible, level, moves, onNext, onRestart, onBack, showAd }) {
  const anim         = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const autoTimer    = useRef(null);
  const hasNext      = LEVELS.find(l => l.id === level?.id + 1);

  useEffect(() => {
    if (visible) {
      // Entrance spring
      Animated.spring(anim, { toValue:1, tension:50, friction:9, useNativeDriver:true }).start();

      if (hasNext) {
        // Auto-advance bar fills over 2.2 s then shows interstitial → next level
        progressAnim.setValue(0);
        Animated.timing(progressAnim, {
          toValue: 1, duration: 2200, useNativeDriver: true,
        }).start();
        autoTimer.current = setTimeout(() => {
          // Show interstitial; onNext runs after ad closes (or immediately if no ad)
          showAd(onNext);
        }, 2200);
      }
    } else {
      anim.setValue(0);
      progressAnim.setValue(0);
      if (autoTimer.current) { clearTimeout(autoTimer.current); autoTimer.current = null; }
    }
    return () => { if (autoTimer.current) clearTimeout(autoTimer.current); };
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, {
      opacity: anim,
      transform: [{ scale: anim.interpolate({ inputRange:[0,1], outputRange:[0.85,1] }) }],
    }]}>
      <View style={styles.winCard}>
        {/* Icon ring */}
        <View style={styles.winRing}>
          <CheckCircle size={scale(38)} color="#a78bfa" fill="#a78bfa33" strokeWidth={1.5}/>
        </View>

        <Text style={styles.winTitle}>SOLVED! 🎉</Text>
        <Text style={styles.winSub}>{level?.badge} — {level?.label}</Text>

        {/* Stats */}
        <View style={styles.winStats}>
          <View style={styles.winStat}>
            <Text style={[styles.winVal, { color:'#a78bfa' }]}>{level?.size}×{level?.size}</Text>
            <Text style={styles.winLbl}>GRID</Text>
          </View>
          <View style={styles.winDiv}/>
          <View style={styles.winStat}>
            <Text style={[styles.winVal, { color:'#ffd700' }]}>{moves}</Text>
            <Text style={styles.winLbl}>MOVES</Text>
          </View>
          <View style={styles.winDiv}/>
          <View style={styles.winStat}>
            <Text style={[styles.winVal, { color:'#4caf50' }]}>{level?.colors?.length}</Text>
            <Text style={styles.winLbl}>COLORS</Text>
          </View>
        </View>

        {/* Auto-advance progress bar */}
        {hasNext && (
          <View style={styles.autoAdvanceRow}>
            <View style={styles.autoProgressBar}>
              <Animated.View style={[styles.autoProgressFill, {
                transform: [{
                  translateX: progressAnim.interpolate({
                    inputRange:[0,1],
                    outputRange:[-(SCREEN_W - scale(96)), 0],
                  }),
                }],
              }]}/>
            </View>
            <Text style={styles.autoTxt}>Next level in 2s…</Text>
          </View>
        )}

        {/* Buttons — both gated behind interstitial */}
        <View style={styles.winBtns}>
          {hasNext && (
            <Pressable
              style={({ pressed }) => [styles.winPrimaryBtn, pressed && { opacity:.88 }]}
              onPress={() => {
                // Cancel auto-advance timer so ad isn't shown twice
                if (autoTimer.current) { clearTimeout(autoTimer.current); autoTimer.current = null; }
                showAd(onNext);
              }}
            >
              <PlayCircle size={scale(15)} color="#0d0118" strokeWidth={2.5}/>
              <Text style={styles.winPrimaryTxt}> Next Level</Text>
            </Pressable>
          )}
          <Pressable
            style={({ pressed }) => [styles.winSecBtn, pressed && { opacity:.88 }]}
            onPress={onRestart}   // replay same level — no ad needed
          >
            <RefreshCw size={scale(13)} color="#a78bfa" strokeWidth={2.5}/>
            <Text style={styles.winSecTxt}> Replay</Text>
          </Pressable>
        </View>

        {/* Back to select — gated behind interstitial */}
        <Pressable
          style={({ pressed }) => [styles.exitBtn, pressed && { opacity:.6 }]}
          onPress={() => {
            if (autoTimer.current) { clearTimeout(autoTimer.current); autoTimer.current = null; }
            showAd(onBack);
          }}
        >
          <ChevronLeft size={scale(13)} color="#9e86b8"/>
          <Text style={styles.exitTxt}>Level Select</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

// ─── Level Select ─────────────────────────────────────────────────────────────
function LevelSelect({ onSelect }) {
  return (
    <ScrollView
      style={{ flex:1 }}
      contentContainerStyle={styles.selectContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ alignItems:'center', marginBottom:scale(20) }}>
        <View style={styles.heroRing}>
          <Share2 size={scale(42)} color="#a78bfa" strokeWidth={1.5}/>
        </View>
        <Text style={styles.subLabel}>PUZZLE GAME</Text>
        <Text style={styles.bigTitle}>Flow Free</Text>
        <Text style={styles.tagline}>Connect dots · Fill every cell · No crossings</Text>
      </View>
      <View style={styles.levelGrid}>
        {LEVELS.map(lvl => {
          const dc = DIFF_COLORS[lvl.label];
          return (
            <Pressable
              key={lvl.id}
              style={({ pressed }) => [styles.levelCard, { borderColor:dc+'44', opacity:pressed ? .85 : 1 }]}
              onPress={() => onSelect(lvl)}
            >
              <View style={[styles.lvlRing, { backgroundColor:dc+'22', borderColor:dc+'55' }]}>
                <Text style={[styles.lvlNum, { color:dc }]}>{lvl.id}</Text>
              </View>
              <Text style={[styles.lvlSize, { color:dc }]}>{lvl.size}×{lvl.size}</Text>
              <View style={[styles.diffTag, { backgroundColor:dc+'18' }]}>
                <Text style={[styles.diffTxt, { color:dc }]}>{lvl.label}</Text>
              </View>
              <View style={styles.dotRow}>
                {lvl.colors.map(c => (
                  <View key={c.key} style={[styles.dotPreview, { backgroundColor:c.color }]}/>
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function FlowFreeGame() {
  const navigation = useNavigation();

  // ── Interstitial ad hook ───────────────────────────────────────────────────
  // showAd(callback) — shows ad then runs callback; if no ad ready, runs immediately
  const { showAd } = useInterstitialAd();

  const [phase, setPhase] = useState('select');
  const [level, setLevel] = useState(null);
  const [paths, setPaths] = useState({});
  const [moves, setMoves] = useState(0);
  const [won,   setWon]   = useState(false);

  const pathsRef      = useRef({});
  const drawingKeyRef = useRef(null);
  const lastCellRef   = useRef(null);
  const movesRef      = useRef(0);
  const wonRef        = useRef(false);
  const levelRef      = useRef(null);
  const boardRef      = useRef(null);
  const boardOrigin   = useRef({ x:0, y:0 });

  const measureBoard = useCallback(() => {
    setTimeout(() => {
      boardRef.current?.measure((_,_2,_3,_4,px,py) => {
        boardOrigin.current = { x:px, y:py };
      });
    }, 80);
  }, []);

  useEffect(() => { levelRef.current = level; }, [level]);

  const cellSize = level ? BOARD_SIZE / level.size : 0;

  const startLevel = useCallback((lvl) => {
    pathsRef.current={}; drawingKeyRef.current=null;
    lastCellRef.current=null; movesRef.current=0;
    wonRef.current=false; levelRef.current=lvl;
    setLevel(lvl); setPaths({}); setMoves(0); setWon(false); setPhase('playing');
  }, []);

  const resetLevel = useCallback(() => {
    pathsRef.current={}; drawingKeyRef.current=null;
    lastCellRef.current=null; movesRef.current=0; wonRef.current=false;
    setPaths({}); setMoves(0); setWon(false);
  }, []);

  // ── Navigate to next level (no ad logic here — handled by WinOverlay) ─────
  const goToNextLevel = useCallback(() => {
    if (!level) return;
    const next = LEVELS.find(l => l.id === level.id + 1);
    if (next) startLevel(next);
    else setPhase('select');
  }, [level, startLevel]);

  // ── Navigate back to level select ─────────────────────────────────────────
  const goToSelect = useCallback(() => {
    setPhase('select');
  }, []);

  // ── Core single-cell step ──────────────────────────────────────────────────
  const applyCell = useCallback((cell) => {
    const lvl = levelRef.current;
    const key = drawingKeyRef.current;
    if (!lvl || !key || wonRef.current) return;

    const [nr, nc] = cell;
    const current  = pathsRef.current[key] || [];
    if (!current.length) return;
    if (!isAdj(current[current.length-1], cell)) return;

    const ownIdx = current.findIndex(p => p[0]===nr && p[1]===nc);
    if (ownIdx !== -1) {
      pathsRef.current = { ...pathsRef.current, [key]: current.slice(0, ownIdx+1) };
      lastCellRef.current = cell;
      setPaths({ ...pathsRef.current });
      return;
    }

    for (const col of lvl.colors) {
      if (col.key===key) continue;
      if ((col.a[0]===nr&&col.a[1]===nc)||(col.b[0]===nr&&col.b[1]===nc)) return;
    }

    const np = { ...pathsRef.current };
    for (const [ok, op] of Object.entries(np)) {
      if (ok===key) continue;
      const oi = op.findIndex(p => p[0]===nr && p[1]===nc);
      if (oi !== -1) { np[ok] = op.slice(0, oi); break; }
    }

    const newPath = [...current, cell];
    np[key] = newPath;
    pathsRef.current = np;
    lastCellRef.current = cell;
    movesRef.current += 1;
    setMoves(movesRef.current);
    setPaths({ ...np });

    const colorDef = lvl.colors.find(c => c.key===key);
    if (isComplete(colorDef, newPath)) {
      drawingKeyRef.current = null;
      if (!wonRef.current && checkWin(lvl, pathsRef.current)) {
        wonRef.current = true;
        setWon(true);
        // ── Win detected — ad shown by WinOverlay on user action / auto-advance
      }
    }
  }, []);

  // ── Gesture: begin ─────────────────────────────────────────────────────────
  const handleBegin = useCallback((absX, absY) => {
    const lvl = levelRef.current;
    if (!lvl) return;
    const cell = absToCell(absX, absY, boardOrigin.current.x, boardOrigin.current.y, lvl.size);
    if (!cell) return;
    const [r, c] = cell;

    let key = null;
    for (const col of lvl.colors) {
      if ((col.a[0]===r&&col.a[1]===c)||(col.b[0]===r&&col.b[1]===c)) { key=col.key; break; }
    }
    if (!key) {
      for (const [k, path] of Object.entries(pathsRef.current)) {
        if (path.some(p => p[0]===r && p[1]===c)) { key=k; break; }
      }
    }
    if (!key) return;

    const colorDef = lvl.colors.find(cd => cd.key===key);
    const existing = pathsRef.current[key] || [];
    const isDotA   = colorDef.a[0]===r && colorDef.a[1]===c;
    const isDotB   = colorDef.b[0]===r && colorDef.b[1]===c;
    const midIdx   = existing.findIndex(p => p[0]===r && p[1]===c);

    const np = { ...pathsRef.current };
    if (isDotA||isDotB)   np[key] = [cell];
    else if (midIdx!==-1) np[key] = existing.slice(0, midIdx+1);
    else                  np[key] = [cell];

    pathsRef.current = np;
    drawingKeyRef.current = key;
    lastCellRef.current = cell;
    setPaths({ ...np });
  }, []);

  // ── Gesture: move ──────────────────────────────────────────────────────────
  const handleMove = useCallback((absX, absY) => {
    const lvl = levelRef.current;
    if (!lvl || !drawingKeyRef.current || wonRef.current) return;

    const rawCell = absToCell(absX, absY, boardOrigin.current.x, boardOrigin.current.y, lvl.size);
    if (!rawCell) return;

    const lc = lastCellRef.current;
    if (!lc || (lc[0]===rawCell[0] && lc[1]===rawCell[1])) return;

    const cells = bridgeCells(lc, rawCell);
    for (const cell of cells) {
      if (!drawingKeyRef.current || wonRef.current) break;
      applyCell(cell);
    }
  }, [applyCell]);

  // ── RNGH Pan Gesture ───────────────────────────────────────────────────────
  const gesture = useMemo(() =>
    Gesture.Pan()
      .runOnJS(true)
      .minDistance(0)
      .onBegin(e    => handleBegin(e.absoluteX, e.absoluteY))
      .onUpdate(e   => handleMove(e.absoluteX, e.absoluteY))
      .onEnd(()     => { drawingKeyRef.current = null; })
      .onFinalize(() => { drawingKeyRef.current = null; })
  , [handleBegin, handleMove]);

  const endpoints = useMemo(() => {
    if (!level) return {};
    const m = {};
    level.colors.forEach(c => {
      m[`${c.a[0]},${c.a[1]}`] = c.key;
      m[`${c.b[0]},${c.b[1]}`] = c.key;
    });
    return m;
  }, [level]);

  const totalCells   = level ? level.size * level.size : 0;
  const coveredCells = useMemo(() => {
    const s = new Set();
    for (const path of Object.values(paths))
      for (const cell of path) s.add(`${cell[0]},${cell[1]}`);
    return s.size;
  }, [paths]);

  // ── Select screen ──────────────────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <GestureHandlerRootView style={{ flex:1 }}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#0d0118"/>
          <View style={styles.header}>
            <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <ArrowLeft size={scale(18)} color="#fff" strokeWidth={2.5}/>
            </Pressable>
            <View style={styles.hCenter}>
              <Share2 size={scale(14)} color="#a78bfa" strokeWidth={2} style={{ marginRight:scale(6) }}/>
              <Text style={styles.hTitle}>Flow Free</Text>
            </View>
            <View style={{ width:scale(38) }}/>
          </View>
          <LevelSelect onSelect={startLevel}/>
          <GameBannerAd bottom size="banner"/>
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }

  // ── Game screen ────────────────────────────────────────────────────────────
  return (
    <GestureHandlerRootView style={{ flex:1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0d0118"/>

        <View style={styles.header}>
          <Pressable style={styles.iconBtn} onPress={() => setPhase('select')}>
            <ArrowLeft size={scale(18)} color="#fff" strokeWidth={2.5}/>
          </Pressable>
          <View style={styles.hCenter}>
            <Share2 size={scale(14)} color="#a78bfa" strokeWidth={2} style={{ marginRight:scale(6) }}/>
            <Text style={styles.hTitle}>{level?.badge}  ·  {level?.size}×{level?.size}</Text>
            <View style={styles.movePill}>
              <Text style={styles.moveTxt}>{moves}</Text>
            </View>
          </View>
          <Pressable style={styles.iconBtn} onPress={resetLevel}>
            <RefreshCw size={scale(16)} color="#fff" strokeWidth={2.5}/>
          </Pressable>
        </View>

        {/* Cells progress bar */}
        <View style={styles.progRow}>
          <View style={styles.progBg}>
            <View style={[styles.progFill, { width:`${(coveredCells/totalCells)*100}%` }]}/>
          </View>
          <Text style={styles.progTxt}>{coveredCells}/{totalCells} cells</Text>
        </View>

        {/* Color completion dots */}
        <View style={styles.colorRow}>
          {level?.colors.map(c => {
            const done = isComplete(c, paths[c.key] || []);
            return (
              <View key={c.key} style={[styles.colorDot, {
                backgroundColor: c.color + (done ? 'ff' : '28'),
                borderColor:     c.color + (done ? 'dd' : '44'),
              }]}>
                {done && <Text style={styles.checkMark}>✓</Text>}
              </View>
            );
          })}
        </View>

        {/* Board */}
        <GestureDetector gesture={gesture}>
          <View
            ref={boardRef}
            onLayout={measureBoard}
            style={styles.board}
            collapsable={false}
          >
            {level && Array.from({ length:level.size }, (_, r) => (
              <View key={r} style={{ flexDirection:'row' }}>
                {Array.from({ length:level.size }, (_, c) => (
                  <PipeCell
                    key={`${r}-${c}`} r={r} c={c}
                    paths={paths} endpoints={endpoints}
                    level={level} cellSize={cellSize}
                  />
                ))}
              </View>
            ))}
          </View>
        </GestureDetector>

        <GameBannerAd bottom size="banner"/>

        {/* Win overlay — receives showAd so it gates every CTA behind the interstitial */}
        <WinOverlay
          visible={won}
          level={level}
          moves={moves}
          onNext={goToNextLevel}
          onRestart={resetLevel}
          onBack={goToSelect}
          showAd={showAd}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0d0118', alignItems:'center' },

  header: {
    width:'100%', flexDirection:'row', alignItems:'center',
    paddingHorizontal:scale(16), paddingTop:scale(10), paddingBottom:scale(6),
  },
  iconBtn: {
    width:scale(38), height:scale(38), borderRadius:scale(12),
    backgroundColor:'#1f0a3a', borderWidth:1, borderColor:'#ffffff18',
    justifyContent:'center', alignItems:'center',
    ...Platform.select({
      ios:     { shadowColor:'#7b2fff', shadowOffset:{width:0,height:2}, shadowOpacity:0.3, shadowRadius:6 },
      android: { elevation:4 },
    }),
  },
  hCenter: { flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center' },
  hTitle: {
    fontSize:scale(14), fontWeight:'900', color:'#a78bfa', letterSpacing:1,
    textShadowColor:'#a78bfa88', textShadowOffset:{width:0,height:0}, textShadowRadius:8,
  },
  movePill: {
    marginLeft:scale(7), backgroundColor:'#a78bfa22', borderRadius:scale(8),
    paddingHorizontal:scale(8), paddingVertical:scale(2),
    borderWidth:1, borderColor:'#a78bfa44', minWidth:scale(32), alignItems:'center',
  },
  moveTxt: { fontSize:scale(10), color:'#a78bfa', fontWeight:'800' },

  progRow: {
    width:'100%', paddingHorizontal:scale(16), marginBottom:scale(5),
    flexDirection:'row', alignItems:'center', gap:scale(8),
  },
  progBg:   { flex:1, height:scale(5), backgroundColor:'#1f0a3a', borderRadius:scale(3), overflow:'hidden' },
  progFill: { height:'100%', backgroundColor:'#a78bfa', borderRadius:scale(3) },
  progTxt:  { fontSize:scale(9), color:'#9e86b8', fontWeight:'700', minWidth:scale(62) },

  colorRow: {
    flexDirection:'row', gap:scale(4), marginBottom:scale(7),
    paddingHorizontal:scale(16), flexWrap:'wrap', justifyContent:'center',
  },
  colorDot: {
    width:scale(22), height:scale(22), borderRadius:scale(11),
    borderWidth:2, justifyContent:'center', alignItems:'center',
  },
  checkMark: { fontSize:scale(10), color:'#fff', fontWeight:'900' },

  board: {
    width:BOARD_SIZE, backgroundColor:'#06011a',
    borderRadius:scale(10), borderWidth:1.5, borderColor:'#a78bfa33', overflow:'hidden',
  },

  // ── Level Select ────────────────────────────────────────────────────────────
  selectContent: { paddingHorizontal:scale(16), paddingTop:scale(8), paddingBottom:scale(24) },
  heroRing: {
    width:scale(96), height:scale(96), borderRadius:scale(48),
    backgroundColor:'#a78bfa12', borderWidth:1.5, borderColor:'#a78bfa44',
    justifyContent:'center', alignItems:'center', marginBottom:scale(12),
    ...Platform.select({
      ios:     { shadowColor:'#a78bfa', shadowOffset:{width:0,height:0}, shadowOpacity:0.3, shadowRadius:16 },
      android: { elevation:5 },
    }),
  },
  subLabel: { fontSize:scale(9), fontWeight:'900', color:'#a78bfa88', letterSpacing:4, marginBottom:scale(4) },
  bigTitle: {
    fontSize:scale(28), fontWeight:'900', color:'#fff', letterSpacing:1,
    textShadowColor:'#a78bfa44', textShadowOffset:{width:0,height:0}, textShadowRadius:10,
  },
  tagline: { fontSize:scale(11), color:'#9e86b8', fontWeight:'500', fontStyle:'italic', marginTop:scale(4) },
  levelGrid: { flexDirection:'row', flexWrap:'wrap', gap:scale(10) },
  levelCard: {
    width:(SCREEN_W - scale(32) - scale(10)) / 2,
    backgroundColor:'#160728', borderRadius:scale(14), borderWidth:1,
    padding:scale(14), alignItems:'center', gap:scale(6),
    ...Platform.select({
      ios:     { shadowColor:'#9c27b0', shadowOffset:{width:0,height:3}, shadowOpacity:0.2, shadowRadius:8 },
      android: { elevation:4 },
    }),
  },
  lvlRing:    { width:scale(36), height:scale(36), borderRadius:scale(18), borderWidth:1, justifyContent:'center', alignItems:'center' },
  lvlNum:     { fontSize:scale(16), fontWeight:'900' },
  lvlSize:    { fontSize:scale(11), fontWeight:'700' },
  diffTag:    { borderRadius:scale(6), paddingHorizontal:scale(8), paddingVertical:scale(2) },
  diffTxt:    { fontSize:scale(8), fontWeight:'900', letterSpacing:1.5 },
  dotRow:     { flexDirection:'row', gap:scale(4), marginTop:scale(2), flexWrap:'wrap', justifyContent:'center' },
  dotPreview: { width:scale(10), height:scale(10), borderRadius:scale(5) },

  // ── Win Overlay ─────────────────────────────────────────────────────────────
  overlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor:'rgba(5,0,14,0.95)',
    justifyContent:'center', alignItems:'center', zIndex:99,
  },
  winCard: {
    backgroundColor:'#100520', borderRadius:scale(24), borderWidth:1.5, borderColor:'#a78bfa33',
    padding:scale(24), alignItems:'center', width:SCREEN_W - scale(48),
    ...Platform.select({
      ios:     { shadowColor:'#a78bfa', shadowOffset:{width:0,height:0}, shadowOpacity:0.4, shadowRadius:24 },
      android: { elevation:12 },
    }),
  },
  winRing: {
    width:scale(76), height:scale(76), borderRadius:scale(38), backgroundColor:'#1f0a3a',
    borderWidth:2, borderColor:'#a78bfa55',
    justifyContent:'center', alignItems:'center', marginBottom:scale(12),
  },
  winTitle: {
    fontSize:scale(24), fontWeight:'900', color:'#a78bfa', letterSpacing:3,
    textShadowColor:'#a78bfa66', textShadowOffset:{width:0,height:0}, textShadowRadius:10, marginBottom:scale(4),
  },
  winSub:  { fontSize:scale(11), color:'#9e86b8', fontWeight:'700', letterSpacing:1, marginBottom:scale(14) },
  winStats: {
    flexDirection:'row', backgroundColor:'#0d0118', borderRadius:scale(14),
    paddingVertical:scale(12), paddingHorizontal:scale(16), marginBottom:scale(14),
    gap:scale(16), borderWidth:1, borderColor:'#ffffff0e',
    width:'100%', justifyContent:'center',
  },
  winStat: { alignItems:'center', gap:scale(3) },
  winVal:  { fontSize:scale(18), fontWeight:'900' },
  winLbl:  { fontSize:scale(8), color:'#9e86b8', fontWeight:'700', letterSpacing:1 },
  winDiv:  { width:1, height:scale(36), backgroundColor:'#ffffff14' },

  autoAdvanceRow:   { width:'100%', marginBottom:scale(12), gap:scale(4) },
  autoProgressBar:  { width:'100%', height:scale(4), backgroundColor:'#1f0a3a', borderRadius:scale(2), overflow:'hidden' },
  autoProgressFill: { height:'100%', width:'100%', backgroundColor:'#a78bfa', borderRadius:scale(2) },
  autoTxt:          { fontSize:scale(9), color:'#a78bfa88', fontWeight:'600', textAlign:'center' },

  winBtns: { flexDirection:'row', gap:scale(10), marginBottom:scale(10), width:'100%' },
  winPrimaryBtn: {
    flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center',
    backgroundColor:'#a78bfa', paddingVertical:scale(12), borderRadius:scale(20),
    ...Platform.select({
      ios:     { shadowColor:'#a78bfa', shadowOffset:{width:0,height:4}, shadowOpacity:0.5, shadowRadius:10 },
      android: { elevation:6 },
    }),
  },
  winPrimaryTxt: { fontSize:scale(13), fontWeight:'900', color:'#0d0118' },
  winSecBtn: {
    flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center',
    backgroundColor:'#a78bfa18', paddingVertical:scale(12), borderRadius:scale(20),
    borderWidth:1, borderColor:'#a78bfa44',
  },
  winSecTxt: { fontSize:scale(13), fontWeight:'700', color:'#a78bfa' },
  exitBtn:   { flexDirection:'row', alignItems:'center', paddingVertical:scale(8) },
  exitTxt:   { fontSize:scale(12), color:'#9e86b8', fontWeight:'600' },
});