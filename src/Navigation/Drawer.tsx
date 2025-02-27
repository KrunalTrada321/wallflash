import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MyTabs from './BottomTab';
import { scale } from 'react-native-size-matters';
import { colors } from '../Styling/colors';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Drawer = createDrawerNavigator();



const CustomDrawerContent = (props) => {

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      {/* Top Section - Add Logo or Profile Image */}
      <View style={{ flex: 1, paddingVertical: scale(20), backgroundColor: '#000116', }}>    
       
       <View style={{alignSelf: 'center'}}>
       <Image
          source={require('../assets/wf-logo.jpg')} // Replace with your image path
          style={{ width: scale(200), height: scale(120), marginBottom: scale(10) }}
        />
       </View>

        <View style={{height: scale(1), width: "100%", backgroundColor: colors.white}}></View>
     

        <View style={{ flex: 1, padding: scale(12) }}>
        {/* Favorites */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('FavoritesScreen')}
          style={styles.drawerItem}   
          activeOpacity={0.5}   
          >
          <AntDesign name="hearto" size={scale(22)} color={colors.primary}  />
          <Text style={styles.drawerText}>Favorites</Text>
        
        </TouchableOpacity>

        {/* About Us */}
        <TouchableOpacity 
          style={styles.drawerItem} 
          activeOpacity={0.5}
        >
           <Feather name="info" size={24} color={colors.primary}  />
          <Text style={styles.drawerText}>About Us</Text>
        </TouchableOpacity>
        </View>
     
      </View>
    </View>
  );
};






const MyDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />} // ✅ Inject custom drawer 
      screenOptions={{
        drawerStyle: {
          backgroundColor: colors.white, // Set background color
          borderTopRightRadius: scale(25), // Rounded top right corner
          borderBottomRightRadius: scale(25), // Rounded bottom right corner
          borderColor: colors.white,
          borderWidth: 1,
          marginVertical: scale(8),
          overflow: 'hidden', // Ensures content inside respects border radius
        },
        sceneContainerStyle: {
          backgroundColor: 'transparent', // Ensures transparency outside the drawer
        },
        headerStyle: {
          backgroundColor: colors.primary, // Set primary color for header background
          borderBottomLeftRadius: 18, // Rounded bottom-left corner
          borderBottomRightRadius: 18, // Rounded bottom-right corner
        },
        headerTintColor: colors.white,
        headerTitleAlign: 'center',
      }}
    >
      <Drawer.Screen
        name="WallFlash"
        component={MyTabs}
        options={{
          drawerItemStyle: { display: 'none' }, // Hide drawer item
          headerTitle: () => (
            <Image
              source={require('../assets/wallflash-logo.png')} // Update with your logo path
              style={{ width: scale(250), height: scale(60), resizeMode: 'contain', alignSelf: 'center', marginLeft: scale(8) }}
            />
          ),
        }}
      />

    </Drawer.Navigator>
  );
};



const styles = StyleSheet.create({
  drawerItem: {
    paddingVertical: scale(12),
    paddingHorizontal: scale(15),
    borderRadius: scale(10),
    backgroundColor: colors.background, // Use primary color
    marginBottom: scale(10),
    flexDirection: 'row'
  },
  drawerText: { 
    color: colors.black,
    fontSize: scale(16),
    fontWeight: 'bold',
    paddingLeft: scale(10)
  }
}); 

export default MyDrawer; 
