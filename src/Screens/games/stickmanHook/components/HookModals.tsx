// ─────────────────────────────────────────────────────────────────────────────
//  HookModals.tsx
//  Victory, Game Over / Revive, Level Select & Pause Dialogs
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { scale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import { ALL_50_HOOK_LEVELS } from '../levels/all50HookLevels';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── 1. VICTORY MODAL ─────────────────────────────────────────────────────────
interface VictoryModalProps {
  visible: boolean;
  levelId: number;
  stars: number;
  elapsedSeconds: number;
  bestTime: number | null;
  onNextLevel: () => void;
  onReplay: () => void;
  onOpenLevelSelect: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  visible,
  levelId,
  stars,
  elapsedSeconds,
  bestTime,
  onNextLevel,
  onReplay,
  onOpenLevelSelect,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.modalOverlayRoot}>
      <View style={styles.modalCard}>
        <LinearGradient
          colors={['#1E1B4B', '#0F172A']}
          style={styles.modalGradient}
        >
          {/* Header Trophy */}
          <View style={styles.trophyWrapper}>
            <Ionicons name="trophy" size={scale(36)} color="#FACC15" />
          </View>

          <Text style={styles.victoryTitle}>LEVEL {levelId} COMPLETE!</Text>
          <Text style={styles.victorySubtitle}>Outstanding Acrobatics!</Text>

          {/* Stars Row */}
          <View style={styles.starsRow}>
            {[1, 2, 3].map(s => (
              <Ionicons
                key={s}
                name={s <= stars ? 'star' : 'star-outline'}
                size={scale(32)}
                color={s <= stars ? '#FACC15' : '#475569'}
                style={{ marginHorizontal: scale(4) }}
              />
            ))}
          </View>

          {/* Time Stat Box */}
          <View style={styles.statBox}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>TIME</Text>
              <Text style={styles.statValue}>{elapsedSeconds.toFixed(1)}s</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>BEST</Text>
              <Text style={[styles.statValue, { color: '#38BDF8' }]}>
                {bestTime ? `${bestTime.toFixed(1)}s` : `${elapsedSeconds.toFixed(1)}s`}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.primaryButton}
            onPress={onNextLevel}
          >
            <Text style={styles.primaryButtonText}>
              {levelId < 50 ? 'NEXT LEVEL' : 'CHAMPION! SELECT LEVEL'}
            </Text>
            <Ionicons name="arrow-forward" size={scale(18)} color="#000" style={{ marginLeft: scale(6) }} />
          </TouchableOpacity>

          <View style={styles.secondaryRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.secondaryButton}
              onPress={onReplay}
            >
              <Ionicons name="refresh" size={scale(16)} color="#E2E8F0" />
              <Text style={styles.secondaryButtonText}>Replay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.secondaryButton}
              onPress={onOpenLevelSelect}
            >
              <Ionicons name="grid-outline" size={scale(16)} color="#E2E8F0" />
              <Text style={styles.secondaryButtonText}>Levels</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

// ── 2. GAME OVER / REVIVE MODAL ──────────────────────────────────────────────
interface GameOverModalProps {
  visible: boolean;
  levelId: number;
  reason: 'fall' | 'hazard';
  canRevive: boolean;
  onReviveAd: () => void;
  onRetry: () => void;
  onOpenLevelSelect: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  levelId,
  reason,
  canRevive,
  onReviveAd,
  onRetry,
  onOpenLevelSelect,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.modalOverlayRoot}>
      <View style={styles.modalCard}>
        <LinearGradient
          colors={['#1F1929', '#0F172A']}
          style={styles.modalGradient}
        >
          <View style={[styles.trophyWrapper, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
            <Ionicons
              name={reason === 'hazard' ? 'flash-outline' : 'trending-down-outline'}
              size={scale(36)}
              color="#EF4444"
            />
          </View>

          <Text style={[styles.victoryTitle, { color: '#FCA5A5' }]}>
            {reason === 'hazard' ? 'WATCH THE HAZARD!' : 'MISSED THE SWING!'}
          </Text>
          <Text style={styles.victorySubtitle}>Level {levelId}</Text>

          {/* Rewarded Revive Button */}
          {canRevive && (
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.reviveButton}
              onPress={onReviveAd}
            >
              <Ionicons name="videocam" size={scale(20)} color="#000" style={{ marginRight: scale(8) }} />
              <Text style={styles.reviveButtonText}>REVIVE & KEEP GOING</Text>
            </TouchableOpacity>
          )}

          {/* Normal Retry Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.primaryButton, { backgroundColor: '#38BDF8', marginTop: scale(10) }]}
            onPress={onRetry}
          >
            <Ionicons name="refresh" size={scale(18)} color="#000" style={{ marginRight: scale(6) }} />
            <Text style={styles.primaryButtonText}>TRY AGAIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.textOnlyButton}
            onPress={onOpenLevelSelect}
          >
            <Text style={styles.textOnlyButtonText}>Level Select</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

// ── 3. LEVEL SELECT MODAL ────────────────────────────────────────────────────
interface LevelSelectModalProps {
  visible: boolean;
  unlockedLevel: number;
  levelStars: Record<number, number>;
  onSelectLevel: (lvl: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  visible,
  unlockedLevel,
  levelStars,
  onSelectLevel,
  onClose,
}) => {
  if (!visible) return null;

  const chapters = [
    { title: 'Chapter 1: The Canopy Grove', range: [1, 10] },
    { title: 'Chapter 2: Neon Skyway', range: [11, 20] },
    { title: 'Chapter 3: Cyber Metropolis', range: [21, 30] },
    { title: 'Chapter 4: The Hazard Zone', range: [31, 40] },
    { title: 'Chapter 5: Cosmic Dimension', range: [41, 50] },
  ];

  return (
    <View style={styles.modalOverlayRoot}>
      <View style={[styles.modalCard, { maxHeight: '85%' }]}>
        <LinearGradient
          colors={['#1E1B4B', '#0F172A']}
          style={styles.modalGradient}
        >
          {/* Header */}
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalHeaderTitle}>SELECT LEVEL</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <Ionicons name="close" size={scale(22)} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: scale(20) }}>
            {chapters.map((chap, cIdx) => (
              <View key={cIdx} style={styles.chapterSection}>
                <Text style={styles.chapterTitle}>{chap.title}</Text>
                <View style={styles.levelGrid}>
                  {ALL_50_HOOK_LEVELS.slice(chap.range[0] - 1, chap.range[1]).map(lvl => {
                    const isUnlocked = lvl.id <= unlockedLevel;
                    const stars = levelStars[lvl.id] || 0;

                    return (
                      <TouchableOpacity
                        key={lvl.id}
                        activeOpacity={0.8}
                        disabled={!isUnlocked}
                        style={[
                          styles.levelCell,
                          isUnlocked ? styles.levelCellUnlocked : styles.levelCellLocked,
                        ]}
                        onPress={() => onSelectLevel(lvl.id)}
                      >
                        {isUnlocked ? (
                          <>
                            <Text style={styles.levelCellNumber}>{lvl.id}</Text>
                            <View style={styles.miniStarsRow}>
                              {[1, 2, 3].map(s => (
                                <Ionicons
                                  key={s}
                                  name="star"
                                  size={scale(8)}
                                  color={s <= stars ? '#FACC15' : 'rgba(255,255,255,0.2)'}
                                />
                              ))}
                            </View>
                          </>
                        ) : (
                          <Ionicons name="lock-closed" size={scale(16)} color="#64748B" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
        </LinearGradient>
      </View>
    </View>
  );
};

// ── 4. PAUSE MODAL ───────────────────────────────────────────────────────────
interface PauseModalProps {
  visible: boolean;
  levelId: number;
  isMuted: boolean;
  onResume: () => void;
  onRestart: () => void;
  onToggleSound: () => void;
  onOpenLevelSelect: () => void;
  onQuit: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  visible,
  levelId,
  isMuted,
  onResume,
  onRestart,
  onToggleSound,
  onOpenLevelSelect,
  onQuit,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.modalOverlayRoot}>
      <View style={styles.modalCard}>
        <LinearGradient
          colors={['#1E1B4B', '#0F172A']}
          style={styles.modalGradient}
        >
          <Text style={styles.victoryTitle}>GAME PAUSED</Text>
          <Text style={styles.victorySubtitle}>Level {levelId}</Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.primaryButton}
            onPress={onResume}
          >
            <Ionicons name="play" size={scale(18)} color="#000" style={{ marginRight: scale(6) }} />
            <Text style={styles.primaryButtonText}>RESUME</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.primaryButton, { backgroundColor: '#38BDF8', marginTop: scale(10) }]}
            onPress={onRestart}
          >
            <Ionicons name="refresh" size={scale(18)} color="#000" style={{ marginRight: scale(6) }} />
            <Text style={styles.primaryButtonText}>RESTART LEVEL</Text>
          </TouchableOpacity>

          <View style={styles.secondaryRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.secondaryButton}
              onPress={onToggleSound}
            >
              <Ionicons
                name={isMuted ? 'volume-mute' : 'volume-high'}
                size={scale(18)}
                color={isMuted ? '#EF4444' : '#22C55E'}
              />
              <Text style={styles.secondaryButtonText}>{isMuted ? 'Muted' : 'Sound On'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.secondaryButton}
              onPress={onOpenLevelSelect}
            >
              <Ionicons name="grid-outline" size={scale(18)} color="#E2E8F0" />
              <Text style={styles.secondaryButtonText}>Levels</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.textOnlyButton}
            onPress={onQuit}
          >
            <Text style={[styles.textOnlyButtonText, { color: '#94A3B8' }]}>Exit Game</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

// ── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  modalOverlayRoot: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(18),
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(18),
  },
  modalCard: {
    width: '100%',
    maxWidth: scale(340),
    borderRadius: scale(22),
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    elevation: 20,
  },
  modalGradient: {
    padding: scale(20),
    alignItems: 'center',
  },
  trophyWrapper: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    backgroundColor: 'rgba(250, 204, 21, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(10),
  },
  victoryTitle: {
    color: '#FFF',
    fontSize: scale(20),
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  victorySubtitle: {
    color: '#94A3B8',
    fontSize: scale(12),
    fontWeight: '600',
    marginTop: scale(2),
    marginBottom: scale(12),
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: scale(14),
  },
  statBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: scale(12),
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: scale(18),
  },
  statCol: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: scale(10),
    fontWeight: '700',
  },
  statValue: {
    color: '#FACC15',
    fontSize: scale(18),
    fontWeight: '900',
    marginTop: scale(2),
  },
  statDivider: {
    width: 1,
    height: scale(26),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  primaryButton: {
    backgroundColor: '#FACC15',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: scale(13),
    borderRadius: scale(14),
    elevation: 4,
  },
  primaryButtonText: {
    color: '#000',
    fontSize: scale(14),
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  reviveButton: {
    backgroundColor: '#22C55E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: scale(13),
    borderRadius: scale(14),
    elevation: 4,
  },
  reviveButtonText: {
    color: '#000',
    fontSize: scale(13),
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  secondaryRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: scale(12),
    gap: scale(10),
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(10),
    borderRadius: scale(12),
    gap: scale(6),
  },
  secondaryButtonText: {
    color: '#E2E8F0',
    fontSize: scale(12),
    fontWeight: '700',
  },
  textOnlyButton: {
    marginTop: scale(12),
    paddingVertical: scale(6),
  },
  textOnlyButtonText: {
    color: '#38BDF8',
    fontSize: scale(12),
    fontWeight: '700',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: scale(14),
  },
  modalHeaderTitle: {
    color: '#FFF',
    fontSize: scale(18),
    fontWeight: '900',
  },
  closeIcon: {
    padding: scale(4),
  },
  chapterSection: {
    marginBottom: scale(16),
  },
  chapterTitle: {
    color: '#FACC15',
    fontSize: scale(12),
    fontWeight: '800',
    marginBottom: scale(8),
    letterSpacing: 0.5,
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
  },
  levelCell: {
    width: scale(52),
    height: scale(52),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelCellUnlocked: {
    backgroundColor: '#334155',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  levelCellLocked: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    opacity: 0.6,
  },
  levelCellNumber: {
    color: '#FFF',
    fontSize: scale(15),
    fontWeight: '900',
  },
  miniStarsRow: {
    flexDirection: 'row',
    gap: scale(1),
    marginTop: scale(2),
  },
});

