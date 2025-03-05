import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions, RefreshControl, Text, TouchableOpacity } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import NetInfo from '@react-native-community/netinfo';
import { fetchImagesFromFirestore } from '../API/ApiHelper';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../Styling/colors';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
import LoaderKit from 'react-native-loader-kit';

// 🔹 AdMob Rewarded Ad (Use Test ID for testing)
const adUnitId = "ca-app-pub-3940256099942544/5224354917";
const rewardedAd = RewardedAd.createForAdRequest(adUnitId, { keywords: ['wallpapers', 'premium', 'images'] });

// 🔹 Screen width for responsive image sizes
const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_WIDTH = SCREEN_WIDTH / 3 - 10;
const PAGE_SIZE = 12;

const PremiumScreen = () => {
  const [allImages, setAllImages] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [rewardedLoaded, setRewardedLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigation = useNavigation();

  // 🔹 Listen for Rewarded Ad Events
  // useEffect(() => {
  //   const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
  //     setRewardedLoaded(true);
  //   });

  //   const unsubscribeEarned = rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
  //     if (selectedImage) {
  //       navigation.navigate('FullImageScreen', { imageUri: selectedImage });
  //       setSelectedImage(null);
  //     }
  //   });

  //   rewardedAd.load();

  //   return () => {
  //     unsubscribeLoaded();
  //     unsubscribeEarned();
  //   };
  // }, [selectedImage]);


  useEffect(() => {
    const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log("✅ Rewarded Ad Loaded Successfully");
      setRewardedLoaded(true);
    });

    const unsubscribeEarned = rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      if (selectedImage) {
        navigation.navigate('FullImageScreen', { imageUri: selectedImage });
        setSelectedImage(null);
      }
      setRewardedLoaded(false); // Reset loading state
      rewardedAd.load(); // Load a new ad
    });

    rewardedAd.load(); // Load ad when component mounts

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);




  // 🔹 Check Internet Connection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        fetchImages();
      }
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Fetch Images from Firestore
  const fetchImages = useCallback(async () => {
    if (!isConnected) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchedImages = await fetchImagesFromFirestore(['Premium']);

      if (fetchedImages.length === 0) {
        setHasMore(false);
      }

      const shuffledImages = fetchedImages.sort(() => Math.random() - 0.5);
      setAllImages(shuffledImages);
      setImages(shuffledImages.slice(0, PAGE_SIZE));
    } catch (error) {
      console.log('❌ Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  // 🔹 Load More Images When Scrolling
  const handleLoadMore = () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    const newImages = allImages.slice(0, nextPage * PAGE_SIZE);

    setImages(newImages);
    setPage(nextPage);

    if (newImages.length >= allImages.length) {
      setHasMore(false);
    }
  };

  // 🔹 Pull-to-Refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await fetchImages();
    setRefreshing(false);
  };

  // 🔹 Handle Image Click → Show Rewarded Ad → Navigate to FullImageScreen
  // const handleImagePress = (imageUri: string) => {
  //   setSelectedImage(imageUri);

  //   if (rewardedLoaded) {
  //     rewardedAd.show();
  //   } else {
  //     console.warn("⚠️ Ad not loaded, navigating directly.");
  //     navigation.navigate('FullImageScreen', { imageUri });
  //   }
  // };


  const handleImagePress = (imageUri: string) => {
    setSelectedImage(imageUri);

    if (rewardedLoaded) { 
      navigation.navigate('FullImageScreen', { imageUri });
      rewardedAd.show().then(() => rewardedAd.load()) // Reload the ad after showing
        .catch((error) => {
          console.log("⚠️ Failed to show ad:", error);
          navigation.navigate('FullImageScreen', { imageUri });
          rewardedAd.load(); // Reload the ad in case of failure
        });
    } else {
      console.log("⚠️ Ad not loaded yet, loading now...");
      rewardedAd.load(); // Load the ad and wait for the next attempt
      setTimeout(() => {
        if (rewardedLoaded) {
          rewardedAd.show()
            .then(() => rewardedAd.load())
            .catch(() => navigation.navigate('FullImageScreen', { imageUri }));
        } else {
          console.log("⚠️ Ad still not loaded, navigating directly.");
          navigation.navigate('FullImageScreen', { imageUri });
        }
      }, 3000); // Wait 3 seconds before retrying
    }
  };




  // 🔹 Show "No Internet" Message
  if (!isConnected) {
    return (
      <View style={styles.noInternetContainer}>
        <Image style={{ height: scale(35), width: scale(35) }} source={require('../assets/no-wifi.png')} />
        <Text style={styles.noInternetText}>No Internet</Text>
      </View>
    );
  }




  if (loading && images.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <LoaderKit
          style={styles.loader}
          name="BallTrianglePath"
          color={"#F7005F"}  // Deep Purple 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        renderItem={({ item }) => (

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              if (rewardedLoaded) {
                handleImagePress(item); // Show Ad if ready
              } else {
                console.log("⚠️ Ad not ready, navigating directly.");
                navigation.navigate('FullImageScreen', { imageUri: item }); // Navigate without Ad
                rewardedAd.load(); // Load the ad for next time
              }
            }}
          >
            <Image source={{ uri: item }} style={styles.image} />
            <Image source={require('../assets/crown.png')} style={styles.crownIcon} />
          </TouchableOpacity>


        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}

        ListFooterComponent={() =>
          hasMore ? <View></View> : (
            <View style={styles.noMoreContainer}>
              <Text style={styles.noMoreText}>No more images</Text>
            </View>
          )
        }

      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(4),
    backgroundColor: colors.background,
  },
  shimmer: {
    width: IMAGE_WIDTH,
    height: (IMAGE_WIDTH * 16) / 9,
    margin: scale(3),
    borderRadius: 15,
  },
  image: {
    width: IMAGE_WIDTH,
    aspectRatio: 9 / 16,
    margin: scale(3.5),
    borderRadius: 15,
    elevation: 6,
  },
  noMoreText: {
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 16,
    color: 'gray',
  },
  noMoreContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  noInternetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  noInternetText: {
    fontSize: scale(18),
    fontWeight: '600',
    color: colors.redLight,
    textAlign: 'center',
  },
  crownIcon: {
    position: 'absolute',
    top: scale(14),
    right: scale(14),
    width: scale(18),
    height: scale(18),
    resizeMode: 'contain',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loader: {
    width: scale(80),
    height: scale(80),
  },

});

export default PremiumScreen;
