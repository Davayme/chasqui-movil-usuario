import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../common/constants/colors';
import { TicketFilter } from '../services/ticket-service';
import QRModal from './QRModal';

interface UITicket {
  id: string;
  orderNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  company: string;
  seats: string;
  price: number;
  status: string;
  statusText: string;
  passengerCount: number;
  qrCode?: string;
  qrBase64?: string;
  ticketId: number;
  passengers: {
    name: string;
    seat: string;
    type: string;
    price: number;
  }[];
}

interface TicketCardProps {
  ticket: UITicket;
  filter: TicketFilter;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, filter }) => {
  const [qrModalVisible, setQrModalVisible] = useState(false);

  const showQRModal = () => {
    setQrModalVisible(true);
  };

  const hideQRModal = () => {
    setQrModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.ticketCard}>
        <View style={styles.ticketHeader}>
          <Text style={styles.orderNumber}>{ticket.orderNumber}</Text>
          <View style={[
            styles.statusBadge, 
            filter === 'active' ? styles.activeBadge : styles.pastBadge
          ]}>
            <Text style={[
              styles.statusText,
              filter === 'active' ? styles.activeStatusText : styles.pastStatusText
            ]}>
              {ticket.statusText || (filter === 'active' ? 'Activo' : 'Pasado')}
            </Text>
          </View>
        </View>
        
        <View style={styles.routeContainer}>
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>{ticket.origin}</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.textSecondary} />
            <Text style={styles.locationText}>{ticket.destination}</Text>
          </View>
        </View>
        
        <View style={styles.ticketInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{ticket.departureDate}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{ticket.departureTime}</Text>
          </View>
        </View>
        
        <View style={styles.ticketInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="business-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{ticket.company}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="person-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{ticket.seats}</Text>
          </View>
        </View>

        {/* Mostrar información de precio */}
        <View style={styles.ticketInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="cash-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.infoText}>Total: ${ticket.price.toLocaleString()}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="people-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{ticket.passengerCount} pasajero(s)</Text>
          </View>
        </View>
        
        <View style={styles.ticketActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={showQRModal}
          >
            <Ionicons name="qr-code-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Ver QR</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Modal para mostrar el código QR */}
      <QRModal
        visible={qrModalVisible}
        onClose={hideQRModal}
        ticketId={ticket.ticketId.toString()}
        ticket={ticket}
        qrBase64={ticket.qrBase64}
      />
    </>
  );
};

const styles = StyleSheet.create({
  ticketCard: {
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
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeBadge: {
    backgroundColor: '#4CAF50' + '20',
  },
  pastBadge: {
    backgroundColor: '#9E9E9E' + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeStatusText: {
    color: '#4CAF50',
  },
  pastStatusText: {
    color: '#9E9E9E',
  },
  routeContainer: {
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  ticketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  ticketActions: {
    flexDirection: 'row',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default TicketCard;