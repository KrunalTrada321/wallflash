// ─────────────────────────────────────────────────────────────────────────────
//  SkinSelectorModal.tsx
//  Customizable Stickman Skins Dialog with Rewarded & Star Unlocks
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { scale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import { StickmanSkin } from '../types/stickmanHookTypes';

export const ALL_SKINS: StickmanSkin[] = [
  {
    id: 'classic_red',
    name: 'Classic Red',
    primaryColor: '#EF4444',
    headColor: '#F87171',
    ropeColor: '#FFFFFF',
    trailColor: 'rgba(239, 68, 68, 0.4)',
    requiredStars: 0,
    isUnlocked: true,
    description: 'The legendary nimble red acrobat.',
  },
  {
    id: 'spider_hero',
    name: 'Spider Hero',
    primaryColor: '#2563EB',
    headColor: '#EF4444',
    ropeColor: '#FFFFFF',
    trailColor: 'rgba(37, 99, 235, 0.4)',
    requiredStars: 5,
    isUnlocked: false,
    description: 'Web slinger with high-tension swings.',
  },
  {
    id: 'cyber_ninja',
    name: 'Cyber Ninja',
    primaryColor: '#06B6D4',
    headColor: '#22D3EE',
    ropeColor: '#38BDF8',
    trailColor: 'rgba(6, 182, 212, 0.4)',
    requiredStars: 15,
    isUnlocked: false,
    description: 'Neon blade runner from the future.',
  },
  {
    id: 'golden_knight',
    name: 'Golden Champion',
    primaryColor: '#F59E0B',
    headColor: '#FBBF24',
    ropeColor: '#FDE047',
    trailColor: 'rgba(245, 158, 11, 0.4)',
    requiredStars: 30,
    isUnlocked: false,
    description: 'Forged in gold for elite parkour masters.',
  },
  {
    id: 'acrobat_jester',
    name: 'Acrobat Jester',
    primaryColor: '#8B5CF6',
    headColor: '#EC4899',
    ropeColor: '#C084FC',
    trailColor: 'rgba(139, 92, 246, 0.4)',
    requiredStars: 45,
    isUnlocked: false,
    description: 'Wacky, vibrant, and gravity-defying.',
  },
  {
    id: 'shadow_reaper',
    name: 'Shadow Reaper',
    primaryColor: '#1E293B',
    headColor: '#A855F7',
    ropeColor: '#C084FC',
    trailColor: 'rgba(168, 85, 247, 0.4)',
    requiredStars: 60,
    isUnlocked: false,
    description: 'Dark phantom cloaked in violet mist.',
  },
];

interface SkinSelectorModalProps {
  visible: boolean;
  selectedSkinId: string;
  unlockedSkins: string[];
  totalStars: number;
  onSelectSkin: (skinId: string) => void;
  onUnlockViaAd: (skinId: string) => void;
  onClose: () => void;
}

export const SkinSelectorModal: React.FC<SkinSelectorModalProps> = ({
  visible,
  selectedSkinId,
  unlockedSkins,
  totalStars,
  onSelectSkin,
  onUnlockViaAd,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.modalOverlayRoot}>
      <View style={styles.modalCard}>
        <LinearGradient
          colors={['#1E1B4B', '#0F172A']}
          style={styles.modalGradient}
        >
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.headerLeft}>
                <Ionicons name="shirt-outline" size={scale(22)} color="#38BDF8" />
                <Text style={styles.headerTitle}>HERO SKINS</Text>
              </View>

              <View style={styles.starsPill}>
                <Ionicons name="star" size={scale(14)} color="#FACC15" />
                <Text style={styles.starsPillText}>{totalStars} Stars</Text>
              </View>

              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={scale(22)} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: scale(20) }}>
              <View style={styles.skinsGrid}>
                {ALL_SKINS.map(skin => {
                  const isUnlocked =
                    skin.requiredStars === 0 ||
                    unlockedSkins.includes(skin.id) ||
                    totalStars >= skin.requiredStars;
                  const isSelected = selectedSkinId === skin.id;

                  return (
                    <View
                      key={skin.id}
                      style={[
                        styles.skinCard,
                        isSelected && styles.skinCardSelected,
                      ]}
                    >
                      {/* Character Preview Dot/Avatar */}
                      <View style={[styles.avatarBox, { borderColor: skin.primaryColor }]}>
                        <View style={[styles.avatarHead, { backgroundColor: skin.headColor }]} />
                        <View style={[styles.avatarBody, { backgroundColor: skin.primaryColor }]} />
                      </View>

                      <Text style={styles.skinName}>{skin.name}</Text>
                      <Text style={styles.skinDesc}>{skin.description}</Text>

                      {isUnlocked ? (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={[
                            styles.equipBtn,
                            isSelected ? styles.equipBtnSelected : styles.equipBtnUnselected,
                          ]}
                          onPress={() => onSelectSkin(skin.id)}
                        >
                          <Text
                            style={[
                              styles.equipBtnText,
                              isSelected ? styles.equipBtnTextSelected : styles.equipBtnTextUnselected,
                            ]}
                          >
                            {isSelected ? 'EQUIPPED' : 'EQUIP'}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.unlockActions}>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.adUnlockBtn}
                            onPress={() => onUnlockViaAd(skin.id)}
                          >
                            <Ionicons name="videocam" size={scale(12)} color="#000" />
                            <Text style={styles.adUnlockText}>Unlock Free</Text>
                          </TouchableOpacity>

                          <View style={styles.starsLock}>
                            <Ionicons name="star" size={scale(10)} color="#FACC15" />
                            <Text style={styles.starsLockText}>{skin.requiredStars}</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </View>
  );
};

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
    padding: scale(16),
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(16),
  },
  modalCard: {
    width: '100%',
    maxHeight: '85%',
    borderRadius: scale(22),
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    elevation: 20,
  },
  modalGradient: {
    padding: scale(18),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  headerTitle: {
    color: '#FFF',
    fontSize: scale(18),
    fontWeight: '900',
  },
  starsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.4)',
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(12),
    gap: scale(4),
  },
  starsPillText: {
    color: '#FACC15',
    fontSize: scale(11),
    fontWeight: '800',
  },
  closeBtn: {
    padding: scale(4),
  },
  skinsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: scale(10),
  },
  skinCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: scale(16),
    padding: scale(12),
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  skinCardSelected: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  avatarBox: {
    width: scale(52),
    height: scale(52),
    borderRadius: scale(26),
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: scale(8),
  },
  avatarHead: {
    width: scale(14),
    height: scale(14),
    borderRadius: scale(7),
    marginBottom: scale(3),
  },
  avatarBody: {
    width: scale(6),
    height: scale(14),
    borderRadius: scale(3),
  },
  skinName: {
    color: '#FFF',
    fontSize: scale(13),
    fontWeight: '800',
    textAlign: 'center',
  },
  skinDesc: {
    color: '#94A3B8',
    fontSize: scale(9),
    textAlign: 'center',
    marginTop: scale(2),
    marginBottom: scale(8),
    height: scale(26),
  },
  equipBtn: {
    width: '100%',
    paddingVertical: scale(7),
    borderRadius: scale(10),
    alignItems: 'center',
  },
  equipBtnSelected: {
    backgroundColor: '#38BDF8',
  },
  equipBtnUnselected: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  equipBtnText: {
    fontSize: scale(11),
    fontWeight: '800',
  },
  equipBtnTextSelected: {
    color: '#000',
  },
  equipBtnTextUnselected: {
    color: '#E2E8F0',
  },
  unlockActions: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(4),
  },
  adUnlockBtn: {
    flex: 1,
    backgroundColor: '#22C55E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(6),
    borderRadius: scale(8),
    gap: scale(3),
  },
  adUnlockText: {
    color: '#000',
    fontSize: scale(9.5),
    fontWeight: '900',
  },
  starsLock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    paddingHorizontal: scale(5),
    paddingVertical: scale(5),
    borderRadius: scale(8),
    gap: scale(2),
  },
  starsLockText: {
    color: '#FACC15',
    fontSize: scale(9.5),
    fontWeight: '800',
  },
});

export default SkinSelectorModal;

