import { StripeProvider } from "@stripe/stripe-react-native";
import { Stack } from "expo-router";
import React from "react";
import { Platform, StatusBar } from "react-native";
import { ToastContainer } from "../common/components/Toast";
import { AuthProvider } from "../common/context/AuthContext";
import { useSplashScreen } from "../common/hooks/useSplashScreen";

function RootLayoutContent() {
  useSplashScreen();

  return (
    <>
      <StatusBar
        barStyle={Platform.OS === "android" ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(extras)" />
      </Stack>
      <ToastContainer />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StripeProvider
        publishableKey="pk_test_51OVR6tILXmRhmPFRNFcVDCJAh3GoiYknLIYAJnrXRsQ0SVw9sVxgXFXlO6MfYkHpHs9yB1e4J20TLO9eJYEiYAoH00bYKsW1M8"
        urlScheme="chasquigo"
        merchantIdentifier="merchant.com.chasquigo"
      >
        <RootLayoutContent />
      </StripeProvider>
    </AuthProvider>
  );
}
