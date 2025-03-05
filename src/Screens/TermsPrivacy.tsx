import { View, Text, ScrollView, StyleSheet, TextStyle, ViewStyle, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Back from '../Components/Back';

const colors = {
  background: '#272727', // Dark mode background
  primary: '#FFD700', // Gold primary color
  text: '#E0E0E0', // Light grey text
  card: '#1E1E1E', // Dark grey card background
};

const TermsPrivacy = () => {
  
  
    const handleEmailPress = () => {
      Linking.openURL('mailto:krunaltradaaa@gmail.com');
    };  
    
  
  return (
    <View style={styles.container}>
      <Back categoryName={"Terms & Privacy"} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Terms of Service */}
        <Text style={styles.headerText}>📜 Terms of Service</Text>
        <Text style={styles.description}>
          By using WallFlash, you agree to comply with the following terms. If you do not agree, please do not use the app.
        </Text>
        
        <Text style={styles.subHeader}>1. Use of the App</Text>
        <Text style={styles.description}>
          WallFlash provides high-quality wallpapers for personal use. You may not distribute, modify, or sell any wallpapers without permission.
        </Text>

        <Text style={styles.subHeader}>2. Intellectual Property</Text>
        <Text style={styles.description}>
          All wallpapers are either freely licensed or obtained from open sources. If you believe any content infringes your rights, contact us immediately.
        </Text>

        <Text style={styles.subHeader}>3. Limitations of Liability</Text>
        <Text style={styles.description}>
          WallFlash is provided "as is" without warranties. We are not responsible for any damages resulting from app usage.
        </Text>

        {/* Privacy Policy */}
        <View style={{marginTop: scale(60)}}>
        <Text style={styles.headerText}>🔒 Privacy Policy</Text>
        <Text style={styles.description}>
          Your privacy is important to us. Below is how we handle your data.
        </Text>

        <Text style={styles.subHeader}>1. Data Collection</Text>
        <Text style={styles.description}>
          We do not collect personal data. The app may use analytics to improve the user experience.
        </Text>

        <Text style={styles.subHeader}>2. Third-Party Services</Text>
        <Text style={styles.description}>
          We may display ads from third-party networks. These services may collect user data as per their policies.
        </Text>

        <Text style={styles.subHeader}>3. Contact for Privacy Concerns</Text>
        <Text style={styles.description}>
          If you have privacy concerns, reach out to us.
        </Text>

        </View>

        {/* Contact Info */}
        <View style={styles.infoCard}>
        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.infoText}>📧 krunaltradaaa@gmail.com</Text>
        </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>Thank you for using WallFlash! 🚀</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    padding: scale(20),
  },
  headerText: {
    fontSize: scale(22),
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: verticalScale(15),
    textAlign: 'center',
  },
  subHeader: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: verticalScale(15),
  },
  description: {
    fontSize: scale(16),
    color: colors.text,
    textAlign: 'left' as TextStyle['textAlign'],
    marginBottom: verticalScale(10),
    lineHeight: moderateScale(22),
  },
  infoCard: {
    backgroundColor: colors.card,
    padding: scale(15),
    borderRadius: scale(10),
    marginTop: verticalScale(20),
    alignItems: 'center',
  },
  infoText: {
    fontSize: scale(16),
    color: '#1E90FF',
    textAlign: 'center',
  },
  footerText: {
    fontSize: scale(16),
    color: colors.text,
    textAlign: 'center',
    marginTop: verticalScale(20),
    fontStyle: 'italic',
  },
});

export default TermsPrivacy;
