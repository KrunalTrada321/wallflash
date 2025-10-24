
import {
  View,
  Text,
  StatusBar,
  Platform,
  PermissionsAndroid,
  Alert,
  Linking
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import StackNav from './Navigation/StackNavigation';
import SplashScreen from 'react-native-splash-screen';
import { colors } from './Styling/colors';
// import requestUserPermission, { 
//   NotificationListner,
// } from './pushNotification/pushNotification';
import Orientation from 'react-native-orientation-locker';
import FlashMessage from 'react-native-flash-message';
import VersionCheck from 'react-native-version-check';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import { navigationRef } from './Navigation/NavigationService';
import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from '@notifee/react-native';


const App = () => {
  
  const TOPIC = "all-users";  

  const checkForUpdate = async () => {
    try {
      const isNeeded = await VersionCheck.needUpdate(); 

      if (isNeeded?.isNeeded) {

        const storeUrl = "https://play.google.com/store/apps/details?id=com.wallflash";
        console.log('🛒 Store URL:', storeUrl); // Debug log
        Alert.alert(
          'Update Available',
          'A new version of this app is available. Please update to continue.',
          [
            { 
              text: 'Update Now',
              onPress: () => {
                // const storeUrl = VersionCheck.getStoreUrl({
                //   appID: 'com.wallflash', // Replace with your actual package name
                // });
                Linking.openURL(storeUrl);
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.log('⚠️ Version check failed:', error);
    }
  };

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      SplashScreen.hide(); // Hide splash screen after 2.4 seconds
    }, 2400);

    Orientation.lockToPortrait();
    checkForUpdate();

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

        // Foreground notifications
        messaging().onMessage(async remoteMessage => {
          const title = remoteMessage.data?.title;
          const body = remoteMessage.data?.body;

          if (title || body) {
            await notifee.displayNotification({
              title,
              body,
              android: { channelId: 'high_importance_channel', sound: 'custom_sound'},
              ios: { sound: 'default' }, 
            });
          }
        }); 

      } catch (err) {
        console.error("FCM setup error:", err);
      }
    };

    setupFCM();
  }, []);



  return (
    <>
      <NavigationContainer ref={navigationRef}> 
       <SafeAreaView style={{flex:1, backgroundColor: colors.primary}}>
       
        <StatusBar
          backgroundColor={colors.primary}
          barStyle="light-content"
        />
        <StackNav />
        </SafeAreaView>
      </NavigationContainer>


    <FlashMessage position="top" />
      
    </>
  );
};
 
export default App; 
 