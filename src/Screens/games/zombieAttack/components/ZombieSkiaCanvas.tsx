// ─────────────────────────────────────────────────────────────────────────────
//  ZombieSkiaCanvas.tsx
//  Hardware-Accelerated 60–120 FPS Direct GPU Canvas (Shopify Skia)
//  Bypasses React Native Virtual DOM & Native Bridge for Zombie Attack Game
// ─────────────────────────────────────────────────────────────────────────────

import React, { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import {
  Canvas,
  Circle,
  Line,
  Rect,
  RoundedRect,
  Group,
  Path,
  LinearGradient,
  vec,
} from '@shopify/react-native-skia';

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
} from '../types/gameTypes';

export interface ZombieSkiaCanvasProps {
  cameraX: number;
  viewWidth: number;
  viewHeight: number;
  screenWidth: number;
  screenHeight: number;
  currentLevel: LevelConfig;
  aimAngle: number;
  pullDistance: number;
  isAiming: boolean;
  selectedArrowType: ArrowType;
  isVictorious: boolean;
  isDefeated: boolean;
  nearestZombieDist: number;
  trajectory: TrajectoryPoint[];
  arrows: ArrowEntity[];
  zombies: ZombieEntity[];
  obstacles: ObstacleEntity[];
  movingPlatforms: MovingPlatformEntity[];
  particles: ParticleEntity[];
  floatTexts: FloatText[];
}

const WEATHER_PALETTES: Record<string, {
  skyTop: string;
  skyMid: string;
  skyBot: string;
  ground: string;
  grass: string;
  mountainFar: string;
  mountainMid: string;
  mountainNear: string;
  sunColor: string;
  sunGlow: string;
}> = {
  // Levels 1-10: Bright clear daylight sun & lush green alpine mountains
  clear: {
    skyTop: '#0284C7',
    skyMid: '#38BDF8',
    skyBot: '#BAE6FD',
    ground: '#334155',
    grass: '#22C55E',
    mountainFar: '#0369A1',
    mountainMid: '#047857',
    mountainNear: '#15803D',
    sunColor: '#FACC15',
    sunGlow: '#F59E0B',
  },
  // Levels 11-20: Dark night with radiant silver moon, dark slate mountains & stars
  night_moon: {
    skyTop: '#020617',
    skyMid: '#0F172A',
    skyBot: '#1E1B4B',
    ground: '#1E293B',
    grass: '#15803D',
    mountainFar: '#080E1A',
    mountainMid: '#0F172A',
    mountainNear: '#1E293B',
    sunColor: '#F8FAFC',
    sunGlow: '#94A3B8',
  },
  // Levels 21-30: Sickly emerald toxic moon & biohazard wasteland
  toxic: {
    skyTop: '#022C22',
    skyMid: '#064E3B',
    skyBot: '#065F46',
    ground: '#1C1917',
    grass: '#10B981',
    mountainFar: '#02140F',
    mountainMid: '#042E23',
    mountainNear: '#074534',
    sunColor: '#34D399',
    sunGlow: '#059669',
  },
  // Levels 31-40: Stormy tempest rain & wet basalt peaks
  rain: {
    skyTop: '#060B14',
    skyMid: '#0F172A',
    skyBot: '#1E293B',
    ground: '#1E293B',
    grass: '#15803D',
    mountainFar: '#080E18',
    mountainMid: '#0F1724',
    mountainNear: '#162032',
    sunColor: '#94A3B8',
    sunGlow: '#475569',
  },
  // Snow / Arctic
  snow: {
    skyTop: '#0B132B',
    skyMid: '#1C2541',
    skyBot: '#2D4059',
    ground: '#475569',
    grass: '#F1F5F9',
    mountainFar: '#0A1124',
    mountainMid: '#141E36',
    mountainNear: '#23314D',
    sunColor: '#F8FAFC',
    sunGlow: '#93C5FD',
  },
  // Flying laser enemies or Levels 41-50: Apocalyptic hellfire blood sun & orange lava veins
  hellfire: {
    skyTop: '#1A0303',
    skyMid: '#450A0A',
    skyBot: '#7F1D1D',
    ground: '#292524',
    grass: '#DC2626',
    mountainFar: '#1A0303',
    mountainMid: '#330806',
    mountainNear: '#4D0E09',
    sunColor: '#F97316',
    sunGlow: '#EF4444',
  },
};

export const ZombieSkiaCanvas: React.FC<ZombieSkiaCanvasProps> = ({
  cameraX,
  viewWidth,
  viewHeight,
  screenWidth,
  screenHeight,
  currentLevel,
  aimAngle,
  pullDistance,
  isAiming,
  selectedArrowType,
  isVictorious,
  isDefeated,
  nearestZombieDist,
  trajectory,
  arrows,
  zombies,
  obstacles,
  movingPlatforms,
  particles,
  floatTexts,
}) => {
  const scaleRatio = screenHeight / Math.max(1, viewHeight);
  const weather = currentLevel.weather || 'clear';
  const palette = WEATHER_PALETTES[weather] || WEATHER_PALETTES.clear;

  // Culling view bounds (in world coordinates)
  const viewMinX = cameraX - 80;
  const viewMaxX = cameraX + viewWidth + 80;

  // Aiming math for Player Archer
  const leanBackX = isAiming ? -pullDistance * 6 : 0;
  const leanBackY = isAiming ? pullDistance * 1.5 : 0;
  const hipX = currentLevel.playerPos.x + leanBackX;
  const hipY = currentLevel.playerPos.y + 18 + leanBackY;
  const bowX = currentLevel.playerPos.x + 22;
  const bowY = currentLevel.playerPos.y - 4;

  // Player Archer Situational Face & Gear State
  const isScared = nearestZombieDist < 170 && !isVictorious && !isDefeated;
  const headX = currentLevel.playerPos.x + leanBackX;
  const headY = currentLevel.playerPos.y - 20 + leanBackY * 0.4;

  const themeTrajectoryColor = selectedArrowType === 'ice' ? '#06B6D4' : selectedArrowType === 'splitter' ? '#10B981' : '#38BDF8';
  const targetPoint = isAiming && trajectory.length > 2 ? trajectory[trajectory.length - 1] : null;

  return (
    <Canvas style={styles.canvas} pointerEvents="none">
      <Group
        transform={[
          { scale: scaleRatio },
          { translateX: -cameraX },
        ]}
      >
        {/* ── 1. REALISTIC SKY & DISTANT CELESTIAL ENVIRONMENT ───────────── */}
        {/* Layer 1: Seamless Ultra-Clean Sky Atmosphere Gradient (Zero Blocky Bands) */}
        <Rect
          x={cameraX - 40}
          y={0}
          width={viewWidth + 80}
          height={viewHeight}
        >
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, viewHeight)}
            colors={[palette.skyTop, palette.skyMid, palette.skyBot]}
          />
        </Rect>

        {/* Distant Stars for Dark Night Moon Theme */}
        {weather === 'night_moon' && (
          <Group opacity={0.75}>
            {[
              [cameraX + 40, 25], [cameraX + 110, 45], [cameraX + 190, 20], [cameraX + 270, 60],
              [cameraX + 340, 30], [cameraX + 420, 50], [cameraX + 510, 22], [cameraX + 600, 40],
              [cameraX + 680, 18], [cameraX + 760, 55], [cameraX + 850, 28], [cameraX + 930, 48],
            ].map(([sx, sy], i) => (
              <Circle key={`star_${i}`} cx={sx} cy={sy} r={i % 2 === 0 ? 1.6 : 1.1} color="#F8FAFC" />
            ))}
          </Group>
        )}

        {/* Dynamic Celestial Body: Strictly Segregated by Level Theme */}
        <Group opacity={0.95}>
          {weather === 'hellfire' ? (
            /* ── HELLFIRE ECLIPSED BLOOD SUN & CORONA PROMINENCES ── */
            <Group>
              {/* Outer Blazing Prominences / Flares */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => {
                const rad = (deg * Math.PI) / 180;
                const cx = cameraX + viewWidth * 0.78;
                const cy = viewHeight * 0.22;
                return (
                  <Line
                    key={`flare_${deg}`}
                    p1={vec(cx + Math.cos(rad) * 22, cy + Math.sin(rad) * 22)}
                    p2={vec(cx + Math.cos(rad) * (34 + (deg % 20)), cy + Math.sin(rad) * (34 + (deg % 20)))}
                    color="#F59E0B"
                    strokeWidth={2.4}
                    style="stroke"
                    opacity={0.7}
                  />
                );
              })}
              {/* Molten Glow Halo */}
              <Circle cx={cameraX + viewWidth * 0.78} cy={viewHeight * 0.22} r={32} color="#DC2626" opacity={0.3} />
              <Circle cx={cameraX + viewWidth * 0.78} cy={viewHeight * 0.22} r={24} color="#EA580C" opacity={0.6} />
              {/* Dark Eclipsing Obsidian Disc */}
              <Circle cx={cameraX + viewWidth * 0.78} cy={viewHeight * 0.22} r={20} color="#180303" />
              {/* Burning Molten Ring on Rim */}
              <Circle cx={cameraX + viewWidth * 0.78} cy={viewHeight * 0.22} r={20} color="#F97316" style="stroke" strokeWidth={2} />
            </Group>
          ) : weather === 'clear' ? (
            /* ── REALISTIC BRIGHT DAYTIME SUN & WARM SOLAR RAYS ── */
            <Group>
              {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
                const rad = (deg * Math.PI) / 180;
                const cx = cameraX + viewWidth * 0.78;
                const cy = viewHeight * 0.22;
                return (
                  <Line
                    key={`sunray_${deg}`}
                    p1={vec(cx + Math.cos(rad) * 25, cy + Math.sin(rad) * 25)}
                    p2={vec(cx + Math.cos(rad) * 38, cy + Math.sin(rad) * 38)}
                    color="#FEF08A"
                    strokeWidth={2}
                    style="stroke"
                    opacity={0.65}
                  />
                );
              })}
              <Circle cx={cameraX + viewWidth * 0.78} cy={viewHeight * 0.22} r={46} color={palette.sunGlow} opacity={0.2} />
              <Circle cx={cameraX + viewWidth * 0.78} cy={viewHeight * 0.22} r={32} color={palette.sunGlow} opacity={0.35} />
              <Circle cx={cameraX + viewWidth * 0.78} cy={viewHeight * 0.22} r={22} color={palette.sunColor} />
              <Circle cx={cameraX + viewWidth * 0.78} cy={viewHeight * 0.22} r={16} color="#FFFBEB" opacity={0.9} />
            </Group>
          ) : weather === 'night_moon' ? (
            /* ── RADIANT FULL SILVER MOON (CLEAN, LUMINOUS & SEAMLESS) ── */
            <Group>
              {/* Soft Ethereal Silver Atmosphere Aura */}
              <Circle cx={cameraX + viewWidth * 0.78} cy={viewHeight * 0.22} r={34} color="#94A3B8" opacity={0.18} />
              {/* Luminous Silver Moon Disc */}
              <Circle cx={cameraX + viewWidth * 0.78} cy={viewHeight * 0.22} r={22} color="#F8FAFC" />
              <Circle cx={cameraX + viewWidth * 0.78} cy={viewHeight * 0.22} r={22} color="#E2E8F0" style="stroke" strokeWidth={1} opacity={0.5} />
              {/* Clean Subtle Lunar Craters */}
              <Circle cx={cameraX + viewWidth * 0.78 - 6} cy={viewHeight * 0.22 - 3} r={3.2} color="#CBD5E1" opacity={0.4} />
              <Circle cx={cameraX + viewWidth * 0.78 + 5} cy={viewHeight * 0.22 + 4} r={2.4} color="#CBD5E1" opacity={0.4} />
              <Circle cx={cameraX + viewWidth * 0.78 - 1} cy={viewHeight * 0.22 + 7} r={1.8} color="#CBD5E1" opacity={0.35} />
            </Group>
          ) : weather === 'snow' ? (
            /* ── ARCTIC ALPINE WINTER MOON & ICY HALO ── */
            <Group>
              <Circle cx={cameraX + viewWidth * 0.78} cy={viewHeight * 0.22} r={38} color="#93C5FD" opacity={0.18} />
              <Circle cx={cameraX + viewWidth * 0.78} cy={viewHeight * 0.22} r={26} color="#BAE6FD" opacity={0.3} />
              <Circle cx={cameraX + viewWidth * 0.78} cy={viewHeight * 0.22} r={20} color="#F8FAFC" />
              {/* Craters */}
              <Circle cx={cameraX + viewWidth * 0.78 - 6} cy={viewHeight * 0.22 - 3} r={4} color="#CBD5E1" opacity={0.4} />
              <Circle cx={cameraX + viewWidth * 0.78 + 5} cy={viewHeight * 0.22 + 4} r={3} color="#CBD5E1" opacity={0.4} />
            </Group>
          ) : weather === 'toxic' ? (
            /* ── BIOHAZARD TOXIC EMERALD MOON ── */
            <Group>
              <Circle cx={cameraX + viewWidth * 0.78} cy={viewHeight * 0.22} r={40} color="#059669" opacity={0.16} />
              <Circle cx={cameraX + viewWidth * 0.78} cy={viewHeight * 0.22} r={26} color="#10B981" opacity={0.28} />
              <Circle cx={cameraX + viewWidth * 0.78} cy={viewHeight * 0.22} r={20} color="#34D399" />
              <Circle cx={cameraX + viewWidth * 0.78 - 5} cy={viewHeight * 0.22 - 4} r={4} color="#064E3B" opacity={0.35} />
            </Group>
          ) : (
            /* ── STORMY TEMPEST RAIN MOON ── */
            <Group>
              <Circle cx={cameraX + viewWidth * 0.78} cy={viewHeight * 0.22} r={30} color="#64748B" opacity={0.2} />
              <Circle cx={cameraX + viewWidth * 0.78} cy={viewHeight * 0.22} r={20} color="#94A3B8" />
            </Group>
          )}
        </Group>

        {/* ── REALISTIC PARALLAX MOUNTAINS & RIDGES ───────────────────────── */}
        {/* Tier 1: Distant Towering Jagged Mountain Massifs */}
        <Group opacity={0.35}>
          {[-120, 180, 480, 780, 1080, 1380, 1680, 1980].map((mx, idx) => (
            <Group key={`mnt1_${idx}`}>
              {/* Mountain Face */}
              <Path
                path={`M ${mx} ${viewHeight} L ${mx + 110} ${viewHeight - 230} L ${mx + 220} ${viewHeight - 160} L ${mx + 330} ${viewHeight} Z`}
                color={palette.mountainFar}
              />
              {/* Shaded Ridge Facet */}
              <Path
                path={`M ${mx + 110} ${viewHeight - 230} L ${mx + 220} ${viewHeight - 160} L ${mx + 330} ${viewHeight} L ${mx + 150} ${viewHeight} Z`}
                color="#000000"
                opacity={0.3}
              />
              {/* Snowcap on summits for snow weather */}
              {weather === 'snow' && (
                <Path
                  path={`M ${mx + 90} ${viewHeight - 190} L ${mx + 110} ${viewHeight - 230} L ${mx + 140} ${viewHeight - 205} Z`}
                  color="#F8FAFC"
                  opacity={0.9}
                />
              )}
            </Group>
          ))}
        </Group>

        {/* Tier 2: Mid-Range Rocky Ridges & Lava Veins */}
        <Group opacity={0.55}>
          {[-80, 220, 520, 820, 1120, 1420, 1720, 2020].map((mx, idx) => (
            <Group key={`mnt2_${idx}`}>
              <Path
                path={`M ${mx} ${viewHeight} L ${mx + 80} ${viewHeight - 150} L ${mx + 150} ${viewHeight - 110} L ${mx + 250} ${viewHeight} Z`}
                color={palette.mountainMid}
              />
              {/* Shaded Side */}
              <Path
                path={`M ${mx + 80} ${viewHeight - 150} L ${mx + 150} ${viewHeight - 110} L ${mx + 250} ${viewHeight} L ${mx + 120} ${viewHeight} Z`}
                color="#000000"
                opacity={0.25}
              />
              {/* Glowing Lava River Cascades in Hellfire */}
              {weather === 'hellfire' && (
                <Path
                  path={`M ${mx + 80} ${viewHeight - 150} Q ${mx + 95} ${viewHeight - 90} ${mx + 130} ${viewHeight}`}
                  color="#F97316"
                  style="stroke"
                  strokeWidth={2}
                  opacity={0.8}
                />
              )}
            </Group>
          ))}
        </Group>

        {/* Tier 3: Fore Horizon Ridge (Pines, Dead Trees & Ancient Ruins) */}
        <Group opacity={0.75}>
          {[-40, 120, 280, 440, 600, 760, 920, 1080, 1240, 1400, 1560, 1720, 1880, 2040].map((tx, idx) => (
            <Group key={`tree_${idx}`}>
              {/* Pine Tree Silhouette */}
              <Path
                path={`M ${tx} ${viewHeight - 35} L ${tx + 12} ${viewHeight - 95} L ${tx + 24} ${viewHeight - 35} Z`}
                color={palette.mountainNear}
              />
              <Path
                path={`M ${tx + 2} ${viewHeight - 60} L ${tx + 12} ${viewHeight - 112} L ${tx + 22} ${viewHeight - 60} Z`}
                color={palette.mountainNear}
              />
              <Line p1={vec(tx + 12, viewHeight - 35)} p2={vec(tx + 12, viewHeight - 20)} color="#1C1917" strokeWidth={2.5} style="stroke" />
            </Group>
          ))}
        </Group>

        {/* Dynamic Weather Streaks (Rain / Hellfire Embers) */}
        {weather === 'rain' && (
          <Group opacity={0.4}>
            {[30, 90, 160, 240, 310, 400, 480, 560, 640, 720, 800, 880, 960, 1050, 1140, 1230, 1320, 1410].map((rx, idx) => (
              <Line
                key={`rain_${idx}`}
                p1={vec(cameraX + rx, (idx * 28) % viewHeight)}
                p2={vec(cameraX + rx - 8, ((idx * 28) % viewHeight) + 18)}
                color="#7DD3FC"
                strokeWidth={1.2}
                style="stroke"
              />
            ))}
          </Group>
        )}

        {/* Horizon Atmospheric Mist Band */}
        <Rect
          x={cameraX - 40}
          y={viewHeight - 60}
          width={viewWidth + 80}
          height={60}
          color="#0F172A"
          opacity={0.22}
        />

        {/* ── 2. STATIC TERRAIN & PLATFORMS ───────────────────────────────── */}
        {currentLevel.platforms.map(p => {
          if (p.type === 'moving') return null;
          const left = p.x - p.width / 2;
          const top = p.y - p.height / 2;
          if (left + p.width < viewMinX || left > viewMaxX) return null;

          return (
            <Group key={p.id}>
              {/* Rock Body with Stratified Deep Texture */}
              <Rect
                x={left}
                y={top}
                width={p.width}
                height={p.height}
                color={palette.ground}
              />
              {/* Sub-layer Soil Depth */}
              <Rect
                x={left}
                y={top + 6}
                width={p.width}
                height={4}
                color="#1C1917"
                opacity={0.4}
              />
              {/* Lush Organic Grass Cap */}
              <Rect
                x={left}
                y={top}
                width={p.width}
                height={7}
                color={palette.grass}
              />
              {/* Highlight Bevel on Grass Edge */}
              <Line
                p1={vec(left, top)}
                p2={vec(left + p.width, top)}
                color="#86EFAC"
                strokeWidth={1.2}
                opacity={0.5}
                style="stroke"
              />
            </Group>
          );
        })}

        {/* ── 3. MOVING PLATFORMS ─────────────────────────────────────────── */}
        {movingPlatforms.map(mp => {
          const left = mp.body.position.x - mp.width / 2;
          const top = mp.body.position.y - mp.height / 2;
          if (left + mp.width < viewMinX || left > viewMaxX) return null;

          return (
            <Group key={`mp_${mp.id}`}>
              <RoundedRect
                x={left}
                y={top}
                width={mp.width}
                height={mp.height}
                r={4}
                color="#334155"
              />
              {/* Caution Hazard Trim */}
              <Line
                p1={vec(left + 6, top + 3)}
                p2={vec(left + mp.width - 6, top + 3)}
                color="#FACC15"
                strokeWidth={2.4}
                style="stroke"
              />
            </Group>
          );
        })}

        {/* ── 4. DYNAMIC OBSTACLES (CRATES & BARRELS) ──────────────────────── */}
        {obstacles.map(obs => {
          if (obs.health <= 0 || (obs.isTriggered && obs.type === 'crate') || (obs.isOpen && obs.type === 'gate')) return null;
          const left = obs.body.position.x - obs.width / 2;
          const top = obs.body.position.y - obs.height / 2;
          if (left + obs.width < viewMinX || left > viewMaxX) return null;

          const rot = obs.body.angle;

          return (
            <Group
              key={`obs_${obs.id}`}
              transform={[
                { translateX: obs.body.position.x },
                { translateY: obs.body.position.y },
                { rotate: rot },
              ]}
            >
              {obs.type === 'crate' || obs.type === 'hanging_crate' ? (
                <Group>
                  <Rect
                    x={-obs.width / 2}
                    y={-obs.height / 2}
                    width={obs.width}
                    height={obs.height}
                    color="#78350F"
                  />
                  <Rect
                    x={-obs.width / 2 + 2}
                    y={-obs.height / 2 + 2}
                    width={obs.width - 4}
                    height={obs.height - 4}
                    color="#92400E"
                  />
                  {/* Metal Corner Brackets */}
                  <Rect x={-obs.width / 2} y={-obs.height / 2} width={5} height={5} color="#451A03" />
                  <Rect x={obs.width / 2 - 5} y={-obs.height / 2} width={5} height={5} color="#451A03" />
                  <Rect x={-obs.width / 2} y={obs.height / 2 - 5} width={5} height={5} color="#451A03" />
                  <Rect x={obs.width / 2 - 5} y={obs.height / 2 - 5} width={5} height={5} color="#451A03" />
                  <Line
                    p1={vec(-obs.width / 2, -obs.height / 2)}
                    p2={vec(obs.width / 2, obs.height / 2)}
                    color="#451A03"
                    strokeWidth={2}
                    style="stroke"
                  />
                  <Line
                    p1={vec(obs.width / 2, -obs.height / 2)}
                    p2={vec(-obs.width / 2, obs.height / 2)}
                    color="#451A03"
                    strokeWidth={2}
                    style="stroke"
                  />
                </Group>
              ) : obs.type === 'tnt' ? (
                <Group>
                  <RoundedRect
                    x={-obs.width / 2}
                    y={-obs.height / 2}
                    width={obs.width}
                    height={obs.height}
                    r={5}
                    color="#DC2626"
                  />
                  {/* Warning Hazardous Stripes */}
                  <Line
                    p1={vec(-obs.width / 2 + 2, -4)}
                    p2={vec(obs.width / 2 - 2, -4)}
                    color="#FACC15"
                    strokeWidth={3}
                    style="stroke"
                  />
                  <Line
                    p1={vec(-obs.width / 2 + 2, 4)}
                    p2={vec(obs.width / 2 - 2, 4)}
                    color="#18181B"
                    strokeWidth={2}
                    style="stroke"
                  />
                  <Circle cx={0} cy={0} r={5} color="#18181B" />
                  <Circle cx={0} cy={0} r={2.8} color="#FACC15" />
                </Group>
              ) : obs.type === 'boulder' ? (
                /* Rolling Stone Boulder with chiseled rock fissures */
                <Group>
                  <Circle cx={0} cy={0} r={obs.width / 2} color="#334155" />
                  <Circle cx={-3} cy={-3} r={obs.width / 2 - 3} color="#475569" />
                  <Circle cx={-5} cy={-5} r={obs.width / 2 - 8} color="#64748B" opacity={0.6} />
                  {/* Rotating Cracks / Fissures */}
                  <Line p1={vec(-obs.width * 0.28, -obs.width * 0.15)} p2={vec(obs.width * 0.2, obs.width * 0.25)} color="#1E293B" strokeWidth={2.4} style="stroke" />
                  <Line p1={vec(-obs.width * 0.1, obs.width * 0.25)} p2={vec(obs.width * 0.25, -obs.width * 0.2)} color="#1E293B" strokeWidth={1.8} style="stroke" />
                  <Circle cx={obs.width * 0.15} cy={-obs.width * 0.15} r={3} color="#1E293B" />
                </Group>
              ) : obs.type === 'ricochet_mirror' ? (
                /* High-Tech Crystal Ricochet Mirror */
                <Group>
                  <RoundedRect
                    x={-obs.width / 2}
                    y={-obs.height / 2}
                    width={obs.width}
                    height={obs.height}
                    r={3}
                    color="#0369A1"
                  />
                  <Rect
                    x={-obs.width / 2 + 2}
                    y={-obs.height / 2 + 2}
                    width={obs.width - 4}
                    height={obs.height - 4}
                    color="#38BDF8"
                    opacity={0.88}
                  />
                  {/* Gleaming Reflection Slashes */}
                  <Line
                    p1={vec(-obs.width / 2 + 3, obs.height / 2 - 5)}
                    p2={vec(obs.width / 2 - 3, -obs.height / 2 + 5)}
                    color="#FFFFFF"
                    strokeWidth={2}
                    style="stroke"
                  />
                  <Line
                    p1={vec(-obs.width / 2 + 3, obs.height / 2 - 12)}
                    p2={vec(obs.width / 2 - 3, -obs.height / 2 - 2)}
                    color="#BAE6FD"
                    strokeWidth={1.2}
                    style="stroke"
                  />
                </Group>
              ) : obs.type === 'acid_barrel' ? (
                /* Toxic Biohazard Acid Barrel */
                <Group>
                  <RoundedRect
                    x={-obs.width / 2}
                    y={-obs.height / 2}
                    width={obs.width}
                    height={obs.height}
                    r={4}
                    color="#14532D"
                  />
                  <Rect
                    x={-obs.width / 2 + 2}
                    y={-obs.height / 2 + 2}
                    width={obs.width - 4}
                    height={obs.height - 4}
                    color="#166534"
                  />
                  <Line
                    p1={vec(-obs.width / 2 + 2, -obs.height * 0.2)}
                    p2={vec(obs.width / 2 - 2, -obs.height * 0.2)}
                    color="#14532D"
                    strokeWidth={2}
                    style="stroke"
                  />
                  <Line
                    p1={vec(-obs.width / 2 + 2, obs.height * 0.2)}
                    p2={vec(obs.width / 2 - 2, obs.height * 0.2)}
                    color="#14532D"
                    strokeWidth={2}
                    style="stroke"
                  />
                  <Circle cx={0} cy={0} r={6} color="#FACC15" />
                  <Circle cx={0} cy={0} r={3} color="#14532D" />
                </Group>
              ) : (
                <Group>
                  <RoundedRect
                    x={-obs.width / 2}
                    y={-obs.height / 2}
                    width={obs.width}
                    height={obs.height}
                    r={3}
                    color="#475569"
                  />
                </Group>
              )}
            </Group>
          );
        })}

        {/* ── 5. PLAYER ARCHER HERO (REALISTIC GEAR & SITUATIONAL FACES) ───── */}
        <Group>
          {/* Ground Contact Shadow */}
          <Circle
            cx={currentLevel.playerPos.x + leanBackX * 0.3}
            cy={currentLevel.playerPos.y + 48}
            r={18}
            color="#000000"
            opacity={0.3}
          />

          {/* Reinforced Boots & Legs */}
          <Line
            p1={vec(hipX, hipY)}
            p2={vec(currentLevel.playerPos.x - 14 + leanBackX * 0.3, currentLevel.playerPos.y + 48)}
            color="#0F172A"
            strokeWidth={4.5}
            strokeCap="round"
            style="stroke"
          />
          <Line
            p1={vec(hipX, hipY)}
            p2={vec(currentLevel.playerPos.x + 14, currentLevel.playerPos.y + 48)}
            color="#0F172A"
            strokeWidth={4.5}
            strokeCap="round"
            style="stroke"
          />
          {/* Leather Boots Foot Base */}
          <Line
            p1={vec(currentLevel.playerPos.x - 20 + leanBackX * 0.3, currentLevel.playerPos.y + 48)}
            p2={vec(currentLevel.playerPos.x - 11 + leanBackX * 0.3, currentLevel.playerPos.y + 48)}
            color="#78350F"
            strokeWidth={4}
            strokeCap="round"
            style="stroke"
          />
          <Line
            p1={vec(currentLevel.playerPos.x + 11, currentLevel.playerPos.y + 48)}
            p2={vec(currentLevel.playerPos.x + 20, currentLevel.playerPos.y + 48)}
            color="#78350F"
            strokeWidth={4}
            strokeCap="round"
            style="stroke"
          />

          {/* Spine & Archer Leather Tunic */}
          <Line
            p1={vec(hipX, hipY)}
            p2={vec(currentLevel.playerPos.x + leanBackX, currentLevel.playerPos.y - 8)}
            color="#14532D"
            strokeWidth={6.5}
            strokeCap="round"
            style="stroke"
          />
          {/* Golden Belt Buckle */}
          <Circle cx={hipX} cy={hipY - 4} r={2.5} color="#FACC15" />

          {/* Archer Quiver on Back */}
          <Rect
            x={currentLevel.playerPos.x + leanBackX - 11}
            y={currentLevel.playerPos.y - 14}
            width={8}
            height={20}
            color="#78350F"
          />
          {/* Arrows with Red Fletching Feathers in Quiver */}
          <Line
            p1={vec(currentLevel.playerPos.x + leanBackX - 9, currentLevel.playerPos.y - 14)}
            p2={vec(currentLevel.playerPos.x + leanBackX - 13, currentLevel.playerPos.y - 22)}
            color="#EF4444"
            strokeWidth={2}
            strokeCap="round"
            style="stroke"
          />
          <Line
            p1={vec(currentLevel.playerPos.x + leanBackX - 6, currentLevel.playerPos.y - 14)}
            p2={vec(currentLevel.playerPos.x + leanBackX - 9, currentLevel.playerPos.y - 20)}
            color="#FBBF24"
            strokeWidth={1.8}
            strokeCap="round"
            style="stroke"
          />

          {/* Head & Situational Facial Expressions */}
          <Circle
            cx={headX}
            cy={headY}
            r={11}
            color="#FCD34D"
          />
          {/* Archer Headband */}
          <Line
            p1={vec(headX - 10, headY - 3)}
            p2={vec(headX + 10, headY - 3)}
            color="#EF4444"
            strokeWidth={3.2}
            strokeCap="round"
            style="stroke"
          />
          {/* Flowing Headband Ribbon Tails */}
          <Path
            path={`M ${headX - 9} ${headY - 3} Q ${headX - 18} ${headY - 7} ${headX - 25} ${headY - 2}`}
            color="#EF4444"
            style="stroke"
            strokeWidth={2.4}
            strokeCap="round"
          />
          <Path
            path={`M ${headX - 9} ${headY - 1} Q ${headX - 16} ${headY + 3} ${headX - 22} ${headY + 8}`}
            color="#DC2626"
            style="stroke"
            strokeWidth={1.8}
            strokeCap="round"
          />

          {/* Dynamic Situational Expressions */}
          {isDefeated ? (
            /* 1. DEFEATED: Knocked-Out X-Eyes & Sorrowful Dazed Grimace */
            <Group>
              <Line p1={vec(headX - 1, headY - 3)} p2={vec(headX + 3, headY + 1)} color="#000000" strokeWidth={1.8} strokeCap="round" style="stroke" />
              <Line p1={vec(headX + 3, headY - 3)} p2={vec(headX - 1, headY + 1)} color="#000000" strokeWidth={1.8} strokeCap="round" style="stroke" />
              <Line p1={vec(headX + 5, headY - 3)} p2={vec(headX + 9, headY + 1)} color="#000000" strokeWidth={1.8} strokeCap="round" style="stroke" />
              <Line p1={vec(headX + 9, headY - 3)} p2={vec(headX + 5, headY + 1)} color="#000000" strokeWidth={1.8} strokeCap="round" style="stroke" />
              <Path path={`M ${headX + 1} ${headY + 5} Q ${headX + 4} ${headY + 2} ${headX + 7} ${headY + 5}`} color="#000000" style="stroke" strokeWidth={1.8} strokeCap="round" />
              <Circle cx={headX + 4} cy={headY - 14} r={3} color="#CBD5E1" style="stroke" strokeWidth={1.2} />
            </Group>
          ) : isVictorious ? (
            /* 2. VICTORIOUS: Joyful Arched Eyes, Golden Smile & Cheek Glints */
            <Group>
              <Path path={`M ${headX + 1} ${headY - 1} Q ${headX + 3.5} ${headY - 4} ${headX + 6} ${headY - 1}`} color="#000000" style="stroke" strokeWidth={2} strokeCap="round" />
              <Path path={`M ${headX + 6.5} ${headY - 1} Q ${headX + 9} ${headY - 4} ${headX + 11.5} ${headY - 1}`} color="#000000" style="stroke" strokeWidth={2} strokeCap="round" />
              <Path path={`M ${headX + 2.5} ${headY + 3.5} Q ${headX + 6} ${headY + 7.5} ${headX + 9.5} ${headY + 3.5} Z`} color="#EF4444" />
              <Circle cx={headX + 1} cy={headY + 2} r={1.5} color="#F87171" opacity={0.6} />
              <Circle cx={headX + 10} cy={headY + 2} r={1.5} color="#F87171" opacity={0.6} />
            </Group>
          ) : isScared ? (
            /* 3. SCARED (Zombie < 170px): Dilated Panic Eyes, Gasping Mouth & Sweat Drop! */
            <Group>
              <Circle cx={headX + 3} cy={headY - 1} r={3} color="#FFFFFF" />
              <Circle cx={headX + 3} cy={headY - 1} r={1.3} color="#000000" />
              <Circle cx={headX + 8.5} cy={headY - 1} r={3} color="#FFFFFF" />
              <Circle cx={headX + 8.5} cy={headY - 1} r={1.3} color="#000000" />
              <Line p1={vec(headX + 1, headY - 5)} p2={vec(headX + 5, headY - 6)} color="#000000" strokeWidth={1.5} style="stroke" />
              <Line p1={vec(headX + 7, headY - 6)} p2={vec(headX + 11, headY - 5)} color="#000000" strokeWidth={1.5} style="stroke" />
              <Circle cx={headX + 6} cy={headY + 5} r={2.5} color="#000000" />
              <Circle cx={headX + 11.5} cy={headY - 4} r={1.8} color="#38BDF8" />
              <Line p1={vec(headX + 11.5, headY - 6)} p2={vec(headX + 11.5, headY - 3)} color="#0284C7" strokeWidth={1.2} style="stroke" />
            </Group>
          ) : isAiming ? (
            /* 4. AIMING / SNIPER: Left Squint Eye, Right Dominant Focusing Eye with Glint & Gritted Teeth */
            <Group>
              <Line p1={vec(headX + 0.5, headY - 1)} p2={vec(headX + 3.5, headY - 1)} color="#000000" strokeWidth={2} strokeCap="round" style="stroke" />
              <Circle cx={headX + 6.5} cy={headY - 1.2} r={2.4} color="#000000" />
              <Circle cx={headX + 7.2} cy={headY - 1.8} r={0.9} color="#FFFFFF" />
              <Line p1={vec(headX + 1, headY - 4.5)} p2={vec(headX + 9, headY - 3.2)} color="#0F172A" strokeWidth={2} strokeCap="round" style="stroke" />
              <Line p1={vec(headX + 3.5, headY + 4.5)} p2={vec(headX + 8.5, headY + 4.5)} color="#000000" strokeWidth={2} strokeCap="round" style="stroke" />
              <Line p1={vec(headX + 5.5, headY + 3.5)} p2={vec(headX + 5.5, headY + 5.5)} color="#000000" strokeWidth={1.2} style="stroke" />
              <Line p1={vec(headX + 7, headY + 3.5)} p2={vec(headX + 7, headY + 5.5)} color="#000000" strokeWidth={1.2} style="stroke" />
            </Group>
          ) : (
            /* 5. IDLE / READY: Alert Warrior Gaze with Pupil Glint & Confident Smirk */
            <Group>
              <Circle cx={headX + 5} cy={headY - 1.5} r={2} color="#000000" />
              <Circle cx={headX + 5.6} cy={headY - 2} r={0.7} color="#FFFFFF" />
              <Line p1={vec(headX + 2, headY - 4.5)} p2={vec(headX + 8, headY - 4)} color="#0F172A" strokeWidth={1.6} strokeCap="round" style="stroke" />
              <Path path={`M ${headX + 3} ${headY + 4.5} Q ${headX + 6} ${headY + 6.5} ${headX + 8} ${headY + 4}`} color="#000000" style="stroke" strokeWidth={1.8} strokeCap="round" />
            </Group>
          )}

          {/* ── VISIBLE PLAYER ARMS & HANDS (ARCHER STANCE) ───────── */}
          {(() => {
            const shoulderX = currentLevel.playerPos.x + leanBackX;
            const shoulderY = currentLevel.playerPos.y - 10 + leanBackY * 0.4;

            /* Archery Stance: Left Bow Arm + Right String Draw Arm */
            const bowElbowX = shoulderX + (bowX - shoulderX) * 0.48;
            const bowElbowY = shoulderY + (bowY - shoulderY) * 0.48 + 3;

            const pullLen = isAiming ? pullDistance * 20 : 0;
            const drawNockX = isAiming ? bowX + Math.cos(aimAngle) * (-pullLen) : shoulderX - 2;
            const drawNockY = isAiming ? bowY + Math.sin(aimAngle) * (-pullLen) : shoulderY + 16;

            const drawElbowX = isAiming ? shoulderX - 10 - pullDistance * 10 : shoulderX - 8;
            const drawElbowY = isAiming ? shoulderY - 4 - pullDistance * 4 : shoulderY + 8;

            return (
              <Group>
                {/* ── Left Bow Arm & Hand Grasping Handle ── */}
                <Line p1={vec(shoulderX, shoulderY)} p2={vec(bowElbowX, bowElbowY)} color="#0F172A" strokeWidth={4.2} strokeCap="round" style="stroke" />
                <Line p1={vec(bowElbowX, bowElbowY)} p2={vec(bowX, bowY)} color="#0F172A" strokeWidth={3.8} strokeCap="round" style="stroke" />
                {/* Leather Archer Vambrace / Bracer */}
                <Line
                  p1={vec(bowElbowX + (bowX - bowElbowX) * 0.2, bowElbowY + (bowY - bowElbowY) * 0.2)}
                  p2={vec(bowElbowX + (bowX - bowElbowX) * 0.8, bowElbowY + (bowY - bowElbowY) * 0.8)}
                  color="#78350F"
                  strokeWidth={5}
                  strokeCap="round"
                  style="stroke"
                />
                {/* Left Hand firmly grasping the wooden bow handle */}
                <Circle cx={bowX} cy={bowY} r={3.4} color="#FCD34D" />
                <Line p1={vec(bowX - 2.5, bowY - 3)} p2={vec(bowX + 2.5, bowY - 3)} color="#0F172A" strokeWidth={2} strokeCap="round" style="stroke" />

                {/* ── Right Draw Arm & Hand Pulling String / Arrow Nock ── */}
                <Line p1={vec(shoulderX, shoulderY)} p2={vec(drawElbowX, drawElbowY)} color="#0F172A" strokeWidth={4.2} strokeCap="round" style="stroke" />
                <Line p1={vec(drawElbowX, drawElbowY)} p2={vec(drawNockX, drawNockY)} color="#0F172A" strokeWidth={3.8} strokeCap="round" style="stroke" />
                {/* Draw Hand fingers hooked on bowstring */}
                <Circle cx={drawNockX} cy={drawNockY} r={3.4} color="#FCD34D" />
                {isAiming && (
                  <Line p1={vec(drawNockX - 2, drawNockY - 2.5)} p2={vec(drawNockX + 2, drawNockY - 2.5)} color="#78350F" strokeWidth={2.2} strokeCap="round" style="stroke" />
                )}
              </Group>
            );
          })()}

          {/* Aiming Bow & Arrow */}
          <Group
            transform={[
              { translateX: bowX },
              { translateY: bowY },
              { rotate: aimAngle },
            ]}
          >
            {/* Wooden Recurve Bow Frame */}
            <Path
              path="M -4 -24 Q 18 0 -4 24"
              color="#B45309"
              style="stroke"
              strokeWidth={3.5}
              strokeCap="round"
            />
            {/* Taut Bowstring Pulled Back */}
            {isAiming ? (
              <Group>
                <Line
                  p1={vec(-4, -24)}
                  p2={vec(-pullDistance * 20, 0)}
                  color="#FFFFFF"
                  strokeWidth={1.5}
                  style="stroke"
                />
                <Line
                  p1={vec(-pullDistance * 20, 0)}
                  p2={vec(-4, 24)}
                  color="#FFFFFF"
                  strokeWidth={1.5}
                  style="stroke"
                />
                {/* Arrow Nocked on String */}
                <Line
                  p1={vec(-pullDistance * 20, 0)}
                  p2={vec(18, 0)}
                  color="#FBBF24"
                  strokeWidth={2.4}
                  style="stroke"
                />
                {/* Arrowhead */}
                <Path
                  path="M 16 -3 L 22 0 L 16 3 Z"
                  color="#CBD5E1"
                />
              </Group>
            ) : (
              <Line
                p1={vec(-4, -24)}
                p2={vec(-4, 24)}
                color="#FFFFFF"
                strokeWidth={1.2}
                style="stroke"
              />
            )}
          </Group>
        </Group>

        {/* ── 6. DYNAMIC ANIMATED ZOMBIE CHARACTERS (CLEAN REALISTIC KINEMATICS) ─ */}
        {zombies.map(z => {
          if (z.health <= 0) return null;
          const zx = z.body.position.x;
          const zy = z.body.position.y;
          if (zx < viewMinX - 40 || zx > viewMaxX + 40) return null;

          const isFrozen = !!z.isFrozen;
          const isBurning = !!z.isBurning;
          const isHitFlash = z.hitFlashTimer > 0;
          const isShield = z.type === 'shield';
          const isWraith = z.type === 'wraith';

          const skinColor = isFrozen
            ? '#BAE6FD'
            : isBurning
            ? '#F97316'
            : isHitFlash
            ? '#FFFFFF'
            : isWraith
            ? '#C084FC'
            : '#84CC16';
          const shirtColor = isFrozen
            ? '#0284C7'
            : isBurning
            ? '#7C2D12'
            : isHitFlash
            ? '#E2E8F0'
            : isWraith
            ? '#581C87'
            : '#334155';
          const scaleX = z.facingLeft ? -1 : 1;

          const isGiant = z.type === 'giant';
          const isBoss = z.type === 'boss';
          const isArmored = z.type === 'armored';
          const isRunner = z.type === 'runner';
          const isFlying = z.type === 'flying';
          const headR = isBoss ? 22 : isGiant ? 18 : 12;
          const torsoH = isBoss ? 38 : isGiant ? 30 : 22;

          const isWalking = z.state === 'walk' && !isFrozen;
          const isAttacking = z.state === 'attack' && !isFrozen;
          const isClimbing = z.state === 'climb' && !isFrozen;

          // Realistic bipedal gait: pelvic bob and forward spine hunch
          const walkBob = isWalking ? Math.abs(Math.sin(z.walkCycle)) * 2.8 : 0;
          const hipY = 4 - walkBob;
          const spineLean = isAttacking ? 10 : isRunner ? 8 : 4;

          // Leg 1 (Front Leg) - 2-segment thigh and shin with bending knee
          const thigh1 = isClimbing ? Math.sin(z.walkCycle * 2) * 0.45 : isWalking ? Math.sin(z.walkCycle) * (isRunner ? 0.65 : 0.45) : isAttacking ? 0.2 : 0;
          const knee1X = Math.sin(thigh1) * 11;
          const knee1Y = hipY + Math.cos(thigh1) * 11;
          const shin1 = thigh1 - (isWalking ? 0.28 : 0);
          const foot1X = knee1X + Math.sin(shin1) * 11;
          const foot1Y = Math.min(22, knee1Y + Math.cos(shin1) * 11);

          // Leg 2 (Back Leg) - Opposite stride
          const thigh2 = isClimbing ? -Math.sin(z.walkCycle * 2) * 0.45 : isWalking ? -Math.sin(z.walkCycle) * (isRunner ? 0.65 : 0.45) : isAttacking ? -0.2 : 0;
          const knee2X = Math.sin(thigh2) * 11;
          const knee2Y = hipY + Math.cos(thigh2) * 11;
          const shin2 = thigh2 - (isWalking ? 0.28 : 0);
          const foot2X = knee2X + Math.sin(shin2) * 11;
          const foot2Y = Math.min(22, knee2Y + Math.cos(shin2) * 11);

          // Articulated Arms (Shoulder -> Elbow -> Wrist -> Claws)
          const shoulderY = -torsoH * 0.85;
          const armCycle = Math.sin(z.walkCycle);

          const elbow1X = spineLean + 8 + (isAttacking ? 6 : armCycle * 2);
          const elbow1Y = shoulderY + (isAttacking ? -4 : armCycle * 3);
          const hand1X = spineLean + 17 + (isAttacking ? 8 : armCycle * 3);
          const hand1Y = shoulderY + (isAttacking ? -6 : 3 + armCycle * 2);

          const elbow2X = spineLean + 6 + (isAttacking ? 4 : -armCycle * 2);
          const elbow2Y = shoulderY + (isAttacking ? -2 : -armCycle * 3);
          const hand2X = spineLean + 15 + (isAttacking ? 6 : -armCycle * 3);
          const hand2Y = shoulderY + (isAttacking ? -4 : 5 - armCycle * 2);

          const hpPercent = Math.max(0, Math.min(1, z.health / z.maxHealth));

          return (
            <Group
              key={`z_${z.id}`}
              transform={[
                { translateX: zx },
                { translateY: zy },
                { scaleX },
              ]}
            >
              {/* ── Dynamic Animated Bat / Cyber Wings for Flying Zombie ── */}
              {isFlying && (
                <Group transform={[{ translateY: -torsoH * 0.55 }]}>
                  {/* Back Wing */}
                  <Group transform={[{ rotate: -Math.sin(z.walkCycle * 4) * 0.35 }]}>
                    <Path
                      path="M -4 0 Q -24 -24 -38 -10 Q -26 4 -4 4 Z"
                      color="#334155"
                      opacity={0.8}
                    />
                  </Group>
                  {/* Front Wing */}
                  <Group transform={[{ rotate: Math.sin(z.walkCycle * 4) * 0.4 }]}>
                    <Path
                      path="M 2 0 Q -20 -28 -36 -14 Q -22 6 2 4 Z"
                      color="#475569"
                    />
                    <Path path="M 2 0 L -36 -14" color="#EF4444" style="stroke" strokeWidth={1.4} opacity={0.85} />
                  </Group>
                </Group>
              )}

              {/* ── Realistic Walking Legs vs Airborne Cyber Talons (NO Dark Circles, Organic Limbs) ── */}
              {!isFlying ? (
                <Group>
                  {/* Leg 1 (Front 2-Segment Articulated Leg) */}
                  <Line p1={vec(0, hipY)} p2={vec(knee1X, knee1Y)} color="#1E293B" strokeWidth={isBoss ? 5 : 3.8} strokeCap="round" style="stroke" />
                  <Line p1={vec(knee1X, knee1Y)} p2={vec(foot1X, foot1Y)} color="#1E293B" strokeWidth={isBoss ? 4.8 : 3.6} strokeCap="round" style="stroke" />
                  <Line p1={vec(foot1X - 2.5, foot1Y)} p2={vec(foot1X + 3.5, foot1Y)} color="#0F172A" strokeWidth={3} strokeCap="round" style="stroke" />

                  {/* Leg 2 (Back 2-Segment Articulated Leg) */}
                  <Line p1={vec(0, hipY)} p2={vec(knee2X, knee2Y)} color="#1E293B" strokeWidth={isBoss ? 5 : 3.8} strokeCap="round" style="stroke" />
                  <Line p1={vec(knee2X, knee2Y)} p2={vec(foot2X, foot2Y)} color="#1E293B" strokeWidth={isBoss ? 4.8 : 3.6} strokeCap="round" style="stroke" />
                  <Line p1={vec(foot2X - 2.5, foot2Y)} p2={vec(foot2X + 3.5, foot2Y)} color="#0F172A" strokeWidth={3} strokeCap="round" style="stroke" />
                </Group>
              ) : (
                /* Airborne Tucked Claws for Flying Zombie */
                <Group>
                  <Line p1={vec(-2, hipY)} p2={vec(-6, hipY + 8)} color="#1E293B" strokeWidth={3.5} strokeCap="round" style="stroke" />
                  <Line p1={vec(-6, hipY + 8)} p2={vec(-10, hipY + 12)} color="#0F172A" strokeWidth={3} strokeCap="round" style="stroke" />
                  <Line p1={vec(2, hipY)} p2={vec(4, hipY + 8)} color="#1E293B" strokeWidth={3.5} strokeCap="round" style="stroke" />
                  <Line p1={vec(4, hipY + 8)} p2={vec(8, hipY + 12)} color="#0F172A" strokeWidth={3} strokeCap="round" style="stroke" />
                </Group>
              )}

              {/* Torso & Ragged Undead Shirt */}
              <Line
                p1={vec(0, hipY)}
                p2={vec(spineLean, -torsoH)}
                color={shirtColor}
                strokeWidth={isBoss ? 8 : 5.5}
                strokeCap="round"
                style="stroke"
              />
              {/* Armor Breastplate for Armored Zombie */}
              {isArmored && (
                <RoundedRect
                  x={spineLean - 6}
                  y={-torsoH * 0.85}
                  width={12}
                  height={torsoH * 0.75}
                  r={2}
                  color="#64748B"
                />
              )}

              {/* ── Articulated Arms & Reaching Claws ── */}
              <Line p1={vec(spineLean, shoulderY)} p2={vec(elbow1X, elbow1Y)} color={skinColor} strokeWidth={isBoss ? 4 : 3.2} strokeCap="round" style="stroke" />
              <Line p1={vec(elbow1X, elbow1Y)} p2={vec(hand1X, hand1Y)} color={skinColor} strokeWidth={isBoss ? 3.8 : 3} strokeCap="round" style="stroke" />
              <Circle cx={hand1X} cy={hand1Y} r={2.5} color={skinColor} />
              <Line p1={vec(hand1X, hand1Y)} p2={vec(hand1X + 3.5, hand1Y - 1)} color="#0F172A" strokeWidth={1.8} strokeCap="round" style="stroke" />

              <Line p1={vec(spineLean, shoulderY)} p2={vec(elbow2X, elbow2Y)} color={skinColor} strokeWidth={isBoss ? 4 : 3.2} strokeCap="round" style="stroke" />
              <Line p1={vec(elbow2X, elbow2Y)} p2={vec(hand2X, hand2Y)} color={skinColor} strokeWidth={isBoss ? 3.8 : 3} strokeCap="round" style="stroke" />
              <Circle cx={hand2X} cy={hand2Y} r={2.5} color={skinColor} />
              <Line p1={vec(hand2X, hand2Y)} p2={vec(hand2X + 3.5, hand2Y - 1)} color="#0F172A" strokeWidth={1.8} strokeCap="round" style="stroke" />

              {/* Undead Head */}
              <Circle
                cx={spineLean + 2}
                cy={-torsoH - headR}
                r={headR}
                color={skinColor}
              />
              {/* Sunken Dark Eye Sockets */}
              <Circle
                cx={spineLean + (isBoss ? 6 : 4.5)}
                cy={-torsoH - headR - 1}
                r={isBoss ? 4.5 : 3}
                color="#020617"
              />
              {/* Glowing Fiery Red/Amber Undead Eye with Evil Glint or Cyber Laser Eye */}
              <Circle
                cx={spineLean + (isBoss ? 6 : 4.5)}
                cy={-torsoH - headR - 1}
                r={isBoss ? 2.6 : isFlying ? 2.8 : 1.7}
                color={isFlying ? '#EF4444' : isBurning ? '#FDE047' : '#EF4444'}
              />
              <Circle
                cx={spineLean + (isBoss ? 7 : 5.2)}
                cy={-torsoH - headR - 1.5}
                r={0.7}
                color="#FFFFFF"
              />
              {isFlying && (
                <Circle
                  cx={spineLean + 4.5}
                  cy={-torsoH - headR - 1}
                  r={4.2}
                  color="#EF4444"
                  style="stroke"
                  strokeWidth={1}
                  opacity={0.8}
                />
              )}

              {/* Gaping Decaying Undead Jaw with Yellow Teeth */}
              <Path
                path={`M ${spineLean} ${-torsoH - headR + 4} L ${spineLean + 7} ${-torsoH - headR + 4} L ${spineLean + 5} ${-torsoH - headR + 8} L ${spineLean} ${-torsoH - headR + 7} Z`}
                color="#020617"
              />
              <Line
                p1={vec(spineLean + 2, -torsoH - headR + 4)}
                p2={vec(spineLean + 3, -torsoH - headR + 6.5)}
                color="#FEF08A"
                strokeWidth={1.4}
                style="stroke"
              />
              <Line
                p1={vec(spineLean + 5, -torsoH - headR + 4)}
                p2={vec(spineLean + 6, -torsoH - headR + 6.5)}
                color="#FEF08A"
                strokeWidth={1.4}
                style="stroke"
              />

              {/* Armored Helmet */}
              {isArmored && (
                <Path
                  path={`M ${spineLean - headR * 0.8} ${-torsoH - headR} Q ${spineLean + 2} ${-torsoH - headR - headR * 1.3} ${spineLean + headR * 1.2} ${-torsoH - headR} Z`}
                  color="#475569"
                />
              )}

              {/* Boss Spikes / Crown */}
              {isBoss && (
                <Path
                  path={`M ${spineLean - 8} ${-torsoH - headR - 14} L ${spineLean} ${-torsoH - headR - 22} L ${spineLean + 8} ${-torsoH - headR - 14} Z`}
                  color="#FACC15"
                />
              )}

              {/* Ballistic Riot Shield in Front of Shield Zombie */}
              {isShield && !z.armorLost && (
                <Group>
                  <RoundedRect
                    x={spineLean + 10}
                    y={-torsoH - 10}
                    width={9}
                    height={torsoH + 28}
                    r={3}
                    color="#334155"
                  />
                  <RoundedRect
                    x={spineLean + 11}
                    y={-torsoH - 9}
                    width={7}
                    height={torsoH + 26}
                    r={2}
                    color="#475569"
                  />
                  {/* Observation Viewing Slit */}
                  <Rect
                    x={spineLean + 12}
                    y={-torsoH - 2}
                    width={5}
                    height={3}
                    color="#94A3B8"
                  />
                  {/* Warning Yellow / Black Diagonal Stripes */}
                  <Line
                    p1={vec(spineLean + 11, -torsoH + 8)}
                    p2={vec(spineLean + 18, -torsoH + 8)}
                    color="#FACC15"
                    strokeWidth={2.5}
                    style="stroke"
                  />
                  <Line
                    p1={vec(spineLean + 11, -torsoH + 14)}
                    p2={vec(spineLean + 18, -torsoH + 14)}
                    color="#1E293B"
                    strokeWidth={2}
                    style="stroke"
                  />
                </Group>
              )}

              {/* Wraith Shadow Smoke Aura & Piercing Eyes */}
              {isWraith && (
                <Group opacity={0.6}>
                  <Circle cx={spineLean + 2} cy={-torsoH * 0.5} r={18} color="#C084FC" />
                  <Circle cx={spineLean + 4} cy={-torsoH * 0.5} r={12} color="#A855F7" />
                </Group>
              )}

              {/* Electric Shock Reaction Sparks */}
              {z.isShocked && (
                <Group>
                  <Line p1={vec(-10, -10)} p2={vec(-3, -2)} color="#38BDF8" strokeWidth={2} style="stroke" />
                  <Line p1={vec(-3, -2)} p2={vec(7, -8)} color="#C084FC" strokeWidth={2} style="stroke" />
                  <Line p1={vec(7, -8)} p2={vec(12, 2)} color="#FACC15" strokeWidth={2} style="stroke" />
                </Group>
              )}

              {/* Overhead Health Bar */}
              <Group transform={[{ scaleX }]}>
                <Rect
                  x={-18}
                  y={-torsoH - headR - 14}
                  width={36}
                  height={5}
                  color="#0F172A"
                />
                <Rect
                  x={-17}
                  y={-torsoH - headR - 13.5}
                  width={34 * hpPercent}
                  height={4}
                  color={hpPercent > 0.4 ? '#22C55E' : '#EF4444'}
                />
              </Group>
            </Group>
          );
        })}

        {/* ── 7. PROJECTILES (ARROWS IN FLIGHT) ────────────────────────────── */}
        {arrows.map(arrow => {
          if (!arrow.inFlight) return null;
          const ax = arrow.body.position.x;
          const ay = arrow.body.position.y;
          if (ax < viewMinX - 30 || ax > viewMaxX + 30) return null;
          const rot = arrow.body.angle;

          return (
            <Group
              key={`arrow_${arrow.id}`}
              transform={[
                { translateX: ax },
                { translateY: ay },
                { rotate: rot },
              ]}
            >
              {/* Arrow Shaft */}
              <Line
                p1={vec(-22, 0)}
                p2={vec(10, 0)}
                color="#FBBF24"
                strokeWidth={2.4}
                style="stroke"
              />
              {/* Fletching Feathers at Nock */}
              <Line
                p1={vec(-20, -3)}
                p2={vec(-14, 0)}
                color="#EF4444"
                strokeWidth={2}
                style="stroke"
              />
              <Line
                p1={vec(-20, 3)}
                p2={vec(-14, 0)}
                color="#EF4444"
                strokeWidth={2}
                style="stroke"
              />
              {/* Arrow Head (Ice, Splitter, or Steel) */}
              {arrow.arrowType === 'ice' ? (
                <Group>
                  <Path path="M 8 -5 L 18 0 L 8 5 Z" color="#0284C7" />
                  <Path path="M 10 -3 L 16 0 L 10 3 Z" color="#BAE6FD" />
                  <Circle cx={18} cy={0} r={2} color="#FFFFFF" />
                </Group>
              ) : arrow.arrowType === 'splitter' ? (
                <Group>
                  <Path path="M 7 -6 L 16 0 L 7 6 Z" color="#047857" />
                  <Path path="M 9 -4 L 15 0 L 9 4 Z" color="#34D399" />
                </Group>
              ) : (
                <Path
                  path="M 8 -4 L 16 0 L 8 4 Z"
                  color="#CBD5E1"
                />
              )}
            </Group>
          );
        })}

        {/* ── 8. AIMING TRAJECTORY & TARGETING CROSSHAIR ───────────────────── */}
        {isAiming && trajectory.length > 1 && (
          <Group>
            {trajectory.map((pt, i) => {
              if (i % 2 !== 0) return null;
              return (
                <Circle
                  key={`tr_${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={pt.isTargetingZombie ? 3.5 : 2.2}
                  color={pt.isTargetingZombie ? '#EF4444' : themeTrajectoryColor}
                  opacity={0.8}
                />
              );
            })}

            {/* Glowing Crosshair Reticle at Predicted Impact */}
            {targetPoint && (
              <Group>
                <Circle
                  cx={targetPoint.x}
                  cy={targetPoint.y}
                  r={12}
                  color={targetPoint.isTargetingZombie ? '#EF4444' : themeTrajectoryColor}
                  style="stroke"
                  strokeWidth={2}
                  opacity={0.85}
                />
                <Circle
                  cx={targetPoint.x}
                  cy={targetPoint.y}
                  r={3}
                  color={targetPoint.isTargetingZombie ? '#EF4444' : themeTrajectoryColor}
                />
              </Group>
            )}
          </Group>
        )}

        {/* ── 9. COMBAT PARTICLES (BLOOD, WOOD SPLINTERS, SPARKS) ─────────── */}
        {particles.map(p => {
          if (p.life <= 0) return null;
          return (
            <Circle
              key={`pt_${p.id}`}
              cx={p.x}
              cy={p.y}
              r={p.size}
              color={p.color}
              opacity={p.life}
            />
          );
        })}

        {/* ── 10. FLOATING COMBAT TEXT BADGES ─────────────────────────────── */}
        {floatTexts.map(ft => {
          if (ft.opacity <= 0) return null;
          return (
            <Group
              key={`ft_${ft.id}`}
              transform={[{ translateX: ft.x }, { translateY: ft.y }]}
              opacity={ft.opacity}
            >
              <RoundedRect
                x={-45}
                y={-12}
                width={90}
                height={24}
                r={12}
                color="rgba(15, 23, 42, 0.88)"
              />
              <RoundedRect
                x={-45}
                y={-12}
                width={90}
                height={24}
                r={12}
                color={ft.color}
                style="stroke"
                strokeWidth={1.5}
              />
            </Group>
          );
        })}
      </Group>
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default memo(ZombieSkiaCanvas);
