// Components/GameBannerAd.js
//
// Usage:
//   <GameBannerAd />                          ← adaptive, sticks to bottom, default height
//   <GameBannerAd size="banner" />            ← 320×50
//   <GameBannerAd size="large" />             ← 320×100
//   <GameBannerAd size="medium" />            ← 300×250
//   <GameBannerAd bottom />                   ← pushes to screen bottom
//   <GameBannerAd bottom size="banner" />     ← small strip pinned at bottom
//   <GameBannerAd height={60} />              ← force exact container height
//   <GameBannerAd size="medium" height={260} /> ← constrain medium rect

import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { scale } from "react-native-size-matters";

const AD_UNIT_ID = "ca-app-pub-7105708210867722/8647662693";

// ── Default safe heights per size (dp) ────────────────────────────────────────
//  These are the standard IAB ad heights. Keeping the container at exactly
//  these values prevents the ad from ever overflowing — no policy risk.
const DEFAULT_HEIGHTS = {
  adaptive : scale(60),   // ANCHORED_ADAPTIVE_BANNER  ~50–60dp
  inline   : scale(60),   // INLINE_ADAPTIVE_BANNER    use explicit height prop if needed
  banner   : scale(50),   // classic 320×50
  large    : scale(100),  // 320×100
  medium   : scale(250),  // 300×250
};

const SIZE_MAP = {
  adaptive : BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
  inline   : BannerAdSize.INLINE_ADAPTIVE_BANNER,
  banner   : BannerAdSize.BANNER,
  large    : BannerAdSize.LARGE_BANNER,
  medium   : BannerAdSize.MEDIUM_RECTANGLE,
};

export default function GameBannerAd({
  size   = "adaptive",
  bottom = false,
  height,           // optional override — pass a number (dp) to force exact height
  style,
}) {
  const bannerRef = useRef(null);
  const adSize    = SIZE_MAP[size] ?? BannerAdSize.ANCHORED_ADAPTIVE_BANNER;

  // Use explicit height prop if given, otherwise fall back to safe default
  const containerHeight = height ?? DEFAULT_HEIGHTS[size] ?? scale(60);

  return (
    <View style={[styles.wrapper, bottom && styles.bottom, style]}>
      <View style={styles.divider} />

      {/* overflow:hidden clips any ad content that exceeds the container.
          This is allowed by Google policy — you may clip, but not scale/distort. */}
      <View style={[styles.adClip, { height: containerHeight }]}>
        <BannerAd
          ref={bannerRef}
          unitId={AD_UNIT_ID}
          size={adSize}
          requestOptions={{ requestNonPersonalizedAdsOnly: false }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#0d0118",
  },
  bottom: {
    marginTop: "auto",
  },
  divider: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ffffff12",
    marginBottom: scale(2),
  },
  adClip: {
    width: "100%",
    alignItems: "center",
    overflow: "hidden",   // ← clips the ad to the container height
  },
});