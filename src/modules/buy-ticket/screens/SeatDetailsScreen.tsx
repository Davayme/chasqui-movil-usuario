import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../common/constants/colors';
import FormPassenger from '../components/seat-details/form-passenger';
import SeatInfo from '../components/seat-details/seat-info';
import UploadDocs from '../components/seat-details/upload-docs';
import { ValidationResult } from '../services/aws.service';

// Datos estáticos de ejemplo
const DEMO_SEATS = [
  {
    id: '1',
    seatNumber: '12',
    seatType: 'normal',
    originalPrice: 25.00,
  },
  {
    id: '2',
    seatNumber: '14',
    seatType: 'child',
    originalPrice: 25.00,
    discountedPrice: 12.50,
  },
  {
    id: '3',
    seatNumber: '16',
    seatType: 'elderly',
    originalPrice: 25.00,
    discountedPrice: 12.50,
  },
  {
    id: '4',
    seatNumber: '18',
    seatType: 'disabled',
    originalPrice: 25.00,
    discountedPrice: 12.50,
  },
];

export default function SeatDetailsScreen() {
  const [passengers, setPassengers] = useState(
    DEMO_SEATS.map(seat => ({
      seatId: seat.id,
      firstName: '',
      lastName: '',
      idNumber: '',
      documentUri: '',
      documentType: '',
      documentName: '',
      isValidated: false,
      validationResult: null as ValidationResult | null,
    }))
  );

  const handleChangeFirstName = (seatId: string, text: string) => {
    setPassengers(
      passengers.map(p => (p.seatId === seatId ? { ...p, firstName: text } : p))
    );
  };

  const handleChangeLastName = (seatId: string, text: string) => {
    setPassengers(
      passengers.map(p => (p.seatId === seatId ? { ...p, lastName: text } : p))
    );
  };

  const handleChangeIdNumber = (seatId: string, text: string) => {
    setPassengers(
      passengers.map(p => (p.seatId === seatId ? { ...p, idNumber: text } : p))
    );
  };
  const handleDocumentSelected = (seatId: string, uri: string, type: string, name: string) => {
    setPassengers(
      passengers.map(p => (
        p.seatId === seatId 
          ? { ...p, documentUri: uri, documentType: type, documentName: name } 
          : p
      ))
    );
  };

  const handleValidationResult = (seatId: string, result: ValidationResult) => {
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
    // Verificar que todos los asientos con descuento estén validados
    const seatsWithDiscount = passengers.filter(p => {
      const seat = DEMO_SEATS.find(s => s.id === p.seatId);
      return seat && seat.seatType !== 'normal';
    });

    const invalidSeats = seatsWithDiscount.filter(p => !p.isValidated);
    
    if (invalidSeats.length > 0) {
      Alert.alert(
        'Validación pendiente',
        'Debe validar los documentos de todos los asientos con descuento antes de continuar.',
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

    // Aquí iría la lógica para enviar los datos al backend
    console.log('Datos de pasajeros validados:', passengers);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Detalles de los Pasajeros</Text>
        <Text style={styles.subtitle}>
          Complete la información para cada uno de los asientos seleccionados
        </Text>

        {DEMO_SEATS.map((seat) => {
          const passenger = passengers.find(p => p.seatId === seat.id);
          const needsDocument = seat.seatType !== 'normal';

          return (
            <View key={seat.id} style={styles.seatSection}>
              <SeatInfo
                seatNumber={seat.seatNumber}
                seatType={seat.seatType as any}
                originalPrice={seat.originalPrice}
                discountedPrice={seat.discountedPrice}
              />
              
              <FormPassenger
                firstName={passenger?.firstName}
                lastName={passenger?.lastName}
                idNumber={passenger?.idNumber}
                onChangeFirstName={(text) => handleChangeFirstName(seat.id, text)}
                onChangeLastName={(text) => handleChangeLastName(seat.id, text)}
                onChangeIdNumber={(text) => handleChangeIdNumber(seat.id, text)}
              />
                {needsDocument && (
                <UploadDocs
                  seatType={seat.seatType as any}
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
          <Text style={styles.continueButtonText}>Continuar</Text>
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