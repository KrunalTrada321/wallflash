import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { scale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-7105708210867722/8647662693';

interface FullPreviewBannerAdProps {
  width: number;
  height: number;
}

export default function FullPreviewBannerAd({ width, height }: FullPreviewBannerAdProps) {
  const [adSize, setAdSize] = useState<BannerAdSize>(BannerAdSize.MEDIUM_RECTANGLE);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);
  const [allFailed, setAllFailed] = useState(false);

  const handleAdFailed = (error: any) => {
    console.log('[FullPreviewBannerAd] Failed to load size:', adSize, error);
    if (!hasTriedFallback) {
      // Fallback from MEDIUM_RECTANGLE to standard adaptive banner
      setHasTriedFallback(true);
      setAdSize(BannerAdSize.ANCHORED_ADAPTIVE_BANNER);
    } else {
      setAllFailed(true);
    }
  };

  return (
    <View style={[styles.container, { width, height }]}>
      {/* Centered Ad Container */}
      <View style={styles.cardContainer}>
        {/* Sponsored Badge */}
        <View style={styles.badgeRow}>
          <Ionicons name="sparkles" size={scale(12)} color="#FFD700" style={{ marginRight: 6 }} />
          <Text style={styles.badgeText}>SPONSORED ADVERTISEMENT</Text>
        </View>

        {/* Ad View */}
        <View style={styles.adWrapper}>
          {!allFailed ? (
            <BannerAd
              key={`banner-${adSize}`}
              unitId={AD_UNIT_ID}
              size={adSize}
              requestOptions={{
                requestNonPersonalizedAdsOnly: false,
              }}
              onAdFailedToLoad={handleAdFailed}
            />
          ) : (
            <View style={styles.fallbackBox}>
              <Ionicons name="images-outline" size={scale(36)} color="#FFD700" />
              <Text style={styles.fallbackTitle}>WallFlash 4K</Text>
              <Text style={styles.fallbackSubtitle}>Premium Wallpapers & Themes</Text>
            </View>
          )}
        </View>
      </View>

      {/* Bottom Hint */}
      <View style={styles.bottomHint}>
        <Text style={styles.hintText}>Swipe to continue wallpapers</Text>
        <Ionicons name="arrow-forward" size={scale(14)} color="rgba(255,255,255,0.6)" style={{ marginLeft: 6 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0a0f',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(16),
  },
  cardContainer: {
    width: '100%',
    maxWidth: scale(340),
    backgroundColor: 'rgba(25, 25, 36, 0.95)',
    borderRadius: scale(18),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: scale(16),
    paddingHorizontal: scale(10),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(12),
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
  },
  badgeText: {
    color: '#FFD700',
    fontSize: scale(10),
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  adWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: scale(60),
    borderRadius: scale(10),
    overflow: 'hidden',
  },
  fallbackBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(25),
    paddingHorizontal: scale(20),
  },
  fallbackTitle: {
    color: '#ffffff',
    fontSize: scale(16),
    fontWeight: 'bold',
    marginTop: scale(8),
  },
  fallbackSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: scale(12),
    marginTop: scale(4),
  },
  bottomHint: {
    position: 'absolute',
    bottom: scale(35),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: scale(12),
    fontWeight: '500',
  },
});

