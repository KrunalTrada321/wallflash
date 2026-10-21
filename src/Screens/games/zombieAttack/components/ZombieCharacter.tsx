import React from 'react';
import Svg, { Circle, Line, Path, Rect, G, Ellipse } from 'react-native-svg';
import { ZombieEntity } from '../types/gameTypes';

interface ZombieCharacterProps {
  zombie: ZombieEntity;
}

export const ZombieCharacter: React.FC<ZombieCharacterProps> = React.memo(({ zombie }) => {
  const {
    body,
    type,
    health,
    maxHealth,
    state,
    facingLeft,
    walkCycle,
    hitFlashTimer,
    armorLost,
    width,
    height,
  } = zombie;

  if (health <= 0) return null;

  const x = body.position.x;
  const y = body.position.y;

  // Flash color if hit
  const isHitFlash = hitFlashTimer > 0;
  const skinColor = isHitFlash ? '#FFFFFF' : '#84CC16'; // Cartoon zombie lime green
  const stickColor = isHitFlash ? '#FFFFFF' : '#4D7C0F'; // Darker olive green for limbs
  const shirtColor = isHitFlash ? '#E2E8F0' : '#334155'; // Tattered dark slate shirt
  const pantsColor = isHitFlash ? '#CBD5E1' : '#475569'; // Torn ragged trousers

  // Dynamic limp / drag shambling walk animation (authentic zombie gait!)
  const isWalking = state === 'walk';
  const legAngle1 = isWalking ? Math.sin(walkCycle) * 26 : 0;
  const legAngle2 = isWalking ? Math.sin(walkCycle - 1.4) * 18 + 6 : 0; // Limp drag stride
  const shambleBobY = isWalking ? Math.sin(walkCycle * 2) * 2.2 : 0;
  const shambleTilt = isWalking ? Math.sin(walkCycle) * 4 : 0;
  const armBob = isWalking ? Math.cos(walkCycle) * 7 : 0;

  // Facing direction multiplier
  const scaleX = facingLeft ? -1 : 1;

  // Size scale factors
  const isGiant = type === 'giant';
  const isBoss = type === 'boss';
  const headRadius = isBoss ? 26 : isGiant ? 20 : 13;
  const torsoHeight = isBoss ? 42 : isGiant ? 34 : 24;
  const legLength = isBoss ? 38 : isGiant ? 30 : 22;

  return (
    <G transform={`translate(${x}, ${y})`}>
      {/* Overhead Health Bar for Boss or Tough Enemies */}
      {(isBoss || isGiant || maxHealth > 1) && (
        <G transform={`translate(${-width / 2}, ${-height / 2 - 20})`}>
          {/* Background Bar */}
          <Rect x="0" y="0" width={width} height="6" rx="3" fill="#1F2937" />
          {/* Health Fill */}
          <Rect
            x="0"
            y="0"
            width={Math.max(0, (width * health) / maxHealth)}
            height="6"
            rx="3"
            fill={health > 1 ? '#EF4444' : '#F59E0B'}
          />
        </G>
      )}

      {/* Mirrored Group for Facing Direction */}
      <G transform={`scale(${scaleX}, 1)`}>
        {/* Ground Contact Shadow */}
        <Ellipse
          cx="0"
          cy={torsoHeight / 2 + legLength}
          rx={isBoss ? 24 : isGiant ? 18 : 13}
          ry="3.5"
          fill="#000000"
          opacity={0.28}
        />

        {/* Shambling Torso & Limbs Group */}
        <G transform={`translate(0, ${shambleBobY}) rotate(${shambleTilt}, 0, ${torsoHeight / 2})`}>
          {/* Shambling Legs */}
          <G transform={`translate(0, ${torsoHeight / 2})`}>
            {/* Back Dragging Leg */}
            <G transform={`rotate(${legAngle2}, 0, 0)`}>
              <Line
                x1="0"
                y1="0"
                x2="-6"
                y2={legLength}
                stroke={stickColor}
                strokeWidth={isBoss ? 6 : isGiant ? 5 : 4}
                strokeLinecap="round"
              />
              {/* Shuffling Foot */}
              <Line
                x1="-6"
                y1={legLength}
                x2="-13"
                y2={legLength}
                stroke={stickColor}
                strokeWidth={isBoss ? 6 : isGiant ? 5 : 4}
                strokeLinecap="round"
              />
            </G>

            {/* Front Stepping Leg */}
            <G transform={`rotate(${legAngle1}, 0, 0)`}>
              <Line
                x1="0"
                y1="0"
                x2="6"
                y2={legLength}
                stroke={stickColor}
                strokeWidth={isBoss ? 6 : isGiant ? 5 : 4}
                strokeLinecap="round"
              />
              {/* Shuffling Foot */}
              <Line
                x1="6"
                y1={legLength}
                x2="14"
                y2={legLength}
                stroke={stickColor}
                strokeWidth={isBoss ? 6 : isGiant ? 5 : 4}
                strokeLinecap="round"
              />
            </G>
          </G>

          {/* Ripped Shorts / Tattered Pants */}
          <Path
            d={`M -6 ${torsoHeight * 0.25} L 7 ${torsoHeight * 0.25} L 8 ${torsoHeight * 0.58} L 4 ${torsoHeight * 0.5} L 0 ${torsoHeight * 0.62} L -4 ${torsoHeight * 0.52} L -7 ${torsoHeight * 0.58} Z`}
            fill={pantsColor}
            stroke="#1E293B"
            strokeWidth="1"
          />

          {/* Hunched Spine Leaning Forward */}
          <Path
            d={`M 0 ${torsoHeight / 2} Q 5 0 7 ${-torsoHeight / 2}`}
            stroke={stickColor}
            strokeWidth={isBoss ? 7 : isGiant ? 5.5 : 4.5}
            fill="none"
            strokeLinecap="round"
          />

          {/* Tattered Torn Shirt with Jagged Hem */}
          <Path
            d={`M 1 ${-torsoHeight / 2 + 1} L 11 ${-torsoHeight / 2 + 3} L 10 ${torsoHeight * 0.25} L 6 ${torsoHeight * 0.25 - 3} L 2 ${torsoHeight * 0.25 + 2} L -2 ${torsoHeight * 0.25 - 2} L -6 ${torsoHeight * 0.25 + 2} L -5 ${-torsoHeight / 2 + 1} Z`}
            fill={shirtColor}
            stroke="#0F172A"
            strokeWidth="1.2"
          />

          {/* Exposed Rib Bones on Side */}
          <Line
            x1="2"
            y1={-torsoHeight * 0.15}
            x2="8"
            y2={-torsoHeight * 0.15}
            stroke="#F8FAFC"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <Line
            x1="2"
            y1={0}
            x2="9"
            y2={0}
            stroke="#F8FAFC"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <Line
            x1="2"
            y1={torsoHeight * 0.15}
            x2="7"
            y2={torsoHeight * 0.15}
            stroke="#F8FAFC"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Outstretched Zombie Arms */}
          <G transform={`translate(4, ${-torsoHeight / 4 + armBob})`}>
            {state === 'attack' ? (
              // Vicious slashing claws posture
              <G>
                <Line
                  x1="0"
                  y1="0"
                  x2="24"
                  y2="-16"
                  stroke={stickColor}
                  strokeWidth={isBoss ? 6 : isGiant ? 5 : 4}
                  strokeLinecap="round"
                />
                <Line
                  x1="0"
                  y1="2"
                  x2="28"
                  y2="-8"
                  stroke={stickColor}
                  strokeWidth={isBoss ? 6 : isGiant ? 5 : 4}
                  strokeLinecap="round"
                />
                {/* Claw Slash Swoosh Arcs */}
                <Path
                  d="M 22 -22 Q 36 -6 24 10"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  opacity={0.9}
                />
                <Path
                  d="M 26 -16 Q 40 0 28 16"
                  stroke="#DC2626"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  opacity={0.75}
                />
                {/* Sharp Blood-Tipped Claws */}
                <Line x1="24" y1="-16" x2="29" y2="-19" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                <Line x1="28" y1="-8" x2="33" y2="-10" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
              </G>
            ) : (
              // Relentless reaching undead arms with drooping elbows
              <G>
                <Path
                  d={`M 0 0 Q ${isBoss ? 18 : 12} 4 ${isBoss ? 32 : isGiant ? 24 : 17} 2`}
                  stroke={stickColor}
                  strokeWidth={isBoss ? 6 : isGiant ? 5 : 3.8}
                  fill="none"
                  strokeLinecap="round"
                />
                <Path
                  d={`M 0 3 Q ${isBoss ? 16 : 10} 7 ${isBoss ? 30 : isGiant ? 22 : 15} 6`}
                  stroke={stickColor}
                  strokeWidth={isBoss ? 6 : isGiant ? 5 : 3.8}
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Gnarled Fingernail Claws */}
                <Line
                  x1={isBoss ? 32 : isGiant ? 24 : 17}
                  y1="2"
                  x2={isBoss ? 36 : isGiant ? 28 : 20}
                  y2="0"
                  stroke="#365314"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <Line
                  x1={isBoss ? 30 : isGiant ? 22 : 15}
                  y1="6"
                  x2={isBoss ? 34 : isGiant ? 26 : 18}
                  y2="4"
                  stroke="#365314"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </G>
            )}

            {/* Exploding Zombie Bomb */}
            {type === 'exploding' && (
              <G transform="translate(18, 4)">
                <Circle cx="0" cy="0" r="8" fill="#18181B" stroke="#27272A" strokeWidth="1" />
                <Path d="M 0 -8 Q 3 -13 6 -12" stroke="#D97706" strokeWidth="2" fill="none" />
                <Circle cx="7" cy="-12" r="2.5" fill="#EF4444" />
              </G>
            )}
          </G>

          {/* Flying Wings for Flying Zombie */}
          {type === 'flying' && (
            <G transform={`translate(0, ${-torsoHeight / 2})`}>
              <Path
                d="M 0 0 Q -18 -20 -28 -6 Q -18 -2 0 4 Z"
                fill="#475569"
                opacity={0.9}
              />
            </G>
          )}

          {/* Real Zombie Head (Hunched Forward with Slack Drooling Jaw) */}
          <G transform={`translate(7, ${-torsoHeight / 2 - headRadius + 2})`}>
            {/* Green Head Base */}
            <Circle
              cx="0"
              cy="0"
              r={headRadius}
              fill={skinColor}
              stroke="#15803D"
              strokeWidth="2.5"
            />

            {/* Exposed Pink Brain Hemisphere */}
            <Path
              d={`M ${-headRadius * 0.55} ${-headRadius * 0.5} Q 0 ${-headRadius * 1.15} ${headRadius * 0.4} ${-headRadius * 0.55} Q 0 ${-headRadius * 0.35} ${-headRadius * 0.55} ${-headRadius * 0.5} Z`}
              fill="#F472B6"
              stroke="#BE185D"
              strokeWidth="1.2"
            />

            {/* Brain convolutions */}
            <Path
              d={`M ${-headRadius * 0.3} ${-headRadius * 0.75} Q ${-headRadius * 0.05} ${-headRadius * 0.85} ${headRadius * 0.15} ${-headRadius * 0.7}`}
              stroke="#DB2777"
              strokeWidth="1"
              fill="none"
            />

            {/* Forehead Stitches */}
            <Line
              x1={-headRadius * 0.4}
              y1={-headRadius * 0.15}
              x2={headRadius * 0.35}
              y2={-headRadius * 0.15}
              stroke="#365314"
              strokeWidth="1.5"
            />
            <Line
              x1={-headRadius * 0.1}
              y1={-headRadius * 0.28}
              x2={-headRadius * 0.1}
              y2={-headRadius * 0.02}
              stroke="#365314"
              strokeWidth="1.5"
            />
            <Line
              x1={headRadius * 0.18}
              y1={-headRadius * 0.28}
              x2={headRadius * 0.18}
              y2={-headRadius * 0.02}
              stroke="#365314"
              strokeWidth="1.5"
            />

            {/* Sunken Dark Eye Sockets with Glowing Eyes */}
            <G>
              {/* Big Left Eye Socket */}
              <Circle
                cx={headRadius * 0.25}
                cy="-1"
                r={headRadius * 0.38}
                fill="#1E293B"
                opacity={0.8}
              />
              <Circle
                cx={headRadius * 0.25}
                cy="-1"
                r={headRadius * 0.3}
                fill="#FFFFFF"
                stroke="#15803D"
                strokeWidth="1.2"
              />
              <Circle
                cx={headRadius * 0.32}
                cy="-1"
                r={headRadius * 0.15}
                fill="#DC2626"
              />
              <Circle
                cx={headRadius * 0.35}
                cy="-1.5"
                r={headRadius * 0.06}
                fill="#FEF08A"
              />

              {/* Small Derpy Right Eye Socket */}
              <Circle
                cx={-headRadius * 0.3}
                cy="-2"
                r={headRadius * 0.28}
                fill="#1E293B"
                opacity={0.8}
              />
              <Circle
                cx={-headRadius * 0.3}
                cy="-2"
                r={headRadius * 0.22}
                fill="#FFFFFF"
                stroke="#15803D"
                strokeWidth="1.2"
              />
              <Circle
                cx={-headRadius * 0.3}
                cy="-2"
                r={headRadius * 0.1}
                fill="#111827"
              />
            </G>

            {/* Slack Dropped Undead Mouth with Rotten Teeth */}
            <G>
              {/* Mouth Cavity */}
              <Path
                d={`M ${-headRadius * 0.3} ${headRadius * 0.35} Q ${headRadius * 0.2} ${headRadius * 0.25} ${headRadius * 0.45} ${headRadius * 0.5} Q ${headRadius * 0.1} ${headRadius * 0.8} ${-headRadius * 0.3} ${headRadius * 0.35} Z`}
                fill="#1F2937"
                stroke="#15803D"
                strokeWidth="1.5"
              />
              {/* Rotten Yellow Teeth */}
              <Rect
                x={headRadius * 0.05}
                y={headRadius * 0.32}
                width="3"
                height="3.5"
                fill="#FEF08A"
                stroke="#CA8A04"
                strokeWidth="0.8"
              />
              <Rect
                x={headRadius * 0.22}
                y={headRadius * 0.34}
                width="2.5"
                height="3"
                fill="#FEF08A"
                stroke="#CA8A04"
                strokeWidth="0.8"
              />
              {/* Drooping Pink Tongue */}
              <Path
                d={`M ${headRadius * 0.15} ${headRadius * 0.45} Q ${headRadius * 0.42} ${headRadius * 0.82} ${headRadius * 0.52} ${headRadius * 0.92} Q ${headRadius * 0.12} ${headRadius * 0.92} ${headRadius * 0.15} ${headRadius * 0.45} Z`}
                fill="#FB7185"
                stroke="#E11D48"
                strokeWidth="1"
              />
              {/* Toxic Green Drool Bead */}
              <Circle
                cx={headRadius * 0.52}
                cy={headRadius * 0.98}
                r="1.8"
                fill="#84CC16"
                stroke="#65A30D"
                strokeWidth="0.6"
              />
            </G>

            {/* Runner Headband */}
            {type === 'runner' && (
              <G>
                <Rect
                  x={-headRadius - 1}
                  y={-headRadius * 0.3}
                  width={headRadius * 2 + 2}
                  height="5"
                  fill="#DC2626"
                  rx="1"
                />
                <Path
                  d={`M ${-headRadius} ${-headRadius * 0.2} L ${-headRadius - 6} ${-headRadius * 0.5}`}
                  stroke="#DC2626"
                  strokeWidth="3"
                />
              </G>
            )}

            {/* Armored Viking Helmet */}
            {type === 'armored' && !armorLost && (
              <G>
                <Path
                  d={`M ${-headRadius - 2} 0 Q 0 ${-headRadius * 1.5} ${headRadius + 2} 0 Z`}
                  fill="#94A3B8"
                  stroke="#475569"
                  strokeWidth="2"
                />
                {/* Horns */}
                <Path
                  d={`M ${-headRadius} ${-headRadius * 0.5} Q ${-headRadius - 10} ${-headRadius * 1.1} ${-headRadius - 6} ${-headRadius * 1.4}`}
                  stroke="#F1F5F9"
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <Path
                  d={`M ${headRadius} ${-headRadius * 0.5} Q ${headRadius + 10} ${-headRadius * 1.1} ${headRadius + 6} ${-headRadius * 1.4}`}
                  stroke="#F1F5F9"
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </G>
            )}

            {/* Boss Crown */}
            {isBoss && (
              <G transform="translate(0, -26)">
                <Path
                  d="M -18 0 L -18 -12 L -9 -4 L 0 -14 L 9 -4 L 18 -12 L 18 0 Z"
                  fill="#FBBF24"
                  stroke="#B45309"
                  strokeWidth="2"
                />
                <Circle cx="0" cy="-6" r="3" fill="#EF4444" />
              </G>
            )}
          </G>
        </G>
      </G>
    </G>
  );
});
