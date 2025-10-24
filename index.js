// /**
//  * @format
//  */
 
// import {AppRegistry} from 'react-native';
// import App from './src/App';
// import messaging from '@react-native-firebase/messaging';
// import {name as appName} from './app.json';

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background!', remoteMessage);
//   }); 

// AppRegistry.registerComponent(appName, () => App);




import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

// Background/quit messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  const title = remoteMessage.data?.title;
  const body = remoteMessage.data?.body;

  if (title || body) {
    await notifee.displayNotification({
      title, 
      body,
      android: {
        channelId: 'high_importance_channel',
        sound: 'custom_sound',   
        style: {
          type: notifee.AndroidStyle.BIGPICTURE,
          picture:
            remoteMessage.notification?.imageUrl || remoteMessage.data?.image,
        },
      }, 
      ios: { sound: 'default' },
    }); 
  } 
});

AppRegistry.registerComponent(appName, () => App); 