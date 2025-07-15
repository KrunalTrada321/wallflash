// import { View, Text, StatusBar, Platform, PermissionsAndroid } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import React, { useEffect } from 'react';
// import StackNav from './Navigation/StackNavigation';
// import SplashScreen from 'react-native-splash-screen';
// import { colors } from './Styling/colors';
// import requestUserPermission, { NotificationListner } from './pushNotification/pushNotification';
// import Orientation from 'react-native-orientation-locker';
// import FlashMessage from 'react-native-flash-message';

// const App = () => {

//   const requestPostNotificationPermission = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//       );

//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('Notification permission granted');
//       } else {
//         console.log('Notification permission denied');
//       }
//     }
//   };
 
//   useEffect(() => {
//     const splashTimeout = setTimeout(() => {
//       SplashScreen.hide(); // Hide splash screen after 3 seconds
//     }, 2400);

//     requestPostNotificationPermission();
//     requestUserPermission();
//     NotificationListner();
//     Orientation.lockToPortrait(); // Lock the app to portrait mode
//     return () => {
//       clearTimeout(splashTimeout); // Cleanup timeout on unmount
//       Orientation.unlockAllOrientations(); // Cleanup orientation lock (optional if app remains locked)
//     };
//   }, []);

//   return (
//     <>
//       <NavigationContainer>
//         {/* Set StatusBar color to black and text color to white */}
//         <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
//         <StackNav />

//       </NavigationContainer>
//       <FlashMessage position="top" />
//     </>
//   ); 
// }; 

// export default App;




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
import requestUserPermission, {
  NotificationListner,
} from './pushNotification/pushNotification';
import Orientation from 'react-native-orientation-locker';
import FlashMessage from 'react-native-flash-message';
import VersionCheck from 'react-native-version-check';
import { SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  const requestPostNotificationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('🔔 Notification permission granted');
      } else {
        console.log('🔕 Notification permission denied');
      }
    }
  };

  const checkForUpdate = async () => {
    try {
      const isNeeded = await VersionCheck.needUpdate();

      if (isNeeded?.isNeeded) {

        const storeUrl = VersionCheck.getStoreUrl({
          appID: 'com.wallflash', // Replace with your actual app ID (package name)
        });
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

    requestPostNotificationPermission();
    requestUserPermission();
    NotificationListner();
    Orientation.lockToPortrait();
    checkForUpdate();

    return () => {
      clearTimeout(splashTimeout);
      Orientation.unlockAllOrientations();
    };
  }, []);

  return (
    <>
      <NavigationContainer>
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
  