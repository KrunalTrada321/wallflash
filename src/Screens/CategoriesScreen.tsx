import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { colors } from '../Styling/colors';
import { useNavigation } from '@react-navigation/native';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import NativeAdCard from '../Components/NativeAdCard';

interface CategoryItem {
  id: string;
  name: string;
  image: any;
}

type CategoryFeedItem =
  | { type: 'category'; data: CategoryItem }
  | { type: 'ad'; id: string };

const categories: CategoryItem[] = [ 
  { id: '1', name: 'God', image: require('../assets/category/God.jpg') },
  { id: '2', name: 'Cars', image: require('../assets/category/Cars.jpg') },
  { id: '3', name: 'Anime', image: require('../assets/category/Anime.jpg') },
  { id: '4', name: 'Dark', image: require('../assets/category/Dark.jpg') },
  { id: '5', name: 'Girls', image: require('../assets/category/Girls.jpg') },
  { id: '6', name: 'Men', image: require('../assets/category/Men.jpg') },
  { id: '7', name: 'Nature', image: require('../assets/category/Nature.jpg') },
  { id: '8', name: 'Quotes', image: require('../assets/category/Quotes.jpg') },
  { id: '9', name: 'Stock', image: require('../assets/category/Stock.jpg') },
  { id: '10', name: 'Superheroes', image: require('../assets/category/Superheroes.jpg') },
];  

// Replace with your actual AdMob Interstitial Ad Unit ID 
const adUnitId = "ca-app-pub-7105708210867722/2085051949";

const CategoriesScreen = () => {
  const navigation = useNavigation<any>();
  const [interstitial, setInterstitial] = useState<InterstitialAd | null>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  // Exactly 2 Native Ads in Categories: after Category 3 (index 2) and after Category 7 (index 6)
  const feedItems = useMemo<CategoryFeedItem[]>(() => {
    const list: CategoryFeedItem[] = [];
    categories.forEach((cat, index) => {
      list.push({ type: 'category', data: cat });
      if (index === 2) {
        list.push({ type: 'ad', id: 'cat-native-ad-1' });
      } else if (index === 6) {
        list.push({ type: 'ad', id: 'cat-native-ad-2' });
      }
    });
    return list;
  }, []);

  useEffect(() => {
    loadAd();
  }, []);

  const loadAd = () => {
    const interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      setAdLoaded(true);
    });

    interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      setAdLoaded(false);
      loadAd(); // Load a new ad after the previous one is closed
    });

    interstitialAd.load();
    setInterstitial(interstitialAd);
  };

  const handleCategoryPress = (categoryName: string) => {
    // Navigate to CategoryImages first
    navigation.navigate('CategoryImages', { categoryName });

    // Show the ad **only if it is fully loaded**
    if (adLoaded && interstitial) {
      setTimeout(() => {
        interstitial.show();
      }, 1000); // Delay of 1 second
    }
  };

  const renderItem = ({ item }: { item: CategoryFeedItem }) => {
    if (item.type === 'ad') {
      return (
        <View style={styles.adContainer}>
          <NativeAdCard variant="feed" />
        </View>
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.itemContainer}
        onPress={() => handleCategoryPress(item.data.name)}
      >
        <Image resizeMode="contain" source={item.data.image} style={styles.image} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={feedItems}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => (item.type === 'ad' ? item.id : item.data.id)}
      />
    </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: scale(10),
  },
  itemContainer: {
    marginVertical: scale(6),
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 20,
  },
  image: {
    height: scale(200),
    borderRadius: scale(20),
  },
  adContainer: {
    marginVertical: scale(8),
    width: '100%',
    alignItems: 'center',
  },
});

export default CategoriesScreen;
