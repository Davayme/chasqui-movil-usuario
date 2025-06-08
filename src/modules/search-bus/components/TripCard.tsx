import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../common/constants/colors';
import { formatCurrency, formatDuration, formatTime } from '../services/formattingUtils';
import { TripSearchResult } from '../services/interfaces';

interface TripCardProps {
  trip: TripSearchResult;
}

export default function TripCard({ trip }: TripCardProps) {
  // Calcular la hora de llegada estimada (departureTime + 4 horas por defecto)
  const estimatedArrivalTime = new Date(trip.departureTime);
  estimatedArrivalTime.setHours(estimatedArrivalTime.getHours() + 4);
  
  // Función para navegar a los detalles del viaje
  const handleSelectTrip = () => {
    router.push({
      pathname: '/(extras)/seat-selection',
      params: { tripId: trip.id.toString() }
    });
  };

  return (
    <TouchableOpacity 
      style={styles.tripItem} 
      onPress={handleSelectTrip}
      activeOpacity={0.7}
    >
      <View style={styles.tripHeader}>
        <View style={styles.companyContainer}>
          <Image 
            source={{ uri: trip.cooperativeLogo }} 
            style={styles.companyLogo}
            contentFit="contain"
          />
          <Text style={styles.companyName}>{trip.cooperativeName}</Text>
        </View>
        <View style={styles.busTypeContainer}>
          <Text style={styles.busTypeText}>
            {trip.busDetails.floorCount > 1 ? 'Dos Pisos' : 'Ejecutivo'}
          </Text>
        </View>
      </View>
      
      <View style={styles.tripDetails}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(trip.departureTime)}</Text>
          <View style={styles.durationContainer}>
            <View style={styles.durationLine} />
            <Text style={styles.durationText}>
              {formatDuration(trip.departureTime, estimatedArrivalTime)}
            </Text>
            <View style={styles.durationLine} />
          </View>
          <Text style={styles.timeText}>{formatTime(estimatedArrivalTime)}</Text>
        </View>
        
        <View style={styles.routeContainer}>
          <Text style={styles.cityText}>{trip.originCity}</Text>
          <Text style={styles.cityText}>{trip.destinationCity}</Text>
        </View>
        
        {trip.intermediateStops.length > 0 && (
          <View style={styles.stopsContainer}>
            <Ionicons name="ellipsis-horizontal" size={16} color={Colors.textSecondary} />
            <Text style={styles.stopsText}>
              {trip.intermediateStops.length} {trip.intermediateStops.length === 1 ? 'parada' : 'paradas'} intermedias
            </Text>
          </View>
        )}
        
        <View style={styles.seatsContainer}>
          <Ionicons 
            name={trip.availableSeats < 10 ? "alert-circle-outline" : "person-outline"} 
            size={16} 
            color={trip.availableSeats < 10 ? Colors.warning : Colors.textSecondary} 
          />
          <Text 
            style={[
              styles.seatsText,
              trip.availableSeats < 10 ? styles.seatsWarning : null
            ]}
          >
            {trip.availableSeats} de {trip.totalSeats} asientos disponibles
          </Text>
        </View>
      </View>
      
      <View style={styles.tripFooter}>
        <Text style={styles.priceText}>{formatCurrency(trip.price)}</Text>
        <TouchableOpacity 
          style={styles.selectButton}
          onPress={handleSelectTrip}
        >
          <Text style={styles.selectButtonText}>Seleccionar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyLogo: {
    width: 30,
    height: 30,
    marginRight: 8,
    borderRadius: 15,
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cityText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  stopsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stopsText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
    fontStyle: 'italic',
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
  seatsWarning: {
    color: Colors.warning,
    fontWeight: '500',
  },
  tripFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
}); 