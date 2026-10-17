package com.wallflash

import android.media.AudioAttributes
import android.media.SoundPool
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SoundModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var soundPool: SoundPool? = null
    private val soundMap = HashMap<String, Int>()
    private var isMuted = false

    override fun getName(): String = "SoundModule"

    init {
        initSoundPool()
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
        val soundId = soundMap[name] ?: return
        val vol = volume.toFloat().coerceIn(0f, 1f)
        val playbackRate = rate.toFloat().coerceIn(0.5f, 2.0f)
        soundPool?.play(soundId, vol, vol, 1, 0, playbackRate)
    }

    @ReactMethod
    fun setMuted(muted: Boolean) {
        isMuted = muted
    }

    @ReactMethod
    fun stopAll() {
        soundPool?.autoPause()
    }
}
