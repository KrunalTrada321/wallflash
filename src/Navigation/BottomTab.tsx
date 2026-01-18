import * as React from 'react';
import { Image, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../Styling/colors';
import { scale } from 'react-native-size-matters';
import HomeScreen from '../Screens/HomeScreen';
import CategoriesScreen from '../Screens/CategoriesScreen';
import PremiumScreen from '../Screens/PremiumScreen';
import VideoScreen from '../Screens/VideoScreen';
import PrimeCategories from '../Screens/PrimeCategories';
import PremiumWrapper from '../Components/PremiumWrapper';
import GamesScreen from '../Screens/GamesScreen';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarStyle: {
          height: scale(55), // Increase the height of the bottom tab bar
          paddingTop: scale(10),
          backgroundColor: colors.primary, // Optional: Change background color
          borderTopLeftRadius: scale(20), // Optional: Add rounded corners
          borderTopRightRadius: scale(20),
          borderColor: colors.flashColor,
          borderTopWidth: 1.5,
          borderLeftWidth: 1.5,
          borderRightWidth: 1.5,
        },
      }}>

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={scale(24)}
              color={focused ? colors.flashColor : colors.white}
            />
          ),
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: colors.white,
        }}
      />

      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={scale(24)}
              color={focused ? colors.flashColor : colors.white}
            />
          ),
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: colors.white,
        }}
      />

      {/* <Tab.Screen
        name="Premium"
        component={PremiumScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'flash-sharp' : 'flash-outline'}
              size={scale(26)}
              color={focused ? colors.flashColor : colors.white}
            />
          ),
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: colors.white,
        }}
      /> */}


      <Tab.Screen
        name="Video"
        component={VideoScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'flash' : 'flash-outline'}
              size={scale(26)}
              color={focused ? colors.flashColor : colors.white}
            />
          ),
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: colors.white,
        }}
      />



      <Tab.Screen
        name="Premium"
        component={PremiumWrapper}
        options={{ 
          tabBarIcon: ({ color, size, focused }) => (
            <Image
              source={
                focused 
                  ? require("../assets/bottomTab/crown2.png") // active icon
                  : require("../assets/bottomTab/crown-outline.png") // inactive icon
              }
              style={{
                width: scale(25),
                height: scale(25),
                tintColor: focused ? colors.flashColor : colors.white,
                resizeMode: "contain",
              }}
            />
          ),
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: colors.white,
        }}
      />

 <Tab.Screen
        name="Games"
        component={GamesScreen}
        options={{ 
          tabBarIcon: ({ color, size, focused }) => (
            <Image
              source={
                focused 
                  ? require("../assets/bottomTab/games.png") // active icon
                  : require("../assets/bottomTab/games-o.png") // inactive icon
              }
              style={{
                width: scale(25),
                height: scale(25),
                tintColor: focused ? colors.flashColor : colors.white,
                resizeMode: "contain",
              }}
            />
          ),
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: colors.white,
        }}
      />

    </Tab.Navigator>
  );
}





export default MyTabs;
