import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../common/constants/colors';
import { Ticket, TicketFilter } from '../services/data';

interface TicketCardProps {
  ticket: Ticket;
  filter: TicketFilter;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, filter }) => {
  return (
    <TouchableOpacity style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.orderNumber}>{ticket.orderNumber}</Text>
        <View style={[
          styles.statusBadge, 
          filter === 'active' ? styles.activeBadge : styles.pastBadge
        ]}>
          <Text style={styles.statusText}>
            {filter === 'active' ? 'Activo' : 'Pasado'}
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
          <Text style={styles.infoText}>Asiento: {ticket.seat}</Text>
        </View>
      </View>
      
      <View style={styles.ticketActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="qr-code-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Ver QR</Text>
        </TouchableOpacity>
        
        {filter === 'active' && (
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]}>
            <Ionicons name="download-outline" size={20} color={Colors.primary} />
            <Text style={styles.actionButtonTextSecondary}>Descargar</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
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
    color: '#4CAF50',
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
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  actionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  actionButtonTextSecondary: {
    color: Colors.primary,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default TicketCard;