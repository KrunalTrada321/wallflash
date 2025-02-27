import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { colors } from '../Styling/colors';
import { useNavigation } from '@react-navigation/native';

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
 
const CategoriesScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.itemContainer}
      onPress={() => navigation.navigate('CategoryImages', { categoryName: item.name })}>
      <Image resizeMode='contain' source={item.image} style={styles.image} />
    </TouchableOpacity>
  ); 
 
  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
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
    borderRadius: 20
  },
  image: {
    height: scale(200),
    borderRadius: scale(20),
  },
  text: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CategoriesScreen;
