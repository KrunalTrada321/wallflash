import { View, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import StackNav from './Navigation/StackNavigation';
import { colors } from './Styling/colors';

const App = () => {
  return (
    <NavigationContainer>
      {/* Set StatusBar color to black and text color to white */}
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <StackNav />
    </NavigationContainer>
  );
};

export default App;
