import { Vibration, Platform } from 'react-native';
import GameSound from '../../../../Utils/GameSoundEffects';

class ZombieAudioService {
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private hapticsEnabled: boolean = true;

  public init(sound: boolean, music: boolean, haptics: boolean) {
    this.soundEnabled = sound;
    this.musicEnabled = music;
    this.hapticsEnabled = haptics;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
  }

  public setHapticsEnabled(enabled: boolean) {
    this.hapticsEnabled = enabled;
  }

  private vibrate(pattern: number | number[]) {
    if (!this.hapticsEnabled) return;
    try {
      if (Platform.OS === 'android') {
        Vibration.vibrate(pattern);
      }
    } catch {
      // Safe fallback
    }
  }

  public playBowDraw() {
    if (!this.soundEnabled) return;
    GameSound.playBowStretch(0.2);
  }

  public playBowStretch(tension: number = 0.5) {
    if (!this.soundEnabled) return;
    GameSound.playBowStretch(tension);
  }

  public playBowTension(notch: number = 1) {
    if (!this.soundEnabled) return;
    const tension = Math.min(1.0, 0.3 + (notch / 10) * 0.7);
    GameSound.playBowStretch(tension);
  }

  public playBowRelease() {
    if (!this.soundEnabled) return;
    GameSound.playCut(); // Aerodynamic arrow slicing throw whoosh!
    this.vibrate(24);
  }

  public playArrowHitGround() {
    if (!this.soundEnabled) return;
    GameSound.playStep(2);
    this.vibrate(12);
  }

  public playRicochet() {
    if (!this.soundEnabled) return;
    GameSound.playStep(13); // High-pitched metallic ricochet ping!
    this.vibrate(12);
  }

  public playHeadshot() {
    if (!this.soundEnabled) return;
    GameSound.playHeadshotVoice(); // Deep man voice saying "Headshot!"
    GameSound.playConnect(); // Heavy impact crunch
    this.vibrate([0, 30, 25, 60]);
  }

  public playArrowHitZombie(isHeadshot: boolean = false) {
    if (!this.soundEnabled) return;
    if (isHeadshot) {
      this.playHeadshot();
    } else {
      GameSound.playCut();
      this.vibrate(25);
    }
  }

  public playZombieDefeat() {
    if (!this.soundEnabled) return;
    GameSound.playCut();
    this.vibrate([0, 30, 20, 35]);
  }

  public playBombThrow() {
    if (!this.soundEnabled) return;
    GameSound.playBombThrow();
    this.vibrate(20);
  }

  public playBombBlast() {
    if (!this.soundEnabled) return;
    GameSound.playBombBlast();
    this.vibrate([0, 60, 45, 110, 50, 180]);
  }

  public playExplosion() {
    this.playBombBlast();
  }

  public playBounce() {
    if (!this.soundEnabled) return;
    GameSound.playStep(8);
    this.vibrate(15);
  }

  public playFireArrowLaunch() {
    if (!this.soundEnabled) return;
    GameSound.playCut();
    GameSound.playStep(6);
    this.vibrate(22);
  }

  public playFireExplosion() {
    if (!this.soundEnabled) return;
    GameSound.playSupernovaExplosion();
    this.vibrate([0, 40, 30, 70]);
  }

  public playFreezeArrowLaunch() {
    if (!this.soundEnabled) return;
    GameSound.playCut();
    GameSound.playStep(11);
    this.vibrate(18);
  }

  public playFreezeImpact() {
    if (!this.soundEnabled) return;
    GameSound.playStep(14);
    GameSound.playConnect();
    this.vibrate([0, 20, 20, 45]);
  }

  public playIceShatter() {
    if (!this.soundEnabled) return;
    GameSound.playStep(12);
    GameSound.playStep(14);
    this.vibrate([0, 30, 15, 30, 15, 60]);
  }

  public playSwitchTrigger() {
    if (!this.soundEnabled) return;
    GameSound.playConnect();
    this.vibrate(20);
  }

  public playPortal() {
    if (!this.soundEnabled) return;
    GameSound.playDownloadSuccess();
    this.vibrate(25);
  }

  public playVictory() {
    if (!this.soundEnabled) return;
    GameSound.playWin();
    this.vibrate([0, 60, 50, 120]);
  }

  public playDefeat() {
    if (!this.soundEnabled) return;
    GameSound.playIncomplete();
    this.vibrate([0, 80, 100, 80]);
  }

  public playStar(starIndex: number = 1) {
    if (!this.soundEnabled) return;
    GameSound.playLevelStar(starIndex);
    this.vibrate(20);
  }

  public playClick() {
    if (!this.soundEnabled) return;
    GameSound.playClick();
    this.vibrate(10);
  }
}

export const ZombieAudio = new ZombieAudioService();
export default ZombieAudio;
