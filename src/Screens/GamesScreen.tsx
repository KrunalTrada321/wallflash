import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, ImageBackground } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scale } from 'react-native-size-matters';
import { colors } from '../Styling/colors';
import ShortBanner from '../Components/ShortBanner';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export default function GamesScreen() {
  const navigation = useNavigation<any>();

  const [level, setLevel] = useState(1);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('@twinsconnect_level').then(lvl => {
        if (lvl) {
          setLevel(parseInt(lvl, 10) + 1);
        }
      });
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        activeOpacity={0.9}
        style={styles.cardContainer}
        onPress={() => navigation.navigate('TwinsConnect')}
      >
        <ImageBackground 
          source={require('../assets/game/flow_free.jpg')} 
          style={styles.imageBg}
          imageStyle={{ borderRadius: scale(20) }}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            style={styles.gradient}
          >
            <View style={styles.contentWrapper}>
              <Text style={styles.gameTitle}>Twins Connect</Text>
              
              <View style={styles.progressRow}>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${Math.min(100, (level / 50) * 100)}%` }]} />
                </View>
                <Text style={styles.levelText}>Level {level} / 50</Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>

      <View style={{ alignItems: 'center', marginTop: scale(10) }}>
        <ShortBanner />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: scale(10),
  },
  cardContainer: {
    width: '100%',
    height: scale(200),
    borderRadius: scale(20),
    marginVertical: scale(6),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  imageBg: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end', // content at bottom
  },
  gradient: {
    width: '100%',
    height: '60%',
    justifyContent: 'flex-end',
    borderRadius: scale(20),
  },
  contentWrapper: {
    padding: scale(20),
  },
  gameTitle: {
    color: '#FFF',
    fontSize: scale(24),
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
    backgroundColor: '#39FF14', // Bright neon green for progression
    borderRadius: scale(4),
  },
  levelText: {
    color: '#FFF',
    fontSize: scale(14),
    fontWeight: 'bold',
  }
});
