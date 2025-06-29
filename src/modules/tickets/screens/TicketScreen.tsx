import { useAuth } from '@/src/common/context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../common/constants/colors';
import TicketFilters from '../components/ticketFilters';
import TicketList from '../components/ticketList';
import {
  BackendTicket,
  filterTicketsByStatus,
  getTicketsHistory,
  mapBackendTicketToUI,
  TicketFilter
} from '../services/ticket-service';

export default function TicketScreen() {
  const [filter, setFilter] = useState<TicketFilter>('active');
  const [tickets, setTickets] = useState<BackendTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadTickets = useCallback(async () => {
    if (!user?.id) {
      setError('Usuario no autenticado');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Cargando tickets para usuario:', user.id);
      
      // Obtener tickets del backend (sin incluir QR por ahora para mejor rendimiento)
      const response = await getTicketsHistory(user.id, false);
      
      console.log('Tickets obtenidos:', response);
      setTickets(response.tickets);
    } catch (error) {
      console.error('Error al cargar tickets:', error);
      
      // Si el error indica que no hay tickets, no mostrarlo como error
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      if (errorMessage.toLowerCase().includes('no tickets found') || 
          errorMessage.toLowerCase().includes('no se encontraron tickets')) {
        console.log('No se encontraron tickets para el usuario');
        setTickets([]);
      } else {
        setError('No se pudieron cargar los tickets. Por favor, intente nuevamente.');
        
        Alert.alert(
          'Error',
          'No se pudieron cargar los tickets. Verifique su conexión a internet.',
          [
            {
              text: 'Reintentar',
              onPress: loadTickets
            },
            {
              text: 'Cancelar',
              style: 'cancel'
            }
          ]
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Cargar tickets al montar el componente
  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Filtrar y mapear tickets para la UI
  const getFilteredTickets = () => {
    const filteredTickets = filterTicketsByStatus(tickets, filter);
    return filteredTickets.map(mapBackendTicketToUI);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Cargando tickets...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StatusBar style="light" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const filteredTickets = getFilteredTickets();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" />
      
      <TicketFilters 
        filter={filter} 
        onFilterChange={setFilter} 
        ticketCount={filteredTickets.length}
        totalTickets={tickets.length}
      />
      
      <TicketList 
        tickets={filteredTickets}
        filter={filter}
        onRefresh={loadTickets}
        isRefreshing={isLoading}
      />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textSecondary,
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
});