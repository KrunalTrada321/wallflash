import React, { useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
} from "react-native";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/Ionicons";
import RNFetchBlob from "react-native-blob-util";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { colors } from "../Styling/colors";
import { scale } from "react-native-size-matters";
import { showMessage } from "react-native-flash-message";

const { width, height } = Dimensions.get("window");

const FullVideoScreen = ({ route, navigation }: any) => {
  const { videoUrl, videos } = route.params;

  const initialIndex = videos.findIndex((v: string) => v === videoUrl);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [videoLoading, setVideoLoading] = useState(true);
  const [buffering, setBuffering] = useState(false);

  const [paused, setPaused] = useState(false);
  const [showPauseIcon, setShowPauseIcon] = useState(false);

  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentVideo = videos[currentIndex];

  const goPrev = () => {
    if (currentIndex > 0) {
      setVideoLoading(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goNext = () => {
    if (currentIndex < videos.length - 1) {
      setVideoLoading(true);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Permission Handling
  const requestPermission = async () => {
    if (Platform.OS !== "android") return true;

    if (Platform.Version >= 33) {
      const statuses = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]);
      return (
        statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
        PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      return status === PermissionsAndroid.RESULTS.GRANTED;
    }
  };

  // Download + Save using CameraRoll
  const downloadVideo = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Cannot save video without permission.");
      return;
    }

    try {
      setDownloading(true);
      setProgress(0);

      const { fs } = RNFetchBlob;
      const { CacheDir } = fs.dirs;
      const path = `${CacheDir}/WallFlash_${Date.now()}.mp4`;

      const task = RNFetchBlob.config({
        fileCache: true,
        appendExt: "mp4",
        path,
      }).fetch("GET", currentVideo);

      task.progress((received, total) => {
        setProgress(Math.floor((received / total) * 100));
      });

      const res = await task;
      console.log("Downloaded to:", res.path());

      const savedUri = await CameraRoll.save(res.path(), {
        type: "video",
        album: "WallFlash",
      });

      console.log("Saved to Gallery:", savedUri);
      showMessage({
        message: "Success 🎉",
        description: "Video saved to Gallery!",
        type: "success",
        style: { borderRadius: 15, marginTop: scale(55), marginHorizontal: scale(20) },
      }); 

      setProgress(100);
    } catch (err) {
      console.log("Download error:", err);
   
      showMessage({
        message: "Error",
        description: "Failed to download video",
        type: "danger",
        style: { borderRadius: 15, marginTop: scale(55), marginHorizontal: scale(20) },
      }); 

    } finally {
      setDownloading(false);
    }
  };

  // Show pause icon for 2 seconds when resuming playback
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!paused && showPauseIcon) {
      timer = setTimeout(() => {
        setShowPauseIcon(false);
      }, 600); // hide after 2 sec
    }
    return () => clearTimeout(timer);
  }, [paused, showPauseIcon]);

  const togglePlayPause = () => {
    if (paused) {
      setPaused(false);
      setShowPauseIcon(true);
    } else {
      setPaused(true);
      setShowPauseIcon(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <TouchableOpacity
        activeOpacity={1}
        style={{ flex: 1 }}
        onPress={togglePlayPause}
      >
        <Video
          source={{ uri: currentVideo }}
          style={{ width, height: height - 100 }}
          resizeMode="contain"
          repeat
          paused={paused}
          onLoadStart={() => setVideoLoading(true)}
          onLoad={() => setVideoLoading(false)}
          onBuffer={({ isBuffering }) => setBuffering(isBuffering)}
          onError={(e) => console.log("Video error:", e)}
        />

        {/* Loading Indicator */}
        {(videoLoading || buffering) && (
          <ActivityIndicator
            size="large"
            color={colors.redLight}
            style={{
              position: "absolute",
              top: height / 2 - 80,
              left: width / 2 - 20,
            }}
          />
        )}

        {/* Play / Pause Overlay (Center Big Icon) */}
        {paused && (
          <Icon
            name="play-circle"
            size={90}
            color="white"
            style={styles.centerIcon}
          />
        )}
        {!paused && showPauseIcon && (
          <Icon
            name="pause-circle"
            size={90}
            color="white"
            style={styles.centerIcon}
          />
        )}
      </TouchableOpacity>

      {/* Close Button */}
      <TouchableOpacity activeOpacity={0.7}
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="close" size={25} color={colors.primary} />
      </TouchableOpacity>
  
 
      {/* Bottom Controls */}
      <View style={styles.bottomBar}>
        {/* Prev */}
        <TouchableOpacity
          style={[styles.controlButton, currentIndex === 0 && { opacity: 0.3 }]}
          onPress={goPrev}
          disabled={currentIndex === 0}
        >
          <Icon name="chevron-back-circle" size={40} color="white" />
        </TouchableOpacity>

        {/* Play / Pause Button */}
        <TouchableOpacity style={styles.controlButton} onPress={togglePlayPause}>
          {paused ? (
            <Icon name="play-circle" size={40} color="white" />
          ) : (
            <Icon name="pause-circle" size={40} color="white" />
          )}
        </TouchableOpacity>

        {/* Download */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={downloadVideo}
          disabled={downloading}
        >
          {downloading ? (
            <Text style={{ color: "white", fontSize: 16 }}>{progress}%</Text>
          ) : (
            <Icon name="download-outline" size={36} color="white" />
          )}
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity
          style={[
            styles.controlButton,
            currentIndex === videos.length - 1 && { opacity: 0.3 },
          ]}
          onPress={goNext}
          disabled={currentIndex === videos.length - 1}
        >
          <Icon name="chevron-forward-circle" size={40} color="white" />
        </TouchableOpacity>
      </View>


    </View>
  );
};

export default FullVideoScreen;

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 45,
    height: 45,
    borderRadius: 20,
    backgroundColor: colors.white, // use your primary color here
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    zIndex: 999,
    height: 65,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
  },
  controlButton: {
    padding: 10,
  },
  centerIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -45 }, { translateY: -45 }],
    zIndex: 999,
  },
});
