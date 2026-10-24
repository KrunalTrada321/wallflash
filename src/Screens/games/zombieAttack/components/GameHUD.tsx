import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ArrowType } from '../types/gameTypes';
import ZombieAudio from '../services/zombieAudio';

interface GameHUDProps {
  levelId: number;
  levelTitle: string;
  arrowsRemaining: number | null;
  totalArrows: number | null;
  score: number;
  selectedArrowType: ArrowType;
  onSelectArrowType: (type: ArrowType) => void;
  onBack: () => void;
  onRestart: () => void;
  onPause: () => void;
}

const ARROW_OPTIONS: { type: ArrowType; icon: string; label: string; unlockLevel: number; color: string }[] = [
  { type: 'regular', icon: '🏹', label: 'Arrow', unlockLevel: 1, color: '#38BDF8' },
  { type: 'bomb', icon: '💣', label: 'Bomb', unlockLevel: 2, color: '#FACC15' },
];

export const GameHUD: React.FC<GameHUDProps> = React.memo(({
  levelId,
  levelTitle,
  arrowsRemaining,
  totalArrows,
  score,
  selectedArrowType,
  onSelectArrowType,
  onBack,
  onRestart,
  onPause,
}) => {
  return (
    <View style={styles.hudContainer} pointerEvents="box-none">
      {/* Top Bar */}
      <View style={styles.topRow} pointerEvents="box-none">
        {/* Left Control Buttons (Red Back + Cyan Restart) */}
        <View style={styles.leftButtonGroup}>
          {/* Back Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.circleButton, styles.backButton]}
            onPress={() => {
              ZombieAudio.playClick();
              onBack();
            }}
          >
            <Ionicons name="chevron-back" size={scale(24)} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Restart Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.circleButton, styles.restartButton]}
            onPress={() => {
              ZombieAudio.playClick();
              onRestart();
            }}
          >
            <Ionicons name="refresh" size={scale(22)} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Center Level Title & Arrow Counter */}
        <View style={styles.centerInfo}>
          <Text style={styles.levelTitleText}>Level {levelId}</Text>
          <View style={styles.subInfoRow}>
            {totalArrows !== null ? (
              <View style={styles.arrowBadge}>
                <Text style={styles.arrowText}>
                  🏹 {arrowsRemaining} / {totalArrows}
                </Text>
              </View>
            ) : (
              <View style={styles.arrowBadge}>
                <Text style={styles.arrowText}>🏹 ∞</Text>
              </View>
            )}
          </View>
        </View>

        {/* Right Controls: Arrow Selector Pills + Pause Button */}
        <View style={styles.rightGroup}>
          {/* Tactical Arrow Ability Selector */}
          <View style={styles.arrowSelectorPill}>
            {ARROW_OPTIONS.map(opt => {
              const isUnlocked = levelId >= opt.unlockLevel;
              const isSelected = selectedArrowType === opt.type;

              return (
                <TouchableOpacity
                  key={opt.type}
                  activeOpacity={0.75}
                  disabled={!isUnlocked}
                  onPress={() => {
                    ZombieAudio.playClick();
                    onSelectArrowType(opt.type);
                  }}
                  style={[
                    styles.arrowTypeBtn,
                    isSelected && { backgroundColor: opt.color, borderColor: '#FFFFFF' },
                    !isUnlocked && styles.arrowTypeBtnLocked,
                  ]}
                >
                  <Text style={[styles.arrowTypeIcon, !isUnlocked && { opacity: 0.4 }]}>
                    {isUnlocked ? opt.icon : '🔒'}
                  </Text>
                  <Text
                    style={[
                      styles.arrowTypeLabel,
                      isSelected && { color: '#0F172A', fontWeight: '900' },
                      !isUnlocked && { color: '#64748B' },
                    ]}
                  >
                    {isUnlocked ? opt.label : `L${opt.unlockLevel}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Pause Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.circleButton, styles.pauseButton]}
            onPress={() => {
              ZombieAudio.playClick();
              onPause();
            }}
          >
            <Ionicons name="pause" size={scale(18)} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  hudContainer: {
    position: 'absolute',
    top: scale(8),
    left: scale(10),
    right: scale(10),
    zIndex: 50,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  circleButton: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  backButton: {
    backgroundColor: '#F87171',
  },
  restartButton: {
    backgroundColor: '#06B6D4',
  },
  pauseButton: {
    backgroundColor: '#334155',
  },
  centerInfo: {
    alignItems: 'center',
  },
  levelTitleText: {
    fontSize: scale(18),
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255,255,255,0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    marginTop: scale(1),
  },
  arrowBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  arrowText: {
    fontSize: scale(11),
    fontWeight: '700',
    color: '#0F172A',
  },
  arrowSelectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderRadius: scale(18),
    padding: scale(3),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: scale(3),
  },
  arrowTypeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(7),
    paddingVertical: scale(3),
    borderRadius: scale(14),
    borderWidth: 1.2,
    borderColor: 'transparent',
    gap: scale(3),
  },
  arrowTypeBtnLocked: {
    opacity: 0.55,
  },
  arrowTypeIcon: {
    fontSize: scale(11),
  },
  arrowTypeLabel: {
    fontSize: scale(9.5),
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.3,
  },
});
