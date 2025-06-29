import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../common/constants/colors';
import FormPassenger from '../components/seat-details/form-passenger';
import SeatInfo from '../components/seat-details/seat-info';
import UploadDocs from '../components/seat-details/upload-docs';
import { ValidationResult } from '../services/aws.service';
import { BusInfo, RouteInfo } from '../services/seatService';

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
  documentUri: string;
  documentType: string;
  documentName: string;
  isValidated: boolean;
  validationResult: ValidationResult | null;
}

export default function SeatDetailsScreen() {
  const params = useLocalSearchParams();
  const { tripId, seats, busInfo, routeInfo } = params;
  
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [busData, setBusData] = useState<BusInfo | null>(null);
  const [routeData, setRouteData] = useState<RouteInfo | null>(null);
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
          documentUri: '',
          documentType: '',
          documentName: '',
          isValidated: false,
          validationResult: null,
        }));
        setPassengers(initialPassengers);
      }
      
      if (busInfo) {
        setBusData(JSON.parse(busInfo as string));
      }
      
      if (routeInfo) {
        setRouteData(JSON.parse(routeInfo as string));
      }
    } catch (error) {
      console.error('Error parsing seat data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de los asientos');
      router.back();
    }
  }, [seats, busInfo, routeInfo]);

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

  const handleContinue = () => {
    // Verificar que todos los asientos VIP estén validados si requieren validación
    const invalidSeats = passengers.filter(p => {
      const seat = selectedSeats.find(s => s.id === p.seatId);
      return seat && seat.type === 'VIP' && !p.isValidated;
    });
    
    if (invalidSeats.length > 0) {
      Alert.alert(
        'Validación pendiente',
        'Debe validar los documentos de todos los asientos VIP antes de continuar.',
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
        busInfo: JSON.stringify(busData),
        routeInfo: JSON.stringify(routeData)
      }
    });
  };

  const calculatePrice = (seat: SelectedSeat): { original: number; discounted?: number } => {
    const basePrice = 25; // Precio base, debería venir de la API
    const vipMultiplier = 1.5;
    
    const originalPrice = seat.type === 'VIP' ? basePrice * vipMultiplier : basePrice;
    
    return {
      original: originalPrice,
      // Aquí se podrían aplicar descuentos según validaciones
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
          const pricing = calculatePrice(seat);
          const needsValidation = seat.type === 'VIP'; // Solo los VIP requieren validación por ahora

          return (
            <View key={seat.id} style={styles.seatSection}>
              <SeatInfo
                seatNumber={seat.number}
                seatType={seat.type.toLowerCase() as any}
                originalPrice={pricing.original}
                discountedPrice={pricing.discounted}
              />
              
              <FormPassenger
                firstName={passenger?.firstName || ''}
                lastName={passenger?.lastName || ''}
                idNumber={passenger?.idNumber || ''}
                onChangeFirstName={(text) => handleChangeFirstName(seat.id, text)}
                onChangeLastName={(text) => handleChangeLastName(seat.id, text)}
                onChangeIdNumber={(text) => handleChangeIdNumber(seat.id, text)}
              />
              
              {needsValidation && (
                <UploadDocs
                  seatType={seat.type.toLowerCase() as any}
                  firstName={passenger?.firstName || ''}
                  lastName={passenger?.lastName || ''}
                  onDocumentSelected={(uri, type, name) => 
                    handleDocumentSelected(seat.id, uri, type, name)
                  }
                  onValidationResult={(result) => 
                    handleValidationResult(seat.id, result)
                  }
                />
              )}
            </View>
          );
        })}

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continuar al Pago</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  errorText: {
    fontSize: 16,
    color: Colors.danger,
    textAlign: 'center',
    marginTop: 32,
  },
  tripInfoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tripInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  tripInfoSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  seatSection: {
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});