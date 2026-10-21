import React from 'react';
import Svg, { Circle, Line, Path, G, Ellipse, Rect } from 'react-native-svg';

interface PlayerArcherProps {
  x: number;
  y: number;
  aimAngle: number;
  pullDistance: number; // 0 to 1
  isAiming: boolean;
  isVictorious?: boolean;
  isDefeated?: boolean;
  nearestZombieDist?: number;
}

export const PlayerArcher: React.FC<PlayerArcherProps> = React.memo(({
  x,
  y,
  aimAngle,
  pullDistance,
  isAiming,
  isVictorious = false,
  isDefeated = false,
  nearestZombieDist = 999,
}) => {
  const isScared = nearestZombieDist < 160 && !isVictorious && !isDefeated;

  const bowRadius = 24;
  const pullOffset = pullDistance * 20;
  const angleDeg = (aimAngle * 180) / Math.PI;

  // Archer leans backwards when pulling bowstring (authentic reverse-pull tension!)
  const leanBackX = isAiming ? -pullDistance * 6 : 0;
  const leanBackY = isAiming ? pullDistance * 1.5 : 0;

  // Solid hip joint anchored to the torso base
  const hipX = leanBackX;
  const hipY = 18 + leanBackY;

  return (
    <G transform={`translate(${x}, ${y})`}>
      {/* Ground Contact Shadow - Firmly planted on platform */}
      <Ellipse
        cx={leanBackX * 0.3}
        cy={50}
        rx={24}
        ry={4.5}
        fill="#000000"
        opacity={0.3}
      />

      {/* Stickman Legs & Grounded Boots */}
      {isDefeated ? (
        <G>
          <Line x1={hipX} y1={hipY} x2="-22" y2="48" stroke="#111827" strokeWidth="4.5" strokeLinecap="round" />
          <Line x1={hipX} y1={hipY} x2="18" y2="48" stroke="#111827" strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="-22" y1="48" x2="-28" y2="50" stroke="#111827" strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="18" y1="48" x2="26" y2="50" stroke="#111827" strokeWidth="4.5" strokeLinecap="round" />
        </G>
      ) : (
        <G>
          {/* Left Leg & Boot */}
          <Line
            x1={hipX}
            y1={hipY}
            x2={-14 + leanBackX * 0.3}
            y2="50"
            stroke="#111827"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <Path
            d={`M ${-14 + leanBackX * 0.3} 50 L ${-23 + leanBackX * 0.3} 50`}
            stroke="#111827"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Right Leg & Boot */}
          <Line
            x1={hipX}
            y1={hipY}
            x2="14"
            y2="50"
            stroke="#111827"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <Path
            d="M 14 50 L 23 50"
            stroke="#111827"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Solid Hip Joint Node - Completely joins torso and legs */}
          <Circle cx={hipX} cy={hipY} r="3.5" fill="#111827" />

          {/* Grass Blades embedding boots into the ground */}
          <Path
            d={`M ${-22 + leanBackX * 0.3} 51 L ${-20 + leanBackX * 0.3} 45 M ${-15 + leanBackX * 0.3} 51 L ${-13 + leanBackX * 0.3} 43 M 12 51 L 14 44 M 20 51 L 22 46`}
            stroke="#65A30D"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </G>
      )}

      {/* Torso & Head (leans backwards with archery draw tension) */}
      <G transform={`translate(${leanBackX}, ${leanBackY})`}>
        {/* Quiver on Back */}
        <G transform="translate(-10, -4) rotate(22)">
          <Path d="M -5 -16 L 5 -16 L 4 14 L -4 14 Z" fill="#92400E" stroke="#78350F" strokeWidth="1.5" />
          <Line x1="-2" y1="-16" x2="-2" y2="-22" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" />
          <Line x1="1" y1="-16" x2="2" y2="-24" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" />
          <Line x1="-4" y1="-12" x2="4" y2="-12" stroke="#FBBF24" strokeWidth="1.5" />
        </G>

        {/* Stickman Spine Base */}
        <Line x1="0" y1="-12" x2="0" y2="18" stroke="#111827" strokeWidth="4.5" strokeLinecap="round" />

        {/* Heroic Archer Green Tunic / Vest */}
        <Path
          d="M -6 -10 L 6 -10 L 5 15 L -5 15 Z"
          fill="#166534"
          stroke="#14532D"
          strokeWidth="1.2"
        />
        {/* Tunic Golden Lacing */}
        <Line x1="0" y1="-8" x2="0" y2="10" stroke="#FBBF24" strokeWidth="1" strokeDasharray="2, 2" />

        {/* Leather Belt & Gold Buckle */}
        <Line x1="-6" y1="12" x2="6" y2="12" stroke="#78350F" strokeWidth="3" />
        <Rect x="-2.5" y="10.5" width="5" height="3" rx="0.8" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />

        {/* Neck & Shoulder Joint Circles */}
        <Circle cx="0" cy="-12" r="3" fill="#111827" />
        <Circle cx="0" cy="-4" r="3" fill="#111827" />

        {/* Head */}
        <G transform="translate(0, -25)">
          <Circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#111827" strokeWidth="3" />

          {/* Robin Hood Archer Cap with Feather */}
          <Path
            d="M -16 -4 Q 0 -18 16 -4 Q 8 -12 -16 -4 Z"
            fill="#65A30D"
            stroke="#15803D"
            strokeWidth="1.5"
          />
          <Path
            d="M 6 -12 Q 14 -22 18 -20 Q 14 -14 8 -10 Z"
            fill="#F59E0B"
            stroke="#D97706"
            strokeWidth="1"
          />

          {/* Facial Expressions */}
          {isDefeated ? (
            <G stroke="#111827" strokeWidth="2.5" strokeLinecap="round">
              <Line x1="-7" y1="-4" x2="-2" y2="1" />
              <Line x1="-2" y1="-4" x2="-7" y2="1" />
              <Line x1="2" y1="-4" x2="7" y2="1" />
              <Line x1="7" y1="-4" x2="2" y2="1" />
              <Line x1="-4" y1="7" x2="4" y2="7" strokeWidth="2" />
            </G>
          ) : isVictorious ? (
            <G>
              <Circle cx="4" cy="-2" r="2.5" fill="#111827" />
              <Path d="M -7 -2 Q -4 -5 -1 -2" stroke="#111827" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <Path d="M -5 4 Q 0 9 5 4" stroke="#111827" strokeWidth="2.5" fill="#EF4444" strokeLinecap="round" />
            </G>
          ) : isScared ? (
            <G>
              <Circle cx="-4" cy="-2" r="2.5" fill="#111827" />
              <Circle cx="4" cy="-2" r="2.5" fill="#111827" />
              <Circle cx="0" cy="6" r="3" fill="none" stroke="#111827" strokeWidth="2" />
              <Path d="M 8 -10 Q 12 -5 10 -3 Q 8 -1 7 -4 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
            </G>
          ) : isAiming ? (
            <G>
              <Circle cx="4" cy="-2" r="2.5" fill="#111827" />
              <Line x1="-7" y1="-2" x2="-1" y2="-2" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
              <Line x1="0" y1="5" x2="6" y2="5" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
            </G>
          ) : (
            <G>
              <Circle cx="-3" cy="-2" r="2.2" fill="#111827" />
              <Circle cx="4" cy="-2" r="2.2" fill="#111827" />
              <Path d="M -3 5 Q 0 7 3 5" stroke="#111827" strokeWidth="2" fill="none" strokeLinecap="round" />
            </G>
          )}
        </G>

        {/* Arms & Bow */}
        {!isDefeated && (
          <G transform={`rotate(${angleDeg}, 0, -4)`}>
            {/* Front Arm Holding Bow Handle */}
            <Line
              x1="0"
              y1="-4"
              x2={bowRadius - 2}
              y2="0"
              stroke="#111827"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Leather Arm Bracer */}
            <Line
              x1={bowRadius * 0.35}
              y1="-3"
              x2={bowRadius * 0.72}
              y2="-1"
              stroke="#92400E"
              strokeWidth="4.8"
              strokeLinecap="round"
            />
            {/* Front Hand Node holding the bow */}
            <Circle cx={bowRadius - 2} cy="0" r="2.5" fill="#111827" />

            {/* Recurve Bow Body */}
            <Path
              d={`M ${bowRadius - 4} -${bowRadius + 8} Q ${bowRadius + 14} 0 ${bowRadius - 4} ${bowRadius + 8}`}
              stroke="#854D0E"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            {/* Leather Center Grip Wrap */}
            <Line
              x1={bowRadius + 1}
              y1="-5"
              x2={bowRadius + 1}
              y2="5"
              stroke="#78350F"
              strokeWidth="5.5"
              strokeLinecap="round"
            />

            {/* Bowstring Tension - V-point drawn back */}
            <Path
              d={`M ${bowRadius - 4} -${bowRadius + 8} L ${-pullOffset + 2} 0 L ${bowRadius - 4} ${bowRadius + 8}`}
              stroke="#E2E8F0"
              strokeWidth="1.8"
              fill="none"
            />

            {/* Arrow Loaded on String while Aiming */}
            {isAiming && (
              <G transform={`translate(${-pullOffset + 2}, 0)`}>
                <Line x1="0" y1="0" x2={bowRadius + 14} y2="0" stroke="#78350F" strokeWidth="3" />
                <Path
                  d={`M ${bowRadius + 14} 0 L ${bowRadius + 8} -4 L ${bowRadius + 8} 4 Z`}
                  fill="#94A3B8"
                />
                <Path d="M 0 0 L -6 -4 M 0 0 L -6 4" stroke="#DC2626" strokeWidth="2.5" />
              </G>
            )}

            {/* Back Arm Pulling Bowstring: Shoulder (0, -4) -> Elbow -> Hand right at (-pullOffset + 2, 0) */}
            {isAiming ? (
              <G>
                {/* Upper arm to elbow */}
                <Line
                  x1="0"
                  y1="-4"
                  x2={-10 - pullOffset * 0.4}
                  y2={-6 - pullOffset * 0.2}
                  stroke="#111827"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Forearm from elbow to hand on bowstring */}
                <Line
                  x1={-10 - pullOffset * 0.4}
                  y1={-6 - pullOffset * 0.2}
                  x2={-pullOffset + 2}
                  y2="0"
                  stroke="#111827"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Elbow joint circle */}
                <Circle cx={-10 - pullOffset * 0.4} cy={-6 - pullOffset * 0.2} r="2.2" fill="#111827" />
                {/* Back Hand holding string nock - EXACTLY attached, 0px gap! */}
                <Circle cx={-pullOffset + 2} cy="0" r="2.6" fill="#111827" />
              </G>
            ) : (
              <G>
                {/* Idle rest arm */}
                <Line
                  x1="0"
                  y1="-4"
                  x2="-8"
                  y2="6"
                  stroke="#111827"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <Circle cx="-8" cy="6" r="2.4" fill="#111827" />
              </G>
            )}
          </G>
        )}
      </G>
    </G>
  );
});
