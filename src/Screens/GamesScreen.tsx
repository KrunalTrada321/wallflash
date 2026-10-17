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
import { colors } from '../Styling/colors';
import ShortBanner from '../Components/ShortBanner';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export default function GamesScreen() {
  const navigation = useNavigation<any>();

  const [bladeLevel, setBladeLevel] = useState(1);
  const [twinsLevel, setTwinsLevel] = useState(1);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('@neonblade_level').then(lvl => {
        if (lvl) {
          setBladeLevel(parseInt(lvl, 10));
        }
      });
      AsyncStorage.getItem('@twinsconnect_level').then(lvl => {
        if (lvl) {
          setTwinsLevel(parseInt(lvl, 10) + 1);
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
        {/* --- Game 1: Neon Fruit Slasher --- */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.cardContainer}
          onPress={() => navigation.navigate('NeonFruitSlasher')}
        >
          <ImageBackground
            source={require('../assets/game/neon_blade.jpg')}
            style={styles.imageBg}
            imageStyle={{ borderRadius: scale(20) }}
          >
            <LinearGradient
              colors={['transparent', 'rgba(15, 10, 35, 0.75)', 'rgba(9, 6, 20, 0.98)']}
              style={styles.gradient}
            >
              <View style={styles.contentWrapper}>
                <Text style={styles.gameTitle}>Neon Fruit Slasher</Text>

                <View style={styles.progressRow}>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(100, (bladeLevel / 50) * 100)}%`,
                          backgroundColor: '#38BDF8',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.levelText}>Level {bladeLevel} / 50</Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        {/* --- Game 2: Twins Connect --- */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.cardContainer}
          onPress={() => navigation.navigate('TwinsConnect')}
        >
          <ImageBackground
            source={require('../assets/game/twins_connect.png')}
            style={styles.imageBg}
            imageStyle={{ borderRadius: scale(20) }}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,1)']}
              style={styles.gradient}
            >
              <View style={styles.contentWrapper}>
                <Text style={styles.gameTitle}>Twins Connect</Text>

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
    padding: scale(18),
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: scale(4),
  },
  newBadge: {
    borderWidth: 1,
    borderRadius: scale(12),
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
  },
  newBadgeText: {
    color: '#F0F9FF',
    fontSize: scale(9),
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  gameTitle: {
    color: '#FFF',
    fontSize: scale(22),
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: scale(8),
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
