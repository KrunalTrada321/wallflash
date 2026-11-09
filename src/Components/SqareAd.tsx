import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { scale } from 'react-native-size-matters';
import { checkIsPremiumUser } from './Useinterstitialad';

const AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-7105708210867722/8647662693';

interface SqareAdProps {
  size?: BannerAdSize;
  style?: any;
}

const SqareAd = ({ size = BannerAdSize.MEDIUM_RECTANGLE, style }: SqareAdProps) => {
  const [isPremium, setIsPremium] = useState(false);
  const [currentSize, setCurrentSize] = useState<BannerAdSize>(size);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);
  const [adFailed, setAdFailed] = useState(false);

  useEffect(() => {
    checkIsPremiumUser().then(setIsPremium);
  }, []);

  if (isPremium || adFailed) {
    return null;
  }

  const handleAdFailed = (error: any) => {
    console.log('[Grid Square BannerAd] Failed to load size:', currentSize, error);
    // If MEDIUM_RECTANGLE (square type) fails, try adaptive banner as safe fallback
    if (currentSize === BannerAdSize.MEDIUM_RECTANGLE && !hasTriedFallback) {
      setHasTriedFallback(true);
      setCurrentSize(BannerAdSize.ANCHORED_ADAPTIVE_BANNER);
    } else {
      setAdFailed(true);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={currentSize === BannerAdSize.MEDIUM_RECTANGLE ? styles.squareCard : styles.adaptiveCard}>
        <BannerAd
          key={`grid-ad-${currentSize}`}
          unitId={AD_UNIT_ID}
          size={currentSize}
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
          }}
          onAdFailedToLoad={handleAdFailed}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: scale(8),
  },
  squareCard: {
    width: 300,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(12),
    overflow: 'hidden',
  },
  adaptiveCard: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default SqareAd;
