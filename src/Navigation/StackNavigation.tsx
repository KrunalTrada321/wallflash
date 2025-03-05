import { View, Text } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyDrawer from './Drawer';
import FullImageScreen from '../Screens/FullImageScreen ';
import CategoryImages from '../Screens/CategoryImages';
import FavoritesScreen from '../Screens/FavoritesScreen';
import AboutScreen from '../Screens/AboutScreen';
import TermsPrivacy from '../Screens/TermsPrivacy';

const Stack = createStackNavigator();

const StackNav = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Drawer" component={MyDrawer} /> 
            <Stack.Screen name="FullImageScreen" component={FullImageScreen} /> 
            <Stack.Screen name="CategoryImages" component={CategoryImages} /> 
            <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />  
            <Stack.Screen name="AboutScreen" component={AboutScreen} />  
            <Stack.Screen name="TermsPrivacy" component={TermsPrivacy} />  
        </Stack.Navigator>  
    ); 
};
  
export default StackNav;
