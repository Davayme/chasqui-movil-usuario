/* import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../common/constants/colors';

// Datos de ejemplo para los resultados de búsqueda
const MOCK_RESULTS = [
  {
    id: '1',
    company: 'Transportes Express',
    departureTime: '08:30',
    arrivalTime: '12:30',
    duration: '4h',
    price: '25.00',
    availableSeats: 23,
    busType: 'Ejecutivo',
  },
  {
    id: '2',
    company: 'Viajes Rápidos',
    departureTime: '09:45',
    arrivalTime: '14:00',
    duration: '4h 15m',
    price: '28.50',
    availableSeats: 15,
    busType: 'Premium',
  },
  {
    id: '3',
    company: 'Transportes Nacional',
    departureTime: '10:30',
    arrivalTime: '14:45',
    duration: '4h 15m',
    price: '22.00',
    availableSeats: 18,
    busType: 'Estándar',
  },
  {
    id: '4',
    company: 'Rutas Ecuador',
    departureTime: '12:00',
    arrivalTime: '16:30',
    duration: '4h 30m',
    price: '24.00',
    availableSeats: 30,
    busType: 'Ejecutivo',
  },
  {
    id: '5',
    company: 'Transportes Express',
    departureTime: '14:30',
    arrivalTime: '18:30',
    duration: '4h',
    price: '25.00',
    availableSeats: 5,
    busType: 'Premium',
  },
];

export default function SearchResultsScreen() {
  // Obtener los parámetros de búsqueda
  const params = useLocalSearchParams();
  const { origin, destination, date } = params;

  // Función para navegar a los detalles del viaje
  const handleSelectTrip = (tripId: string) => {
    router.push({
      pathname: '/(extras)/trip-detail',
      params: { tripId }
    });
  };

  // Renderizar cada elemento de la lista
  const renderTripItem = ({ item }: { item: typeof MOCK_RESULTS[0] }) => (
    <TouchableOpacity 
      style={styles.tripItem} 
      onPress={() => handleSelectTrip(item.id)}
    >
      <View style={styles.tripHeader}>
        <Text style={styles.companyName}>{item.company}</Text>
        <View style={styles.busTypeContainer}>
          <Text style={styles.busTypeText}>{item.busType}</Text>
        </View>
      </View>
      
      <View style={styles.tripDetails}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{item.departureTime}</Text>
          <View style={styles.durationContainer}>
            <View style={styles.durationLine} />
            <Text style={styles.durationText}>{item.duration}</Text>
            <View style={styles.durationLine} />
          </View>
          <Text style={styles.timeText}>{item.arrivalTime}</Text>
        </View>
        
        <View style={styles.seatsContainer}>
          <Ionicons name="person-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.seatsText}>{item.availableSeats} asientos</Text>
        </View>
      </View>
      
      <View style={styles.tripFooter}>
        <Text style={styles.priceText}>${item.price}</Text>
        <TouchableOpacity style={styles.selectButton}>
          <Text style={styles.selectButtonText}>Seleccionar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resultados de Búsqueda</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.searchInfoContainer}>
        <View style={styles.routeContainer}>
          <Text style={styles.routeText}>{origin} - {destination}</Text>
          <Text style={styles.dateText}>{date}</Text>
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color={Colors.primary} />
          <Text style={styles.filterText}>Filtrar</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.resultCount}>
        <Text style={styles.resultCountText}>{MOCK_RESULTS.length} viajes encontrados</Text>
      </View>
      
      <FlatList
        data={MOCK_RESULTS}
        renderItem={renderTripItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  searchInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  routeContainer: {
    flex: 1,
  },
  routeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  dateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 4,
  },
  filterText: {
    marginLeft: 6,
    color: Colors.primary,
    fontWeight: '500',
  },
  resultCount: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  resultCountText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  tripItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  busTypeContainer: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  busTypeText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  tripDetails: {
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  durationLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  durationText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginHorizontal: 8,
  },
  seatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seatsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  tripFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  selectButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});  */