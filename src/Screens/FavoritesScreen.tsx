import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../Styling/colors";
import { scale } from "react-native-size-matters";
import Back from "../Components/Back";

const FavoritesScreen = () => {
  const [likedImages, setLikedImages] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLikedImages = async () => {
      try {
        const images = await AsyncStorage.getItem("likedImages");
        setLikedImages(images ? JSON.parse(images) : []);
      } catch (error) {
        console.log("Error fetching liked images:", error);
      }
    };

    fetchLikedImages();
    const focusListener = navigation.addListener("focus", fetchLikedImages);
    return focusListener;
  }, []);

  return (
    <View style={styles.container}>
    <Back categoryName={"Favorites"}/>
       <View style={{padding: scale(8)}}>
      {likedImages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No liked images yet!</Text>
        </View>
      ) : (
        <FlatList
          data={likedImages}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate("FullImageScreen", { imageUri: item })}>
              <Image source={{ uri: item }} style={styles.image} />
            </TouchableOpacity>
          )}
        />
      )}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: colors.white, fontSize: scale(16) },
  image: {
    width: scale(160), 
    height: scale(240),
    margin: scale(3.5),
    borderRadius: scale(10),
  },
});

export default FavoritesScreen;
