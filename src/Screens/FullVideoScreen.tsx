

// import React, { useState } from "react";
// import {
//   View,
//   ActivityIndicator,
//   Dimensions,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   PermissionsAndroid,
//   Platform,
//   Alert,
// } from "react-native";
// import Video from "react-native-video";
// import Icon from "react-native-vector-icons/Ionicons";
// import RNFetchBlob from "rn-fetch-blob";

// const { width, height } = Dimensions.get("window");

// const FullVideoScreen = ({ route, navigation }: any) => {
//   const { videoUrl, videos } = route.params;

//   const initialIndex = videos.findIndex((v: string) => v === videoUrl);
//   const [currentIndex, setCurrentIndex] = useState(initialIndex);
//   const [videoLoading, setVideoLoading] = useState(true);
//   const [downloading, setDownloading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const currentVideo = videos[currentIndex];

//   const goPrev = () => {
//     if (currentIndex > 0) {
//       setVideoLoading(true);
//       setCurrentIndex((prev) => prev - 1);
//     }
//   };

//   const goNext = () => {
//     if (currentIndex < videos.length - 1) {
//       setVideoLoading(true);
//       setCurrentIndex((prev) => prev + 1);
//     }
//   };

//   const downloadVideo = async () => {
//     try {
//       if (Platform.OS === "android" && Platform.Version < 29) {
//         // Only ask for permission on Android 9 or below
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           {
//             title: "Storage Permission Required",
//             message: "App needs access to your storage to download videos",
//           }
//         );
//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           Alert.alert("Permission Denied");
//           return;
//         }
//       }

//       setDownloading(true);
//       setProgress(0);

//       const { config, fs } = RNFetchBlob;
//       const date = new Date();
//       const fileName = `video_${Math.floor(
//         date.getTime() + date.getSeconds() / 2
//       )}.mp4`;

//       const downloadDir = fs.dirs.DownloadDir;
//       const filePath = `${downloadDir}/${fileName}`;

//       config({
//         fileCache: true,
//         addAndroidDownloads: {
//           useDownloadManager: true,
//           notification: true,
//           path: filePath,
//           description: "Downloading video...",
//         },
//       })
//         .fetch("GET", currentVideo)
//         .progress((received, total) => {
//           let perc = Math.floor((received / total) * 100);
//           setProgress(perc);
//         })
//         .then((res) => {
//           setDownloading(false);
//           setProgress(0);

//           if (Platform.OS === "android") {
//             // Show in Downloads app
//             RNFetchBlob.android.addCompleteDownload({
//               title: "Downloaded Video",
//               description: "Video downloaded successfully",
//               mime: "video/mp4",
//               path: res.path(),
//               showNotification: true,
//             });

//             // 👇 This refreshes Gallery / Photos
//             RNFetchBlob.fs
//               .scanFile([{ path: res.path(), mime: "video/mp4" }])
//               .then(() => console.log("✅ Scanned into gallery"))
//               .catch((err) => console.log("❌ Scan error:", err));
//           }

//           Alert.alert("✅ Video saved to Gallery!");
//           console.log("File saved to:", res.path());
//         })
//         .catch((err) => {
//           setDownloading(false);
//           setProgress(0);
//           Alert.alert("❌ Download failed");
//           console.log("Download error:", err);
//         });
//     } catch (err) {
//       setDownloading(false);
//       setProgress(0);
//       console.log("Error:", err);
//     }
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: "black" }}>
//       {/* Loader */}
//       {videoLoading && (
//         <ActivityIndicator
//           size="large"
//           color="white"
//           style={{
//             position: "absolute",
//             top: height / 2 - 20,
//             left: width / 2 - 20,
//           }}
//         />
//       )}

//       {/* Only render the currently active video */}
//       <Video
//         source={{ uri: currentVideo }}
//         style={{ width, height: height - 100 }}
//         resizeMode="contain"
//         repeat
//         paused={false} // make sure only current plays
//         onLoadStart={() => setVideoLoading(true)}
//         onReadyForDisplay={() => setVideoLoading(false)}
//         onError={(e) => console.log("Video error:", e)}
//       />

//       {/* Close Button */}
//       <TouchableOpacity
//         style={styles.closeButton}
//         onPress={() => navigation.goBack()}
//       >
//         <Text style={{ color: "white", fontSize: 22 }}>✕</Text>
//       </TouchableOpacity>

//       {/* Bottom Controls */}
//       <View style={styles.bottomBar}>
//         {/* Prev */}
//         <TouchableOpacity
//           style={[styles.controlButton, currentIndex === 0 && { opacity: 0.3 }]}
//           onPress={goPrev}
//           disabled={currentIndex === 0}
//         >
//           <Icon name="chevron-back-circle" size={40} color="white" />
//         </TouchableOpacity>

//         {/* Download */}
//         <TouchableOpacity
//           style={styles.controlButton}
//           onPress={downloadVideo}
//           disabled={downloading}
//         >
//           {downloading ? (
//             <Text style={{ color: "white", fontSize: 16 }}>{progress}%</Text>
//           ) : (
//             <Icon name="download-outline" size={36} color="white" />
//           )}
//         </TouchableOpacity>

//         {/* Next */}
//         <TouchableOpacity
//           style={[
//             styles.controlButton,
//             currentIndex === videos.length - 1 && { opacity: 0.3 },
//           ]}
//           onPress={goNext}
//           disabled={currentIndex === videos.length - 1}
//         >
//           <Icon name="chevron-forward-circle" size={40} color="white" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default FullVideoScreen;

// const styles = StyleSheet.create({
//   closeButton: { position: "absolute", top: 40, right: 20 },
//   bottomBar: {
//     position: "absolute",
//     bottom: 0,
//     alignSelf: "center",
//     zIndex: 999,
//     height: 65,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.8)",
//   },
//   controlButton: {
//     padding: 10,
//   },
// });




import React, { useState } from "react";
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
import RNFetchBlob from "react-native-blob-util";   // ✅ New import

const { width, height } = Dimensions.get("window");

const FullVideoScreen = ({ route, navigation }: any) => {
  const { videoUrl, videos } = route.params;

  const initialIndex = videos.findIndex((v: string) => v === videoUrl);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [videoLoading, setVideoLoading] = useState(true);
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


  const downloadVideo = async () => {
    try {
      const { fs } = RNFetchBlob;
      const dir = Platform.OS === "android" ? fs.dirs.MovieDir : fs.dirs.DocumentDir;
      const filePath = `${dir}/WallFlash_${Date.now()}.mp4`;
  
      RNFetchBlob.config({
        fileCache: true,
        appendExt: "mp4",
        path: filePath,
        addAndroidDownloads: {
          useDownloadManager: true, // ✅ Show in Download Manager
          notification: true, // ✅ User sees download notification
          path: filePath,
          description: "WallFlash Video",
          mime: "video/mp4",
          mediaScannable: true, // ✅ Auto scan into Gallery
        },
      })
        .fetch("GET", videoUrl)
        .then((res) => {
          console.log("✅ File saved to:", res.path());
  
          if (Platform.OS === "android") {
            // Force MediaStore scan (extra safety)
            RNFetchBlob.fs
              .scanFile([{ path: res.path(), mime: "video/mp4" }])
              .then(() => console.log("📱 Media scanner refreshed"))
              .catch((err) => console.log("Scanner error:", err));
          }
  
          Alert.alert("Success", "Video saved to Gallery 🎉");
        })
        .catch((error) => {
          console.log("❌ Download error:", error);
          Alert.alert("Error", "Failed to download video");
        });
    } catch (err) {
      console.log("❌ Error:", err);
      Alert.alert("Error", "Something went wrong");
    }
  };
   

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {videoLoading && (
        <ActivityIndicator
          size="large"
          color="white"
          style={{
            position: "absolute",
            top: height / 2 - 20,
            left: width / 2 - 20,
          }}
        />
      )}

      <Video
        source={{ uri: currentVideo }}
        style={{ width, height: height - 100 }}
        resizeMode="contain"
        repeat
        paused={false}
        onLoadStart={() => setVideoLoading(true)}
        onReadyForDisplay={() => setVideoLoading(false)}
        onError={(e) => console.log("Video error:", e)}
      />

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: "white", fontSize: 22 }}>✕</Text>
      </TouchableOpacity>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.controlButton, currentIndex === 0 && { opacity: 0.3 }]}
          onPress={goPrev}
          disabled={currentIndex === 0}
        >
          <Icon name="chevron-back-circle" size={40} color="white" />
        </TouchableOpacity>

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
  closeButton: { position: "absolute", top: 40, right: 20 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    zIndex: 999,
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  controlButton: {
    padding: 10,
  },
});
