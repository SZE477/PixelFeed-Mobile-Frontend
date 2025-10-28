// app/index.tsx
import React, { useEffect, useState } from 'react';
import { Redirect, SplashScreen } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native'; // Optional: for loading indicator

export default function RootIndex() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync(); // Keep splash visible
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        setIsLoggedIn(!!token);
      } catch (e) {
        console.error("Failed to check auth token:", e);
        setIsLoggedIn(false); // Default to not logged in on error
      } finally {
        SplashScreen.hideAsync(); // Hide splash screen
      }
    };
    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    // Still checking auth, show loading or nothing
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    ); // Or return null;
  }

  if (isLoggedIn) {
    // User is logged in, redirect to the main app screen (e.g., homepage within tabs)
    // Make sure the path matches your actual home screen route
    return <Redirect href="/(tabs)/homepage" />;
  } else {
    // User is not logged in, redirect to the login screen
    return <Redirect href="/login" />;
  }
}