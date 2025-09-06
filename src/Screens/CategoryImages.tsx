
import React, { useEffect, useState } from 'react';
import {
  View, FlatList, Image, StyleSheet, RefreshControl, TouchableOpacity, Text, Dimensions,
  ActivityIndicator
} from 'react-native';
import { colors } from '../Styling/colors';
import { fetchImagesFromFirestore } from '../API/ApiHelper';
import Back from '../Components/Back';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { useNavigation } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import NetInfo from '@react-native-community/netinfo';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import SqareAd from '../Components/SqareAd';
import LoaderKit from 'react-native-loader-kit';
import LottieView from "lottie-react-native";
import ShortBanner from '../Components/ShortBanner';
import LinearGradient from 'react-native-linear-gradient';


const PAGE_SIZE = 12; // Number of images per page
const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_WIDTH = SCREEN_WIDTH / 3 - 10;


const CategoryImages = ({ route }: any) => {
  const { categoryName } = route.params;

  // const [allImages, setAllImages] = useState([]); // Store all images
  const [images, setImages] = useState([]); // Store paginated images
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [loadingMore, setLoadingMore] = useState(false);



  const navigation = useNavigation();

  // Check Internet Connection on Mount & Subscribe to Changes
  useEffect(() => {
    const checkInternetOnStart = async () => {
      const netState = await NetInfo.fetch();
      setIsConnected(netState.isConnected);

      if (!netState.isConnected) {
        showMessage({
          message: "No Internet Connection",
          description: "Please check your internet and try again.",
          type: "danger",
        });
      } else {
        fetchCategoryImages(true);
      }
    };

    checkInternetOnStart(); // Immediate check when component mounts

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        showMessage({
          message: "No Internet Connection",
          description: "Please check your internet and try again.",
          type: "danger",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // const fetchCategoryImages = async () => {
  //   if (!isConnected) {
  //     setLoading(false);
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const fetchedImages = await fetchImagesFromFirestore([categoryName]);

  //     const shuffledImages = fetchedImages.sort(() => Math.random() - 0.5);

  //     setAllImages(shuffledImages);
  //     setImages(shuffledImages.slice(0, PAGE_SIZE));

  //     if (shuffledImages.length <= PAGE_SIZE) {
  //       setHasMore(false);
  //     }
  //   } catch (error) {
  //     console.log('❌ Error fetching images:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchCategoryImages = async (reset = false) => {
    if (!isConnected) {
      setLoading(false);
      return;
    }

    if (reset) {
      setLoading(true);
    }

    try {
      const fetchedImages = await fetchImagesFromFirestore([categoryName], reset);

      if (reset) {
        setImages(fetchedImages);
        setPage(1);
        setHasMore(fetchedImages.length === PAGE_SIZE);
      } else {
        setImages(prev => [...prev, ...fetchedImages]);
        setPage(prev => prev + 1);
        if (fetchedImages.length < PAGE_SIZE) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.log('❌ Error fetching images:', error);
    } finally {
      if (reset) setLoading(false);
    }
  };



  // const handleLoadMore = () => {
  //   if (!hasMore || loading) return;

  //   const nextPage = page + 1;
  //   const newImages = allImages.slice(0, nextPage * PAGE_SIZE);

  //   setImages(newImages);
  //   setPage(nextPage);

  //   if (newImages.length >= allImages.length) {
  //     setHasMore(false);
  //   }
  // };



  // const handleRefresh = async () => {
  //   setRefreshing(true);
  //   setPage(1);
  //   setHasMore(true);
  //   await fetchCategoryImages();
  //   setRefreshing(false);
  // };


  const handleLoadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    await fetchCategoryImages();
    setLoadingMore(false);
  };


  const handleRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    await fetchCategoryImages(true); // Pass reset = true
    setRefreshing(false);
  };



  const renderShimmer = () => (
    <FlatList
      data={Array.from({ length: PAGE_SIZE })}
      keyExtractor={(_, index) => index.toString()}
      numColumns={3}
      renderItem={() => (
        <ShimmerPlaceholder style={styles.shimmer} shimmerColors={['#F5F5F5', '#F5F5F5', '#F5F5F5']} />
      )}
    />
  );


  const renderLoader = () => (
    <View style={styles.loaderContainer}>
      {/* <LoaderKit
        style={{  width: scale(80),
          height: scale(80), }}
        name={'BallTrianglePath'} 
        color={"#F7005F"}  // Deep Purple 
      />   */}

      <LottieView
        source={require("../assets/flashrunner.json")} // Adjust path
        autoPlay 
        loop
        speed={1.4} // Increase speed (default is 1)
        style={{ width: scale(85), height: scale(85) }}
      />


    </View>
  );

  // const renderItem = ({ item }: any) => (
  //   <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('FullImageScreen', { imageUri: item })}>
  //     <Image
  //       source={{ uri: item }}
  //       style={styles.image}
  //       onError={(e) => e.currentTarget.setNativeProps({ src: [{ uri: 'fallback-image-url' }] })}
  //     />
  //   </TouchableOpacity>
  // );


  const renderItem = ({ item, index }: { item: string, index: number }) => {
    // Ensure we only process every 3rd image and insert an ad
    if (index % 3 === 0) {
      return (
        <View>
          {/* Image Row (3 images) */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {images.slice(index, index + 3).map((image, i) => (
              <TouchableOpacity
                key={`image-${index + i}`}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('FullImageScreen', { imageUri: image })}
              >
                <Image source={{ uri: image }} style={styles.image} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Ad appears after every 3 images */}
          {(index + 3) % 15 === 0 && index !== 0 && (
            <View style={{ alignItems: 'center', marginBottom: scale(15) }}>
              <SqareAd />
            </View>
          )}
        </View>
      );
    }
    return null; // Prevents duplicate rendering
  };




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

  return (
    <View style={styles.container}>
      <Back categoryName={categoryName} />
      <FlashMessage position="top" />

      <View style={{ paddingHorizontal: scale(6) }}>
        {loading && images.length === 0 ? (
          renderLoader()  // Show loader instead of shimmer
        ) : (
          <FlatList
            data={images} 
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            renderItem={renderItem}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            // ListFooterComponent={hasMore ? renderShimmer() : <Text style={styles.noMoreText}>No more images</Text>}
            // ListFooterComponent={() => {
            //   if (loadingMore) return renderShimmer();
            //   if (!hasMore) return <Text style={styles.noMoreText}>No more images</Text>;
            //   return null;
            // }}

            ListFooterComponent={() => {
              if (loadingMore) {
                return (
                  <View style={{
                    paddingVertical: scale(12),
                    marginTop: scale(8),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <ActivityIndicator size="small" color="#000000" />
                  </View>
                );
              }
              if (!hasMore) {
                return (<View style={{ alignItems: 'center', marginVertical: 10 }}>
                
                          <TouchableOpacity
                          activeOpacity={0.7}
                            onPress={() => navigation.navigate('Drawer', {   // your drawer navigator name
                              screen: 'WallFlash',           // bottom tab navigator inside the drawer
                              params: { 
                                screen: 'Premium',            // the tab you want
                              },
                            })
                          }
                            style={{  
                              paddingHorizontal: 20,
                              paddingVertical: 10,
                              borderRadius: 8,
                            }}
                          > 
                            <LinearGradient
                              colors={['#FFD700', '#FFC200', '#FFB000', '#FFA000']} // golden tones
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={{
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                borderRadius: 10,
                              }}
                            >
                              <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
                                Go to Premium
                              </Text>
                            </LinearGradient>
                          </TouchableOpacity>
                
                        </View>)
              }
              return null;
            }}

          />
        )}

      
      </View>




    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: scale(50)
  },
  noInternetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  noInternetText: {
    fontSize: scale(18),
    fontWeight: '600',
    color: colors.redLight,
    textAlign: 'center',
    marginTop: scale(10),
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
    margin: scale(2.8),
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
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height * 0.5, // Center the loader
  },
});

export default CategoryImages;





