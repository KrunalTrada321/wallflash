import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface PremiumCardProps {
  price?: string;
  onPurchasePress: () => void;
} 

const PremiumCard: React.FC<PremiumCardProps> = ({ price, onPurchasePress }) => {
  return (
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
        borderColor: "rgba(255,255,255,0.05)"
      }}
    >
      {/* Premium Badge */}
      <View
        style={{
          backgroundColor: "rgba(255, 215, 0, 0.2)",
          paddingHorizontal: 16,
          paddingVertical: 6,
          borderRadius: 20,
          marginBottom: 12
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
          textAlign: "center"
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
          style={{ paddingVertical: 16, alignItems: "center", justifyContent: "center", borderRadius: 14 }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", letterSpacing: 0.5 }}>
            Go Premium
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default PremiumCard;
