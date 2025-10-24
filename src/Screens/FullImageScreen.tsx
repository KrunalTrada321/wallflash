import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Animated,
  Alert,
  PermissionsAndroid,
  Platform,
  Modal,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "../Styling/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { scale } from "react-native-size-matters";
import RNFS from "react-native-fs";
import RNFetchBlob from "rn-fetch-blob";
import { applyWallpaper } from "@codeooze/react-native-wallpaper-manager";
import { showMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";



const { width, height } = Dimensions.get("window");

const FullImageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri } = route.params;

  const [isLiked, setIsLiked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSettingWallpaper, setisSettingWallpaper] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const popupAnim = useRef(new Animated.Value(0)).current; // ✅ for animation

  const showPopup = () => {
    setModalVisible(true);
    Animated.timing(popupAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };
  
  const hidePopup = () => {
    Animated.timing(popupAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };
  


  const borderColorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(borderColorAnim, {
        toValue: 1,
        duration: 12000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  useEffect(() => {
    const checkLikedStatus = async () => {
      try {
        let likedImages = await AsyncStorage.getItem("likedImages");
        likedImages = likedImages ? JSON.parse(likedImages) : [];
        setIsLiked(likedImages.includes(imageUri));
      } catch (error) {
        console.log("Error fetching liked images:", error);
      }
    };

    checkLikedStatus();
  }, []);

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: ["#FF8BF9", "#FFF200", "#FF0000", "#8AF7BB", "#8CFCFC", "#00F000"],
  });


  const requestStoragePermission = async () => {
    if (Platform.OS === "android") {
      try {
        let permission;
        if (Platform.Version >= 33) {
          permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
        } else {
          permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
        }

        const granted = await PermissionsAndroid.request(permission);

        if (granted === PermissionsAndroid.RESULTS.DENIED) {
          // If denied, ask again when the user clicks download
          return await PermissionsAndroid.request(permission) === PermissionsAndroid.RESULTS.GRANTED;
        }

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.log("Permission request error:", error);
        return false;
      }
    }
    return true;
  };


  const downloadImage = async () => {
    try {
      setIsDownloading(true); // Start loader
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert("Permission Denied", "You need to allow storage access to download images.");
        setIsDownloading(false);
        return;
      }

      const fileName = `Wallpaper_${Date.now()}.jpg`;
      const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

      const downloadResult = await RNFS.downloadFile({
        fromUrl: imageUri,
        toFile: filePath,
      }).promise;

      if (downloadResult.statusCode === 200) {
        saveImageToGalleryAndroid(filePath, fileName);
      } else {
        showMessage({
          message: "Error",
          description: "Failed to download image.",
          type: "danger",
          style: { borderRadius: 15, marginTop: scale(20), marginHorizontal: scale(20) },
        });
      }
    } catch (error) {
      showMessage({
        message: "Error",
        description: "Something went wrong while saving the image.",
        type: "danger",
        style: { borderRadius: 15, marginTop: scale(20), marginHorizontal: scale(20) },
      });
    } finally {
      setIsDownloading(false); // Stop loader
    }
  };



  const saveImageToGalleryAndroid = async (filePath, fileName) => {
    try {
      const destPath = `${RNFS.PicturesDirectoryPath}/${fileName}`;
      await RNFS.moveFile(filePath, destPath);
      RNFetchBlob.fs.scanFile([{ path: destPath, mime: "image/jpeg" }])
        .then(() => {
          showMessage({
            message: "Success",
            description: "Image saved to gallery!",
            type: "success",
            style: { borderRadius: 15, marginTop: scale(40), marginHorizontal: scale(20) },
          });

        })
        .catch((err) => {
          console.log("Media Store update error:", err);
        });
    } catch (error) {
      Alert.alert("Error", "Could not save image to gallery.");

      showMessage({
        message: "Error",
        description: "Could not save image to gallery.",
        type: "danger",
        style: { borderRadius: 15, marginTop: scale(20), marginHorizontal: scale(20) },
      });
      console.log(error);
    }
  };


  const setWallpaper = async (type: any) => {
    try {
      setisSettingWallpaper(true);
      setModalVisible(false); // Close modal first
      console.log("Setting wallpaper:", type);

      await applyWallpaper(imageUri, type);
      setisSettingWallpaper(false);
      showMessage({
        message: "Success",
        description: "Wallpaper set successfully!",
        type: "success",
        style: { borderRadius: 15, marginTop: scale(40), marginHorizontal: scale(20) },
      });

    } catch (error) {
      setisSettingWallpaper(false);
      showMessage({
        message: "Error",
        description: "Failed to set wallpaper",
        type: "danger",
        style: { borderRadius: 15, marginTop: scale(20), marginHorizontal: scale(20) },
      });
    }
  };


  const toggleLike = async () => {
    try {
      let likedImages = await AsyncStorage.getItem("likedImages");
      likedImages = likedImages ? JSON.parse(likedImages) : [];

      if (isLiked) {
        // Remove from liked images
        const updatedImages = likedImages.filter(img => img !== imageUri);
        await AsyncStorage.setItem("likedImages", JSON.stringify(updatedImages));
      } else {
        // Add to liked images
        likedImages.push(imageUri);
        await AsyncStorage.setItem("likedImages", JSON.stringify(likedImages));
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.log("Error updating liked images:", error);
    }
  };


  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.fullImage} resizeMode="cover" />

      <TouchableOpacity activeOpacity={0.65} style={styles.backButton} onPress={() => navigation.goBack()}>
        <View style={styles.iconContainer}>
          <Ionicons name="chevron-back" size={scale(25)} color={colors.white} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.65} style={styles.heartButton} onPress={toggleLike}>
        <View style={styles.iconContainer}>
          <Ionicons name={isLiked ? "heart" : "heart-outline"} size={scale(25)} color={isLiked ? '#53D7F7' : colors.white} />
        </View>
      </TouchableOpacity>


      <View style={styles.setWallpaperButton}>
        <TouchableOpacity activeOpacity={0.60} onPress={() => {
          setModalVisible(true)
        }}>
          <Animated.View style={[styles.wallpaperButton, { borderColor: borderColor }]}>
            {isSettingWallpaper ? (
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: colors.white, fontSize: scale(18), paddingRight: scale(5) }}>Applying</Text>
                <ActivityIndicator size="small" color={colors.white} />
              </View>
            ) : (
              <Text style={{ color: colors.white, fontSize: scale(18) }}>Set Wallpaper</Text>
            )}
          </Animated.View>
        </TouchableOpacity>



        <TouchableOpacity activeOpacity={0.60} onPress={downloadImage} disabled={isDownloading}>
          <Animated.View style={[styles.downloadButton, { borderColor: borderColor }]}>
            {isDownloading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <MaterialCommunityIcons name="download" size={scale(25)} color={colors.white} />
            )}
          </Animated.View>
        </TouchableOpacity>
 
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { borderColor: borderColor }]}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => setWallpaper("home")}>
              <LinearGradient
                 colors={['#6A11CB', '#2575FC']} 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.gradientText}>Set as Homescreen</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.85} onPress={() => setWallpaper("lock")}>
              <LinearGradient
                colors={['#2575FC', '#6A11CB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.gradientText}>Set as Lockscreen</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>


            <TouchableOpacity activeOpacity={0.85} onPress={() => setWallpaper("both")}>
              <LinearGradient
                colors={['#6A11CB', '#2575FC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <View style={styles.buttonContent}>

                  <Text style={styles.gradientText}>Set as Both</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>


            <TouchableOpacity activeOpacity={0.85} onPress={() => setModalVisible(false)}>
              <LinearGradient
                colors={['#FF4B2B', '#FF416C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <View style={styles.buttonContent}>

                  <Text style={styles.gradientText}>Close</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
      <FlashMessage position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  fullImage: { width: width, height: height },
  backButton: { position: "absolute", left: scale(20), top: scale(20) },
  heartButton: { position: "absolute", right: scale(20), top: scale(20) },
  iconContainer: {
    backgroundColor: colors.black_transparant,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.gray,
    borderWidth: 0.8,
    padding: scale(8),
    borderRadius: 50,
  },
  setWallpaperButton: { position: "absolute", bottom: scale(20), flexDirection: "row", alignSelf: "center" },
  wallpaperButton: {
    backgroundColor: colors.black_transparant,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.8,
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
    borderRadius: 15,

  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: scale(20),
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 0.5,
  },

  modalButton: { padding: 8, width: 200, backgroundColor: colors.white, marginVertical: 5, borderRadius: 5, alignItems: "center" },
  closeButton: { padding: 6, width: 200, backgroundColor: '#F78989', marginTop: 10, borderRadius: 5, alignItems: "center" },
  modalText: { color: colors.primary, fontSize: scale(16), fontWeight: "500" },

  gradientButton: {
    paddingVertical: 12,
    width: 220,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    marginRight: 8,
  },

  gradientText: {
    color: "#fff",
    fontSize: scale(16),
    fontWeight: "600",
    letterSpacing: 0.5,
  },


  downloadButton: {
    backgroundColor: colors.black_transparant,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.8,
    marginLeft: scale(10),
    padding: scale(10),
    borderRadius: 15,

  }
});

export default FullImageScreen 