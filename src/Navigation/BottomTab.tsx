import * as React from 'react';
import {Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../Styling/colors';
import {scale} from 'react-native-size-matters';
import HomeScreen from '../Screens/HomeScreen';
import CategoriesScreen from '../Screens/CategoriesScreen';
import PremiumScreen from '../Screens/PremiumScreen';

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
        },
      }}>
   
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={scale(24)}
              color={color}
            />
          ),
          tabBarActiveTintColor: colors.white ,
          tabBarInactiveTintColor: colors.white,
        }}  
      />
 
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={scale(24)}
              color={color}
            />
          ),
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: colors.white,
        }}
      />

      <Tab.Screen
        name="Premium" 
        component={PremiumScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <Ionicons
              name={focused ? 'star' : 'star-outline'}
              size={scale(24)}
              color={color}
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
 