// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack, Slot } from 'expo-router'; // <-- Import Slot if using index redirect
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ActivityIndicator, View } from 'react-native'; // Optional: for loading indicator

// Keep the splash screen visible initially (moved logic to app/index.tsx)
// SplashScreen.preventAutoHideAsync(); // You can remove this if handled in index.tsx

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // Auth state check is now primarily handled by app/index.tsx for redirection
  // This layout just defines the possible screens

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* The (tabs) layout group for logged-in users */}
        <Stack.Screen name="(tabs)" />

        {/* Standalone screens for auth flow */}
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />

        {/* Modal screen */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />

        {/* Add a catch-all route */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}