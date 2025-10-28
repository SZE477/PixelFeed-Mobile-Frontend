// app/index.tsx (Should look like this)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, SplashScreen } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function RootIndex() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    const checkLoginStatus = async () => {
      try {
        // ***IMPORTANT***: Use the correct key used when saving the token in services/api.ts!
        // Your api.ts uses '@pixelfeed_auth_token'
        // Your old _layout.tsx used 'authToken'
        const token = await AsyncStorage.getItem('@pixelfeed_auth_token'); // <-- Use the correct key
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