import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView, PanResponder, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scale } from 'react-native-size-matters';

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
  const navigation = useNavigation();
  const [currentLevel, setCurrentLevel] = useState(0); 
  const [highestUnlocked, setHighestUnlocked] = useState(0);
  const [showWin, setShowWin] = useState(false);
  const [showIncompleteMsg, setShowIncompleteMsg] = useState(false);
  const [tick, setTick] = useState(0);

  const levelData = useMemo(() => generateLevelData(currentLevel), [currentLevel]);
  const cellSize = Math.floor(boardPixelSize / levelData.size);
  const lineThickness = cellSize * 0.18; // Thinner lines as requested

  const pathsRef = useRef<Record<string, {x:number, y:number}[]>>({});
  const activeEmojiRef = useRef<string | null>(null);
  const gridLayout = useRef({ px: 0, py: 0 });
  const gridRef = useRef<View>(null);

  useEffect(() => {
    AsyncStorage.getItem('@twinsconnect_level').then(lvl => {
      if (lvl) {
        const parsed = parseInt(lvl, 10);
        setCurrentLevel(parsed);
        setHighestUnlocked(parsed);
      }
    });
  }, []);

  const measureGrid = () => {
    gridRef.current?.measure((x, y, w, h, px, py) => {
      gridLayout.current = { px, py };
    });
  };

  const forceUpdate = () => setTick(t => t + 1);

  const resetBoard = () => {
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
        setShowWin(true);
        setShowIncompleteMsg(false);
        const nextLvl = currentLevel + 1;
        if (nextLvl > highestUnlocked) {
          setHighestUnlocked(nextLvl);
          AsyncStorage.setItem('@twinsconnect_level', nextLvl.toString());
        }
      } else {
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
      const x = evt.nativeEvent.pageX - gridLayout.current.px;
      const y = evt.nativeEvent.pageY - gridLayout.current.py;
      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);

      setShowIncompleteMsg(false);

      const targetEmoji = levelData.endpoints.find(e => e.x === col && e.y === row);
      if (targetEmoji) {
        activeEmojiRef.current = targetEmoji.emoji;
        pathsRef.current = { ...pathsRef.current, [targetEmoji.emoji]: [{x: col, y: row}] };
        forceUpdate();
      } else {
         for (const emoji in pathsRef.current) {
             const path = pathsRef.current[emoji];
             const idx = path.findIndex(c => c.x === col && c.y === row);
             if (idx !== -1) {
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
      const x = gestureState.moveX - gridLayout.current.px;
      const y = gestureState.moveY - gridLayout.current.py;
      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);

      if (col < 0 || col >= levelData.size || row < 0 || row >= levelData.size) return;

      const currentPath = pathsRef.current[activeEmojiRef.current] || [];
      const lastCell = currentPath[currentPath.length - 1];

      if (!lastCell || lastCell.x !== col || lastCell.y !== row) {
        if (lastCell && Math.abs(lastCell.x - col) + Math.abs(lastCell.y - row) !== 1) {
          return; 
        }

        // Prevent passing through the target icon
        const endpointsForActive = levelData.endpoints.filter(e => e.emoji === activeEmojiRef.current);
        const isLastCellEndpoint = endpointsForActive.some(e => e.x === lastCell?.x && e.y === lastCell?.y);
        
        if (isLastCellEndpoint && currentPath.length > 1) {
             const backIndex = currentPath.findIndex(c => c.x === col && c.y === row);
             if (backIndex === -1) {
                 return; // Stop extending past target
             }
        }

        const targetEmoji = levelData.endpoints.find(e => e.x === col && e.y === row);
        if (targetEmoji && targetEmoji.emoji !== activeEmojiRef.current) {
          return; 
        }

        const backIndex = currentPath.findIndex(c => c.x === col && c.y === row);
        if (backIndex !== -1) {
          pathsRef.current = { ...pathsRef.current, [activeEmojiRef.current]: currentPath.slice(0, backIndex + 1) };
          forceUpdate();
          return;
        }

        let newPaths = { ...pathsRef.current };
        Object.keys(newPaths).forEach(emoji => {
          if (emoji !== activeEmojiRef.current) {
             const crossIndex = newPaths[emoji].findIndex(c => c.x === col && c.y === row);
             if (crossIndex !== -1) {
                newPaths[emoji] = newPaths[emoji].slice(0, crossIndex);
             }
          }
        });

        newPaths[activeEmojiRef.current] = [...currentPath, {x: col, y: row}];
        pathsRef.current = newPaths;
        forceUpdate();
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={scale(24)} color="#FFF" />
        </TouchableOpacity>
        <View style={{ alignItems: 'center', flex: 1, paddingHorizontal: scale(20) }}>
           <Text style={styles.levelText}>Level {currentLevel + 1}</Text>
           <View style={{ height: scale(6), width: '100%', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: scale(3), marginTop: scale(6), overflow: 'hidden' }}>
              <View style={{ height: '100%', width: `${(filledBlocks / totalBlocks) * 100}%`, backgroundColor: '#39FF14' }} />
           </View>
        </View>
        <TouchableOpacity onPress={resetBoard} style={styles.iconBtn}>
          <Ionicons name="refresh" size={scale(24)} color="#FFF" />
        </TouchableOpacity>
      </View>

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

          {/* Paths */}
          {Object.entries(pathsRef.current).map(([emoji, path]) => {
            const color = PATH_COLORS[levelData.theme.indexOf(emoji) % PATH_COLORS.length];
            return (
              <React.Fragment key={`path-${emoji}`}>
                {path.map((cell, index) => {
                  if (index === 0) return null;
                  const prev = path[index - 1];
                  const left = Math.min(cell.x, prev.x) * cellSize + cellSize / 2;
                  const top = Math.min(cell.y, prev.y) * cellSize + cellSize / 2;
                  const w = Math.abs(cell.x - prev.x) * cellSize + lineThickness;
                  const h = Math.abs(cell.y - prev.y) * cellSize + lineThickness;
                  return (
                    <View 
                      key={`line-${index}`}
                      style={{
                        position: 'absolute',
                        left: left - lineThickness / 2,
                        top: top - lineThickness / 2,
                        width: w,
                        height: h,
                        backgroundColor: color,
                        borderRadius: lineThickness / 2
                      }}
                    />
                  );
                })}
                {path.map((cell, index) => (
                   <View 
                      key={`joint-${index}`}
                      style={{
                        position: 'absolute',
                        left: cell.x * cellSize + cellSize / 2 - lineThickness / 2,
                        top: cell.y * cellSize + cellSize / 2 - lineThickness / 2,
                        width: lineThickness,
                        height: lineThickness,
                        backgroundColor: color,
                        borderRadius: lineThickness / 2
                      }}
                    />
                ))}
              </React.Fragment>
            );
          })}

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

      {/* Win Overlay */}
      {showWin && (
        <View style={styles.winOverlay}>
          <Text style={styles.winTitle}>Perfect! 🎉</Text>
          <TouchableOpacity 
            style={styles.nextBtn}
            activeOpacity={0.8}
            onPress={() => {
              setShowWin(false);
              setCurrentLevel(l => l + 1);
              resetBoard();
            }}
          >
            <Text style={styles.nextBtnText}>NEXT LEVEL</Text>
          </TouchableOpacity>
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
    paddingHorizontal: scale(20),
    paddingTop: scale(10),
    paddingBottom: scale(10)
  },
  iconBtn: { padding: scale(10), backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: scale(20) },
  levelText: { color: '#FFF', fontSize: scale(20), fontWeight: 'bold' },
  progressText: { color: 'rgba(255,255,255,0.6)', fontSize: scale(12), marginTop: 2 },
  boardContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  grid: { backgroundColor: '#1C1C2E', borderRadius: 8, overflow: 'hidden' },
  incompleteMsg: { color: '#FFCC00', marginTop: scale(20), fontSize: scale(16), fontWeight: '600' },
  winOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,15,26,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  },
  winTitle: { fontSize: scale(40), color: '#39FF14', fontWeight: '900', marginBottom: scale(30) },
  nextBtn: { backgroundColor: '#007AFF', paddingHorizontal: scale(40), paddingVertical: scale(15), borderRadius: scale(30) },
  nextBtnText: { color: '#FFF', fontSize: scale(18), fontWeight: 'bold' }
});
