import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const AD_UNIT_ID = "ca-app-pub-7105708210867722/6181117151";

export const TEMP_PREMIUM_KEY = 'TEMP_PREMIUM_EXPIRY';
const TEMP_PREMIUM_DURATION = 30 * 60 * 1000;
// export const TEMP_PREMIUM_DURATION = 10000;


let rewardedAd: RewardedAd | null = null;
let isLoaded = false;

export const initRewardedPremiumAd = (onUnlockedCallback?: () => void) => {
  if (rewardedAd) return;

  rewardedAd = RewardedAd.createForAdRequest(AD_UNIT_ID);

  rewardedAd.addAdEventListener(
    RewardedAdEventType.LOADED,
    () => {
      isLoaded = true;
    }
  );
 
  rewardedAd.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD, 
    async () => {
      const expiryTime = Date.now() + TEMP_PREMIUM_DURATION;

      await AsyncStorage.setItem(
        TEMP_PREMIUM_KEY,
        expiryTime.toString()
      );

      onUnlockedCallback?.();

      Alert.alert(
        "Unlocked 🎉",
        "Premium wallpapers unlocked for 30 minutes"
      );

      isLoaded = false;
      rewardedAd?.load();
    }
  );

  rewardedAd.load();
};

export const showRewardedPremiumAd = () => {
  if (rewardedAd && isLoaded) {
    rewardedAd.show().catch(() => {
      Alert.alert("Ad Error", "Unable to show ad. Try again.");
      rewardedAd?.load();
    });
  } else {
    Alert.alert(
      "Please Wait",
      "The ad is not ready yet. Try again in a moment."
    );


    rewardedAd?.load();
  }
};

export const checkTempPremiumStatus = async (): Promise<boolean> => {
  const expiry = await AsyncStorage.getItem(TEMP_PREMIUM_KEY);
  if (!expiry) return false;

  return Date.now() < Number(expiry);
};
