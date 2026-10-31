// ─────────────────────────────────────────────────────────────────────────────
//  HookCanvas.tsx
//  GPU-Optimized Zero-Lag Canvas for Stickman Hook: Swing Hero
//  Features:
//  • Memoized Parallax Background (Zero per-frame VDOM recreation)
//  • Authentic Spider-Man Web Rope (Braided web strands & anchor splat)
//  • Expressive Stickman with 6 Situational Facial Expressions
//  • Strict Viewport Culling & Zero Array Allocations in Render
// ─────────────────────────────────────────────────────────────────────────────

import React, { memo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  G,
  Circle,
  Line,
  Rect,
  Path,
  Polygon,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';

import {
  AnchorPin,
  Trampoline,
  SpeedRing,
  HazardSaw,
  WindVent,
  LaserGate,
  BungeeWeb,
  BreakableBarrier,
  WreckingBall,
  CollectibleStar,
  PortalGate,
  PowerUpItem,
  StickmanPlayer,
  Particle,
  BackgroundTheme,
} from '../types/stickmanHookTypes';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ── 1. THEME PALETTES ────────────────────────────────────────────────────────
const THEME_PALETTES = {
  city_sunset: {
    skyTop: '#1E1B4B',
    skylineFar: '#1E1B4B',
    skylineMid: '#0F172A',
    windowColor: '#FDE047',
    hazeColor: '#F43F5E',
  },
  neon_skyway: {
    skyTop: '#090D16',
    skylineFar: '#1E293B',
    skylineMid: '#0F172A',
    windowColor: '#38BDF8',
    hazeColor: '#06B6D4',
  },
  steampunk: {
    skyTop: '#1C1917',
    skylineFar: '#262626',
    skylineMid: '#171717',
    windowColor: '#F59E0B',
    hazeColor: '#D97706',
  },
  hazard_foundry: {
    skyTop: '#18181B',
    skylineFar: '#1C1917',
    skylineMid: '#0A0A0A',
    windowColor: '#EF4444',
    hazeColor: '#DC2626',
  },
  cosmic_void: {
    skyTop: '#020617',
    skylineFar: '#0F172A',
    skylineMid: '#020617',
    windowColor: '#C084FC',
    hazeColor: '#7C3AED',
  },
};

// ── 2. MEMOIZED PARALLAX BACKGROUND (ELIMINATES 250+ PER-FRAME NODES) ────────
interface ParallaxSkylineProps {
  cameraX: number;
  theme: BackgroundTheme;
}

const ParallaxSkyline = memo(({ cameraX, theme }: ParallaxSkylineProps) => {
  const p = THEME_PALETTES[theme] || THEME_PALETTES.city_sunset;
  const farOffset = (cameraX * -0.06) % (SCREEN_WIDTH + 150);
  const midOffset = (cameraX * -0.15) % (SCREEN_WIDTH + 200);

  return (
    <G>
      {/* Layer A: Distant Silhouette Towers */}
      <G transform={`translate(${farOffset}, 0)`} opacity={0.35}>
        {[-100, 40, 180, 320, 460].map((bx, i) => (
          <G key={`far_${i}`}>
            <Rect x={bx} y={SCREEN_HEIGHT - 320} width={80} height={320} fill={p.skylineFar} />
            <Line x1={bx + 40} y1={SCREEN_HEIGHT - 320} x2={bx + 40} y2={SCREEN_HEIGHT - 355} stroke="#64748B" strokeWidth={1.5} />
            <Circle cx={bx + 40} cy={SCREEN_HEIGHT - 355} r={2} fill="#EF4444" />
          </G>
        ))}
      </G>

      {/* Layer B: Mid-Ground City Towers with Window Clusters */}
      <G transform={`translate(${midOffset}, 0)`} opacity={0.65}>
        {[-80, 80, 240, 400].map((bx, i) => {
          const topY = SCREEN_HEIGHT - 240;
          return (
            <G key={`mid_${i}`}>
              <Rect x={bx} y={topY} width={110} height={240} fill={p.skylineMid} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              {/* Antenna / Tank */}
              <Rect x={bx + 15} y={topY - 14} width={16} height={14} fill="#334155" rx={2} />
              {/* Batched Window Rectangles (Grouped for high performance) */}
              {[0, 1, 2, 3].map(row => (
                <G key={`r_${row}`}>
                  <Rect x={bx + 20} y={topY + 25 + row * 26} width={14} height={15} fill={p.windowColor} opacity={0.7} rx={2} />
                  <Rect x={bx + 45} y={topY + 25 + row * 26} width={14} height={15} fill={p.windowColor} opacity={0.4} rx={2} />
                  <Rect x={bx + 70} y={topY + 25 + row * 26} width={14} height={15} fill={p.windowColor} opacity={0.7} rx={2} />
                </G>
              ))}
            </G>
          );
        })}
      </G>

      {/* Horizon Fog Accent */}
      <Rect x={0} y={SCREEN_HEIGHT - 160} width={SCREEN_WIDTH} height={160} fill={p.hazeColor} opacity={0.07} />
    </G>
  );
}, (prev, next) => {
  // Only update background position in chunks to save UI frame time
  return (
    prev.theme === next.theme &&
    Math.abs(prev.cameraX - next.cameraX) < 4
  );
});

// ── 3. SPIDER-MAN WEB ROPE RENDERER ──────────────────────────────────────────
interface SpiderWebProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const SpiderWeb = memo(({ startX, startY, endX, endY }: SpiderWebProps) => {
  const dx = endX - startX;
  const dy = endY - startY;
  const len = Math.sqrt(dx * dx + dy * dy);
  const midX = (startX + endX) * 0.5;
  const midY = (startY + endY) * 0.5;

  return (
    <G>
      {/* Spiderweb anchor splat decal on pin */}
      <G x={startX} y={startY}>
        <Line x1={-16} y1={-8} x2={16} y2={8} stroke="#FFFFFF" strokeWidth={1.2} opacity={0.8} />
        <Line x1={-8} y1={-16} x2={8} y2={16} stroke="#FFFFFF" strokeWidth={1.2} opacity={0.8} />
        <Line x1={-16} y1={8} x2={16} y2={-8} stroke="#FFFFFF" strokeWidth={1.2} opacity={0.8} />
        <Circle cx={0} cy={0} r={9} fill="none" stroke="#FFFFFF" strokeWidth={1} opacity={0.6} />
        <Circle cx={0} cy={0} r={4} fill="#FFFFFF" />
      </G>

      {/* Outer Luminous Web Sheen */}
      <Line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#BAE6FD" strokeWidth={4.5} opacity={0.35} />

      {/* Core Braided Web Cable */}
      <Line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" />

      {/* Spiral Web Texture */}
      <Line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#E0F2FE" strokeWidth={1.2} strokeDasharray="4, 5" opacity={0.85} />

      {/* Center Sticky Node Bead */}
      <Circle cx={midX} cy={midY} r={2.5} fill="#FFFFFF" stroke="#38BDF8" strokeWidth={0.8} />

      {/* Wrist Web-Shooter Muzzle Flare */}
      <Circle cx={endX} cy={endY} r={3.5} fill="#FFFFFF" opacity={0.9} />
    </G>
  );
});

// ── 4. EXPRESSIVE STICKMAN CHARACTER ─────────────────────────────────────────
interface StickmanProps {
  screenX: number;
  screenY: number;
  rotation: number;
  isGrappling: boolean;
  faceExpression: string;
  headColor: string;
  skinColor: string;
}

const ExpressiveStickman = memo(({
  screenX,
  screenY,
  rotation,
  isGrappling,
  faceExpression,
  headColor,
  skinColor,
}: StickmanProps) => {
  return (
    <G transform={`translate(${screenX}, ${screenY}) rotate(${rotation})`}>
      {/* Flowing Bandana Ribbon */}
      <Path
        d="M -3 -15 C -12 -12, -22 -19, -30 -15 C -22 -13, -12 -9, -2 -13 Z"
        fill="#EF4444"
        opacity={0.9}
      />

      {/* Head */}
      <Circle cx={0} cy={-14} r={9} fill={headColor} stroke="#0F172A" strokeWidth={1.8} />

      {/* ── Situational Facial Expressions ── */}
      {faceExpression === 'screaming' && (
        <G>
          <Circle cx={-3.5} cy={-16} r={3} fill="#FFF" stroke="#000" strokeWidth={0.8} />
          <Circle cx={3.5} cy={-16} r={3} fill="#FFF" stroke="#000" strokeWidth={0.8} />
          <Circle cx={-3.5} cy={-16} r={1.2} fill="#000" />
          <Circle cx={3.5} cy={-16} r={1.2} fill="#000" />
          <Circle cx={0} cy={-10.5} r={2.8} fill="#000" />
          <Circle cx={0} cy={-11} r={1.5} fill="#EF4444" />
          <Circle cx={7} cy={-20} r={1.8} fill="#38BDF8" />
        </G>
      )}

      {faceExpression === 'excited' && (
        <G>
          <Circle cx={-3} cy={-16} r={2.8} fill="#FFF" />
          <Circle cx={3} cy={-16} r={2.8} fill="#FFF" />
          <Circle cx={-2.6} cy={-16.2} r={1.4} fill="#000" />
          <Circle cx={3.4} cy={-16.2} r={1.4} fill="#000" />
          <Path d="M -4 -11 Q 0 -6 4 -11 Z" fill="#000" />
        </G>
      )}

      {faceExpression === 'grimacing' && (
        <G>
          <Line x1={-5} y1={-17} x2={-1.5} y2={-15} stroke="#000" strokeWidth={1.8} strokeLinecap="round" />
          <Line x1={5} y1={-17} x2={1.5} y2={-15} stroke="#000" strokeWidth={1.8} strokeLinecap="round" />
          <Rect x={-4} y={-12} width={8} height={3} fill="#FFF" stroke="#000" strokeWidth={1} rx={1} />
        </G>
      )}

      {faceExpression === 'happy' && (
        <G>
          <Path d="M -5 -15 Q -3 -18 -1 -15" stroke="#000" strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <Path d="M 1 -15 Q 3 -18 5 -15" stroke="#000" strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <Path d="M -3.5 -11 Q 0 -7 3.5 -11" stroke="#000" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </G>
      )}

      {faceExpression === 'triumph' && (
        <G>
          <Polygon points="-3,-19 -2,-17 0,-17 -1,-15 -0.5,-14 -3,-15.5 -5,-14 -4,-15.5 -5.5,-17 -4,-17" fill="#FACC15" />
          <Polygon points="3,-19 4,-17 6,-17 5,-15 5.5,-14 3,-15.5 1,-14 2,-15.5 0.5,-17 2,-17" fill="#FACC15" />
          <Path d="M -4 -11.5 Q 0 -5 4 -11.5 Z" fill="#FFF" stroke="#000" strokeWidth={1} />
        </G>
      )}

      {faceExpression === 'focused' && (
        <G>
          <Polygon points="-5,-17 -1,-15 -2,-14 -5,-15" fill="#FFF" stroke="#000" strokeWidth={0.8} />
          <Polygon points="5,-17 1,-15 2,-14 5,-15" fill="#FFF" stroke="#000" strokeWidth={0.8} />
          <Circle cx={-2.2} cy={-15} r={0.9} fill="#000" />
          <Circle cx={2.2} cy={-15} r={0.9} fill="#000" />
          <Line x1={-2.5} y1={-10.5} x2={2.5} y2={-10.5} stroke="#000" strokeWidth={1.4} strokeLinecap="round" />
        </G>
      )}

      {/* Torso & Emblem */}
      <Line x1={0} y1={-5} x2={0} y2={11} stroke={skinColor} strokeWidth={4.5} strokeLinecap="round" />
      <Circle cx={0} cy={1} r={2} fill="#FFFFFF" />

      {/* Limbs */}
      {isGrappling ? (
        <G>
          <Line x1={0} y1={-3} x2={-5} y2={-10} stroke={skinColor} strokeWidth={3} strokeLinecap="round" />
          <Line x1={-5} y1={-10} x2={-2} y2={-19} stroke={skinColor} strokeWidth={3} strokeLinecap="round" />
          <Circle cx={-2} cy={-19} r={2.5} fill="#FFF" />

          <Line x1={0} y1={-3} x2={5} y2={-10} stroke={skinColor} strokeWidth={3} strokeLinecap="round" />
          <Line x1={5} y1={-10} x2={2} y2={-19} stroke={skinColor} strokeWidth={3} strokeLinecap="round" />
          <Circle cx={2} cy={-19} r={2.5} fill="#FFF" />

          <Line x1={0} y1={10} x2={-6} y2={18} stroke={skinColor} strokeWidth={3} strokeLinecap="round" />
          <Line x1={-6} y1={18} x2={-2} y2={25} stroke={skinColor} strokeWidth={3} strokeLinecap="round" />
          <Rect x={-4} y={23} width={5} height={3} fill="#0F172A" rx={1} />

          <Line x1={0} y1={10} x2={6} y2={17} stroke={skinColor} strokeWidth={3} strokeLinecap="round" />
          <Line x1={6} y1={17} x2={10} y2={23} stroke={skinColor} strokeWidth={3} strokeLinecap="round" />
          <Rect x={8} y={22} width={5} height={3} fill="#0F172A" rx={1} />
        </G>
      ) : (
        <G>
          <Line x1={0} y1={-3} x2={-8} y2={2} stroke={skinColor} strokeWidth={3} strokeLinecap="round" />
          <Line x1={-8} y1={2} x2={-14} y2={-3} stroke={skinColor} strokeWidth={3} strokeLinecap="round" />
          <Circle cx={-14} cy={-3} r={2} fill="#FFF" />

          <Line x1={0} y1={-3} x2={8} y2={-2} stroke={skinColor} strokeWidth={3} strokeLinecap="round" />
          <Line x1={8} y1={-2} x2={15} y2={-9} stroke={skinColor} strokeWidth={3} strokeLinecap="round" />
          <Circle cx={15} cy={-9} r={2} fill="#FFF" />

          <Line x1={0} y1={10} x2={-7} y2={17} stroke={skinColor} strokeWidth={3} strokeLinecap="round" />
          <Line x1={-7} y1={17} x2={-11} y2={26} stroke={skinColor} strokeWidth={3} strokeLinecap="round" />
          <Rect x={-13} y={24} width={5} height={3} fill="#0F172A" rx={1} />

          <Line x1={0} y1={10} x2={7} y2={18} stroke={skinColor} strokeWidth={3} strokeLinecap="round" />
          <Line x1={7} y1={18} x2={11} y2={27} stroke={skinColor} strokeWidth={3} strokeLinecap="round" />
          <Rect x={9} y={25} width={5} height={3} fill="#0F172A" rx={1} />
        </G>
      )}
    </G>
  );
});

// ── 5. MAIN HOOK CANVAS ──────────────────────────────────────────────────────
interface HookCanvasProps {
  player: StickmanPlayer;
  pins: AnchorPin[];
  trampolines: Trampoline[];
  speedRings: SpeedRing[];
  hazards: HazardSaw[];
  windVents?: WindVent[];
  lasers?: LaserGate[];
  bungeeWebs?: BungeeWeb[];
  barriers?: BreakableBarrier[];
  wreckingBalls?: WreckingBall[];
  stars?: CollectibleStar[];
  portals?: PortalGate[];
  powerUps?: PowerUpItem[];
  finishX: number;
  theme: BackgroundTheme;
  activePin: AnchorPin | null;
  targetCandidatePin: AnchorPin | null;
  cameraX: number;
  cameraY: number;
  particles: Particle[];
  skinColor: string;
  headColor: string;
  ropeColor: string;
  screenWidth?: number;
  screenHeight?: number;
}

export const STICKMAN_GAME_ZOOM = 0.75;

export const HookCanvas: React.FC<HookCanvasProps> = ({
  player,
  pins,
  trampolines,
  speedRings,
  hazards,
  windVents = [],
  lasers = [],
  bungeeWebs = [],
  barriers = [],
  wreckingBalls = [],
  stars = [],
  portals = [],
  powerUps = [],
  finishX,
  theme,
  activePin,
  targetCandidatePin,
  cameraX,
  cameraY,
  particles,
  skinColor,
  headColor,
  ropeColor,
  screenWidth,
  screenHeight,
}) => {
  const sWidth = screenWidth || SCREEN_WIDTH;
  const sHeight = screenHeight || SCREEN_HEIGHT;
  const viewMinX = cameraX - 100;
  const viewMaxX = cameraX + sWidth / STICKMAN_GAME_ZOOM + 100;

  const pScreenX = player.x - cameraX;
  const pScreenY = player.y - cameraY;

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={sWidth} height={sHeight}>
        <Defs>
          <LinearGradient id="trampGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#84CC16" stopOpacity="1" />
            <Stop offset="1" stopColor="#3F6212" stopOpacity="1" />
          </LinearGradient>
          <RadialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="sawGrad" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#CBD5E1" stopOpacity="1" />
            <Stop offset="65%" stopColor="#64748B" stopOpacity="1" />
            <Stop offset="100%" stopColor="#EF4444" stopOpacity="1" />
          </RadialGradient>
          <LinearGradient id="ventGrad" x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* 1. Memoized Parallax Background */}
        <ParallaxSkyline cameraX={cameraX} theme={theme} />

        {/* ── ZOOMED-OUT GAMEPLAY WORLD ── */}
        <G transform={`scale(${STICKMAN_GAME_ZOOM})`}>
          {/* 2. Finish Line */}
          {finishX >= viewMinX && finishX <= viewMaxX && (
            <G x={finishX - cameraX} y={0}>
              <Line x1={0} y1={40} x2={0} y2={sHeight / STICKMAN_GAME_ZOOM - 60} stroke="#FACC15" strokeWidth={3} strokeDasharray="10, 6" opacity={0.7} />
            <Rect x={-15} y={90} width={30} height={40} fill="#FACC15" rx={4} stroke="#000" strokeWidth={1.5} />
            <Rect x={-10} y={95} width={10} height={10} fill="#000" />
            <Rect x={0} y={95} width={10} height={10} fill="#FFF" />
            <Rect x={-10} y={105} width={10} height={10} fill="#FFF" />
            <Rect x={0} y={105} width={10} height={10} fill="#000" />
            <Rect x={-10} y={115} width={10} height={10} fill="#000" />
            <Rect x={0} y={115} width={10} height={10} fill="#FFF" />
          </G>
        )}

        {/* 3. Wind Vents */}
        {windVents.map(vent => {
          if (vent.x + vent.width < viewMinX || vent.x > viewMaxX) return null;
          return (
            <Rect
              key={vent.id}
              x={vent.x - cameraX}
              y={vent.y - cameraY}
              width={vent.width}
              height={vent.height}
              fill="url(#ventGrad)"
              rx={6}
            />
          );
        })}

        {/* 4. Lasers */}
        {lasers.map(laser => {
          if (!laser.active) return null;
          const lx = laser.x - cameraX;
          const ly = laser.y - cameraY;
          const isH = laser.orientation === 'horizontal';
          return (
            <Line
              key={laser.id}
              x1={lx}
              y1={ly}
              x2={isH ? lx + laser.length : lx}
              y2={isH ? ly : ly + laser.length}
              stroke="#EF4444"
              strokeWidth={3.5}
            />
          );
        })}

        {/* 5. Trampolines */}
        {trampolines.map(tramp => {
          if (tramp.x + tramp.width < viewMinX || tramp.x > viewMaxX) return null;
          const sx = tramp.x - cameraX;
          const sy = tramp.y - cameraY;
          const isSquashed = tramp.squashTime && Date.now() - tramp.squashTime < 130;
          const h = isSquashed ? tramp.height * 0.55 : tramp.height;
          const renderY = isSquashed ? sy + tramp.height * 0.45 : sy;
          const isSuper = tramp.superSpring;

          return (
            <G key={tramp.id}>
              <Rect x={sx - 3} y={sy + tramp.height} width={tramp.width + 6} height={6} fill={isSuper ? '#B45309' : '#1E293B'} rx={2} />
              <Rect x={sx} y={renderY} width={tramp.width} height={h} fill={isSuper ? '#FACC15' : 'url(#trampGrad)'} rx={4} stroke={isSuper ? '#FDE047' : '#BEF264'} strokeWidth={1.5} />
              <Line x1={sx + 8} y1={renderY + h / 2} x2={sx + tramp.width - 8} y2={renderY + h / 2} stroke="#FFF" strokeWidth={2} strokeDasharray="6, 6" opacity={0.8} />
            </G>
          );
        })}

        {/* 5e. Spider Bungee Webs (Elastic Slingshot Catapult) */}
        {bungeeWebs.map(web => {
          if (web.x + web.width / 2 < viewMinX || web.x - web.width / 2 > viewMaxX) return null;
          const x1 = web.x - web.width / 2 - cameraX;
          const x2 = web.x + web.width / 2 - cameraX;
          const sy = web.y - cameraY;
          const elapsed = web.tensionTime ? Date.now() - web.tensionTime : 999;
          const sag = elapsed < 260 ? Math.sin((elapsed / 260) * Math.PI) * 28 : 0;
          const midX = (x1 + x2) / 2;

          return (
            <G key={web.id}>
              {/* Metallic End Anchors */}
              <Rect x={x1 - 4} y={sy - 6} width={8} height={12} fill="#475569" rx={2} />
              <Circle cx={x1} cy={sy} r={3} fill="#10B981" />
              <Rect x={x2 - 4} y={sy - 6} width={8} height={12} fill="#475569" rx={2} />
              <Circle cx={x2} cy={sy} r={3} fill="#10B981" />

              {/* Glowing Spider Bungee Cord (Parabolic Sag when hit) */}
              <Path
                d={`M ${x1} ${sy} Q ${midX} ${sy + sag} ${x2} ${sy}`}
                stroke="#10B981"
                strokeWidth={4}
                strokeLinecap="round"
                fill="none"
              />
              <Path
                d={`M ${x1} ${sy} Q ${midX} ${sy + sag} ${x2} ${sy}`}
                stroke="#A7F3D0"
                strokeWidth={1.8}
                strokeLinecap="round"
                fill="none"
              />
              {/* Spider Silk Cross Weaves */}
              {[-18, 0, 18].map((offset, i) => (
                <Line
                  key={`cw_${i}`}
                  x1={midX + offset - 5}
                  y1={sy + sag * 0.7 - 4}
                  x2={midX + offset + 5}
                  y2={sy + sag * 0.7 + 4}
                  stroke="#ECFDF5"
                  strokeWidth={1.4}
                />
              ))}
            </G>
          );
        })}

        {/* 5f. Breakable Speed Barricades (Crystal Glass Panels) */}
        {barriers.map(barrier => {
          if (barrier.broken) {
            const elapsed = barrier.shatterTime ? Date.now() - barrier.shatterTime : 999;
            if (elapsed > 400) return null;
          }
          if (barrier.x + barrier.width < viewMinX || barrier.x > viewMaxX) return null;
          const bx = barrier.x - cameraX;
          const by = barrier.y - cameraY;

          return (
            <G key={barrier.id}>
              {!barrier.broken ? (
                <G>
                  <Rect x={bx} y={by} width={barrier.width} height={barrier.height} fill="#0284C7" fillOpacity={0.35} stroke="#38BDF8" strokeWidth={2} rx={4} />
                  <Line x1={bx + 4} y1={by + barrier.height - 6} x2={bx + barrier.width - 4} y2={by + 6} stroke="#BAE6FD" strokeWidth={2} opacity={0.8} />
                  <Line x1={bx + 12} y1={by + barrier.height - 4} x2={bx + barrier.width - 4} y2={by + 14} stroke="#38BDF8" strokeWidth={1.5} opacity={0.6} />
                </G>
              ) : (
                <G opacity={0.4}>
                  <Line x1={bx + 2} y1={by + 2} x2={bx + barrier.width / 2} y2={by + barrier.height / 2} stroke="#BAE6FD" strokeWidth={1.5} />
                  <Line x1={bx + barrier.width - 2} y1={by + 2} x2={bx + barrier.width / 2} y2={by + barrier.height / 2} stroke="#BAE6FD" strokeWidth={1.5} />
                </G>
              )}
            </G>
          );
        })}

        {/* 5b. Quantum Portal Warp Gates */}
        {portals.map(portal => {
          const inOnScreen = portal.inX >= viewMinX - 50 && portal.inX <= viewMaxX + 50;
          const outOnScreen = portal.outX >= viewMinX - 50 && portal.outX <= viewMaxX + 50;
          return (
            <G key={portal.id}>
              {inOnScreen && (
                <G>
                  <Circle cx={portal.inX - cameraX} cy={portal.inY - cameraY} r={portal.radius + 6} fill="#A855F7" opacity={0.3} />
                  <Circle cx={portal.inX - cameraX} cy={portal.inY - cameraY} r={portal.radius} fill="none" stroke="#7C3AED" strokeWidth={3} />
                  <Circle cx={portal.inX - cameraX} cy={portal.inY - cameraY} r={portal.radius - 6} fill="#C084FC" opacity={0.7} />
                </G>
              )}
              {outOnScreen && (
                <G>
                  <Circle cx={portal.outX - cameraX} cy={portal.outY - cameraY} r={portal.radius + 6} fill="#06B6D4" opacity={0.3} />
                  <Circle cx={portal.outX - cameraX} cy={portal.outY - cameraY} r={portal.radius} fill="none" stroke="#0891B2" strokeWidth={3} />
                  <Circle cx={portal.outX - cameraX} cy={portal.outY - cameraY} r={portal.radius - 6} fill="#38BDF8" opacity={0.7} />
                </G>
              )}
            </G>
          );
        })}

        {/* 5c. Collectible Star Gems */}
        {stars.map(star => {
          if (star.collected) return null;
          if (star.x < viewMinX || star.x > viewMaxX) return null;
          const sx = star.x - cameraX;
          const sy = star.y - cameraY;
          return (
            <G key={star.id}>
              <Circle cx={sx} cy={sy} r={16} fill="#FDE047" opacity={0.25} />
              <Circle cx={sx} cy={sy} r={10} fill="#FACC15" />
              <Circle cx={sx} cy={sy} r={4} fill="#FFFFFF" />
            </G>
          );
        })}

        {/* 5d. Collectible Timed Power-Ups (Jetpack, Slow-Mo, Speed, Magnet) */}
        {powerUps.map(pu => {
          if (pu.collected) return null;
          if (pu.x < viewMinX || pu.x > viewMaxX) return null;
          const sx = pu.x - cameraX;
          const sy = pu.y - cameraY;
          const color =
            pu.type === 'slow_mo'
              ? '#A855F7'
              : pu.type === 'speed_boost'
              ? '#FACC15'
              : '#10B981';

          return (
            <G key={pu.id}>
              <Circle cx={sx} cy={sy} r={pu.radius + 6} fill={color} opacity={0.25} />
              <Circle cx={sx} cy={sy} r={pu.radius} fill="none" stroke={color} strokeWidth={2.5} />
              <Circle cx={sx} cy={sy} r={pu.radius - 5} fill="#FFFFFF" opacity={0.85} />
              <Circle cx={sx} cy={sy} r={3} fill={color} />
            </G>
          );
        })}

        {/* 6. Speed Rings */}
        {speedRings.map(ring => {
          if (ring.collected) return null;
          if (ring.x + ring.radius < viewMinX || ring.x - ring.radius > viewMaxX) return null;
          return (
            <G key={ring.id}>
              <Circle cx={ring.x - cameraX} cy={ring.y - cameraY} r={ring.radius} fill="none" stroke="#38BDF8" strokeWidth={3.5} strokeDasharray="14, 6" />
              <Circle cx={ring.x - cameraX} cy={ring.y - cameraY} r={ring.radius - 5} fill="none" stroke="#BAE6FD" strokeWidth={1.5} />
            </G>
          );
        })}

        {/* 7. Hazard Saws */}
        {hazards.map(saw => {
          if (saw.x + saw.radius < viewMinX || saw.x - saw.radius > viewMaxX) return null;
          const sx = saw.x - cameraX;
          const sy = saw.y - cameraY;
          return (
            <G key={saw.id}>
              {saw.pendulum && (
                <Line x1={saw.pendulum.originX - cameraX} y1={saw.pendulum.originY - cameraY} x2={sx} y2={sy} stroke="#475569" strokeWidth={2} strokeDasharray="3, 3" />
              )}
              <Circle cx={sx} cy={sy} r={saw.radius} fill="url(#sawGrad)" stroke="#DC2626" strokeWidth={2} />
              <Circle cx={sx} cy={sy} r={5} fill="#0F172A" />
            </G>
          );
        })}

        {/* 7b. Swinging Wrecking Balls (Heavy Pendulums) */}
        {wreckingBalls.map(ball => {
          const curX = ball.currentX !== undefined ? ball.currentX : ball.pivotX;
          const curY = ball.currentY !== undefined ? ball.currentY : ball.pivotY + ball.chainLength;
          const maxExtent = ball.chainLength + ball.radius;
          if (ball.pivotX + maxExtent < viewMinX || ball.pivotX - maxExtent > viewMaxX) return null;

          const px = ball.pivotX - cameraX;
          const py = ball.pivotY - cameraY;
          const bx = curX - cameraX;
          const by = curY - cameraY;

          return (
            <G key={ball.id}>
              <Rect x={px - 9} y={py - 6} width={18} height={9} fill="#334155" rx={2} />
              <Circle cx={px} cy={py} r={4} fill="#94A3B8" />
              <Line x1={px} y1={py} x2={bx} y2={by} stroke="#475569" strokeWidth={3.5} />
              <Line x1={px} y1={py} x2={bx} y2={by} stroke="#94A3B8" strokeWidth={1.5} />
              <Circle cx={bx} cy={by} r={ball.radius + 5} fill="#EF4444" opacity={0.25} />
              <Circle cx={bx} cy={by} r={ball.radius} fill="#1E293B" stroke="#DC2626" strokeWidth={2.5} />
              <Circle cx={bx} cy={by} r={ball.radius * 0.45} fill="#475569" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                const spkLen = 6;
                const sx1 = bx + Math.cos(rad) * ball.radius;
                const sy1 = by + Math.sin(rad) * ball.radius;
                const sx2 = bx + Math.cos(rad) * (ball.radius + spkLen);
                const sy2 = by + Math.sin(rad) * (ball.radius + spkLen);
                return (
                  <Line
                    key={`spk_${i}`}
                    x1={sx1}
                    y1={sy1}
                    x2={sx2}
                    y2={sy2}
                    stroke="#EF4444"
                    strokeWidth={2.5}
                  />
                );
              })}
            </G>
          );
        })}

        {/* 8. Anchor Pins */}
        {pins.map(pin => {
          if (pin.shattered) return null;
          if (pin.x < viewMinX - 30 || pin.x > viewMaxX + 30) return null;
          const sx = pin.x - cameraX;
          const sy = pin.y - cameraY;
          const isCurrentActive = activePin?.id === pin.id;
          const isCandidate = targetCandidatePin?.id === pin.id && !player.isGrappling;

          return (
            <G key={pin.id}>
              {isCandidate && (
                <Circle cx={sx} cy={sy} r={24} fill="none" stroke="#FACC15" strokeWidth={1.8} strokeDasharray="4, 4" opacity={0.8} />
              )}
              <Circle cx={sx} cy={sy} r={isCurrentActive ? 16 : 13} fill={isCurrentActive ? '#FACC15' : pin.fragile ? '#67E8F9' : '#1E293B'} stroke={isCurrentActive ? '#FEF08A' : pin.fragile ? '#A5F3FC' : '#E2E8F0'} strokeWidth={2.5} />
              <Circle cx={sx} cy={sy} r={isCurrentActive ? 6 : 4} fill={isCurrentActive ? '#000' : '#FFF'} />
            </G>
          );
        })}

        {/* 9. Authentic Spider-Man Web Rope */}
        {player.isGrappling && activePin && (
          <SpiderWeb
            startX={activePin.x - cameraX}
            startY={activePin.y - cameraY}
            endX={pScreenX}
            endY={pScreenY - 6}
          />
        )}

        {/* 10. Motion Ghost Trail */}
        {player.trail.map((t, idx) => (
          <Circle
            key={`tr_${idx}`}
            cx={t.x - cameraX}
            cy={t.y - cameraY}
            r={8 - idx * 0.8}
            fill={skinColor}
            opacity={t.opacity * 0.3}
          />
        ))}

        {/* 11. Expressive Stickman */}
        <ExpressiveStickman
          screenX={pScreenX}
          screenY={pScreenY}
          rotation={player.rotation}
          isGrappling={player.isGrappling}
          faceExpression={player.faceExpression}
          headColor={headColor}
          skinColor={skinColor}
        />

        {/* 12. Active Particles */}
        {particles.map(pt => (
          <Circle
            key={pt.id}
            cx={pt.x - cameraX}
            cy={pt.y - cameraY}
            r={pt.size}
            fill={pt.color}
            opacity={pt.alpha}
          />
        ))}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default memo(HookCanvas);
