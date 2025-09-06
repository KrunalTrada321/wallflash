import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { scale } from 'react-native-size-matters';
import { colors } from '../Styling/colors';
import { useNavigation } from '@react-navigation/native';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import ShortBanner from '../Components/ShortBanner';
import LinearGradient from 'react-native-linear-gradient';

const categories = [
  { id: '1', name: 'PrimeGod', title: 'God', image: require('../assets/category/God.jpg') },
  { id: '2', name: 'PrimeCars', title: 'Cars', image: require('../assets/category/Cars.jpg') },
  { id: '3', name: 'PrimeAnime', title: 'Anime', image: require('../assets/category/Anime.jpg') },
  { id: '4', name: 'PrimeDark', title: 'Dark', image: require('../assets/category/Dark.jpg') },
  { id: '5', name: 'PrimeGirls', title: 'Girls', image: require('../assets/category/Girls.jpg') },
  { id: '6', name: 'PrimeMen', title: 'Men', image: require('../assets/category/Men.jpg') },
  { id: '7', name: 'PrimeNature', title: 'Nature', image: require('../assets/category/Nature.jpg') },
  { id: '8', name: 'PrimeQuotes', title: 'Quotes', image: require('../assets/category/Quotes.jpg') },
  { id: '9', name: 'PrimeStock', title: 'Stock', image: require('../assets/category/Stock.jpg') },
  { id: '10', name: 'PrimeSuperheroes', title: 'Superheroes', image: require('../assets/category/Superheroes.jpg') },
];
 
// Replace with your actual AdMob Interstitial Ad Unit ID 
const adUnitId = "ca-app-pub-7105708210867722/2085051949";


const PrimeCategories = () => {
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

  const handleCategoryPress = (categoryName: string,  title: string) => {
    // Navigate to CategoryImages first
    navigation.navigate('PrimeImages', { categoryName, title});
 
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
      onPress={() => handleCategoryPress(item.name, item.title)}
    >

      <Image resizeMode="contain" source={item.image} style={styles.image} />

      <View style={{
        position: "absolute",
        top: scale(20),
        left: -45, // shift left to make strip effect
        backgroundColor: "#FFD700",
        paddingVertical: 2,
        paddingHorizontal: 50,
        transform: [{ rotate: "-45deg" }],
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
      }}>
        <Text style={{
          color: colors.primary,
          fontWeight: "bold",
          textAlign: 'left',
          alignSelf: 'flex-start',
          fontSize: scale(10),
          letterSpacing: 1,
        }}>PREMIUM</Text>
      </View>

    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}


        ListHeaderComponent={() => (
          <LinearGradient


            colors={['#FF0844', '#FF5F6D']}

            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              padding: scale(15),
              borderRadius: scale(16),
              marginBottom: scale(10),
              alignItems: 'center',
            }}
          >

            <Text style={{ fontSize: scale(18), fontWeight: 'bold', color: colors.white }}>
              👑 Premium Wallpapers
            </Text>
            <Text style={{ fontSize: scale(13), color: '#F5F5F5', marginTop: scale(4) }}>
              Exclusive collection just for you
            </Text>

          </LinearGradient>
        )}


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
  banner: {
    padding: scale(15),
    backgroundColor: colors.flashColor, // highlight banner color
    borderRadius: scale(16),
    marginBottom: scale(10),
    alignItems: 'center',
  },
  bannerText: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: colors.white,
  },
  subText: {
    fontSize: scale(13),
    color: colors.white,
    marginTop: scale(4),
  },
});

export default PrimeCategories;
