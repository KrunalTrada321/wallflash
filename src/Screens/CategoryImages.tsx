import React, { useEffect, useState } from 'react';
import {
  View, FlatList, Image, StyleSheet, RefreshControl, TouchableOpacity, Text, Dimensions,
  ActivityIndicator
} from 'react-native';
import { colors } from '../Styling/colors';
import { fetchImagesFromFirestore } from '../API/ApiHelper';
import Back from '../Components/Back';
import { useNavigation } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import NetInfo from '@react-native-community/netinfo';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import SqareAd from '../Components/SqareAd';
import LottieView from "lottie-react-native";
import LinearGradient from 'react-native-linear-gradient';

const PAGE_SIZE    = 12;
const SCREEN_WIDTH = Dimensions.get('window').width;

// ─── Pixel-perfect width constants (must stay in sync) ───────────────────────
const NUM_COLUMNS   = 3;
const HORIZ_PAD     = scale(6);   // paddingHorizontal on the FlatList wrapper
const IMAGE_MARGIN  = scale(2.8); // matches styles.image margin
const IMAGE_WIDTH   = Math.floor(
  (SCREEN_WIDTH - HORIZ_PAD * 2 - IMAGE_MARGIN * 2 * NUM_COLUMNS) / NUM_COLUMNS
);
// ─────────────────────────────────────────────────────────────────────────────

const CHUNK = 15; // images per group before an ad

const CategoryImages = ({ route }: any) => {
  const { categoryName } = route.params;

  const [images, setImages]         = useState<string[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore]       = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const checkInternetOnStart = async () => {
      const netState = await NetInfo.fetch();
      setIsConnected(netState.isConnected);
      if (!netState.isConnected) {
        showMessage({ message: "No Internet Connection", description: "Please check your internet and try again.", type: "danger" });
      } else {
        fetchCategoryImages(true);
      }
    };

    checkInternetOnStart();

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        showMessage({ message: "No Internet Connection", description: "Please check your internet and try again.", type: "danger" });
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCategoryImages = async (reset = false) => {
    if (!isConnected) { setLoading(false); return; }
    if (reset) setLoading(true);

    try {
      const fetched = await fetchImagesFromFirestore([categoryName], reset);
      if (reset) {
        setImages(fetched);
        setHasMore(fetched.length === PAGE_SIZE);
      } else {
        setImages(prev => [...prev, ...fetched]);
        if (fetched.length < PAGE_SIZE) setHasMore(false);
      }
    } catch (e) {
      console.log('❌ Error fetching images:', e);
    } finally {
      if (reset) setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    await fetchCategoryImages();
    setLoadingMore(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    await fetchCategoryImages(true);
    setRefreshing(false);
  };

  // ─── No internet ────────────────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <View style={{ flex: 1 }}>
        <Back categoryName={categoryName} />
        <FlashMessage position="top" />
        <View style={styles.noInternetContainer}>
          <Image style={{ height: scale(35), width: scale(35) }} source={require('../assets/no-wifi.png')} />
          <Text style={styles.noInternetText}>No Internet</Text>
        </View>
      </View>
    );
  }

  // ─── Initial loader ──────────────────────────────────────────────────────────
  if (loading && images.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Back categoryName={categoryName} />
        <View style={styles.loaderContainer}>
          <LottieView
            source={require("../assets/flashrunner.json")}
            autoPlay loop speed={1.4}
            style={{ width: scale(85), height: scale(85) }}
          />
        </View>
      </View>
    );
  }

  // ─── Pre-group images into chunks of CHUNK for ad injection ─────────────────
  const groups: string[][] = [];
  for (let i = 0; i < images.length; i += CHUNK) {
    groups.push(images.slice(i, i + CHUNK));
  }

  const renderGroup = ({ item: group }: { item: string[] }) => (
    <View>
      {/* Fixed 3-column grid — IMAGE_WIDTH guarantees exactly 3 per row */}
      <View style={styles.gridRow}>
        {group.map((uri, i) => (
          <TouchableOpacity
            key={`img-${i}`}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('FullImageScreen', { imageUri: uri })}
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
      <Back categoryName={categoryName} />
      <FlashMessage position="top" />

      <FlatList
        data={groups}
        keyExtractor={(_, index) => `group-${index}`}
        // numColumns={1} — grid is manual; no FlatList column math interference
        contentContainerStyle={{ paddingHorizontal: HORIZ_PAD, paddingBottom: scale(50) }}
        renderItem={renderGroup}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => {
          if (loadingMore) {
            return (
              <View style={{ paddingVertical: scale(12), alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#000000" />
              </View>
            );
          }
          if (!hasMore) {
            return (
              <View style={{ alignItems: 'center', marginVertical: 10 }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate('Drawer', {
                      screen: 'WallFlash',
                      params: { screen: 'Premium' },
                    })
                  }
                >
                  <LinearGradient
                    colors={['#FFD700', '#FFC200', '#FFB000', '#FFA000']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, alignItems: 'center' }}
                  >
                    <Text style={{ color: 'white', fontWeight: '600', fontSize: scale(12) }}>Want More?</Text>
                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Go to Premium</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            );
          }
          return null;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  noInternetContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.white,
  },
  noInternetText: {
    fontSize: scale(18), fontWeight: '600',
    color: colors.redLight, textAlign: 'center', marginTop: scale(10),
  },

  // ── Manual grid ──────────────────────────────────────────────────────────────
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',        // wraps into rows of exactly 3
  },
  image: {
    width: IMAGE_WIDTH,      // pixel-perfect 1/3 — always 3 columns on every device
    aspectRatio: 9 / 16,
    margin: IMAGE_MARGIN,    // must stay in sync with IMAGE_MARGIN constant above
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
  },
});

export default CategoryImages;