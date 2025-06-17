import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '../../../common/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import SeatInfo from '../components/seat-details/seat-info';
import FormPassenger from '../components/seat-details/form-passenger';
import UploadDocs from '../components/seat-details/upload-docs';

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

  const handleContinue = () => {
    // Aquí iría la lógica para enviar los datos al backend
    console.log('Datos de pasajeros:', passengers);
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
                  onDocumentSelected={(uri, type, name) => 
                    handleDocumentSelected(seat.id, uri, type, name)
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