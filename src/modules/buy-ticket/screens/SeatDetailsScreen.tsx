import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../common/constants/colors';
import FormPassenger from '../components/seat-details/form-passenger';
import PassengerTypeSelector from '../components/seat-details/passenger-type-selector';
import UploadDocs from '../components/seat-details/upload-docs';
import { ValidationResult } from '../services/aws.service';
import { RouteInfo, SeatPricing } from '../services/seatService';

interface SelectedSeat {
  id: number;
  number: string;
  type: 'VIP' | 'NORMAL';
  location: 'ventana' | 'pasillo';
}

interface PassengerData {
  seatId: number;
  firstName: string;
  lastName: string;
  idNumber: string;
  passengerType: 'normal' | 'child' | 'elderly' | 'disabled';
  documentUri: string;
  documentType: string;
  documentName: string;
  isValidated: boolean;
  validationResult: ValidationResult | null;
}

export default function SeatDetailsScreen() {
  const params = useLocalSearchParams();
  const { tripId, seats, routeInfo, pricing } = params;
  
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [routeData, setRouteData] = useState<RouteInfo | null>(null);
  const [pricingData, setPricingData] = useState<SeatPricing | null>(null);
  const [passengers, setPassengers] = useState<PassengerData[]>([]);

  useEffect(() => {
    // Parsear los datos que vienen de la pantalla anterior
    try {
      if (seats) {
        const parsedSeats: SelectedSeat[] = JSON.parse(seats as string);
        setSelectedSeats(parsedSeats);
        
        // Inicializar datos de pasajeros
        const initialPassengers: PassengerData[] = parsedSeats.map(seat => ({
          seatId: seat.id,
          firstName: '',
          lastName: '',
          idNumber: '',
          passengerType: 'normal' as const,
          documentUri: '',
          documentType: '',
          documentName: '',
          isValidated: false,
          validationResult: null,
        }));
        setPassengers(initialPassengers);
      }
      
      if (routeInfo) {
        setRouteData(JSON.parse(routeInfo as string));
      }
      
      if (pricing) {
        setPricingData(JSON.parse(pricing as string));
      }
    } catch (error) {
      console.error('Error parsing seat data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de los asientos');
      router.back();
    }
  }, [seats, routeInfo, pricing]);

  const handleChangeFirstName = (seatId: number, text: string) => {
    setPassengers(
      passengers.map(p => (p.seatId === seatId ? { ...p, firstName: text } : p))
    );
  };

  const handleChangeLastName = (seatId: number, text: string) => {
    setPassengers(
      passengers.map(p => (p.seatId === seatId ? { ...p, lastName: text } : p))
    );
  };

  const handleChangeIdNumber = (seatId: number, text: string) => {
    setPassengers(
      passengers.map(p => (p.seatId === seatId ? { ...p, idNumber: text } : p))
    );
  };

  const handleDocumentSelected = (seatId: number, uri: string, type: string, name: string) => {
    setPassengers(
      passengers.map(p => (
        p.seatId === seatId 
          ? { ...p, documentUri: uri, documentType: type, documentName: name } 
          : p
      ))
    );
  };

  const handleValidationResult = (seatId: number, result: ValidationResult) => {
    setPassengers(
      passengers.map(p => (
        p.seatId === seatId 
          ? { 
              ...p, 
              isValidated: result.isValid,
              validationResult: result,
              // Si la validación extrajo un número de cédula, usarlo
              idNumber: result.nameValidation?.extractedIdNumber || p.idNumber
            } 
          : p
      ))
    );

    // Mostrar alerta si la validación falló
    if (!result.isValid) {
      Alert.alert(
        'Validación fallida',
        result.reason || 'El documento no es válido para este tipo de asiento.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleChangePassengerType = (seatId: number, passengerType: 'normal' | 'child' | 'elderly' | 'disabled') => {
    setPassengers(
      passengers.map(p => (
        p.seatId === seatId 
          ? { 
              ...p, 
              passengerType,
              // Limpiar validación cuando cambia el tipo
              isValidated: passengerType === 'normal', // Normal no necesita validación
              validationResult: null,
              documentUri: '',
              documentType: '',
              documentName: ''
            } 
          : p
      ))
    );
  };

  const handleContinue = () => {
    // Verificar que todos los asientos con descuento estén validados
    const passengersNeedingValidation = passengers.filter(p => 
      ['child', 'elderly', 'disabled'].includes(p.passengerType) && !p.isValidated
    );
    
    if (passengersNeedingValidation.length > 0) {
      Alert.alert(
        'Validación pendiente',
        'Debe validar los documentos de todos los pasajeros con descuento antes de continuar.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Verificar que todos los campos estén completos
    const incompletePassengers = passengers.filter(p => 
      !p.firstName.trim() || !p.lastName.trim() || !p.idNumber.trim()
    );

    if (incompletePassengers.length > 0) {
      Alert.alert(
        'Información incompleta',
        'Complete toda la información de los pasajeros antes de continuar.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Navegar a la confirmación de compra
    router.push({
      pathname: '/(extras)/purchase-confirmation',
      params: {
        tripId: tripId as string,
        seats: JSON.stringify(selectedSeats),
        passengers: JSON.stringify(passengers),
        routeInfo: JSON.stringify(routeData),
        pricing: JSON.stringify(pricingData)
      }
    });
  };

  // Función para verificar si todos los formularios están completos
  const isFormValid = () => {
    // Verificar que todos los pasajeros tengan información completa
    const allFieldsComplete = passengers.every(p => 
      p.firstName.trim() && p.lastName.trim() && p.idNumber.trim()
    );

    // Verificar que todos los pasajeros con descuento estén validados
    const allDiscountPassengersValidated = passengers.every(p => 
      !['child', 'elderly', 'disabled'].includes(p.passengerType) || p.isValidated
    );

    return allFieldsComplete && allDiscountPassengersValidated;
  };

  const calculatePrice = (seat: SelectedSeat, passenger?: PassengerData): { original: number; discounted?: number } => {
    // Intentar usar precios reales del backend si están disponibles
    let basePrice = 4; // Precio real del backend para asientos normales
    let vipPrice = 6;  // Precio real del backend para asientos VIP
    
    // Si tenemos datos de pricing del backend, usarlos
    if (pricingData) {
      basePrice = pricingData.normalSeat.basePrice;
      vipPrice = pricingData.vipSeat.basePrice;
    }
    
    const originalPrice = seat.type === 'VIP' ? vipPrice : basePrice;
    
    // Aplicar descuentos según el tipo de pasajero
    if (passenger && ['child', 'elderly', 'disabled'].includes(passenger.passengerType)) {
      let discountedPrice = originalPrice * 0.5; // 50% de descuento por defecto
      
      // Si tenemos información de descuentos específicos del backend
      if (pricingData) {
        const seatPricing = seat.type === 'VIP' ? pricingData.vipSeat : pricingData.normalSeat;
        
        switch (passenger.passengerType) {
          case 'child':
            discountedPrice = seatPricing.discounts.CHILD;
            break;
          case 'elderly':
            discountedPrice = seatPricing.discounts.SENIOR;
            break;
          case 'disabled':
            discountedPrice = seatPricing.discounts.HANDICAPPED;
            break;
        }
      }
      
      return {
        original: originalPrice,
        discounted: discountedPrice
      };
    }
    
    return {
      original: originalPrice,
    };
  };

  if (selectedSeats.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.errorText}>No se encontraron asientos seleccionados</Text>
          <TouchableOpacity style={styles.continueButton} onPress={() => router.back()}>
            <Text style={styles.continueButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Detalles de los Pasajeros</Text>
        <Text style={styles.subtitle}>
          Complete la información para cada uno de los asientos seleccionados
        </Text>

        {/* Información del viaje */}
        {routeData && (
          <View style={styles.tripInfoContainer}>
            <Text style={styles.tripInfoText}>
              {routeData.frequency.originCity} → {routeData.frequency.destinationCity}
            </Text>
            <Text style={styles.tripInfoSubtext}>
              {routeData.date} | {routeData.frequency.departureTime}
            </Text>
          </View>
        )}

        {selectedSeats.map((seat) => {
          const passenger = passengers.find(p => p.seatId === seat.id);
          const pricing = calculatePrice(seat, passenger);
          const needsValidation = passenger && ['child', 'elderly', 'disabled'].includes(passenger.passengerType);

          return (
            <View key={seat.id} style={styles.seatCard}>
              {/* Header simplificado del asiento */}
              <View style={styles.seatHeader}>
                <View style={styles.seatInfo}>
                  <Text style={styles.seatNumber}>Asiento {seat.number}</Text>
                  <View style={styles.seatTags}>
                    {seat.type === 'VIP' && (
                      <View style={styles.vipBadge}>
                        <Ionicons name="star" size={12} color="#f59e0b" />
                        <Text style={styles.vipText}>VIP</Text>
                      </View>
                    )}
                    <View style={styles.locationTag}>
                      <Ionicons 
                        name={seat.location === 'ventana' ? 'car-outline' : 'walk-outline'} 
                        size={14} 
                        color={Colors.textSecondary} 
                      />
                      <Text style={styles.locationText}>
                        {seat.location === 'ventana' ? 'Ventana' : 'Pasillo'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.priceContainer}>
                  {pricing.discounted ? (
                    <>
                      <Text style={styles.originalPrice}>${pricing.original}</Text>
                      <Text style={styles.discountedPrice}>${pricing.discounted}</Text>
                    </>
                  ) : (
                    <Text style={styles.price}>${pricing.original}</Text>
                  )}
                </View>
              </View>
              
              {/* Tipo de pasajero */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Tipo de pasajero</Text>
                <PassengerTypeSelector
                  selectedType={passenger?.passengerType || 'normal'}
                  onTypeChange={(type) => handleChangePassengerType(seat.id, type)}
                />
              </View>
              
              {/* Información del pasajero */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Información del pasajero</Text>
                <FormPassenger
                  firstName={passenger?.firstName || ''}
                  lastName={passenger?.lastName || ''}
                  idNumber={passenger?.idNumber || ''}
                  onChangeFirstName={(text) => handleChangeFirstName(seat.id, text)}
                  onChangeLastName={(text) => handleChangeLastName(seat.id, text)}
                  onChangeIdNumber={(text) => handleChangeIdNumber(seat.id, text)}
                />
              </View>
              
              {/* Validación de documentos */}
              {needsValidation && passenger && ['child', 'elderly', 'disabled'].includes(passenger.passengerType) && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Validación de descuento</Text>
                  <UploadDocs
                    seatType={passenger.passengerType as 'child' | 'elderly' | 'disabled'}
                    firstName={passenger?.firstName || ''}
                    lastName={passenger?.lastName || ''}
                    onDocumentSelected={(uri, type, name) => 
                      handleDocumentSelected(seat.id, uri, type, name)
                    }
                    onValidationResult={(result) => 
                      handleValidationResult(seat.id, result)
                    }
                  />
                </View>
              )}
            </View>
          );
        })}

        <TouchableOpacity 
          style={[
            styles.continueButton, 
            !isFormValid() && styles.continueButtonDisabled
          ]} 
          onPress={handleContinue}
          disabled={!isFormValid()}
        >
          <Text style={[
            styles.continueButtonText,
            !isFormValid() && styles.continueButtonTextDisabled
          ]}>
            Continuar al Pago
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 32,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 32,
  },
  tripInfoContainer: {
    backgroundColor: Colors.backgroundPrimary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tripInfoText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  tripInfoSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  seatCard: {
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  seatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  seatInfo: {
    flex: 1,
  },
  seatNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  seatTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vipBadge: {
    backgroundColor: Colors.gray50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vipText: {
    color: Colors.warning,
    fontSize: 12,
    fontWeight: '600',
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: Colors.textLight,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  discountedPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.success,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: Colors.gray200,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: Colors.backgroundPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: Colors.textLight,
  }
});