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

const WEATHER_PALETTES = {
  clear: { skyTop: '#090D16', skyBot: '#1E293B', ground: '#334155', grass: '#22C55E' },
  rain: { skyTop: '#0F172A', skyBot: '#1E293B', ground: '#1E293B', grass: '#15803D' },
  snow: { skyTop: '#1E293B', skyBot: '#38BDF8', ground: '#475569', grass: '#F1F5F9' },
  hellfire: { skyTop: '#450A0A', skyBot: '#7F1D1D', ground: '#292524', grass: '#DC2626' },
  toxic: { skyTop: '#064E3B', skyBot: '#047857', ground: '#1C1917', grass: '#10B981' },
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
  const isBomb = selectedArrowType === 'bomb';
  const leanBackMult = isBomb ? 8 : 6;
  const leanBackX = isAiming ? -pullDistance * leanBackMult : 0;
  const leanBackY = isAiming ? pullDistance * (isBomb ? 2.2 : 1.5) : 0;
  const hipX = currentLevel.playerPos.x + leanBackX;
  const hipY = currentLevel.playerPos.y + 18 + leanBackY;
  const bowX = currentLevel.playerPos.x + 22;
  const bowY = currentLevel.playerPos.y - 4;

  // Player Archer Situational Face & Gear State
  const isScared = nearestZombieDist < 170 && !isVictorious && !isDefeated;
  const headX = currentLevel.playerPos.x + leanBackX;
  const headY = currentLevel.playerPos.y - 20 + leanBackY * 0.4;

  const themeTrajectoryColor = selectedArrowType === 'bomb' ? '#FACC15' : '#38BDF8';
  const targetPoint = isAiming && trajectory.length > 2 ? trajectory[trajectory.length - 1] : null;

  return (
    <Canvas style={styles.canvas} pointerEvents="none">
      <Group
        transform={[
          { scale: scaleRatio },
          { translateX: -cameraX },
        ]}
      >
        {/* ── 1. SKY & DISTANT MOUNTAINS BACKGROUND ───────────────────────── */}
        <Rect
          x={cameraX - 40}
          y={0}
          width={viewWidth + 80}
          height={viewHeight}
          color={palette.skyTop}
        />
        <Rect
          x={cameraX - 40}
          y={viewHeight * 0.40}
          width={viewWidth + 80}
          height={viewHeight * 0.60}
          color={palette.skyBot}
          opacity={0.7}
        />

        {/* Luminous Apocalypse Celestial Body (Moon / Blood Moon / Toxic Sun) */}
        <Group opacity={0.88}>
          <Circle
            cx={cameraX + viewWidth * 0.78}
            cy={viewHeight * 0.22}
            r={38}
            color={weather === 'hellfire' ? '#EF4444' : weather === 'toxic' ? '#10B981' : '#E2E8F0'}
            opacity={0.12}
          />
          <Circle
            cx={cameraX + viewWidth * 0.78}
            cy={viewHeight * 0.22}
            r={28}
            color={weather === 'hellfire' ? '#F97316' : weather === 'toxic' ? '#34D399' : '#F1F5F9'}
            opacity={0.24}
          />
          <Circle
            cx={cameraX + viewWidth * 0.78}
            cy={viewHeight * 0.22}
            r={20}
            color={weather === 'hellfire' ? '#DC2626' : weather === 'toxic' ? '#059669' : '#F8FAFC'}
          />
          {/* Craters */}
          <Circle cx={cameraX + viewWidth * 0.78 - 5} cy={viewHeight * 0.22 - 3} r={4.5} color="#000000" opacity={0.16} />
          <Circle cx={cameraX + viewWidth * 0.78 + 5} cy={viewHeight * 0.22 + 4} r={3.2} color="#000000" opacity={0.16} />
        </Group>

        {/* Parallax Tier 1: Distant Towering Mountain Silhouettes */}
        <Group opacity={0.18}>
          {[-120, 180, 480, 780, 1080, 1380, 1680, 1980].map((mx, idx) => (
            <Path
              key={`mnt1_${idx}`}
              path={`M ${mx} ${viewHeight} L ${mx + 110} ${viewHeight - 240} L ${mx + 220} ${viewHeight - 170} L ${mx + 330} ${viewHeight} Z`}
              color="#020617"
            />
          ))}
        </Group>

        {/* Parallax Tier 2: Mid-Range Rocky Ridges */}
        <Group opacity={0.34}>
          {[-80, 220, 520, 820, 1120, 1420, 1720, 2020].map((mx, idx) => (
            <Path
              key={`mnt2_${idx}`}
              path={`M ${mx} ${viewHeight} L ${mx + 90} ${viewHeight - 165} L ${mx + 160} ${viewHeight - 130} L ${mx + 260} ${viewHeight} Z`}
              color="#0F172A"
            />
          ))}
        </Group>

        {/* Parallax Tier 3: Near Pine Trees & Ruin Silhouettes along Ridge */}
        <Group opacity={0.52}>
          {[-40, 120, 280, 440, 600, 760, 920, 1080, 1240, 1400, 1560, 1720, 1880, 2040].map((tx, idx) => (
            <Group key={`tree_${idx}`}>
              {/* Pine Tree Silhouette */}
              <Path
                path={`M ${tx} ${viewHeight - 40} L ${tx + 12} ${viewHeight - 100} L ${tx + 24} ${viewHeight - 40} Z`}
                color="#0F172A"
              />
              <Path
                path={`M ${tx + 2} ${viewHeight - 65} L ${tx + 12} ${viewHeight - 118} L ${tx + 22} ${viewHeight - 65} Z`}
                color="#0F172A"
              />
            </Group>
          ))}
        </Group>

        {/* Horizon Atmospheric Mist Band */}
        <Rect
          x={cameraX - 40}
          y={viewHeight - 65}
          width={viewWidth + 80}
          height={65}
          color="#0F172A"
          opacity={0.16}
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
                  path={selectedArrowType === 'bomb' ? "M 14 -4 L 22 0 L 14 4 Z" : "M 16 -3 L 22 0 L 16 3 Z"}
                  color={selectedArrowType === 'bomb' ? "#EF4444" : "#CBD5E1"}
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

        {/* ── 6. DYNAMIC ANIMATED ZOMBIE CHARACTERS (GROTESQUE UNDEAD REALISM) ─ */}
        {zombies.map(z => {
          if (z.health <= 0) return null;
          const zx = z.body.position.x;
          const zy = z.body.position.y;
          if (zx < viewMinX - 40 || zx > viewMaxX + 40) return null;

          const isFrozen = !!z.isFrozen;
          const isBurning = !!z.isBurning;
          const isHitFlash = z.hitFlashTimer > 0;

          const skinColor = isFrozen ? '#BAE6FD' : isBurning ? '#F97316' : isHitFlash ? '#FFFFFF' : '#84CC16';
          const shirtColor = isFrozen ? '#0284C7' : isBurning ? '#7C2D12' : isHitFlash ? '#E2E8F0' : '#334155';
          const scaleX = z.facingLeft ? -1 : 1;

          const isGiant = z.type === 'giant';
          const isBoss = z.type === 'boss';
          const isArmored = z.type === 'armored';
          const isRunner = z.type === 'runner';
          const headR = isBoss ? 22 : isGiant ? 18 : 12;
          const torsoH = isBoss ? 38 : isGiant ? 30 : 22;

          const isWalking = z.state === 'walk' && !isFrozen;
          const isAttacking = z.state === 'attack' && !isFrozen;
          const legA1 = isWalking ? Math.sin(z.walkCycle) * (isRunner ? 32 : 22) : isAttacking ? Math.sin(Date.now() * 0.01) * 14 : 0;
          const legA2 = isWalking ? -Math.sin(z.walkCycle) * (isRunner ? 32 : 22) : isAttacking ? -Math.sin(Date.now() * 0.01) * 14 : 0;

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
              {/* Zombie Ground Shadow */}
              <Circle cx={0} cy={22} r={isBoss ? 24 : 14} color="#000000" opacity={0.28} />

              {/* Legs with torn trousers */}
              <Line
                p1={vec(0, 4)}
                p2={vec(legA1 * 0.5 - 6, 22)}
                color="#1E293B"
                strokeWidth={isBoss ? 5 : 3.8}
                strokeCap="round"
                style="stroke"
              />
              <Line
                p1={vec(0, 4)}
                p2={vec(legA2 * 0.5 + 6, 22)}
                color="#1E293B"
                strokeWidth={isBoss ? 5 : 3.8}
                strokeCap="round"
                style="stroke"
              />
              {/* Exposed Undead Knee Bone */}
              <Circle cx={legA1 * 0.25 - 3} cy={13} r={1.6} color="#E2E8F0" />

              {/* Torso & Ragged Undead Shirt */}
              <Line
                p1={vec(0, 4)}
                p2={vec(0, -torsoH)}
                color={shirtColor}
                strokeWidth={isBoss ? 8 : 5.5}
                strokeCap="round"
                style="stroke"
              />
              {/* Armor Breastplate for Armored Zombie */}
              {isArmored && (
                <RoundedRect
                  x={-6}
                  y={-torsoH * 0.85}
                  width={12}
                  height={torsoH * 0.75}
                  r={2}
                  color="#64748B"
                />
              )}

              {/* Ragged Claws / Arms reaching forward aggressively */}
              <Line
                p1={vec(0, -torsoH * 0.75)}
                p2={vec(16, -torsoH * 0.65)}
                color={skinColor}
                strokeWidth={isBoss ? 4.2 : 3.2}
                strokeCap="round"
                style="stroke"
              />
              <Line
                p1={vec(0, -torsoH * 0.65)}
                p2={vec(14, -torsoH * 0.55)}
                color={skinColor}
                strokeWidth={isBoss ? 4.2 : 3.2}
                strokeCap="round"
                style="stroke"
              />
              {/* Sharp Claws at Fingertips */}
              <Line
                p1={vec(16, -torsoH * 0.65)}
                p2={vec(19, -torsoH * 0.65 - 1)}
                color="#1C1917"
                strokeWidth={1.8}
                style="stroke"
              />
              <Line
                p1={vec(14, -torsoH * 0.55)}
                p2={vec(17, -torsoH * 0.55 - 1)}
                color="#1C1917"
                strokeWidth={1.8}
                style="stroke"
              />

              {/* Undead Head */}
              <Circle
                cx={2}
                cy={-torsoH - headR}
                r={headR}
                color={skinColor}
              />
              {/* Sunken Dark Eye Sockets */}
              <Circle
                cx={isBoss ? 6 : 4.5}
                cy={-torsoH - headR - 1}
                r={isBoss ? 4.5 : 3}
                color="#020617"
              />
              {/* Glowing Fiery Red/Amber Undead Eye with Evil Glint */}
              <Circle
                cx={isBoss ? 6 : 4.5}
                cy={-torsoH - headR - 1}
                r={isBoss ? 2.6 : 1.7}
                color={isBurning ? '#FDE047' : '#EF4444'}
              />
              <Circle
                cx={isBoss ? 7 : 5.2}
                cy={-torsoH - headR - 1.5}
                r={0.7}
                color="#FFFFFF"
              />

              {/* Gaping Decaying Undead Jaw with Yellow Teeth */}
              <Path
                path={`M 0 ${-torsoH - headR + 4} L 7 ${-torsoH - headR + 4} L 5 ${-torsoH - headR + 8} L 0 ${-torsoH - headR + 7} Z`}
                color="#020617"
              />
              <Line
                p1={vec(2, -torsoH - headR + 4)}
                p2={vec(3, -torsoH - headR + 6.5)}
                color="#FEF08A"
                strokeWidth={1.4}
                style="stroke"
              />
              <Line
                p1={vec(5, -torsoH - headR + 4)}
                p2={vec(6, -torsoH - headR + 6.5)}
                color="#FEF08A"
                strokeWidth={1.4}
                style="stroke"
              />

              {/* Armored Helmet */}
              {isArmored && (
                <Path
                  path={`M ${-headR * 0.8} ${-torsoH - headR} Q 2 ${-torsoH - headR - headR * 1.3} ${headR * 1.2} ${-torsoH - headR} Z`}
                  color="#475569"
                />
              )}

              {/* Boss Spikes / Crown */}
              {isBoss && (
                <Path
                  path={`M -8 ${-torsoH - headR - 14} L 0 ${-torsoH - headR - 22} L 8 ${-torsoH - headR - 14} Z`}
                  color="#FACC15"
                />
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
              {/* Arrow Head (Bomb, Fire, or Steel) */}
              {arrow.arrowType === 'bomb' ? (
                <Group>
                  <Circle cx={12} cy={0} r={5} color="#000000" />
                  <Circle cx={12} cy={0} r={3.2} color="#EF4444" />
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
