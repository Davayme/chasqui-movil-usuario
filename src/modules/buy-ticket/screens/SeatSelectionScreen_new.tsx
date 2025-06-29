import { Colors } from '@/src/common/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatTimeFromString } from '../../search-bus/services/formattingUtils';
import { BusSeatsResponse, Seat, fetchBusSeats } from '../services/seatService';

export default function SeatSelectionScreen() {
  const params = useLocalSearchParams();
  const { tripId } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [busData, setBusData] = useState<BusSeatsResponse | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [currentFloor, setCurrentFloor] = useState(1);
  
  useEffect(() => {
    const loadBusSeats = async () => {
      setIsLoading(true);
      try {
        const data = await fetchBusSeats(parseInt(tripId as string));
        if (data) {
          setBusData(data);
          // Si hay pisos disponibles, establecer el primer piso como actual
          if (data.seatsLayout.length > 0) {
            setCurrentFloor(data.seatsLayout[0].floor);
          }
        } else {
          Alert.alert('Error', 'No se pudieron cargar los asientos del bus');
        }
      } catch (error) {
        console.error('Error al cargar asientos:', error);
        Alert.alert('Error', 'No se pudieron cargar los asientos del bus');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (tripId) {
      loadBusSeats();
    }
  }, [tripId]);
  
  const handleSeatPress = (seatId: number, seat: Seat) => {
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
    
    // Obtener información de los asientos seleccionados
    const selectedSeatData = getCurrentFloorSeats()
      .filter(seat => selectedSeats.includes(seat.id))
      .map(seat => ({
        id: seat.id,
        number: seat.number,
        type: seat.type,
        location: seat.location
      }));
    
    // Navegar a la pantalla de confirmación
    router.push({
      pathname: '/(extras)/seat-details',
      params: { 
        tripId: tripId as string,
        seats: JSON.stringify(selectedSeatData),
        routeInfo: JSON.stringify(busData?.routeInfo),
        pricing: JSON.stringify(busData?.pricing)
      }
    });
  };
  
  const getCurrentFloorSeats = (): Seat[] => {
    if (!busData?.seatsLayout) return [];
    
    const floor = busData.seatsLayout.find(f => f.floor === currentFloor);
    return floor?.seats || [];
  };
  
  const handleFloorChange = (floor: number) => {
    setCurrentFloor(floor);
    // Limpiar selecciones al cambiar de piso
    setSelectedSeats([]);
  };
  
  // Renderizar un asiento individual
  const renderSeat = (seat: Seat) => {
    const isSelected = selectedSeats.includes(seat.id);
    const isOccupied = seat.isOccupied;
    
    // Determinar el estilo según el tipo y estado del asiento
    let seatStyle: any[] = [styles.seat];
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
      }
    }
    
    return (
      <TouchableOpacity
        key={seat.id}
        style={seatStyle}
        onPress={() => !isOccupied && handleSeatPress(seat.id, seat)}
        disabled={isOccupied}
      >
        <Ionicons name={seatIconName as any} size={20} color={seatIconColor} />
        <Text style={styles.seatNumber}>{seat.number}</Text>
      </TouchableOpacity>
    );
  };
  
  // Agrupar asientos por filas según su ubicación real
  const groupSeatsByRow = () => {
    const currentSeats = getCurrentFloorSeats();
    const rows: { [key: number]: Seat[] } = {};
    const middleSeats: Seat[] = [];

    currentSeats.forEach((seat) => {
      // Si es un asiento del medio, lo guardamos por separado
      if (seat.location === 'MIDDLE') {
        middleSeats.push(seat);
      } else {
        // Determinar la fila basándose en los datos del backend
        // En un bus estándar de 4 asientos por fila (2-2), calculamos la fila
        let rowNumber: number;
        
        // Calcular fila basándose en el número del asiento
        // Asumiendo que cada 4 asientos consecutivos forman una fila
        rowNumber = Math.floor((Number(seat.number) - 1) / 4) + 1;
        
        if (!rows[rowNumber]) {
          rows[rowNumber] = [];
        }
        rows[rowNumber].push(seat);
      }
    });

    // Ordenar asientos dentro de cada fila por ubicación
    Object.keys(rows).forEach((rowKey) => {
      const rowNumber = parseInt(rowKey);
      const locationOrder = { 
        'WINDOW_LEFT': 0, 
        'AISLE_LEFT': 1, 
        'AISLE_RIGHT': 2, 
        'WINDOW_RIGHT': 3 
      };
      
      rows[rowNumber].sort((a, b) => {
        const orderA = locationOrder[a.location as keyof typeof locationOrder] ?? 999;
        const orderB = locationOrder[b.location as keyof typeof locationOrder] ?? 999;
        return orderA - orderB;
      });
    });

    return { rows, middleSeats };
  };

  // Renderizar el layout del bus por filas
  const renderBusLayout = () => {
    const currentSeats = getCurrentFloorSeats();
    if (currentSeats.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No hay asientos disponibles en este piso</Text>
        </View>
      );
    }
    
    const { rows, middleSeats } = groupSeatsByRow();
    const rowNumbers = Object.keys(rows).map(Number).sort((a, b) => a - b);
    
    return (
      <>
        {/* Renderizar filas normales */}
        {rowNumbers.map((rowNumber) => {
          const rowSeats = rows[rowNumber];
          
          // Separar asientos por ubicación
          const windowLeft = rowSeats.find(seat => seat.location === 'WINDOW_LEFT');
          const aisleLeft = rowSeats.find(seat => seat.location === 'AISLE_LEFT');
          const aisleRight = rowSeats.find(seat => seat.location === 'AISLE_RIGHT');
          const windowRight = rowSeats.find(seat => seat.location === 'WINDOW_RIGHT');
          
          return (
            <View key={rowNumber} style={styles.seatRow}>
              {/* Lado izquierdo (Ventana izquierda + Pasillo izquierdo) */}
              <View style={styles.seatSide}>
                {windowLeft && renderSeat(windowLeft)}
                {aisleLeft && renderSeat(aisleLeft)}
              </View>
              
              {/* Pasillo central */}
              <View style={styles.aisle} />
              
              {/* Lado derecho (Pasillo derecho + Ventana derecha) */}
              <View style={styles.seatSide}>
                {aisleRight && renderSeat(aisleRight)}
                {windowRight && renderSeat(windowRight)}
              </View>
            </View>
          );
        })}

        {/* Renderizar asientos del medio al final */}
        {middleSeats.length > 0 && (
          <View style={styles.seatRow}>
            <View style={styles.middleSeatContainer}>
              {middleSeats.map(seat => renderSeat(seat))}
            </View>
          </View>
        )}
      </>
    );
  };
  
  // Renderizar botones de piso si hay múltiples pisos
  const renderFloorSelector = () => {
    if (!busData?.seatsLayout || busData.seatsLayout.length <= 1) {
      return null;
    }
    
    return (
      <View style={styles.floorSelectorContainer}>
        <Text style={styles.floorSelectorTitle}>Seleccionar Piso:</Text>
        <View style={styles.floorButtons}>
          {busData.seatsLayout.map((layout) => (
            <TouchableOpacity
              key={layout.floor}
              style={[
                styles.floorButton,
                currentFloor === layout.floor && styles.floorButtonActive
              ]}
              onPress={() => handleFloorChange(layout.floor)}
            >
              <Text style={[
                styles.floorButtonText,
                currentFloor === layout.floor && styles.floorButtonTextActive
              ]}>
                Piso {layout.floor}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  

  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="light" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Cargando asientos...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (!busData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={48} color={Colors.danger} />
          <Text style={styles.errorText}>No se pudieron cargar los asientos</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
            <Text style={styles.retryButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" /> 
      
      {/* Información del viaje */}
      <View style={styles.tripInfoContainer}>
        <Text style={styles.cooperativeName}>
          {busData.busInfo?.chassisBrand} {busData.busInfo?.bodyworkBrand}
        </Text>
        <Text style={styles.routeText}>
          {busData.routeInfo?.frequency?.originCity} → {busData.routeInfo?.frequency?.destinationCity}
        </Text>
        <Text style={styles.dateTimeText}>
          {busData.routeInfo?.date} | {formatTimeFromString(busData.routeInfo?.frequency?.departureTime)}
        </Text>
        <Text style={styles.busInfoText}>
          Placa: {busData.busInfo?.licensePlate} | {busData.busInfo?.busType?.name}
        </Text>
      </View>
      
      {/* Selector de piso */}
      {renderFloorSelector()}
      
      {/* Leyenda */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <Ionicons name="square-outline" size={16} color={Colors.gray400} />
          <Text style={styles.legendText}>Disponible</Text>
        </View>
        <View style={styles.legendItem}>
          <Ionicons name="close-circle" size={16} color={Colors.danger} />
          <Text style={styles.legendText}>Ocupado</Text>
        </View>
        <View style={styles.legendItem}>
          <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
          <Text style={styles.legendText}>Seleccionado</Text>
        </View>
        <View style={styles.legendItem}>
          <Ionicons name="square-outline" size={16} color={Colors.warning} />
          <Text style={styles.legendText}>VIP</Text>
        </View>
      </View>
      
      {/* Layout del bus */}
      <ScrollView style={styles.busLayoutContainer}>
        <View style={styles.busHeader}>
          <View style={styles.driverSeat}>
            <Ionicons name="car-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.driverText}>Conductor</Text>
          </View>
        </View>
        
        <View style={styles.busBody}>
          {renderBusLayout()}
        </View>
        
        {/* Información de disponibilidad */}
        {busData.availability && (
          <View style={styles.availabilityContainer}>
            <Text style={styles.availabilityTitle}>Disponibilidad del Bus:</Text>
            <View style={styles.availabilityStats}>
              <View style={styles.availabilityStat}>
                <Text style={styles.availabilityLabel}>Normal:</Text>
                <Text style={styles.availabilityValue}>
                  {busData.availability.normal.available}/{busData.availability.normal.total}
                </Text>
              </View>
              <View style={styles.availabilityStat}>
                <Text style={styles.availabilityLabel}>VIP:</Text>
                <Text style={styles.availabilityValue}>
                  {busData.availability.vip.available}/{busData.availability.vip.total}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      
      {/* Footer con información y botón continuar */}
      <View style={styles.footer}>
        <View style={styles.selectionInfo}>
          <Text style={styles.selectionText}>
            {selectedSeats.length} {selectedSeats.length === 1 ? 'asiento' : 'asientos'} seleccionados
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    marginBottom: 4,
  },
  busInfoText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  floorSelectorContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  floorSelectorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  floorButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  floorButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  floorButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  floorButtonText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  floorButtonTextActive: {
    color: '#fff',
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
    fontSize: 11,
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
  emptyStateContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  seatRow: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatSide: {
    flexDirection: 'row',
  },
  seat: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 4,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  seatNumber: {
    fontSize: 8,
    color: Colors.textSecondary,
    marginTop: 1,
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
  aisle: {
    width: 24,
    height: 36,
    margin: 2,
  },
  availabilityContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  availabilityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  availabilityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  availabilityStat: {
    alignItems: 'center',
  },
  availabilityLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  availabilityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
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
  middleSeatContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
