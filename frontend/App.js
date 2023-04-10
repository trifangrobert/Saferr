import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import MapView from 'react-native-maps';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View, Dimensions, Button} from 'react-native';
import * as Location from 'expo-location';
import React from 'react';
import { useEffect, useState } from 'react';
import MapComponent from './components/MapComponent';
const Stack = createNativeStackNavigator();

export default function App() {
  // use MapComponent
    return (
        <>
            {/*<Button title={"Show route"} onPress=/>*/}
            <MapComponent/>
        </>
    );
}
