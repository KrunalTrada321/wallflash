import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  PanResponder,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scale } from 'react-native-size-matters';
import Svg, { Path, Circle } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import GameSound from '../../Utils/GameSoundEffects';

const TOTAL_LEVELS = 50;

// --- GENERATOR LOGIC ---
const THEMES = [
  ['🍎', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🍍'],
  ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
  ['🚗', '🚕', '🚙', '🚌', '🚓', '🚑', '🚒', '🚜'],
  ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱'],
  ['☀️', '🌙', '☁️', '❄️', '⚡', '🔥', '💧', '🌈'],
  ['❤️', '💙', '💚', '💛', '💜', '🖤', '🤍', '🤎'],
  ['😀', '😍', '😎', '🥶', '🤠', '🤡', '👽', '👻'],
  ['🍔', '🍕', '🌭', '🌮', '🍣', '🍩', '🍪', '🍫'],
  ['🌍', '🌕', '🪐', '☄️', '🌟', '🚀', '🛸', '🛰️'],
  ['💎', '🔮', '💍', '👑', '🪙', '🛡️', '⚔️', '🗝️'],
  ['🐟', '🐠', '🐡', '🦈', '🐙', '🦀', '🦞', '🦑'],
  ['🦅', '🦆', '🦉', '🦇', '🦜', '🦚', '🦢', '🦩'],
  ['🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '🍀', '🍁'],
  ['🌷', '🌸', '🌹', '🌺', '🌻', '🌼', '🥀', '🪷'],
  ['🎵', '🎶', '🎸', '🎹', '🎺', '🎻', '🥁', '🎷'],
  ['💻', '⌨️', '🖱️', '🖨️', '📱', '📠', '📺', '📻'],
  ['🥑', '🥥', '🥝', '🥭', '🍏', '🍐', '🍈', '🍋'],
  ['🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🥔', '🧅'],
  ['🎃', '👻', '💀', '☠️', '🦇', '🕷️', '🕸️', '🥀'],
  ['🚁', '✈️', '⛵', '🚤', '🛳️', '🛶', '🚆', '🚇'],
  ['👕', '👖', '👗', '👘', '👙', '👚', '👔', '🧦'],
  ['👓', '🕶️', '🎩', '🧢', '👒', '🎒', '👜', '💼'],
  ['🦁', '🐯', '🦍', '🐘', '🦏', '🦒', '🦓', '🦛'],
  ['🦋', '🐛', '🐝', '🐞', '🦗', '🦂', '🐢', '🐍'],
  ['🔨', '⛏️', '🛠️', '🗡️', '🔫', '🏹', '🔧', '🪓']
];

function generateLevelData(levelIndex: number) {
  // Start smaller (4x4) and increase size every 5 levels to grow difficulty
  const size = Math.min(10, Math.max(4, 4 + Math.floor(levelIndex / 5)));
  // Number of pairs increases with size and level, capped at 8 (max theme size)
  const numPairs = Math.min(size + Math.floor(levelIndex / 8), 8);
  
  const themeIndex = levelIndex % THEMES.length;
  const theme = THEMES[themeIndex];
  
  let grid: number[][] = [];
  let paths: {x:number, y:number}[][] = [];
  
  let attempts = 0;
  // Increased attempts to find better (harder) layouts
  while (attempts < 2500) {
    attempts++;
    grid = Array(size).fill(0).map(() => Array(size).fill(-1));
    paths = Array.from({length: numPairs}, () => []);
    
    let starts = [];
    while (starts.length < numPairs) {
       const rx = Math.floor(Math.random() * size);
       const ry = Math.floor(Math.random() * size);
       if (grid[ry][rx] === -1) {
          grid[ry][rx] = starts.length;
          starts.push({x: rx, y: ry});
          paths[starts.length - 1].push({x: rx, y: ry});
       }
    }
    
    let moved = true;
    let unvisited = size * size - numPairs;
    
    while(moved && unvisited > 0) {
       moved = false;
       const pathIndices = Array.from({length: numPairs}, (_, i) => i).sort(() => Math.random() - 0.5);
       
       for (const p of pathIndices) {
          const path = paths[p];
          const head = path[path.length - 1];
          const neighbors = [
            {x: head.x+1, y: head.y}, {x: head.x-1, y: head.y},
            {x: head.x, y: head.y+1}, {x: head.x, y: head.y-1}
          ].filter(n => n.x >= 0 && n.x < size && n.y >= 0 && n.y < size && grid[n.y][n.x] === -1);
          
          if (neighbors.length > 0) {
             const next = neighbors[Math.floor(Math.random() * neighbors.length)];
             grid[next.y][next.x] = p;
             path.push(next);
             unvisited--;
             moved = true;
          }
       }
    }
    
    if (unvisited === 0) {
       // Ensure pairs are far apart (minimum path length) to make it difficult
       const minLength = size >= 6 ? 4 : 3;
       if (paths.every(p => p.length >= minLength)) {
         break;
       }
    }
  }
  
  if (attempts >= 2500) {
     // Guaranteed solvable fallback: cut a snake into segments
     const snakePath: {x:number, y:number}[] = [];
     for (let y = 0; y < size; y++) {
        if (y % 2 === 0) {
           for (let x = 0; x < size; x++) snakePath.push({x, y});
        } else {
           for (let x = size - 1; x >= 0; x--) snakePath.push({x, y});
        }
     }
     
     const fbEndpoints: {x:number, y:number, emoji:string}[] = [];
     const segmentLen = Math.floor(snakePath.length / numPairs);
     for (let i = 0; i < numPairs; i++) {
        const startIdx = i * segmentLen;
        const endIdx = (i === numPairs - 1) ? snakePath.length - 1 : (i + 1) * segmentLen - 1;
        fbEndpoints.push({ x: snakePath[startIdx].x, y: snakePath[startIdx].y, emoji: theme[i] });
        fbEndpoints.push({ x: snakePath[endIdx].x, y: snakePath[endIdx].y, emoji: theme[i] });
     }
     return { size, endpoints: fbEndpoints, theme };
  }
  
  const endpoints: {x:number, y:number, emoji:string}[] = [];
  paths.forEach((path, i) => {
     endpoints.push({ x: path[0].x, y: path[0].y, emoji: theme[i] });
     endpoints.push({ x: path[path.length-1].x, y: path[path.length-1].y, emoji: theme[i] });
  });
  
  return { size, endpoints, theme };
}

const PATH_COLORS = ['#FF3B30', '#34C759', '#007AFF', '#FFCC00', '#AF52DE', '#FF9500', '#FF2D55', '#5856D6'];
const { width } = Dimensions.get('window');
const boardPixelSize = width - scale(20);

export default function TwinsConnect() {
  const navigation = useNavigation<any>();
  const [currentLevel, setCurrentLevel] = useState(0); 
  const [highestUnlocked, setHighestUnlocked] = useState(0);
  const [isLevelSelectorOpen, setIsLevelSelectorOpen] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [showIncompleteMsg, setShowIncompleteMsg] = useState(false);
  const [isMuted, setIsMuted] = useState(GameSound.isMuted());
  const [tick, setTick] = useState(0);

  const levelData = useMemo(() => generateLevelData(currentLevel), [currentLevel]);
  const cellSize = Math.floor(boardPixelSize / levelData.size);
  const lineThickness = cellSize * 0.18; // Thinner lines as requested

  const pathsRef = useRef<Record<string, {x:number, y:number}[]>>({});
  const activeEmojiRef = useRef<string | null>(null);
  const gridLayout = useRef({ px: 0, py: 0 });
  const gridRef = useRef<View>(null);

  useEffect(() => {
    const unsubscribe = GameSound.subscribe(muted => {
      setIsMuted(muted);
    });
    return () => {
      unsubscribe();
      GameSound.stopAll();
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const savedHighest = await AsyncStorage.getItem('@twinsconnect_level');
        const savedCurrent = await AsyncStorage.getItem('@twinsconnect_current_level');
        const highest = savedHighest ? parseInt(savedHighest, 10) : 0;
        setHighestUnlocked(highest);
        if (savedCurrent) {
          const cur = parseInt(savedCurrent, 10);
          setCurrentLevel(Math.min(cur, Math.max(0, TOTAL_LEVELS - 1)));
        } else {
          setCurrentLevel(Math.min(highest, Math.max(0, TOTAL_LEVELS - 1)));
        }
      } catch (e) {
        console.warn('Error loading Twins Connect level progress', e);
      }
    })();
  }, []);

  const measureGrid = () => {
    gridRef.current?.measure((x, y, w, h, px, py) => {
      gridLayout.current = { px, py };
    });
  };

  const forceUpdate = () => setTick(t => t + 1);

  const resetBoard = () => {
    GameSound.playReset();
    pathsRef.current = {};
    setShowIncompleteMsg(false);
    forceUpdate();
  };

  const selectLevel = (lvlIndex: number) => {
    GameSound.playTap();
    setCurrentLevel(lvlIndex);
    AsyncStorage.setItem('@twinsconnect_current_level', lvlIndex.toString());
    pathsRef.current = {};
    setShowIncompleteMsg(false);
    setShowWin(false);
    setIsLevelSelectorOpen(false);
    forceUpdate();
  };

  const handleNextLevel = () => {
    GameSound.playTap();
    setShowWin(false);
    if (currentLevel < TOTAL_LEVELS - 1) {
      const next = currentLevel + 1;
      setCurrentLevel(next);
      AsyncStorage.setItem('@twinsconnect_current_level', next.toString());
    }
    pathsRef.current = {};
    setShowIncompleteMsg(false);
    forceUpdate();
  };

  const checkWinCondition = () => {
    const allEndpoints = levelData.endpoints;
    const uniqueEmojis = [...new Set(allEndpoints.map(e => e.emoji))];
    
    let allConnected = true;
    let totalPathCells = 0;

    for (const emoji of uniqueEmojis) {
      const path = pathsRef.current[emoji];
      if (!path || path.length < 2) {
        allConnected = false;
        break;
      }
      const endpointsForEmoji = allEndpoints.filter(e => e.emoji === emoji);
      const pStart = path[0];
      const pEnd = path[path.length - 1];
      
      const connects = (
         (pStart.x === endpointsForEmoji[0].x && pStart.y === endpointsForEmoji[0].y && pEnd.x === endpointsForEmoji[1].x && pEnd.y === endpointsForEmoji[1].y) ||
         (pStart.x === endpointsForEmoji[1].x && pStart.y === endpointsForEmoji[1].y && pEnd.x === endpointsForEmoji[0].x && pEnd.y === endpointsForEmoji[0].y)
      );
      if (!connects) {
        allConnected = false;
        break;
      }
      totalPathCells += path.length;
    }

    if (allConnected) {
      if (totalPathCells === levelData.size * levelData.size) {
        GameSound.playWin();
        setShowWin(true);
        setShowIncompleteMsg(false);
        const nextLvl = currentLevel + 1;
        if (nextLvl > highestUnlocked) {
          setHighestUnlocked(nextLvl);
          AsyncStorage.setItem('@twinsconnect_level', nextLvl.toString());
        }
        AsyncStorage.setItem('@twinsconnect_current_level', nextLvl.toString());
      } else {
        GameSound.playIncomplete();
        setShowIncompleteMsg(true);
      }
    } else {
      setShowIncompleteMsg(false);
    }
  };

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      measureGrid(); 
      const rawX = evt.nativeEvent.pageX - gridLayout.current.px;
      const rawY = evt.nativeEvent.pageY - gridLayout.current.py;
      const col = Math.max(0, Math.min(levelData.size - 1, Math.floor(rawX / cellSize)));
      const row = Math.max(0, Math.min(levelData.size - 1, Math.floor(rawY / cellSize)));

      setShowIncompleteMsg(false);

      const targetEmoji = levelData.endpoints.find(e => e.x === col && e.y === row);
      if (targetEmoji) {
        GameSound.playTap();
        activeEmojiRef.current = targetEmoji.emoji;
        pathsRef.current = { ...pathsRef.current, [targetEmoji.emoji]: [{x: col, y: row}] };
        forceUpdate();
      } else {
         for (const emoji in pathsRef.current) {
             const path = pathsRef.current[emoji];
             const idx = path.findIndex(c => c.x === col && c.y === row);
             if (idx !== -1) {
                 GameSound.playTap();
                 activeEmojiRef.current = emoji;
                 pathsRef.current[emoji] = path.slice(0, idx + 1);
                 forceUpdate();
                 break;
             }
         }
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      if (!activeEmojiRef.current) return;
      const rawX = gestureState.moveX - gridLayout.current.px;
      const rawY = gestureState.moveY - gridLayout.current.py;
      const targetCol = Math.max(0, Math.min(levelData.size - 1, Math.floor(rawX / cellSize)));
      const targetRow = Math.max(0, Math.min(levelData.size - 1, Math.floor(rawY / cellSize)));

      let currentPath = [...(pathsRef.current[activeEmojiRef.current] || [])];
      if (currentPath.length === 0) return;
      let lastCell = currentPath[currentPath.length - 1];

      if (lastCell.x === targetCol && lastCell.y === targetRow) return;

      // Generate orthogonal step-by-step path between lastCell and (targetCol, targetRow)
      // This prevents touch dropping when dragging fast or diagonally
      const steps: {x:number, y:number}[] = [];
      let cx = lastCell.x;
      let cy = lastCell.y;
      const dx = targetCol - cx;
      const dy = targetRow - cy;

      if (Math.abs(dx) >= Math.abs(dy)) {
        while (cx !== targetCol) {
          cx += Math.sign(dx);
          steps.push({ x: cx, y: cy });
        }
        while (cy !== targetRow) {
          cy += Math.sign(dy);
          steps.push({ x: cx, y: cy });
        }
      } else {
        while (cy !== targetRow) {
          cy += Math.sign(dy);
          steps.push({ x: cx, y: cy });
        }
        while (cx !== targetCol) {
          cx += Math.sign(dx);
          steps.push({ x: cx, y: cy });
        }
      }

      let didUpdate = false;
      let didConnect = false;
      let didCut = false;
      let newPaths = { ...pathsRef.current };

      for (const step of steps) {
        lastCell = currentPath[currentPath.length - 1];
        if (lastCell.x === step.x && lastCell.y === step.y) continue;

        // 1. Check if user is backtracking in currentPath
        const backIndex = currentPath.findIndex(c => c.x === step.x && c.y === step.y);
        if (backIndex !== -1) {
          currentPath = currentPath.slice(0, backIndex + 1);
          newPaths[activeEmojiRef.current] = currentPath;
          didUpdate = true;
          continue;
        }

        // 2. Prevent extending past the target endpoint if already connected
        const endpointsForActive = levelData.endpoints.filter(e => e.emoji === activeEmojiRef.current);
        const isLastCellEndpoint = endpointsForActive.some(e => e.x === lastCell.x && e.y === lastCell.y);
        if (isLastCellEndpoint && currentPath.length > 1) {
          break; // Already connected at target! Cannot extend past it.
        }

        // 3. Check endpoint collision at step
        const endpointAtStep = levelData.endpoints.find(e => e.x === step.x && e.y === step.y);
        if (endpointAtStep) {
          if (endpointAtStep.emoji !== activeEmojiRef.current) {
            // Cannot enter a different emoji's endpoint
            break;
          }
        }

        // 4. Cut any overlapping paths from other emojis
        Object.keys(newPaths).forEach(emoji => {
          if (emoji !== activeEmojiRef.current) {
            const crossIndex = newPaths[emoji].findIndex(c => c.x === step.x && c.y === step.y);
            if (crossIndex !== -1) {
              newPaths[emoji] = newPaths[emoji].slice(0, crossIndex);
              didCut = true;
            }
          }
        });

        // 5. Append step to currentPath
        currentPath.push(step);
        newPaths[activeEmojiRef.current] = currentPath;
        didUpdate = true;

        // If this step completed the connection
        if (endpointAtStep && endpointAtStep.emoji === activeEmojiRef.current && (endpointAtStep.x !== currentPath[0]?.x || endpointAtStep.y !== currentPath[0]?.y)) {
          didConnect = true;
          break; // Stop extending after connecting to partner
        }
      }

      if (didUpdate) {
        pathsRef.current = newPaths;
        forceUpdate();

        if (didConnect) {
          GameSound.playConnect();
        } else if (didCut) {
          GameSound.playCut();
        } else {
          GameSound.playStep(currentPath.length);
        }
      }
    },
    onPanResponderRelease: () => {
      activeEmojiRef.current = null;
      checkWinCondition();
    }
  }), [levelData]);

  // Calculate filled blocks for the UI
  let filledBlocks = 0;
  Object.values(pathsRef.current).forEach(p => filledBlocks += p.length);
  const totalBlocks = levelData.size * levelData.size;

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            GameSound.playTap();
            navigation.goBack();
          }} 
          style={styles.iconBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={scale(22)} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.levelBadgeBtn}
          activeOpacity={0.7}
          onPress={() => {
            GameSound.playTap();
            setIsLevelSelectorOpen(true);
          }}
        >
          <View style={styles.levelTitleRow}>
            <Text style={styles.levelText}>Level {currentLevel + 1} / {TOTAL_LEVELS}</Text>
            <Ionicons name="chevron-down" size={scale(15)} color="#39FF14" style={{ marginLeft: scale(4) }} />
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${(filledBlocks / totalBlocks) * 100}%` }]} />
          </View>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            onPress={() => {
              GameSound.playTap();
              setIsLevelSelectorOpen(true);
            }} 
            style={[styles.iconBtn, { marginRight: scale(8) }]}
            activeOpacity={0.7}
          >
            <Ionicons name="grid-outline" size={scale(20)} color="#39FF14" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => GameSound.toggleMute()} 
            style={[styles.iconBtn, { marginRight: scale(8) }]}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isMuted ? "volume-mute" : "volume-high"} 
              size={scale(20)} 
              color={isMuted ? "rgba(255,255,255,0.4)" : "#FFF"} 
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={resetBoard} style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="refresh" size={scale(20)} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- BOARD CONTAINER --- */}
      <View style={styles.boardContainer}>
        <View 
          ref={gridRef}
          style={[styles.grid, { width: levelData.size * cellSize, height: levelData.size * cellSize }]}
          onLayout={measureGrid}
          {...panResponder.panHandlers}
        >
          {/* Grid Background */}
          {Array.from({ length: totalBlocks }).map((_, i) => (
            <View key={`bg-${i}`} style={{
              position: 'absolute',
              left: (i % levelData.size) * cellSize,
              top: Math.floor(i / levelData.size) * cellSize,
              width: cellSize,
              height: cellSize,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.08)'
            }} />
          ))}

          {/* Smooth Rounded SVG Paths */}
          <Svg 
            style={StyleSheet.absoluteFillObject} 
            width={levelData.size * cellSize} 
            height={levelData.size * cellSize}
            pointerEvents="none"
          >
            {Object.entries(pathsRef.current).map(([emoji, path]) => {
              if (!path || path.length === 0) return null;
              const color = PATH_COLORS[levelData.theme.indexOf(emoji) % PATH_COLORS.length];
              const pathString = path.map((cell, idx) => 
                `${idx === 0 ? 'M' : 'L'} ${cell.x * cellSize + cellSize / 2} ${cell.y * cellSize + cellSize / 2}`
              ).join(' ');

              return (
                <React.Fragment key={`svg-path-${emoji}`}>
                  {/* Subtle soft glow */}
                  <Path 
                    d={pathString}
                    stroke={color}
                    strokeWidth={cellSize * 0.32}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity={0.25}
                    fill="none"
                  />
                  {/* Main solid smooth line with rounded joints & caps */}
                  <Path 
                    d={pathString}
                    stroke={color}
                    strokeWidth={cellSize * 0.22}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Center node highlight */}
                  {path.map((cell, idx) => (
                    <Circle
                      key={`joint-${idx}`}
                      cx={cell.x * cellSize + cellSize / 2}
                      cy={cell.y * cellSize + cellSize / 2}
                      r={cellSize * 0.11}
                      fill={color}
                    />
                  ))}
                </React.Fragment>
              );
            })}
          </Svg>

          {/* Endpoints */}
          {levelData.endpoints.map((ep, i) => (
            <View key={`ep-${i}`} style={{
              position: 'absolute',
              left: ep.x * cellSize,
              top: ep.y * cellSize,
              width: cellSize,
              height: cellSize,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{ fontSize: cellSize * 0.6 }}>{ep.emoji}</Text>
            </View>
          ))}
        </View>

        {showIncompleteMsg && !showWin && (
           <Text style={styles.incompleteMsg}>Connected! Now fill all empty spaces.</Text>
        )}
      </View>

      {/* ============================================================== */}
      {/* WIN OVERLAY MODAL                                              */}
      {/* ============================================================== */}
      {showWin && (
        <View style={styles.winOverlay}>
          <LinearGradient
            colors={['#1E1B4B', '#0F0F1A']}
            style={styles.winCard}
          >
            <Text style={styles.winEmoji}>🎉</Text>
            <Text style={styles.winTitle}>PERFECT!</Text>
            <Text style={styles.winSubtitle}>
              Level {currentLevel + 1} Cleared • All Twins Connected!
            </Text>

            <View style={styles.winStatsBox}>
              <View style={styles.winStatItem}>
                <Text style={styles.winStatLabel}>BOARD</Text>
                <Text style={styles.winStatVal}>{levelData.size}x{levelData.size}</Text>
              </View>
              <View style={styles.winStatItem}>
                <Text style={styles.winStatLabel}>PAIRS</Text>
                <Text style={styles.winStatVal}>{levelData.endpoints.length / 2}</Text>
              </View>
              <View style={styles.winStatItem}>
                <Text style={styles.winStatLabel}>THEME</Text>
                <Text style={styles.winStatVal}>{levelData.theme[0]}</Text>
              </View>
            </View>

            <View style={styles.winActionsRow}>
              <TouchableOpacity
                style={styles.winSecondaryBtn}
                activeOpacity={0.8}
                onPress={() => {
                  GameSound.playTap();
                  setShowWin(false);
                  setIsLevelSelectorOpen(true);
                }}
              >
                <Ionicons name="grid-outline" size={scale(18)} color="#FFF" style={{ marginRight: scale(4) }} />
                <Text style={styles.winBtnText}>LEVELS</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.winSecondaryBtn}
                activeOpacity={0.8}
                onPress={() => {
                  GameSound.playTap();
                  setShowWin(false);
                  resetBoard();
                }}
              >
                <Ionicons name="refresh" size={scale(18)} color="#FFF" style={{ marginRight: scale(4) }} />
                <Text style={styles.winBtnText}>RETRY</Text>
              </TouchableOpacity>
            </View>

            {currentLevel < TOTAL_LEVELS - 1 ? (
              <TouchableOpacity
                style={styles.winPrimaryBtn}
                activeOpacity={0.8}
                onPress={handleNextLevel}
              >
                <Text style={styles.winPrimaryBtnText}>NEXT LEVEL ➔</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.winPrimaryBtn, { backgroundColor: '#FBBF24' }]}
                activeOpacity={0.8}
                onPress={() => {
                  GameSound.playTap();
                  setShowWin(false);
                  setIsLevelSelectorOpen(true);
                }}
              >
                <Text style={[styles.winPrimaryBtnText, { color: '#000' }]}>🏆 ALL 50 CLEARED!</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </View>
      )}

      {/* ============================================================== */}
      {/* 50 LEVELS SELECTOR MODAL                                       */}
      {/* ============================================================== */}
      {isLevelSelectorOpen && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setIsLevelSelectorOpen(false)}
          />
          <View style={styles.levelSelectorCard}>
            <LinearGradient
              colors={['#1F1D36', '#0F0F1A']}
              style={styles.levelSelectorGradient}
            >
              {/* Header */}
              <View style={styles.selectorHeader}>
                <View>
                  <Text style={styles.selectorTitle}>SELECT LEVEL</Text>
                  <Text style={styles.selectorSubtitle}>
                    TWINS CONNECT • {Math.min(TOTAL_LEVELS, highestUnlocked + 1)} / {TOTAL_LEVELS} UNLOCKED
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    GameSound.playTap();
                    setIsLevelSelectorOpen(false);
                  }}
                  style={styles.closeBtn}
                  activeOpacity={0.7}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons name="close" size={scale(22)} color="#FFF" />
                </TouchableOpacity>
              </View>

              {/* 50 Level Cards Grid */}
              <ScrollView
                contentContainerStyle={styles.levelGrid}
                showsVerticalScrollIndicator={false}
              >
                {Array.from({ length: TOTAL_LEVELS }).map((_, idx) => {
                  const isUnlocked = idx <= highestUnlocked;
                  const isCurrent = idx === currentLevel;
                  const isCleared = idx < highestUnlocked;
                  const themeEmoji = THEMES[idx % THEMES.length][0];
                  const lvlSize = Math.min(10, Math.max(4, 4 + Math.floor(idx / 5)));

                  return (
                    <TouchableOpacity
                      key={`lvl-${idx}`}
                      disabled={!isUnlocked}
                      activeOpacity={0.7}
                      onPress={() => selectLevel(idx)}
                      style={[
                        styles.levelCard,
                        !isUnlocked && styles.levelCardLocked,
                        isCurrent && styles.levelCardCurrent,
                      ]}
                    >
                      {isUnlocked ? (
                        <>
                          <View style={styles.levelCardTop}>
                            <Text style={[styles.levelNum, isCurrent && styles.levelNumCurrent]}>
                              {idx + 1}
                            </Text>
                            {isCleared && !isCurrent && (
                              <Ionicons name="checkmark-circle" size={scale(12)} color="#39FF14" />
                            )}
                            {isCurrent && (
                              <View style={styles.playingDot} />
                            )}
                          </View>

                          <Text style={styles.levelEmojiPreview}>{themeEmoji}</Text>

                          <View style={[styles.sizeTag, isCurrent && styles.sizeTagCurrent]}>
                            <Text style={[styles.sizeTagText, isCurrent && styles.sizeTagTextCurrent]}>
                              {lvlSize}x{lvlSize}
                            </Text>
                          </View>
                        </>
                      ) : (
                        <View style={styles.lockedCardInner}>
                          <Ionicons name="lock-closed" size={scale(18)} color="#4B5563" />
                          <Text style={styles.lockedLevelNum}>{idx + 1}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </LinearGradient>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingTop: scale(8),
    paddingBottom: scale(8),
  },
  iconBtn: {
    width: scale(38),
    height: scale(38),
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: scale(19),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  levelBadgeBtn: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.35)',
    marginHorizontal: scale(8),
  },
  levelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    color: '#FFF',
    fontSize: scale(14),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  progressBarBg: {
    height: scale(4.5),
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: scale(3),
    marginTop: scale(4),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#39FF14',
  },
  boardContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  grid: { backgroundColor: '#1C1C2E', borderRadius: 8, overflow: 'hidden' },
  incompleteMsg: { color: '#FFCC00', marginTop: scale(16), fontSize: scale(15), fontWeight: '600' },

  // --- WIN OVERLAY STYLES ---
  winOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    padding: scale(20),
  },
  winCard: {
    width: '100%',
    maxWidth: scale(340),
    borderRadius: scale(24),
    padding: scale(24),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.4)',
    elevation: 20,
  },
  winEmoji: {
    fontSize: scale(46),
    marginBottom: scale(6),
  },
  winTitle: {
    fontSize: scale(28),
    color: '#39FF14',
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  winSubtitle: {
    fontSize: scale(13),
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    marginTop: scale(4),
    marginBottom: scale(16),
  },
  winStatsBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: scale(14),
    paddingVertical: scale(10),
    marginBottom: scale(18),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  winStatItem: {
    alignItems: 'center',
  },
  winStatLabel: {
    color: '#9CA3AF',
    fontSize: scale(9),
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  winStatVal: {
    color: '#FFF',
    fontSize: scale(15),
    fontWeight: '900',
    marginTop: scale(2),
  },
  winActionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: scale(10),
    marginBottom: scale(12),
  },
  winSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: scale(12),
    borderRadius: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  winBtnText: {
    color: '#FFF',
    fontSize: scale(13),
    fontWeight: '800',
  },
  winPrimaryBtn: {
    width: '100%',
    backgroundColor: '#39FF14',
    paddingVertical: scale(14),
    borderRadius: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  winPrimaryBtnText: {
    color: '#000',
    fontSize: scale(15),
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  // --- LEVEL SELECTOR MODAL STYLES ---
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    padding: scale(14),
  },
  levelSelectorCard: {
    width: '100%',
    maxHeight: '88%',
    borderRadius: scale(20),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    elevation: 24,
  },
  levelSelectorGradient: {
    padding: scale(16),
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(14),
    paddingBottom: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectorTitle: {
    color: '#FFF',
    fontSize: scale(17),
    fontWeight: '900',
    letterSpacing: 1,
  },
  selectorSubtitle: {
    color: '#39FF14',
    fontSize: scale(10.5),
    fontWeight: '700',
    marginTop: scale(2),
  },
  closeBtn: {
    width: scale(34),
    height: scale(34),
    borderRadius: scale(17),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: scale(20),
  },
  levelCard: {
    width: '23%',
    height: scale(74),
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: scale(12),
    marginBottom: scale(10),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(6),
    paddingHorizontal: scale(4),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  levelCardLocked: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.04)',
    opacity: 0.5,
  },
  levelCardCurrent: {
    borderColor: '#39FF14',
    borderWidth: 1.5,
    backgroundColor: 'rgba(57, 255, 20, 0.12)',
  },
  levelCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: scale(4),
  },
  levelNum: {
    color: '#FFF',
    fontSize: scale(11),
    fontWeight: '800',
  },
  levelNumCurrent: {
    color: '#39FF14',
  },
  playingDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: '#39FF14',
  },
  levelEmojiPreview: {
    fontSize: scale(18),
  },
  sizeTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: scale(5),
    paddingVertical: scale(1.5),
    borderRadius: scale(6),
  },
  sizeTagCurrent: {
    backgroundColor: 'rgba(57, 255, 20, 0.25)',
  },
  sizeTagText: {
    color: '#9CA3AF',
    fontSize: scale(8.5),
    fontWeight: '700',
  },
  sizeTagTextCurrent: {
    color: '#39FF14',
  },
  lockedCardInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedLevelNum: {
    color: '#4B5563',
    fontSize: scale(9),
    marginTop: scale(2),
  },
});
