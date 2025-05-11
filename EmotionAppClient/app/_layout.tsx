import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ActivityIndicator, View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemeProvider } from '@/utils/ThemeContext';
import { AuthProvider, useAuth } from '@/utils/AuthContext';
import { fixTouchEventPassive } from '@/utils/touchEvents';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Inner layout that handles auth redirection
function RootLayoutNav() {
  const { isLoggedIn, isLoading } = useAuth();
  const colorScheme = useColorScheme();

  useEffect(() => {
    // If we detect the user's authentication state has changed, redirect appropriately
    if (!isLoading) {
      if (isLoggedIn) {
        // Only navigate to the tabs if we're not already there
        if (router.canGoBack()) {
          // Find the route immediately before the current one
          router.replace('/(tabs)');
        }
      } else {
        // Navigate to the login page if not logged in
        router.replace('/login');
      }
    }
  }, [isLoggedIn, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: '页面未找到' }} />
      </Stack>
      <StatusBar style="auto" />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Fix touch event passive listener issues in web
  useEffect(() => {
    const cleanupTouchEvents = fixTouchEventPassive();
    return cleanupTouchEvents;
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <GluestackUIProvider mode="light">
          <RootLayoutNav />
        </GluestackUIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
