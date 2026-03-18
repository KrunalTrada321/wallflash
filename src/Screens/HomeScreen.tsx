
// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   View, FlatList, Image, StyleSheet, Dimensions, RefreshControl, Text, TouchableOpacity, ActivityIndicator
// } from 'react-native';
// import NetInfo from '@react-native-community/netinfo';
// import { scale } from 'react-native-size-matters';
// import { useNavigation } from '@react-navigation/native';
// import { colors } from '../Styling/colors';
// import SqareAd from '../Components/SqareAd';
// import LottieView from "lottie-react-native";
// import { fetchImagesFromFirestore } from '../API/ApiHomeHelper';
// import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
// import ShortBanner from '../Components/ShortBanner';
// import LinearGradient from 'react-native-linear-gradient';

// const SCREEN_WIDTH = Dimensions.get('window').width;
// const IMAGE_WIDTH = Math.floor(SCREEN_WIDTH / 3) - 10;
// const PAGE_SIZE = 12;

// const HomeScreen = () => {
//   // const [allImages, setAllImages] = useState<string[]>([]);
//   const [images, setImages] = useState<string[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
//   const [page, setPage] = useState<number>(1);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [isConnected, setIsConnected] = useState<boolean | null>(true);


//   const navigation = useNavigation();
//   const collections = ['Cars', 'Anime', 'Dark', 'Girls', 'Men', 'Quotes', 'Superheroes'];

//   // 🔹 Check Internet Connection 
//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener(state => {
//       setIsConnected(state.isConnected);
//       if (state.isConnected) {
//         fetchImages(); // Fetch images when internet is available
//       }
//     });
//     return () => unsubscribe();
//   }, []);



//   // const fetchImages = useCallback(async () => { 
//   //   if (!isConnected) {
//   //     setLoading(false);
//   //     return;  
//   //   }

//   //   try {
//   //     setLoading(true);
//   //     const fetchedImages = await fetchImagesFromFirestore(collections);

//   //     if (fetchedImages.length === 0) { 
//   //       setHasMore(false); 
//   //     }

//   //     const shuffledImages = fetchedImages.sort(() => Math.random() - 0.5);
//   //     setAllImages(shuffledImages);
//   //     setImages(shuffledImages.slice(0, PAGE_SIZE));
//   //   } catch (error) {
//   //     console.log('❌ Error fetching images:', error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // }, [isConnected]);


//   const fetchImages = useCallback(async () => {
//     if (!isConnected) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       const fetchedImages = await fetchImagesFromFirestore(collections);

//       if (fetchedImages.length === 0) {
//         setHasMore(false);
//       }

//       const shuffledImages = fetchedImages.sort(() => Math.random() - 0.5);
//       setImages(shuffledImages);
//       setPage(1);
//     } catch (error) {
//       console.log('❌ Error fetching images:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [isConnected]);



//   // const handleLoadMore = () => {
//   //   if (!hasMore || loading) return;

//   //   const nextPage = page + 1;
//   //   const newImages = allImages.slice(0, nextPage * PAGE_SIZE);
//   //   setImages(newImages);
//   //   setPage(nextPage);

//   //   if (newImages.length >= allImages.length) {
//   //     setHasMore(false);
//   //   }
//   // };


//   const handleLoadMore = async () => {
//     if (!hasMore || loading) return;

//     setLoading(true);

//     try {
//       const newFetchedImages = await fetchImagesFromFirestore(collections);

//       if (newFetchedImages.length === 0) {
//         setHasMore(false);
//       } else {
//         const shuffledNew = newFetchedImages.sort(() => Math.random() - 0.5);
//         setImages(prev => [...prev, ...shuffledNew]);
//         setPage(prev => prev + 1);
//       }
//     } catch (error) {
//       console.log('❌ Error loading more images:', error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleRefresh = async () => {
//     setRefreshing(true);
//     setPage(1);
//     setHasMore(true);
//     await fetchImages();
//     setRefreshing(false);
//   };


//   if (!isConnected) {
//     return (
//       <View style={styles.noInternetContainer}>
//         <Image style={{ height: scale(35), width: scale(35) }} source={require('../assets/no-wifi.png')} />
//         <Text style={styles.noInternetText}>No Internet</Text>
//       </View>
//     );
//   }




//   if (loading && images.length === 0) {
//     return (
//       <View style={styles.loaderContainer}>
//         {/* <LoaderKit
//           style={styles.loader}
//           name="BallTrianglePath"
//           color={"#F7005F"}
//         /> */}

//         <LottieView
//           source={require("../assets/flashrunner.json")} // Adjust path
//           autoPlay
//           loop
//           speed={1.4} // Increase speed (default is 1)
//           style={{ width: scale(85), height: scale(85) }}
//         />

//       </View>
//     );
//   }




//   const renderItem = ({ item, index }: { item: string, index: number }) => {
//     if (index % 15 === 0) {
//       return (
//         <View>

//           <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: scale(10) }}>
//             {images.slice(index, index + 15).map((image, i) => (
//               <TouchableOpacity
//                 key={`image-${index + i}`}
//                 activeOpacity={0.90}
//                 onPress={() => navigation.navigate('FullImageScreen', { imageUri: image })}
//               >
//                 <Image source={{ uri: image }} style={styles.image} />
//                 {/* <FastImage
//                   source={{ uri: image, priority: FastImage.priority.high }}
//                   style={styles.image}
//                 />  */}

//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Centered Ad Below */}
//           <View style={{ alignItems: 'center', marginBottom: scale(15) }}>
//             <SqareAd />
//           </View>
//         </View>
//       );
//     }
//     return null; // Rendered in the group above
//   };




//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={images}
//         keyExtractor={(item, index) => `image-${index}`}
//         numColumns={3}
//         renderItem={renderItem} 
//         columnWrapperStyle={{ justifyContent: 'space-between' }}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={hasMore ? <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 10 }} /> : <View style={{ alignItems: 'center', marginVertical: 10 }}>

//           <TouchableOpacity
//           activeOpacity={0.7}
//             onPress={() => navigation.navigate('Premium')} // Replace with your premium tab name
//             style={{
//               paddingHorizontal: 20,
//               paddingVertical: 10,
//               borderRadius: 8,
//             }}
//           >
//             <LinearGradient
//               colors={['#FFD700', '#FFC200', '#FFB000', '#FFA000']} // golden tones
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={{
//                 paddingHorizontal: 20,
//                 paddingVertical: 10,
//                 borderRadius: 10,
//               }}
//             >
//               <Text style={{ color: colors.black, fontWeight: '600', fontSize: 16 }}>
//                 Go to Premium
//               </Text>
//             </LinearGradient>
//           </TouchableOpacity>

//         </View>}
//       />

//       <View style={{ alignItems: 'center' }}>
//         <ShortBanner />
//       </View>


//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: scale(6),
//     backgroundColor: colors.background
//   },
//   noInternetContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.background
//   },
//   noInternetText: {
//     fontSize: scale(18),
//     fontWeight: '600',
//     color: colors.redLight,
//     textAlign: 'center'
//   },
//   shimmer: {
//     width: IMAGE_WIDTH,
//     height: (IMAGE_WIDTH * 16) / 9,
//     margin: scale(3),
//     borderRadius: 15,
//   },
//   image: {
//     width: IMAGE_WIDTH,
//     aspectRatio: 9 / 16,
//     margin: scale(2.3),
//     borderRadius: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 6,
//   },
//   noMoreText: {
//     textAlign: 'center',
//     paddingVertical: 10,
//     fontSize: scale(16),
//     color: 'gray',
//   },

//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.background,
//   },
//   loader: {
//     width: scale(80),
//     height: scale(80),
//   },

// });

// export default HomeScreen;


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

const SCREEN_WIDTH   = Dimensions.get('window').width;
const CONTAINER_PAD  = scale(6);          // matches styles.container padding
const IMAGE_MARGIN   = scale(2.3);        // matches styles.image margin
const NUM_COLUMNS    = 3;

// Pixel-perfect: subtract container padding (both sides) and all image margins
const IMAGE_WIDTH = Math.floor(
  (SCREEN_WIDTH - CONTAINER_PAD * 2 - IMAGE_MARGIN * 2 * NUM_COLUMNS) / NUM_COLUMNS
);

const PAGE_SIZE = 12;

const HomeScreen = () => {
  const [images, setImages]           = useState<string[]>([]);
  const [loading, setLoading]         = useState<boolean>(true);
  const [refreshing, setRefreshing]   = useState<boolean>(false);
  const [hasMore, setHasMore]         = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  const navigation  = useNavigation();
  const collections = ['Cars', 'Anime', 'Dark', 'Girls', 'Men', 'Quotes', 'Superheroes'];

  // 🔹 Check Internet Connection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) fetchImages();
    });
    return () => unsubscribe();
  }, []);

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
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const more = await fetchImagesFromFirestore(collections);
      if (more.length === 0) {
        setHasMore(false);
      } else {
        setImages(prev => [...prev, ...more.sort(() => Math.random() - 0.5)]);
      }
    } catch (e) {
      console.log('❌ Error loading more:', e);
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