import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { I18nManager } from 'react-native';

// Force LTR
I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../hooks/useAuthStore';

import { SplashScreen as AnimatedSplash } from '../components/SplashScreen';

export default function RootLayout() {
  const { token, initialized, init } = useAuthStore();
  const router = useRouter();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    // Hide native splash screen immediately to show our custom animated one
    const hideNativeSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn('Error hiding native splash:', e);
      }
    };

    // Initialize app
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('hasSeenOnboarding');
        setIsFirstLaunch(value === null);
      } catch (e) {
        setIsFirstLaunch(false); // Default to normal flow if error
      }
    };

    hideNativeSplash();

    // Run initialization and splash timer in parallel
    Promise.all([
      init(), // Auth check
      checkOnboarding(),
      new Promise(resolve => setTimeout(resolve, 2500)) // Minimum splash duration
    ]).then(() => {
      setIsSplashVisible(false);
    });
  }, []);

  useEffect(() => {
    if (isSplashVisible) return; // Wait for splash to finish

    if (isFirstLaunch) {
      router.replace('/onboarding');
    } else if (token === null) {
      router.replace('/login');
    } else {
      router.replace('/(tabs)');
    }
  }, [isSplashVisible, isFirstLaunch, token]);

  if (isSplashVisible) {
    return <AnimatedSplash />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{
        headerStyle: { backgroundColor: colorScheme === 'dark' ? '#0f172a' : '#ffffff' },
        headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        headerTitleStyle: { fontWeight: 'bold' },
      }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movie/[id]" options={{ title: 'Movie Details' }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="watchlist" options={{ headerShown: false }} />
        <Stack.Screen name="booking/[showtimeId]" options={{ title: 'Select Seats' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
