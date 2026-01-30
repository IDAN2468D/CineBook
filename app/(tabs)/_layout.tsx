import { Tabs } from 'expo-router';
import { Gift, Home, MapPin, Ticket, User } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 60, // Raised more as requested
          left: 70,
          right: 70,
          elevation: 5,
          backgroundColor: '#0f172a', // Slate 900
          borderRadius: 35, // Slightly rounder
          height: 70,
          borderTopWidth: 0,
          paddingTop: 0, // Ensure no top padding
          paddingBottom: 0, // Ensure no bottom padding
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)',
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#a855f7',
        tabBarInactiveTintColor: '#64748b',
        tabBarHideOnKeyboard: true,
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          height: 70,
          paddingTop: 12, // Push icons down for better visual centering
        },

      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center h-full w-12">
              <Home size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
              {focused && (
                <View className="absolute -bottom-2 w-1 h-1 rounded-full bg-indigo-500" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'My Tickets',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center h-full w-12">
              <Ticket size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
              {focused && (
                <View className="absolute -bottom-2 w-1 h-1 rounded-full bg-indigo-500" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="points"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center h-full w-12">
              <Gift size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
              {focused && (
                <View className="absolute -bottom-2 w-1 h-1 rounded-full bg-indigo-500" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Cinemas',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center h-full w-12">
              <MapPin size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
              {focused && (
                <View className="absolute -bottom-2 w-1 h-1 rounded-full bg-indigo-500" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Profile', // Keeping existing mapping of 'explore' file to 'Profile' title as per user's previous code
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center h-full w-12">
              <User size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
              {focused && (
                <View className="absolute -bottom-2 w-1 h-1 rounded-full bg-indigo-500" />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
