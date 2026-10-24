
import {
  View,
  Text,
  StatusBar,
  Platform,
  PermissionsAndroid,
  Alert,
  Linking,
  BackHandler,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import StackNav from './Navigation/StackNavigation';
import SplashScreen from 'react-native-splash-screen';
import { colors } from './Styling/colors';
import Orientation from 'react-native-orientation-locker';
import FlashMessage from 'react-native-flash-message';
import VersionCheck from 'react-native-version-check';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import { navigationRef, navigateFromNotification } from './Navigation/NavigationService';
import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';
import { initRewardedPremiumAd } from './Components/RewardedPremiumAd';
import Ionicons from 'react-native-vector-icons/Ionicons';

const App = () => {

  const TOPIC = "all-users";

  // State for exit confirmation and app update modals
  const [showExitModal, setShowExitModal] = useState(false);
  const [updateModal, setUpdateModal] = useState({
    visible: false,
    latestVersion: '',
    storeUrl: '',
  });

  const showExitModalRef = React.useRef(showExitModal);
  showExitModalRef.current = showExitModal;

  const updateModalRef = React.useRef(updateModal);
  updateModalRef.current = updateModal;

  const checkForUpdate = async () => {
    try {
      const isNeeded = await VersionCheck.needUpdate({
        packageName: 'com.wallflash',
      });

      console.log('🔍 Version Check Result:', isNeeded);

      if (isNeeded?.isNeeded) {
        const storeUrl =
          isNeeded.storeUrl ||
          'https://play.google.com/store/apps/details?id=com.wallflash';

        setUpdateModal({
          visible: true,
          latestVersion: isNeeded.latestVersion || '',
          storeUrl: storeUrl,
        });
      }
    } catch (error) {
      console.log('⚠️ Version check failed:', error);
    }
  };

  // 🔙 Android hardware back button handler
  useEffect(() => {
    const onBackPress = () => {
      // 1. If Exit Modal is open, close it
      if (showExitModalRef.current) {
        setShowExitModal(false);
        return true;
      }
      // 2. If Update Modal is open, close it
      if (updateModalRef.current.visible) {
        setUpdateModal(prev => ({ ...prev, visible: false }));
        return true;
      }

      // 3. If stack navigation can go back, navigate back
      if (navigationRef.isReady() && navigationRef.canGoBack()) {
        navigationRef.goBack();
        return true;
      }

      // 4. When at the root/last screen before app exit -> show centered exit confirmation modal!
      setShowExitModal(true);
      return true;
    };

    const backSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => backSubscription.remove();
  }, []);

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      SplashScreen.hide(); // Hide splash screen after 2.4 seconds
      checkForUpdate(); // Show update popup if new update is available
    }, 2400);

    if (!DeviceInfo.isTablet()) {
      Orientation.lockToPortrait();
    } else {
      Orientation.unlockAllOrientations();
    }
    initRewardedPremiumAd();

    return () => {
      clearTimeout(splashTimeout);
      Orientation.unlockAllOrientations();
    };
  }, []);




  useEffect(() => {

    const createAndroidChannel = async () => {
      if (Platform.OS === 'android') {
        await notifee.createChannel({
          id: 'high_importance_channel', // must match Node.js
          name: 'High Importance',
          importance: AndroidImportance.HIGH,
          sound: 'custom_sound',
          vibration: true,
        });
      }
    };


    const setupFCM = async () => {
      try {
        // iOS permissions
        if (Platform.OS === "ios") {
          const authStatus = await messaging().requestPermission({
            alert: true,
            badge: true,
            sound: true,
          });
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

          if (!enabled) {
            Alert.alert("Notifications not allowed", "Please enable in settings.");
            return;
          }
        }

        // Android 13+ permissions
        if (Platform.OS === "android" && Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert("Permission denied", "Notifications are disabled.");
            return;
          }
        }

        await notifee.deleteChannel("high_importance_channel");
        await createAndroidChannel();


        // Subscribe to topic
        await messaging().subscribeToTopic(TOPIC);
        console.log("Subscribed to topic:", TOPIC);

        // 1. Foreground notifications: display with Notifee including image and data
        messaging().onMessage(async remoteMessage => {
          const title =
            (remoteMessage.notification?.title as string | undefined) ||
            (typeof remoteMessage.data?.title === 'string' ? remoteMessage.data.title : undefined);
          const body =
            (remoteMessage.notification?.body as string | undefined) ||
            (typeof remoteMessage.data?.body === 'string' ? remoteMessage.data.body : undefined);
          const imageUrl =
            (remoteMessage.notification?.android?.imageUrl as string | undefined) ||
            (typeof remoteMessage.data?.imageUrl === 'string' ? remoteMessage.data.imageUrl : undefined);

          if (title || body) {
            await notifee.displayNotification({
              title,
              body,
              data: remoteMessage.data,
              android: {
                channelId: 'high_importance_channel',
                sound: 'custom_sound',
                pressAction: { id: 'default' },
                ...(imageUrl ? { style: { type: AndroidStyle.BIGPICTURE, picture: imageUrl } } : {}),
              },
              ios: { sound: 'default' },
            });
          }
        });

        // 2. Notification opened from Background state (FCM)
        messaging().onNotificationOpenedApp(remoteMessage => {
          console.log('FCM Notification caused app to open from background:', remoteMessage);
          const screen = (remoteMessage.data?.screen || remoteMessage.data?.page) as string | undefined;
          if (screen) {
            navigateFromNotification(screen);
          }
        });

        // 3. Notification opened from Quit / Killed state (FCM)
        messaging().getInitialNotification().then(remoteMessage => {
          if (remoteMessage) {
            console.log('FCM Notification caused app to open from quit state:', remoteMessage);
            const screen = (remoteMessage.data?.screen || remoteMessage.data?.page) as string | undefined;
            if (screen) {
              navigateFromNotification(screen);
            }
          }
        });

        // 4. Foreground notification tap (Notifee)
        notifee.onForegroundEvent(({ type, detail }) => {
          if (type === EventType.PRESS && detail.notification?.data) {
            const screen = (detail.notification.data.screen || detail.notification.data.page) as string | undefined;
            if (screen) {
              navigateFromNotification(screen);
            }
          }
        });

        // 5. Initial notification tap from killed state (Notifee)
        notifee.getInitialNotification().then(initialNotif => {
          if (initialNotif?.notification?.data) {
            const screen = (initialNotif.notification.data.screen || initialNotif.notification.data.page) as string | undefined;
            if (screen) {
              navigateFromNotification(screen);
            }
          }
        });

      } catch (err) {
        console.error("FCM setup error:", err);
      }
    };

    setupFCM();
  }, []);



  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <NavigationContainer ref={navigationRef}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
          <StatusBar
            backgroundColor="transparent"
            translucent
            barStyle="light-content"
          />
          <StackNav />
        </SafeAreaView>
      </NavigationContainer>

      {/* 🚪 Custom Exit Confirmation Modal */}
      {showExitModal && (
        <View style={styles.modalOverlayContainer} pointerEvents="auto">
          {/* Backdrop (tap to dismiss) */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowExitModal(false)}
            style={styles.modalBackdropTouchable}
          />

          {/* Centered Modal Card */}
          <View style={styles.modalCenterBox} pointerEvents="box-none">
            <View style={styles.exitModalCard}>
              <View style={styles.exitIconWrapper}>
                <Ionicons name="log-out-outline" size={scale(32)} color="#FF3B30" />
              </View>

              <Text style={styles.exitModalTitle}>Exit WallFlash?</Text>
              <Text style={styles.exitModalSubtitle}>
                Are you sure you want to exit the app?
              </Text>

              <View style={styles.exitModalButtonRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowExitModal(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setShowExitModal(false);
                    BackHandler.exitApp();
                  }}
                  style={styles.exitButton}
                >
                  <Text style={styles.exitButtonText}>Exit App</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 🚀 Custom App Update Modal */}
      {updateModal.visible && (
        <View style={styles.modalOverlayContainer} pointerEvents="auto">
          {/* Backdrop (tap to dismiss) */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setUpdateModal(prev => ({ ...prev, visible: false }))}
            style={styles.modalBackdropTouchable}
          />

          {/* Centered Modal Card */}
          <View style={styles.modalCenterBox} pointerEvents="box-none">
            <View style={styles.updateModalCard}>
              <View style={styles.updateBadge}>
                <Text style={styles.updateBadgeText}>✨ NEW VERSION AVAILABLE</Text>
              </View>

              <View style={styles.updateIconWrapper}>
                <Ionicons name="rocket-outline" size={scale(32)} color={colors.flashColor} />
              </View>

              <Text style={styles.updateModalTitle}>Update Available!</Text>
              {updateModal.latestVersion ? (
                <Text style={styles.updateVersionText}>
                  Version {updateModal.latestVersion} is ready to install
                </Text>
              ) : null}

              <Text style={styles.updateModalMessage}>
                A new version of WallFlash is available on Google Play. Please update to enjoy the newest 4K wallpapers, trending festivals, and performance improvements!
              </Text>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  Linking.openURL(updateModal.storeUrl).catch(err => {
                    console.log('Error opening store URL:', err);
                  });
                }}
                style={styles.updateNowButton}
              >
                <Ionicons name="arrow-up-circle-outline" size={scale(20)} color="#000000" style={{ marginRight: scale(6) }} />
                <Text style={styles.updateNowButtonText}>Update Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setUpdateModal(prev => ({ ...prev, visible: false }))}
                style={styles.laterButton}
              >
                <Text style={styles.laterButtonText}>Maybe Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <FlashMessage position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
    elevation: 99999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
  },
  modalCenterBox: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(24),
  },
  exitModalCard: {
    width: '100%',
    maxWidth: scale(320),
    backgroundColor: '#1E1B2E',
    borderRadius: scale(22),
    borderWidth: 1.5,
    borderColor: colors.flashColor,
    padding: scale(22),
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 24,
    shadowColor: colors.flashColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  exitIconWrapper: {
    width: scale(58),
    height: scale(58),
    borderRadius: scale(29),
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 59, 48, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(10),
  },
  exitModalTitle: {
    fontSize: scale(19),
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.3,
  },
  exitModalSubtitle: {
    fontSize: scale(13),
    color: '#A0A0B8',
    textAlign: 'center',
    marginTop: scale(8),
    lineHeight: scale(19),
  },
  exitModalButtonRow: {
    flexDirection: 'row',
    marginTop: scale(22),
    gap: scale(12),
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: scale(12),
    borderRadius: scale(14),
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: scale(14),
  },
  exitButton: {
    flex: 1,
    paddingVertical: scale(12),
    borderRadius: scale(14),
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  exitButtonText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: scale(14),
  },
  updateModalCard: {
    width: '100%',
    maxWidth: scale(335),
    backgroundColor: '#1E1B2E',
    borderRadius: scale(24),
    borderWidth: 1.5,
    borderColor: colors.flashColor,
    padding: scale(22),
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 24,
    shadowColor: colors.flashColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  updateBadge: {
    backgroundColor: 'rgba(0, 223, 114, 0.15)',
    borderColor: '#00DF72',
    borderWidth: 1,
    borderRadius: scale(20),
    paddingHorizontal: scale(12),
    paddingVertical: scale(4),
    marginBottom: scale(12),
  },
  updateBadgeText: {
    color: '#00DF72',
    fontSize: scale(11),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  updateIconWrapper: {
    width: scale(58),
    height: scale(58),
    borderRadius: scale(29),
    backgroundColor: 'rgba(247, 59, 0, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(247, 59, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(10),
  },
  updateModalTitle: {
    fontSize: scale(20),
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.3,
  },
  updateVersionText: {
    fontSize: scale(13),
    fontWeight: '700',
    color: colors.flashColor,
    marginTop: scale(4),
  },
  updateModalMessage: {
    fontSize: scale(13),
    color: '#A0A0B8',
    textAlign: 'center',
    marginTop: scale(10),
    lineHeight: scale(19),
  },
  updateNowButton: {
    width: '100%',
    backgroundColor: colors.flashColor,
    paddingVertical: scale(12.5),
    borderRadius: scale(14),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(20),
    elevation: 6,
    shadowColor: colors.flashColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
  },
  updateNowButtonText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: scale(14.5),
    letterSpacing: 0.3,
  },
  laterButton: {
    paddingVertical: scale(10),
    marginTop: scale(6),
    alignItems: 'center',
  },
  laterButtonText: {
    color: '#8E8EA0',
    fontSize: scale(13),
    fontWeight: '600',
  },
});

export default App;
