import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ArrowEntity,
  TrajectoryPoint,
  ParticleEntity,
  FloatText,
} from '../types/gameTypes';
import { ProjectilesAndEffects as SvgProjectilesAndEffects } from './ProjectilesAndEffects';

// Dynamically and safely check if Skia JSI runtime is ready
let SkiaModule: any = null;
let isSkiaAvailable = false;

try {
  SkiaModule = require('@shopify/react-native-skia');
  if (SkiaModule && SkiaModule.Canvas && SkiaModule.Skia) {
    isSkiaAvailable = true;
  }
} catch (e) {
  isSkiaAvailable = false;
}

export function isSkiaRenderingSupported(): boolean {
  return isSkiaAvailable;
}

interface SkiaProjectilesAndEffectsProps {
  cameraX: number;
  arrows: ArrowEntity[];
  trajectory: TrajectoryPoint[];
  isAiming: boolean;
  particles?: ParticleEntity[];
  floatTexts?: FloatText[];
  canvasWidth: number;
  canvasHeight: number;
  viewWidth: number;
  viewHeight: number;
}

export const SkiaProjectilesAndEffects: React.FC<SkiaProjectilesAndEffectsProps> = React.memo(({
  cameraX,
  arrows,
  trajectory,
  isAiming,
  particles = [],
  floatTexts = [],
  canvasWidth,
  canvasHeight,
  viewWidth,
  viewHeight,
}) => {
  if (!isSkiaAvailable || !SkiaModule) {
    return (
      <SvgProjectilesAndEffects
        arrows={arrows}
        trajectory={trajectory}
        isAiming={isAiming}
        particles={particles}
        floatTexts={floatTexts}
      />
    );
  }

  const { Canvas, Path, Circle, Line, Group, Rect, Skia, vec } = SkiaModule;

  // Scale from game virtual world coordinates (viewHeight=440) to device screen pixels
  const scale = canvasHeight > 0 && viewHeight > 0 ? canvasHeight / viewHeight : 1;

  // Build Skia Path for the Aiming Trajectory
  const trajectoryPath = useMemo(() => {
    if (!isAiming || trajectory.length < 2) return null;
    const path = Skia.Path.Make();
    path.moveTo(trajectory[0].x, trajectory[0].y);
    for (let i = 1; i < trajectory.length; i++) {
      path.lineTo(trajectory[i].x, trajectory[i].y);
    }
    return path;
  }, [isAiming, trajectory, Skia]);

  const targetPoint = isAiming && trajectory.length > 2 ? trajectory[trajectory.length - 1] : null;

  return (
    <Canvas style={[StyleSheet.absoluteFill, { width: canvasWidth, height: canvasHeight }]} pointerEvents="none">
      <Group transform={[{ scale }, { translateX: -cameraX }]}>
        {/* 1. Neon Glowing Parabolic Trajectory Arc */}
        {trajectoryPath && (
          <>
            {/* Outer cyan glow stroke */}
            <Path
              path={trajectoryPath}
              color="rgba(14, 165, 233, 0.45)"
              style="stroke"
              strokeWidth={5.5}
              strokeCap="round"
            />
            {/* Inner bright blue trajectory beam */}
            <Path
              path={trajectoryPath}
              color="#38BDF8"
              style="stroke"
              strokeWidth={2.8}
              strokeCap="round"
            />
          </>
        )}

        {/* 2. Ricochet Bounce Pulse Rings */}
        {isAiming &&
          trajectory.map((pt, idx) => {
            if (!pt.isBounce) return null;
            return (
              <Group key={`skia_bounce_${idx}`}>
                <Circle
                  cx={pt.x}
                  cy={pt.y}
                  r={12}
                  color="rgba(245, 158, 11, 0.4)"
                  style="stroke"
                  strokeWidth={2.5}
                />
                <Circle cx={pt.x} cy={pt.y} r={5} color="#F59E0B" />
                <Circle cx={pt.x} cy={pt.y} r={2} color="#FFFFFF" />
              </Group>
            );
          })}

        {/* 3. Target Crosshair at Arc Endpoint */}
        {targetPoint && (
          <Group>
            <Circle
              cx={targetPoint.x}
              cy={targetPoint.y}
              r={14}
              color="#38BDF8"
              style="stroke"
              strokeWidth={2}
            />
            <Circle
              cx={targetPoint.x}
              cy={targetPoint.y}
              r={3.5}
              color="#38BDF8"
              style="stroke"
              strokeWidth={1.5}
            />
            <Line
              p1={vec(targetPoint.x - 16, targetPoint.y)}
              p2={vec(targetPoint.x - 6, targetPoint.y)}
              color="#38BDF8"
              strokeWidth={2}
            />
            <Line
              p1={vec(targetPoint.x + 6, targetPoint.y)}
              p2={vec(targetPoint.x + 16, targetPoint.y)}
              color="#38BDF8"
              strokeWidth={2}
            />
            <Line
              p1={vec(targetPoint.x, targetPoint.y - 16)}
              p2={vec(targetPoint.x, targetPoint.y - 6)}
              color="#38BDF8"
              strokeWidth={2}
            />
            <Line
              p1={vec(targetPoint.x, targetPoint.y + 6)}
              p2={vec(targetPoint.x, targetPoint.y + 16)}
              color="#38BDF8"
              strokeWidth={2}
            />
          </Group>
        )}

        {/* 4. Motion Blur Trails Behind In-Flight Arrows */}
        {arrows.map(arrow => {
          if (!arrow.inFlight || !arrow.trail || arrow.trail.length < 2) return null;
          const trailPath = Skia.Path.Make();
          trailPath.moveTo(arrow.trail[0].x, arrow.trail[0].y);
          for (let i = 1; i < arrow.trail.length; i++) {
            trailPath.lineTo(arrow.trail[i].x, arrow.trail[i].y);
          }
          return (
            <Path
              key={`skia_trail_${arrow.id}`}
              path={trailPath}
              color="rgba(239, 68, 68, 0.6)"
              style="stroke"
              strokeWidth={3}
              strokeCap="round"
            />
          );
        })}

        {/* 5. Dynamic Arrows in Flight & Lodged on Bodies */}
        {arrows.map(arrow => {
          const x = arrow.body.position.x;
          const y = arrow.body.position.y;
          const angle = arrow.angle;

          return (
            <Group
              key={`skia_arrow_${arrow.id}`}
              origin={vec(x, y)}
              transform={[{ translate: [x, y] }, { rotate: angle }]}
            >
              {/* Shaft */}
              <Line p1={vec(-22, 0)} p2={vec(14, 0)} color="#78350F" strokeWidth={3} strokeCap="round" />
              {/* Steel Head */}
              <Line p1={vec(12, -4)} p2={vec(22, 0)} color="#94A3B8" strokeWidth={2.5} />
              <Line p1={vec(12, 4)} p2={vec(22, 0)} color="#94A3B8" strokeWidth={2.5} />
              <Line p1={vec(12, -4)} p2={vec(12, 4)} color="#64748B" strokeWidth={2} />
              {/* Feathers */}
              <Line p1={vec(-22, 0)} p2={vec(-28, -5)} color="#DC2626" strokeWidth={2.5} strokeCap="round" />
              <Line p1={vec(-22, 0)} p2={vec(-28, 5)} color="#DC2626" strokeWidth={2.5} strokeCap="round" />
            </Group>
          );
        })}

        {/* 6. Visceral Hardware-Accelerated Particles (Blood, Slime, Skull, Bones) */}
        {particles.map(p => {
          if (p.shape === 'spark') {
            return (
              <Line
                key={`skia_part_${p.id}`}
                p1={vec(p.x - 7, p.y - 7)}
                p2={vec(p.x + 7, p.y + 7)}
                color={p.color}
                strokeWidth={3.2}
                strokeCap="round"
                opacity={p.opacity}
              />
            );
          }

          if (p.shape === 'skull') {
            const rot = ((p.life * 14) % 360) * (Math.PI / 180);
            return (
              <Group
                key={`skia_part_${p.id}`}
                origin={vec(p.x, p.y)}
                transform={[{ translate: [p.x, p.y] }, { rotate: rot }]}
                opacity={p.opacity}
              >
                <Circle cx={0} cy={0} r={p.size} color="#84CC16" />
                <Circle cx={0} cy={-p.size * 0.5} r={p.size * 0.4} color="#F472B6" />
                <Line p1={vec(-6, -2)} p2={vec(-2, 2)} color="#111827" strokeWidth={2} />
                <Line p1={vec(-2, -2)} p2={vec(-6, 2)} color="#111827" strokeWidth={2} />
                <Line p1={vec(2, -2)} p2={vec(6, 2)} color="#111827" strokeWidth={2} />
                <Line p1={vec(6, -2)} p2={vec(2, 2)} color="#111827" strokeWidth={2} />
                <Rect x={-5} y={4} width={10} height={4} color="#FFFFFF" />
              </Group>
            );
          }

          if (p.shape === 'bone') {
            const rot = ((p.life * 18) % 360) * (Math.PI / 180);
            return (
              <Group
                key={`skia_part_${p.id}`}
                origin={vec(p.x, p.y)}
                transform={[{ translate: [p.x, p.y] }, { rotate: rot }]}
                opacity={p.opacity}
              >
                <Line p1={vec(-6, 0)} p2={vec(6, 0)} color="#F8FAFC" strokeWidth={3} strokeCap="round" />
                <Circle cx={-6} cy={-2} r={2} color="#F8FAFC" />
                <Circle cx={-6} cy={2} r={2} color="#F8FAFC" />
                <Circle cx={6} cy={-2} r={2} color="#F8FAFC" />
                <Circle cx={6} cy={2} r={2} color="#F8FAFC" />
              </Group>
            );
          }

          // Blood / Slime droplet or splat
          const r = Math.max(1, p.size * (1 - p.life / (p.maxLife * 1.5)));
          return (
            <Circle
              key={`skia_part_${p.id}`}
              cx={p.x}
              cy={p.y}
              r={r}
              color={p.color}
              opacity={p.opacity}
            />
          );
        })}
      </Group>
    </Canvas>
  );
});
