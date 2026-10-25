import React from 'react';
import Svg, { Circle, Line, Path, Rect, G, Ellipse } from 'react-native-svg';
import { ZombieEntity } from '../types/gameTypes';

interface ZombieCharacterProps {
  zombie: ZombieEntity;
}

export const ZombieCharacter: React.FC<ZombieCharacterProps> = ({ zombie }) => {
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

  // Flash / Elemental color states
  const isFrozen = !!zombie.isFrozen;
  const isBurning = !!zombie.isBurning;
  const isHitFlash = hitFlashTimer > 0;

  const skinColor = isFrozen ? '#BAE6FD' : isBurning ? '#F97316' : isHitFlash ? '#FFFFFF' : '#84CC16';
  const stickColor = isFrozen ? '#38BDF8' : isBurning ? '#C2410C' : isHitFlash ? '#FFFFFF' : '#4D7C0F';
  const shirtColor = isFrozen ? '#0284C7' : isBurning ? '#7C2D12' : isHitFlash ? '#E2E8F0' : '#334155';
  const pantsColor = isFrozen ? '#0369A1' : isBurning ? '#431407' : isHitFlash ? '#CBD5E1' : '#475569';

  // Dynamic locomotion animations: walk, run, climb, jump, ferocious attack
  const isAttacking = state === 'attack' && !isFrozen;
  const attackPhase = (zombie.attackTimer ?? 0) * 16;
  const isWalking = state === 'walk' && !isFrozen;
  const isClimbing = state === 'climb' && !isFrozen;
  const isJumping = (state === 'jump' || !zombie.isGrounded) && !isFrozen;
  const isRunner = type === 'runner';

  const legAngle1 = isClimbing
    ? Math.sin(walkCycle * 2) * 26
    : isJumping
    ? 30
    : isAttacking
    ? Math.sin(attackPhase) * 14
    : isWalking
    ? Math.sin(walkCycle) * (isRunner ? 36 : 26)
    : 0;

  const legAngle2 = isClimbing
    ? -Math.sin(walkCycle * 2) * 26
    : isJumping
    ? 44
    : isAttacking
    ? -Math.sin(attackPhase) * 12
    : isWalking
    ? Math.sin(walkCycle - 1.4) * (isRunner ? 26 : 18) + (isRunner ? 10 : 6)
    : 0;

  const shambleBobY = isClimbing
    ? Math.sin(walkCycle * 3) * 1.5
    : isJumping
    ? -6
    : isAttacking
    ? Math.sin(attackPhase) * 3
    : isWalking
    ? Math.sin(walkCycle * 2) * (isRunner ? 3.5 : 2.2)
    : 0;

  const shambleTilt = isClimbing
    ? -10 // Leaning chest against the wall while scrambling up
    : isJumping
    ? -18 // Dynamic forward trajectory leap lean
    : isAttacking
    ? -22 + Math.sin(attackPhase) * 8 // Aggressive ferocious forward lunge towards player!
    : isWalking
    ? (isRunner ? -14 : 0) + Math.sin(walkCycle) * (isRunner ? 6 : 4)
    : 0;

  const armBob = isWalking ? Math.cos(walkCycle) * (isRunner ? 12 : 7) : isJumping ? -12 : 0;

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

      {/* Solid Ice Block Overlay when Frozen */}
      {isFrozen && (
        <G transform={`translate(${-width / 2 - 5}, ${-height / 2 - 6})`}>
          <Rect
            x="0"
            y="0"
            width={width + 10}
            height={height + 12}
            rx="8"
            fill="rgba(56, 189, 248, 0.4)"
            stroke="#BAE6FD"
            strokeWidth="2.2"
          />
          {/* Frosted glint corners */}
          <Line x1="4" y1="4" x2={width * 0.4} y2="4" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <Line x1="4" y1="4" x2="4" y2={height * 0.28} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <Line x1={width + 6} y1={height + 8} x2={width + 6} y2={height * 0.72} stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
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
        <G transform={`translate(${isAttacking ? 10 + Math.sin(attackPhase) * 6 : 0}, ${shambleBobY}) rotate(${shambleTilt}, 0, ${torsoHeight / 2})`}>
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
              // Ferocious, animated slashing claws attacking the player!
              <G>
                {/* Arm 1: Slashing down and forward */}
                <Line
                  x1="0"
                  y1="0"
                  x2={26 + Math.cos(attackPhase) * 14}
                  y2={-10 + Math.sin(attackPhase) * 18}
                  stroke={stickColor}
                  strokeWidth={isBoss ? 6.5 : isGiant ? 5.5 : 4.5}
                  strokeLinecap="round"
                />
                {/* Arm 2: Alternating vicious claw rip */}
                <Line
                  x1="0"
                  y1="3"
                  x2={24 + Math.cos(attackPhase + 2.2) * 12}
                  y2={4 + Math.sin(attackPhase + 2.2) * 16}
                  stroke={stickColor}
                  strokeWidth={isBoss ? 6.5 : isGiant ? 5.5 : 4.5}
                  strokeLinecap="round"
                />
                {/* Dynamic animated claw slash swoosh arcs */}
                <Path
                  d={`M ${18 + Math.cos(attackPhase) * 12} ${-24 + Math.sin(attackPhase) * 16} Q ${38 + Math.cos(attackPhase) * 16} ${-6 + Math.sin(attackPhase) * 16} ${20 + Math.cos(attackPhase) * 12} ${14 + Math.sin(attackPhase) * 16}`}
                  stroke="#EF4444"
                  strokeWidth="3.2"
                  fill="none"
                  strokeLinecap="round"
                  opacity={0.92}
                />
                <Path
                  d={`M ${22 + Math.cos(attackPhase + 2.2) * 10} ${-18 + Math.sin(attackPhase + 2.2) * 14} Q ${42 + Math.cos(attackPhase + 2.2) * 14} ${2 + Math.sin(attackPhase + 2.2) * 14} ${24 + Math.cos(attackPhase + 2.2) * 10} ${20 + Math.sin(attackPhase + 2.2) * 14}`}
                  stroke="#DC2626"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  opacity={0.8}
                />
                {/* Blood-dripping razor claws */}
                <Line
                  x1={26 + Math.cos(attackPhase) * 14}
                  y1={-10 + Math.sin(attackPhase) * 18}
                  x2={33 + Math.cos(attackPhase) * 14}
                  y2={-13 + Math.sin(attackPhase) * 18}
                  stroke="#EF4444"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <Line
                  x1={24 + Math.cos(attackPhase + 2.2) * 12}
                  y1={4 + Math.sin(attackPhase + 2.2) * 16}
                  x2={31 + Math.cos(attackPhase + 2.2) * 12}
                  y2={1 + Math.sin(attackPhase + 2.2) * 16}
                  stroke="#DC2626"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                {/* Flying blood droplets from claws */}
                <Circle cx={36 + Math.cos(attackPhase) * 14} cy={-8 + Math.sin(attackPhase) * 16} r="2.2" fill="#DC2626" />
                <Circle cx={34 + Math.cos(attackPhase + 2.2) * 12} cy={6 + Math.sin(attackPhase + 2.2) * 14} r="1.8" fill="#EF4444" />
              </G>
            ) : state === 'climb' ? (
              // Wall Scrambling: arms reaching straight up clutching the wall!
              <G>
                <Line
                  x1="0"
                  y1="0"
                  x2="8"
                  y2={-torsoHeight * 0.72 + Math.sin(walkCycle * 2.5) * 5}
                  stroke={stickColor}
                  strokeWidth={isBoss ? 6 : isGiant ? 5 : 4}
                  strokeLinecap="round"
                />
                <Line
                  x1="0"
                  y1="2"
                  x2="14"
                  y2={-torsoHeight * 0.72 - Math.sin(walkCycle * 2.5) * 5}
                  stroke={stickColor}
                  strokeWidth={isBoss ? 6 : isGiant ? 5 : 4}
                  strokeLinecap="round"
                />
                <Line
                  x1="8"
                  y1={-torsoHeight * 0.72 + Math.sin(walkCycle * 2.5) * 5}
                  x2="14"
                  y2={-torsoHeight * 0.72 + Math.sin(walkCycle * 2.5) * 5 - 4}
                  stroke="#365314"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <Line
                  x1="14"
                  y1={-torsoHeight * 0.72 - Math.sin(walkCycle * 2.5) * 5}
                  x2="20"
                  y2={-torsoHeight * 0.72 - Math.sin(walkCycle * 2.5) * 5 - 4}
                  stroke="#365314"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </G>
            ) : state === 'jump' ? (
              // High Leap: arms outstretched forward/downward
              <G>
                <Line
                  x1="0"
                  y1="0"
                  x2={isBoss ? 30 : isGiant ? 24 : 18}
                  y2="-8"
                  stroke={stickColor}
                  strokeWidth={isBoss ? 6 : isGiant ? 5 : 4}
                  strokeLinecap="round"
                />
                <Line
                  x1="0"
                  y1="2"
                  x2={isBoss ? 28 : isGiant ? 22 : 16}
                  y2="0"
                  stroke={stickColor}
                  strokeWidth={isBoss ? 6 : isGiant ? 5 : 4}
                  strokeLinecap="round"
                />
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

          {/* Dynamic Animated Bat / Cyber Wings for Flying Zombie */}
          {type === 'flying' && (
            <G transform={`translate(0, ${-torsoHeight / 2 + 4})`}>
              {/* Back Wing */}
              <G transform={`rotate(${-Math.sin(walkCycle * 4) * 20}, -4, 0)`}>
                <Path
                  d="M -4 0 Q -24 -24 -38 -10 Q -26 4 -4 4 Z"
                  fill="#334155"
                  stroke="#1E293B"
                  strokeWidth="1.5"
                  opacity={0.8}
                />
                <Path d="M -4 0 L -38 -10" stroke="#64748B" strokeWidth="1.2" />
              </G>
              {/* Front Wing */}
              <G transform={`rotate(${Math.sin(walkCycle * 4) * 24}, 2, 0)`}>
                <Path
                  d="M 2 0 Q -20 -28 -36 -14 Q -22 6 2 4 Z"
                  fill="#475569"
                  stroke="#0F172A"
                  strokeWidth="1.5"
                />
                <Path d="M 2 0 L -36 -14" stroke="#EF4444" strokeWidth="1.4" opacity={0.85} />
                <Path d="M -16 -10 L -26 -2" stroke="#EF4444" strokeWidth="1.2" opacity={0.7} />
              </G>
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

            {/* Flying Zombie Cybernetic Laser Cannon Eye */}
            {type === 'flying' && (
              <G transform={`translate(${headRadius * 0.28}, -1)`}>
                {/* Metallic mount */}
                <Circle cx="0" cy="0" r={headRadius * 0.42} fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
                {/* Glowing Laser Aperture */}
                <Circle
                  cx="0"
                  cy="0"
                  r={headRadius * 0.3}
                  fill={zombie.laserFiringTimer ? '#FFFFFF' : '#EF4444'}
                  stroke={zombie.laserCharging ? '#F43F5E' : '#991B1B'}
                  strokeWidth="1.5"
                />
                <Circle cx="0" cy="0" r={headRadius * 0.14} fill="#FFFFFF" />
                {/* Pulsing Energy Ring when charging */}
                {zombie.laserCharging && (
                  <Circle
                    cx="0"
                    cy="0"
                    r={headRadius * 0.55 + Math.sin(walkCycle * 6) * 3}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="1.8"
                    strokeDasharray="4, 3"
                    opacity={0.9}
                  />
                )}
                {/* Blinding Muzzle Flare when firing */}
                {!!zombie.laserFiringTimer && (
                  <G>
                    <Circle cx="0" cy="0" r={headRadius * 0.8} fill="#EF4444" opacity={0.65} />
                    <Circle cx="0" cy="0" r={headRadius * 0.45} fill="#FFFFFF" />
                  </G>
                )}
              </G>
            )}

            {/* Undead Mouth: Snaps & bites violently with bloodied fangs during attack! */}
            <G>
              {/* Mouth Cavity */}
              <Path
                d={
                  isAttacking
                    ? `M ${-headRadius * 0.3} ${headRadius * 0.2} Q ${headRadius * 0.2} ${headRadius * 0.1} ${headRadius * 0.55} ${headRadius * 0.45} Q ${headRadius * 0.1} ${headRadius * 0.95 + Math.sin(attackPhase) * 3} ${-headRadius * 0.3} ${headRadius * 0.2} Z`
                    : `M ${-headRadius * 0.3} ${headRadius * 0.35} Q ${headRadius * 0.2} ${headRadius * 0.25} ${headRadius * 0.45} ${headRadius * 0.5} Q ${headRadius * 0.1} ${headRadius * 0.8} ${-headRadius * 0.3} ${headRadius * 0.35} Z`
                }
                fill={isAttacking ? '#450A0A' : '#1F2937'}
                stroke={isAttacking ? '#DC2626' : '#15803D'}
                strokeWidth="1.5"
              />
              {/* Vicious Sharp Rotten Teeth / Fangs */}
              {isAttacking ? (
                <G>
                  {/* Upper Razor Fangs */}
                  <Path
                    d={`M ${headRadius * 0.05} ${headRadius * 0.25} L ${headRadius * 0.12} ${headRadius * 0.55} L ${headRadius * 0.2} ${headRadius * 0.25} Z`}
                    fill="#FEF08A"
                    stroke="#B45309"
                    strokeWidth="0.8"
                  />
                  <Path
                    d={`M ${headRadius * 0.24} ${headRadius * 0.28} L ${headRadius * 0.32} ${headRadius * 0.6} L ${headRadius * 0.4} ${headRadius * 0.28} Z`}
                    fill="#FEF08A"
                    stroke="#B45309"
                    strokeWidth="0.8"
                  />
                  {/* Lower Fangs */}
                  <Path
                    d={`M ${headRadius * 0.12} ${headRadius * 0.8} L ${headRadius * 0.18} ${headRadius * 0.55} L ${headRadius * 0.24} ${headRadius * 0.8} Z`}
                    fill="#FEF08A"
                    stroke="#B45309"
                    strokeWidth="0.8"
                  />
                  {/* Blood Drips from Fangs */}
                  <Circle cx={headRadius * 0.12} cy={headRadius * 0.6} r="1.5" fill="#EF4444" />
                  <Circle cx={headRadius * 0.32} cy={headRadius * 0.65} r="1.5" fill="#DC2626" />
                </G>
              ) : (
                <G>
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
                </G>
              )}
              {/* Drooping Tongue */}
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
};
