// ─────────────────────────────────────────────────────────────────────────────
//  hookAudio.ts
//  Audio & Tactile Haptics Service for Stickman Hook: Swing Hero
// ─────────────────────────────────────────────────────────────────────────────

import { NativeModules, Platform, Vibration } from 'react-native';
import GameSound from '../../../../Utils/GameSoundEffects';

const { SoundModule } = NativeModules;

export const HookAudio = {
  isMuted(): boolean {
    return GameSound.isMuted();
  },

  setMuted(muted: boolean) {
    GameSound.setMuted(muted);
  },

  playHookLatch() {
    if (this.isMuted()) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('tap', 1.3, 0.75);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate(10);
      }
    } catch {
      // safe fallback
    }
  },

  playHookRelease() {
    if (this.isMuted()) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('click', 1.1, 0.6);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate(12);
      }
    } catch {
      // safe fallback
    }
  },

  playTrampolineBounce() {
    if (this.isMuted()) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('pop', 1.25, 0.95);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate(28);
      }
    } catch {
      // safe fallback
    }
  },

  playSpeedRing() {
    if (this.isMuted()) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('premium', 1.4, 0.85);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate(35);
      }
    } catch {
      // safe fallback
    }
  },

  playHazardHit() {
    if (this.isMuted()) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('click', 0.6, 1.0);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate([0, 40, 60, 80]);
      }
    } catch {
      // safe fallback
    }
  },

  playFragileCrack() {
    if (this.isMuted()) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('tap', 0.7, 0.9);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate(18);
      }
    } catch {
      // safe fallback
    }
  },

  playStarCollect() {
    if (this.isMuted()) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('coin', 1.25, 0.95);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate(15);
      }
    } catch {
      // safe fallback
    }
  },

  playPowerUpCollect() {
    if (this.isMuted()) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('set_success', 1.3, 1.0);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate([0, 25, 30, 45]);
      }
    } catch {
      // safe fallback
    }
  },

  playPortalWarp() {
    if (this.isMuted()) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('premium', 0.9, 1.0);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate([0, 20, 30, 40]);
      }
    } catch {
      // safe fallback
    }
  },

  playVictory() {
    if (this.isMuted()) return;
    try {
      if (SoundModule?.playSound) {
        SoundModule.playSound('premium', 1.1, 1.0);
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate([0, 30, 50, 100, 60, 120]);
      }
    } catch {
      // safe fallback
    }
  },
};

export default HookAudio;

