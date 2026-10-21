package com.wallflash

import android.media.AudioAttributes
import android.media.SoundPool
import android.speech.tts.TextToSpeech
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.util.Locale

class SoundModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), TextToSpeech.OnInitListener {
    private var soundPool: SoundPool? = null
    private val soundMap = HashMap<String, Int>()
    private var isMuted = false
    private var tts: TextToSpeech? = null
    private var isTtsReady = false

    override fun getName(): String = "SoundModule"

    init {
        initSoundPool()
        try {
            tts = TextToSpeech(reactContext, this)
        } catch (e: Exception) {
            Log.e("SoundModule", "Failed to initialize TTS: ${e.message}")
        }
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts?.language = Locale.US
            tts?.setPitch(0.72f) // Deep male voice
            tts?.setSpeechRate(1.1f)
            isTtsReady = true
        }
    }

    private fun initSoundPool() {
        try {
            val audioAttributes = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_GAME)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build()

            soundPool = SoundPool.Builder()
                .setMaxStreams(10)
                .setAudioAttributes(audioAttributes)
                .build()

            loadSound("tap", R.raw.tc_tap)
            loadSound("step", R.raw.tc_step)
            loadSound("connect", R.raw.tc_connect)
            loadSound("cut", R.raw.tc_cut)
            loadSound("incomplete", R.raw.tc_incomplete)
            loadSound("win", R.raw.tc_win)
            loadSound("reset", R.raw.tc_reset)
            loadSound("click", R.raw.tc_click)
            loadSound("download", R.raw.tc_download)
            loadSound("set_success", R.raw.tc_set_success)
            loadSound("like", R.raw.tc_like)
            loadSound("premium", R.raw.tc_premium)
            loadSound("headshot", R.raw.tc_headshot)
        } catch (e: Exception) {
            Log.e("SoundModule", "Failed to initialize SoundPool: ${e.message}", e)
        }
    }

    private fun loadSound(key: String, resId: Int) {
        try {
            soundPool?.let { pool ->
                val soundId = pool.load(reactContext, resId, 1)
                soundMap[key] = soundId
            }
        } catch (e: Exception) {
            Log.e("SoundModule", "Failed to load sound $key: ${e.message}", e)
        }
    }

    @ReactMethod
    fun play(name: String) {
        playSound(name, 1.0, 1.0)
    }

    @ReactMethod
    fun playSound(name: String, rate: Double, volume: Double) {
        if (isMuted) return
        val soundId = soundMap[name]
        if (soundId != null) {
            val vol = volume.toFloat().coerceIn(0f, 1f)
            val playbackRate = rate.toFloat().coerceIn(0.5f, 2.0f)
            soundPool?.play(soundId, vol, vol, 1, 0, playbackRate)
        } else if (name == "headshot" && isTtsReady) {
            speak("Headshot")
        }
    }

    @ReactMethod
    fun speak(text: String) {
        if (isMuted) return
        try {
            tts?.setPitch(0.72f) // Deep male announcer tone
            tts?.setSpeechRate(1.12f)
            tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "tts_${System.currentTimeMillis()}")
        } catch (e: Exception) {
            Log.e("SoundModule", "TTS error: ${e.message}")
        }
    }

    @ReactMethod
    fun playStretch(tension: Double, volume: Double) {
        if (isMuted) return
        val clampedTension = tension.coerceIn(0.1, 1.0)
        val vol = volume.toFloat().coerceIn(0f, 1f)
        val clickId = soundMap["click"]
        val cutId = soundMap["cut"]

        // Ratchet creak: pitch ascends with tension (0.7f to 1.8f)
        val rate = (0.7f + (clampedTension.toFloat() * 0.95f)).coerceIn(0.5f, 2.0f)
        if (clickId != null) {
            soundPool?.play(clickId, vol, vol, 1, 0, rate)
        }
        if (clampedTension > 0.45 && cutId != null) {
            val cutRate = (0.5f + (clampedTension.toFloat() * 0.35f)).coerceIn(0.5f, 2.0f)
            soundPool?.play(cutId, vol * 0.35f, vol * 0.35f, 1, 0, cutRate)
        }
    }

    @ReactMethod
    fun setMuted(muted: Boolean) {
        isMuted = muted
    }

    @ReactMethod
    fun stopAll() {
        soundPool?.autoPause()
        tts?.stop()
    }
}
