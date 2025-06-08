import { Colors } from '@/src/common/constants/colors';
import { getPassengerTypeName, getSeatLocationName, getSeatTypeName } from '@/src/modules/search-bus/services/formattingUtils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SeatDetailsProps {
  seats: {
    seatId: number;
    seatNumber: string;
    seatType: string;
    seatLocation: string;
    passengerType: string;
    price: number;
    discount: number;
    finalPrice: number;
  }[];
}

const SeatDetails: React.FC<SeatDetailsProps> = ({ seats }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Detalles de Asientos</Text>
      
      <View style={styles.seatsContainer}>
        {seats.map((seat) => (
          <View key={seat.seatId} style={styles.seatItem}>
            <View style={styles.seatNumberContainer}>
              <Text style={styles.seatNumber}>{seat.seatNumber}</Text>
            </View>
            
            <View style={styles.seatDetails}>
              <View style={styles.seatInfo}>
                <Text style={styles.seatType}>
                  {getSeatTypeName(seat.seatType)}
                </Text>
                <Text style={styles.seatLocation}>
                  {getSeatLocationName(seat.seatLocation)}
                </Text>
              </View>
              
              <View style={styles.passengerInfo}>
                <Ionicons name="person-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.passengerType}>
                  {getPassengerTypeName(seat.passengerType)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.seatMapContainer}>
        <Ionicons name="grid-outline" size={20} color={Colors.primary} />
        <Text style={styles.seatMapText}>
          {seats.length} {seats.length === 1 ? 'asiento seleccionado' : 'asientos seleccionados'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  seatsContainer: {
    marginBottom: 16,
  },
  seatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  seatNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  seatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  seatDetails: {
    flex: 1,
  },
  seatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  seatType: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginRight: 8,
  },
  seatLocation: {
    fontSize: 14,
    color: Colors.textSecondary,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerType: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  seatMapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  seatMapText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default SeatDetails; 