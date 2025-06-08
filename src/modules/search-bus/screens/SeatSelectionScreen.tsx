import Header from '@/src/common/components/Header';
import { Colors } from '@/src/common/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatCurrency, formatDate, formatTime } from '../services/formattingUtils';
import { BusSeat } from '../services/interfaces';
import { singleDeckBusLayout } from '../services/mockBusLayouts';
import { getBusSeatsForTrip } from '../services/mockData';

export default function SeatSelectionScreen() {
  const params = useLocalSearchParams();
  const { tripId } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [busSeats, setBusSeats] = useState<BusSeat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  
  // Datos simulados del viaje
  const tripData = {
    id: parseInt(tripId as string),
    cooperativeName: 'Transportes Express',
    originCity: 'Quito',
    destinationCity: 'Guayaquil',
    departureDate: new Date(),
    departureTime: new Date(),
    price: 25.0,
  };
  
  useEffect(() => {
    const loadBusSeats = async () => {
      setIsLoading(true);
      try {
        // Simular tiempo de carga
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Cargar asientos del bus
        const seats = getBusSeatsForTrip(parseInt(tripId as string));
        setBusSeats(seats);
      } catch (error) {
        console.error('Error al cargar asientos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBusSeats();
  }, [tripId]);
  
  const handleSeatPress = (seatId: number) => {
    // Verificar si el asiento ya está seleccionado
    if (selectedSeats.includes(seatId)) {
      // Deseleccionar
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      // Seleccionar (máximo 4 asientos)
      if (selectedSeats.length < 4) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        Alert.alert('Límite alcanzado', 'Solo puedes seleccionar hasta 4 asientos');
      }
    }
  };
  
  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('Selección requerida', 'Debes seleccionar al menos un asiento');
      return;
    }
    
    // Navegar a la pantalla de confirmación
    router.push({
      pathname: '/(extras)/purchase-confirmation',
      params: { 
        tripId: tripId as string,
        seats: selectedSeats.join(',')
      }
    });
  };
  
  // Renderizar un asiento individual
  const renderSeat = (seat: BusSeat) => {
    const isSelected = selectedSeats.includes(seat.id);
    const isOccupied = seat.isOccupied;
    
    // Determinar el estilo según el tipo y estado del asiento
    let seatStyle = [styles.seat];
    let seatIconName = 'square-outline';
    let seatIconColor = Colors.gray400;
    
    if (isOccupied) {
      seatStyle.push(styles.occupiedSeat);
      seatIconName = 'close-circle';
      seatIconColor = Colors.danger;
    } else if (isSelected) {
      seatStyle.push(styles.selectedSeat);
      seatIconName = 'checkmark-circle';
      seatIconColor = Colors.primary;
    } else {
      if (seat.type === 'VIP') {
        seatStyle.push(styles.vipSeat);
        seatIconColor = Colors.warning;
      } else if (seat.type === 'discapacitado') {
        seatIconName = 'accessibility-outline';
        seatIconColor = Colors.info;
      }
    }
    
    return (
      <TouchableOpacity
        key={seat.id}
        style={seatStyle}
        onPress={() => !isOccupied && handleSeatPress(seat.id)}
        disabled={isOccupied}
      >
        <Ionicons name={seatIconName as any} size={24} color={seatIconColor} />
        <Text style={styles.seatNumber}>{seat.number}</Text>
      </TouchableOpacity>
    );
  };
  
  // Renderizar el layout del bus
  const renderBusLayout = () => {
    const { rows, seatsPerRow, aisleAfterSeat } = singleDeckBusLayout;
    const busRows = [];
    
    // Agrupar asientos por filas
    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      
      for (let col = 0; col < seatsPerRow; col++) {
        // Calcular el número de asiento basado en la fila y columna
        const seatIndex = row * seatsPerRow + col;
        const seat = busSeats[seatIndex];
        
        // Si es la posición del pasillo, agregar un espacio
        if (col === aisleAfterSeat) {
          rowSeats.push(
            <View key={`aisle-${row}-${col}`} style={styles.aisle} />
          );
        }
        
        // Si hay un asiento en esta posición, renderizarlo
        if (seat) {
          rowSeats.push(renderSeat(seat));
        } else {
          // Si no hay asiento (por ejemplo, para el conductor), mostrar un espacio vacío
          rowSeats.push(
            <View key={`empty-${row}-${col}`} style={styles.emptySeat} />
          );
        }
      }
      
      // Agregar la fila al layout del bus
      busRows.push(
        <View key={`row-${row}`} style={styles.seatRow}>
          {rowSeats}
        </View>
      );
    }
    
    return busRows;
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="light" />
        <Header title="Selección de Asientos" showBackButton />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" />
      <Header title="Selección de Asientos" showBackButton />
      
      <View style={styles.tripInfoContainer}>
        <Text style={styles.cooperativeName}>{tripData.cooperativeName}</Text>
        <Text style={styles.routeText}>
          {tripData.originCity} → {tripData.destinationCity}
        </Text>
        <Text style={styles.dateTimeText}>
          {formatDate(tripData.departureDate)} | {formatTime(tripData.departureTime)}
        </Text>
      </View>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <Ionicons name="square-outline" size={20} color={Colors.gray400} />
          <Text style={styles.legendText}>Disponible</Text>
        </View>
        <View style={styles.legendItem}>
          <Ionicons name="close-circle" size={20} color={Colors.danger} />
          <Text style={styles.legendText}>Ocupado</Text>
        </View>
        <View style={styles.legendItem}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
          <Text style={styles.legendText}>Seleccionado</Text>
        </View>
        <View style={styles.legendItem}>
          <Ionicons name="square-outline" size={20} color={Colors.warning} />
          <Text style={styles.legendText}>VIP</Text>
        </View>
      </View>
      
      <ScrollView style={styles.busLayoutContainer}>
        <View style={styles.busHeader}>
          <View style={styles.driverSeat}>
            <Ionicons name="car-outline" size={24} color={Colors.textSecondary} />
            <Text style={styles.driverText}>Conductor</Text>
          </View>
        </View>
        
        <View style={styles.busBody}>
          {renderBusLayout()}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.selectionInfo}>
          <Text style={styles.selectionText}>
            {selectedSeats.length} {selectedSeats.length === 1 ? 'asiento' : 'asientos'} seleccionados
          </Text>
          <Text style={styles.priceText}>
            Total: {formatCurrency(selectedSeats.length * tripData.price)}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedSeats.length === 0 ? styles.continueButtonDisabled : null
          ]}
          onPress={handleContinue}
          disabled={selectedSeats.length === 0}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripInfoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cooperativeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  routeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  dateTimeText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  busLayoutContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  busHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  driverSeat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  driverText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  busBody: {
    padding: 16,
    alignItems: 'center',
  },
  seatRow: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'center',
  },
  seat: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderRadius: 4,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  seatNumber: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  selectedSeat: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  occupiedSeat: {
    backgroundColor: Colors.danger + '10',
    borderColor: Colors.danger,
  },
  vipSeat: {
    backgroundColor: Colors.warning + '20',
    borderColor: Colors.warning,
  },
  emptySeat: {
    width: 40,
    height: 40,
    margin: 4,
    opacity: 0,
  },
  aisle: {
    width: 20,
    height: 40,
    margin: 4,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  selectionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectionText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: Colors.gray400,
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 