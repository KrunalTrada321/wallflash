import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { colors } from '../Styling/colors';
import { useNavigation } from '@react-navigation/native';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const categories = [
  { id: '1', name: 'Cars', image: require('../assets/category/Cars.jpg') },
  { id: '2', name: 'Dark', image: require('../assets/category/Dark.jpg') },
  { id: '3', name: 'Girls', image: require('../assets/category/Girls.jpg') },
  { id: '4', name: 'Men', image: require('../assets/category/Men.jpg') },
  { id: '5', name: 'Nature', image: require('../assets/category/Nature.jpg') },
  { id: '6', name: 'Quotes', image: require('../assets/category/Quotes.jpg') },
  { id: '7', name: 'Stock', image: require('../assets/category/Stock.jpg') },
  { id: '8', name: 'Superheroes', image: require('../assets/category/Superheroes.jpg') },
];

// Replace with your actual AdMob Interstitial Ad Unit ID 
const adUnitId = "ca-app-pub-7105708210867722/2085051949";
  
const CategoriesScreen = () => {
  const navigation = useNavigation();
  const [interstitial, setInterstitial] = useState<InterstitialAd | null>(null);
  const [adLoaded, setAdLoaded] = useState(false);

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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.itemContainer}
      onPress={() => handleCategoryPress(item.name)}
    >
      <Image resizeMode="contain" source={item.image} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
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
});

export default CategoriesScreen;
