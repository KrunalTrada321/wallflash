import { NativeModules, Platform, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { SoundModule } = NativeModules;
const SOUND_STORAGE_KEY = '@twinsconnect_sound_enabled';

class SoundEffectsService {
  private muted: boolean = false;
  private listeners: Set<(muted: boolean) => void> = new Set();
  private isInitialized: boolean = false;

  constructor() {
    this.init();
  }

  public async init() {
    if (this.isInitialized) return;
    try {
      const stored = await AsyncStorage.getItem(SOUND_STORAGE_KEY);
      if (stored !== null) {
        this.muted = stored === 'false';
      } else {
        this.muted = false; // Enabled by default
      }
      this.syncNativeMute();
      this.isInitialized = true;
    } catch {
      this.muted = false;
    }
  }

  private syncNativeMute() {
    if (SoundModule?.setMuted) {
      try {
        SoundModule.setMuted(this.muted);
      } catch (err) {
        console.warn('[SoundEffects] syncNativeMute error:', err);
      }
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public async setMuted(muted: boolean) {
    this.muted = muted;
    this.syncNativeMute();
    try {
      await AsyncStorage.setItem(SOUND_STORAGE_KEY, (!muted).toString());
    } catch (err) {
      console.warn('[SoundEffects] setMuted storage error:', err);
    }
    this.listeners.forEach(cb => cb(this.muted));
  }

  public async toggleMute(): Promise<boolean> {
    const next = !this.muted;
    await this.setMuted(next);
    return next;
  }

  public subscribe(listener: (muted: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.muted);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // --- Sound Effects ---

  /**
   * Played when the player touches an endpoint or existing path to start drawing.
   */
  public playTap() {
    if (this.muted) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('tap', 1.0, 0.7);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate(10);
      }
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * Played when the path moves into a new cell.
   * Pitch gently ascends with the step count to provide musical feedback!
   */
  public playStep(stepIndex: number = 0) {
    if (this.muted) return;
    try {
      // Dynamic pitch: rises from 1.0 up to 1.7
      const rate = Math.min(1.7, 1.0 + (stepIndex % 14) * 0.05);
      if (SoundModule?.playSound) {
        SoundModule.playSound('step', rate, 0.6);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate(8);
      }
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * Played when the player successfully connects two matching endpoints.
   */
  public playConnect() {
    if (this.muted) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('connect', 1.0, 1.0);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate(30);
      }
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * Played when an existing line is severed/cut by overlapping.
   */
  public playCut() {
    if (this.muted) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('cut', 1.0, 0.6);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate(15);
      }
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * Played when all endpoints are connected but the board still has unfilled spaces.
   */
  public playIncomplete() {
    if (this.muted) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('incomplete', 1.0, 0.8);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate([0, 30, 40, 30]);
      }
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * Played when the level is completely filled and solved (Victory!).
   */
  public playWin() {
    if (this.muted) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('win', 1.0, 1.0);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate([0, 50, 60, 100]);
      }
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * Played when the board is reset.
   */
  public playReset() {
    if (this.muted) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('reset', 1.0, 0.7);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate(15);
      }
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * Played when clicking "Set Wallpaper" button or menu.
   */
  public playClick() {
    if (this.muted) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('click', 1.0, 0.8);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate(12);
      }
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * Played when an image or video finishes downloading successfully.
   */
  public playDownloadSuccess() {
    if (this.muted) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('download', 1.0, 0.95);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate([0, 30, 40, 60]);
      }
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * Played when wallpaper is applied/set successfully to homescreen, lockscreen, or both.
   */
  public playSetWallpaperSuccess() {
    if (this.muted) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('set_success', 1.0, 1.0);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate([0, 40, 50, 90]);
      }
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * Played when user likes or favorites a wallpaper.
   */
  public playLike() {
    if (this.muted) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('like', 1.0, 0.9);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate(25);
      }
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * Played when an enemy is defeated via headshot.
   * Plays man voice saying "Headshot" with heavy impact vibration.
   */
  public playHeadshotVoice() {
    if (this.muted) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('headshot', 1.0, 1.0);
      }
      if (SoundModule?.speak) {
        SoundModule.speak('Headshot');
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate([0, 30, 25, 60]);
      }
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * Played when premium is unlocked via IAP purchase or rewarded ad.
   */
  public playPremiumUnlocked() {
    if (this.muted) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('premium', 1.0, 1.0);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate([0, 50, 60, 120]);
      }
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * Played when orbs merge in Celestial Fusion.
   * Dynamic pitch gives higher or lower cosmic resonance depending on the tier!
   */
  public playCelestialMerge(pitch: number = 1.0, hapticMs: number = 20) {
    if (this.muted) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('connect', Math.max(0.5, Math.min(2.0, pitch)), 1.0);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate(Math.min(100, Math.max(10, hapticMs)));
      }
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * Played when an orb is released from the spawner.
   */
  public playCelestialDrop() {
    if (this.muted) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('tap', 1.2, 0.7);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate(12);
      }
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * Played when a star is earned on level completion.
   */
  public playLevelStar(starIndex: number = 1) {
    if (this.muted) return;
    try {
      const pitch = 0.9 + starIndex * 0.2;
      if (SoundModule?.playSound) {
        SoundModule.playSound('step', pitch, 0.9);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate(25);
      }
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * Grand crescendo for Supernova Tier 10 creation!
   */
  public playSupernovaExplosion() {
    if (this.muted) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('premium', 1.0, 1.0);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate([0, 50, 70, 120, 80, 200]);
      }
    } catch (e) {
      // safe fallback
    }
  }

  public stopAll() {
    try {
      if (SoundModule?.stopAll) {
        SoundModule.stopAll();
      }
    } catch (e) {
      // safe fallback
    }
  }
}

export const GameSound = new SoundEffectsService();
export default GameSound;
