import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Back from '../Components/Back';
import SqareAd from '../Components/SqareAd';

const colors = {
  background: '#272727', // Dark mode background
  primary: '#FFD700', // Gold primary color
  text: '#E0E0E0', // Light grey text
  card: '#1E1E1E', // Dark grey card background
};
 
const AboutScreen = () => {
 
  const handleEmailPress = () => {
    Linking.openURL('mailto:krunaltradaaa@gmail.com');
  }; 
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.background,}}>
      <Back categoryName={"About Us"} />
      <ScrollView contentContainerStyle={{ padding: scale(20), alignItems: 'center' }}>
        
        {/* Title */}
        <Text style={{ fontSize: scale(22), fontWeight: 'bold', color: colors.primary, marginBottom: verticalScale(15) }}>
          Welcome to WallFlash! 🚀
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          WallFlash is your ultimate wallpaper destination, offering a diverse collection of high-quality wallpapers 
          across multiple categories.
        </Text>
        <Text style={styles.description}>
          Easily set stunning wallpapers for your home and lock screens or download them for later.
        </Text>

        {/* Developer Info */}
        <Text style={styles.subHeader}>Developer Info 👨‍💻</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>📌 Developed by Krunal Trada</Text>
          <TouchableOpacity onPress={handleEmailPress}>
            <Text style={styles.linkText}>📧 krunaltradaaa@gmail.com</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          Thank you for using WallFlash! Stay tuned for more updates. 🎉
        </Text>
        
      </ScrollView>
    </View>
  );
};

const styles =  StyleSheet.create({

  description: {
    fontSize: scale(16),
    color: colors.text,
    textAlign: 'center',
    marginBottom: verticalScale(10),
    lineHeight: moderateScale(22),
  },
  subHeader: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: verticalScale(50),
  },
  infoCard: {
    backgroundColor: colors.card,
    padding: scale(15),
    borderRadius: scale(10),
    marginTop: verticalScale(10),
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: scale(4),
    elevation: 5,
  },
  infoText: {
    fontSize: scale(16),
    color: colors.text,
    textAlign: 'center',
    marginTop: verticalScale(5),
  },
  linkText: {
    fontSize: scale(16),
    color: '#1E90FF', // Blue color for a clickable link effect
    textAlign: 'center',
    marginTop: verticalScale(5),
  },
  footerText: {
    fontSize: scale(16),
    color: colors.text,
    textAlign: 'center',
    marginTop: verticalScale(20),
    fontStyle: 'italic',
  },
});

export default AboutScreen;
