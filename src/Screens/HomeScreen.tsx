
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, FlatList, Image, StyleSheet, Dimensions, RefreshControl, Text, TouchableOpacity, ActivityIndicator
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { fetchImagesFromFirestore } from '../API/ApiHelper';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../Styling/colors';
import SqareAd from '../Components/SqareAd';
import LoaderKit from 'react-native-loader-kit';
import LottieView from "lottie-react-native";




const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_WIDTH = Math.floor(SCREEN_WIDTH / 3) - 10;
const PAGE_SIZE = 12;

const HomeScreen = () => {
  const [allImages, setAllImages] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  const navigation = useNavigation();
  const collections = ['Cars', 'Dark', 'Girls', 'Men', 'Nature', 'Quotes', 'Stock', 'Superheroes'];

  // 🔹 Check Internet Connection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        fetchImages(); // Fetch images when internet is available
      }
    });
    return () => unsubscribe();
  }, []);



  const fetchImages = useCallback(async () => {
    if (!isConnected) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchedImages = await fetchImagesFromFirestore(collections);

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

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await fetchImages();
    setRefreshing(false);
  };


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
        {/* <LoaderKit
          style={styles.loader}
          name="BallTrianglePath"
          color={"#F7005F"}
        /> */}

        <LottieView
          source={require("../assets/flashrunner.json")} // Adjust path
          autoPlay
          loop
          speed={1.8} // Increase speed (default is 1)
          style={{width: scale(100), height: scale(100)}}
        />

      </View>
    );
  }




  const renderItem = ({ item, index }: { item: string, index: number }) => {
    if (index % 15 === 0) {
      return (
        <View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: scale(10) }}>
            {images.slice(index, index + 15).map((image, i) => (
              <TouchableOpacity
                key={`image-${index + i}`}
                activeOpacity={0.90}
                onPress={() => navigation.navigate('FullImageScreen', { imageUri: image })}
              >
                <Image source={{ uri: image }} style={styles.image} />
                {/* <FastImage
                  source={{ uri: image, priority: FastImage.priority.high }}
                  style={styles.image}
                />  */}

              </TouchableOpacity>
            ))}
          </View>

          {/* Centered Ad Below */}
          <View style={{ alignItems: 'center', marginBottom: scale(15) }}>
            <SqareAd />
          </View>
        </View>
      );
    }
    return null; // Rendered in the group above
  };




  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item, index) => `image-${index}`}
        numColumns={3}
        renderItem={renderItem}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={hasMore ? <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 10 }} /> : <Text style={styles.noMoreText}>No more images</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(5),
    backgroundColor: colors.background
  },
  noInternetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background
  },
  noInternetText: {
    fontSize: scale(18),
    fontWeight: '600',
    color: colors.redLight,
    textAlign: 'center'
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
    margin: scale(2.5),
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  noMoreText: {
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: scale(16),
    color: 'gray',
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

export default HomeScreen;
