import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  UNLOCKED_LEVEL: '@zombie_attack_unlocked_level',
  CURRENT_LEVEL: '@zombie_attack_current_level',
  STARS: '@zombie_attack_stars',
  SCORES: '@zombie_attack_scores',
  COINS: '@zombie_attack_coins',
  SOUND_ENABLED: '@zombie_attack_sound_enabled',
  MUSIC_ENABLED: '@zombie_attack_music_enabled',
  HAPTICS_ENABLED: '@zombie_attack_haptics_enabled',
};

export interface ZombieGameProgress {
  unlockedLevel: number;
  currentLevel: number;
  stars: Record<number, number>;
  scores: Record<number, number>;
  coins: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
}

export const ZombieStorageService = {
  async getProgress(): Promise<ZombieGameProgress> {
    try {
      const [unlocked, currentStr, starsStr, scoresStr, coinsStr, soundStr, musicStr, hapticsStr] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVEL),
          AsyncStorage.getItem(STORAGE_KEYS.CURRENT_LEVEL),
          AsyncStorage.getItem(STORAGE_KEYS.STARS),
          AsyncStorage.getItem(STORAGE_KEYS.SCORES),
          AsyncStorage.getItem(STORAGE_KEYS.COINS),
          AsyncStorage.getItem(STORAGE_KEYS.SOUND_ENABLED),
          AsyncStorage.getItem(STORAGE_KEYS.MUSIC_ENABLED),
          AsyncStorage.getItem(STORAGE_KEYS.HAPTICS_ENABLED),
        ]);

      const parsedUnlocked = unlocked ? Math.max(1, parseInt(unlocked, 10)) : 1;
      const parsedCurrent = currentStr
        ? Math.max(1, parseInt(currentStr, 10))
        : parsedUnlocked;

      return {
        unlockedLevel: parsedUnlocked,
        currentLevel: Math.min(50, Math.max(1, parsedCurrent)),
        stars: starsStr ? JSON.parse(starsStr) : {},
        scores: scoresStr ? JSON.parse(scoresStr) : {},
        coins: coinsStr ? parseInt(coinsStr, 10) : 0,
        soundEnabled: soundStr !== null ? soundStr === 'true' : true,
        musicEnabled: musicStr !== null ? musicStr === 'true' : true,
        hapticsEnabled: hapticsStr !== null ? hapticsStr === 'true' : true,
      };
    } catch (e) {
      console.warn('[ZombieStorage] Failed to read progress:', e);
      return {
        unlockedLevel: 1,
        currentLevel: 1,
        stars: {},
        scores: {},
        coins: 0,
        soundEnabled: true,
        musicEnabled: true,
        hapticsEnabled: true,
      };
    }
  },

  async setCurrentLevel(levelId: number): Promise<void> {
    try {
      const bounded = Math.min(50, Math.max(1, levelId));
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_LEVEL, bounded.toString());
    } catch (e) {
      console.warn('[ZombieStorage] Failed to save current level:', e);
    }
  },

  async saveLevelWin(
    levelId: number,
    stars: number,
    score: number,
    coinsEarned: number
  ): Promise<{ newUnlockedLevel: number; totalCoins: number }> {
    try {
      const progress = await this.getProgress();

      const nextLevel = Math.max(progress.unlockedLevel, Math.min(50, levelId + 1));
      const currentStars = progress.stars[levelId] || 0;
      const bestStars = Math.max(currentStars, stars);
      const currentScore = progress.scores[levelId] || 0;
      const bestScore = Math.max(currentScore, score);
      const totalCoins = (progress.coins || 0) + coinsEarned;

      const updatedStars = { ...progress.stars, [levelId]: bestStars };
      const updatedScores = { ...progress.scores, [levelId]: bestScore };

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVEL, nextLevel.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.CURRENT_LEVEL, nextLevel.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.STARS, JSON.stringify(updatedStars)),
        AsyncStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(updatedScores)),
        AsyncStorage.setItem(STORAGE_KEYS.COINS, totalCoins.toString()),
      ]);

      return { newUnlockedLevel: nextLevel, totalCoins };
    } catch (e) {
      console.warn('[ZombieStorage] Failed to save level win:', e);
      return { newUnlockedLevel: levelId + 1, totalCoins: 0 };
    }
  },

  async setSoundSetting(key: 'sound' | 'music' | 'haptics', enabled: boolean) {
    try {
      if (key === 'sound') {
        await AsyncStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, enabled.toString());
      } else if (key === 'music') {
        await AsyncStorage.setItem(STORAGE_KEYS.MUSIC_ENABLED, enabled.toString());
      } else if (key === 'haptics') {
        await AsyncStorage.setItem(STORAGE_KEYS.HAPTICS_ENABLED, enabled.toString());
      }
    } catch (e) {
      console.warn('[ZombieStorage] Failed to save setting:', e);
    }
  },
};
