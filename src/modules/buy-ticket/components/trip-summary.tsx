import { Colors } from '@/src/common/constants/colors';
import { formatDate, formatTime } from '@/src/modules/search-bus/services/formattingUtils';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TripSummaryProps {
  tripInfo: {
    routeSheetId: number;
    date: Date;
    departureTime: Date;
    originCity: string;
    destinationCity: string;
    cooperativeName: string;
    cooperativeLogo: string;
    busLicensePlate: string;
  };
}

const TripSummary: React.FC<TripSummaryProps> = ({ tripInfo }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Resumen del Viaje</Text>
      
      <View style={styles.cooperativeContainer}>
        <Image 
          source={{ uri: tripInfo.cooperativeLogo }} 
          style={styles.logo}
          contentFit="contain"
        />
        <View style={styles.cooperativeInfo}>
          <Text style={styles.cooperativeName}>{tripInfo.cooperativeName}</Text>
          <Text style={styles.busInfo}>Bus: {tripInfo.busLicensePlate}</Text>
        </View>
      </View>
      
      <View style={styles.routeContainer}>
        <View style={styles.routePoint}>
          <View style={styles.routeIconContainer}>
            <Ionicons name="location" size={20} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.routeLabel}>Origen</Text>
            <Text style={styles.routeCity}>{tripInfo.originCity}</Text>
          </View>
        </View>
        
        <View style={styles.routeConnector}>
          <View style={styles.routeLine} />
        </View>
        
        <View style={styles.routePoint}>
          <View style={styles.routeIconContainer}>
            <Ionicons name="flag" size={20} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.routeLabel}>Destino</Text>
            <Text style={styles.routeCity}>{tripInfo.destinationCity}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.dateTimeContainer}>
        <View style={styles.dateTimeItem}>
          <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} />
          <Text style={styles.dateTimeText}>{formatDate(tripInfo.date)}</Text>
        </View>
        
        <View style={styles.dateTimeItem}>
          <Ionicons name="time-outline" size={20} color={Colors.textSecondary} />
          <Text style={styles.dateTimeText}>{formatTime(tripInfo.departureTime)}</Text>
        </View>
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
  cooperativeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  cooperativeInfo: {
    flex: 1,
  },
  cooperativeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  busInfo: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  routeContainer: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  routeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  routeLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  routeCity: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  routeConnector: {
    marginLeft: 18,
    height: 20,
  },
  routeLine: {
    width: 2,
    height: '100%',
    backgroundColor: '#e0e0e0',
    marginLeft: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
});

export default TripSummary; 