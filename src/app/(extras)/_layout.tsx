import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../common/context/AuthContext';


export default function ExtrasLayout() {
  const { isAuthenticated } = useAuth();

  // Si el usuario no está autenticado, redirigir a la pantalla de login
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="search-results" />
      <Stack.Screen name="trip-detail" />
      <Stack.Screen name="buy-ticket" />
      <Stack.Screen name="seat-selection" />
      <Stack.Screen name="purchase-confirmation" />
    </Stack>
  );
}