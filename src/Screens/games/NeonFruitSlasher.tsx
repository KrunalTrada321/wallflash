import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  PanResponder,
  Animated,
  Vibration,
  ScrollView,
  Platform,
} from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Line,
} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import GameSound from '../../Utils/GameSoundEffects';
import { useGameInterstitialAd } from '../../Components/Useinterstitialad';
import {
  FRUIT_CONFIGS,
  BLADE_LEVELS,
  FruitConfig,
  BladeLevel,
} from './neonBladeLevels';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TrailPoint {
  x: number;
  y: number;
  time: number;
}

interface ActiveItem {
  id: number;
  type: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  radius: number;
  hitsLeft: number;
  maxHits: number;
  isSliced: boolean;
  opacity: number;
  isGhost?: boolean;
  ghostPhase?: number;
}

interface SlicedHalf {
  id: number;
  type: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  radius: number;
  color: string;
  rindColor: string;
  isLeftHalf: boolean;
}

interface SliceParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
}

interface SliceFlash {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

interface ComboAlert {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  opacity: number;
}

// Single consolidated render state to prevent multiple re-renders per frame
interface GameRenderState {
  items: ActiveItem[];
  halves: SlicedHalf[];
  particles: SliceParticle[];
  flashes: SliceFlash[];
  alerts: ComboAlert[];
  trail: TrailPoint[];
}

export default function NeonFruitSlasher() {
  const navigation = useNavigation<any>();
  const { showNaturalAd } = useGameInterstitialAd({ transitionInterval: 2, cooldownSeconds: 45 });

  // --- Campaign / Level State ---
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const currentLevel: BladeLevel = BLADE_LEVELS[currentLevelIndex] || BLADE_LEVELS[0];
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(1);
  const [levelStars, setLevelStars] = useState<Record<number, number>>({});
  const [isLevelSelectorOpen, setIsLevelSelectorOpen] = useState(false);

  // --- Core Game Stats ---
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [slicesCount, setSlicesCount] = useState(0);
  const [lives, setLives] = useState(3);
  const [isMuted, setIsMuted] = useState(GameSound.isMuted());

  // --- Power-ups State ---
  const [isFrozen, setIsFrozen] = useState(false);
  const [isFrenzy, setIsFrenzy] = useState(false);
  const [isComboFever, setIsComboFever] = useState(false);
  const isComboFeverRef = useRef(false);
  const comboFeverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Modals State ---
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const [isSecretWallpaperModalOpen, setIsSecretWallpaperModalOpen] = useState(false);
  const [winStars, setWinStars] = useState(1);

  // --- Single Consolidated Render State ---
  const [renderState, setRenderState] = useState<GameRenderState>({
    items: [],
    halves: [],
    particles: [],
    flashes: [],
    alerts: [],
    trail: [],
  });

  // --- Screen Shake Animation ---
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // --- Mutable Refs for High-Performance Physics Loop ---
  const itemsRef = useRef<ActiveItem[]>([]);
  const halvesRef = useRef<SlicedHalf[]>([]);
  const particlesRef = useRef<SliceParticle[]>([]);
  const flashesRef = useRef<SliceFlash[]>([]);
  const trailRef = useRef<TrailPoint[]>([]);
  const comboAlertsRef = useRef<ComboAlert[]>([]);
  const currentSwipeHits = useRef<number>(0);
  const lastWhooshTime = useRef<number>(0);
  const lastSpikeHitTime = useRef<number>(0);
  const freezeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const spawnTimerRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const itemIdCounter = useRef<number>(1);
  const spikeRotRef = useRef<number>(0);

  // --- Load Progress ---
  useEffect(() => {
    (async () => {
      try {
        const savedLvl = await AsyncStorage.getItem('@neonblade_level');
        const savedStars = await AsyncStorage.getItem('@neonblade_stars');
        const savedHigh = await AsyncStorage.getItem('@neonblade_highscore');
        if (savedLvl) {
          const lvl = parseInt(savedLvl, 10);
          setMaxUnlockedLevel(lvl);
          setCurrentLevelIndex(Math.min(lvl - 1, BLADE_LEVELS.length - 1));
        }
        if (savedStars) setLevelStars(JSON.parse(savedStars));
        if (savedHigh) setHighScore(parseInt(savedHigh, 10));
      } catch (e) {
        console.warn('Failed to load neon blade save', e);
      }
    })();
  }, []);

  // --- Screen Shake ---
  const triggerScreenShake = useCallback((mag: number = 8) => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: mag, duration: 35, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -mag, duration: 35, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: mag / 2, duration: 35, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 35, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  // --- Spawn 4 Snappy Exploding Sparks on Slice (Ultra-Lightweight & Zero Lag) ---
  const spawnExplodingParticles = useCallback((x: number, y: number, pulpColors: string[]) => {
    const count = 4;
    const newParticles: SliceParticle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = scale(3.0 + Math.random() * 4.0);
      const color = pulpColors[i % pulpColors.length] || '#EF4444';

      newParticles.push({
        id: Math.random(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - scale(1.5),
        color,
        size: scale(2.4 + Math.random() * 1.8),
        opacity: 1,
      });
    }

    particlesRef.current = [...particlesRef.current.slice(-4), ...newParticles];
  }, []);

  // --- Controlled, Rhythmic Spawner (Multi-fruit Combo Throws & Balanced Campaign Scaling) ---
  const spawnWave = useCallback(() => {
    const lvl = currentLevel;
    // Multi-fruit combo opportunity: ~32% chance (or 100% in Frenzy) to launch a multi-fruit volley!
    // Instead of throwing a single star, throw MULTIPLE fruits at the same time so player can combo-slice!
    const isComboWave = isFrenzy || Math.random() < 0.32;

    // In combo waves, throw 3 to 5 fruits simultaneously!
    // In normal waves, throw 1 to 2 fruits.
    const waveCount = isFrenzy
      ? 3 + Math.floor(Math.random() * 2)
      : isComboWave
      ? 3 + (lvl.id > 12 ? Math.floor(Math.random() * 2) : 0)
      : Math.random() < Math.max(0.35, 0.65 - (lvl.id / 50) * 0.3)
      ? 1
      : 2;

    const newItems: ActiveItem[] = [];
    const speedScale = 1.0 + (lvl.id / 50) * 0.18;

    // Filter allowed fruits to real fruits only (exclude bombs/spikes and no stars)
    const validFruits = lvl.allowedFruits.filter(f => f !== 'bomb' && f !== 'spike');
    const fruitPool = validFruits.length > 0 ? validFruits : ['watermelon', 'banana', 'apple', 'orange'];

    // Distribute launch slots across the screen so fruits rise together in a beautiful synchronized arc
    const minX = scale(45);
    const maxX = SCREEN_WIDTH - scale(45);
    const stepX = (maxX - minX) / Math.max(1, waveCount);

    for (let i = 0; i < waveCount; i++) {
      // In combo waves, never make the first 2 items bombs so player can comfortably combo-slash
      const canBeBomb = (!isComboWave || i >= 2) && !newItems.some(it => it.type === 'bomb');
      const isBomb = canBeBomb && Math.random() < lvl.bombChance;

      let type: string;
      if (isBomb) {
        type = 'bomb';
      } else {
        // Pick varied fruits across the pool for a colorful multi-fruit volley
        type = fruitPool[(i + Math.floor(Math.random() * fruitPool.length)) % fruitPool.length];
      }

      const cfg = FRUIT_CONFIGS[type] || FRUIT_CONFIGS.watermelon;

      // Staggered horizontal launch points across the screen
      let startX: number;
      if (waveCount > 1) {
        const slotCenter = minX + (i + 0.5) * stepX;
        startX = slotCenter + (Math.random() - 0.5) * scale(18);
      } else {
        startX = scale(55 + Math.random() * (SCREEN_WIDTH - 110));
      }
      startX = Math.max(scale(35), Math.min(SCREEN_WIDTH - scale(35), startX));

      // Parabolic trajectories: aimed towards center screen so they hang in the air together for a combo swipe!
      const targetCenterX = SCREEN_WIDTH / 2 + (Math.random() - 0.5) * scale(50);
      const vx = ((targetCenterX - startX) / SCREEN_WIDTH) * scale((2.4 + Math.random() * 2.2) * speedScale);

      // Tuned impulse: reaches apex safely at y ≈ scale(175) to scale(215)
      const vy = -scale(17.5 + Math.random() * 1.6);

      newItems.push({
        id: itemIdCounter.current++,
        type,
        x: startX,
        y: SCREEN_HEIGHT + scale(15),
        vx,
        vy,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 5,
        radius: scale(cfg.radius),
        hitsLeft: cfg.maxHits || 1,
        maxHits: cfg.maxHits || 1,
        isSliced: false,
        opacity: 1,
        isGhost: lvl.hasGhostFruits && Math.random() < 0.25,
        ghostPhase: Math.random() * Math.PI * 2,
      });
    }

    if (waveCount >= 3) {
      GameSound.playStep(2);
    }

    itemsRef.current = [...itemsRef.current, ...newItems];
  }, [currentLevel, isFrenzy]);

  // --- Line Segment to Circle Intersection Check ---
  const checkSliceIntersection = (
    p1: TrailPoint,
    p2: TrailPoint,
    item: ActiveItem
  ): boolean => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return false;

    const t = Math.max(0, Math.min(1, ((item.x - p1.x) * dx + (item.y - p1.y) * dy) / lenSq));
    const projX = p1.x + t * dx;
    const projY = p1.y + t * dy;

    // Generous and responsive hit distance (+ scale(12))
    const hitRadius = item.radius + scale(12);
    const distSq = (item.x - projX) ** 2 + (item.y - projY) ** 2;
    return distSq <= hitRadius ** 2;
  };

  // --- Handle Fruit Cleaved ---
  const handleItemSliced = (item: ActiveItem, sliceAngle: number, cutP1: TrailPoint, cutP2: TrailPoint) => {
    const cfg = FRUIT_CONFIGS[item.type] || FRUIT_CONFIGS.watermelon;

    // Check for Bomb Detonation: decreases heart, shakes screen, triggers fiery explosion
    if (cfg.isObstacle && item.type === 'bomb') {
      triggerScreenShake(16);
      GameSound.playIncomplete();
      if (Platform.OS === 'android') Vibration.vibrate([0, 50, 70, 120]);
      spawnExplodingParticles(item.x, item.y, ['#EF4444', '#F97316', '#FBBF24', '#FFFFFF']);

      setLives(prev => {
        const next = Math.max(0, prev - 1);
        if (next <= 0) {
          setIsGameOverModalOpen(true);
        }
        return next;
      });

      item.isSliced = true;
      return;
    }

    // Check for Armored Coconut / Titan Boss Multi-Hits
    if (item.hitsLeft > 1) {
      item.hitsLeft -= 1;
      GameSound.playCut();
      if (Platform.OS === 'android') Vibration.vibrate(18);
      triggerScreenShake(4);
      spawnExplodingParticles(item.x, item.y, ['#38BDF8', '#FFFFFF']);
      return;
    }

    // Cleaved in Half!
    item.isSliced = true;
    currentSwipeHits.current += 1;

    // Instant slice flash - accurately centered on the sliced fruit along the cut angle (NEVER shoots off-screen!)
    const flashLen = item.radius * 1.35;
    const fx1 = item.x - Math.cos(sliceAngle) * flashLen;
    const fy1 = item.y - Math.sin(sliceAngle) * flashLen;
    const fx2 = item.x + Math.cos(sliceAngle) * flashLen;
    const fy2 = item.y + Math.sin(sliceAngle) * flashLen;

    flashesRef.current = [
      {
        id: Math.random(),
        x1: Math.max(scale(5), Math.min(SCREEN_WIDTH - scale(5), fx1)),
        y1: Math.max(scale(120), Math.min(SCREEN_HEIGHT, fy1)),
        x2: Math.max(scale(5), Math.min(SCREEN_WIDTH - scale(5), fx2)),
        y2: Math.max(scale(120), Math.min(SCREEN_HEIGHT, fy2)),
        opacity: 0.95,
      },
    ];

    // Spawn clean particle burst
    spawnExplodingParticles(item.x, item.y, cfg.pulpColors || [cfg.color, cfg.rindColor]);

    // Power-up triggers
    if (cfg.isSpecial === 'freeze') {
      setIsFrozen(true);
      GameSound.playDownloadSuccess();
      if (Platform.OS === 'android') Vibration.vibrate([0, 30, 40, 60]);
      if (freezeTimeoutRef.current) clearTimeout(freezeTimeoutRef.current);
      freezeTimeoutRef.current = setTimeout(() => {
        setIsFrozen(false);
      }, 4000);
    } else if (cfg.isSpecial === 'frenzy') {
      setIsFrenzy(true);
      GameSound.playLike();
      setTimeout(() => setIsFrenzy(false), 4500);
    } else if (cfg.isSpecial === 'boss') {
      GameSound.playSupernovaExplosion();
      triggerScreenShake(14);
      if (currentLevel.id === 50) {
        setIsSecretWallpaperModalOpen(true);
      }
    } else {
      GameSound.playCelestialMerge(1.2 + currentSwipeHits.current * 0.12, 16);
    }

    // Real-time multi-fruit combo chain feedback on consecutive cuts in the same swipe!
    if (currentSwipeHits.current >= 2) {
      const comboBonus = (currentSwipeHits.current - 1) * 20;
      const comboColors = ['#38BDF8', '#FACC15', '#FB923C', '#EC4899', '#A855F7'];
      const alertColor = comboColors[Math.min(currentSwipeHits.current - 2, comboColors.length - 1)];
      const alertText =
        currentSwipeHits.current >= 5
          ? `👑 ${currentSwipeHits.current}x GODLIKE! +${comboBonus}`
          : currentSwipeHits.current >= 4
          ? `🔥 ${currentSwipeHits.current}x MEGA! +${comboBonus}`
          : currentSwipeHits.current >= 3
          ? `⚡ ${currentSwipeHits.current}x COMBO! +${comboBonus}`
          : `✨ 2x COMBO! +${comboBonus}`;

      GameSound.playStep(currentSwipeHits.current);

      // On 3+ fruit cuts in a single swipe, trigger 2X Combo Fever!
      if (currentSwipeHits.current >= 3 && !isComboFeverRef.current) {
        setIsComboFever(true);
        isComboFeverRef.current = true;
        if (comboFeverTimeoutRef.current) clearTimeout(comboFeverTimeoutRef.current);
        comboFeverTimeoutRef.current = setTimeout(() => {
          setIsComboFever(false);
          isComboFeverRef.current = false;
        }, 4500);
      }

      // Show only one combo card at a time, positioned on the side out of gameplay
      comboAlertsRef.current = [
        {
          id: Date.now(),
          text: alertText,
          x: 0,
          y: 0,
          color: alertColor,
          opacity: 1,
        },
      ];
    }

    // Two Halves with Perpendicular Ejection Impulse (Capped max 4 on screen, bounded safely)
    const perpAngle = sliceAngle + Math.PI / 2;
    const splitSpeed = scale(3.5);
    const halfA: SlicedHalf = {
      id: Math.random(),
      type: item.type,
      x: Math.max(scale(15), Math.min(SCREEN_WIDTH - scale(15), item.x)),
      y: item.y,
      vx: Math.max(-scale(6), Math.min(scale(6), item.vx + Math.cos(perpAngle) * splitSpeed)),
      vy: item.vy - scale(2.0),
      rotation: item.rotation,
      rotSpeed: 6.0,
      radius: item.radius,
      color: cfg.color,
      rindColor: cfg.rindColor,
      isLeftHalf: true,
    };
    const halfB: SlicedHalf = {
      id: Math.random(),
      type: item.type,
      x: Math.max(scale(15), Math.min(SCREEN_WIDTH - scale(15), item.x)),
      y: item.y,
      vx: Math.max(-scale(6), Math.min(scale(6), item.vx - Math.cos(perpAngle) * splitSpeed)),
      vy: item.vy - scale(2.0),
      rotation: item.rotation,
      rotSpeed: -6.0,
      radius: item.radius,
      color: cfg.color,
      rindColor: cfg.rindColor,
      isLeftHalf: false,
    };

    halvesRef.current = [...halvesRef.current.slice(-2), halfA, halfB];

    // Score & Slices Count (with Combo Multiplier and Combo Fever bonus)
    const feverMultiplier = isComboFeverRef.current ? 2 : 1;
    const comboMultiplier = currentSwipeHits.current >= 3 ? 2 : 1;
    const streakBonus = currentSwipeHits.current >= 2 ? (currentSwipeHits.current - 1) * 20 : 0;
    const addedPoints = cfg.points * feverMultiplier * comboMultiplier + streakBonus;

    setScore(s => {
      const updated = s + addedPoints;
      setHighScore(h => {
        if (updated > h) {
          AsyncStorage.setItem('@neonblade_highscore', updated.toString());
          return updated;
        }
        return h;
      });
      return updated;
    });

    setSlicesCount(cnt => cnt + 1);
  };

  // --- Laser Spike Positions ---
  const spikePositions = useMemo(() => {
    const count = currentLevel.spikeCount;
    if (count === 1) return [{ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT * 0.48 }];
    if (count === 2)
      return [
        { x: SCREEN_WIDTH * 0.28, y: SCREEN_HEIGHT * 0.44 },
        { x: SCREEN_WIDTH * 0.72, y: SCREEN_HEIGHT * 0.44 },
      ];
    if (count === 3)
      return [
        { x: SCREEN_WIDTH * 0.24, y: SCREEN_HEIGHT * 0.42 },
        { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT * 0.54 },
        { x: SCREEN_WIDTH * 0.76, y: SCREEN_HEIGHT * 0.42 },
      ];
    if (count >= 4)
      return [
        { x: SCREEN_WIDTH * 0.25, y: SCREEN_HEIGHT * 0.38 },
        { x: SCREEN_WIDTH * 0.75, y: SCREEN_HEIGHT * 0.38 },
        { x: SCREEN_WIDTH * 0.28, y: SCREEN_HEIGHT * 0.58 },
        { x: SCREEN_WIDTH * 0.72, y: SCREEN_HEIGHT * 0.58 },
      ];
    return [];
  }, [currentLevel.spikeCount]);

  // --- PanResponder for Katana Swiping (Only Active Below Top Header) ---
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt) => evt.nativeEvent.locationY > scale(115),
        onMoveShouldSetPanResponder: (evt) => evt.nativeEvent.locationY > scale(115),
        onPanResponderGrant: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          const clampedX = Math.max(scale(10), Math.min(SCREEN_WIDTH - scale(10), locationX));
          const clampedY = Math.max(scale(120), Math.min(SCREEN_HEIGHT - scale(10), locationY));
          trailRef.current = [{ x: clampedX, y: clampedY, time: Date.now() }];
          currentSwipeHits.current = 0;
        },
        onPanResponderMove: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          const clampedX = Math.max(scale(10), Math.min(SCREEN_WIDTH - scale(10), locationX));
          const clampedY = Math.max(scale(120), Math.min(SCREEN_HEIGHT - scale(10), locationY));
          const now = Date.now();
          const prev = trailRef.current[trailRef.current.length - 1];

          if (prev) {
            const dx = clampedX - prev.x;
            const dy = clampedY - prev.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const dt = Math.max(1, now - prev.time);
            const speed = dist / dt; // px per ms

            // Blade whoosh sound: ONLY during fast, active blade movement!
            // NEVER when stationary or holding touch or moving slowly!
            if (dist > scale(24) && speed > 0.42 && now - lastWhooshTime.current > 260) {
              GameSound.playCelestialDrop();
              lastWhooshTime.current = now;
            }

            // Only add points and test intersection if there is true movement (avoids ghost slashes when holding touch)
            if (dist > 8) {
              if (dist > 20) {
                const steps = Math.min(3, Math.floor(dist / 16));
                for (let s = 1; s <= steps; s++) {
                  const interpX = prev.x + (dx * s) / (steps + 1);
                  const interpY = prev.y + (dy * s) / (steps + 1);
                  trailRef.current.push({ x: interpX, y: interpY, time: now });
                }
              }

              trailRef.current.push({ x: clampedX, y: clampedY, time: now });

              // Keep fresh 8 points for silky smooth 60 FPS performance
              if (trailRef.current.length > 8) {
                trailRef.current.splice(0, trailRef.current.length - 8);
              }

              const sliceAngle = Math.atan2(dy, dx);

              // Check slice against active items
              itemsRef.current.forEach(item => {
                if (item.isSliced) return;
                if (item.isGhost && item.opacity < 0.6) return;

                if (checkSliceIntersection(prev, { x: clampedX, y: clampedY, time: now }, item)) {
                  handleItemSliced(item, sliceAngle, prev, { x: clampedX, y: clampedY, time: now });
                }
              });

              // Hazard Check: Touching rotating laser spikes costs 1 heart
              if (spikePositions.length > 0 && now - lastSpikeHitTime.current > 1200) {
                for (const spk of spikePositions) {
                  const distSq = (spk.x - clampedX) ** 2 + (spk.y - clampedY) ** 2;
                  if (distSq < scale(26) ** 2) {
                    lastSpikeHitTime.current = now;
                    triggerScreenShake(12);
                    GameSound.playIncomplete();
                    if (Platform.OS === 'android') Vibration.vibrate(60);
                    setLives(prevLives => {
                      const next = Math.max(0, prevLives - 1);
                      if (next <= 0) {
                        setIsGameOverModalOpen(true);
                      }
                      return next;
                    });
                    break;
                  }
                }
              }
            }
          } else {
            trailRef.current.push({ x: clampedX, y: clampedY, time: now });
          }
        },
        onPanResponderRelease: () => {
          if (currentSwipeHits.current >= 3) {
            const last = trailRef.current[trailRef.current.length - 1] || {
              x: SCREEN_WIDTH / 2,
              y: SCREEN_HEIGHT / 2,
            };
            const comboText =
              currentSwipeHits.current >= 5
                ? `🔥 ${currentSwipeHits.current}x MEGA COMBO!`
                : `⚡ ${currentSwipeHits.current}x COMBO!`;

            comboAlertsRef.current = [
              ...comboAlertsRef.current.slice(-2),
              {
                id: Math.random(),
                text: comboText,
                x: last.x,
                y: Math.max(scale(90), last.y - scale(30)),
                color: currentSwipeHits.current >= 5 ? '#FBBF24' : '#38BDF8',
                opacity: 1,
              },
            ];
            GameSound.playStep(6);
          }

          trailRef.current = [];
          currentSwipeHits.current = 0;
        },
        onPanResponderTerminate: () => {
          trailRef.current = [];
          currentSwipeHits.current = 0;
        },
      }),
    [currentLevel, spikePositions, triggerScreenShake]
  );

  // --- Start / Reset Current Level (Survival: No Time Expiration) ---
  const startLevel = useCallback((lvlIndex: number) => {
    const lvl = BLADE_LEVELS[lvlIndex] || BLADE_LEVELS[0];
    setCurrentLevelIndex(lvlIndex);
    setScore(0);
    setSlicesCount(0);
    setLives(3);
    setIsFrozen(false);
    setIsFrenzy(false);
    setIsWinModalOpen(false);
    setIsGameOverModalOpen(false);
    setIsSecretWallpaperModalOpen(false);

    if (freezeTimeoutRef.current) {
      clearTimeout(freezeTimeoutRef.current);
      freezeTimeoutRef.current = null;
    }
    setIsComboFever(false);
    isComboFeverRef.current = false;
    if (comboFeverTimeoutRef.current) {
      clearTimeout(comboFeverTimeoutRef.current);
      comboFeverTimeoutRef.current = null;
    }

    itemsRef.current = [];
    halvesRef.current = [];
    particlesRef.current = [];
    flashesRef.current = [];
    comboAlertsRef.current = [];
    trailRef.current = [];
    spawnTimerRef.current = 0;

    // Immediately spawn first wave
    setTimeout(() => {
      spawnWave();
    }, 150);
  }, [spawnWave]);

  // Initialize on mount
  useEffect(() => {
    startLevel(currentLevelIndex);
    return () => {
      if (freezeTimeoutRef.current) clearTimeout(freezeTimeoutRef.current);
      if (comboFeverTimeoutRef.current) clearTimeout(comboFeverTimeoutRef.current);
    };
  }, []);

  // --- Win Evaluation ---
  useEffect(() => {
    if (slicesCount >= currentLevel.targetSlices && !isWinModalOpen) {
      let stars = 1;
      if (lives === 3) stars = 3;
      else if (lives === 2) stars = 2;

      setWinStars(stars);
      setIsWinModalOpen(true);
      GameSound.playWin();

      const nextUnlocked = Math.max(maxUnlockedLevel, currentLevel.id + 1);
      setMaxUnlockedLevel(nextUnlocked);
      AsyncStorage.setItem('@neonblade_level', nextUnlocked.toString());

      setLevelStars(prev => {
        const best = prev[currentLevel.id] || 0;
        const updated = { ...prev, [currentLevel.id]: Math.max(best, stars) };
        AsyncStorage.setItem('@neonblade_stars', JSON.stringify(updated));
        return updated;
      });
    }
  }, [slicesCount, currentLevel, lives, isWinModalOpen, maxUnlockedLevel]);

  // --- High-Performance 60 FPS Physics Loop (Optimistic & Zero Lag) ---
  useEffect(() => {
    let lastTime = Date.now();
    let lastRenderTime = 0;

    const loop = () => {
      const now = Date.now();
      const delta = Math.min((now - lastTime) / 1000, 0.035);
      lastTime = now;

      const timeScale = isFrozen ? 0.28 : 1.0;
      // Tuned gravity so fruits float comfortably without shooting off top
      const gravity = scale(0.26) * timeScale;

      // Rotate Spikes
      spikeRotRef.current = (spikeRotRef.current + 2.5) % 360;

      // Controlled Wave Spawner: progressively faster as level increases (2.2s down to 1.45s)
      const baseInterval = Math.max(1.45, 2.2 - (currentLevel.id / 50) * 0.75);
      const waveInterval = isFrenzy ? 0.85 : baseInterval;
      spawnTimerRef.current += delta;
      if (spawnTimerRef.current >= waveInterval) {
        spawnTimerRef.current = 0;
        spawnWave();
      }

      // Update Airborne Items Physics
      itemsRef.current = itemsRef.current
        .filter(item => !item.isSliced && item.y < SCREEN_HEIGHT + scale(60))
        .map(item => {
          const nextY = item.y + item.vy * timeScale;
          const nextVy = item.vy + gravity;
          const nextX = item.x + item.vx * timeScale;
          const nextRot = item.rotation + item.rotSpeed * timeScale;

          let opacity = 1;
          if (item.isGhost) {
            item.ghostPhase = (item.ghostPhase || 0) + delta * 3.5;
            opacity = 0.35 + 0.65 * Math.abs(Math.sin(item.ghostPhase));
          }

          return {
            ...item,
            x: nextX,
            y: nextY,
            vy: nextVy,
            rotation: nextRot,
            opacity,
          };
        });

      // Update Sliced Halves Physics
      halvesRef.current = halvesRef.current
        .filter(h => h.y < SCREEN_HEIGHT + scale(40) && h.x > -scale(40) && h.x < SCREEN_WIDTH + scale(40))
        .map(h => ({
          ...h,
          x: h.x + h.vx * timeScale,
          y: h.y + h.vy * timeScale,
          vy: h.vy + gravity * 1.5,
          rotation: h.rotation + h.rotSpeed * timeScale,
        }));

      // Update Exploding Sparks (Fast crisp fade in 0.25s)
      if (particlesRef.current.length > 0) {
        particlesRef.current = particlesRef.current
          .map(p => ({
            ...p,
            x: p.x + p.vx * timeScale,
            y: p.y + p.vy * timeScale,
            vy: p.vy + scale(0.24) * timeScale,
            opacity: p.opacity - delta * 4.0,
          }))
          .filter(p => p.opacity > 0);
      }

      // Update Slice Flashes (Crisp 0.08s burst)
      if (flashesRef.current.length > 0) {
        flashesRef.current = flashesRef.current
          .map(f => ({ ...f, opacity: f.opacity - delta * 12 }))
          .filter(f => f.opacity > 0);
      }

      // Update Combo Alerts
      if (comboAlertsRef.current.length > 0) {
        comboAlertsRef.current = comboAlertsRef.current
          .map(c => ({
            ...c,
            y: c.y - 0.8,
            opacity: c.opacity - 0.025,
          }))
          .filter(c => c.opacity > 0);
      }

      // Age out blade trail points so holding touch or stopping vanishes the trail cleanly (never stuck on screen)
      if (trailRef.current.length > 0) {
        trailRef.current = trailRef.current.filter(pt => now - pt.time < 140);
      }

      // --- Batched 60 FPS Render Update (Butter smooth & optimistic) ---
      if (now - lastRenderTime >= 16) {
        lastRenderTime = now;
        setRenderState({
          items: [...itemsRef.current],
          halves: [...halvesRef.current],
          particles: [...particlesRef.current],
          flashes: [...flashesRef.current],
          alerts: [...comboAlertsRef.current],
          trail: [...trailRef.current],
        });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isFrozen, isFrenzy, spawnWave]);

  // Full Blade Trail Path
  const bladePath = useMemo(() => {
    if (renderState.trail.length < 2) return '';
    return renderState.trail.reduce((acc, pt, idx) => {
      if (idx === 0) return `M ${pt.x} ${pt.y}`;
      return `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  }, [renderState.trail]);



  return (
    <View style={styles.fullScreenWrapper}>
      {/* --- LAYER 1: Full-Screen Slicing Surface with PanHandlers --- */}
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateX: shakeAnim }] },
          isFrozen && styles.frozenBorder,
        ]}
        {...panResponder.panHandlers}
      >
        {/* Background Ambient Space */}
        <LinearGradient
          colors={['#0F0A1E', '#06030D']}
          style={StyleSheet.absoluteFillObject}
        />

        {/* SVG Layer: Exploding Particles, Cut Flashes & Glowing Blade Trail */}
        <Svg style={StyleSheet.absoluteFillObject}>
          <Defs>
            <SvgGradient id="bladeOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.1" />
              <Stop offset="60%" stopColor="#818CF8" stopOpacity="0.6" />
              <Stop offset="100%" stopColor="#C084FC" stopOpacity="0.85" />
            </SvgGradient>
          </Defs>

          {/* Instantaneous White Cleave Flashes */}
          {renderState.flashes.map(f => (
            <Line
              key={f.id}
              x1={f.x1}
              y1={f.y1}
              x2={f.x2}
              y2={f.y2}
              stroke="#FFFFFF"
              strokeWidth={scale(5)}
              strokeLinecap="round"
              opacity={f.opacity}
            />
          ))}

          {/* Exploding Fruit Flesh & Seed Particles */}
          {renderState.particles.map(p => (
            <Circle
              key={p.id}
              cx={p.x}
              cy={p.y}
              r={p.size}
              fill={p.color}
              opacity={p.opacity}
            />
          ))}

          {/* Glowing Neon Katana Blade Trail (Layer 1: Outer Aura) */}
          {bladePath ? (
            <Path
              d={bladePath}
              stroke="url(#bladeOuterGrad)"
              strokeWidth={scale(11)}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ) : null}

          {/* Glowing Neon Katana Blade Trail (Layer 2: Pure White Core) */}
          {bladePath ? (
            <Path
              d={bladePath}
              stroke="#FFFFFF"
              strokeWidth={scale(3)}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ) : null}
        </Svg>

        {/* --- Rotating Laser Spikes --- */}
        {spikePositions.map((spk, idx) => (
          <View
            key={idx}
            style={[
              styles.spikeContainer,
              {
                left: spk.x - scale(28),
                top: spk.y - scale(28),
                transform: [{ rotate: `${spikeRotRef.current * (idx % 2 === 0 ? 1 : -1)}deg` }],
              },
            ]}
          >
            <Ionicons name="cog" size={scale(56)} color="#F59E0B" />
            <View style={styles.spikeCore} />
          </View>
        ))}

        {/* --- Active Airborne Fruits / Hazards (Clean & Visible) --- */}
        {renderState.items.map(item => {
          const cfg = FRUIT_CONFIGS[item.type] || FRUIT_CONFIGS.watermelon;
          return (
            <View
              key={item.id}
              style={[
                styles.fruitItem,
                {
                  left: item.x - item.radius,
                  top: item.y - item.radius,
                  width: item.radius * 2,
                  height: item.radius * 2,
                  opacity: item.opacity,
                  transform: [{ rotate: `${item.rotation}deg` }],
                },
              ]}
            >
              <Text style={{ fontSize: item.radius * 1.35 }}>{cfg.emoji}</Text>

              {/* Armored Coconut Shell */}
              {item.hitsLeft > 1 && (
                <View
                  style={[
                    styles.armorRing,
                    {
                      width: item.radius * 2.2,
                      height: item.radius * 2.2,
                      borderRadius: item.radius * 1.1,
                    },
                  ]}
                />
              )}

              {/* Boss Health Bar */}
              {cfg.isSpecial === 'boss' && (
                <View style={styles.bossHealthBar}>
                  <View
                    style={[
                      styles.bossHealthFill,
                      { width: `${(item.hitsLeft / item.maxHits) * 100}%` },
                    ]}
                  />
                </View>
              )}
            </View>
          );
        })}

        {/* --- Sliced Halves Flying Apart --- */}
        {renderState.halves.map(half => (
          <View
            key={half.id}
            style={[
              styles.halfItem,
              {
                left: half.x - half.radius / 2,
                top: half.y - half.radius / 2,
                width: half.radius,
                height: half.radius * 2,
                transform: [{ rotate: `${half.rotation}deg` }],
              },
            ]}
          >
            <View
              style={[
                styles.halfVisual,
                {
                  backgroundColor: half.color,
                  borderColor: half.rindColor,
                  borderTopLeftRadius: half.isLeftHalf ? half.radius * 2 : 0,
                  borderBottomLeftRadius: half.isLeftHalf ? half.radius * 2 : 0,
                  borderTopRightRadius: !half.isLeftHalf ? half.radius * 2 : 0,
                  borderBottomRightRadius: !half.isLeftHalf ? half.radius * 2 : 0,
                },
              ]}
            />
          </View>
        ))}

        {/* --- Single Side Combo Alert (Positioned on the side out of slicing gameplay) --- */}
        {renderState.alerts.slice(-1).map(alert => (
          <View
            key={alert.id}
            pointerEvents="none"
            style={[
              styles.comboAlertPill,
              {
                opacity: alert.opacity,
                borderColor: alert.color,
                shadowColor: alert.color,
              },
            ]}
          >
            <Text style={[styles.comboAlertText, { color: alert.color }]}>
              {alert.text}
            </Text>
          </View>
        ))}
      </Animated.View>

      {/* --- LAYER 2: Floating Top Header (OUTSIDE PanResponder so Back Button ALWAYS clicks!) --- */}
      <SafeAreaView style={styles.floatingTopOverlay} pointerEvents="box-none">
        <View style={styles.topHeader} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.headerIconButton}
            activeOpacity={0.6}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            onPress={() => {
              GameSound.playTap();
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={scale(22)} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.levelBadgeButton}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => setIsLevelSelectorOpen(true)}
          >
            <Text style={styles.levelBadgeText}>LEVEL {currentLevel.id} / 50 ▾</Text>
            <Text style={styles.levelTitleText} numberOfLines={1}>
              {currentLevel.title}
            </Text>
          </TouchableOpacity>

          <View style={styles.headerRightActions} pointerEvents="box-none">
            <TouchableOpacity
              style={styles.headerIconButton}
              activeOpacity={0.6}
              hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
              onPress={() => GameSound.toggleMute()}
            >
              <Ionicons
                name={isMuted ? 'volume-mute-outline' : 'volume-high-outline'}
                size={scale(20)}
                color={isMuted ? '#EF4444' : '#FFF'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerIconButton}
              activeOpacity={0.6}
              hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
              onPress={() => {
                GameSound.playReset();
                startLevel(currentLevelIndex);
              }}
            >
              <Ionicons name="refresh-outline" size={scale(20)} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Mission & Lives Strip */}
        <View style={styles.missionBar} pointerEvents="box-none">
          <View style={styles.livesRow}>
            {[1, 2, 3].map(h => (
              <Ionicons
                key={h}
                name={h <= lives ? 'heart' : 'heart-dislike-outline'}
                size={scale(18)}
                color={h <= lives ? '#EF4444' : '#4B5563'}
                style={{ marginRight: scale(2) }}
              />
            ))}
          </View>

          <View style={styles.statsPill}>
            <Text style={styles.statsLabel}>SLICES</Text>
            <Text style={styles.slicesValue}>
              {slicesCount} / {currentLevel.targetSlices}
            </Text>
          </View>

          <View style={styles.statsPill}>
            <Text style={styles.statsLabel}>SCORE</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>

          <View style={styles.statsPill}>
            <Text style={styles.statsLabel}>BEST</Text>
            <Text style={styles.scoreValue}>{highScore}</Text>
          </View>
        </View>

        {/* Combo Fever Active Notification Strip */}
        {isComboFever && (
          <View style={styles.comboFeverBanner} pointerEvents="none">
            <Text style={styles.comboFeverBannerText}>⚡ 2X COMBO FEVER ACTIVE! ⚡</Text>
          </View>
        )}
      </SafeAreaView>



      {/* ============================================================== */}
      {/* MODAL 1: LEVEL WINNER MODAL                                    */}
      {/* ============================================================== */}
      {isWinModalOpen && (
        <View style={styles.inTreeModalOverlay}>
          <View style={styles.modalCard}>
            <LinearGradient
              colors={['#1E1B4B', '#0F172A']}
              style={styles.modalGradient}
            >
              <Text style={styles.victoryEmoji}>🗡️</Text>
              <Text style={styles.victoryTitle}>DOJO CLEARED!</Text>
              <Text style={styles.victorySubtitle}>{currentLevel.title}</Text>

              {/* Star Rating */}
              <View style={styles.starsRow}>
                {[1, 2, 3].map(s => (
                  <Ionicons
                    key={s}
                    name={s <= winStars ? 'star' : 'star-outline'}
                    size={scale(34)}
                    color={s <= winStars ? '#FBBF24' : '#4B5563'}
                    style={{ marginHorizontal: scale(4) }}
                  />
                ))}
              </View>

              <View style={styles.modalStatsCard}>
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatLabel}>SCORE</Text>
                  <Text style={styles.modalStatValue}>{score}</Text>
                </View>
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatLabel}>SLICES</Text>
                  <Text style={styles.modalStatValue}>{slicesCount}</Text>
                </View>
              </View>

              <View style={styles.modalActionsRow}>
                <TouchableOpacity
                  style={styles.modalSecondaryBtn}
                  activeOpacity={0.8}
                  onPress={() => startLevel(currentLevelIndex)}
                >
                  <Ionicons name="refresh" size={scale(18)} color="#FFF" />
                  <Text style={styles.modalBtnText}>RETRY</Text>
                </TouchableOpacity>

                {currentLevelIndex < BLADE_LEVELS.length - 1 ? (
                  <TouchableOpacity
                    style={styles.modalPrimaryBtn}
                    activeOpacity={0.8}
                    onPress={() => {
                      showNaturalAd(() => {
                        startLevel(currentLevelIndex + 1);
                      });
                    }}
                  >
                    <Text style={styles.modalBtnText}>NEXT LEVEL ➔</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.modalPrimaryBtn}
                    activeOpacity={0.8}
                    onPress={() => setIsWinModalOpen(false)}
                  >
                    <Text style={styles.modalBtnText}>ALL 50 CLEARED!</Text>
                  </TouchableOpacity>
                )}
              </View>
            </LinearGradient>
          </View>
        </View>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: GAME OVER MODAL                                       */}
      {/* ============================================================== */}
      {isGameOverModalOpen && (
        <View style={styles.inTreeModalOverlay}>
          <View style={styles.modalCard}>
            <LinearGradient
              colors={['#3B0715', '#0F172A']}
              style={styles.modalGradient}
            >
              <Text style={styles.victoryEmoji}>💔</Text>
              <Text style={[styles.victoryTitle, { color: '#EF4444' }]}>
                OUT OF HEARTS!
              </Text>
              <Text style={styles.victorySubtitle}>
                All 3 lives were lost! Dodge the plasma bombs and hazards to survive.
              </Text>

              <View style={styles.modalStatsCard}>
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatLabel}>SLICES</Text>
                  <Text style={styles.modalStatValue}>{slicesCount}</Text>
                </View>
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatLabel}>BEST</Text>
                  <Text style={styles.modalStatValue}>{highScore}</Text>
                </View>
              </View>

              <View style={styles.modalActionsRow}>
                <TouchableOpacity
                  style={styles.modalSecondaryBtn}
                  activeOpacity={0.8}
                  onPress={() => setIsLevelSelectorOpen(true)}
                >
                  <Text style={styles.modalBtnText}>LEVELS</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalPrimaryBtn, { backgroundColor: '#EF4444' }]}
                  activeOpacity={0.8}
                  onPress={() => {
                    showNaturalAd(() => {
                      startLevel(currentLevelIndex);
                    });
                  }}
                >
                  <Ionicons name="refresh" size={scale(18)} color="#FFF" />
                  <Text style={styles.modalBtnText}>TRY AGAIN</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: 50 CAMPAIGN LEVELS SELECTOR                           */}
      {/* ============================================================== */}
      {isLevelSelectorOpen && (
        <View style={styles.inTreeModalOverlay}>
          <View style={styles.levelSelectorModal}>
            <View style={styles.levelModalHeader}>
              <Text style={styles.levelModalTitle}>NEON BLADE DOJO (50 LEVELS)</Text>
              <TouchableOpacity
                onPress={() => setIsLevelSelectorOpen(false)}
                style={styles.headerIconButton}
              >
                <Ionicons name="close" size={scale(22)} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.levelGrid}
              showsVerticalScrollIndicator={false}
            >
              {BLADE_LEVELS.map(lvl => {
                const isUnlocked = lvl.id <= maxUnlockedLevel;
                const isCurrent = lvl.id === currentLevel.id;
                const stars = levelStars[lvl.id] || 0;

                return (
                  <TouchableOpacity
                    key={lvl.id}
                    disabled={!isUnlocked}
                    activeOpacity={0.7}
                    style={[
                      styles.levelCard,
                      !isUnlocked && styles.levelCardLocked,
                      isCurrent && styles.levelCardCurrent,
                    ]}
                    onPress={() => {
                      GameSound.playTap();
                      setIsLevelSelectorOpen(false);
                      startLevel(lvl.id - 1);
                    }}
                  >
                    {isUnlocked ? (
                      <>
                        <Text style={styles.levelNumberText}>{lvl.id}</Text>
                        <View style={styles.levelCardStars}>
                          {[1, 2, 3].map(s => (
                            <Ionicons
                              key={s}
                              name={s <= stars ? 'star' : 'star-outline'}
                              size={scale(10)}
                              color={s <= stars ? '#FBBF24' : '#4B5563'}
                            />
                          ))}
                        </View>
                      </>
                    ) : (
                      <Ionicons name="lock-closed" size={scale(18)} color="#4B5563" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: SECRET 4K BLADE MASTER WALLPAPER UNLOCKED!            */}
      {/* ============================================================== */}
      {isSecretWallpaperModalOpen && (
        <View style={styles.inTreeModalOverlay}>
          <View style={[styles.modalCard, { maxWidth: scale(340) }]}>
            <LinearGradient
              colors={['#4C1D95', '#0F172A']}
              style={styles.modalGradient}
            >
              <Text style={styles.victoryEmoji}>🌟</Text>
              <Text style={[styles.victoryTitle, { color: '#FBBF24' }]}>
                GRANDMASTER BLADE!
              </Text>
              <Text style={styles.supernovaNotice}>
                🏆 You destroyed the Cosmic Titan Melon! Secret 4K Blade Master Wallpaper Unlocked!
              </Text>

              <TouchableOpacity
                style={[styles.modalPrimaryBtn, { backgroundColor: '#8B5CF6', width: '100%', marginVertical: scale(8) }]}
                activeOpacity={0.8}
                onPress={() => {
                  setIsSecretWallpaperModalOpen(false);
                  navigation.navigate('SeasonalImages');
                }}
              >
                <Ionicons name="image-outline" size={scale(18)} color="#FFF" />
                <Text style={styles.modalBtnText}>CLAIM 4K WALLPAPER</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalSecondaryBtn, { width: '100%' }]}
                activeOpacity={0.8}
                onPress={() => setIsSecretWallpaperModalOpen(false)}
              >
                <Text style={styles.modalBtnText}>KEEP SLICING</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenWrapper: {
    flex: 1,
    backgroundColor: '#07040D',
    position: 'relative',
  },
  container: {
    flex: 1,
    backgroundColor: '#07040D',
  },
  frozenBorder: {
    borderColor: '#38BDF8',
    borderWidth: 3,
  },
  floatingTopOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(14),
    paddingTop: scale(8),
    paddingBottom: scale(4),
  },
  headerIconButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  levelBadgeButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: scale(16),
    paddingVertical: scale(5),
    borderRadius: scale(18),
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
    elevation: 8,
  },
  levelBadgeText: {
    color: '#D8B4FE',
    fontSize: scale(11),
    fontWeight: '800',
    letterSpacing: 1,
  },
  levelTitleText: {
    color: '#FFF',
    fontSize: scale(12),
    fontWeight: '700',
    marginTop: scale(1),
    maxWidth: scale(160),
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  missionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scale(14),
    marginTop: scale(4),
    paddingHorizontal: scale(12),
    paddingVertical: scale(7),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    elevation: 6,
  },
  livesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsPill: {
    alignItems: 'center',
  },
  statsLabel: {
    color: '#9CA3AF',
    fontSize: scale(8),
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  slicesValue: {
    color: '#34D399',
    fontSize: scale(13),
    fontWeight: '900',
  },
  scoreValue: {
    color: '#FBBF24',
    fontSize: scale(13),
    fontWeight: '900',
  },
  timeValue: {
    color: '#38BDF8',
    fontSize: scale(13),
    fontWeight: '900',
  },
  fruitItem: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  armorRing: {
    position: 'absolute',
    borderWidth: 2.5,
    borderColor: '#38BDF8',
    borderStyle: 'dashed',
  },
  bossHealthBar: {
    position: 'absolute',
    top: -scale(10),
    width: '100%',
    height: scale(5),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: scale(3),
    overflow: 'hidden',
  },
  bossHealthFill: {
    height: '100%',
    backgroundColor: '#EF4444',
  },
  halfItem: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9,
  },
  halfVisual: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
  },
  spikeContainer: {
    position: 'absolute',
    width: scale(56),
    height: scale(56),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 8,
  },
  spikeCore: {
    position: 'absolute',
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
    backgroundColor: '#EF4444',
  },
  comboAlertPill: {
    position: 'absolute',
    top: scale(135),
    right: scale(16),
    paddingHorizontal: scale(14),
    paddingVertical: scale(6),
    borderRadius: scale(16),
    backgroundColor: 'rgba(10, 15, 29, 0.94)',
    borderWidth: 1.5,
    zIndex: 60,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  comboAlertText: {
    fontSize: scale(13),
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  comboAuraRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#F59E0B',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  comboFruitBadge: {
    position: 'absolute',
    top: -scale(14),
    backgroundColor: '#F59E0B',
    paddingHorizontal: scale(6),
    paddingVertical: scale(2),
    borderRadius: scale(6),
    borderWidth: 1,
    borderColor: '#FFF',
  },
  comboFruitBadgeText: {
    color: '#000',
    fontSize: scale(8),
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  comboFeverBanner: {
    alignSelf: 'center',
    marginTop: scale(6),
    backgroundColor: 'rgba(245, 158, 11, 0.92)',
    paddingHorizontal: scale(14),
    paddingVertical: scale(4),
    borderRadius: scale(12),
    borderWidth: 1.5,
    borderColor: '#FEF08A',
    elevation: 8,
  },
  comboFeverBannerText: {
    color: '#000',
    fontSize: scale(11),
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  inTreeModalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    zIndex: 99999,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(20),
  },
  modalCard: {
    width: '100%',
    maxWidth: scale(320),
    borderRadius: scale(24),
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    elevation: 20,
  },
  modalGradient: {
    padding: scale(22),
    alignItems: 'center',
  },
  victoryEmoji: {
    fontSize: scale(44),
    marginBottom: scale(8),
  },
  victoryTitle: {
    color: '#FFF',
    fontSize: scale(22),
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  victorySubtitle: {
    color: '#9CA3AF',
    fontSize: scale(12),
    textAlign: 'center',
    marginTop: scale(4),
  },
  supernovaNotice: {
    color: '#E0E7FF',
    fontSize: scale(13),
    textAlign: 'center',
    marginVertical: scale(12),
    lineHeight: scale(18),
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scale(14),
  },
  modalStatsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: scale(14),
    width: '100%',
    padding: scale(12),
    marginVertical: scale(12),
    justifyContent: 'space-around',
  },
  modalStatItem: {
    alignItems: 'center',
  },
  modalStatLabel: {
    color: '#9CA3AF',
    fontSize: scale(10),
    fontWeight: '700',
  },
  modalStatValue: {
    color: '#FFF',
    fontSize: scale(18),
    fontWeight: '900',
    marginTop: scale(2),
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: scale(10),
    marginTop: scale(8),
    width: '100%',
  },
  modalPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#7C3AED',
    paddingVertical: scale(12),
    borderRadius: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
  },
  modalSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: scale(12),
    borderRadius: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
  },
  modalBtnText: {
    color: '#FFF',
    fontSize: scale(12),
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  levelSelectorModal: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#0F172A',
    borderRadius: scale(24),
    borderWidth: 1.5,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    overflow: 'hidden',
  },
  levelModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  levelModalTitle: {
    color: '#FFF',
    fontSize: scale(13),
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: scale(12),
    justifyContent: 'space-between',
  },
  levelCard: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: 'rgba(124, 58, 237, 0.25)',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(8),
  },
  levelCardLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  levelCardCurrent: {
    borderColor: '#38BDF8',
    borderWidth: 2,
    backgroundColor: 'rgba(56, 189, 248, 0.3)',
  },
  levelNumberText: {
    color: '#FFF',
    fontSize: scale(13),
    fontWeight: '800',
  },
  levelCardStars: {
    flexDirection: 'row',
    marginTop: scale(2),
  },
});
