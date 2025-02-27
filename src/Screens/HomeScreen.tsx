import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions, RefreshControl, Text, TouchableOpacity } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { fetchImagesFromFirestore } from '../API/ApiHelper';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../Styling/colors';

// 🔹 Screen width for responsive image sizes
const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_WIDTH = SCREEN_WIDTH / 3 - 10;
const PAGE_SIZE = 12; // Number of images per load

const HomeScreen = () => {
  const [allImages, setAllImages] = useState([]); // Store all images fetched
  const [images, setImages] = useState([]); // Store images for pagination
  const [loading, setLoading] = useState(true); 
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigation = useNavigation();
  
  const collections = [
    'Cars', 'Dark', 'Girls', 'Men', 'Nature', 'Quotes', 'Stock', 'Superheroes'
  ]; 


  const fetchImages = async () => {
    setLoading(true);
    const fetchedImages = await fetchImagesFromFirestore(collections);
  
    if (fetchedImages.length === 0) {
      setHasMore(false);
    }
  
    // 🔹 Shuffling images for randomness
    const shuffledImages = fetchedImages.sort(() => Math.random() - 0.5);
  
    setAllImages(shuffledImages);
    setImages(shuffledImages.slice(0, PAGE_SIZE)); // Load first 12 images
    setLoading(false);
  };
  

  useEffect(() => {
    fetchImages();
  }, []);

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
    await fetchImages(); // Already fetches random images
    setRefreshing(false);
  };
  

  const renderShimmer = () => (
    <FlatList
      data={Array.from({ length: PAGE_SIZE })} // Creates an array for shimmer placeholders
      keyExtractor={(_, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      numColumns={3} // Makes sure shimmer placeholders align with real images
      renderItem={() => (
        <ShimmerPlaceholder
          style={styles.shimmer}
          shimmerColors={['#E0E0E0', '#F5F5F5', '#E0E0E0']}
        />
      )}
    />
  ); 
  

  if (loading && images.length === 0) {
    return <View style={styles.container}>{renderShimmer()}</View>;
  }


  const renderItem = ({ item }: any) => (
    <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('FullImageScreen', { imageUri: item })}>
      <Image source={{ uri: item }} style={styles.image} />
    </TouchableOpacity> 
  ); 

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} // Load more when scrolling near the end
        ListFooterComponent={hasMore ? renderShimmer() : <Text style={styles.noMoreText}>No more images</Text>}
      />
    </View>
  ); 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(4),
    backgroundColor: colors.background
  },
  shimmerContainer: { 
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shimmer: {
    width: IMAGE_WIDTH,
    height: (IMAGE_WIDTH * 16) / 9, // Maintain aspect ratio
    margin: scale(3),
    borderRadius: 15,
  }, 
  image: {
    width: IMAGE_WIDTH,
    aspectRatio: 9 / 16,
    margin: scale(3.5),
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
    fontSize: 16,
    color: 'gray',
  },
});

export default HomeScreen;
 