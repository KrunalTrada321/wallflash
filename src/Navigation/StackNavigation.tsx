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
import SeasonalImages from '../Screens/SeasonalImages';
import PrimeCategories from '../Screens/PrimeCategories';

// 🎮 Import your game screens here
import MemoryCardGame from '../Screens/games/Memorycardgame';
import ReactionRush from '../Screens/games/ReactionRush';
import ColorTrap from '../Screens/games/ColorTrap';
import WhackAMoji from '../Screens/games/WhackAMoji';
import Snakegame from '../Screens/games/Snakegame';
import Twentyfortyeight from '../Screens/games/Twentyfortyeight';
import StackTower from '../Screens/games/Stacktower';
import Ballblast from '../Screens/games/Ballblast';
// import WordGuess from '../Screens/Games/WordGuess';       // add more as needed
// import NumberPuzzle from '../Screens/Games/NumberPuzzle'; // add more as needed

const Stack = createStackNavigator();

const StackNav = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Drawer" component={MyDrawer} />
            <Stack.Screen name="FullImageScreen" component={FullImageScreen}
                options={{
                    animation: 'scale_from_center',
                    transitionSpec: {
                        open: { animation: 'timing', config: { duration: 300 } },
                        close: { animation: 'timing', config: { duration: 300 } },
                    },
                }}
            />
            <Stack.Screen name="CategoryImages" component={CategoryImages} />
            <Stack.Screen name="PrimeImages" component={PrimeImages} />
            <Stack.Screen name="PrimeCategories" component={PrimeCategories} />

            <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} options={{
                animation: 'slide_from_right',
                transitionSpec: {
                    open: { animation: 'timing', config: { duration: 500 } },
                    close: { animation: 'timing', config: { duration: 500 } },
                },
            }} />
            <Stack.Screen name="AboutScreen" component={AboutScreen}
                options={{
                    animation: 'slide_from_right',
                    transitionSpec: {
                        open: { animation: 'timing', config: { duration: 500 } },
                        close: { animation: 'timing', config: { duration: 500 } },
                    },
                }} />
            <Stack.Screen name="TermsPrivacy" component={TermsPrivacy}
                options={{
                    animation: 'slide_from_right',
                    transitionSpec: {
                        open: { animation: 'timing', config: { duration: 500 } },
                        close: { animation: 'timing', config: { duration: 500 } },
                    },
                }} />
            <Stack.Screen name="LeadScreen" component={LeadScreen} />
            <Stack.Screen
                name="FullVideo"
                component={FullVideoScreen}
                options={{
                    animation: 'scale_from_center',
                    transitionSpec: {
                        open: { animation: 'timing', config: { duration: 500 } },
                        close: { animation: 'timing', config: { duration: 500 } },
                    },
                }}
            />
            <Stack.Screen name="SeasonalImages" component={SeasonalImages}
                options={{
                    animation: 'scale_from_center',
                    transitionSpec: {
                        open: { animation: 'timing', config: { duration: 300 } },
                        close: { animation: 'timing', config: { duration: 300 } },
                    },
                }} />

            {/* 🎮 Game Screens — all use slide_from_bottom for a natural "launch" feel */}
            <Stack.Screen
                name="MemoryCardGame"
                component={MemoryCardGame}
                options={{
                    animation: 'slide_from_bottom',
                    transitionSpec: {
                        open: { animation: 'timing', config: { duration: 400 } },
                        close: { animation: 'timing', config: { duration: 400 } },
                    },
                }}
            />

            <Stack.Screen name="ReactionRush" component={ReactionRush} options={{
                animation: 'slide_from_bottom',
                transitionSpec: {
                    open: { animation: 'timing', config: { duration: 400 } },
                    close: { animation: 'timing', config: { duration: 400 } },
                },
            }} />

            <Stack.Screen name="ColorTrap" component={ColorTrap} options={{
                animation: 'slide_from_bottom',
                transitionSpec: {
                    open: { animation: 'timing', config: { duration: 400 } },
                    close: { animation: 'timing', config: { duration: 400 } },
                },
            }} />
            <Stack.Screen name="WhackAMoji" component={WhackAMoji} options={{
                animation: 'slide_from_bottom',
                transitionSpec: {
                    open: { animation: 'timing', config: { duration: 400 } },
                    close: { animation: 'timing', config: { duration: 400 } },
                },
            }} />
            <Stack.Screen name="SnakeGame" component={Snakegame}
                options={{
                    animation: 'slide_from_bottom',
                    transitionSpec: {
                        open: { animation: 'timing', config: { duration: 400 } },
                        close: { animation: 'timing', config: { duration: 400 } },
                    },
                }} />
            <Stack.Screen name="TwentyFortyEight" component={Twentyfortyeight} options={{
                animation: 'slide_from_bottom',
                transitionSpec: {
                    open: { animation: 'timing', config: { duration: 400 } },
                    close: { animation: 'timing', config: { duration: 400 } },
                },
            }} />


            <Stack.Screen name="StackTower" component={StackTower} options={{
                animation: 'slide_from_bottom',
                transitionSpec: {
                    open: { animation: 'timing', config: { duration: 400 } },
                    close: { animation: 'timing', config: { duration: 400 } },
                },
            }} />
            <Stack.Screen name="BallBlast" component={Ballblast} options={{
                animation: 'slide_from_bottom',
                transitionSpec: {
                    open: { animation: 'timing', config: { duration: 400 } },
                    close: { animation: 'timing', config: { duration: 400 } },
                },
            }} /> 

        </Stack.Navigator>
    );
};

export default StackNav;