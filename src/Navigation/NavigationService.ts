// NavigationService.ts
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

export function navigateToLastTab() {
  if (navigationRef.isReady()) {
    // Navigate to the last tab of your bottom tabs
    navigationRef.navigate('WallFlash', {
      screen: 'Premium', // last tab name
    });
  }
}

/**
 * Handles deep-link navigation when a push notification is tapped.
 * Supported target screen names (case-insensitive):
 * - "gamescreen" | "games"
 * - "imagesscreen" | "images" | "home"
 * - "trendingscreen" | "trending"
 * - "categoriesscreen" | "categories"
 * - "premiumscreen" | "premium"
 */
export function navigateFromNotification(screenInput?: string, params?: any) {
  if (!screenInput) return;

  const normalized = screenInput.trim().toLowerCase();

  const doNavigate = () => {
    if (!navigationRef.isReady()) {
      setTimeout(doNavigate, 250);
      return;
    }

    try {
      if (normalized === 'gamescreen' || normalized === 'games' || normalized === 'game') {
        navigationRef.navigate('WallFlash', { screen: 'Games' });
      } else if (
        normalized === 'imagesscreen' ||
        normalized === 'images' ||
        normalized === 'image' ||
        normalized === 'home' ||
        normalized === 'homescreen'
      ) {
        navigationRef.navigate('WallFlash', { screen: 'Home' });
      } else if (normalized === 'trendingscreen' || normalized === 'trending') {
        navigationRef.navigate('WallFlash', { screen: 'Trending' });
      } else if (
        normalized === 'categoriesscreen' ||
        normalized === 'categories' ||
        normalized === 'category'
      ) {
        navigationRef.navigate('WallFlash', { screen: 'Categories' });
      } else if (
        normalized === 'premiumscreen' ||
        normalized === 'premium' ||
        normalized === 'prime' ||
        normalized === 'primescreen'
      ) {
        navigationRef.navigate('WallFlash', { screen: 'Premium' });
      } else {
        // Fallback: direct navigation to Stack screen (e.g. ZombieAttack, FullImageScreen, etc.)
        navigationRef.navigate(screenInput, params);
      }
    } catch (err) {
      console.log('⚠️ Error navigating from notification:', err);
    }
  };

  doNavigate();
}
