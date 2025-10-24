import { View, Text } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyDrawer from './Drawer';
import FullImageScreen from '../Screens/FullImageScreen';
import CategoryImages from '../Screens/CategoryImages';
import FavoritesScreen from '../Screens/FavoritesScreen';
import AboutScreen from '../Screens/AboutScreen';
import TermsPrivacy from '../Screens/TermsPrivacy';
import LeadScreen from '../Screens/LeadScreen';
import FullVideoScreen from '../Screens/FullVideoScreen';
import PrimeImages from '../Screens/PrimeImages';
import MyTabs from './BottomTab';

const Stack = createStackNavigator();

const StackNav = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Drawer" component={MyDrawer} />
            <Stack.Screen name="FullImageScreen" component={FullImageScreen}
             options={{
                animation: 'scale_from_center',
                transitionSpec: {
                    open: { animation: 'timing', config: { duration: 300 } },  // 👈 slower open
                    close: { animation: 'timing', config: { duration: 300 } }, // 👈 slower close
                },
            }}
            />
            <Stack.Screen name="CategoryImages" component={CategoryImages} />
            <Stack.Screen name="PrimeImages" component={PrimeImages} />
            
            <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} options={{
                animation: 'slide_from_right',
                transitionSpec: {
                    open: { animation: 'timing', config: { duration: 500 } },  // 👈 slower open
                    close: { animation: 'timing', config: { duration: 500 } }, // 👈 slower close
                },
            }} />
            <Stack.Screen name="AboutScreen" component={AboutScreen}
                options={{
                    animation: 'slide_from_right',
                    transitionSpec: {
                        open: { animation: 'timing', config: { duration: 500 } },  // 👈 slower open
                        close: { animation: 'timing', config: { duration: 500 } }, // 👈 slower close
                    },
                }} />
            <Stack.Screen name="TermsPrivacy" component={TermsPrivacy}
                options={{
                    animation: 'slide_from_right',
                    transitionSpec: {
                        open: { animation: 'timing', config: { duration: 500 } },  // 👈 slower open
                        close: { animation: 'timing', config: { duration: 500 } }, // 👈 slower close
                    },
                }} />
            <Stack.Screen name="LeadScreen" component={LeadScreen} />
            <Stack.Screen
                name="FullVideo"
                component={FullVideoScreen} 
                options={{
                    animation: 'scale_from_center',
                    transitionSpec: {
                        open: { animation: 'timing', config: { duration: 500 } },  // 👈 slower open
                        close: { animation: 'timing', config: { duration: 500 } }, // 👈 slower close
                    },
                }}
            /> 
        </Stack.Navigator>
    );
}; 

export default StackNav;
