import React, { useMemo } from 'react';
import Svg, { Circle, Line, Path, G, Rect, Polygon } from 'react-native-svg';
import { ArrowEntity, TrajectoryPoint, ParticleEntity, FloatText, ArrowType, ZombieEntity } from '../types/gameTypes';

interface ProjectilesAndEffectsProps {
  arrows: ArrowEntity[];
  trajectory: TrajectoryPoint[];
  isAiming: boolean;
  arrowType?: ArrowType;
  particles?: ParticleEntity[];
  floatTexts?: FloatText[];
  zombies?: ZombieEntity[];
  playerPos?: { x: number; y: number };
}

export const ProjectilesAndEffects: React.FC<ProjectilesAndEffectsProps> = ({
  arrows,
  trajectory,
  isAiming,
  arrowType = 'regular',
  particles = [],
  floatTexts = [],
  zombies = [],
  playerPos,
}) => {
  // Color trajectory and crosshair according to active arrow type
  const themeColor = useMemo(() => {
    if (arrowType === 'ice') {
      return '#06B6D4';
    }
    if (arrowType === 'splitter') {
      return '#10B981';
    }
    return '#38BDF8';
  }, [arrowType]);

  // Precompute single continuous dashed trajectory path (1 native SVG node)
  const trajectoryPath = useMemo(() => {
    if (!isAiming || trajectory.length < 2) return '';
    return trajectory.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  }, [isAiming, trajectory]);

  const targetPoint = isAiming && trajectory.length > 2 ? trajectory[trajectory.length - 1] : null;

  return (
    <G>
      {/* 1. Single Continuous Dashed Trajectory Line with Obstacle Ricochet Reflections */}
      {trajectoryPath ? (
        <Path
          d={trajectoryPath}
          stroke={themeColor}
          strokeWidth="3"
          strokeDasharray="6, 8"
          fill="none"
          opacity={0.92}
        />
      ) : null}

      {/* 2. Trajectory Ricochet / Bounce Indicator Nodes */}
      {isAiming &&
        trajectory.map((pt, idx) => {
          if (!pt.isBounce) return null;
          return (
            <G key={`bounce_${idx}`} transform={`translate(${pt.x}, ${pt.y})`}>
              {/* Outer glowing pulsing ring */}
              <Circle
                cx="0"
                cy="0"
                r="13"
                fill="none"
                stroke={themeColor}
                strokeWidth="2.2"
                strokeDasharray="4, 3"
              />
              {/* Inner glowing core */}
              <Circle cx="0" cy="0" r="5.5" fill={themeColor} opacity={0.95} />
              {/* White impact center */}
              <Circle cx="0" cy="0" r="2.2" fill="#FFFFFF" />
            </G>
          );
        })}

      {/* 3. Target Crosshair at the Endpoint */}
      {targetPoint && (
        <G transform={`translate(${targetPoint.x}, ${targetPoint.y})`}>
          <Circle cx="0" cy="0" r="14" fill="none" stroke={themeColor} strokeWidth="2" strokeDasharray="5, 3" />
          <Circle cx="0" cy="0" r="3.5" fill="none" stroke={themeColor} strokeWidth="1.5" />
          <Line x1="-16" y1="0" x2="-6" y2="0" stroke={themeColor} strokeWidth="2" />
          <Line x1="6" y1="0" x2="16" y2="0" stroke={themeColor} strokeWidth="2" />
          <Line x1="0" y1="-16" x2="0" y2="-6" stroke={themeColor} strokeWidth="2" />
          <Line x1="0" y1="6" x2="0" y2="16" stroke={themeColor} strokeWidth="2" />
        </G>
      )}

      {/* 3.5. Flying Zombie Laser Attacks (Charging Guide Beam + Full Power Laser Cannon) */}
      {zombies.map(z => {
        if (z.type !== 'flying' || z.health <= 0) return null;
        const isCharging = z.laserCharging && (z.laserChargeTimer ?? 0) > 0;
        const isFiring = (z.laserFiringTimer ?? 0) > 0;
        if (!isCharging && !isFiring) return null;

        const zx = z.body.position.x;
        const zy = z.body.position.y - 12; // Aligned with cyber laser eye
        const px = z.laserTargetPos?.x ?? (playerPos?.x ?? 160);
        const py = z.laserTargetPos?.y ?? (playerPos?.y ? playerPos.y + 8 : 330);

        if (isFiring) {
          // Lethal High-Energy Laser Blast
          return (
            <G key={`laser_${z.id}`}>
              {/* Outer Neon Glow Aura */}
              <Line
                x1={zx}
                y1={zy}
                x2={px}
                y2={py}
                stroke="#EF4444"
                strokeWidth="16"
                strokeLinecap="round"
                opacity={0.45}
              />
              {/* Mid Intense Laser Beam */}
              <Line
                x1={zx}
                y1={zy}
                x2={px}
                y2={py}
                stroke="#F43F5E"
                strokeWidth="8"
                strokeLinecap="round"
                opacity={0.85}
              />
              {/* Core Hot White Plasma Beam */}
              <Line
                x1={zx}
                y1={zy}
                x2={px}
                y2={py}
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Emitter Muzzle Flash */}
              <Circle cx={zx} cy={zy} r="14" fill="#EF4444" opacity={0.8} />
              <Circle cx={zx} cy={zy} r="7" fill="#FFFFFF" />
              {/* Target Impact Blast */}
              <Circle cx={px} cy={py} r="20" fill="none" stroke="#EF4444" strokeWidth="3" />
              <Circle cx={px} cy={py} r="9" fill="#F43F5E" />
              <Circle cx={px} cy={py} r="4.5" fill="#FFFFFF" />
            </G>
          );
        }

        // Targeting Guide Beam (Charging)
        return (
          <G key={`laser_charge_${z.id}`}>
            {/* Guide Laser Dotted Ray */}
            <Line
              x1={zx}
              y1={zy}
              x2={px}
              y2={py}
              stroke="#EF4444"
              strokeWidth="2.4"
              strokeDasharray="6, 5"
              opacity={0.85}
            />
            {/* Pulsing Target Lock Reticle on Player */}
            <Circle
              cx={px}
              cy={py}
              r="15"
              fill="none"
              stroke="#EF4444"
              strokeWidth="2"
              strokeDasharray="4, 3"
            />
            <Circle cx={px} cy={py} r="3" fill="#EF4444" />
            {/* Emitter Gathering Charge Flare */}
            <Circle cx={zx} cy={zy} r="9" fill="#EF4444" opacity={0.7} />
            <Circle cx={zx} cy={zy} r="4" fill="#FEF08A" />
          </G>
        );
      })}

      {/* 4. Projectiles: In-Flight Arrows */}
      {arrows.map(arrow => {
        const x = arrow.body.position.x;
        const y = arrow.body.position.y;
        const deg = (arrow.angle * 180) / Math.PI;
        const type = arrow.arrowType || 'regular';

        if (type === 'ice') {
          return (
            <G key={`arr_${arrow.id}`} transform={`translate(${x}, ${y}) rotate(${deg})`}>
              <Line x1="-22" y1="0" x2="14" y2="0" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
              <Path d="M 22 0 L 12 -5 L 14 0 L 12 5 Z" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.2" />
              <Path d="M -22 0 L -28 -5 L -20 -1 Z" fill="#38BDF8" />
              <Path d="M -22 0 L -28 5 L -20 1 Z" fill="#38BDF8" />
            </G>
          );
        }

        if (type === 'splitter') {
          return (
            <G key={`arr_${arrow.id}`} transform={`translate(${x}, ${y}) rotate(${deg})`}>
              <Line x1="-22" y1="0" x2="14" y2="0" stroke="#047857" strokeWidth="3" strokeLinecap="round" />
              <Path d="M 22 0 L 12 -6 L 14 0 L 12 6 Z" fill="#34D399" stroke="#065F46" strokeWidth="1.2" />
              <Path d="M -22 0 L -28 -5 L -20 -1 Z" fill="#10B981" />
              <Path d="M -22 0 L -28 5 L -20 1 Z" fill="#10B981" />
            </G>
          );
        }

        // Default Regular Steel Arrow
        return (
          <G key={`arr_${arrow.id}`} transform={`translate(${x}, ${y}) rotate(${deg})`}>
            {/* Wooden Shaft */}
            <Line x1="-22" y1="0" x2="14" y2="0" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
            {/* Steel Arrowhead */}
            <Path d="M 22 0 L 12 -5 L 14 0 L 12 5 Z" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
            {/* Red Feathers */}
            <Path d="M -22 0 L -28 -5 L -20 -1 Z" fill="#DC2626" />
            <Path d="M -22 0 L -28 5 L -20 1 Z" fill="#DC2626" />
          </G>
        );
      })}

      {/* 5. Smooth, High-Performance Particles (Blast Shockwaves, Smoke Clouds, Sparks) */}
      {particles.map(p => {

        if (p.shape === 'shockwave') {
          const progress = p.life / p.maxLife;
          const currentRadius = p.size + progress * 65;
          const strokeW = Math.max(1, 4 * (1 - progress));
          return (
            <Circle
              key={`part_${p.id}`}
              cx={p.x}
              cy={p.y}
              r={currentRadius}
              stroke={p.color}
              strokeWidth={strokeW}
              fill="none"
              opacity={p.opacity}
            />
          );
        }

        if (p.shape === 'smoke') {
          const progress = p.life / p.maxLife;
          const r = p.size * (1 + progress * 0.7);
          return (
            <Circle
              key={`part_${p.id}`}
              cx={p.x}
              cy={p.y}
              r={r}
              fill={p.color}
              opacity={p.opacity * 0.75}
            />
          );
        }

        if (p.shape === 'spark') {
          return (
            <Line
              key={`part_${p.id}`}
              x1={p.x - 4}
              y1={p.y - 4}
              x2={p.x + 4}
              y2={p.y + 4}
              stroke={p.color}
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity={p.opacity}
            />
          );
        }

        if (p.shape === 'flame') {
          const r = Math.max(1.5, p.size * (1 - p.life / p.maxLife));
          return (
            <Circle
              key={`part_${p.id}`}
              cx={p.x}
              cy={p.y}
              r={r}
              fill={p.color}
              opacity={p.opacity}
            />
          );
        }

        if (p.shape === 'ice') {
          // Diamond ice crystal shard
          const s = Math.max(1.5, p.size * (1 - p.life / p.maxLife));
          return (
            <Rect
              key={`part_${p.id}`}
              x={p.x - s / 2}
              y={p.y - s / 2}
              width={s}
              height={s}
              fill={p.color}
              opacity={p.opacity}
            />
          );
        }

        // Standard and splat crisp circle particle
        const r = Math.max(1, p.size * (1 - p.life / (p.maxLife * 1.5)));
        return (
          <Circle
            key={`part_${p.id}`}
            cx={p.x}
            cy={p.y}
            r={r}
            fill={p.color}
            opacity={p.opacity}
          />
        );
      })}

      {/* 6. Floating Text Badges */}
      {floatTexts.map(ft => (
        <G key={`ft_${ft.id}`} transform={`translate(${ft.x}, ${ft.y})`} opacity={ft.opacity}>
          <Rect
            x="-65"
            y="-14"
            width="130"
            height="22"
            rx="11"
            fill="rgba(15, 23, 42, 0.88)"
            stroke={ft.color}
            strokeWidth="1.2"
          />
          <Line x1="-40" y1="8" x2="40" y2="8" stroke={ft.color} strokeWidth="1" opacity={0.6} />
        </G>
      ))}
    </G>
  );
};
