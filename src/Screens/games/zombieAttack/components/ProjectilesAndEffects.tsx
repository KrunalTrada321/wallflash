import React, { useMemo } from 'react';
import Svg, { Circle, Line, Path, G, Rect, Text as SvgText } from 'react-native-svg';
import { ArrowEntity, TrajectoryPoint, ParticleEntity, FloatText } from '../types/gameTypes';

interface ProjectilesAndEffectsProps {
  arrows: ArrowEntity[];
  trajectory: TrajectoryPoint[];
  isAiming: boolean;
  particles?: ParticleEntity[];
  floatTexts?: FloatText[];
}

export const ProjectilesAndEffects: React.FC<ProjectilesAndEffectsProps> = React.memo(({
  arrows,
  trajectory,
  isAiming,
  particles = [],
  floatTexts = [],
}) => {
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
      {/* 1. Single Continuous Dashed Trajectory Line with Ricochet Reflections */}
      {trajectoryPath ? (
        <Path
          d={trajectoryPath}
          stroke="#38BDF8"
          strokeWidth="2.8"
          strokeDasharray="6, 8"
          fill="none"
          opacity={0.88}
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
                stroke="#F59E0B"
                strokeWidth="2.2"
                strokeDasharray="4, 3"
              />
              {/* Inner glowing amber core */}
              <Circle cx="0" cy="0" r="5.5" fill="#F59E0B" opacity={0.95} />
              {/* White impact center */}
              <Circle cx="0" cy="0" r="2.2" fill="#FFFFFF" />
            </G>
          );
        })}

      {/* 3. Target Crosshair at the Endpoint */}
      {targetPoint && (
        <G transform={`translate(${targetPoint.x}, ${targetPoint.y})`}>
          <Circle cx="0" cy="0" r="14" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="5, 3" />
          <Circle cx="0" cy="0" r="3.5" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
          <Line x1="-16" y1="0" x2="-6" y2="0" stroke="#38BDF8" strokeWidth="2" />
          <Line x1="6" y1="0" x2="16" y2="0" stroke="#38BDF8" strokeWidth="2" />
          <Line x1="0" y1="-16" x2="0" y2="-6" stroke="#38BDF8" strokeWidth="2" />
          <Line x1="0" y1="6" x2="0" y2="16" stroke="#38BDF8" strokeWidth="2" />
        </G>
      )}

      {/* 4. Arrow Motion Blur Speed Trails */}
      {arrows.map(arrow => {
        if (!arrow.inFlight || !arrow.trail || arrow.trail.length < 2) return null;
        let d = `M ${arrow.trail[0].x} ${arrow.trail[0].y}`;
        for (let i = 1; i < arrow.trail.length; i++) {
          d += ` L ${arrow.trail[i].x} ${arrow.trail[i].y}`;
        }
        return (
          <Path
            key={`trail_${arrow.id}`}
            d={d}
            stroke="#EF4444"
            strokeWidth="2.8"
            strokeOpacity={0.65}
            strokeLinecap="round"
            fill="none"
          />
        );
      })}

      {/* 5. Arrows (In-Flight & Stuck on living targets) */}
      {arrows.map(arrow => {
        const x = arrow.body.position.x;
        const y = arrow.body.position.y;
        const deg = (arrow.angle * 180) / Math.PI;

        return (
          <G key={`arr_${arrow.id}`} transform={`translate(${x}, ${y}) rotate(${deg})`}>
            {/* Wooden Shaft */}
            <Line x1="-22" y1="0" x2="14" y2="0" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
            {/* Steel Arrowhead */}
            <Path d="M 22 0 L 12 -5 L 14 0 L 12 5 Z" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
            {/* Feathers */}
            <Path d="M -22 0 L -28 -5 L -20 -1 Z" fill="#DC2626" />
            <Path d="M -22 0 L -28 5 L -20 1 Z" fill="#DC2626" />
          </G>
        );
      })}

      {/* 5. Visceral Blood, Slime, Sparks, Flying Skull & Bone Particles */}
      {particles.map(p => {
        if (p.shape === 'spark') {
          // Golden Ricochet Spark or Blood Claw Slash
          return (
            <Line
              key={`part_${p.id}`}
              x1={p.x - 7}
              y1={p.y - 7}
              x2={p.x + 7}
              y2={p.y + 7}
              stroke={p.color}
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity={p.opacity}
            />
          );
        }

        if (p.shape === 'skull') {
          // Decapitated flying cartoon zombie skull with pink brain patch and dead X eyes!
          const rot = (p.life * 14) % 360;
          return (
            <G key={`part_${p.id}`} transform={`translate(${p.x}, ${p.y}) rotate(${rot})`} opacity={p.opacity}>
              {/* Green skull base */}
              <Circle cx="0" cy="0" r={p.size} fill="#84CC16" stroke="#15803D" strokeWidth="2" />
              {/* Exposed pink brain patch */}
              <Path d="M -6 -11 Q 0 -18 6 -11 Q 0 -7 -6 -11 Z" fill="#F472B6" stroke="#BE185D" strokeWidth="1" />
              {/* Dead X Eyes */}
              <Line x1="-7" y1="-3" x2="-2" y2="2" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
              <Line x1="-2" y1="-3" x2="-7" y2="2" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
              <Line x1="2" y1="-3" x2="7" y2="2" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
              <Line x1="7" y1="-3" x2="2" y2="2" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
              {/* Grinning bone teeth */}
              <Rect x="-6" y="5" width="12" height="4" rx="1.5" fill="#FFFFFF" stroke="#15803D" strokeWidth="1" />
              <Line x1="-2" y1="5" x2="-2" y2="9" stroke="#15803D" strokeWidth="1" />
              <Line x1="2" y1="5" x2="2" y2="9" stroke="#15803D" strokeWidth="1" />
            </G>
          );
        }

        if (p.shape === 'bone') {
          // Flying bone fragment
          const rot = (p.life * 18) % 360;
          return (
            <G key={`part_${p.id}`} transform={`translate(${p.x}, ${p.y}) rotate(${rot})`} opacity={p.opacity}>
              <Line x1="-6" y1="0" x2="6" y2="0" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
              <Circle cx="-6" cy="-2" r="2" fill="#F8FAFC" />
              <Circle cx="-6" cy="2" r="2" fill="#F8FAFC" />
              <Circle cx="6" cy="-2" r="2" fill="#F8FAFC" />
              <Circle cx="6" cy="2" r="2" fill="#F8FAFC" />
            </G>
          );
        }

        if (p.shape === 'splat') {
          // Irregular cartoon blood/slime splat
          const r = Math.max(1, p.size * (1 - p.life / (p.maxLife * 1.5)));
          return (
            <G key={`part_${p.id}`} opacity={p.opacity}>
              <Circle cx={p.x} cy={p.y} r={r} fill={p.color} />
              <Circle cx={p.x + r * 0.7} cy={p.y - r * 0.5} r={r * 0.45} fill={p.color} />
              <Circle cx={p.x - r * 0.5} cy={p.y + r * 0.6} r={r * 0.4} fill={p.color} />
            </G>
          );
        }

        // Standard blood drop
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
    </G>
  );
});
