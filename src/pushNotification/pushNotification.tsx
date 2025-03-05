import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
export default async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL; 

  if (enabled) {
    console.log('Authorization status:', authStatus);
    GetFCMToken(); 
  }    
}   
 
async function GetFCMToken() {
  let fcmtoken = await AsyncStorage.getItem('fcmtoken');
  console.log(fcmtoken, 'Old Token');
  if (!fcmtoken) { 
    try {   
      const fcmtoken = await messaging().getToken();
      if (fcmtoken) {
        console.log(fcmtoken, 'New Token');   
        await AsyncStorage.setItem('fcmtoken', fcmtoken);
       }
    } catch (error) {
      console.log(error, 'Error in token'); 
    } 
  } 
} 
    
 export const NotificationListner = () => {
  messaging().onNotificationOpenedApp(remoteMessage => { 
    console.log(
      'Notification Caused App to background state:',
      remoteMessage.notification,
    ); 
  }); 
  messaging().
  getInitialNotification()
  .then(remoteMessage => { 
     if(remoteMessage){
        console.log("Notification Caused App to quit state:", remoteMessage.notification);
     }
  });
  messaging().onMessage(async remoteMessage => {
    console.log("Notification on forground state.......", remoteMessage); 
  }) 
};     