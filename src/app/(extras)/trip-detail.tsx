import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../common/components/Header';
import { Colors } from '../../common/constants/colors';

// Datos de ejemplo para los detalles del viaje
const MOCK_TRIPS = {
  '1': {
    id: '1',
    company: 'Transportes Express',
    logo: '🚌',
    departureTime: '08:30',
    arrivalTime: '12:30',
    duration: '4h',
    price: '25.00',
    availableSeats: 23,
    busType: 'Ejecutivo',
    departureDate: '15 de mayo, 2023',
    origin: 'Quito',
    destination: 'Guayaquil',
    departureTerminal: 'Terminal Terrestre de Quitumbe',
    arrivalTerminal: 'Terminal Terrestre de Guayaquil',
    amenities: ['Aire acondicionado', 'WiFi', 'Asientos reclinables', 'Baño'],
    rating: 4.5,
  },
  '2': {
    id: '2',
    company: 'Viajes Rápidos',
    logo: '🚌',
    departureTime: '09:45',
    arrivalTime: '14:00',
    duration: '4h 15m',
    price: '28.50',
    availableSeats: 15,
    busType: 'Premium',
    departureDate: '15 de mayo, 2023',
    origin: 'Quito',
    destination: 'Guayaquil',
    departureTerminal: 'Terminal Terrestre de Quitumbe',
    arrivalTerminal: 'Terminal Terrestre de Guayaquil',
    amenities: ['Aire acondicionado', 'WiFi', 'Asientos reclinables', 'Baño', 'TV'],
    rating: 4.2,
  },
};

export default function TripDetailScreen() {
  // Obtener el ID del viaje desde los parámetros
  const { tripId } = useLocalSearchParams();
  const trip = MOCK_TRIPS[tripId as keyof typeof MOCK_TRIPS];

  // Función para continuar al proceso de selección de asientos
  const handleContinue = () => {
    router.push({
      pathname: '/(extras)/search-results',
      params: { tripId: trip.id }
    });
  };

  if (!trip) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Header 
          title="Detalle de Viaje"
          showBackButton
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se encontró información del viaje</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" />
      
      <Header 
        title="Detalle de Viaje"
        showBackButton
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.companyCard}>
          <View style={styles.companyLogo}>
            <Text style={styles.logoText}>{trip.logo}</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{trip.company}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{trip.rating}</Text>
            </View>
          </View>
          <View style={styles.busTypeContainer}>
            <Text style={styles.busTypeText}>{trip.busType}</Text>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Detalles del Viaje</Text>
          
          <View style={styles.tripDetail}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="calendar-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.detailLabel}>Fecha:</Text>
            <Text style={styles.detailValue}>{trip.departureDate}</Text>
          </View>
          
          <View style={styles.routeContainer}>
            <View style={styles.timelineContainer}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineLine} />
              <View style={[styles.timelineDot, styles.timelineDotEnd]} />
            </View>
            
            <View style={styles.routeInfo}>
              <View style={styles.routePoint}>
                <Text style={styles.routeTime}>{trip.departureTime}</Text>
                <View>
                  <Text style={styles.routeLocation}>{trip.origin}</Text>
                  <Text style={styles.routeTerminal}>{trip.departureTerminal}</Text>
                </View>
              </View>
              
              <View style={styles.durationContainer}>
                <Text style={styles.durationText}>{trip.duration}</Text>
              </View>
              
              <View style={styles.routePoint}>
                <Text style={styles.routeTime}>{trip.arrivalTime}</Text>
                <View>
                  <Text style={styles.routeLocation}>{trip.destination}</Text>
                  <Text style={styles.routeTerminal}>{trip.arrivalTerminal}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Servicios del Bus</Text>
          
          <View style={styles.amenitiesContainer}>
            {trip.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Ionicons 
                  name={getAmenityIcon(amenity)} 
                  size={22} 
                  color={Colors.primary} 
                  style={styles.amenityIcon} 
                />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Información Adicional</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.infoText}>Presentarse 30 minutos antes de la salida</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="bag-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.infoText}>Equipaje permitido: 1 maleta de 23 kg</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="card-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.infoText}>Métodos de pago: Efectivo, tarjeta de crédito/débito</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Precio:</Text>
          <Text style={styles.priceValue}>${trip.price}</Text>
        </View>
        
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Función auxiliar para obtener el icono según el tipo de amenidad
function getAmenityIcon(amenity: string): any {
  switch (amenity) {
    case 'Aire acondicionado':
      return 'snow-outline';
    case 'WiFi':
      return 'wifi-outline';
    case 'Asientos reclinables':
      return 'bed-outline';
    case 'Baño':
      return 'water-outline';
    case 'TV':
      return 'tv-outline';
    default:
      return 'checkmark-circle-outline';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  companyCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 24,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  detailLabel: {
    width: 60,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  routeContainer: {
    flexDirection: 'row',
    paddingLeft: 10,
  },
  timelineContainer: {
    width: 20,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.primary,
    marginVertical: 4,
  },
  timelineDotEnd: {
    backgroundColor: Colors.accent,
  },
  routeInfo: {
    flex: 1,
    marginLeft: 10,
  },
  routePoint: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  routeTime: {
    width: 60,
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  routeLocation: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  routeTerminal: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  durationContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  durationText: {
    fontSize: 12,
    color: Colors.textSecondary,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  amenityIcon: {
    marginRight: 8,
  },
  amenityText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 10,
    flex: 1,
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});