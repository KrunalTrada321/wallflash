import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { scale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ZombieAudio from '../services/zombieAudio';

// ==========================================
// 1. VICTORY MODAL (Landscape 2-Column Layout)
// ==========================================
interface VictoryModalProps {
  visible: boolean;
  levelId: number;
  stars: number;
  score: number;
  coinsEarned: number;
  onNextLevel: () => void;
  onRetry: () => void;
  onLevelSelect: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  visible,
  levelId,
  stars,
  score,
  coinsEarned,
  onNextLevel,
  onRetry,
  onLevelSelect,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.landscapeCard, { maxWidth: 510 }]}>
          {/* Header Banner */}
          <View style={[styles.headerBanner, { backgroundColor: '#10B981' }]}>
            <Text style={styles.headerTitle}>VICTORY!</Text>
            <Text style={styles.headerSubtitle}>Level {levelId} Cleared</Text>
          </View>

          {/* 2-Column Landscape Body */}
          <View style={styles.landscapeBodyRow}>
            {/* Left Column: Stars & Stats */}
            <View style={styles.landscapeLeftCol}>
              <View style={styles.starsRow}>
                {[1, 2, 3].map(starNum => (
                  <Ionicons
                    key={`star_${starNum}`}
                    name={starNum <= stars ? 'star' : 'star-outline'}
                    size={scale(34)}
                    color={starNum <= stars ? '#FACC15' : '#94A3B8'}
                  />
                ))}
              </View>

              <View style={styles.statsCard}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Score</Text>
                  <Text style={styles.statValue}>{score} pts</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Coins</Text>
                  <Text style={[styles.statValue, { color: '#F59E0B' }]}>
                    +{coinsEarned} 🪙
                  </Text>
                </View>
              </View>
            </View>

            {/* Right Column: Actions */}
            <View style={styles.landscapeRightCol}>
              {levelId < 50 && (
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.primaryButton, { backgroundColor: '#10B981' }]}
                  onPress={() => {
                    ZombieAudio.playClick();
                    onNextLevel();
                  }}
                >
                  <Ionicons name="play" size={scale(18)} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>Next Level</Text>
                </TouchableOpacity>
              )}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.secondaryButton, { backgroundColor: '#06B6D4' }]}
                  onPress={() => {
                    ZombieAudio.playClick();
                    onRetry();
                  }}
                >
                  <Ionicons name="refresh" size={scale(16)} color="#FFFFFF" />
                  <Text style={styles.secondaryButtonText}>Replay</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.secondaryButton, { backgroundColor: '#64748B' }]}
                  onPress={() => {
                    ZombieAudio.playClick();
                    onLevelSelect();
                  }}
                >
                  <Ionicons name="grid" size={scale(16)} color="#FFFFFF" />
                  <Text style={styles.secondaryButtonText}>Levels</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ==========================================
// 2. DEFEAT MODAL (Landscape 2-Column Layout)
// ==========================================
interface DefeatModalProps {
  visible: boolean;
  levelId: number;
  reason: 'zombie_attack' | 'out_of_arrows';
  onRetry: () => void;
  onLevelSelect: () => void;
}

export const DefeatModal: React.FC<DefeatModalProps> = ({
  visible,
  levelId,
  reason,
  onRetry,
  onLevelSelect,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.landscapeCard, { maxWidth: 500 }]}>
          {/* Header Banner */}
          <View style={[styles.headerBanner, { backgroundColor: '#EF4444' }]}>
            <Text style={styles.headerTitle}>DEFEAT!</Text>
            <Text style={styles.headerSubtitle}>
              {reason === 'zombie_attack'
                ? 'The zombies reached you!'
                : 'You ran out of arrows!'}
            </Text>
          </View>

          <View style={styles.landscapeBodyRow}>
            {/* Left Column: Skull & Tactical Advice */}
            <View style={styles.landscapeLeftCol}>
              <View style={styles.defeatIconContainer}>
                <Ionicons name="skull" size={scale(38)} color="#EF4444" />
              </View>
              <Text style={styles.defeatAdviceText}>
                {reason === 'zombie_attack'
                  ? 'Aim for headshots to eliminate zombies faster!'
                  : 'Save arrows by utilizing TNT barrels and environmental traps!'}
              </Text>
            </View>

            {/* Right Column: Actions */}
            <View style={styles.landscapeRightCol}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.primaryButton, { backgroundColor: '#EF4444' }]}
                onPress={() => {
                  ZombieAudio.playClick();
                  onRetry();
                }}
              >
                <Ionicons name="refresh" size={scale(18)} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.secondaryButton, { backgroundColor: '#64748B' }]}
                onPress={() => {
                  ZombieAudio.playClick();
                  onLevelSelect();
                }}
              >
                <Ionicons name="grid" size={scale(16)} color="#FFFFFF" />
                <Text style={styles.secondaryButtonText}>Level Select</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ==========================================
// 3. PAUSE MODAL (Landscape 2-Column Layout)
// ==========================================
interface PauseModalProps {
  visible: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  onResume: () => void;
  onRestart: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onToggleHaptics: () => void;
  onLevelSelect: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  visible,
  soundEnabled,
  musicEnabled,
  hapticsEnabled,
  onResume,
  onRestart,
  onToggleSound,
  onToggleMusic,
  onToggleHaptics,
  onLevelSelect,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.landscapeCard, { maxWidth: 520 }]}>
          <View style={[styles.headerBanner, { backgroundColor: '#475569' }]}>
            <Text style={styles.headerTitle}>GAME PAUSED</Text>
          </View>

          <View style={styles.landscapeBodyRow}>
            {/* Left Column: Audio & Haptics Toggles */}
            <View style={styles.landscapeLeftCol}>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => {
                  ZombieAudio.playClick();
                  onToggleSound();
                }}
              >
                <View style={styles.settingLabelGroup}>
                  <Ionicons
                    name={soundEnabled ? 'volume-high' : 'volume-mute'}
                    size={scale(16)}
                    color="#0F172A"
                  />
                  <Text style={styles.settingLabelText}>Sound FX</Text>
                </View>
                <View
                  style={[
                    styles.toggleBadge,
                    { backgroundColor: soundEnabled ? '#10B981' : '#94A3B8' },
                  ]}
                >
                  <Text style={styles.toggleBadgeText}>
                    {soundEnabled ? 'ON' : 'OFF'}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => {
                  ZombieAudio.playClick();
                  onToggleMusic();
                }}
              >
                <View style={styles.settingLabelGroup}>
                  <Ionicons
                    name={musicEnabled ? 'musical-notes' : 'musical-note-outline'}
                    size={scale(16)}
                    color="#0F172A"
                  />
                  <Text style={styles.settingLabelText}>Music</Text>
                </View>
                <View
                  style={[
                    styles.toggleBadge,
                    { backgroundColor: musicEnabled ? '#10B981' : '#94A3B8' },
                  ]}
                >
                  <Text style={styles.toggleBadgeText}>
                    {musicEnabled ? 'ON' : 'OFF'}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => {
                  ZombieAudio.playClick();
                  onToggleHaptics();
                }}
              >
                <View style={styles.settingLabelGroup}>
                  <Ionicons
                    name={hapticsEnabled ? 'phone-portrait' : 'phone-portrait-outline'}
                    size={scale(16)}
                    color="#0F172A"
                  />
                  <Text style={styles.settingLabelText}>Vibration</Text>
                </View>
                <View
                  style={[
                    styles.toggleBadge,
                    { backgroundColor: hapticsEnabled ? '#10B981' : '#94A3B8' },
                  ]}
                >
                  <Text style={styles.toggleBadgeText}>
                    {hapticsEnabled ? 'ON' : 'OFF'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Right Column: Actions */}
            <View style={styles.landscapeRightCol}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.primaryButton, { backgroundColor: '#10B981' }]}
                onPress={() => {
                  ZombieAudio.playClick();
                  onResume();
                }}
              >
                <Ionicons name="play" size={scale(18)} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Resume</Text>
              </TouchableOpacity>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.secondaryButton, { backgroundColor: '#06B6D4' }]}
                  onPress={() => {
                    ZombieAudio.playClick();
                    onRestart();
                  }}
                >
                  <Ionicons name="refresh" size={scale(16)} color="#FFFFFF" />
                  <Text style={styles.secondaryButtonText}>Restart</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.secondaryButton, { backgroundColor: '#64748B' }]}
                  onPress={() => {
                    ZombieAudio.playClick();
                    onLevelSelect();
                  }}
                >
                  <Ionicons name="grid" size={scale(16)} color="#FFFFFF" />
                  <Text style={styles.secondaryButtonText}>Levels</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ==========================================
// 4. LEVEL SELECT MODAL (Landscape 2-Row Grid)
// ==========================================
interface LevelSelectModalProps {
  visible: boolean;
  unlockedLevel: number;
  levelStars: Record<number, number>;
  levelScores: Record<number, number>;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

const CHAPTERS = [
  { id: 1, title: 'Outskirts', range: [1, 10] },
  { id: 2, title: 'Ruins', range: [11, 20] },
  { id: 3, title: 'Hazards', range: [21, 30] },
  { id: 4, title: 'Woods', range: [31, 40] },
  { id: 5, title: 'Fortress', range: [41, 50] },
];

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  visible,
  unlockedLevel,
  levelStars,
  levelScores,
  onSelectLevel,
  onClose,
}) => {
  const [selectedChapter, setSelectedChapter] = useState(1);

  const curChapter = CHAPTERS.find(c => c.id === selectedChapter) || CHAPTERS[0];
  const levelNumbers: number[] = [];
  for (let i = curChapter.range[0]; i <= curChapter.range[1]; i++) {
    levelNumbers.push(i);
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.landscapeCard, { maxWidth: 560, maxHeight: '92%' }]}>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => {
              ZombieAudio.playClick();
              onClose();
            }}
          >
            <Ionicons name="close" size={scale(18)} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Header */}
          <View style={[styles.headerBanner, { backgroundColor: '#0284C7' }]}>
            <Text style={styles.headerTitle}>SELECT LEVEL</Text>
          </View>

          {/* Chapter Tabs */}
          <View style={styles.chapterTabRow}>
            {CHAPTERS.map(ch => {
              const isSelected = ch.id === selectedChapter;
              const isChUnlocked = unlockedLevel >= ch.range[0];
              return (
                <TouchableOpacity
                  key={`ch_${ch.id}`}
                  style={[
                    styles.chapterTab,
                    isSelected && styles.chapterTabSelected,
                    !isChUnlocked && styles.chapterTabLocked,
                  ]}
                  onPress={() => {
                    ZombieAudio.playClick();
                    setSelectedChapter(ch.id);
                  }}
                >
                  <Text
                    style={[
                      styles.chapterTabText,
                      isSelected && styles.chapterTabTextSelected,
                    ]}
                  >
                    Ch {ch.id}: {ch.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Level Grid (2 Rows of 5 Buttons) */}
          <ScrollView
            contentContainerStyle={styles.levelGridContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.levelGrid}>
              {levelNumbers.map(lvlId => {
                const isUnlocked = lvlId <= unlockedLevel;
                const stars = levelStars[lvlId] || 0;
                const isBossLevel = lvlId === 50;

                return (
                  <TouchableOpacity
                    key={`lvl_btn_${lvlId}`}
                    activeOpacity={0.8}
                    disabled={!isUnlocked}
                    style={[
                      styles.levelGridButton,
                      !isUnlocked && styles.levelGridButtonLocked,
                      isBossLevel && styles.levelGridButtonBoss,
                    ]}
                    onPress={() => {
                      ZombieAudio.playClick();
                      onSelectLevel(lvlId);
                    }}
                  >
                    {isUnlocked ? (
                      <>
                        <Text
                          style={[
                            styles.levelGridNumber,
                            isBossLevel && { color: '#EF4444' },
                          ]}
                        >
                          {lvlId}
                        </Text>
                        {/* Stars */}
                        <View style={styles.miniStarsRow}>
                          {[1, 2, 3].map(s => (
                            <Ionicons
                              key={`s_${s}`}
                              name={s <= stars ? 'star' : 'star-outline'}
                              size={scale(8.5)}
                              color={s <= stars ? '#FACC15' : '#94A3B8'}
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
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// ==========================================
// LANDSCAPE RESPONSIVE STYLES
// ==========================================
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 10, 20, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(8),
  },
  landscapeCard: {
    width: '86%',
    maxWidth: 460,
    backgroundColor: '#0F172A',
    borderRadius: scale(26),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    paddingTop: scale(10),
    paddingBottom: scale(12),
    paddingHorizontal: scale(12),
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  headerBanner: {
    paddingVertical: scale(5),
    paddingHorizontal: scale(18),
    borderRadius: scale(20),
    alignSelf: 'center',
    minWidth: scale(200),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(6),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: scale(15),
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: scale(10.5),
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.95)',
    marginTop: 1,
  },
  closeModalButton: {
    position: 'absolute',
    right: scale(12),
    top: scale(10),
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  landscapeBodyRow: {
    flexDirection: 'row',
    paddingHorizontal: scale(8),
    paddingVertical: scale(6),
    alignItems: 'center',
    gap: scale(14),
  },
  landscapeLeftCol: {
    flex: 1,
    justifyContent: 'center',
  },
  landscapeRightCol: {
    flex: 1,
    justifyContent: 'center',
    gap: scale(8),
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(6),
    marginBottom: scale(6),
  },
  defeatIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(4),
  },
  defeatAdviceText: {
    fontSize: scale(10.5),
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: scale(4),
    lineHeight: scale(14),
  },
  statsCard: {
    backgroundColor: '#1E293B',
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: scale(3),
  },
  statLabel: {
    fontSize: scale(11),
    color: '#94A3B8',
    fontWeight: '600',
  },
  statValue: {
    fontSize: scale(12.5),
    color: '#F8FAFC',
    fontWeight: '800',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: scale(7),
  },
  primaryButton: {
    flexDirection: 'row',
    height: scale(38),
    borderRadius: scale(22),
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: scale(13.5),
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    height: scale(36),
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(5),
    elevation: 2,
  },
  secondaryButtonText: {
    fontSize: scale(12.5),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: scale(5),
  },
  settingLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  settingLabelText: {
    fontSize: scale(11.5),
    fontWeight: '700',
    color: '#F1F5F9',
  },
  toggleBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(8),
  },
  toggleBadgeText: {
    fontSize: scale(9.5),
    fontWeight: '800',
    color: '#FFFFFF',
  },
  chapterTabRow: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: scale(16),
    marginHorizontal: scale(8),
    marginVertical: scale(6),
    padding: scale(3),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  chapterTab: {
    flex: 1,
    paddingVertical: scale(5),
    alignItems: 'center',
    borderRadius: scale(13),
  },
  chapterTabSelected: {
    backgroundColor: '#0284C7',
  },
  chapterTabLocked: {
    opacity: 0.45,
  },
  chapterTabText: {
    fontSize: scale(9.5),
    fontWeight: '800',
    color: '#94A3B8',
  },
  chapterTabTextSelected: {
    color: '#FFFFFF',
  },
  levelGridContent: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(7),
    justifyContent: 'center',
  },
  levelGridButton: {
    width: scale(46),
    height: scale(46),
    backgroundColor: '#1E293B',
    borderRadius: scale(16),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  levelGridButtonLocked: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  levelGridButtonBoss: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  levelGridNumber: {
    fontSize: scale(13.5),
    fontWeight: '900',
    color: '#F8FAFC',
  },
  miniStarsRow: {
    flexDirection: 'row',
    gap: 1,
    marginTop: 1,
  },
});
