// components/AdmobBanner.tsx
import React from 'react';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const REAL_BANNER_UNIT_ID = 'ca-app-pub-7105708210867722/8113315734';

const ShortBanner = () => {
  return (
    <BannerAd
      unitId={REAL_BANNER_UNIT_ID}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} 
    /> 
  ); 
};

export default ShortBanner;
