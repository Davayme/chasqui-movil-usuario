import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../common/context/AuthContext";
import { Colors } from "@/src/common/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
export default function ExtrasLayout() {
  const { isAuthenticated } = useAuth();

  // Si el usuario no está autenticado, redirigir a la pantalla de login
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="search-results"
        options={{ title: "Resultados de Búsqueda" }}
      />
      <Stack.Screen
        name="trip-detail"
        options={{ title: "Detalle del Viaje" }}
      />
      <Stack.Screen name="buy-ticket" options={{ title: "Comprar Boleto" }} />
      <Stack.Screen
        name="seat-selection"
        options={{ title: "Selección de Asientos" }}
      />
      <Stack.Screen
        name="purchase-confirmation"
        options={{ title: "Confirmación de Compra" }}
      />
      <Stack.Screen
        name="seat-details"
        options={{ title: "Detalles del Asiento" }}
      />
    </Stack>
  );
}
