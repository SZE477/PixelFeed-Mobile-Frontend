// app/(tabs)/_layout.tsx
import { FontAwesome5 } from '@expo/vector-icons'; // Using FontAwesome5 icons
import { Tabs } from 'expo-router';
import React from 'react';

// Define a reusable TabBarIcon component
function TabBarIcon({ name, color }: { name: React.ComponentProps<typeof FontAwesome5>['name']; color: string }) {
  return <FontAwesome5 size={24} style={{ marginBottom: -3 }} name={name} color={color} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#111827', // Dark gray for active icon
        tabBarInactiveTintColor: '#9CA3AF', // Lighter gray for inactive icon
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // White background
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB', // Light gray border
          height: 60, // Adjust height as needed
          paddingBottom: 5, // Add some padding at the bottom
          paddingTop: 5,    // Add some padding at the top
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      {/* Tab for homepage.tsx */}
      <Tabs.Screen
        name="homepage" // Matches app/(tabs)/homepage.tsx
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home'} color={color} />
          ),
        }}
      />
      {/* Hides the incorrect index.tsx file from tabs */}
      <Tabs.Screen name="index" options={{ href: null }} />

      {/* Tab for explore.tsx */}
      <Tabs.Screen
        name="explore" // Matches app/(tabs)/explore.tsx
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'search' : 'search'} color={color} />
          ),
        }}
      />
      {/* Tab for reels.tsx */}
      <Tabs.Screen
        name="reels" // Matches app/(tabs)/reels.tsx
        options={{
          title: 'Reels',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'video' : 'video'} color={color} />
          ),
        }}
      />
      {/* Tab for profile.tsx */}
      <Tabs.Screen
        name="profile" // Matches app/(tabs)/profile.tsx
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'user-alt' : 'user'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}