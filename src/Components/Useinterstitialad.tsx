// ─────────────────────────────────────────────────────────────────────────────
//  Useinterstitialad.tsx
//
//  A reusable hook for Google AdMob interstitial ads with intelligent
//  natural pacing & low disturbance frequency capping for mobile games.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useCallback } from "react";
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TEMP_PREMIUM_KEY } from "./RewardedPremiumAd";

const AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-7105708210867722/2085051949";

// Global tracking to pace interstitial ads across level transitions and between games
let globalLastAdTimestamp = 0;
let globalTransitionCount = 0;

export const checkIsPremiumUser = async (): Promise<boolean> => {
  try {
    const purchased = await AsyncStorage.getItem("isPremiumPurchased");
    if (purchased === "true") return true;

    const tempExpiry = await AsyncStorage.getItem(TEMP_PREMIUM_KEY);
    if (tempExpiry && Date.now() < Number(tempExpiry)) return true;

    return false;
  } catch {
    return false;
  }
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface UseGameInterstitialAdOptions {
  /** Minimum number of transitions (e.g. level completes, retries) before an ad can trigger. Default: 3 */
  transitionInterval?: number;
  /** Minimum cooldown in seconds between interstitial ads. Default: 80 seconds */
  cooldownSeconds?: number;
}

export interface UseGameInterstitialAdReturn {
  /**
   * Intelligently shows an interstitial ad between game transitions (levels, retries).
   * Respects user experience with natural frequency capping:
   * - Requires at least `transitionInterval` completed actions (default 3)
   * - Enforces at least `cooldownSeconds` (default 80s)
   * - Bypasses completely if user is premium
   * - Preloads next ad seamlessly
   * - Runs `onDismiss` immediately if ad is skipped, dismissed, or fails
   */
  showNaturalAd: (onDismiss?: () => void) => void;
  /** Force show ad without checking interval counter (still respects premium) */
  showAd: (onDismiss?: () => void) => void;
  /** Whether an ad is currently loaded and ready to show. */
  isAdLoaded: boolean;
}

// ─── Game Interstitial Hook with Natural Low-Disturbance Pacing ───────────────
export function useGameInterstitialAd(options?: UseGameInterstitialAdOptions): UseGameInterstitialAdReturn {
  const transitionInterval = options?.transitionInterval ?? 3;
  const cooldownSeconds = options?.cooldownSeconds ?? 80;

  const interstitialRef = useRef<InterstitialAd | null>(null);
  const isAdLoadedRef = useRef(false);
  const pendingCallbackRef = useRef<(() => void) | null>(null);

  // ── Load (or reload) an ad ──────────────────────────────────────────────────
  const loadAd = useCallback(() => {
    try {
      const ad = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
        requestNonPersonalizedAdsOnly: true,
      });

      ad.addAdEventListener(AdEventType.LOADED, () => {
        isAdLoadedRef.current = true;
      });

      ad.addAdEventListener(AdEventType.ERROR, () => {
        isAdLoadedRef.current = false;
        pendingCallbackRef.current?.();
        pendingCallbackRef.current = null;
      });

      ad.addAdEventListener(AdEventType.CLOSED, () => {
        isAdLoadedRef.current = false;
        pendingCallbackRef.current?.();
        pendingCallbackRef.current = null;
        loadAd(); // Preload next ad immediately
      });

      ad.load();
      interstitialRef.current = ad;
    } catch {
      isAdLoadedRef.current = false;
    }
  }, []);

  // ── Mount / unmount ─────────────────────────────────────────────────────────
  useEffect(() => {
    loadAd();
    return () => {
      pendingCallbackRef.current = null;
      interstitialRef.current = null;
    };
  }, [loadAd]);

  // ── Show Ad with Natural Frequency Capping & Low Disturbance ────────────────
  const showNaturalAd = useCallback(
    async (onDismiss?: () => void) => {
      // 1. Premium users are 100% ad-free
      const isPremium = await checkIsPremiumUser();
      if (isPremium) {
        onDismiss?.();
        return;
      }

      globalTransitionCount++;
      const now = Date.now();
      const timeSinceLastAd = now - globalLastAdTimestamp;
      const cooldownMs = cooldownSeconds * 1000;

      // Natural Pacing & Less Disturbance criteria:
      // At least 3 transitions (levels/retries) AND at least cooldownSeconds (80s)
      const shouldTrigger =
        globalTransitionCount >= transitionInterval &&
        timeSinceLastAd >= cooldownMs &&
        isAdLoadedRef.current &&
        interstitialRef.current;

      if (shouldTrigger) {
        globalTransitionCount = 0;
        globalLastAdTimestamp = now;
        pendingCallbackRef.current = onDismiss ?? null;
        try {
          interstitialRef.current!.show();
        } catch {
          pendingCallbackRef.current?.();
          pendingCallbackRef.current = null;
        }
      } else {
        // Less disturbance: seamlessly continue game with zero delay
        onDismiss?.();
      }
    },
    [transitionInterval, cooldownSeconds]
  );

  const showAd = useCallback(
    async (onDismiss?: () => void) => {
      const isPremium = await checkIsPremiumUser();
      if (isPremium) {
        onDismiss?.();
        return;
      }

      pendingCallbackRef.current = onDismiss ?? null;
      if (isAdLoadedRef.current && interstitialRef.current) {
        globalLastAdTimestamp = Date.now();
        try {
          interstitialRef.current.show();
        } catch {
          pendingCallbackRef.current?.();
          pendingCallbackRef.current = null;
        }
      } else {
        pendingCallbackRef.current?.();
        pendingCallbackRef.current = null;
      }
    },
    []
  );

  return {
    showNaturalAd,
    showAd,
    get isAdLoaded() {
      return isAdLoadedRef.current;
    },
  };
}

// ─── Legacy Generic Hook (Backward Compatible) ────────────────────────────────
export function useInterstitialAd() {
  return useGameInterstitialAd();
}
export default useGameInterstitialAd;