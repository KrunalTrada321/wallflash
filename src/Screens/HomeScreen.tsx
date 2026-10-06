import React, { useEffect, useState, useCallback } from 'react';
import {
  View, FlatList, Image, StyleSheet, Dimensions, RefreshControl,
  Text, TouchableOpacity, ActivityIndicator
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../Styling/colors';
import SqareAd from '../Components/SqareAd';
import LottieView from "lottie-react-native";
import { fetchImagesFromFirestore } from '../API/ApiHomeHelper';
import ShortBanner from '../Components/ShortBanner';
import LinearGradient from 'react-native-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CONTAINER_PAD = scale(6);          // matches styles.container padding
const IMAGE_MARGIN = scale(2.3);        // matches styles.image margin
const NUM_COLUMNS = 3;

// Pixel-perfect: subtract container padding (both sides) and all image margins
const IMAGE_WIDTH = Math.floor(
  (SCREEN_WIDTH - CONTAINER_PAD * 2 - IMAGE_MARGIN * 2 * NUM_COLUMNS) / NUM_COLUMNS
);

const PAGE_SIZE = 12;

const HomeScreen = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  const navigation = useNavigation();
  const collections = ['Cars', 'Anime', 'Dark', 'Girls', 'Men', 'Quotes', 'Superheroes'];

  const hasFetched = React.useRef(false);

  // 🔹 Check Internet Connection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected && !hasFetched.current) {
        hasFetched.current = true;
        fetchImages();
      }
    });
    return () => unsubscribe();
  }, [fetchImages]);

  const fetchImages = useCallback(async () => {
    if (!isConnected) { setLoading(false); return; }
    try {
      setLoading(true);
      const fetched = await fetchImagesFromFirestore(collections);
      if (fetched.length === 0) { setHasMore(false); }
      setImages(fetched.sort(() => Math.random() - 0.5));
    } catch (e) {
      console.log('❌ Error fetching images:', e);
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  const handleLoadMore = async () => {
    if (!hasMore || loading) return [];
    setLoading(true);
    try {
      const more = await fetchImagesFromFirestore(collections);
      if (more.length === 0) {
        setHasMore(false);
        return [];
      } else {
        const shuffled = more.sort(() => Math.random() - 0.5);
        setImages(prev => [...prev, ...shuffled]);
        return shuffled;
      }
    } catch (e) {
      console.log('❌ Error loading more:', e);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    await fetchImages();
    setRefreshing(false);
  };

  // ─── No internet ────────────────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <View style={styles.noInternetContainer}>
        <Image style={{ height: scale(35), width: scale(35) }} source={require('../assets/no-wifi.png')} />
        <Text style={styles.noInternetText}>No Internet</Text>
      </View>
    );
  }

  // ─── Initial loader ──────────────────────────────────────────────────────────
  if (loading && images.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <LottieView
          source={require("../assets/flashrunner.json")}
          autoPlay loop speed={1.4}
          style={{ width: scale(85), height: scale(85) }}
        />
      </View>
    );
  }

  // ─── Group images into chunks of 15, each chunk gets an ad below ─────────────
  // Build flat list of "group" items so FlatList stays numColumns={1}
  const CHUNK = 15;
  const groups: string[][] = [];
  for (let i = 0; i < images.length; i += CHUNK) {
    groups.push(images.slice(i, i + CHUNK));
  }

  const renderGroup = ({ item: group }: { item: string[] }) => (
    <View>
      {/* 3-column grid built with fixed IMAGE_WIDTH — never wraps to 2 */}
      <View style={styles.gridRow}>
        {group.map((uri, i) => (
          <TouchableOpacity
            key={`img-${i}`}
            activeOpacity={0.90}
            onPress={() => navigation.navigate('FullImageScreen', { imageUri: uri, images: images, initialIndex: images.indexOf(uri), onLoadMore: handleLoadMore })}
          >
            <Image source={{ uri }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Ad after every chunk */}
      <View style={styles.adWrapper}>
        <SqareAd />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        keyExtractor={(_, index) => `group-${index}`}
        // numColumns={1} — grid is manual, no FlatList column fighting
        renderItem={renderGroup}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore
            ? <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 10 }} />
            : (
              <View style={{ alignItems: 'center', marginVertical: 10 }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('Premium')}
                >
                  <LinearGradient
                    colors={['#FFD700', '#FFC200', '#FFB000', '#FFA000']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }}
                  >
                    <Text style={{ color: colors.black, fontWeight: '600', fontSize: 16 }}>
                      Go to Premium
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )
        }
      />

      <View style={{ alignItems: 'center' }}>
        <ShortBanner />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: CONTAINER_PAD,          // must stay in sync with CONTAINER_PAD constant
    backgroundColor: colors.background,
  },
  noInternetContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.background,
  },
  noInternetText: {
    fontSize: scale(18), fontWeight: '600',
    color: colors.redLight, textAlign: 'center',
  },

  // ── Manual grid ──────────────────────────────────────────────────────────────
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',          // wraps into rows of 3
    marginBottom: scale(10),
  },
  image: {
    width: IMAGE_WIDTH,        // exact 1/3 of available space — always 3 columns
    aspectRatio: 9 / 16,
    margin: IMAGE_MARGIN,      // must stay in sync with IMAGE_MARGIN constant
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },

  adWrapper: {
    alignItems: 'center',
    marginBottom: scale(15),
  },
  loaderContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default HomeScreen;