import React from 'react';
import { View, StyleSheet } from 'react-native';
import NativeAdCard from './NativeAdCard';

const SqareAd = () => {
  return (
    <View style={styles.container}>
      <NativeAdCard variant="feed" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
});

export default SqareAd;