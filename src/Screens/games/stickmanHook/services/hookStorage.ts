// ─────────────────────────────────────────────────────────────────────────────
//  hookStorage.ts
//  AsyncStorage Service for Stickman Hook: Swing Hero
// ─────────────────────────────────────────────────────────────────────────────

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_UNLOCKED_LEVEL = '@stickman_hook_unlocked_level';
const KEY_SELECTED_SKIN = '@stickman_hook_selected_skin';
const KEY_UNLOCKED_SKINS = '@stickman_hook_unlocked_skins';
const KEY_STARS_PREFIX = '@stickman_hook_stars_';
const KEY_BEST_TIME_PREFIX = '@stickman_hook_time_';

export const HookStorage = {
  async getUnlockedLevel(): Promise<number> {
    try {
      const val = await AsyncStorage.getItem(KEY_UNLOCKED_LEVEL);
      return val ? Math.max(1, parseInt(val, 10)) : 1;
    } catch {
      return 1;
    }
  },

  async setUnlockedLevel(lvl: number): Promise<void> {
    try {
      const current = await this.getUnlockedLevel();
      if (lvl > current) {
        await AsyncStorage.setItem(KEY_UNLOCKED_LEVEL, lvl.toString());
      }
    } catch (e) {
      console.warn('[HookStorage] setUnlockedLevel error:', e);
    }
  },

  async getLevelStars(levelId: number): Promise<number> {
    try {
      const val = await AsyncStorage.getItem(`${KEY_STARS_PREFIX}${levelId}`);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  },

  async setLevelStars(levelId: number, stars: number): Promise<void> {
    try {
      const current = await this.getLevelStars(levelId);
      if (stars > current) {
        await AsyncStorage.setItem(`${KEY_STARS_PREFIX}${levelId}`, stars.toString());
      }
    } catch (e) {
      console.warn('[HookStorage] setLevelStars error:', e);
    }
  },

  async getAllStars(totalLevels: number = 50): Promise<Record<number, number>> {
    const result: Record<number, number> = {};
    try {
      const keys = Array.from({ length: totalLevels }, (_, i) => `${KEY_STARS_PREFIX}${i + 1}`);
      const pairs = await AsyncStorage.multiGet(keys);
      pairs.forEach(([key, val]) => {
        const id = parseInt(key.replace(KEY_STARS_PREFIX, ''), 10);
        result[id] = val ? parseInt(val, 10) : 0;
      });
    } catch {
      // fallback
    }
    return result;
  },

  async getTotalStarsCount(totalLevels: number = 50): Promise<number> {
    const starsMap = await this.getAllStars(totalLevels);
    return Object.values(starsMap).reduce((sum, s) => sum + s, 0);
  },

  async getSelectedSkin(): Promise<string> {
    try {
      const val = await AsyncStorage.getItem(KEY_SELECTED_SKIN);
      return val || 'classic_red';
    } catch {
      return 'classic_red';
    }
  },

  async setSelectedSkin(skinId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEY_SELECTED_SKIN, skinId);
    } catch (e) {
      console.warn('[HookStorage] setSelectedSkin error:', e);
    }
  },

  async getUnlockedSkins(): Promise<string[]> {
    try {
      const val = await AsyncStorage.getItem(KEY_UNLOCKED_SKINS);
      if (val) {
        const list = JSON.parse(val);
        if (Array.isArray(list) && list.includes('classic_red')) return list;
        return ['classic_red', ...list];
      }
    } catch {
      // fallback
    }
    return ['classic_red'];
  },

  async unlockSkin(skinId: string): Promise<string[]> {
    try {
      const current = await this.getUnlockedSkins();
      if (!current.includes(skinId)) {
        const updated = [...current, skinId];
        await AsyncStorage.setItem(KEY_UNLOCKED_SKINS, JSON.stringify(updated));
        return updated;
      }
      return current;
    } catch {
      return ['classic_red'];
    }
  },

  async getBestTime(levelId: number): Promise<number | null> {
    try {
      const val = await AsyncStorage.getItem(`${KEY_BEST_TIME_PREFIX}${levelId}`);
      return val ? parseFloat(val) : null;
    } catch {
      return null;
    }
  },

  async setBestTime(levelId: number, timeSec: number): Promise<void> {
    try {
      const prev = await this.getBestTime(levelId);
      if (prev === null || timeSec < prev) {
        await AsyncStorage.setItem(`${KEY_BEST_TIME_PREFIX}${levelId}`, timeSec.toFixed(2));
      }
    } catch (e) {
      console.warn('[HookStorage] setBestTime error:', e);
    }
  },
};

export default HookStorage;

