# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in proguard-android-optimize.txt.

# -----------------------------------------------------------------------------
# React Native Core & JNI
# -----------------------------------------------------------------------------
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip

-keep @com.facebook.proguard.annotations.DoNotStrip class * { *; }
-keep @com.facebook.common.internal.DoNotStrip class * { *; }

-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
}

-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
    @com.facebook.react.bridge.ReactMethod <methods>;
}

-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.views.text.** { *; }
-keep class com.facebook.jni.** { *; }

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }

# -----------------------------------------------------------------------------
# React Native Reanimated, Screens, Gesture Handler
# -----------------------------------------------------------------------------
-keep class com.swmansion.reanimated.** { *; }
-keepclassmembers class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.rnscreens.** { *; }
-keep class com.swmansion.gesturehandler.** { *; }

# -----------------------------------------------------------------------------
# Google Mobile Ads & Firebase
# -----------------------------------------------------------------------------
-keep public class com.google.android.gms.ads.** { public *; }
-keep public class com.google.ads.** { public *; }
-keepattributes *Annotation*
-dontwarn com.google.android.gms.**

# -----------------------------------------------------------------------------
# In-App Purchases (react-native-iap & Play Billing)
# -----------------------------------------------------------------------------
-keep class com.dooboolab.rniap.** { *; }
-keep class com.android.billingclient.api.** { *; }

# -----------------------------------------------------------------------------
# Media & Images (FastImage / Glide & React Native Video)
# -----------------------------------------------------------------------------
-keep public class com.dylanvann.fastimage.** { *; }
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule { <init>(...); }
-keep class com.brentvatne.react.** { *; }

# -----------------------------------------------------------------------------
# Skia
# -----------------------------------------------------------------------------
-keep class com.shopify.reactnative.skia.** { *; }

# -----------------------------------------------------------------------------
# OkHttp, Okio & Coroutines
# -----------------------------------------------------------------------------
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase
