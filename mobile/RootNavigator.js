// RootNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './LoginPage'; // Create LoginPage component
import SignupPage from './SignupPage'; // Assuming you have a SignupPage component
import MapPage from './MapPage'; // Create MapPage component
import DashboardPage from './DasboardPage';

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Map" component={MapPage} />
        <Stack.Screen name="Signup" component={SignupPage} />
        <Stack.Screen name="Dashboard" component={DashboardPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
