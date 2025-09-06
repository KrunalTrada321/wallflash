
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  StyleSheet,
} from "react-native";
import { colors } from "../Styling/colors";
import { scale } from "react-native-size-matters";
import LinearGradient from "react-native-linear-gradient";
import Video from "react-native-video";
import { fetchSeasonInfo, fetchSeasonVideos } from "../API/StatusApiHelper";
import { createThumbnail } from "react-native-create-thumbnail";
import Icon from "react-native-vector-icons/Ionicons";
import LottieView from "lottie-react-native";
import RNFS from "react-native-fs";
import CryptoJS from "crypto-js";
import NetInfo from "@react-native-community/netinfo"; // 🔹 Internet status
import { useNavigation } from "@react-navigation/native";
import ShortBanner from "../Components/ShortBanner";

const { width, height } = Dimensions.get("window");

const VideoScreen = () => {
  const [seasonInfo, setSeasonInfo] = useState<any>(null);
  const [videos, setVideos] = useState<{ url: string; thumbnail: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const navigation = useNavigation();

  useEffect(() => {
    // 🔹 Listen to network status
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isConnected) return; // 🔹 Don't fetch if no internet

    const loadData = async () => {
      try {
        const info = await fetchSeasonInfo();
        const urls = await fetchSeasonVideos();

        // 🔹 Initialize with empty thumbnails
        const vids = urls.map((url: string) => ({ url, thumbnail: "" }));
        setSeasonInfo(info);
        setVideos(vids);
        setLoading(false);

        // 🔹 Generate thumbnails with hashing (safe cache names)
        urls.forEach(async (url, index) => {
          try {
            const hashName = CryptoJS.MD5(url).toString() + ".jpg";
            const localPath = `${RNFS.CachesDirectoryPath}/${hashName}`;

            // If already exists → load from cache
            const exists = await RNFS.exists(localPath);
            if (exists) {
              setVideos((prev) => {
                const updated = [...prev];
                updated[index] = { url, thumbnail: "file://" + localPath };
                return updated;
              });
              return;
            }

            // Otherwise generate thumbnail
            const thumb = await createThumbnail({
              url,
              timeStamp: 500, // capture at 0.5s
            });

            // Save to cache
            await RNFS.copyFile(thumb.path, localPath);

            setVideos((prev) => {
              const updated = [...prev];
              updated[index] = { url, thumbnail: "file://" + localPath };
              return updated;
            });
          } catch (err) {
            console.log("Thumbnail error:", err);
          }
        });
      } catch (err) {
        console.log("Error fetching data:", err);
        setLoading(false);
      }
    };

    loadData();
  }, [isConnected]);

  // 🔹 Show No Internet screen
  if (!isConnected) { 
    return (
      <View style={styles.noInternetContainer}>
        <Image
          style={{ height: scale(40), width: scale(40), marginBottom: 10 }}
          source={require("../assets/no-wifi.png")}
        />
        <Text style={styles.noInternetText}>No Internet</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,}}>
        {/* <LoaderKit
          style={styles.loader}
          name="BallTrianglePath"
          color={"#F7005F"}
        /> */}

        <LottieView
          source={require("../assets/flashrunner.json")} // Adjust path
          autoPlay
          loop
          speed={1.4} // Increase speed (default is 1)
          style={{ width: scale(85), height: scale(85) }}
        />

      </View>
    );
  }



  return (
    <View style={{ flex: 1, paddingHorizontal: scale(8), marginTop: scale(8) }}>
      <ScrollView>
        {/* 🔹 Season Info */}
        {seasonInfo && (
          <LinearGradient
            colors={["#4b2c82", "#9363c0", "#eaafc8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.infoCard}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoTitle}>{seasonInfo?.title}</Text>
                <Text style={styles.infoDesc}>{seasonInfo?.description}</Text>
              </View>
              <Image
                style={styles.infoImage}
                source={{ uri: seasonInfo?.imageUrl }}
              />
            </View>
          </LinearGradient>
        )}
   
        <ShortBanner />
        
        {/* 🔹 Video Grid */}
        <FlatList
          data={videos}
          numColumns={2}
          keyExtractor={(_, i) => i.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity

              activeOpacity={0.8}
              style={styles.card}
              onPress={() => {
                navigation.navigate("FullVideo", { videoUrl: item.url, videos: videos.map(v => v.url) })
              }}
            >
              {item?.thumbnail ? (
                <Image
                  source={{ uri: item?.thumbnail }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              ) : (
                <ActivityIndicator color={"red"} size={"large"} />
              )}

              {/* Play Button Overlay */}
              <View style={styles.overlay}>
                <View style={styles.playButton}>
                  <Icon name="play-circle" size={24} color="white" />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  noInternetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background
  },
  noInternetText: {
    fontSize: scale(18),
    fontWeight: '600',
    color: colors.redLight,
    textAlign: 'center'
  },
  infoCard: { padding: 18, borderRadius: 12, marginBottom: 10 },
  infoTitle: { color: "#FF1493", fontSize: scale(16), fontFamily: "Poppins-Medium" },
  infoDesc: { color: "white", fontSize: scale(12), fontFamily: "Poppins-Regular" },
  infoImage: {
    height: scale(120),
    width: scale(120),
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: colors.white,
  },
  card: {
    flex: 1,
    aspectRatio: 9 / 16,
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 30,
    height: 30,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: { position: "absolute", top: 40, right: 20 },
});
