
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Linking
} from "react-native";
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initConnection,
  getProducts,
  requestPurchase,
  purchaseUpdatedListener,
  purchaseErrorListener,
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
  Product,
  Purchase,
  PurchaseError,
  getAvailablePurchases
} from "react-native-iap";
import PrimeCategories from "../Screens/PrimeCategories";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../Styling/colors";
import PremiumCard from "./PremiumCard";
import { checkTempPremiumStatus, initRewardedPremiumAd, showRewardedPremiumAd, TEMP_PREMIUM_KEY } from "./RewardedPremiumAd";

const PREMIUM_PRODUCT_ID = "premium_wallpapers_product";

const PremiumWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isFromPlayStore, setIsFromPlayStore] = useState(true);
  const [hasTempPremium, setHasTempPremium] = useState(false);

  let purchaseUpdateSub: any = null;
  let purchaseErrorSub: any = null;

  const refreshTempPremium = async () => {
    const active = await checkTempPremiumStatus();
    setHasTempPremium(active);
  };


  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const scheduleExpiry = async () => {
      const expiry = await AsyncStorage.getItem(TEMP_PREMIUM_KEY);

      if (!expiry) {
        setHasTempPremium(false);
        return;
      }

      const remaining = Number(expiry) - Date.now();

      if (remaining <= 0) {
        setHasTempPremium(false);
        return;
      }

      // premium active
      setHasTempPremium(true);

      // 🔥 schedule exact expiry
      timeoutId = setTimeout(() => {
        setHasTempPremium(false);
      }, remaining);
    };

    if (hasTempPremium) {
      scheduleExpiry();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hasTempPremium]);




  useEffect(() => {
    const initIAP = async () => {
      try {
        // 1️⃣ Check local storage first
        const savedPurchase = await AsyncStorage.getItem('isPremiumPurchased');
        if (savedPurchase === 'true') {
          setIsPurchased(true);
          setIsLoading(false);
          return;
        }

        const installer = DeviceInfo.getInstallerPackageNameSync();
        if (installer !== "com.android.vending") {
          console.log("Not installed from Play Store:", installer);
          setIsFromPlayStore(false);
          setIsLoading(false);
          return;
        }

        // 2️⃣ Initialize connection
        await initConnection();
        await flushFailedPurchasesCachedAsPendingAndroid();

        // 3️⃣ Get product details
        const items = await getProducts({ skus: [PREMIUM_PRODUCT_ID] });
        setProducts(items);

        // 4️⃣ Check if the product was already purchased
        const availablePurchases = await getAvailablePurchases();
        const premiumPurchase = availablePurchases.find(
          (purchase) => purchase.productId === PREMIUM_PRODUCT_ID
        );
        if (premiumPurchase) {
          setIsPurchased(true);
          await AsyncStorage.setItem('isPremiumPurchased', 'true');
        }

        // 5️⃣ Listen for purchase updates
        purchaseUpdateSub = purchaseUpdatedListener(async (purchase: Purchase) => {
          console.log("purchaseUpdatedListener", purchase);

          if (purchase.transactionReceipt && purchase.productId === PREMIUM_PRODUCT_ID) {
            setIsPurchased(true);
            await AsyncStorage.setItem('isPremiumPurchased', 'true');

            try {
              await finishTransaction({ purchase, isConsumable: false });
            } catch (err) {
              console.warn("Finish transaction error:", err);
            }

            Alert.alert(
              "Success",
              "You unlocked Premium Wallpapers!",
              [{ text: "OK" }]
            );
          }
        });

        // 6️⃣ Listen for purchase errors
        purchaseErrorSub = purchaseErrorListener((error: PurchaseError) => {
          console.warn("purchaseErrorListener", error);
          Alert.alert("Purchase Failed", error.message);
        });

      } catch (err) {
        console.warn("IAP init error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initIAP();

    return () => {
      if (purchaseUpdateSub) purchaseUpdateSub.remove();
      if (purchaseErrorSub) purchaseErrorSub.remove();
    };
  }, []);


  // ✅ FIX: Check temp premium status on mount AND initialize ad
  useEffect(() => {
    const checkInitialTempStatus = async () => {
      const isActive = await checkTempPremiumStatus();
      setHasTempPremium(isActive);
    };

    checkInitialTempStatus();

    initRewardedPremiumAd(() => {
      setHasTempPremium(true);
    });
  }, []);







const handleWatchAdUnlock = () => {
  showRewardedPremiumAd();

  // 🔥 force re-check after ad closes
  setTimeout(() => {
    refreshTempPremium();
  }, 500);
};


  const handlePurchase = async () => {
    try {
      await requestPurchase({ skus: [PREMIUM_PRODUCT_ID] });
    } catch (err: any) {
      console.warn("Purchase error:", err.message || err);
      Alert.alert("Purchase Failed", err.message || "Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#DD2476" />
      </View>
    );
  }

  if (!isFromPlayStore) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text
          style={{
            fontSize: 60,
            marginBottom: 20,
            textAlign: "center",
            color: "#FFD700",
            textShadowColor: "rgba(0,0,0,0.5)",
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4, 
          }}
        >👑</Text>
        <LinearGradient
          colors={["#0f0f0f", "#1a1a1a", "#000000"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: "92%",
            borderRadius: 24,
            padding: 28,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#FFD700", marginBottom: 16, textAlign: "center" }}>
            Install the App from Play Store
          </Text>
          <Text style={{ fontSize: 16, color: "#ddd", textAlign: "center", marginBottom: 24 }}>
            Premium purchases are only available when you download the app from the official Play Store
          </Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              Linking.openURL('https://play.google.com/store/apps/details?id=com.wallflash');
            }}
            style={{
              backgroundColor: "#FF512F",
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 14,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Go to Play Store</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  if (isPurchased || hasTempPremium) {
    return <PrimeCategories />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background, padding: 20 }}>
      <PremiumCard
        price={products.length > 0 ? products[0].localizedPrice : undefined}
        onPurchasePress={handlePurchase}
        onWatchAdPress={handleWatchAdUnlock}
      />
    </View>
  ); 
};

export default PremiumWrapper;