import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { requestPurchase, type RequestPurchase } from 'react-native-iap';

const PREMIUM_PRODUCT_ID = 'premium_wallpapers_product';

const PurchaseScreen = () => {
  const handlePurchase = async () => {
    try {
      let purchaseParams: RequestPurchase = {
        sku: PREMIUM_PRODUCT_ID, // iOS
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      };

      if (Platform.OS === 'android') { 
        purchaseParams = { skus: [PREMIUM_PRODUCT_ID] }; // Android requires array
      }

      await requestPurchase(purchaseParams);
    } catch (err: any) {
      console.warn(err.message || err);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Unlock Premium Wallpapers</Text>
      <Pressable
        onPress={handlePurchase}
        style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: '#FF0844',
          borderRadius: 10,
        }}
      >
        <Text style={{ color: '#fff' }}>Purchase Premium</Text>
      </Pressable>
    </View>
  );
};

export default PurchaseScreen;
 