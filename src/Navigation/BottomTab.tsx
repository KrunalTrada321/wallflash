import * as React from 'react';
import { Image, Text, View, Animated, TouchableOpacity, StyleSheet, Easing } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigationState } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../Styling/colors';
import { scale } from 'react-native-size-matters';
import HomeScreen from '../Screens/HomeScreen';
import CategoriesScreen from '../Screens/CategoriesScreen';
import VideoScreen from '../Screens/VideoScreen';
import PrimeCategories from '../Screens/PrimeCategories';
import PremiumWrapper from '../Components/PremiumWrapper';
import GamesScreen from '../Screens/GamesScreen';
import TrendingScreen from '../Screens/TrendingScreen';

const Tab = createBottomTabNavigator();

const AnimatedTabIcon = ({ focused, children }: any) => {
  const scaleValue = React.useRef(new Animated.Value(focused ? 1.2 : 1)).current;
  const translateYValue = React.useRef(new Animated.Value(focused ? -3 : 0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: focused ? 1.2 : 1,
        useNativeDriver: true,
        friction: 4,
        tension: 60,
      }),
      Animated.spring(translateYValue, {
        toValue: focused ? -3 : 0,
        useNativeDriver: true,
        friction: 4,
        tension: 60,
      })
    ]).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }, { translateY: translateYValue }] }}>
      {children}
    </Animated.View>
  );
};

// 🔥 Centered Floating Big Fire Button with Distinctive Selected State & Tasteful Flame Animation
const TrendingCenterButton = ({ focused }: { focused: boolean }) => {
  const flameScale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const breathAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(flameScale, {
          toValue: focused ? 1.12 : 1.05,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(flameScale, {
          toValue: 1.0,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    breathAnimation.start();

    return () => {
      breathAnimation.stop();
    };
  }, [focused]);

  return (
    <View style={styles.centerButtonWrapper}>
      {/* Outer active glow halo when selected */}
      {focused && <View style={styles.activeGlowHalo} />}

      {/* Raised circular hero button with linear gradient */}
      <LinearGradient
        colors={
          focused
            ? ['#FF1E27', '#FF5E00', '#FFAE00'] // Intense selected fire gradient
            : ['#251528', '#181222'] // Inactive sleek dark glass
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.centerCircle,
          {
            borderColor: focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.22)',
            borderWidth: focused ? scale(2.8) : scale(1.6),
            shadowColor: focused ? '#FF3B30' : '#000',
            shadowOpacity: focused ? 0.95 : 0.25,
            shadowRadius: focused ? 12 : 4,
            elevation: focused ? 16 : 4,
            transform: [{ scale: focused ? 1.08 : 0.95 }],
          },
        ]}
      >
        {/* Animated Smooth Flame Icon */}
        <Animated.View
          style={{
            transform: [{ scale: flameScale }],
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Base Fire */}
          <Ionicons
            name={focused ? "flame" : "flame-outline"}
            size={scale(28)}
            color={focused ? '#FFFFFF' : '#9CA3AF'}
          />
          {/* Inner Golden Fire Core (visible when focused) */}
          {focused && (
            <View style={styles.innerFlameOverlay}>
              <Ionicons
                name="flame"
                size={scale(16)}
                color="#FFE57F"
              />
            </View>
          )}
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

// Custom Tab Bar Button for Trending (Floating Centerpiece)
const TrendingTabBarButton = (props: any) => {
  const currentRouteName = useNavigationState(state => {
    if (!state) return '';
    const route = state.routes[state.index];
    return route?.name;
  });

  const focused = currentRouteName === 'Trending' || Boolean(props.accessibilityState?.selected);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={props.onPress}
      onLongPress={props.onLongPress}
      style={[
        props.style,
        styles.trendingButtonOuter,
        {
          top: focused ? scale(-18) : scale(-12),
        },
      ]}
    >
      <TrendingCenterButton focused={focused} />
    </TouchableOpacity>
  );
};

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarStyle: {
          height: scale(58),
          paddingTop: scale(8),
          paddingBottom: scale(6),
          backgroundColor: colors.primary,
          borderColor: colors.flashColor,
          borderTopWidth: 1.5,
          overflow: 'visible',
          elevation: 12,
        },
      }}>

 <Tab.Screen
        name="Games"
        component={GamesScreen}
        options={{ 
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon focused={focused}>
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
            </AnimatedTabIcon>
          ),
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: colors.white,
        }}
      />

      <Tab.Screen
        name="Home"
        component={HomeScreen}
     options={{ 
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <Image
                source={
                  focused 
                    ? require("../assets/bottomTab/gallery.png") // active icon
                    : require("../assets/bottomTab/gallery-o.png") // inactive icon
                }
                style={{
                  width: scale(24),
                  height: scale(24), 
                  tintColor: focused ? colors.flashColor : colors.white,
                  resizeMode: "contain",
                }}
              />
            </AnimatedTabIcon>
          ),
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: colors.white,
        }}
      />

      <Tab.Screen
        name="Trending"
        component={TrendingScreen}
        options={{
          tabBarButton: (props) => <TrendingTabBarButton {...props} />,
        }}
      />

      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <Ionicons
                name={focused ? 'grid' : 'grid-outline'}
                size={scale(24)}
                color={focused ? colors.flashColor : colors.white}
              />
            </AnimatedTabIcon>
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


      {/* <Tab.Screen
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
      /> */}



      <Tab.Screen
        name="Premium"
        component={PremiumWrapper}
        options={{ 
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon focused={focused}>
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
            </AnimatedTabIcon>
          ),
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: colors.white,
        }}
      />



    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  trendingButtonOuter: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  centerButtonWrapper: {
    width: scale(62),
    height: scale(56),
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeGlowHalo: {
    position: 'absolute',
    top: scale(0),
    width: scale(58),
    height: scale(58),
    borderRadius: scale(29),
    backgroundColor: 'rgba(255, 94, 0, 0.28)',
  },
  centerCircle: {
    width: scale(52),
    height: scale(52),
    borderRadius: scale(26),
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
  },
  innerFlameOverlay: {
    position: 'absolute',
    bottom: scale(0.5),
    alignSelf: 'center',
  },
});

export default MyTabs;
