import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Back from '../Components/Back';

const colors = {
  gradientStart: '#1a1a2e',
  gradientEnd: '#16213e',
  primary: '#ffcc00', // Gold primary color
  text: '#f5f5f5', // Light text
  card: '#222831', // Dark card background
  button: '#ff5733', // Vibrant orange button
};

const LeadScreen = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:krunaltradaaa@gmail.com');
  };


  const handleWhatsAppPress = () => {
    let phoneNumber = '+919313897902'; // No space in the number
    let message = "I Want To Develop My Own App, Let's Discuss Plan & Pricing!";
    let url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() => {
      Alert.alert('Make sure WhatsApp is installed on your device');
    });
  };



  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <Back categoryName="Develop Your Own App!" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <Text style={styles.title}>🚀 Launch Your Own App!</Text>

        {/* Description */}
        <Text style={styles.description}>
          Want to bring your app idea to life? We provide expert development services for startups, businesses, and individuals.
        </Text>

        <Text style={styles.description}>
          Get a custom-designed, high-performance app tailored to your needs. Let's build something amazing together!
        </Text>

        <View style={{marginTop: scale(30)}}>
        
        <Text style={{
          fontSize: scale(24),
          fontWeight: 'bold',
          color: colors.primary,
          textAlign: 'center',
        }}>Click Below To Know {'\n'} Plans & Pricing!</Text>
         
         </View>
 

        {/* Call-to-Action Button */}
        <TouchableOpacity style={styles.button} onPress={handleWhatsAppPress} activeOpacity={0.5}>
          <Text style={styles.buttonText}>Let's Build Your App</Text>
        </TouchableOpacity>



        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.subHeader}>📌 Contact Us</Text>
          <TouchableOpacity onPress={handleEmailPress}>
            <Text style={styles.linkText}>📧 krunaltradaaa@gmail.com</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>Your dream app starts here! ✨</Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: scale(20), alignItems: 'center' },
  title: {
    fontSize: scale(24),
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: verticalScale(15),
    textAlign: 'center',
  },
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
    marginBottom: verticalScale(5),
  },
  infoCard: {
    backgroundColor: colors.card,
    padding: scale(15),
    borderRadius: scale(12),
    marginTop: verticalScale(20),
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: scale(5),
    elevation: 6,
  },
  linkText: {
    fontSize: scale(16),
    color: '#1E90FF',
    textAlign: 'center',
    marginTop: verticalScale(5),
  },
  button: {
    backgroundColor: colors.button,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(8), 
    marginTop: verticalScale(20),
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: scale(4),
    elevation: 6,
  },
  buttonText: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: '#fff',
  },
  footerText: {
    fontSize: scale(16),
    color: colors.text,
    textAlign: 'center',
    marginTop: verticalScale(25),
    fontStyle: 'italic',
  },
});

export default LeadScreen;
