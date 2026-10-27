// ─────────────────────────────────────────────────────────────────────────────
//  AppOpenAdManager.ts
//
//  Production Google AdMob App Open Ad Manager for WallFlash
//  Features:
//  • Cold start ad display (after splash screen hides)
//  • App background -> foreground resume ad display
//  • Configurable cooldown (Default: 4 hours) to prevent user annoyance
//  • Premium / VIP user bypass (checks AsyncStorage and temp rewards)
//  • Automatic preloading and 4-hour AdMob ad expiration handling
// ─────────────────────────────────────────────────────────────────────────────

import { AppState, AppStateStatus } from "react-native";
import { AppOpenAd, TestIds, AdEventType } from "react-native-google-mobile-ads";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkIsPremiumUser } from "./Useinterstitialad";

/**
 * ⚠️ REPLACE THIS ID with your AdMob App Open Ad Unit ID from your AdMob Console!
 * 
 * Example production format: "ca-app-pub-7105708210867722/XXXXXXXXXX"
 * 
 * In development (__DEV__ === true), it automatically uses Google's official Test ID 
 * so you can test safely without policy violations.
 */
export const APP_OPEN_AD_UNIT_ID = __DEV__
  ? TestIds.APP_OPEN
  : "ca-app-pub-7105708210867722/7445538800";

const STORAGE_KEY_LAST_APP_OPEN_TIME = "@wallflash_last_app_open_ad_time";

// Cooldown between App Open ads: 30 Minutes (1,800,000 ms) for high ARPU
export const APP_OPEN_COOLDOWN_MS = 30 * 60 * 1000;

// Google AdMob App Open ads expire after 4 hours from load time
const AD_EXPIRY_MS = 3.9 * 60 * 60 * 1000;

class AppOpenAdService {
  private appOpenAd: AppOpenAd | null = null;
  private isLoaded: boolean = false;
  private isLoading: boolean = false;
  private isShowingAd: boolean = false;
  private adLoadedTimestamp: number = 0;
  private appStateSubscription: any = null;
  private isInitialized: boolean = false;

  /**
   * Initialize the App Open Ad Manager
   * Listens to background -> foreground transitions and preloads the first ad.
   */
  public init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Preload the first ad immediately
    this.preloadAd();

    // Listen to AppState changes (e.g. user returns to the app from background)
    let currentAppState: AppStateStatus = AppState.currentState;

    this.appStateSubscription = AppState.addEventListener(
      "change",
      async (nextAppState: AppStateStatus) => {
        // App transitioning from background/inactive to active (foreground)
        if (
          currentAppState.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          console.log("[AppOpenAd] App resumed from background. Checking eligibility...");
          await this.tryShowResumeAd();
        }
        currentAppState = nextAppState;
      }
    );
  }

  /**
   * Preloads an App Open ad in the background
   */
  public preloadAd() {
    if (this.isLoading || this.isShowingAd) return;

    // If we already have a fresh loaded ad that hasn't expired, keep it
    if (this.isLoaded && Date.now() - this.adLoadedTimestamp < AD_EXPIRY_MS) {
      return;
    }

    this.isLoading = true;
    this.isLoaded = false;

    try {
      this.appOpenAd = AppOpenAd.createForAdRequest(APP_OPEN_AD_UNIT_ID, {
        requestNonPersonalizedAdsOnly: false,
      });

      this.appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
        console.log("[AppOpenAd] Ad loaded successfully and ready.");
        this.isLoaded = true;
        this.isLoading = false;
        this.adLoadedTimestamp = Date.now();
      });

      this.appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log("[AppOpenAd] Ad closed by user.");
        this.isShowingAd = false;
        this.isLoaded = false;
        this.recordAdShownTime();
        // Immediately preload the next ad for future resume
        this.preloadAd();
      });

      this.appOpenAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.warn("[AppOpenAd] Failed to load ad:", error);
        this.isLoaded = false;
        this.isLoading = false;
        this.isShowingAd = false;
      });

      this.appOpenAd.load();
    } catch (err) {
      console.warn("[AppOpenAd] Error creating ad request:", err);
      this.isLoading = false;
    }
  }

  /**
   * Check if enough time has passed since the last App Open ad was shown
   */
  public async hasCooldownElapsed(): Promise<boolean> {
    try {
      const lastShown = await AsyncStorage.getItem(STORAGE_KEY_LAST_APP_OPEN_TIME);
      if (!lastShown) return true;
      const elapsed = Date.now() - Number(lastShown);
      return elapsed >= APP_OPEN_COOLDOWN_MS;
    } catch {
      return true;
    }
  }

  /**
   * Saves the timestamp of when an App Open ad was displayed
   */
  private async recordAdShownTime() {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_LAST_APP_OPEN_TIME,
        Date.now().toString()
      );
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * Shows an App Open ad on cold start (after splash screen hides)
   */
  public async tryShowColdStartAd(): Promise<boolean> {
    const isPremium = await checkIsPremiumUser();
    if (isPremium) {
      console.log("[AppOpenAd] User is premium. Skipping App Open Ad.");
      return false;
    }

    const cooldownPassed = await this.hasCooldownElapsed();
    if (!cooldownPassed) {
      console.log("[AppOpenAd] Cooldown (4h) has not elapsed yet. Skipping cold start ad.");
      return false;
    }

    return this.showAd();
  }

  /**
   * Shows an App Open ad when resuming from background
   */
  public async tryShowResumeAd(): Promise<boolean> {
    const isPremium = await checkIsPremiumUser();
    if (isPremium) return false;

    const cooldownPassed = await this.hasCooldownElapsed();
    if (!cooldownPassed) return false;

    return this.showAd();
  }

  /**
   * Core display logic
   */
  public async showAd(): Promise<boolean> {
    if (this.isShowingAd) return false;

    // Check if loaded ad is expired (Google requires ads older than 4h to be discarded)
    if (this.isLoaded && Date.now() - this.adLoadedTimestamp >= AD_EXPIRY_MS) {
      console.log("[AppOpenAd] Loaded ad expired (>4h). Reloading fresh ad...");
      this.isLoaded = false;
      this.preloadAd();
      return false;
    }

    if (this.appOpenAd && this.isLoaded) {
      try {
        this.isShowingAd = true;
        await this.appOpenAd.show();
        return true;
      } catch (err) {
        console.warn("[AppOpenAd] Error showing ad:", err);
        this.isShowingAd = false;
        this.preloadAd();
        return false;
      }
    } else {
      console.log("[AppOpenAd] Ad not loaded yet. Requesting load...");
      this.preloadAd();
      return false;
    }
  }

  /**
   * Clean up listeners if app unmounts
   */
  public destroy() {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
    this.isInitialized = false;
  }
}

export const AppOpenAdManager = new AppOpenAdService();
export default AppOpenAdManager;
