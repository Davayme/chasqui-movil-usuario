import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../common/components/Header';
import { Colors } from '../../common/constants/colors';
import { useAuth } from '../../common/context/AuthContext';

// Datos de ejemplo para los boletos
const MOCK_TICKETS = [
  {
    id: '1',
    orderNumber: 'T-12345',
    origin: 'Quito',
    destination: 'Guayaquil',
    departureDate: '15 de mayo, 2023',
    departureTime: '08:30',
    company: 'Transportes Express',
    seat: '24',
    status: 'active', // active o past
  },
  {
    id: '2',
    orderNumber: 'T-12346',
    origin: 'Cuenca',
    destination: 'Quito',
    departureDate: '20 de mayo, 2023',
    departureTime: '10:45',
    company: 'Viajes Rápidos',
    seat: '15',
    status: 'active',
  },
  {
    id: '3',
    orderNumber: 'T-12347',
    origin: 'Guayaquil',
    destination: 'Manta',
    departureDate: '25 de mayo, 2023',
    departureTime: '14:15',
    company: 'Transportes Nacional',
    seat: '8',
    status: 'active',
  },
  {
    id: '4',
    orderNumber: 'T-12330',
    origin: 'Quito',
    destination: 'Loja',
    departureDate: '1 de mayo, 2023',
    departureTime: '07:30',
    company: 'Rutas Ecuador',
    seat: '16',
    status: 'past',
  },
  {
    id: '5',
    orderNumber: 'T-12321',
    origin: 'Manta',
    destination: 'Guayaquil',
    departureDate: '5 de mayo, 2023',
    departureTime: '09:00',
    company: 'Transportes Express',
    seat: '22',
    status: 'past',
  },
];

// Tipo de filtro de boletos
type TicketFilter = 'active' | 'past';

export default function TicketsScreen() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<TicketFilter>('active');

  // Filtrar boletos según el estado
  const filteredTickets = MOCK_TICKETS.filter(ticket => ticket.status === filter);

  // Renderizar cada elemento de la lista
  const renderTicketItem = ({ item }: { item: typeof MOCK_TICKETS[0] }) => (
    <TouchableOpacity style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
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
          <Text style={styles.locationText}>{item.origin}</Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.textSecondary} />
          <Text style={styles.locationText}>{item.destination}</Text>
        </View>
      </View>
      
      <View style={styles.ticketInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{item.departureDate}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{item.departureTime}</Text>
        </View>
      </View>
      
      <View style={styles.ticketInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="business-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{item.company}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.infoText}>Asiento: {item.seat}</Text>
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

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" />
      
      <Header title="Mis Boletos" />
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
          onPress={() => setFilter('active')}
        >
          <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
            Boletos Activos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'past' && styles.filterButtonActive]}
          onPress={() => setFilter('past')}
        >
          <Text style={[styles.filterText, filter === 'past' && styles.filterTextActive]}>
            Boletos Pasados
          </Text>
        </TouchableOpacity>
      </View>
      
      {filteredTickets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="ticket-outline" size={80} color={Colors.textSecondary} style={styles.emptyIcon} />
          <Text style={styles.emptyText}>
            {filter === 'active' 
              ? 'No tienes boletos activos por el momento' 
              : 'No se encontraron boletos pasados'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTickets}
          renderItem={renderTicketItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 4,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary + '20',
  },
  filterText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
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
