import React, { useMemo } from 'react';
import Svg, {
  Rect,
  Circle,
  Path,
  G,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Text as SvgText,
  Line,
} from 'react-native-svg';
import {
  PlatformConfig,
  ObstacleEntity,
  MovingPlatformEntity,
} from '../types/gameTypes';

// ==========================================
// 1. STATIC ENVIRONMENT (Memoized - Re-renders ONLY on Level Change!)
// ==========================================
interface StaticEnvironmentProps {
  worldWidth: number;
  worldHeight: number;
  platforms: PlatformConfig[];
  weather?: 'clear' | 'rain' | 'snow' | 'hellfire' | 'toxic';
}

export const StaticEnvironment: React.FC<StaticEnvironmentProps> = React.memo(
  ({ worldWidth, worldHeight, platforms, weather = 'clear' }) => {
    // Precalculate platform paths once per level layout
    const precomputedPlatforms = useMemo(() => {
      return platforms
        .filter(p => p.type !== 'moving')
        .map(p => {
          const left = p.x - p.width / 2;
          const top = p.y - p.height / 2;
          const grassHeight = Math.min(22, p.height);

          const toothCount = Math.max(3, Math.floor(p.width / 18));
          const toothW = p.width / toothCount;
          let grassTeethPath = `M ${left} ${top + grassHeight}`;
          for (let i = 0; i < toothCount; i++) {
            const tx = left + i * toothW;
            grassTeethPath += ` L ${tx + toothW * 0.5} ${top + grassHeight + 6} L ${tx + toothW} ${top + grassHeight}`;
          }
          grassTeethPath += ` L ${left + p.width} ${top} L ${left} ${top} Z`;

          const strataPath =
            p.height > 60
              ? `M ${left} ${top + 60} Q ${left + p.width * 0.5} ${top + 45} ${left + p.width} ${top + 65} L ${left + p.width} ${top + p.height} L ${left} ${top + p.height} Z`
              : null;

          return {
            id: p.id,
            left,
            top,
            width: p.width,
            height: p.height,
            grassTeethPath,
            strataPath,
          };
        });
    }, [platforms]);

    // Precalculate atmospheric weather visual elements
    const weatherElements = useMemo(() => {
      if (weather === 'clear') return null;

      const items = [];
      const count = weather === 'rain' ? 36 : weather === 'snow' ? 28 : 22;
      for (let i = 0; i < count; i++) {
        items.push({
          id: i,
          x: Math.round(((i * 137.5) % (worldWidth + 200)) - 100),
          y: Math.round((i * 47) % (worldHeight - 40) + 15),
          size: (i % 4) + 2,
        });
      }
      return items;
    }, [weather, worldWidth, worldHeight]);

    // Weather sky colors
    const skyColors = useMemo(() => {
      switch (weather) {
        case 'rain':
          return { top: '#1E293B', mid: '#334155', bot: '#475569' };
        case 'snow':
          return { top: '#BFDBFE', mid: '#DBEAFE', bot: '#EFF6FF' };
        case 'hellfire':
          return { top: '#450A0A', mid: '#7F1D1D', bot: '#991B1B' };
        case 'toxic':
          return { top: '#064E3B', mid: '#065F46', bot: '#047857' };
        default:
          return { top: '#BAE6FD', mid: '#E0F2FE', bot: '#F0FDFA' };
      }
    }, [weather]);

    return (
      <G>
        <Defs>
          {/* Dynamic Weather Sky Gradient */}
          <SvgGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={skyColors.top} />
            <Stop offset="50%" stopColor={skyColors.mid} />
            <Stop offset="100%" stopColor={skyColors.bot} />
          </SvgGradient>

          {/* Mountain Gradient */}
          <SvgGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.45" />
            <Stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.8" />
          </SvgGradient>

          {/* Grass Platform Gradient */}
          <SvgGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={weather === 'snow' ? '#E0F2FE' : '#84CC16'} />
            <Stop offset="100%" stopColor={weather === 'snow' ? '#93C5FD' : '#65A30D'} />
          </SvgGradient>

          {/* Slate Soil Gradient */}
          <SvgGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#1E293B" />
            <Stop offset="100%" stopColor="#0F172A" />
          </SvgGradient>

          {/* TNT Gradient */}
          <SvgGradient id="tntGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#EF4444" />
            <Stop offset="50%" stopColor="#F87171" />
            <Stop offset="100%" stopColor="#DC2626" />
          </SvgGradient>

          {/* Portals */}
          <SvgGradient id="bluePortal" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#60A5FA" />
            <Stop offset="100%" stopColor="#1D4ED8" />
          </SvgGradient>
          <SvgGradient id="orangePortal" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FDBA74" />
            <Stop offset="100%" stopColor="#EA580C" />
          </SvgGradient>
        </Defs>

        {/* 1. Sky */}
        <Rect x="-400" y="0" width={Math.max(worldWidth + 800, 2400)} height={worldHeight} fill="url(#skyGrad)" />

        {/* 2. Soft Background Clouds */}
        <G opacity={weather === 'rain' || weather === 'toxic' ? 0.35 : 0.85}>
          {[0.08, 0.35, 0.62, 0.88].map((ratio, idx) => (
            <G key={`cloud_${idx}`} transform={`translate(${worldWidth * ratio}, ${45 + (idx % 2) * 35})`}>
              <Circle cx="0" cy="0" r="22" fill="#FFFFFF" />
              <Circle cx="20" cy="-6" r="28" fill="#FFFFFF" />
              <Circle cx="44" cy="2" r="20" fill="#FFFFFF" />
              <Rect x="-8" y="2" width="60" height="20" fill="#FFFFFF" rx="10" />
            </G>
          ))}
        </G>

        {/* Atmospheric Weather Overlay */}
        {weatherElements && (
          <G opacity={0.65}>
            {weather === 'rain' &&
              weatherElements.map(w => (
                <Line
                  key={`rain_${w.id}`}
                  x1={w.x}
                  y1={w.y}
                  x2={w.x - 7}
                  y2={w.y + 14}
                  stroke="#93C5FD"
                  strokeWidth="1.5"
                  opacity={0.8}
                />
              ))}
            {weather === 'snow' &&
              weatherElements.map(w => (
                <Circle key={`snow_${w.id}`} cx={w.x} cy={w.y} r={w.size} fill="#FFFFFF" opacity={0.85} />
              ))}
            {weather === 'hellfire' &&
              weatherElements.map(w => (
                <Circle
                  key={`ember_${w.id}`}
                  cx={w.x}
                  cy={w.y}
                  r={w.size}
                  fill={w.id % 2 === 0 ? '#F97316' : '#EF4444'}
                  opacity={0.7}
                />
              ))}
            {weather === 'toxic' &&
              weatherElements.map(w => (
                <Circle key={`tox_${w.id}`} cx={w.x} cy={w.y} r={w.size} fill="#A3E635" opacity={0.6} />
              ))}
          </G>
        )}

        {/* 3. Mountain Silhouette */}
        <Path
          d={`M -400 320 Q ${worldWidth * 0.25} 210 ${worldWidth * 0.5} 265 Q ${worldWidth * 0.75} 200 ${worldWidth + 400} 280 L ${worldWidth + 400} ${worldHeight} L -400 ${worldHeight} Z`}
          fill="url(#mountainGrad)"
        />

        {/* 4. Pine Trees */}
        <G opacity={0.55}>
          {[0.12, 0.28, 0.48, 0.68, 0.84, 0.96].map((ratio, idx) => {
            const treeX = worldWidth * ratio;
            return (
              <G key={`tree_${idx}`} transform={`translate(${treeX}, 335)`}>
                <Path d="M 0 -50 L 16 -16 L -16 -16 Z" fill={weather === 'snow' ? '#93C5FD' : '#2DD4BF'} />
                <Path d="M 0 -72 L 13 -40 L -13 -40 Z" fill={weather === 'snow' ? '#BFDBFE' : '#5EEAD4'} />
                <Path d="M 0 -90 L 10 -60 L -10 -60 Z" fill={weather === 'snow' ? '#FFFFFF' : '#99F6E4'} />
                <Rect x="-2.5" y="-16" width="5" height="20" fill="#134E4A" />
              </G>
            );
          })}
        </G>

        {/* 5. Precomputed Static Platforms */}
        {precomputedPlatforms.map(p => (
          <G key={`plat_${p.id}`}>
            <Rect
              x={p.left}
              y={p.top}
              width={p.width}
              height={p.height}
              fill="url(#soilGrad)"
              rx="4"
            />
            {p.strataPath && <Path d={p.strataPath} fill="#0F172A" opacity={0.5} />}
            <Path d={p.grassTeethPath} fill="url(#grassGrad)" />
            <Line
              x1={p.left}
              y1={p.top + 2}
              x2={p.left + p.width}
              y2={p.top + 2}
              stroke="#A3E635"
              strokeWidth="2.5"
            />
          </G>
        ))}
      </G>
    );
  }
);

// ==========================================
// 2. DYNAMIC OBSTACLES & MOVING PLATFORMS
// ==========================================
interface DynamicObstaclesProps {
  obstacles: ObstacleEntity[];
  movingPlatforms: MovingPlatformEntity[];
}

export const DynamicObstacles: React.FC<DynamicObstaclesProps> = React.memo(({
  obstacles,
  movingPlatforms,
}) => {
  return (
    <G>
      {/* Moving Platforms */}
      {movingPlatforms.map(mp => {
        const left = mp.body.position.x - mp.width / 2;
        const top = mp.body.position.y - mp.height / 2;
        return (
          <G key={`mp_${mp.id}`}>
            <Rect
              x={left}
              y={top}
              width={mp.width}
              height={mp.height}
              fill="#334155"
              stroke="#64748B"
              strokeWidth="2"
              rx="4"
            />
            <Rect x={left + 3} y={top + 2} width={mp.width - 6} height="7" fill="#84CC16" rx="2" />
            <Circle cx={left + 8} cy={top + mp.height / 2} r="3" fill="#38BDF8" />
            <Circle cx={left + mp.width - 8} cy={top + mp.height / 2} r="3" fill="#38BDF8" />
          </G>
        );
      })}

      {/* Obstacles */}
      {obstacles.map(o => {
        if (o.isTriggered && o.type === 'crate') return null;
        if (o.isOpen && o.type === 'gate') return null;

        const left = o.body.position.x - o.width / 2;
        const top = o.body.position.y - o.height / 2;

        if (o.type === 'tnt') {
          return (
            <G key={`obs_${o.id}`} transform={`translate(${left}, ${top})`}>
              <Rect x="0" y="0" width={o.width} height={o.height} fill="url(#tntGrad)" rx="6" />
              <Line x1="0" y1="8" x2={o.width} y2="8" stroke="#18181B" strokeWidth="2.5" />
              <Line x1="0" y1={o.height - 8} x2={o.width} y2={o.height - 8} stroke="#18181B" strokeWidth="2.5" />
              <Rect
                x={o.width * 0.15}
                y={o.height * 0.3}
                width={o.width * 0.7}
                height={o.height * 0.4}
                fill="#FEF08A"
                rx="2"
              />
              <SvgText
                x={o.width / 2}
                y={o.height * 0.58}
                fill="#18181B"
                fontSize="10"
                fontWeight="900"
                textAnchor="middle"
              >
                TNT
              </SvgText>
            </G>
          );
        }

        if (o.type === 'crate') {
          return (
            <G key={`obs_${o.id}`} transform={`translate(${left}, ${top})`}>
              <Rect x="0" y="0" width={o.width} height={o.height} fill="#B45309" stroke="#78350F" strokeWidth="2" rx="3" />
              <Line x1="3" y1="3" x2={o.width - 3} y2={o.height - 3} stroke="#78350F" strokeWidth="2.5" />
              <Line x1={o.width - 3} y1="3" x2="3" y2={o.height - 3} stroke="#78350F" strokeWidth="2.5" />
            </G>
          );
        }

        if (o.type === 'rock') {
          return (
            <G key={`obs_${o.id}`} transform={`translate(${left}, ${top})`}>
              <Circle
                cx={o.width / 2}
                cy={o.height / 2}
                r={o.width / 2}
                fill="#64748B"
                stroke="#334155"
                strokeWidth="2.5"
              />
              <Path d={`M ${o.width * 0.3} ${o.height * 0.2} L ${o.width * 0.5} ${o.height * 0.6} L ${o.width * 0.7} ${o.height * 0.4}`} stroke="#1E293B" strokeWidth="1.5" fill="none" />
            </G>
          );
        }

        if (o.type === 'spikes') {
          const spikeCount = Math.max(3, Math.floor(o.width / 14));
          const sw = o.width / spikeCount;
          let spikesPath = `M ${left} ${top + o.height}`;
          for (let i = 0; i < spikeCount; i++) {
            const sx = left + i * sw;
            spikesPath += ` L ${sx + sw * 0.5} ${top} L ${sx + sw} ${top + o.height}`;
          }
          return (
            <Path
              key={`obs_${o.id}`}
              d={spikesPath}
              fill="#94A3B8"
              stroke="#475569"
              strokeWidth="1.5"
            />
          );
        }

        if (o.type === 'bounce_pad') {
          return (
            <G key={`obs_${o.id}`} transform={`translate(${left}, ${top})`}>
              <Path
                d={`M ${o.width * 0.3} ${o.height} L ${o.width * 0.7} ${o.height * 0.7} L ${o.width * 0.3} ${o.height * 0.4} L ${o.width * 0.7} 4`}
                stroke="#64748B"
                strokeWidth="2.5"
                fill="none"
              />
              <Rect x="0" y="0" width={o.width} height="6" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" rx="2" />
            </G>
          );
        }

        if (o.type === 'switch') {
          return (
            <G key={`obs_${o.id}`} transform={`translate(${left}, ${top})`}>
              <Circle cx={o.width / 2} cy={o.height / 2} r={o.width / 2} fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
              <Circle cx={o.width / 2} cy={o.height / 2} r={o.width / 3} fill="#FFFFFF" />
              <Circle cx={o.width / 2} cy={o.height / 2} r={o.width / 6} fill="#EF4444" />
            </G>
          );
        }

        if (o.type === 'gate') {
          return (
            <G key={`obs_${o.id}`} transform={`translate(${left}, ${top})`}>
              <Rect x="0" y="0" width={o.width} height={o.height} fill="#475569" stroke="#1E293B" strokeWidth="2" rx="2" />
              <Line x1={o.width * 0.3} y1="0" x2={o.width * 0.3} y2={o.height} stroke="#0F172A" strokeWidth="2" />
              <Line x1={o.width * 0.7} y1="0" x2={o.width * 0.7} y2={o.height} stroke="#0F172A" strokeWidth="2" />
            </G>
          );
        }

        if (o.type === 'portal') {
          const isBlue = o.targetPortalId !== undefined;
          return (
            <G key={`obs_${o.id}`} transform={`translate(${left}, ${top})`}>
              <Rect
                x="0"
                y="0"
                width={o.width}
                height={o.height}
                rx={o.width / 2}
                fill={isBlue ? 'url(#bluePortal)' : 'url(#orangePortal)'}
                opacity={0.88}
              />
              <Rect
                x="4"
                y="4"
                width={o.width - 8}
                height={o.height - 8}
                rx={(o.width - 8) / 2}
                fill="#FFFFFF"
                opacity={0.6}
              />
            </G>
          );
        }

        if (o.type === 'wind') {
          return (
            <G key={`obs_${o.id}`} opacity={0.35}>
              <Path d={`M ${left} ${top + 30} Q ${left + o.width * 0.5} ${top + 15} ${left + o.width} ${top + 30}`} stroke="#38BDF8" strokeWidth="2.5" fill="none" strokeDasharray="6, 8" />
              <Path d={`M ${left + 15} ${top + 80} Q ${left + o.width * 0.5} ${top + 95} ${left + o.width} ${top + 75}`} stroke="#38BDF8" strokeWidth="2" fill="none" strokeDasharray="5, 7" />
              <Path d={`M ${left} ${top + 140} Q ${left + o.width * 0.5} ${top + 125} ${left + o.width} ${top + 140}`} stroke="#38BDF8" strokeWidth="2.5" fill="none" strokeDasharray="6, 8" />
            </G>
          );
        }

        return null;
      })}
    </G>
  );
});
