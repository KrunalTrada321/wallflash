import * as React from 'react';
import { Alert, Animated, Image, Linking, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CommonActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MyTabs from './BottomTab';
import { scale } from 'react-native-size-matters';
import { colors } from '../Styling/colors';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useEffect } from 'react';
import { navigateToLastTab } from './NavigationService';

const Drawer = createDrawerNavigator();



const CustomDrawerContent = (props) => {


  const navigation = useNavigation();
  const [favPressed, setFavPressed] = React.useState(false);


  const shareApp = async () => {
    try {
      const result = await Share.share({
        message:
          "Download 4K Wallpapers & Trending Status | WallFlash : https://play.google.com/store/apps/details?id=com.wallflash",
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type:", result.activityType);
        } else {
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error(error.message);
    }
  };



  return (
    <View style={{ flex: 1 }}>
      {/* Top Section - Add Logo or Profile Image */}
      <View style={{ flex: 1, paddingVertical: scale(20), backgroundColor: colors.black, }}>

        <View style={{ alignSelf: 'center', alignItems: 'center', marginBottom: scale(10) }}>
          <Image
            source={require('../assets/wf-logo.jpg')} // Replace with your image path
            style={{ width: scale(200), height: scale(150), marginBottom: scale(10) }}
          />

          <Text style={{ fontSize: scale(13), color: colors.white, marginTop: scale(10) }}>Version 1.25</Text>

        </View>

        <View style={{ height: scale(1), width: "100%", backgroundColor: colors.white }}></View>


        <View style={{ flex: 1, padding: scale(12) }}>
          {/* Favorites */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('FavoritesScreen')

            }

            }
            onPressIn={() => setFavPressed(true)}
            onPressOut={() => setFavPressed(false)}
            style={styles.drawerItem}
          >
            <AntDesign name="hearto" size={scale(22)} color={colors.white} />
            <Text style={styles.drawerText}>Favorites</Text>

          </TouchableOpacity>

          {/* About Us */}
          <TouchableOpacity
            onPress={() => navigation.navigate('AboutScreen')}
            style={styles.drawerItem}
          >
            <Feather name="info" size={24} color={colors.white} />
            <Text style={styles.drawerText}>About Us</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigation.navigate('TermsPrivacy')}
          >
            <Feather name="file-text" size={24} color={colors.white} />
            <Text style={styles.drawerText}>Terms & Privacy</Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={styles.drawerItem}
            onPress={shareApp}
          >
            <Feather name="share-2" size={24} color={colors.white} />
            <Text style={styles.drawerText}>Share This App</Text>
          </TouchableOpacity>


        </View>

        {/* <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('LeadScreen')}> 
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image resizeMode='contain' style={{ height: 130, width: 260 }} source={require('../assets/lead.png')} />
        </View>
        </TouchableOpacity>  */}


        <TouchableOpacity activeOpacity={0.7}
          onPress={() => {
            navigateToLastTab();
          }}
        >
          <View style={{
            justifyContent: 'center', alignItems: 'center', borderRadius: 20,       // 👈 your radius
            overflow: 'hidden'
          }}>
            <Image resizeMode="cover" style={{ height: 130, width: 260, borderRadius: 20, }} source={require('../assets/premium-card.jpg')} />
          </View>
        </TouchableOpacity>


      </View>

      <View style={{ backgroundColor: colors.black }}>



        <View style={{ backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>

          <Text style={{ fontSize: scale(14), textAlign: 'center', fontWeight: '700', paddingRight: scale(5) }}>© {new Date().getFullYear()} WallFlash
          </Text>

          <Image style={{ height: scale(16), width: scale(16) }} source={require('../assets/flashed.png')} />

          <Text style={{ fontSize: scale(14), textAlign: 'center', fontWeight: '700', paddingLeft: scale(5) }}>by Krunal Trada</Text>

        </View>
      </View>
    </View>
  );
};






const MyDrawer = () => {

  const borderColorAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(borderColorAnim, {
        toValue: 1,
        duration: 30000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: ["#F73B00", "#F7E300", "#00DF72", "#00AAF6", "#CE00F2", "#F7A6C9"],
  });



  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />} // ✅ Inject custom drawer 
      screenOptions={{
        drawerStyle: {
          backgroundColor: colors.white, // Set background color
          borderTopRightRadius: scale(25), // Rounded top right corner
          borderBottomRightRadius: scale(25), // Rounded bottom right corner
          borderColor: colors.white,
          borderWidth: 1,
          marginVertical: scale(8),
          overflow: 'hidden', // Ensures content inside respects border radius
        },
        sceneContainerStyle: {
          backgroundColor: 'transparent', // Ensures transparency outside the drawer
        },
        headerStyle: {
          backgroundColor: colors.primary, // Set primary color for header background
          borderBottomLeftRadius: 25, // Rounded bottom-left corner
          borderBottomRightRadius: 25, // Rounded bottom-right corner
          borderBottomColor: borderColor,
          borderWidth: 2, // Increase border width for better visibility
          shadowColor: borderColor, // Dynamic animated shadow color
          shadowOffset: { width: 0, height: 20 }, // Increase shadow spread downwards
          shadowOpacity: 1, // Make shadow fully visible
          shadowRadius: 50, // Increase blur effect for a glowing effect
          elevation: 50, // Stronger shadow effect on Android
          borderLeftColor: borderColor,
          borderRightColor: borderColor,  // ✅ Animated right border
        },
        headerTintColor: colors.white,
        headerTitleAlign: 'center',
      }}
    >
      <Drawer.Screen
        name="WallFlash"
        component={MyTabs}
        options={{
          drawerItemStyle: { display: 'none' }, // Hide drawer item
          headerTitle: () => (
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={require('../assets/wallflash-logo.png')} // Update with your logo path
                style={{ width: scale(220), height: scale(60), resizeMode: 'contain', alignSelf: 'center', marginLeft: scale(10) }}
              />

              <Image
                source={require('../assets/flashed.png')} // Update with your logo path
                style={{ width: scale(30), height: scale(30), resizeMode: 'contain', alignSelf: 'center' }}
              />



            </View>

          ),
        }}
      />

    </Drawer.Navigator>
  );
};



const styles = StyleSheet.create({
  drawerItem: {
    paddingVertical: scale(12),
    paddingHorizontal: scale(15),
    borderRadius: scale(10),
    marginBottom: scale(10),
    borderWidth: 0.8,
    borderColor: colors.flashColor,
    flexDirection: 'row'
  },
  drawerText: {
    color: colors.white,
    fontSize: scale(16),
    fontWeight: 'bold',
    paddingLeft: scale(10)
  }
});

export default MyDrawer; 
