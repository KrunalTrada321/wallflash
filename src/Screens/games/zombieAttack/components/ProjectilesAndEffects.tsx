import React, { useMemo } from 'react';
import Svg, { Circle, Line, Path, G, Rect, Polygon } from 'react-native-svg';
import { ArrowEntity, TrajectoryPoint, ParticleEntity, FloatText, ArrowType } from '../types/gameTypes';

interface ProjectilesAndEffectsProps {
  arrows: ArrowEntity[];
  trajectory: TrajectoryPoint[];
  isAiming: boolean;
  arrowType?: ArrowType;
  particles?: ParticleEntity[];
  floatTexts?: FloatText[];
}

export const ProjectilesAndEffects: React.FC<ProjectilesAndEffectsProps> = React.memo(({
  arrows,
  trajectory,
  isAiming,
  arrowType = 'regular',
  particles = [],
  floatTexts = [],
}) => {
  // Color trajectory and crosshair according to active arrow type
  const themeColor = useMemo(() => {
    if (arrowType === 'bomb') {
      return '#FACC15';
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

      {/* 4. Projectiles: In-Flight Arrows & Thrown Bombs */}
      {arrows.map(arrow => {
        const x = arrow.body.position.x;
        const y = arrow.body.position.y;
        const deg = (arrow.angle * 180) / Math.PI;
        const type = arrow.arrowType || 'regular';

        if (type === 'bomb') {
          return (
            <G key={`arr_${arrow.id}`} transform={`translate(${x}, ${y}) rotate(${deg})`}>
              {/* Heavy Cast Iron Round Bomb */}
              <Circle cx="0" cy="0" r="9" fill="#09090B" stroke="#27272A" strokeWidth="1.5" />
              {/* Specular curved reflection sheen */}
              <Path d="M -4 -4 Q -2 -7 3 -6" stroke="#94A3B8" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              {/* Cylindrical Brass Neck / Cap */}
              <Rect x="-2.5" y="-12" width="5" height="3.5" rx="0.8" fill="#D97706" stroke="#92400E" strokeWidth="0.8" />
              {/* Sizzling Braided Fuse Cord */}
              <Path d="M 0 -12 Q 5 -18 2 -22" stroke="#EAB308" strokeWidth="2.2" fill="none" />
              {/* Burning Fuse Sparks */}
              <Circle cx="2" cy="-22" r="3.5" fill="#EF4444" />
              <Circle cx="2" cy="-22" r="2" fill="#FEF08A" />
              {/* Crackle Spark Rays */}
              <Line x1="-1" y1="-25" x2="5" y2="-19" stroke="#FEF08A" strokeWidth="1.4" />
              <Line x1="5" y1="-25" x2="-1" y2="-19" stroke="#FEF08A" strokeWidth="1.4" />
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
          const currentRadius = p.size + progress * 80;
          const strokeW = Math.max(1.2, 5.5 * (1 - progress));
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
          const r = p.size * (1 + progress * 0.85);
          return (
            <G key={`part_${p.id}`} opacity={p.opacity * 0.85}>
              <Circle cx={p.x} cy={p.y} r={r} fill={p.color} />
              <Circle cx={p.x + r * 0.4} cy={p.y - r * 0.3} r={r * 0.65} fill={p.color} />
              <Circle cx={p.x - r * 0.35} cy={p.y - r * 0.25} r={r * 0.6} fill={p.color} />
            </G>
          );
        }

        if (p.shape === 'spark') {
          return (
            <Line
              key={`part_${p.id}`}
              x1={p.x - 6}
              y1={p.y - 6}
              x2={p.x + 6}
              y2={p.y + 6}
              stroke={p.color}
              strokeWidth="2.8"
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
            <G key={`part_${p.id}`} transform={`translate(${p.x}, ${p.y}) rotate(45)`} opacity={p.opacity}>
              <Rect x={-s / 2} y={-s / 2} width={s} height={s} fill={p.color} stroke="#FFFFFF" strokeWidth="0.6" />
            </G>
          );
        }

        if (p.shape === 'splat') {
          const r = Math.max(1, p.size * (1 - p.life / (p.maxLife * 1.5)));
          return (
            <G key={`part_${p.id}`} opacity={p.opacity}>
              <Circle cx={p.x} cy={p.y} r={r} fill={p.color} />
              <Circle cx={p.x + r * 0.7} cy={p.y - r * 0.5} r={r * 0.45} fill={p.color} />
              <Circle cx={p.x - r * 0.5} cy={p.y + r * 0.6} r={r * 0.4} fill={p.color} />
            </G>
          );
        }

        // Standard crisp circle particle
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
});
