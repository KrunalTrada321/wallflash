import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Linking, Animated, Easing } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../Styling/colors";
import { scale } from "react-native-size-matters";

interface PremiumCardProps {
  price?: string;
  onPurchasePress: () => void;
  onWatchAdPress: () => void;
}

const PremiumCard: React.FC<PremiumCardProps> = ({ price, onPurchasePress, onWatchAdPress }) => {
  // Diagonal shine reflection sweep across the button
  const shineAnim = useRef(new Animated.Value(0)).current;
  // Glowing border pulse animation for the Watch Ad button
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Glossy shine reflection beam sweep
    const shineSweep = Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 1300,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.delay(1200),
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    // 2. Button border glow pulse
    const borderGlow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    shineSweep.start();
    borderGlow.start();

    return () => {
      shineSweep.stop();
      borderGlow.stop();
    };
  }, [shineAnim, glowAnim]);

  const shineTranslate = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 360],
  });

  const animatedBorderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(16, 185, 129, 0.4)", "rgba(52, 211, 153, 0.95)"],
  });

  const animatedShadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.75],
  });

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <LinearGradient
        colors={["#0f0f0f", "#1a1a1a", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: "92%",
          borderRadius: 24,
          padding: 28,
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.6,
          shadowRadius: 14,
          elevation: 10,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        {/* Premium Badge */}
        <View
          style={{
            backgroundColor: "rgba(255, 215, 0, 0.2)",
            paddingHorizontal: 16,
            paddingVertical: 6,
            borderRadius: 20,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: "#FFD700", fontSize: 14, fontWeight: "600" }}>PREMIUM</Text>
        </View>

        {/* Header */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#fff",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Premium Wallpapers
        </Text>

        {/* Features with Icons */}
        <View style={{ marginBottom: 24, width: "100%" }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <Icon name="image-multiple" size={22} color="#FFD700" style={{ marginRight: 8 }} />
            <Text style={{ color: "#ddd", fontSize: 15 }}>Exclusive HD collections</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <Icon name="star-shooting" size={22} color="#FFD700" style={{ marginRight: 8 }} />
            <Text style={{ color: "#ddd", fontSize: 15 }}>Trending New Wallpapers</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="lock-open-variant" size={22} color="#FFD700" style={{ marginRight: 8 }} />
            <Text style={{ color: "#ddd", fontSize: 15 }}>One-time purchase • Lifetime access</Text>
          </View>
        </View>

        {/* Product Info */}
        {price && (
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#FFD700", marginBottom: 20 }}>
            {price}
          </Text>
        )}

        {/* Premium Button */}
        <TouchableOpacity
          onPress={onPurchasePress}
          activeOpacity={0.85}
          style={{ width: "100%", borderRadius: 14, overflow: "hidden", marginBottom: 12 }}
        >
          <LinearGradient
            colors={["#FF512F", "#DD2476"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingVertical: 16,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 14,
              paddingHorizontal: scale(30),
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", letterSpacing: 0.5 }}>
              Go Premium
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={{ color: colors.white, marginVertical: scale(6), opacity: 0.7, fontWeight: "600", fontSize: scale(12) }}>
          — OR FREE OPTION —
        </Text>

        {/* Highlighted Watch Ads to Unlock Button with Sweeping Shine Reflection */}
        <View style={{ width: "100%", marginTop: 8 }}>
          <Animated.View
            style={{
              width: "100%",
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: animatedBorderColor,
              backgroundColor: "rgba(16, 185, 129, 0.10)",
              shadowColor: "#10B981",
              shadowOpacity: animatedShadowOpacity,
              shadowRadius: 10,
              elevation: 4,
              overflow: "hidden", // Cleanly clips the diagonal reflection beam
              position: "relative",
            }}
          >
            <TouchableOpacity
              onPress={onWatchAdPress}
              activeOpacity={0.8}
              style={{
                paddingVertical: scale(13),
                paddingHorizontal: scale(16),
                borderRadius: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  marginRight: scale(10),
                  backgroundColor: "rgba(16, 185, 129, 0.22)",
                  borderRadius: 20,
                  padding: scale(6),
                }}
              >
                <Icon name="play" size={scale(20)} color="#10B981" />
              </View>

              <View style={{ alignItems: "flex-start" }}>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: scale(14),
                    fontWeight: "700",
                    letterSpacing: 0.3,
                  }}
                >
                  Watch Ad to Unlock
                </Text>
                <Text
                  style={{
                    color: "#A7F3D0",
                    fontSize: scale(10.5),
                    fontWeight: "600",
                    marginTop: 1,
                  }}
                >
                  Instant 30 Minutes Access • Free
                </Text>
              </View>
            </TouchableOpacity>

            {/* Moving Glossy Shine Reflection Beam */}
            <Animated.View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: -30,
                bottom: -30,
                width: scale(65),
                transform: [
                  { translateX: shineTranslate },
                  { rotate: "25deg" },
                ],
              }}
            >
              <LinearGradient
                colors={[
                  "rgba(255, 255, 255, 0)",
                  "rgba(255, 255, 255, 0.08)",
                  "rgba(255, 255, 255, 0.55)",
                  "rgba(167, 243, 208, 0.7)",
                  "rgba(255, 255, 255, 0.08)",
                  "rgba(255, 255, 255, 0)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  flex: 1,
                  width: "100%",
                }}
              />
            </Animated.View>
          </Animated.View>
        </View>
      </LinearGradient>

      <View style={{ marginTop: scale(12), width: '100%', }}>
        <Text style={{ fontSize: scale(11), color: colors.redLight, textAlign: "center" }}>if you purchased Premium previously, make sure you're installed app with same Google Play account</Text>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            Linking.openURL('https://play.google.com/store/apps/details?id=com.wallflash');
          }}>
          <Text style={{ fontSize: scale(12), color: colors.redLight, textAlign: "center", textDecorationLine: "underline" }}>Playstore Link</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default PremiumCard;