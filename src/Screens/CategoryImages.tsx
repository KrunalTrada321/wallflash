import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, RefreshControl, TouchableOpacity, Text, Dimensions } from 'react-native';
import { colors } from '../Styling/colors';
import { fetchImagesFromFirestore } from '../API/ApiHelper'; 
import Back from '../Components/Back';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { useNavigation } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';

const PAGE_SIZE = 12; // Number of images per page
const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_WIDTH = SCREEN_WIDTH / 3 - 10;

const CategoryImages = ({ route }: any) => {
  const { categoryName } = route.params; 

  const [allImages, setAllImages] = useState([]); // Store all images
  const [images, setImages] = useState([]); // Store paginated images
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigation = useNavigation();

  const fetchCategoryImages = async () => {
    setLoading(true);
    const fetchedImages = await fetchImagesFromFirestore([categoryName]); // Fetch category-specific images

    const shuffledImages = fetchedImages.sort(() => Math.random() - 0.5);

    setAllImages(shuffledImages); // Store all images
    setImages(shuffledImages.slice(0, PAGE_SIZE)); // Load first set of images
    setLoading(false);

    if (shuffledImages.length <= PAGE_SIZE) {
      setHasMore(false);
    }
  };

 
    

  useEffect(() => {
    fetchCategoryImages();
  }, [categoryName]);

  const handleLoadMore = () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    const newImages = allImages.slice(0, nextPage * PAGE_SIZE); // Load next set of images

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
    await fetchCategoryImages();
    setRefreshing(false);
  };

  const renderShimmer = () => (
    <FlatList
      data={Array.from({ length: PAGE_SIZE })}
      keyExtractor={(_, index) => index.toString()}
      numColumns={3}
      renderItem={() => (
        <ShimmerPlaceholder style={styles.shimmer} shimmerColors={['#E0E0E0', '#F5F5F5', '#E0E0E0']} />
      )}
    />
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('FullImageScreen', { imageUri: item })}>
      <Image source={{ uri: item }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Back categoryName={categoryName} />
     
     <View style={{paddingHorizontal: scale(6)}}>
      {loading && images.length === 0 ? (
        renderShimmer()
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={hasMore ? renderShimmer() : <Text style={styles.noMoreText}>No more images</Text>}
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

export default CategoryImages;
