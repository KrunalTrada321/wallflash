import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Text,
  Animated,
  Alert,
  PermissionsAndroid,
  Platform,
  FlatList,
  Easing,
  BackHandler,
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
  const route = useRoute<any>();
  const { imageUri, images = [], initialIndex = 0, onLoadMore } = route.params || {};
  const { width, height } = Dimensions.get("window");

  const [localImages, setLocalImages] = useState(images);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentImageUri = localImages.length > 0 ? localImages[currentIndex] : imageUri;
  const scrollX = useRef(new Animated.Value(initialIndex * width)).current;

  const [isLiked, setIsLiked] = useState(false);
  const heartScale = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;
  const lastTapRef = useRef(0);

  const handleDoubleTap = async () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_PRESS_DELAY) {
      if (!isLiked) {
        await toggleLike();
      }
      
      Animated.sequence([
        Animated.parallel([
          Animated.spring(heartScale, {
            toValue: 1,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.timing(heartOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(heartScale, {
            toValue: 0.5,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(heartOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ])
      ]).start(() => {
        heartScale.setValue(0);
      });
    }
    lastTapRef.current = now;
  };
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSettingWallpaper, setisSettingWallpaper] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (images.length > 1) {
      AsyncStorage.getItem("swipe_tutorial_seen").then(val => {
        if (!val) {
          setShowTutorial(true);
        }
      });
    }
  }, [images]);

  const handleDismissTutorial = () => {
    setShowTutorial(false);
    AsyncStorage.setItem("swipe_tutorial_seen", "true");
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAnimatingRef = useRef(false);
  const genieProgress = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Exact coordinates of the Set Wallpaper button relative to screen center
  const [buttonOrigin, setButtonOrigin] = useState({
    x: -scale(29),
    y: height / 2 - scale(42),
  });

  const onButtonContainerLayout = (event: any) => {
    const { y, height: h } = event.nativeEvent.layout;
    if (h > 0) {
      const btnCenterY = y + h / 2;
      const screenCenterY = height / 2;
      setButtonOrigin(prev => ({
        ...prev,
        y: btnCenterY - screenCenterY,
      }));
    }
  };

  const onSetWallpaperBtnLayout = (event: any) => {
    const { width: btnW } = event.nativeEvent.layout;
    if (btnW > 0) {
      const gap = scale(10);
      const downloadBtnW = scale(48);
      const calculatedX = -(gap + downloadBtnW) / 2;
      setButtonOrigin(prev => ({
        ...prev,
        x: calculatedX,
      }));
    }
  };

  useEffect(() => {
    if (!isModalOpen) return;
    const backAction = () => {
      hidePopup();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [isModalOpen]);

  const showPopup = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsModalOpen(true);
    genieProgress.setValue(0);

    // Button squashes down slightly as the genie emerges from it
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.86, duration: 90, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, friction: 5, tension: 85, useNativeDriver: true }),
    ]).start();

    // 460ms snappy yet visible genie emergence
    Animated.timing(genieProgress, {
      toValue: 1,
      duration: 460,
      easing: Easing.bezier(0.18, 0.9, 0.22, 1),
      useNativeDriver: true,
    }).start(() => {
      isAnimatingRef.current = false;
    });
  };

  const hidePopup = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    // 380ms smooth suction directly into the button
    Animated.timing(genieProgress, {
      toValue: 0,
      duration: 380,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start(() => {
      setIsModalOpen(false);
      isAnimatingRef.current = false;

      // Button absorbs genie with an elastic spring catch
      Animated.sequence([
        Animated.timing(buttonScale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
        Animated.spring(buttonScale, { toValue: 1, friction: 4, tension: 90, useNativeDriver: true }),
      ]).start();
    });
  };

  // Interpolations for the Genie transformation
  const animOpacity = genieProgress.interpolate({
    inputRange: [0, 0.12, 1],
    outputRange: [0, 1, 1],
  });

  const backdropOpacity = genieProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Moves from the Set Wallpaper button's exact position to screen center (0, 0)
  const animTranslateX = genieProgress.interpolate({
    inputRange: [0, 0.4, 0.75, 1],
    outputRange: [buttonOrigin.x, buttonOrigin.x * 0.4, buttonOrigin.x * 0.08, 0],
  });

  // Vertical movement strictly coordinated with scaleY to ensure the bottom edge stays above/at the button
  const animTranslateY = genieProgress.interpolate({
    inputRange: [0, 0.25, 0.65, 1],
    outputRange: [buttonOrigin.y, buttonOrigin.y * 0.65, buttonOrigin.y * 0.15, 0],
  });

  // Scale X: narrow at button, widens smoothly as it ascends
  const animScaleX = genieProgress.interpolate({
    inputRange: [0, 0.25, 0.65, 1],
    outputRange: [0.06, 0.26, 0.85, 1],
  });

  // Scale Y: compresses as it descends, so bottom NEVER overshoots or goes outside the button!
  const animScaleY = genieProgress.interpolate({
    inputRange: [0, 0.25, 0.65, 1],
    outputRange: [0.04, 0.35, 0.90, 1],
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
      // const hasPermission = await requestStoragePermission();
      // if (!hasPermission) {
      //   Alert.alert("Permission Denied", "You need to allow storage access to download images.");
      //   setIsDownloading(false);
      //   return;
      // }
   
      const fileName = `Wallpaper_${Date.now()}.jpg`;
      const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

      const downloadResult = await RNFS.downloadFile({
        fromUrl: currentImageUri,
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
      hidePopup();
      setisSettingWallpaper(true);
      console.log("Setting wallpaper:", type);

      await applyWallpaper(currentImageUri, type);
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
        const updatedImages = likedImages.filter((img: string) => img !== currentImageUri);
        await AsyncStorage.setItem("likedImages", JSON.stringify(updatedImages));
      } else {
        // Add to liked images
        likedImages.push(currentImageUri);
        await AsyncStorage.setItem("likedImages", JSON.stringify(likedImages));
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.log("Error updating liked images:", error);
    }
  };


  return (
    <View style={styles.container}>
      {localImages.length > 0 ? (
        <Animated.FlatList
          data={localImages}
          horizontal
          pagingEnabled
          initialScrollIndex={initialIndex}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          onEndReached={async () => {
            if (onLoadMore && !isLoadingMore && hasMore) {
              setIsLoadingMore(true);
              const newImages = await onLoadMore();
              if (newImages && newImages.length > 0) {
                setLocalImages((prev: any) => [...prev, ...newImages]);
              }
              setIsLoadingMore(false);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => 
            isLoadingMore ? (
              <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.white} />
              </View>
            ) : null
          }
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1, 0.8],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });

            const rotateY = scrollX.interpolate({
              inputRange,
              outputRange: ['25deg', '0deg', '-25deg'],
              extrapolate: 'clamp',
            });

            const borderRadius = scrollX.interpolate({
              inputRange,
              outputRange: [60, 0, 60],
              extrapolate: 'clamp',
            });

            return (
              <TouchableWithoutFeedback onPress={handleDoubleTap}>
                <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
                  <Animated.View 
                    style={{ 
                      width, 
                      height, 
                      transform: [
                        { perspective: 1000 },
                        { scale },
                        { rotateY }
                      ], 
                      opacity,
                      borderRadius,
                      overflow: 'hidden',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 25 },
                      shadowOpacity: 0.8,
                      shadowRadius: 30,
                      elevation: 15,
                    }}
                  >
                    <Image 
                      source={{ uri: item }} 
                      style={styles.fullImage} 
                      resizeMode="cover" 
                    />
                  </Animated.View>
                </View>
              </TouchableWithoutFeedback>
            );
          }}
        />
      ) : (
        <TouchableWithoutFeedback onPress={handleDoubleTap}>
          <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={{ uri: currentImageUri }} style={styles.fullImage} resizeMode="cover" />
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Global Animated Heart for Double Tap */}
      <Animated.View style={[
        styles.globalHeartContainer,
        {
          opacity: heartOpacity,
          transform: [{ scale: heartScale }]
        }
      ]} pointerEvents="none">
        <View style={styles.glassContainer}>
          <Ionicons name="heart" size={scale(60)} color="#FF2D55" />
        </View>
      </Animated.View>

      {showTutorial && (
        <TouchableOpacity activeOpacity={1} style={styles.tutorialOverlay} onPress={handleDismissTutorial}>
          <View style={styles.tutorialBox}>
            <MaterialCommunityIcons name="gesture-swipe-horizontal" size={scale(50)} color={colors.white} />
            <Text style={styles.tutorialText}>Swipe left or right to change wallpapers</Text>
            <Text style={styles.tutorialSubText}>Tap anywhere to dismiss</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Dynamic gradients for visibility on white/bright backgrounds */}
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'transparent']}
        style={styles.topGradient}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)']}
        style={styles.bottomGradient}
        pointerEvents="none"
      />

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


      <View 
        style={styles.setWallpaperButton}
        onLayout={onButtonContainerLayout}
      >
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <View onLayout={onSetWallpaperBtnLayout}>
            <TouchableOpacity activeOpacity={0.60} onPress={showPopup}>
              <View style={styles.glassButton}>
                {isSettingWallpaper ? (
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ color: colors.white, fontSize: scale(18), fontWeight: 'bold', paddingRight: scale(5) }}>Applying</Text>
                    <ActivityIndicator size="small" color={colors.white} />
                  </View>
                ) : (
                  <Text style={{ color: colors.white, fontSize: scale(18), fontWeight: 'bold' }}>Set Wallpaper</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <TouchableOpacity activeOpacity={0.60} onPress={downloadImage} disabled={isDownloading}>
          <View style={[styles.glassButton, { marginLeft: scale(10), paddingHorizontal: scale(12) }]}>
            {isDownloading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <MaterialCommunityIcons name="download" size={scale(24)} color={colors.white} />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <View 
        style={styles.modalOverlay} 
        pointerEvents={isModalOpen ? "auto" : "none"}
      >
        <Animated.View
          style={[
            styles.modalBackdrop,
            { opacity: backdropOpacity },
          ]}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            style={StyleSheet.absoluteFillObject} 
            onPress={hidePopup}
          />
        </Animated.View>

        <View style={styles.modalCenterWrapper} pointerEvents="box-none">
          <Animated.View
            style={[
              styles.glassModalContent,
              {
                opacity: animOpacity,
                transform: [
                  { translateX: animTranslateX },
                  { translateY: animTranslateY },
                  { scaleX: animScaleX },
                  { scaleY: animScaleY },
                ],
              },
            ]}
          >
            <TouchableOpacity activeOpacity={0.85} onPress={() => setWallpaper("home")}>
              <View style={styles.glassModalButton}>
                <View style={styles.buttonContent}>
                  <Text style={styles.glassModalButtonText}>Set as Homescreen</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.85} onPress={() => setWallpaper("lock")}>
              <View style={styles.glassModalButton}>
                <View style={styles.buttonContent}>
                  <Text style={styles.glassModalButtonText}>Set as Lockscreen</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.85} onPress={() => setWallpaper("both")}>
              <View style={styles.glassModalButton}>
                <View style={styles.buttonContent}>
                  <Text style={styles.glassModalButtonText}>Set as Both</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.85} onPress={hidePopup}>
              <View style={[styles.glassModalButton, { backgroundColor: 'rgba(255, 50, 80, 0.3)', borderColor: 'rgba(255, 50, 80, 0.5)' }]}>
                <View style={styles.buttonContent}>
                  <Text style={styles.glassModalButtonText}>Close</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      <FlashMessage position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  fullImage: { width: width, height: height },
  tutorialOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  tutorialBox: {
    alignItems: 'center',
    padding: scale(20),
  },
  tutorialText: {
    color: '#FFF',
    fontSize: scale(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: scale(15),
  },
  tutorialSubText: {
    color: '#CCC',
    fontSize: scale(14),
    marginTop: scale(10),
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: scale(120),
    zIndex: 1,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: scale(180),
    zIndex: 1,
  },
  globalHeartContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  glassContainer: {
    width: scale(110),
    height: scale(110),
    borderRadius: scale(55), // Perfect circle
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Frosty translucent white
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)', // Shiny glass rim
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  glassButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
    borderRadius: 20,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
  },
  modalCenterWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  glassModalContent: {
    backgroundColor: 'rgba(15, 15, 20, 0.75)',
    padding: scale(20),
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    width: scale(260),
    overflow: 'hidden',
  },
  glassModalButton: {
    paddingVertical: 12,
    width: 220,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  glassModalButtonText: {
    color: '#fff',
    fontSize: scale(16),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
});

export default FullImageScreen 