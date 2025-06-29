import { Colors } from "@/src/common/constants/colors";
import { useStripePayment } from "@/src/common/services/stripeService";
import { TicketPreview } from "@/src/modules/search-bus/services/interfaces";
import { generateTicketPreview } from "@/src/modules/search-bus/services/mockData";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CostSummary from "../components/cost-summary";
import SeatDetails from "../components/seat-details";
import TripSummary from "../components/trip-summary";

export default function PurchaseConfirmationScreen() {
  const params = useLocalSearchParams();
  const { tripId, seats } = params;

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [ticketData, setTicketData] = useState<TicketPreview | null>(null);

  // Usar el hook de Stripe para procesar pagos
  const { processPayment } = useStripePayment();

  useEffect(() => {
    const loadTicketData = async () => {
      setIsLoading(true);
      try {
        // Simular tiempo de carga
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Convertir los IDs de asientos de string a número
        const seatIds = (seats as string).split(",").map((id) => parseInt(id));

        // Para este ejemplo, asumimos que todos los pasajeros son adultos (tipo 'normal')
        const passengerTypes = seatIds.map((seatId) => ({
          seatId,
          type: "normal",
        }));

        // Generar la vista previa del boleto
        const preview = generateTicketPreview(
          parseInt(tripId as string),
          seatIds,
          1, // userId (hardcoded por ahora)
          passengerTypes
        );

        setTicketData(preview);
      } catch (error) {
        console.error("Error al cargar datos del boleto:", error);
        Alert.alert("Error", "No se pudieron cargar los datos del boleto");
      } finally {
        setIsLoading(false);
      }
    };

    loadTicketData();
  }, [tripId, seats]);

  const handlePayWithStripe = async () => {
    if (!ticketData) return;

    try {
      setIsProcessingPayment(true);

      // Pasar el monto directamente (ya no necesitamos convertirlo a centavos)
      const success = await processPayment(ticketData.pricing.grandTotal);

      if (success) {
        // Navegar a la pantalla de boletos
        router.push("/(tabs)/tickets");
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      Alert.alert("Error", "No se pudo procesar el pago");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="light" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!ticketData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={Colors.danger}
          />
          <Text style={styles.errorText}>
            No se pudieron cargar los datos del boleto
          </Text>
          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => router.back()}
          >
            <Text style={styles.returnButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar style="light" />
      <ScrollView style={styles.content}>
        <TripSummary tripInfo={ticketData.tripInfo} />
        <SeatDetails seats={ticketData.seats} />
        <CostSummary pricing={ticketData.pricing} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayWithStripe}
          disabled={isProcessingPayment}
        >
          {isProcessingPayment ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons
                name="card-outline"
                size={22}
                color="#fff"
                style={styles.payButtonIcon}
              />
              <Text style={styles.payButtonText}>Pagar con Stripe</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  returnButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  returnButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  payButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
  },
  payButtonIcon: {
    marginRight: 8,
  },
  payButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
