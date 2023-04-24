import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';

const Stack = createNativeStackNavigator();

async function prepareResources() {
  try {
    await SplashScreen.preventAutoHideAsync();
  } catch (e) {
    console.warn(e);
  }

  SplashScreen.hideAsync();
}

export default function App() {
  React.useEffect(() => {
    prepareResources();
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}