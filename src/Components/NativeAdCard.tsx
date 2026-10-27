import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
  NativeMediaAspectRatio,
  NativeAdChoicesPlacement,
  TestIds,
} from 'react-native-google-mobile-ads';
import LinearGradient from 'react-native-linear-gradient';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { checkIsPremiumUser } from './Useinterstitialad';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DEFAULT_CONTAINER_PAD = scale(6);
const DEFAULT_IMAGE_MARGIN = scale(2.3);
const DEFAULT_NUM_COLUMNS = 3;
const DEFAULT_IMAGE_WIDTH = Math.floor(
  (SCREEN_WIDTH - DEFAULT_CONTAINER_PAD * 2 - DEFAULT_IMAGE_MARGIN * 2 * DEFAULT_NUM_COLUMNS) / DEFAULT_NUM_COLUMNS
);

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ADMOB NATIVE ADVANCED AD UNIT CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 * Production Native Ad Unit ID:
 */
export const REAL_NATIVE_AD_UNIT_ID = 'ca-app-pub-7105708210867722/3242484197';

export const NATIVE_AD_UNIT_ID = __DEV__
  ? TestIds.NATIVE
  : REAL_NATIVE_AD_UNIT_ID;

export interface NativeAdCardProps {
  /**
   * 'tile': Blends directly into the wallpaper 3-column grid
   * 'feed': Full-width feed card (replaces standard banners between wallpaper chunks)
   * 'fullscreen': Immersive full-screen slide for FullImageScreen (shown every 8 images)
   */
  variant?: 'tile' | 'feed' | 'fullscreen';
  /** Custom width for pixel-perfect alignment in different grid screens */
  customWidth?: number;
  /** Custom height for pixel-perfect alignment in fullscreen screens */
  customHeight?: number;
  /** Custom margin matching wallpaper card margins */
  customMargin?: number;
  style?: StyleProp<ViewStyle>;
}

const NativeAdCard: React.FC<NativeAdCardProps> = ({
  variant = 'tile',
  customWidth,
  customHeight,
  customMargin,
  style,
}) => {
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const adRef = useRef<NativeAd | null>(null);

  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  // Safe clearance above native Android navigation buttons (Back, Home, Recents)
  // Ensures CTA button and swipe hints are comfortably positioned above any 3-button nav bar (~48-60dp)
  const bottomSafePadding = Math.max(insets.bottom || 0, scale(24)) + scale(75);

  const itemWidth = customWidth || DEFAULT_IMAGE_WIDTH;
  const itemMargin = customMargin !== undefined ? customMargin : DEFAULT_IMAGE_MARGIN;

  useEffect(() => {
    let isMounted = true;

    const initializeAd = async () => {
      try {
        const premium = await checkIsPremiumUser();
        if (!isMounted) return;

        if (premium) {
          setIsPremium(true);
          setLoading(false);
          return;
        }

        const ad = await NativeAd.createForAdRequest(NATIVE_AD_UNIT_ID, {
          aspectRatio:
            variant === 'feed'
              ? NativeMediaAspectRatio.LANDSCAPE
              : NativeMediaAspectRatio.PORTRAIT,
          adChoicesPlacement: NativeAdChoicesPlacement.TOP_RIGHT,
          startVideoMuted: true,
        });

        if (!isMounted) {
          ad.destroy();
          return;
        }

        adRef.current = ad;
        setNativeAd(ad);
        setLoading(false);
      } catch (err) {
        if (!isMounted) return;
        setError(true);
        setLoading(false);
      }
    };

    initializeAd();

    return () => {
      isMounted = false;
      if (adRef.current) {
        adRef.current.destroy();
        adRef.current = null;
      }
    };
  }, [variant]);

  // Premium users see zero ads
  if (isPremium) {
    return null;
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // VARIANT: FULLSCREEN (Immersive Slide in FullImageScreen every 8 wallpapers)
  // ═════════════════════════════════════════════════════════════════════════════
  if (variant === 'fullscreen') {
    if (loading) {
      return (
        <View style={[styles.fullscreenContainer, customHeight ? { height: customHeight } : null, style]}>
          <LinearGradient
            colors={['#101014', '#1A1A22', '#101014']}
            style={styles.fullscreenSkeleton}
          >
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.fullscreenSkeletonText}>Sponsored</Text>
          </LinearGradient>
        </View>
      );
    }

    if (error || !nativeAd) {
      return (
        <View style={[styles.fullscreenContainer, customHeight ? { height: customHeight } : null, style]}>
          <LinearGradient
            colors={['#161224', '#261838', '#120E1E']}
            style={[styles.fullscreenVipFill, { paddingBottom: bottomSafePadding }]}
          >
            <View style={styles.fullscreenVipContent}>
              <Text style={styles.fullscreenVipCrown}>👑</Text>
              <Text style={styles.fullscreenVipTitle}>WALLFLASH VIP PASS</Text>
              <Text style={styles.fullscreenVipSubtitle}>
                Unlock Unlimited 4K & Exclusive VIP Collections
              </Text>

              <Text style={[styles.fullscreenSwipeHint, { marginTop: scale(15) }]}>
                Swipe left to continue wallpapers ➔
              </Text>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Premium')}
                style={{ marginTop: scale(10) }}
              >
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.fullscreenVipCta}
                >
                  <Text style={styles.fullscreenVipCtaText}>UNLOCK VIP PASS</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      );
    }

    return (
      <View style={[styles.fullscreenContainer, customHeight ? { height: customHeight } : null, style]}>
        <NativeAdView nativeAd={nativeAd} style={styles.fullscreenAdView}>
          {/* Full background media view */}
          <NativeMediaView style={styles.fullscreenMedia} resizeMode="cover" />

          {/* Top gradient for status bar and badge readability */}
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.2)', 'transparent']}
            style={styles.fullscreenTopGradient}
            pointerEvents="none"
          />

          {/* Top Sponsored Badge placed on top-right so top-left back button is never obscured */}
          <View style={styles.fullscreenBadgeContainer}>
            <View style={styles.adBadge}>
              <Text style={styles.adBadgeText}>Ad</Text>
            </View>
            <Text style={styles.fullscreenSponsoredText}>SPONSORED PARTNER</Text>
          </View>

          {/* Bottom gradient overlay with headline, body, swipe hint, and CTA button */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.65)', 'rgba(0,0,0,0.92)', '#000000']}
            style={[styles.fullscreenBottomOverlay, { paddingBottom: bottomSafePadding }]}
          >
            <View style={styles.fullscreenHeaderRow}>
              {nativeAd.icon?.url ? (
                <NativeAsset assetType={NativeAssetType.ICON}>
                  <Image source={{ uri: nativeAd.icon.url }} style={styles.fullscreenIcon} />
                </NativeAsset>
              ) : null}

              <View style={styles.fullscreenTextCol}>
                <NativeAsset assetType={NativeAssetType.HEADLINE}>
                  <Text style={styles.fullscreenHeadline} numberOfLines={1}>
                    {nativeAd.headline}
                  </Text>
                </NativeAsset>

                <Text style={styles.fullscreenAdvertiser} numberOfLines={1}>
                  {nativeAd.advertiser || 'Featured Partner'}
                  {nativeAd.starRating ? ` • ⭐ ${nativeAd.starRating.toFixed(1)}` : ''}
                </Text>
              </View>
            </View>

            {nativeAd.body ? (
              <NativeAsset assetType={NativeAssetType.BODY}>
                <Text style={styles.fullscreenBody} numberOfLines={2}>
                  {nativeAd.body}
                </Text>
              </NativeAsset>
            ) : null}

            {/* Swipe hint sits above CTA button so CTA is closest to thumb */}
            <Text style={styles.fullscreenSwipeHint}>Swipe left to continue wallpapers ➔</Text>

            <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
              <LinearGradient
                colors={['#FFD700', '#FFC200', '#FFA000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.fullscreenCtaButton}
              >
                <Text style={styles.fullscreenCtaText}>
                  {nativeAd.callToAction ? nativeAd.callToAction.toUpperCase() : 'INSTALL NOW'}
                </Text>
              </LinearGradient>
            </NativeAsset>
          </LinearGradient>
        </NativeAdView>
      </View>
    );
  }


  // ═════════════════════════════════════════════════════════════════════════════
  // VARIANT: TILE (Wallpaper Grid Card)
  // ═════════════════════════════════════════════════════════════════════════════
  if (variant === 'tile') {
    if (loading) {
      return (
        <View
          style={[
            styles.tileCard,
            { width: itemWidth, margin: itemMargin },
            style,
          ]}
        >
          <LinearGradient
            colors={['#1c1c1e', '#2a2a2e', '#1c1c1e']}
            style={styles.skeletonFill}
          >
            <ActivityIndicator size="small" color="#FFD700" />
            <Text style={styles.skeletonText}>Ad</Text>
          </LinearGradient>
        </View>
      );
    }

    if (error || !nativeAd) {
      return (
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => navigation.navigate('Premium')}
          style={[
            styles.tileCard,
            { width: itemWidth, margin: itemMargin },
            style,
          ]}
        >
          <LinearGradient
            colors={['#1F1A24', '#2E1E3B', '#161224']}
            style={styles.vipTileFill}
          >
            <View style={styles.vipBadge}>
              <Text style={styles.vipBadgeText}>VIP</Text>
            </View>

            <View style={styles.vipContent}>
              <Text style={styles.vipCrown}>👑</Text>
              <Text style={styles.vipTitle}>WALLFLASH</Text>
              <Text style={styles.vipSubtitle}>PRO PASS</Text>
              <Text style={styles.vipDesc}>4K • VIP Pass</Text>
            </View>

            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.vipCta}
            >
              <Text style={styles.vipCtaText}>UNLOCK</Text>
            </LinearGradient>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    return (
      <View
        style={[
          styles.tileCard,
          { width: itemWidth, margin: itemMargin },
          style,
        ]}
      >
        <NativeAdView nativeAd={nativeAd} style={styles.tileAdView}>
          <NativeMediaView style={styles.tileMedia} resizeMode="cover" />

          <View style={styles.adBadge}>
            <Text style={styles.adBadgeText}>Ad</Text>
          </View>

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.88)', '#000000']}
            style={styles.tileBottomOverlay}
          >
            <View style={styles.tileHeaderRow}>
              {nativeAd.icon?.url ? (
                <NativeAsset assetType={NativeAssetType.ICON}>
                  <Image source={{ uri: nativeAd.icon.url }} style={styles.tileIcon} />
                </NativeAsset>
              ) : null}

              <NativeAsset assetType={NativeAssetType.HEADLINE}>
                <Text style={styles.tileHeadline} numberOfLines={2}>
                  {nativeAd.headline}
                </Text>
              </NativeAsset>
            </View>

            <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
              <View style={styles.tileCtaButton}>
                <Text style={styles.tileCtaText} numberOfLines={1}>
                  {nativeAd.callToAction || 'Install'}
                </Text>
              </View>
            </NativeAsset>
          </LinearGradient>
        </NativeAdView>
      </View>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // VARIANT: FEED (Replaces Standard Banners Between Wallpaper Chunks)
  // ═════════════════════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <View style={[styles.feedCard, style]}>
        <View style={styles.feedSkeleton}>
          <ActivityIndicator size="small" color="#FFD700" />
        </View>
      </View>
    );
  }

  if (error || !nativeAd) {
    return null;
  }

  return (
    <View style={[styles.feedCard, style]}>
      <NativeAdView nativeAd={nativeAd} style={styles.feedAdView}>
        <View style={styles.feedHeader}>
          {nativeAd.icon?.url ? (
            <NativeAsset assetType={NativeAssetType.ICON}>
              <Image source={{ uri: nativeAd.icon.url }} style={styles.feedIcon} />
            </NativeAsset>
          ) : null}

          <View style={styles.feedHeaderText}>
            <NativeAsset assetType={NativeAssetType.HEADLINE}>
              <Text style={styles.feedHeadline} numberOfLines={1}>
                {nativeAd.headline}
              </Text>
            </NativeAsset>

            <Text style={styles.feedAdvertiser} numberOfLines={1}>
              {nativeAd.advertiser || 'Sponsored'}
              {nativeAd.starRating ? ` • ⭐ ${nativeAd.starRating.toFixed(1)}` : ''}
            </Text>
          </View>

          <View style={styles.feedAdBadge}>
            <Text style={styles.feedAdBadgeText}>Ad</Text>
          </View>
        </View>

        <View style={styles.feedMediaWrapper}>
          <NativeMediaView style={styles.feedMedia} resizeMode="cover" />
        </View>

        {nativeAd.body ? (
          <NativeAsset assetType={NativeAssetType.BODY}>
            <Text style={styles.feedBody} numberOfLines={2}>
              {nativeAd.body}
            </Text>
          </NativeAsset>
        ) : null}

        <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
          <LinearGradient
            colors={['#FFD700', '#FFC200', '#FFA000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.feedCta}
          >
            <Text style={styles.feedCtaText}>
              {nativeAd.callToAction || 'Learn More'}
            </Text>
          </LinearGradient>
        </NativeAsset>
      </NativeAdView>
    </View>
  );
};

const styles = StyleSheet.create({
  // ─── FULLSCREEN MODE STYLES (FullImageScreen slide) ──────────────────────
  fullscreenContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  fullscreenAdView: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  fullscreenMedia: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  fullscreenTopGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: scale(110),
    zIndex: 2,
  },
  fullscreenBadgeContainer: {
    position: 'absolute',
    top: scale(22),
    right: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  fullscreenSponsoredText: {
    color: '#FFD700',
    fontSize: scale(10),
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: scale(6),
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  fullscreenBottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: scale(20),
    paddingTop: scale(36),
    zIndex: 5,
  },
  fullscreenHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  fullscreenIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(8),
    marginRight: scale(10),
  },
  fullscreenTextCol: {
    flex: 1,
  },
  fullscreenHeadline: {
    color: '#FFFFFF',
    fontSize: scale(15),
    fontWeight: '700',
    lineHeight: scale(19),
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 4,
  },
  fullscreenAdvertiser: {
    color: '#D0D0D0',
    fontSize: scale(11.5),
    marginTop: scale(2),
  },
  fullscreenBody: {
    color: '#E0E0E0',
    fontSize: scale(12),
    lineHeight: scale(16),
    marginBottom: scale(10),
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  fullscreenCtaButton: {
    borderRadius: scale(12),
    paddingVertical: scale(12.5),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: scale(4),
  },
  fullscreenCtaText: {
    color: '#000000',
    fontSize: scale(14),
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  fullscreenSwipeHint: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: scale(11),
    textAlign: 'center',
    marginBottom: scale(8),
    letterSpacing: 0.3,
  },
  fullscreenSkeleton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenSkeletonText: {
    color: '#888888',
    fontSize: scale(12),
    marginTop: scale(8),
  },
  fullscreenVipFill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(24),
  },
  fullscreenVipContent: {
    alignItems: 'center',
    width: '100%',
  },
  fullscreenVipCrown: {
    fontSize: scale(45),
    marginBottom: scale(10),
  },
  fullscreenVipTitle: {
    color: '#FFFFFF',
    fontSize: scale(18),
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  fullscreenVipSubtitle: {
    color: '#D0D0D0',
    fontSize: scale(12),
    textAlign: 'center',
    marginTop: scale(6),
    lineHeight: scale(17),
  },
  fullscreenVipCta: {
    borderRadius: scale(12),
    paddingVertical: scale(12),
    paddingHorizontal: scale(30),
    alignItems: 'center',
  },
  fullscreenVipCtaText: {
    color: '#000000',
    fontSize: scale(13),
    fontWeight: '800',
    letterSpacing: 0.6,
  },

  // ─── TILE MODE STYLES (Wallpaper grid card) ──────────────────────────────
  tileCard: {
    aspectRatio: 9 / 16,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#161616',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  tileAdView: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  tileMedia: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  adBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    paddingHorizontal: scale(5),
    paddingVertical: scale(2),
    borderRadius: scale(4),
    borderWidth: 0.6,
    borderColor: 'rgba(255, 215, 0, 0.6)',
  },
  adBadgeText: {
    color: '#FFD700',
    fontSize: scale(9),
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  tileBottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: scale(6),
    paddingBottom: scale(8),
    paddingTop: scale(20),
  },
  tileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  tileIcon: {
    width: scale(18),
    height: scale(18),
    borderRadius: scale(4),
    marginRight: scale(4),
  },
  tileHeadline: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: scale(9.5),
    fontWeight: '600',
    lineHeight: scale(12),
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tileCtaButton: {
    backgroundColor: '#FFD700',
    borderRadius: scale(6),
    paddingVertical: scale(4),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale(2),
  },
  tileCtaText: {
    color: '#000000',
    fontSize: scale(9.5),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  skeletonFill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonText: {
    color: '#777777',
    fontSize: scale(9),
    marginTop: scale(4),
    fontWeight: '500',
  },

  // ─── VIP FALLBACK TILE (If AdMob has no fill) ─────────────────────────────
  vipTileFill: {
    flex: 1,
    justifyContent: 'space-between',
    padding: scale(8),
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.35)',
    borderRadius: 15,
  },
  vipBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: scale(5),
    paddingVertical: scale(2),
    borderRadius: scale(4),
    borderWidth: 0.5,
    borderColor: '#FFD700',
  },
  vipBadgeText: {
    color: '#FFD700',
    fontSize: scale(8.5),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  vipContent: {
    alignItems: 'center',
    marginVertical: scale(6),
  },
  vipCrown: {
    fontSize: scale(22),
    marginBottom: scale(2),
  },
  vipTitle: {
    color: '#FFFFFF',
    fontSize: scale(10),
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  vipSubtitle: {
    color: '#FFD700',
    fontSize: scale(9),
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  vipDesc: {
    color: '#CCCCCC',
    fontSize: scale(8),
    marginTop: scale(2),
  },
  vipCta: {
    borderRadius: scale(6),
    paddingVertical: scale(4),
    alignItems: 'center',
  },
  vipCtaText: {
    color: '#000000',
    fontSize: scale(9.5),
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // ─── FEED MODE STYLES (Between Chunks) ────────────────────────────────────
  feedCard: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: scale(14),
    padding: scale(10),
    marginVertical: scale(8),
    borderWidth: 0.8,
    borderColor: 'rgba(255, 215, 0, 0.25)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  feedAdView: {
    width: '100%',
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  feedIcon: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(8),
    marginRight: scale(8),
  },
  feedHeaderText: {
    flex: 1,
    marginRight: scale(6),
  },
  feedHeadline: {
    color: '#FFFFFF',
    fontSize: scale(12.5),
    fontWeight: '700',
  },
  feedAdvertiser: {
    color: '#A0A0A0',
    fontSize: scale(10.5),
    marginTop: scale(1),
  },
  feedAdBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: scale(5),
    paddingVertical: scale(2),
    borderRadius: scale(4),
    borderWidth: 0.5,
    borderColor: '#FFD700',
  },
  feedAdBadgeText: {
    color: '#FFD700',
    fontSize: scale(8.5),
    fontWeight: '700',
  },
  feedMediaWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: scale(10),
    overflow: 'hidden',
    backgroundColor: '#121212',
    marginVertical: scale(6),
  },
  feedMedia: {
    width: '100%',
    height: '100%',
  },
  feedBody: {
    color: '#CCCCCC',
    fontSize: scale(10.5),
    lineHeight: scale(14),
    marginBottom: scale(8),
  },
  feedCta: {
    borderRadius: scale(8),
    paddingVertical: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedCtaText: {
    color: '#000000',
    fontSize: scale(12),
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  feedSkeleton: {
    height: scale(120),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NativeAdCard;
