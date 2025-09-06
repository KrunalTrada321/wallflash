// NavigationService.ts
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigateToLastTab() {
  if (navigationRef.isReady()) {
    // Navigate to the last tab of your bottom tabs
    navigationRef.navigate('WallFlash', {
      screen: 'Premium', // last tab name
    });
  }
}
