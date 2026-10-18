import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../Styling/colors";
import { scale } from "react-native-size-matters";
import Back from "../Components/Back";
import FavoritesManager from "../Utils/FavoritesManager";

const FavoritesScreen = () => {
  const [likedImages, setLikedImages] = useState<string[]>([]);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchLikedImages = async () => {
      try {
        const images = await FavoritesManager.getLikedImages();
        setLikedImages(images);
      } catch (error) {
        console.log("Error fetching liked images:", error);
      }
    };

    fetchLikedImages();
    const unsubscribeListener = FavoritesManager.addListener((likedSet) => {
      setLikedImages(Array.from(likedSet));
    });
    const focusListener = navigation.addListener("focus", fetchLikedImages);

    return () => {
      unsubscribeListener();
      focusListener();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Back categoryName={"Favorites"} />
      <View style={{ flex: 1, padding: scale(8) }}>
        {likedImages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No liked images yet!</Text>
          </View>
        ) : (
          <FlatList
            data={likedImages}
            keyExtractor={(item, index) => `${item}-${index}`}
            numColumns={2}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("FullImageScreen", {
                    imageUri: item,
                    images: likedImages,
                    initialIndex: index,
                  })
                }
              >
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
  emptyContainer: {  flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: colors.black, fontSize: scale(16), fontWeight: "700" },
  image: {
    width: scale(160), 
    height: scale(240),
    margin: scale(3.5),
    borderRadius: scale(10), 
  },
});

export default FavoritesScreen;
