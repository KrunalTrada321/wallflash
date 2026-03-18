// ─────────────────────────────────────────────────────────────────────────────
//  useInterstitialAd.ts
//
//  A reusable hook for Google AdMob interstitial ads.
//  Works across any screen or game component.
//
//  Usage:
//    const { showAd } = useInterstitialAd();
//    showAd(() => navigation.navigate('NextScreen'));  // callback runs after ad closes (or if no ad)
//
//  Dependencies:
//    npm install react-native-google-mobile-ads
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useCallback } from "react";
import {
  InterstitialAd,
  AdEventType,
  TestIds, 
} from "react-native-google-mobile-ads";

// ─── Ad Unit ID — swap __DEV__ for production builds automatically ────────────
const AD_UNIT_ID = "ca-app-pub-7105708210867722/2085051949";   // ← your Android production ID

// ─── Types ────────────────────────────────────────────────────────────────────
interface UseInterstitialAdReturn {
  /** Call this when you want to show the ad (e.g. on level complete).
   *  `onAdDismissed` runs after the ad closes OR immediately if no ad is ready. */
  showAd: (onAdDismissed?: () => void) => void;
  /** Whether an ad is currently loaded and ready to show. */
  isAdLoaded: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useInterstitialAd(): UseInterstitialAdReturn {
  const interstitialRef = useRef<InterstitialAd | null>(null);
  const isAdLoadedRef = useRef(false);
  const pendingCallbackRef = useRef<(() => void) | null>(null);

  // ── Load (or reload) an ad ──────────────────────────────────────────────────
  const loadAd = useCallback(() => {
    const ad = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    ad.addAdEventListener(AdEventType.LOADED, () => {
      isAdLoadedRef.current = true;
    });

    ad.addAdEventListener(AdEventType.ERROR, () => {
      isAdLoadedRef.current = false;
      // On error, run any pending callback so the user isn't stuck
      pendingCallbackRef.current?.();
      pendingCallbackRef.current = null;
    });

    ad.addAdEventListener(AdEventType.CLOSED, () => {
      isAdLoadedRef.current = false;
      pendingCallbackRef.current?.();
      pendingCallbackRef.current = null;
      loadAd(); // Preload the next ad immediately
    });

    ad.load();
    interstitialRef.current = ad;
  }, []);

  // ── Mount / unmount ─────────────────────────────────────────────────────────
  useEffect(() => {
    loadAd();
    return () => {
      pendingCallbackRef.current = null;
      interstitialRef.current = null;
    };
  }, [loadAd]);

  // ── Public API ──────────────────────────────────────────────────────────────
  const showAd = useCallback((onAdDismissed?: () => void) => {
    pendingCallbackRef.current = onAdDismissed ?? null;

    if (isAdLoadedRef.current && interstitialRef.current) {
      interstitialRef.current.show();
    } else {
      // Ad not ready — run the callback immediately so the flow isn't blocked
      pendingCallbackRef.current?.();
      pendingCallbackRef.current = null;
    }
  }, []);

  return {
    showAd,
    get isAdLoaded() {
      return isAdLoadedRef.current;
    },
  };
}