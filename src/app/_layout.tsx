import { Stack } from 'expo-router';
import React from 'react';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../common/components/Toast';
import { AuthProvider } from '../common/context/AuthContext';
import { useSplashScreen } from '../common/hooks/useSplashScreen';

function RootLayoutContent() {
  useSplashScreen();
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(extras)" />
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}