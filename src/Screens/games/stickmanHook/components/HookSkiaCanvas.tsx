// ─────────────────────────────────────────────────────────────────────────────
//  HookSkiaCanvas.tsx
//  Hardware-Accelerated 60–120 FPS Direct GPU Canvas (Shopify Skia)
//  Bypasses React Native Virtual DOM & Native Bridge
// ─────────────────────────────────────────────────────────────────────────────

import React, { memo } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
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
  AnchorPin,
  Trampoline,
  SpeedRing,
  HazardSaw,
  WindVent,
  LaserGate,
  CollectibleStar,
  PortalGate,
  PowerUpItem,
  StickmanPlayer,
  Particle,
  BackgroundTheme,
} from '../types/stickmanHookTypes';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const THEME_PALETTES = {
  city_sunset: {
    skylineFar: '#1E1B4B',
    skylineMid: '#0F172A',
    windowColor: '#FDE047',
    hazeColor: '#F43F5E',
  },
  neon_skyway: {
    skylineFar: '#1E293B',
    skylineMid: '#0F172A',
    windowColor: '#38BDF8',
    hazeColor: '#06B6D4',
  },
  steampunk: {
    skylineFar: '#262626',
    skylineMid: '#171717',
    windowColor: '#F59E0B',
    hazeColor: '#D97706',
  },
  hazard_foundry: {
    skylineFar: '#1C1917',
    skylineMid: '#0A0A0A',
    windowColor: '#EF4444',
    hazeColor: '#DC2626',
  },
  cosmic_void: {
    skylineFar: '#0F172A',
    skylineMid: '#020617',
    windowColor: '#C084FC',
    hazeColor: '#7C3AED',
  },
};

interface HookSkiaCanvasProps {
  player: StickmanPlayer;
  pins: AnchorPin[];
  trampolines: Trampoline[];
  speedRings: SpeedRing[];
  hazards: HazardSaw[];
  windVents?: WindVent[];
  lasers?: LaserGate[];
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

export const HookSkiaCanvas: React.FC<HookSkiaCanvasProps> = ({
  player,
  pins,
  trampolines,
  speedRings,
  hazards,
  windVents = [],
  lasers = [],
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
  const p = THEME_PALETTES[theme] || THEME_PALETTES.city_sunset;
  const sWidth = screenWidth || SCREEN_WIDTH;
  const sHeight = screenHeight || SCREEN_HEIGHT;
  const viewMinX = cameraX - 60;
  const viewMaxX = cameraX + sWidth + 60;

  const pScreenX = player.x - cameraX;
  const pScreenY = player.y - cameraY;

  // Background Parallax Offsets
  const farOffset = (cameraX * -0.06) % (sWidth + 150);
  const midOffset = (cameraX * -0.15) % (sWidth + 200);

  // Rotation in Radians for Skia Group transform
  const rotationRad = (player.rotation * Math.PI) / 180;

  return (
    <Canvas style={styles.canvas} pointerEvents="none">
      {/* ── 1. HARDWARE-ACCELERATED PARALLAX SKYLINE ───────────────────────── */}
      <Group transform={[{ translateX: farOffset }]} opacity={0.35}>
        {[-100, 40, 180, 320, 460, 600, 740, 880, 1020].map((bx, i) => (
          <Group key={`f_${i}`}>
            <Rect x={bx} y={sHeight - 320} width={80} height={320} color={p.skylineFar} />
            <Line p1={vec(bx + 40, sHeight - 320)} p2={vec(bx + 40, sHeight - 355)} color="#64748B" strokeWidth={1.5} style="stroke" />
            <Circle cx={bx + 40} cy={sHeight - 355} r={2.5} color="#EF4444" />
          </Group>
        ))}
      </Group>

      <Group transform={[{ translateX: midOffset }]} opacity={0.65}>
        {[-80, 80, 240, 400, 560, 720, 880, 1040].map((bx, i) => {
          const topY = sHeight - 240;
          return (
            <Group key={`m_${i}`}>
              <Rect x={bx} y={topY} width={110} height={240} color={p.skylineMid} />
              <Rect x={bx + 15} y={topY - 14} width={16} height={14} color="#334155" />
              {[0, 1, 2, 3].map(row => (
                <Group key={`r_${row}`}>
                  <Rect x={bx + 20} y={topY + 25 + row * 26} width={14} height={15} color={p.windowColor} opacity={0.7} />
                  <Rect x={bx + 45} y={topY + 25 + row * 26} width={14} height={15} color={p.windowColor} opacity={0.4} />
                  <Rect x={bx + 70} y={topY + 25 + row * 26} width={14} height={15} color={p.windowColor} opacity={0.7} />
                </Group>
              ))}
            </Group>
          );
        })}
      </Group>

      {/* Horizon Fog Accent */}
      <Rect x={0} y={sHeight - 160} width={sWidth} height={160} color={p.hazeColor} opacity={0.07} />

      {/* ── 2. FINISH LINE ─────────────────────────────────────────────────── */}
      {finishX >= viewMinX && finishX <= viewMaxX && (
        <Group transform={[{ translateX: finishX - cameraX }]}>
          <Line p1={vec(0, 40)} p2={vec(0, sHeight - 60)} color="#FACC15" strokeWidth={3} opacity={0.75} style="stroke" />
          <Rect x={-15} y={90} width={30} height={40} color="#FACC15" />
          <Rect x={-10} y={95} width={10} height={10} color="#000" />
          <Rect x={0} y={95} width={10} height={10} color="#FFF" />
          <Rect x={-10} y={105} width={10} height={10} color="#FFF" />
          <Rect x={0} y={105} width={10} height={10} color="#000" />
          <Rect x={-10} y={115} width={10} height={10} color="#000" />
          <Rect x={0} y={115} width={10} height={10} color="#FFF" />
        </Group>
      )}

      {/* ── 3. WIND VENTS ───────────────────────────────────────────────────── */}
      {windVents.map(vent => {
        if (vent.x + vent.width < viewMinX || vent.x > viewMaxX) return null;
        return (
          <Rect
            key={vent.id}
            x={vent.x - cameraX}
            y={vent.y - cameraY}
            width={vent.width}
            height={vent.height}
            color="#38BDF8"
            opacity={0.35}
          />
        );
      })}

      {/* ── 4. LASER BEAMS ──────────────────────────────────────────────────── */}
      {lasers.map(laser => {
        if (!laser.active) return null;
        const lx = laser.x - cameraX;
        const ly = laser.y - cameraY;
        const isH = laser.orientation === 'horizontal';
        const p2 = isH ? vec(lx + laser.length, ly) : vec(lx, ly + laser.length);
        return (
          <Group key={laser.id}>
            <Line p1={vec(lx, ly)} p2={p2} color="#EF4444" strokeWidth={4} opacity={0.5} style="stroke" />
            <Line p1={vec(lx, ly)} p2={p2} color="#FCA5A5" strokeWidth={2} style="stroke" />
          </Group>
        );
      })}

      {/* ── 5. TRAMPOLINES ─────────────────────────────────────────────────── */}
      {trampolines.map(tramp => {
        if (tramp.x + tramp.width < viewMinX || tramp.x > viewMaxX) return null;
        const sx = tramp.x - cameraX;
        const sy = tramp.y - cameraY;
        const isSquashed = tramp.squashTime && Date.now() - tramp.squashTime < 130;
        const h = isSquashed ? tramp.height * 0.55 : tramp.height;
        const renderY = isSquashed ? sy + tramp.height * 0.45 : sy;
        const isSuper = tramp.superSpring;

        return (
          <Group key={tramp.id}>
            <Rect x={sx - 3} y={sy + tramp.height} width={tramp.width + 6} height={6} color={isSuper ? '#B45309' : '#1E293B'} />
            <RoundedRect x={sx} y={renderY} width={tramp.width} height={h} r={4} color={isSuper ? '#FACC15' : '#84CC16'} />
            <Line p1={vec(sx + 8, renderY + h / 2)} p2={vec(sx + tramp.width - 8, renderY + h / 2)} color="#FFFFFF" strokeWidth={2} opacity={0.85} style="stroke" />
          </Group>
        );
      })}

      {/* ── 5b. QUANTUM PORTAL WARP GATES ────────────────────────────────────── */}
      {portals.map(portal => {
        const inOnScreen = portal.inX >= viewMinX - 50 && portal.inX <= viewMaxX + 50;
        const outOnScreen = portal.outX >= viewMinX - 50 && portal.outX <= viewMaxX + 50;
        return (
          <Group key={portal.id}>
            {inOnScreen && (
              <Group>
                <Circle cx={portal.inX - cameraX} cy={portal.inY - cameraY} r={portal.radius + 6} color="#A855F7" opacity={0.3} />
                <Circle cx={portal.inX - cameraX} cy={portal.inY - cameraY} r={portal.radius} color="#7C3AED" style="stroke" strokeWidth={3} />
                <Circle cx={portal.inX - cameraX} cy={portal.inY - cameraY} r={portal.radius - 6} color="#C084FC" opacity={0.7} />
              </Group>
            )}
            {outOnScreen && (
              <Group>
                <Circle cx={portal.outX - cameraX} cy={portal.outY - cameraY} r={portal.radius + 6} color="#06B6D4" opacity={0.3} />
                <Circle cx={portal.outX - cameraX} cy={portal.outY - cameraY} r={portal.radius} color="#0891B2" style="stroke" strokeWidth={3} />
                <Circle cx={portal.outX - cameraX} cy={portal.outY - cameraY} r={portal.radius - 6} color="#38BDF8" opacity={0.7} />
              </Group>
            )}
          </Group>
        );
      })}

      {/* ── 5c. COLLECTIBLE STAR GEMS ───────────────────────────────────────── */}
      {stars.map(star => {
        if (star.collected) return null;
        if (star.x < viewMinX || star.x > viewMaxX) return null;
        const sx = star.x - cameraX;
        const sy = star.y - cameraY;
        return (
          <Group key={star.id}>
            <Circle cx={sx} cy={sy} r={16} color="#FDE047" opacity={0.25} />
            <Circle cx={sx} cy={sy} r={10} color="#FACC15" />
            <Circle cx={sx} cy={sy} r={4} color="#FFFFFF" />
          </Group>
        );
      })}

      {/* ── 5d. COLLECTIBLE TIMED POWER-UPS (JETPACK, SLOW-MO, SPEED, MAGNET) ── */}
      {powerUps.map(pu => {
        if (pu.collected) return null;
        if (pu.x < viewMinX || pu.x > viewMaxX) return null;
        const sx = pu.x - cameraX;
        const sy = pu.y - cameraY;
        const color =
          pu.type === 'jetpack'
            ? '#F97316'
            : pu.type === 'slow_mo'
            ? '#A855F7'
            : pu.type === 'speed_boost'
            ? '#FACC15'
            : '#10B981';

        return (
          <Group key={pu.id}>
            <Circle cx={sx} cy={sy} r={pu.radius + 6} color={color} opacity={0.25} />
            <Circle cx={sx} cy={sy} r={pu.radius} color={color} style="stroke" strokeWidth={2.5} />
            <Circle cx={sx} cy={sy} r={pu.radius - 5} color="#FFFFFF" opacity={0.85} />
            <Circle cx={sx} cy={sy} r={3} color={color} />
          </Group>
        );
      })}

      {/* ── 6. SPEED RINGS ─────────────────────────────────────────────────── */}
      {speedRings.map(ring => {
        if (ring.collected) return null;
        if (ring.x + ring.radius < viewMinX || ring.x - ring.radius > viewMaxX) return null;
        const rx = ring.x - cameraX;
        const ry = ring.y - cameraY;
        return (
          <Group key={ring.id}>
            <Circle cx={rx} cy={ry} r={ring.radius} color="#38BDF8" style="stroke" strokeWidth={3.5} />
            <Circle cx={rx} cy={ry} r={ring.radius - 5} color="#BAE6FD" style="stroke" strokeWidth={1.5} />
          </Group>
        );
      })}

      {/* ── 7. HAZARD SAWS ─────────────────────────────────────────────────── */}
      {hazards.map(saw => {
        if (saw.x + saw.radius < viewMinX || saw.x - saw.radius > viewMaxX) return null;
        const sx = saw.x - cameraX;
        const sy = saw.y - cameraY;
        return (
          <Group key={saw.id}>
            {saw.pendulum && (
              <Line p1={vec(saw.pendulum.originX - cameraX, saw.pendulum.originY - cameraY)} p2={vec(sx, sy)} color="#475569" strokeWidth={2} style="stroke" />
            )}
            <Circle cx={sx} cy={sy} r={saw.radius + 3} color="#EF4444" opacity={0.3} />
            <Circle cx={sx} cy={sy} r={saw.radius} color="#64748B" />
            <Circle cx={sx} cy={sy} r={5} color="#0F172A" />
          </Group>
        );
      })}

      {/* ── 8. ANCHOR PINS ─────────────────────────────────────────────────── */}
      {pins.map(pin => {
        if (pin.shattered) return null;
        if (pin.x < viewMinX - 30 || pin.x > viewMaxX + 30) return null;
        const sx = pin.x - cameraX;
        const sy = pin.y - cameraY;
        const isCurrentActive = activePin?.id === pin.id;
        const isCandidate = targetCandidatePin?.id === pin.id && !player.isGrappling;

        return (
          <Group key={pin.id}>
            {isCandidate && (
              <Circle cx={sx} cy={sy} r={24} color="#FACC15" style="stroke" strokeWidth={1.8} opacity={0.8} />
            )}
            <Circle
              cx={sx}
              cy={sy}
              r={isCurrentActive ? 16 : 13}
              color={isCurrentActive ? '#FACC15' : pin.fragile ? '#67E8F9' : '#1E293B'}
            />
            <Circle cx={sx} cy={sy} r={isCurrentActive ? 6 : 4} color={isCurrentActive ? '#000' : '#FFF'} />
          </Group>
        );
      })}

      {/* ── 9. AUTHENTIC SPIDER-MAN WEB ROPE ───────────────────────────────── */}
      {player.isGrappling && activePin && (
        <Group>
          {/* Splat Anchor Decal */}
          <Line
            p1={vec(activePin.x - cameraX - 14, activePin.y - cameraY - 7)}
            p2={vec(activePin.x - cameraX + 14, activePin.y - cameraY + 7)}
            color="#FFFFFF"
            strokeWidth={1.2}
            style="stroke"
          />
          <Line
            p1={vec(activePin.x - cameraX - 7, activePin.y - cameraY - 14)}
            p2={vec(activePin.x - cameraX + 7, activePin.y - cameraY + 14)}
            color="#FFFFFF"
            strokeWidth={1.2}
            style="stroke"
          />
          <Circle cx={activePin.x - cameraX} cy={activePin.y - cameraY} r={4.5} color="#FFFFFF" />

          {/* Luminous Outer Web Cable */}
          <Line
            p1={vec(activePin.x - cameraX, activePin.y - cameraY)}
            p2={vec(pScreenX, pScreenY - 6)}
            color="#BAE6FD"
            strokeWidth={4.5}
            opacity={0.35}
            style="stroke"
          />
          {/* Core Dense Web Cable */}
          <Line
            p1={vec(activePin.x - cameraX, activePin.y - cameraY)}
            p2={vec(pScreenX, pScreenY - 6)}
            color="#FFFFFF"
            strokeWidth={2.4}
            strokeCap="round"
            style="stroke"
          />
          {/* Center Sticky Node Bead */}
          <Circle
            cx={(activePin.x - cameraX + pScreenX) * 0.5}
            cy={(activePin.y - cameraY + pScreenY - 6) * 0.5}
            r={2.5}
            color="#FFFFFF"
          />
          {/* Wrist Web-Shooter Flare */}
          <Circle cx={pScreenX} cy={pScreenY - 6} r={3.8} color="#FFFFFF" opacity={0.9} />
        </Group>
      )}

      {/* ── 10. MOTION GHOST TRAILS ────────────────────────────────────────── */}
      {player.trail.map((t, idx) => (
        <Circle
          key={`tr_${idx}`}
          cx={t.x - cameraX}
          cy={t.y - cameraY}
          r={8 - idx * 0.8}
          color={skinColor}
          opacity={t.opacity * 0.3}
        />
      ))}

      {/* ── 11. EXPRESSIVE STICKMAN CHARACTER ──────────────────────────────── */}
      <Group
        transform={[
          { translateX: pScreenX },
          { translateY: pScreenY },
          { rotate: rotationRad },
        ]}
      >
        {/* Active Power-Up Visual Overlays */}
        {player.activePowerUps?.some(p => p.type === 'jetpack') && (
          <Group>
            <Rect x={-6} y={-4} width={12} height={14} color="#475569" />
            <Circle cx={-4} cy={12} r={3.5} color="#F97316" />
            <Circle cx={4} cy={12} r={3.5} color="#F97316" />
            <Line p1={vec(-4, 12)} p2={vec(-4, 25)} color="#EF4444" strokeWidth={3} style="stroke" />
            <Line p1={vec(4, 12)} p2={vec(4, 25)} color="#EF4444" strokeWidth={3} style="stroke" />
            <Line p1={vec(-4, 12)} p2={vec(-4, 18)} color="#FDE047" strokeWidth={1.8} style="stroke" />
            <Line p1={vec(4, 12)} p2={vec(4, 18)} color="#FDE047" strokeWidth={1.8} style="stroke" />
          </Group>
        )}

        {player.activePowerUps?.some(p => p.type === 'slow_mo') && (
          <Circle cx={0} cy={0} r={24} color="#A855F7" style="stroke" strokeWidth={2} opacity={0.65} />
        )}

        {player.activePowerUps?.some(p => p.type === 'speed_boost') && (
          <Circle cx={0} cy={0} r={22} color="#FACC15" style="stroke" strokeWidth={2.5} opacity={0.7} />
        )}

        {player.activePowerUps?.some(p => p.type === 'magnet') && (
          <Group>
            <Circle cx={0} cy={0} r={28} color="#10B981" style="stroke" strokeWidth={1.8} opacity={0.5} />
            <Circle cx={0} cy={0} r={36} color="#34D399" style="stroke" strokeWidth={1} opacity={0.3} />
          </Group>
        )}

        {/* Bandana Ribbon */}
        <Path
          path="M -3 -15 C -12 -12, -22 -19, -30 -15 C -22 -13, -12 -9, -2 -13 Z"
          color="#EF4444"
          opacity={0.9}
        />

        {/* Head */}
        <Circle cx={0} cy={-14} r={9} color={headColor} />

        {/* Facial Expressions */}
        {player.faceExpression === 'screaming' && (
          <Group>
            <Circle cx={-3.5} cy={-16} r={3} color="#FFF" />
            <Circle cx={3.5} cy={-16} r={3} color="#FFF" />
            <Circle cx={-3.5} cy={-16} r={1.2} color="#000" />
            <Circle cx={3.5} cy={-16} r={1.2} color="#000" />
            <Circle cx={0} cy={-10.5} r={2.8} color="#000" />
            <Circle cx={7} cy={-20} r={1.8} color="#38BDF8" />
          </Group>
        )}

        {player.faceExpression === 'excited' && (
          <Group>
            <Circle cx={-3} cy={-16} r={2.8} color="#FFF" />
            <Circle cx={3} cy={-16} r={2.8} color="#FFF" />
            <Circle cx={-2.6} cy={-16.2} r={1.4} color="#000" />
            <Circle cx={3.4} cy={-16.2} r={1.4} color="#000" />
            <Path path="M -4 -11 Q 0 -6 4 -11 Z" color="#000" />
          </Group>
        )}

        {player.faceExpression === 'grimacing' && (
          <Group>
            <Line p1={vec(-5, -17)} p2={vec(-1.5, -15)} color="#000" strokeWidth={1.8} strokeCap="round" style="stroke" />
            <Line p1={vec(5, -17)} p2={vec(1.5, -15)} color="#000" strokeWidth={1.8} strokeCap="round" style="stroke" />
            <Rect x={-4} y={-12} width={8} height={3} color="#FFF" />
          </Group>
        )}

        {player.faceExpression === 'happy' && (
          <Group>
            <Path path="M -5 -15 Q -3 -18 -1 -15" color="#000" style="stroke" strokeWidth={1.8} strokeCap="round" />
            <Path path="M 1 -15 Q 3 -18 5 -15" color="#000" style="stroke" strokeWidth={1.8} strokeCap="round" />
            <Path path="M -3.5 -11 Q 0 -7 3.5 -11" color="#000" style="stroke" strokeWidth={1.8} strokeCap="round" />
          </Group>
        )}

        {player.faceExpression === 'triumph' && (
          <Group>
            <Circle cx={-3} cy={-16} r={2.5} color="#FACC15" />
            <Circle cx={3} cy={-16} r={2.5} color="#FACC15" />
            <Path path="M -4 -11.5 Q 0 -5 4 -11.5 Z" color="#FFF" />
          </Group>
        )}

        {player.faceExpression === 'focused' && (
          <Group>
            <Circle cx={-2.5} cy={-15} r={1.2} color="#000" />
            <Circle cx={2.5} cy={-15} r={1.2} color="#000" />
            <Line p1={vec(-2.5, -10.5)} p2={vec(2.5, -10.5)} color="#000" strokeWidth={1.4} strokeCap="round" style="stroke" />
          </Group>
        )}

        {/* Torso & Emblem */}
        <Line p1={vec(0, -5)} p2={vec(0, 11)} color={skinColor} strokeWidth={4.5} strokeCap="round" style="stroke" />
        <Circle cx={0} cy={1} r={2} color="#FFFFFF" />

        {/* Limbs */}
        {player.isGrappling ? (
          <Group>
            <Line p1={vec(0, -3)} p2={vec(-5, -10)} color={skinColor} strokeWidth={3} strokeCap="round" style="stroke" />
            <Line p1={vec(-5, -10)} p2={vec(-2, -19)} color={skinColor} strokeWidth={3} strokeCap="round" style="stroke" />
            <Circle cx={-2} cy={-19} r={2.5} color="#FFF" />

            <Line p1={vec(0, -3)} p2={vec(5, -10)} color={skinColor} strokeWidth={3} strokeCap="round" style="stroke" />
            <Line p1={vec(5, -10)} p2={vec(2, -19)} color={skinColor} strokeWidth={3} strokeCap="round" style="stroke" />
            <Circle cx={2} cy={-19} r={2.5} color="#FFF" />

            <Line p1={vec(0, 10)} p2={vec(-6, 18)} color={skinColor} strokeWidth={3} strokeCap="round" style="stroke" />
            <Line p1={vec(-6, 18)} p2={vec(-2, 25)} color={skinColor} strokeWidth={3} strokeCap="round" style="stroke" />
            <Rect x={-4} y={23} width={5} height={3} color="#0F172A" />

            <Line p1={vec(0, 10)} p2={vec(6, 17)} color={skinColor} strokeWidth={3} strokeCap="round" style="stroke" />
            <Line p1={vec(6, 17)} p2={vec(10, 23)} color={skinColor} strokeWidth={3} strokeCap="round" style="stroke" />
            <Rect x={8} y={22} width={5} height={3} color="#0F172A" />
          </Group>
        ) : (
          <Group>
            <Line p1={vec(0, -3)} p2={vec(-8, 2)} color={skinColor} strokeWidth={3} strokeCap="round" style="stroke" />
            <Line p1={vec(-8, 2)} p2={vec(-14, -3)} color={skinColor} strokeWidth={3} strokeCap="round" style="stroke" />
            <Circle cx={-14} cy={-3} r={2} color="#FFF" />

            <Line p1={vec(0, -3)} p2={vec(8, -2)} color={skinColor} strokeWidth={3} strokeCap="round" style="stroke" />
            <Line p1={vec(8, -2)} p2={vec(15, -9)} color={skinColor} strokeWidth={3} strokeCap="round" style="stroke" />
            <Circle cx={15} cy={-9} r={2} color="#FFF" />

            <Line p1={vec(0, 10)} p2={vec(-7, 17)} color={skinColor} strokeWidth={3} strokeCap="round" style="stroke" />
            <Line p1={vec(-7, 17)} p2={vec(-11, 26)} color={skinColor} strokeWidth={3} strokeCap="round" style="stroke" />
            <Rect x={-13} y={24} width={5} height={3} color="#0F172A" />

            <Line p1={vec(0, 10)} p2={vec(7, 18)} color={skinColor} strokeWidth={3} strokeCap="round" style="stroke" />
            <Line p1={vec(7, 18)} p2={vec(11, 27)} color={skinColor} strokeWidth={3} strokeCap="round" style="stroke" />
            <Rect x={9} y={25} width={5} height={3} color="#0F172A" />
          </Group>
        )}
      </Group>

      {/* ── 12. ACTIVE PARTICLES ───────────────────────────────────────────── */}
      {particles.map(pt => (
        <Circle
          key={pt.id}
          cx={pt.x - cameraX}
          cy={pt.y - cameraY}
          r={pt.size}
          color={pt.color}
          opacity={pt.alpha}
        />
      ))}
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

export default memo(HookSkiaCanvas);
