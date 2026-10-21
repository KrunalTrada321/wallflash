import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  SafeAreaView,
  StatusBar,
  AppState,
  AppStateStatus,
  BackHandler,
} from 'react-native';
import Svg, { G } from 'react-native-svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';

import {
  LevelConfig,
  ArrowEntity,
  ZombieEntity,
  ObstacleEntity,
  MovingPlatformEntity,
  TrajectoryPoint,
  ParticleEntity,
  FloatText,
  ArrowType,
} from './types/gameTypes';
import { ZOMBIE_50_LEVELS } from './levels/all50Levels';
import { adaptLevelForLandscape, LANDSCAPE_WORLD_HEIGHT } from './levels/landscapeLevelAdapter';
import { PhysicsWorld } from './engine/PhysicsWorld';
import { PlayerArcher } from './components/PlayerArcher';
import { ZombieCharacter } from './components/ZombieCharacter';
import { StaticEnvironment, DynamicObstacles } from './components/EnvironmentView';
import { ProjectilesAndEffects } from './components/ProjectilesAndEffects';
import { GameHUD } from './components/GameHUD';
import {
  VictoryModal,
  DefeatModal,
  PauseModal,
  LevelSelectModal,
} from './components/GameModals';
import { ZombieStorageService } from './services/zombieStorage';
import ZombieAudio from './services/zombieAudio';
import { useGameInterstitialAd } from '../../../Components/Useinterstitialad';

interface RenderFrameState {
  cameraX: number;
  aimAngle: number;
  pullDistance: number;
  isAiming: boolean;
  trajectory: TrajectoryPoint[];
  arrows: ArrowEntity[];
  zombies: ZombieEntity[];
  obstacles: ObstacleEntity[];
  movingPlatforms: MovingPlatformEntity[];
  particles: ParticleEntity[];
  floatTexts: FloatText[];
  nearestZombieDist: number;
}

export default function ZombieAttackGame() {
  const navigation = useNavigation<any>();

  // --- Dynamic Landscape Screen Dimensions ---
  const { width: winWidth, height: winHeight } = useWindowDimensions();
  const screenWidth = Math.max(winWidth, winHeight);
  const screenHeight = Math.min(winWidth, winHeight);
  const viewHeight = LANDSCAPE_WORLD_HEIGHT; // 440
  const viewWidth = Math.round(viewHeight * (screenWidth / Math.max(1, screenHeight)));

  // --- Lock Orientation to Landscape on Mount, Restore Portrait on Unmount ---
  const handleBack = useCallback(() => {
    Orientation.lockToPortrait();
    navigation.goBack();
  }, [navigation]);

  // --- Strict Persistent Landscape Lock on Mount, Focus & Resume ---
  useFocusEffect(
    useCallback(() => {
      Orientation.lockToLandscape();
      StatusBar.setHidden(true, 'none');

      // If device orientation changes toward portrait while playing, immediately re-lock to landscape
      const onOrientationChange = (orientation: string) => {
        if (orientation.includes('PORTRAIT')) {
          Orientation.lockToLandscape();
        }
      };
      Orientation.addOrientationListener(onOrientationChange);

      return () => {
        Orientation.removeOrientationListener(onOrientationChange);
        Orientation.lockToPortrait();
        StatusBar.setHidden(false, 'none');
      };
    }, [])
  );

  useEffect(() => {
    Orientation.lockToLandscape();
    StatusBar.setHidden(true, 'none');

    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        Orientation.lockToLandscape();
        StatusBar.setHidden(true, 'none');
      }
    };
    const appSub = AppState.addEventListener('change', handleAppState);

    return () => {
      appSub.remove();
      Orientation.lockToPortrait();
      StatusBar.setHidden(false, 'none');
    };
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      handleBack();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [handleBack]);

  // --- Campaign State (Adapted for Widescreen Landscape) ---
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const currentLevel: LevelConfig = useMemo(() => {
    const raw = ZOMBIE_50_LEVELS.find(l => l.id === currentLevelId) || ZOMBIE_50_LEVELS[0];
    return adaptLevelForLandscape(raw);
  }, [currentLevelId]);

  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [levelStars, setLevelStars] = useState<Record<number, number>>({});
  const [levelScores, setLevelScores] = useState<Record<number, number>>({});
  const [coins, setCoins] = useState(0);

  // Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  // HUD stats
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  scoreRef.current = score;

  const [arrowsRemaining, setArrowsRemaining] = useState<number | null>(null);
  const arrowsRemainingRef = useRef<number | null>(null);
  arrowsRemainingRef.current = arrowsRemaining;

  const [arrowsShot, setArrowsShot] = useState(0);
  const arrowsShotRef = useRef(0);
  arrowsShotRef.current = arrowsShot;

  const [headshotsCount, setHeadshotsCount] = useState(0);
  const headshotsCountRef = useRef(0);
  headshotsCountRef.current = headshotsCount;

  const currentLevelRef = useRef(currentLevel);
  currentLevelRef.current = currentLevel;

  // Modals
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);
  const [isDefeatOpen, setIsDefeatOpen] = useState(false);
  const [defeatReason, setDefeatReason] = useState<'zombie_attack' | 'out_of_arrows'>('zombie_attack');
  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);
  const [earnedStars, setEarnedStars] = useState(1);

  // Tactical Arrow Ability State (Unlocked level-wise: Steel L1, Fire L3, Freeze L6, Bomb L10)
  const [selectedArrowType, setSelectedArrowType] = useState<ArrowType>('regular');
  const selectedArrowTypeRef = useRef<ArrowType>('regular');
  selectedArrowTypeRef.current = selectedArrowType;

  // Center Headshot Simple Emoji Banner
  const [headshotEmojiPop, setHeadshotEmojiPop] = useState({ id: 0, visible: false });
  const headshotTimeoutRef = useRef<any>(null);

  // Engine Refs
  const isGameOverRef = useRef(false);
  const physicsRef = useRef<PhysicsWorld | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const cameraXRef = useRef(0);
  const canvasLayoutRef = useRef<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 0,
    width: screenWidth,
    height: screenHeight,
  });

  // Slingshot / Reverse-Pull Archery Mutable State
  const aimRef = useRef({
    isAiming: false,
    startX: 0,
    startY: 0,
    angle: -0.25,
    power: 0.8,
    pullDistance: 0,
    trajectory: [] as TrajectoryPoint[],
  });

  // Dynamic Bowstring Stretch Audio Refs
  const lastStretchPowerRef = useRef(0.2);
  const lastStretchTimeRef = useRef(0);
  const wasTargetingZombieRef = useRef(false);

  // Consolidated 60 FPS Render Frame State
  const [frame, setFrame] = useState<RenderFrameState>({
    cameraX: 0,
    aimAngle: -0.25,
    pullDistance: 0,
    isAiming: false,
    trajectory: [],
    arrows: [],
    zombies: [],
    obstacles: [],
    movingPlatforms: [],
    particles: [],
    floatTexts: [],
    nearestZombieDist: 999,
  });

  // --- Load Progress (Resumes Saved Current Level so it NEVER restarts from 1!) ---
  useEffect(() => {
    ZombieStorageService.getProgress().then(prog => {
      if (prog.currentLevel) {
        setCurrentLevelId(prog.currentLevel);
      }
      setUnlockedLevel(prog.unlockedLevel);
      setLevelStars(prog.stars);
      setLevelScores(prog.scores);
      setCoins(prog.coins);
      setSoundEnabled(prog.soundEnabled);
      setMusicEnabled(prog.musicEnabled);
      setHapticsEnabled(prog.hapticsEnabled);
      ZombieAudio.init(prog.soundEnabled, prog.musicEnabled, prog.hapticsEnabled);
    });
  }, []);

  // Clamp arrow type to available unlocks if level drops below required level (Bomb unlocks at L2)
  useEffect(() => {
    if (currentLevelId < 2 && selectedArrowType !== 'regular') {
      setSelectedArrowType('regular');
    }
  }, [currentLevelId, selectedArrowType]);

  // --- AppState Handling ---
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState !== 'active') {
        setIsPauseOpen(true);
      }
    });
    return () => sub.remove();
  }, []);

  // --- Initialize Level ---
  const initLevel = useCallback((level: LevelConfig) => {
    isGameOverRef.current = false;
    if (physicsRef.current) {
      physicsRef.current.destroy();
    }

    const world = new PhysicsWorld(level);
    physicsRef.current = world;
    currentLevelRef.current = level;

    setScore(0);
    scoreRef.current = 0;
    setArrowsShot(0);
    arrowsShotRef.current = 0;
    setHeadshotsCount(0);
    headshotsCountRef.current = 0;
    setHeadshotEmojiPop({ id: 0, visible: false });
    if (headshotTimeoutRef.current) clearTimeout(headshotTimeoutRef.current);
    setArrowsRemaining(level.arrowLimit);
    arrowsRemainingRef.current = level.arrowLimit;

    setIsVictoryOpen(false);
    setIsDefeatOpen(false);
    setIsPauseOpen(false);
    setIsLevelSelectOpen(false);
    cameraXRef.current = 0;

    aimRef.current = {
      isAiming: false,
      startX: 0,
      startY: 0,
      angle: -0.25,
      power: 0.8,
      pullDistance: 0,
      trajectory: [],
    };

    world.onZombieKilled = (zombie, isHeadshot) => {
      const added = isHeadshot ? 200 : 100;
      setScore(prev => prev + added);
      scoreRef.current += added;
      if (isHeadshot) {
        setHeadshotsCount(prev => prev + 1);
        headshotsCountRef.current += 1;
        setHeadshotEmojiPop({ id: Date.now(), visible: true });
        if (headshotTimeoutRef.current) clearTimeout(headshotTimeoutRef.current);
        headshotTimeoutRef.current = setTimeout(() => {
          setHeadshotEmojiPop(prev => ({ ...prev, visible: false }));
        }, 1300);
      }
    };

    world.onPlayerAttacked = () => {
      if (isGameOverRef.current) return;
      isGameOverRef.current = true;
      ZombieAudio.playDefeat();
      setDefeatReason('zombie_attack');
      setIsDefeatOpen(true);
    };
  }, []);

  useEffect(() => {
    initLevel(currentLevel);
    return () => {
      if (physicsRef.current) {
        physicsRef.current.destroy();
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [currentLevel, initLevel]);

  // --- Victory Handler (Stable reference with zero state-based loop restarts) ---
  const handleVictory = useCallback(
    (world: PhysicsWorld) => {
      if (isGameOverRef.current) return;
      isGameOverRef.current = true;
      ZombieAudio.playVictory();

      const lvl = currentLevelRef.current;
      let stars = 1;
      const shotCount = arrowsShotRef.current;
      if (shotCount <= lvl.parArrows) {
        stars++;
      }
      if (headshotsCountRef.current > 0 || shotCount < lvl.parArrows) {
        stars = 3;
      }

      setEarnedStars(stars);
      const levelWinCoins = 100 + stars * 50;

      ZombieStorageService.saveLevelWin(
        lvl.id,
        stars,
        scoreRef.current + 500,
        levelWinCoins
      ).then(res => {
        setUnlockedLevel(res.newUnlockedLevel);
        setCoins(res.totalCoins);
      });

      setIsVictoryOpen(true);
    },
    []
  );

  // --- 60 FPS Timestep Game Loop ---
  useEffect(() => {
    let lastRenderTime = 0;

    const loop = () => {
      const now = Date.now();
      const world = physicsRef.current;

      if (world && !isPauseOpen && !isVictoryOpen && !isDefeatOpen && !isLevelSelectOpen && !isGameOverRef.current) {
        world.update();

        // Smooth Camera Tracking in Widescreen Landscape
        const activeArrow = world.arrows.find(a => a.inFlight && !a.stuck);
        const maxScroll = Math.max(0, currentLevel.worldWidth - viewWidth);

        if (activeArrow) {
          const targetCamX = Math.max(
            0,
            Math.min(maxScroll, activeArrow.body.position.x - viewWidth * 0.45)
          );
          cameraXRef.current += (targetCamX - cameraXRef.current) * 0.14;
        } else {
          const targetCamX = Math.max(
            0,
            Math.min(maxScroll, currentLevel.playerPos.x - viewWidth * 0.22)
          );
          cameraXRef.current += (targetCamX - cameraXRef.current) * 0.08;
        }

        // Win Condition Check
        const livingZombies = world.zombies.filter(z => z.health > 0);
        if (livingZombies.length === 0 && !isGameOverRef.current) {
          handleVictory(world);
        }

        // Out of arrows check
        const curArrowsRem = arrowsRemainingRef.current;
        if (
          currentLevel.arrowLimit !== null &&
          curArrowsRem !== null &&
          curArrowsRem <= 0 &&
          livingZombies.length > 0 &&
          !isGameOverRef.current
        ) {
          const arrowsInFlight = world.arrows.some(a => a.inFlight && !a.stuck);
          if (!arrowsInFlight && !isDefeatOpen && !isVictoryOpen && !isGameOverRef.current) {
            isGameOverRef.current = true;
            ZombieAudio.playDefeat();
            setDefeatReason('out_of_arrows');
            setIsDefeatOpen(true);
          }
        }

        // Nearest zombie distance
        let nearestDist = 999;
        for (let i = 0; i < livingZombies.length; i++) {
          const d = Math.abs(livingZombies[i].body.position.x - currentLevel.playerPos.x);
          if (d < nearestDist) nearestDist = d;
        }

        // 16ms Frame Gate
        if (now - lastRenderTime >= 16) {
          lastRenderTime = now;
          const aim = aimRef.current;
          setFrame({
            cameraX: cameraXRef.current,
            aimAngle: aim.angle,
            pullDistance: aim.pullDistance,
            isAiming: aim.isAiming,
            trajectory: aim.trajectory,
            arrows: [...world.arrows],
            zombies: [...world.zombies],
            obstacles: [...world.obstacles],
            movingPlatforms: [...world.movingPlatforms],
            particles: [...world.particles],
            floatTexts: [...world.floatTexts],
            nearestZombieDist: nearestDist,
          });
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [
    isPauseOpen,
    isVictoryOpen,
    isDefeatOpen,
    isLevelSelectOpen,
    currentLevel,
    handleVictory,
    viewWidth,
  ]);

  // --- React Native Gesture Handler (Native-Backed Pan Gesture) ---
  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .enabled(!isPauseOpen && !isVictoryOpen && !isDefeatOpen && !isLevelSelectOpen)
        .onBegin(e => {
          lastStretchPowerRef.current = 0.2;
          lastStretchTimeRef.current = Date.now();
          wasTargetingZombieRef.current = false;
          ZombieAudio.playBowDraw();
          const layout = canvasLayoutRef.current;
          const touchX = Math.max(0, e.x);
          const touchY = Math.max(0, e.y);

          aimRef.current = {
            isAiming: true,
            startX: touchX,
            startY: touchY,
            angle: -0.25,
            power: 0.5,
            pullDistance: 0.1,
            trajectory: [],
          };
        })
        .onUpdate(e => {
          const world = physicsRef.current;
          if (!world || !aimRef.current.isAiming) return;

          const touchX = Math.max(0, e.x);
          const touchY = Math.max(0, e.y);

          // Reverse Pull / Slingshot Archery:
          // Pulling backward/down aims forward/up towards enemies!
          const pullDx = aimRef.current.startX - touchX;
          const pullDy = aimRef.current.startY - touchY;

          const dist = Math.hypot(pullDx, pullDy);
          if (dist > 6) {
            let angle = Math.atan2(pullDy, pullDx);
            angle = Math.max(-1.32, Math.min(0.55, angle));
            const power = Math.min(1.0, Math.max(0.2, dist / 110));

            const launchX = currentLevel.playerPos.x + 22;
            const launchY = currentLevel.playerPos.y - 4;
            const traj = world.calculateTrajectory(launchX, launchY, angle, power, selectedArrowTypeRef.current);

            // Check if trajectory locks onto a zombie
            const isTargetingZombie = traj.some(pt => pt.isTargetingZombie);

            const now = Date.now();
            const powerDelta = Math.abs(power - lastStretchPowerRef.current);

            // Dynamic Arrow Stretch & Targeting Sound:
            // Continuous realistic wood creak & string stretching audio as power changes or when targeting zombie
            if (
              (powerDelta >= 0.07 ||
                (power >= 0.92 && lastStretchPowerRef.current < 0.92) ||
                (isTargetingZombie && !wasTargetingZombieRef.current)) &&
              now - lastStretchTimeRef.current > 65
            ) {
              if (selectedArrowTypeRef.current === 'bomb') {
                ZombieAudio.playClick();
              } else {
                ZombieAudio.playBowStretch(power);
              }
              lastStretchPowerRef.current = power;
              lastStretchTimeRef.current = now;
            }

            wasTargetingZombieRef.current = isTargetingZombie;

            aimRef.current.angle = angle;
            aimRef.current.power = power;
            aimRef.current.pullDistance = power;
            aimRef.current.trajectory = traj;
          }
        })
        .onEnd(() => {
          const world = physicsRef.current;
          const currentAim = aimRef.current;

          if (world && currentAim.isAiming && currentAim.pullDistance >= 0.18) {
            const curRem = arrowsRemainingRef.current;
            if (curRem === null || curRem > 0) {
              const launchX = currentLevel.playerPos.x + 22;
              const launchY = currentLevel.playerPos.y - 4;

              world.shootArrow(
                launchX,
                launchY,
                currentAim.angle,
                currentAim.power,
                selectedArrowTypeRef.current
              );

              setArrowsShot(prev => prev + 1);
              if (curRem !== null) {
                const nextRem = curRem - 1;
                setArrowsRemaining(nextRem);
                arrowsRemainingRef.current = nextRem;
              }
            }
          }

          aimRef.current = {
            isAiming: false,
            startX: 0,
            startY: 0,
            angle: -0.25,
            power: 0.8,
            pullDistance: 0,
            trajectory: [],
          };
        })
        .onFinalize(() => {
          aimRef.current.isAiming = false;
        }),
    [
      isPauseOpen,
      isVictoryOpen,
      isDefeatOpen,
      currentLevel,
    ]
  );

  // Settings
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    ZombieAudio.setSoundEnabled(next);
    ZombieStorageService.setSoundSetting('sound', next);
  };

  const toggleMusic = () => {
    const next = !musicEnabled;
    setMusicEnabled(next);
    ZombieAudio.setMusicEnabled(next);
    ZombieStorageService.setSoundSetting('music', next);
  };

  const toggleHaptics = () => {
    const next = !hapticsEnabled;
    setHapticsEnabled(next);
    ZombieAudio.setHapticsEnabled(next);
    ZombieStorageService.setSoundSetting('haptics', next);
  };

  const { showNaturalAd } = useGameInterstitialAd({ transitionInterval: 3, cooldownSeconds: 80 });

  const handleNextLevel = () => {
    showNaturalAd(() => {
      if (currentLevelId < 50) {
        const next = currentLevelId + 1;
        setCurrentLevelId(next);
        ZombieStorageService.saveCurrentLevel(next);
      }
    });
  };

  const handleSelectLevel = (lvlId: number) => {
    setIsLevelSelectOpen(false);
    setIsVictoryOpen(false);
    setIsDefeatOpen(false);
    setIsPauseOpen(false);
    ZombieStorageService.saveCurrentLevel(lvlId);
    if (currentLevelId === lvlId) {
      initLevel(currentLevel);
    } else {
      setCurrentLevelId(lvlId);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />

        {/* Top HUD */}
        <GameHUD
          levelId={currentLevel.id}
          levelTitle={currentLevel.title}
          arrowsRemaining={arrowsRemaining}
          totalArrows={currentLevel.arrowLimit}
          score={score}
          selectedArrowType={selectedArrowType}
          onSelectArrowType={setSelectedArrowType}
          onBack={handleBack}
          onRestart={() => initLevel(currentLevel)}
          onPause={() => setIsPauseOpen(true)}
        />

        {/* Simple Headshot Emoji in Center Somewhat Above */}
        {headshotEmojiPop.visible && (
          <View style={styles.headshotEmojiCenterOverlay} pointerEvents="none">
            <View style={styles.headshotEmojiPill}>
              <Text style={styles.headshotEmojiIcon}>🎯</Text>
              <Text style={styles.headshotEmojiText}>HEADSHOT!</Text>
            </View>
          </View>
        )}

        {/* Native-Backed Gesture Detector Canvas Area */}
        <GestureDetector gesture={panGesture}>
          <View
            style={styles.gameCanvas}
            onLayout={e => {
              const { x, y, width, height } = e.nativeEvent.layout;
              canvasLayoutRef.current = { x, y, width, height };
            }}
          >
            <Svg
              width={screenWidth}
              height={screenHeight}
              viewBox={`0 0 ${viewWidth} ${viewHeight}`}
            >
              <G transform={`translate(${-frame.cameraX}, 0)`}>
                <StaticEnvironment
                  worldWidth={currentLevel.worldWidth}
                  worldHeight={currentLevel.worldHeight}
                  platforms={currentLevel.platforms}
                  weather={currentLevel.weather}
                />

                <DynamicObstacles
                  obstacles={frame.obstacles}
                  movingPlatforms={frame.movingPlatforms}
                />

                <PlayerArcher
                  x={currentLevel.playerPos.x}
                  y={currentLevel.playerPos.y}
                  aimAngle={frame.aimAngle}
                  pullDistance={frame.pullDistance}
                  isAiming={frame.isAiming}
                  weaponType={selectedArrowType}
                  isVictorious={isVictoryOpen}
                  isDefeated={isDefeatOpen}
                  nearestZombieDist={frame.nearestZombieDist}
                />

                {frame.zombies.map(z => (
                  <ZombieCharacter key={`zombie_${z.id}`} zombie={z} />
                ))}

                <ProjectilesAndEffects
                  arrows={frame.arrows}
                  trajectory={frame.trajectory}
                  isAiming={frame.isAiming}
                  arrowType={selectedArrowType}
                  particles={frame.particles}
                  floatTexts={frame.floatTexts}
                />
              </G>
            </Svg>
          </View>
        </GestureDetector>

        {/* Modals */}
        {isVictoryOpen && (
          <VictoryModal
            visible={isVictoryOpen}
            levelId={currentLevel.id}
            stars={earnedStars}
            score={score}
            coinsEarned={100 + earnedStars * 50}
            onNextLevel={handleNextLevel}
            onRetry={() => initLevel(currentLevel)}
            onLevelSelect={() => {
              setIsVictoryOpen(false);
              setIsLevelSelectOpen(true);
            }}
          />
        )}

        {isDefeatOpen && (
          <DefeatModal
            visible={isDefeatOpen}
            levelId={currentLevel.id}
            reason={defeatReason}
            onRetry={() => {
              showNaturalAd(() => {
                initLevel(currentLevel);
              });
            }}
            onLevelSelect={() => {
              setIsDefeatOpen(false);
              setIsLevelSelectOpen(true);
            }}
          />
        )}

        {isPauseOpen && (
          <PauseModal
            visible={isPauseOpen}
            soundEnabled={soundEnabled}
            musicEnabled={musicEnabled}
            hapticsEnabled={hapticsEnabled}
            onResume={() => setIsPauseOpen(false)}
            onRestart={() => initLevel(currentLevel)}
            onToggleSound={toggleSound}
            onToggleMusic={toggleMusic}
            onToggleHaptics={toggleHaptics}
            onLevelSelect={() => {
              setIsPauseOpen(false);
              setIsLevelSelectOpen(true);
            }}
          />
        )}

        {isLevelSelectOpen && (
          <LevelSelectModal
            visible={isLevelSelectOpen}
            unlockedLevel={unlockedLevel}
            levelStars={levelStars}
            levelScores={levelScores}
            onSelectLevel={handleSelectLevel}
            onClose={() => setIsLevelSelectOpen(false)}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  gameCanvas: {
    flex: 1,
    overflow: 'hidden',
  },
  headshotEmojiCenterOverlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  headshotEmojiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 12,
  },
  headshotEmojiIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  headshotEmojiText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FEF08A',
    letterSpacing: 1.4,
  },
});
