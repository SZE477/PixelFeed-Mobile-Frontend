import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

export const unstable_settings = {
  // Set initial route to start at (tabs)/homepage
  initialRouteName: '(tabs)/homepage',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Main app tabs (homepage is the default route) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Signup screen */}
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        {/* Modal screen */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
