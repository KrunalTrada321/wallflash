import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ZombieAudio from '../services/zombieAudio';

interface GameHUDProps {
  levelId: number;
  levelTitle: string;
  arrowsRemaining: number | null;
  totalArrows: number | null;
  score: number;
  onBack: () => void;
  onRestart: () => void;
  onPause: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = React.memo(({
  levelId,
  levelTitle,
  arrowsRemaining,
  totalArrows,
  score,
  onBack,
  onRestart,
  onPause,
}) => {
  return (
    <View style={styles.hudContainer}>
      {/* Left Control Buttons (Matches Screenshot: Red Back + Cyan Restart) */}
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

      {/* Right Control Button: Pause Button */}
      <View style={styles.rightButtonGroup}>
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
  );
});

const styles = StyleSheet.create({
  hudContainer: {
    position: 'absolute',
    top: scale(10),
    left: scale(12),
    right: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50,
  },
  leftButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  rightButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  circleButton: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  backButton: {
    backgroundColor: '#F87171', // Salmon red matching screenshot
  },
  restartButton: {
    backgroundColor: '#06B6D4', // Vibrant cyan matching screenshot
  },
  skipButton: {
    backgroundColor: '#84CC16', // Lime green matching screenshot
  },
  pauseButton: {
    backgroundColor: '#475569',
  },
  centerInfo: {
    alignItems: 'center',
  },
  levelTitleText: {
    fontSize: scale(20),
    fontWeight: '800',
    color: '#334155',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginTop: scale(2),
  },
  arrowBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
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
  scoreText: {
    fontSize: scale(11),
    fontWeight: '700',
    color: '#475569',
  },
});
