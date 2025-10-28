// app/index.tsx (Should look like this)
import { tokenManager } from '@/services/api';
import { Redirect, SplashScreen } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function RootIndex() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    const checkLoginStatus = async () => {
      try {
  // Use the tokenManager to check for access token
  const token = await tokenManager.getAccessToken();
        setIsLoggedIn(!!token);
      } catch (e) {
        console.error("Failed to check auth token:", e);
        setIsLoggedIn(false);
      } finally {
        SplashScreen.hideAsync();
      }
    };
    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isLoggedIn) {
    // Redirect TO the homepage WITHIN tabs
    return <Redirect href="/(tabs)/homepage" />;
  } else {
    // Redirect TO the dedicated login page
    return <Redirect href="/login" />;
  }
}