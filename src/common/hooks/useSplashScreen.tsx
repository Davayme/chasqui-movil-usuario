import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Prevenir que el SplashScreen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export function useSplashScreen() {
  const { isLoading } = useAuth();

  useEffect(() => {
    // Ocultar el SplashScreen una vez que se haya verificado la autenticación
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return null;
} 