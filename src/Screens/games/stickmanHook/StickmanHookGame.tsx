// ─────────────────────────────────────────────────────────────────────────────
//  StickmanHookGame.tsx
//  Master Screen for Stickman Hook: Swing Hero (High-Performance 60 FPS Edition)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  useWindowDimensions,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import { scale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { RewardedAd, RewardedAdEventType, AdEventType, TestIds } from 'react-native-google-mobile-ads';

import {
  StickmanPlayer,
  AnchorPin,
  Particle,
  StickmanSkin,
} from './types/stickmanHookTypes';
import { PhysicsWorld } from './engine/PhysicsWorld';
import { ALL_50_HOOK_LEVELS } from './levels/all50HookLevels';
import HookStorage from './services/hookStorage';
import HookAudio from './services/hookAudio';
import HookCanvas from './components/HookCanvas';
import HookSkiaCanvas from './components/HookSkiaCanvas';
import {
  VictoryModal,
  GameOverModal,
  LevelSelectModal,
  PauseModal,
} from './components/HookModals';
import { SkinSelectorModal, ALL_SKINS } from './components/SkinSelectorModal';
import { AppOpenAdManager } from '../../../Components/AppOpenAdManager';
import { useGameInterstitialAd } from '../../../Components/Useinterstitialad';

// ── Resilient GPU Error Boundary ─────────────────────────────────────────────
class CanvasErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('[StickmanHook] Skia canvas notice, utilizing SVG fallback:', error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const REWARDED_AD_ID = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-7105708210867722/6181117151';

export const STICKMAN_GAME_ZOOM = 0.75;

interface GameRenderFrame {
  player: StickmanPlayer;
  activePin: AnchorPin | null;
  targetCandidatePin: AnchorPin | null;
  cameraX: number;
  cameraY: number;
  particles: Particle[];
  progressPercent: number;
}

export default function StickmanHookGame() {
  const navigation = useNavigation<any>();
  const { showNaturalAd } = useGameInterstitialAd({ transitionInterval: 4, cooldownSeconds: 90 });

  // ── DYNAMIC LANDSCAPE DIMENSIONS ──────────────────────────────────────────
  const { width: winWidth, height: winHeight } = useWindowDimensions();
  const screenWidth = Math.max(winWidth, winHeight);
  const screenHeight = Math.min(winWidth, winHeight);

  // ── 1. LEVEL & PROGRESSION STATE ───────────────────────────────────────────
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [levelStars, setLevelStars] = useState<Record<number, number>>({});
  const [selectedSkinId, setSelectedSkinId] = useState<string>('classic_red');
  const [unlockedSkins, setUnlockedSkins] = useState<string[]>(['classic_red']);
  const [bestTime, setBestTime] = useState<number | null>(null);

  // Active level config
  const currentConfig = useMemo(() => {
    return (
      ALL_50_HOOK_LEVELS.find(l => l.id === currentLevelId) ||
      ALL_50_HOOK_LEVELS[0]
    );
  }, [currentLevelId]);

  // Active skin config
  const currentSkin: StickmanSkin = useMemo(() => {
    return (
      ALL_SKINS.find(s => s.id === selectedSkinId) ||
      ALL_SKINS[0]
    );
  }, [selectedSkinId]);

  // ── 2. SINGLE BATCHED RENDER FRAME (ZERO FRAME DROP) ──────────────────────
  const physicsRef = useRef<PhysicsWorld>(new PhysicsWorld(currentConfig, selectedSkinId));
  const cameraRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const elapsedTimeRef = useRef<number>(0);
  const isVictoryTriggeredRef = useRef<boolean>(false);

  const [frame, setFrame] = useState<GameRenderFrame>({
    player: physicsRef.current.player,
    activePin: null,
    targetCandidatePin: null,
    cameraX: 0,
    cameraY: 0,
    particles: [],
    progressPercent: 0,
  });

  // Game Run Modals State
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameOverReason, setGameOverReason] = useState<'fall' | 'hazard'>('fall');
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [victoryStars, setVictoryStars] = useState<number>(3);
  const [finalTime, setFinalTime] = useState<number>(0);
  const [canRevive, setCanRevive] = useState<boolean>(true);

  // Modals state
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState<boolean>(false);
  const [isSkinModalOpen, setIsSkinModalOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(HookAudio.isMuted());

  // Pending reward skin unlock
  const pendingAdSkinIdRef = useRef<string | null>(null);

  // Rewarded Ad instance
  const rewardedAdRef = useRef<RewardedAd | null>(null);
  const isRewardedLoadedRef = useRef<boolean>(false);

  // ── 3. LANDSCAPE LOCK & APP OPEN AD SUPPRESSION ───────────────────────────
  useFocusEffect(
    useCallback(() => {
      Orientation.lockToLandscape();
      StatusBar.setHidden(true);
      AppOpenAdManager.setGameActive(true);
      return () => {
        Orientation.lockToPortrait();
        StatusBar.setHidden(false);
        AppOpenAdManager.setGameActive(false);
      };
    }, [])
  );

  useEffect(() => {
    AppOpenAdManager.setGameActive(true);
    return () => {
      AppOpenAdManager.setGameActive(false);
    };
  }, []);

  // ── 4. LOAD STORAGE ON MOUNT ───────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      const unlocked = await HookStorage.getUnlockedLevel();
      const starsMap = await HookStorage.getAllStars(50);
      const savedSkin = await HookStorage.getSelectedSkin();
      const skinsList = await HookStorage.getUnlockedSkins();
      const savedTime = await HookStorage.getBestTime(currentLevelId);

      setUnlockedLevel(unlocked);
      setCurrentLevelId(unlocked);
      setLevelStars(starsMap);
      setSelectedSkinId(savedSkin);
      setUnlockedSkins(skinsList);
      setBestTime(savedTime);
    };
    loadData();
  }, []);

  // ── 5. PRELOAD REWARDED ADS ────────────────────────────────────────────────
  useEffect(() => {
    const loadRewarded = () => {
      try {
        const ad = RewardedAd.createForAdRequest(REWARDED_AD_ID, {
          requestNonPersonalizedAdsOnly: true,
        });

        ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
          isRewardedLoadedRef.current = true;
          rewardedAdRef.current = ad;
        });

        ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
          if (pendingAdSkinIdRef.current) {
            const skinToUnlock = pendingAdSkinIdRef.current;
            pendingAdSkinIdRef.current = null;
            HookStorage.unlockSkin(skinToUnlock).then(newList => {
              setUnlockedSkins(newList);
              setSelectedSkinId(skinToUnlock);
              HookStorage.setSelectedSkin(skinToUnlock);
            });
          } else {
            handleCheckpointRevive();
          }
        });

        ad.addAdEventListener(AdEventType.CLOSED, () => {
          Orientation.lockToLandscape();
          StatusBar.setHidden(true);
          isRewardedLoadedRef.current = false;
          loadRewarded();
        });

        ad.load();
      } catch (err) {
        console.warn('[StickmanHook] Rewarded ad load error:', err);
      }
    };

    loadRewarded();
  }, []);

  // ── 6. START / RESTART LEVEL ───────────────────────────────────────────────
  const startLevel = useCallback(
    (lvlId: number) => {
      const lvl = ALL_50_HOOK_LEVELS.find(l => l.id === lvlId) || ALL_50_HOOK_LEVELS[0];
      setCurrentLevelId(lvl.id);
      setIsPaused(false);
      setIsGameOver(false);
      setIsVictory(false);
      setCanRevive(true);
      elapsedTimeRef.current = 0;
      particlesRef.current = [];
      isVictoryTriggeredRef.current = false;

      // Initialize fresh physics world
      const newWorld = new PhysicsWorld(lvl, selectedSkinId);
      physicsRef.current = newWorld;

      // Center camera on start position with zoomed out world view
      const viewWorldWidth = screenWidth / STICKMAN_GAME_ZOOM;
      const viewWorldHeight = screenHeight / STICKMAN_GAME_ZOOM;
      const initCamX = lvl.startX - viewWorldWidth * 0.30;
      const initCamY = lvl.startY - viewWorldHeight * 0.48;
      cameraRef.current = { x: initCamX, y: initCamY };

      setFrame({
        player: newWorld.player,
        activePin: null,
        targetCandidatePin: newWorld.findBestCandidatePin(),
        cameraX: initCamX,
        cameraY: initCamY,
        particles: [],
        progressPercent: 0,
      });

      HookStorage.getBestTime(lvl.id).then(t => setBestTime(t));
    },
    [selectedSkinId]
  );

  useEffect(() => {
    startLevel(currentLevelId);
  }, [currentLevelId, startLevel]);

  // ── 7. TOUCH / PAN RESPONDER (HOLD TO GRAPPLE) ─────────────────────────────
  const isHoldingRef = useRef(false);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: evt => {
          if (isPaused || isGameOver || isVictory || isSkinModalOpen || isLevelSelectOpen) return false;
          const { locationY, pageY } = evt.nativeEvent;
          const y = locationY !== undefined ? locationY : pageY;
          if (y < scale(75)) return false;
          return true;
        },
        onMoveShouldSetPanResponder: evt => {
          if (isPaused || isGameOver || isVictory || isSkinModalOpen || isLevelSelectOpen) return false;
          const { locationY, pageY } = evt.nativeEvent;
          const y = locationY !== undefined ? locationY : pageY;
          if (y < scale(75)) return false;
          return true;
        },
        onPanResponderGrant: () => {
          if (isPaused || isGameOver || isVictory || isSkinModalOpen || isLevelSelectOpen) return;
          isHoldingRef.current = true;
          const attached = physicsRef.current.attachHook();
          if (attached) {
            HookAudio.playHookLatch();
          }
        },
        onPanResponderRelease: () => {
          isHoldingRef.current = false;
          physicsRef.current.releaseHook();
          HookAudio.playHookRelease();
        },
        onPanResponderTerminate: () => {
          isHoldingRef.current = false;
          physicsRef.current.releaseHook();
        },
      }),
    [isPaused, isGameOver, isVictory, isSkinModalOpen, isLevelSelectOpen]
  );

  // ── 8. HIGH-PERFORMANCE 60 FPS GAME LOOP ───────────────────────────────────
  useEffect(() => {
    let animId: number;
    let lastTime = Date.now();
    let lastRenderTime = 0;

    const loop = () => {
      const now = Date.now();
      const dt = Math.min(0.033, (now - lastTime) / 1000);
      lastTime = now;

      if (!isPaused && !isGameOver && !isVictory) {
        elapsedTimeRef.current += dt;

        // Advance physics world at 60 FPS
        const res = physicsRef.current.step(dt);

        // Smooth Camera Follow with velocity lookahead in widescreen zoomed-out landscape
        const viewWorldWidth = screenWidth / STICKMAN_GAME_ZOOM;
        const viewWorldHeight = screenHeight / STICKMAN_GAME_ZOOM;
        const lookaheadX = Math.max(-40, Math.min(260, res.player.vx * 0.22));
        const targetCamX = res.player.x + lookaheadX - viewWorldWidth * 0.30;
        const targetCamY = res.player.y - viewWorldHeight * 0.48;

        cameraRef.current.x += (targetCamX - cameraRef.current.x) * 0.12;
        cameraRef.current.y += (targetCamY - cameraRef.current.y) * 0.10;

        // Update active particles in ref
        particlesRef.current = particlesRef.current
          .map(p => ({
            ...p,
            x: p.x + p.vx * dt,
            y: p.y + p.vy * dt,
            alpha: p.alpha - dt * 1.5,
          }))
          .filter(p => p.alpha > 0);

        // Handle Physics Events
        if (res.event === 'trampoline') {
          HookAudio.playTrampolineBounce();
          const tramp = res.eventPayload;
          const newSparks: Particle[] = Array.from({ length: 4 }).map((_, i) => ({
            id: `s_${now}_${i}`,
            x: res.player.x,
            y: tramp.y,
            vx: (Math.random() - 0.5) * 180,
            vy: -Math.random() * 220 - 80,
            color: '#BEF264',
            size: 3,
            alpha: 1,
            life: 1,
          }));
          particlesRef.current.push(...newSparks);
        } else if (res.event === 'speed_ring') {
          HookAudio.playSpeedRing();
          const newBurst: Particle[] = Array.from({ length: 6 }).map((_, i) => ({
            id: `r_${now}_${i}`,
            x: res.player.x,
            y: res.player.y,
            vx: Math.cos((i * Math.PI) / 3) * 240,
            vy: Math.sin((i * Math.PI) / 3) * 240,
            color: '#38BDF8',
            size: 3.5,
            alpha: 1,
            life: 1,
          }));
          particlesRef.current.push(...newBurst);
        } else if (res.event === 'star_collected') {
          HookAudio.playStarCollect();
          const star = res.eventPayload;
          const starBursts: Particle[] = Array.from({ length: 6 }).map((_, i) => ({
            id: `st_${now}_${i}`,
            x: star.x,
            y: star.y,
            vx: Math.cos((i * Math.PI) / 3) * 160,
            vy: Math.sin((i * Math.PI) / 3) * 160,
            color: '#FACC15',
            size: 3.5,
            alpha: 1,
            life: 1,
          }));
          particlesRef.current.push(...starBursts);
        } else if (res.event === 'portal_warp') {
          HookAudio.playPortalWarp();
          const portal = res.eventPayload;
          const warpFlares: Particle[] = Array.from({ length: 8 }).map((_, i) => ({
            id: `w_${now}_${i}`,
            x: portal.outX,
            y: portal.outY,
            vx: (Math.random() - 0.5) * 320,
            vy: (Math.random() - 0.5) * 320,
            color: '#C084FC',
            size: 4,
            alpha: 1,
            life: 1,
          }));
          particlesRef.current.push(...warpFlares);
        } else if (res.event === 'powerup_collected') {
          HookAudio.playPowerUpCollect();
          const pu = res.eventPayload;
          const puColor =
            pu.type === 'jetpack'
              ? '#F97316'
              : pu.type === 'slow_mo'
              ? '#A855F7'
              : pu.type === 'speed_boost'
              ? '#FACC15'
              : '#10B981';
          const bursts: Particle[] = Array.from({ length: 8 }).map((_, i) => ({
            id: `pu_${now}_${i}`,
            x: pu.x,
            y: pu.y,
            vx: Math.cos((i * Math.PI) / 4) * 220,
            vy: Math.sin((i * Math.PI) / 4) * 220,
            color: puColor,
            size: 4,
            alpha: 1,
            life: 1,
          }));
          particlesRef.current.push(...bursts);
        } else if (res.event === 'wind_vent') {
          HookAudio.playSpeedRing();
        } else if (res.event === 'bungee_web') {
          HookAudio.playWebBungee();
          const web = res.eventPayload;
          const webSparks: Particle[] = Array.from({ length: 8 }).map((_, i) => ({
            id: `bw_${now}_${i}`,
            x: res.player.x,
            y: web.y,
            vx: (Math.random() - 0.5) * 260,
            vy: -Math.random() * 260 - 100,
            color: '#34D399',
            size: 3.5,
            alpha: 1,
            life: 1,
          }));
          particlesRef.current.push(...webSparks);
        } else if (res.event === 'barrier_smashed') {
          HookAudio.playGlassShatter();
          const barrier = res.eventPayload;
          const shards: Particle[] = Array.from({ length: 12 }).map((_, i) => ({
            id: `sh_${now}_${i}`,
            x: barrier.x + barrier.width / 2,
            y: barrier.y + barrier.height / 2,
            vx: (Math.random() - 0.3) * 360,
            vy: (Math.random() - 0.5) * 360,
            color: i % 2 === 0 ? '#38BDF8' : '#E0F2FE',
            size: 4,
            alpha: 1,
            life: 1,
          }));
          particlesRef.current.push(...shards);
        } else if (res.event === 'acrobatic_loop') {
          HookAudio.playAcrobaticLoop();
          const loopGlows: Particle[] = Array.from({ length: 10 }).map((_, i) => ({
            id: `loop_${now}_${i}`,
            x: res.player.x,
            y: res.player.y,
            vx: Math.cos((i * Math.PI) / 5) * 220,
            vy: Math.sin((i * Math.PI) / 5) * 220,
            color: '#FACC15',
            size: 4,
            alpha: 1,
            life: 1,
          }));
          particlesRef.current.push(...loopGlows);
        } else if (res.event === 'hazard_hit') {
          HookAudio.playHazardHit();
          setFinalTime(elapsedTimeRef.current);
          setGameOverReason('hazard');
          setIsGameOver(true);
        } else if (res.event === 'fall_death') {
          HookAudio.playHazardHit();
          setFinalTime(elapsedTimeRef.current);
          setGameOverReason('fall');
          setIsGameOver(true);
        } else if (res.event === 'victory') {
          if (!isVictoryTriggeredRef.current) {
            isVictoryTriggeredRef.current = true;
            HookAudio.playVictory();
            const time = elapsedTimeRef.current;
            setFinalTime(time);
            setIsVictory(true);

            const par = currentConfig.parTimeSeconds;
            let earnedStars = 1;
            if (time <= par) {
              earnedStars = 3;
            } else if (time <= par * 1.35) {
              earnedStars = 2;
            }
            setVictoryStars(earnedStars);

            const nextLvl = Math.min(50, currentLevelId + 1);
            HookStorage.setUnlockedLevel(nextLvl);
            HookStorage.setLevelStars(currentLevelId, earnedStars);
            HookStorage.setBestTime(currentLevelId, time);

            setUnlockedLevel(prev => Math.max(prev, nextLvl));
            setLevelStars(prev => ({ ...prev, [currentLevelId]: Math.max(prev[currentLevelId] || 0, earnedStars) }));
            showNaturalAd();
          }
        }

        // BATCHED RENDER FRAME UPDATE (16ms = 60 FPS)
        if (now - lastRenderTime >= 16) {
          lastRenderTime = now;
          const totalDist = currentConfig.finishX - currentConfig.startX;
          const currentProg = Math.max(
            0,
            Math.min(100, ((res.player.x - currentConfig.startX) / totalDist) * 100)
          );

          setFrame({
            player: res.player,
            activePin: res.activePin,
            targetCandidatePin: res.targetCandidatePin,
            cameraX: cameraRef.current.x,
            cameraY: cameraRef.current.y,
            particles: particlesRef.current,
            progressPercent: currentProg,
          });
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, isGameOver, isVictory, currentConfig, showNaturalAd, currentLevelId]);

  // ── 9. CHECKPOINT REVIVE ───────────────────────────────────────────────────
  const handleCheckpointRevive = () => {
    setCanRevive(false);
    setIsGameOver(false);
    physicsRef.current.reviveAtSafeCheckpoint();
  };

  const handleWatchReviveAd = () => {
    if (rewardedAdRef.current && isRewardedLoadedRef.current) {
      pendingAdSkinIdRef.current = null;
      rewardedAdRef.current.show();
      isRewardedLoadedRef.current = false;
    } else {
      handleCheckpointRevive();
    }
  };

  const handleWatchSkinAd = (skinId: string) => {
    if (rewardedAdRef.current && isRewardedLoadedRef.current) {
      pendingAdSkinIdRef.current = skinId;
      rewardedAdRef.current.show();
      isRewardedLoadedRef.current = false;
    } else {
      HookStorage.unlockSkin(skinId).then(list => {
        setUnlockedSkins(list);
        setSelectedSkinId(skinId);
        HookStorage.setSelectedSkin(skinId);
      });
    }
  };

  const totalAccumulatedStars = useMemo(() => {
    return Object.values(levelStars).reduce((sum, s) => sum + s, 0);
  }, [levelStars]);

  const backgroundGradientColors = useMemo(() => {
    switch (currentConfig.theme) {
      case 'city_sunset':
        return ['#1E1B4B', '#312E81', '#4C1D95'];
      case 'neon_skyway':
        return ['#090D16', '#0F172A', '#0369A1'];
      case 'steampunk':
        return ['#1C1917', '#292524', '#44403C'];
      case 'hazard_foundry':
        return ['#18181B', '#27272A', '#7F1D1D'];
      case 'cosmic_void':
      default:
        return ['#020617', '#0F172A', '#1E1B4B'];
    }
  }, [currentConfig.theme]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Main Touch Canvas */}
      <View style={styles.gameView}>
        <LinearGradient
          colors={backgroundGradientColors}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Hardware-Accelerated Skia GPU Renderer with SVG Fallback */}
        <CanvasErrorBoundary
          fallback={
            <HookCanvas
              player={frame.player}
              pins={physicsRef.current.pins}
              trampolines={physicsRef.current.trampolines}
              speedRings={physicsRef.current.speedRings}
              hazards={physicsRef.current.hazards}
              windVents={physicsRef.current.windVents}
              lasers={physicsRef.current.lasers}
              bungeeWebs={physicsRef.current.bungeeWebs}
              barriers={physicsRef.current.barriers}
              wreckingBalls={physicsRef.current.wreckingBalls}
              stars={physicsRef.current.stars}
              portals={physicsRef.current.portals}
              powerUps={physicsRef.current.powerUps}
              finishX={currentConfig.finishX}
              theme={currentConfig.theme || 'city_sunset'}
              activePin={frame.activePin}
              targetCandidatePin={frame.targetCandidatePin}
              cameraX={frame.cameraX}
              cameraY={frame.cameraY}
              particles={frame.particles}
              skinColor={currentSkin.primaryColor}
              headColor={currentSkin.headColor}
              ropeColor={currentSkin.ropeColor}
              screenWidth={screenWidth}
              screenHeight={screenHeight}
            />
          }
        >
          <HookSkiaCanvas
            player={frame.player}
            pins={physicsRef.current.pins}
            trampolines={physicsRef.current.trampolines}
            speedRings={physicsRef.current.speedRings}
            hazards={physicsRef.current.hazards}
            windVents={physicsRef.current.windVents}
            lasers={physicsRef.current.lasers}
            bungeeWebs={physicsRef.current.bungeeWebs}
            barriers={physicsRef.current.barriers}
            wreckingBalls={physicsRef.current.wreckingBalls}
            stars={physicsRef.current.stars}
            portals={physicsRef.current.portals}
            powerUps={physicsRef.current.powerUps}
            finishX={currentConfig.finishX}
            theme={currentConfig.theme || 'city_sunset'}
            activePin={frame.activePin}
            targetCandidatePin={frame.targetCandidatePin}
            cameraX={frame.cameraX}
            cameraY={frame.cameraY}
            particles={frame.particles}
            skinColor={currentSkin.primaryColor}
            headColor={currentSkin.headColor}
            ropeColor={currentSkin.ropeColor}
            screenWidth={screenWidth}
            screenHeight={screenHeight}
          />
        </CanvasErrorBoundary>

        {/* Dedicated Game Touch Handler Layer (Full screen under HUD) */}
        <View
          style={StyleSheet.absoluteFillObject}
          {...panResponder.panHandlers}
        />

        {/* ── TOP HUD BAR ──────────────────────────────────────────────────── */}
        <View style={styles.hudContainer} pointerEvents="box-none">
          <View style={styles.hudLeft} pointerEvents="auto">
            <TouchableOpacity
              activeOpacity={0.8}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.hudIconBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={scale(20)} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.hudIconBtn}
              onPress={() => setIsPaused(true)}
            >
              <Ionicons name="pause" size={scale(20)} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Level Progress Bar & Title & Active Power-Ups */}
          <View style={styles.hudCenter} pointerEvents="none">
            <Text style={styles.hudLevelTitle}>LEVEL {currentLevelId}</Text>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${frame.progressPercent}%` }]} />
            </View>

            {/* Active Power-Ups Pill */}
            {frame.player.activePowerUps && frame.player.activePowerUps.length > 0 && (
              <View style={styles.activePowerUpRow}>
                {frame.player.activePowerUps.map(pu => (
                  <View
                    key={pu.type}
                    style={[
                      styles.powerUpBadge,
                      pu.type === 'slow_mo' && { backgroundColor: 'rgba(168, 85, 247, 0.9)' },
                      pu.type === 'speed_boost' && { backgroundColor: 'rgba(234, 179, 8, 0.9)' },
                      pu.type === 'magnet' && { backgroundColor: 'rgba(16, 185, 129, 0.9)' },
                    ]}
                  >
                    <Text style={styles.powerUpBadgeText}>
                      {pu.type === 'slow_mo'
                        ? '⏱️ SLOW-MO'
                        : pu.type === 'speed_boost'
                        ? '⚡ SPEED'
                        : '🧲 MAGNET'}{' '}
                      {pu.remainingTime.toFixed(1)}s
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Skins & Level Select Buttons */}
          <View style={styles.hudRight} pointerEvents="auto">
            <TouchableOpacity
              activeOpacity={0.8}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.hudIconBtn}
              onPress={() => setIsSkinModalOpen(true)}
            >
              <Ionicons name="shirt-outline" size={scale(20)} color="#38BDF8" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.hudIconBtn}
              onPress={() => setIsLevelSelectOpen(true)}
            >
              <Ionicons name="grid-outline" size={scale(20)} color="#FACC15" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── BOTTOM CONTROLS HINT ─────────────────────────────────────────── */}
        {!frame.player.isGrappling && !isGameOver && !isVictory && (
          <View style={styles.hintContainer} pointerEvents="none">
            <Text style={styles.hintText}>TAP & HOLD TO GRAPPLE • RELEASE TO FLY</Text>
          </View>
        )}
      </View>

      {/* ── MODALS ─────────────────────────────────────────────────────────── */}
      <VictoryModal
        visible={isVictory}
        levelId={currentLevelId}
        stars={victoryStars}
        elapsedSeconds={finalTime}
        bestTime={bestTime}
        onNextLevel={() => {
          if (currentLevelId < 50) {
            startLevel(currentLevelId + 1);
          } else {
            setIsLevelSelectOpen(true);
          }
        }}
        onReplay={() => startLevel(currentLevelId)}
        onOpenLevelSelect={() => {
          setIsVictory(false);
          setIsLevelSelectOpen(true);
        }}
      />

      <GameOverModal
        visible={isGameOver}
        levelId={currentLevelId}
        reason={gameOverReason}
        canRevive={canRevive}
        onReviveAd={handleWatchReviveAd}
        onRetry={() => startLevel(currentLevelId)}
        onOpenLevelSelect={() => {
          setIsGameOver(false);
          setIsLevelSelectOpen(true);
        }}
      />

      <LevelSelectModal
        visible={isLevelSelectOpen}
        unlockedLevel={unlockedLevel}
        levelStars={levelStars}
        onSelectLevel={lvl => {
          setIsLevelSelectOpen(false);
          startLevel(lvl);
        }}
        onClose={() => setIsLevelSelectOpen(false)}
      />

      <PauseModal
        visible={isPaused}
        levelId={currentLevelId}
        isMuted={isMuted}
        onResume={() => setIsPaused(false)}
        onRestart={() => startLevel(currentLevelId)}
        onToggleSound={() => {
          const next = !isMuted;
          setIsMuted(next);
          HookAudio.setMuted(next);
        }}
        onOpenLevelSelect={() => {
          setIsPaused(false);
          setIsLevelSelectOpen(true);
        }}
        onQuit={() => navigation.goBack()}
      />

      <SkinSelectorModal
        visible={isSkinModalOpen}
        selectedSkinId={selectedSkinId}
        unlockedSkins={unlockedSkins}
        totalStars={totalAccumulatedStars}
        onSelectSkin={skinId => {
          setSelectedSkinId(skinId);
          HookStorage.setSelectedSkin(skinId);
          physicsRef.current.player.skinId = skinId;
        }}
        onUnlockViaAd={handleWatchSkinAd}
        onClose={() => setIsSkinModalOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  gameView: {
    flex: 1,
    overflow: 'hidden',
  },
  hudContainer: {
    position: 'absolute',
    top: scale(10),
    left: scale(12),
    right: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 60,
    elevation: 10,
  },
  hudLeft: {
    flexDirection: 'row',
    gap: scale(8),
  },
  hudRight: {
    flexDirection: 'row',
    gap: scale(8),
  },
  hudIconBtn: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  hudCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: scale(10),
  },
  hudLevelTitle: {
    color: '#FFF',
    fontSize: scale(13),
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: scale(4),
  },
  progressBarTrack: {
    width: '100%',
    maxWidth: scale(140),
    height: scale(7),
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: scale(4),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FACC15',
    borderRadius: scale(4),
  },
  activePowerUpRow: {
    flexDirection: 'row',
    gap: scale(6),
    marginTop: scale(4),
  },
  powerUpBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  powerUpBadgeText: {
    color: '#FFF',
    fontSize: scale(9),
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  hintContainer: {
    position: 'absolute',
    bottom: scale(30),
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: scale(14),
    paddingVertical: scale(6),
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  hintText: {
    color: '#94A3B8',
    fontSize: scale(10),
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
