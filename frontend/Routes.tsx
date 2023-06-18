import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import MapScreen from './screens/MapScreen';
import AddCrimeScreen from './screens/AddCrimeScreen';

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
			<Stack.Navigator initialRouteName="Map">
				<Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
				<Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
				<Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
				<Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
				<Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
				<Stack.Screen name="AddCrime" component={AddCrimeScreen} options={{ headerShown: false }} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}