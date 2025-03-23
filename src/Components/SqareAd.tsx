import { View, Text } from 'react-native'
import React, { useRef } from 'react'
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { scale } from 'react-native-size-matters';

const adUnitId = "ca-app-pub-7105708210867722/8647662693";

const SqareAd = () => {
  const bannerRef = useRef<BannerAd>(null);
  return (
    <View>
      <BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.INLINE_ADAPTIVE_BANNER} />
    </View> 
  )
}
 
export default SqareAd  