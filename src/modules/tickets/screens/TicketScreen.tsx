import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../common/components/Header';
import TicketFilters from '../components/ticketFilters';
import TicketList from '../components/ticketList';
import { MOCK_TICKETS, TicketFilter } from '../services/data';

export default function TicketScreen() {
  const [filter, setFilter] = useState<TicketFilter>('active');

  // Filtrar boletos según el estado
  const filteredTickets = MOCK_TICKETS.filter(ticket => ticket.status === filter);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" />
      
      <Header title="Mis Boletos" />
      
      <TicketFilters 
        filter={filter} 
        onFilterChange={setFilter} 
      />
      
      <TicketList 
        tickets={filteredTickets}
        filter={filter}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});