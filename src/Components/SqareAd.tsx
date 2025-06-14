import { View, Text } from 'react-native'
import React, { useRef } from 'react'
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { scale } from 'react-native-size-matters';

const adUnitId = "ca-app-pub-3940256099942544/9214589741";

const SqareAd = () => {
  const bannerRef = useRef<BannerAd>(null);
  return (
    <View>
      <BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.INLINE_ADAPTIVE_BANNER} />
    </View> 
  )
}
 
export default SqareAd  