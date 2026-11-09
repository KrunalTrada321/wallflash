import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../Styling/colors';
import ShortBanner from '../Components/ShortBanner';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export default function GamesScreen() {
  const navigation = useNavigation<any>();

  const [twinsLevel, setTwinsLevel] = useState(1);
  const [zombieLevel, setZombieLevel] = useState(1);
  const [hookLevel, setHookLevel] = useState(1);
  const [hookStars, setHookStars] = useState(0);
  const [spyLevel, setSpyLevel] = useState(1);
  const [spyStars, setSpyStars] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('@twinsconnect_level').then(lvl => {
        if (lvl) {
          setTwinsLevel(parseInt(lvl, 10) + 1);
        }
      });
      AsyncStorage.getItem('@zombie_attack_unlocked_level').then(lvl => {
        if (lvl) {
          setZombieLevel(parseInt(lvl, 10));
        }
      });
      AsyncStorage.getItem('@stickman_hook_unlocked_level').then(lvl => {
        if (lvl) {
          setHookLevel(parseInt(lvl, 10));
        }
      });
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* --- Game 2: Stickman Hook: Swing Hero --- */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.cardContainer}
          onPress={() => navigation.navigate('StickmanHook')}
        >
          <ImageBackground
            source={require('../assets/game/stickman_hook.jpg')}
            style={styles.imageBg}
            imageStyle={{ borderRadius: scale(20) }}
          >
            <LinearGradient
              colors={['transparent', 'rgba(15, 23, 42, 0.7)', 'rgba(2, 6, 23, 0.98)']}
              style={styles.gradient}
            >
              <View style={styles.contentWrapper}>
                <Text style={styles.gameTitle}>Stickman Hook: Swing Hero</Text>
                <Text style={styles.gameSubtitle}>Acrobatic Swings, Flips & Trampolines</Text>

                <View style={styles.progressRow}>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(100, (hookLevel / 50) * 100)}%`,
                          backgroundColor: '#FACC15',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.levelText}>Level {hookLevel} / 50</Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        {/* --- Game 2: Zombie Stickman Archer --- */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.cardContainer}
          onPress={() => navigation.navigate('ZombieAttack')}
        >
          <ImageBackground
            source={require('../assets/game/zombie_attack.jpg')}
            style={styles.imageBg}
            imageStyle={{ borderRadius: scale(20) }}
          >
            <LinearGradient
              colors={['transparent', 'rgba(15, 23, 42, 0.7)', 'rgba(2, 6, 23, 0.98)']}
              style={styles.gradient}
            >
              <View style={styles.contentWrapper}>
                <Text style={styles.gameTitle}>Zombie Stickman Archer</Text>
                <Text style={styles.gameSubtitle}>Physics Archery, Slingshot Trajectory & TNT</Text>

                <View style={styles.progressRow}>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(100, (zombieLevel / 50) * 100)}%`,
                          backgroundColor: '#84CC16',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.levelText}>Level {zombieLevel} / 50</Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        {/* --- Game 3: Twins Connect --- */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.cardContainer}
          onPress={() => navigation.navigate('TwinsConnect')}
        >
          <ImageBackground
            source={require('../assets/game/twins_connect.jpg')}
            style={styles.imageBg}
            imageStyle={{ borderRadius: scale(20) }}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.98)']}
              style={styles.gradient}
            >
              <View style={styles.contentWrapper}>
                <Text style={styles.gameTitle}>Twins Connect</Text>
                <Text style={styles.gameSubtitle}>Tile Matching & Brain Puzzle</Text>

                <View style={styles.progressRow}>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(100, (twinsLevel / 50) * 100)}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.levelText}>Level {twinsLevel} / 50</Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginTop: scale(15) }}>
          <ShortBanner />
        </View>

        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoonText}>More games coming soon...</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: scale(10),
    paddingBottom: scale(30),
  },
  spyCard: {
    width: '100%',
    height: '100%',
    borderRadius: scale(20),
    justifyContent: 'space-between',
    padding: scale(14),
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.45)',
  },
  spyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spyBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  newBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingHorizontal: scale(10),
    paddingVertical: scale(3),
    borderRadius: scale(12),
  },
  newBadgeText: {
    color: '#FCA5A5',
    fontSize: scale(10),
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  spyMissionBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.25)',
    borderWidth: 1,
    borderColor: '#38BDF8',
    paddingHorizontal: scale(10),
    paddingVertical: scale(3),
    borderRadius: scale(12),
  },
  spyMissionBadgeText: {
    color: '#7DD3FC',
    fontSize: scale(10),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  spyReticleIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(10),
  },
  spyReticleText: {
    color: '#F87171',
    fontSize: scale(10),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  spyStarsRow: {
    marginTop: scale(5),
  },
  spyStarsText: {
    color: '#FACC15',
    fontSize: scale(11),
    fontWeight: '700',
  },
  cardContainer: {
    width: '100%',
    height: scale(200),
    borderRadius: scale(20),
    marginVertical: scale(6),
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  hookCard: {
    width: '100%',
    height: '100%',
    borderRadius: scale(20),
    justifyContent: 'space-between',
    padding: scale(14),
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  cardTopBadgeRow: {
    position: 'absolute',
    top: scale(14),
    left: scale(14),
    right: scale(14),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  hookHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingHorizontal: scale(10),
    paddingVertical: scale(3),
    borderRadius: scale(12),
  },
  hotBadgeText: {
    color: '#FCA5A5',
    fontSize: scale(10),
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  chapterBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderWidth: 1,
    borderColor: '#38BDF8',
    paddingHorizontal: scale(10),
    paddingVertical: scale(3),
    borderRadius: scale(12),
  },
  chapterBadgeText: {
    color: '#38BDF8',
    fontSize: scale(10),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  hookDecorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginVertical: scale(4),
    paddingLeft: scale(4),
  },
  decorPin: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#FACC15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorPinInner: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#FACC15',
  },
  decorLine: {
    width: scale(32),
    height: scale(2),
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  decorStickman: {
    width: scale(18),
    height: scale(24),
    borderRadius: scale(9),
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorStickmanHead: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#FFF',
    marginBottom: scale(2),
  },
  imageBg: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  gradient: {
    width: '100%',
    height: '75%',
    justifyContent: 'flex-end',
    borderRadius: scale(20),
  },
  contentWrapper: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(16),
    paddingTop: scale(8),
  },
  gameTitle: {
    color: '#FFF',
    fontSize: scale(20),
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    marginBottom: scale(3),
  },
  gameSubtitle: {
    color: '#CBD5E1',
    fontSize: scale(11.5),
    fontWeight: '600',
    marginBottom: scale(10),
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressTrack: {
    flex: 1,
    height: scale(8),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: scale(4),
    marginRight: scale(15),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#39FF14',
    borderRadius: scale(4),
  },
  levelText: {
    color: '#FFF',
    fontSize: scale(13),
    fontWeight: 'bold',
  },
  comingSoonContainer: {
    marginTop: scale(25),
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: scale(20),
  },
  comingSoonText: {
    color: '#666666',
    fontSize: scale(12),
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
