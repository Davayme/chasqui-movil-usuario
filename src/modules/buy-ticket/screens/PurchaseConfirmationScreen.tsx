import { Colors } from "@/src/common/constants/colors";
import { useStripePayment } from "@/src/common/services/stripeService";
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

export default function PurchaseConfirmationScreen() {
  const params = useLocalSearchParams();
  const { tripId, seats, passengers, routeInfo, pricing } = params;

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [passengerData, setPassengerData] = useState<any[]>([]);
  const [routeData, setRouteData] = useState<any>(null);
  const [pricingData, setPricingData] = useState<any>(null);

  // Usar el hook de Stripe para procesar pagos
  const { processPayment } = useStripePayment();

  // Helper function para mostrar la ubicación del asiento de forma consistente
  const getSeatLocationDisplay = (location: string) => {
    switch (location?.toLowerCase()) {
      case 'window':
      case 'ventana':
        return 'Ventana';
      case 'aisle':
      case 'pasillo':
        return 'Pasillo';
      case 'middle':
      case 'medio':
        return 'Medio';
      default:
        return location || 'N/A';
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Parsear los datos que vienen de la pantalla anterior
        if (seats) {
          const parsedSeats = JSON.parse(seats as string);
          setSelectedSeats(parsedSeats);
        }
        
        if (passengers) {
          const parsedPassengers = JSON.parse(passengers as string);
          setPassengerData(parsedPassengers);
        }
        
        if (routeInfo) {
          setRouteData(JSON.parse(routeInfo as string));
        }
        
        if (pricing) {
          setPricingData(JSON.parse(pricing as string));
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        Alert.alert("Error", "No se pudieron cargar los datos de la compra");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [tripId, seats, passengers, routeInfo, pricing]);

  // Función para calcular el precio total
  const calculateTotalPrice = () => {
    if (!selectedSeats.length || !passengerData.length) return 0;
    
    // Precios reales del backend
    let basePrice = 4; // Precio real para asientos normales
    let vipPrice = 6;  // Precio real para asientos VIP
    
    // Si tenemos datos de pricing del backend, usarlos
    if (pricingData) {
      basePrice = pricingData.normalSeat?.basePrice || basePrice;
      vipPrice = pricingData.vipSeat?.basePrice || vipPrice;
    }
    
    let total = 0;
    
    selectedSeats.forEach(seat => {
      const passenger = passengerData.find(p => p.seatId === seat.id);
      const originalPrice = seat.type === 'VIP' ? vipPrice : basePrice;
      
      // Aplicar descuentos según el tipo de pasajero
      if (passenger && ['child', 'elderly', 'disabled'].includes(passenger.passengerType)) {
        let discountedPrice = originalPrice * 0.5; // 50% de descuento por defecto
        
        // Si tenemos información de descuentos específicos del backend
        if (pricingData) {
          const seatPricing = seat.type === 'VIP' ? pricingData.vipSeat : pricingData.normalSeat;
          
          if (seatPricing?.discounts) {
            switch (passenger.passengerType) {
              case 'child':
                discountedPrice = seatPricing.discounts.CHILD || discountedPrice;
                break;
              case 'elderly':
                discountedPrice = seatPricing.discounts.SENIOR || discountedPrice;
                break;
              case 'disabled':
                discountedPrice = seatPricing.discounts.HANDICAPPED || discountedPrice;
                break;
            }
          }
        }
        
        total += discountedPrice;
      } else {
        total += originalPrice;
      }
    });
    
    // Redondear a 2 decimales
    return Math.round(total * 100) / 100;
  };

  // Función para formatear precios
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const confirmAndPay = () => {
    const totalAmount = calculateTotalPrice();
    
    Alert.alert(
      "Confirmar compra",
      `¿Está seguro que desea proceder con el pago de $${formatPrice(totalAmount)}?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Confirmar pago",
          onPress: handlePayWithStripe
        }
      ]
    );
  };

  const handlePayWithStripe = async () => {
    if (!selectedSeats.length || !passengerData.length) {
      Alert.alert("Error", "No hay asientos o pasajeros seleccionados");
      return;
    }

    const totalAmount = calculateTotalPrice();
    if (totalAmount <= 0) {
      Alert.alert("Error", "El monto total debe ser mayor a cero");
      return;
    }

    try {
      setIsProcessingPayment(true);

      const success = await processPayment(totalAmount);

      if (success) {
        Alert.alert(
          "¡Pago exitoso!",
          "Su compra se ha procesado correctamente. Puede ver sus boletos en la sección de Boletos.",
          [
            {
              text: "Ver mis boletos",
              onPress: () => router.push("/(tabs)/tickets")
            }
          ]
        );
      } else {
        Alert.alert(
          "Pago cancelado",
          "El pago fue cancelado o no se pudo completar"
        );
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      Alert.alert(
        "Error en el pago",
        "No se pudo procesar el pago. Por favor, intente nuevamente."
      );
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

  if (!selectedSeats.length || !passengerData.length || !routeData) {
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
            No se pudieron cargar los datos de la compra
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
        
        {/* Resumen del viaje */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen del Viaje</Text>
          <View style={styles.tripCard}>
            <View style={styles.routeContainer}>
              <Text style={styles.routeText}>
                {routeData.frequency.originCity} → {routeData.frequency.destinationCity}
              </Text>
              <Text style={styles.routeSubtext}>
                {routeData.date} | {routeData.frequency.departureTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Detalles de asientos y pasajeros */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles de Asientos</Text>
          {selectedSeats.map((seat, index) => {
            const passenger = passengerData.find(p => p.seatId === seat.id);
            
            // Usar precios reales del backend
            let basePrice = 4; // Precio real para asientos normales
            let vipPrice = 6;  // Precio real para asientos VIP
            
            if (pricingData) {
              basePrice = pricingData.normalSeat?.basePrice || basePrice;
              vipPrice = pricingData.vipSeat?.basePrice || vipPrice;
            }
            
            const originalPrice = seat.type === 'VIP' ? vipPrice : basePrice;
            let finalPrice = originalPrice;
            
            // Aplicar descuentos según el tipo de pasajero
            if (passenger && ['child', 'elderly', 'disabled'].includes(passenger.passengerType)) {
              finalPrice = originalPrice * 0.5; // 50% de descuento por defecto
              
              // Si tenemos información de descuentos específicos del backend
              if (pricingData) {
                const seatPricing = seat.type === 'VIP' ? pricingData.vipSeat : pricingData.normalSeat;
                
                if (seatPricing?.discounts) {
                  switch (passenger.passengerType) {
                    case 'child':
                      finalPrice = seatPricing.discounts.CHILD || finalPrice;
                      break;
                    case 'elderly':
                      finalPrice = seatPricing.discounts.SENIOR || finalPrice;
                      break;
                    case 'disabled':
                      finalPrice = seatPricing.discounts.HANDICAPPED || finalPrice;
                      break;
                  }
                }
              }
            }

            return (
              <View key={`seat-${seat.id}-${index}`} style={styles.seatCard}>
                <View style={styles.seatHeader}>
                  <View>
                    <Text style={styles.seatNumber}>Asiento {seat.number}</Text>
                    <Text style={styles.seatType}>
                      {seat.type === 'VIP' ? 'VIP' : 'Normal'} • {getSeatLocationDisplay(seat.location)}
                    </Text>
                  </View>
                  <Text style={styles.seatPrice}>${formatPrice(finalPrice)}</Text>
                </View>
                
                {passenger && (
                  <View style={styles.passengerInfo}>
                    <Text style={styles.passengerName}>
                      {passenger.firstName} {passenger.lastName}
                    </Text>
                    <Text style={styles.passengerDetails}>
                      Cédula: {passenger.idNumber} • Tipo: {
                        passenger.passengerType === 'normal' ? 'Adulto' :
                        passenger.passengerType === 'child' ? 'Menor de edad' :
                        passenger.passengerType === 'elderly' ? 'Tercera edad' :
                        'Persona con discapacidad'
                      }
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Resumen de costos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de Costos</Text>
          <View style={styles.costCard}>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Subtotal ({selectedSeats.length} asientos)</Text>
              <Text style={styles.costValue}>${formatPrice(calculateTotalPrice())}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.costRow}>
              <Text style={styles.totalLabel}>Total a Pagar</Text>
              <Text style={styles.totalValue}>${formatPrice(calculateTotalPrice())}</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={confirmAndPay}
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
              <Text style={styles.payButtonText}>Pagar ${formatPrice(calculateTotalPrice())}</Text>
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
    backgroundColor: Colors.backgroundSecondary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  loadingContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 16,
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
    color: Colors.backgroundPrimary,
    fontWeight: "600",
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  tripCard: {
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  routeContainer: {
    alignItems: "center",
  },
  routeText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  routeSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  seatCard: {
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  seatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  seatNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  seatType: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  seatPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },
  passengerInfo: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  passengerName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  passengerDetails: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  costCard: {
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  costLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  costValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
  },
  footer: {
    backgroundColor: Colors.backgroundPrimary,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  payButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonIcon: {
    marginRight: 8,
  },
  payButtonText: {
    color: Colors.backgroundPrimary,
    fontWeight: "600",
    fontSize: 16,
  },
});
