import { Colors } from '@/src/common/constants/colors';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoResults from '../components/NoResults';
import ResultCount from '../components/ResultCount';
import SearchFilters, { FilterOptions } from '../components/SearchFilters';
import TripCard from '../components/TripCard';
import { TripSearchResult, searchAvailableTrips } from '../services/searchService';

export default function SearchResultsScreen() {
  // Obtener los parámetros de búsqueda
  const params = useLocalSearchParams();
  const { origin, destination, date } = params;
  
  // Estado para los resultados de búsqueda
  const [trips, setTrips] = useState<TripSearchResult[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<TripSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar los resultados de búsqueda
  useEffect(() => {
    console.log('SearchResultsScreen mounted');
    const loadTrips = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simular tiempo de carga
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Buscar viajes disponibles usando el endpoint real
        const results = await searchAvailableTrips(
          origin as string, 
          destination as string, 
          date as string
        );
        
        console.log('Resultados de búsqueda:', results);
        setTrips(results);
        setFilteredTrips(results);
      } catch (error) {
        console.error('Error al cargar viajes:', error);
        setError('No se pudieron cargar los viajes disponibles. Por favor, intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTrips();
  }, [origin, destination, date]);
  
  // Manejar la aplicación de filtros
  const handleApplyFilters = (filters: FilterOptions) => {
    let filtered = [...trips];
    
    // Filtrar por cooperativa
    if (filters.cooperative !== 'Todas') {
      filtered = filtered.filter(trip => 
        trip.cooperative.name.toLowerCase().includes(filters.cooperative.toLowerCase())
      );
    }
    
    // Filtrar por tipo de bus
    if (filters.busType !== 'Todos') {
      filtered = filtered.filter(trip => 
        trip.bus.busType.name.toLowerCase().includes(filters.busType.toLowerCase())
      );
    }
    
    // Filtrar por marca del chasis
    if (filters.chassisBrand !== 'Todos') {
      filtered = filtered.filter(trip => 
        trip.bus.chassisBrand.toLowerCase().includes(filters.chassisBrand.toLowerCase())
      );
    }
    
    // Filtrar por tipo de viaje (directo o con paradas)
    if (filters.tripType !== 'all') {
      if (filters.tripType === 'direct') {
        filtered = filtered.filter(trip => trip.frequency.intermediateStops.length === 0);
      } else if (filters.tripType === 'stops') {
        filtered = filtered.filter(trip => trip.frequency.intermediateStops.length > 0);
      }
    }
    
    // Filtrar por rango de tiempo
    if (filters.timeRange !== 'all') {
      filtered = filtered.filter(trip => {
        const hour = new Date(`2000-01-01T${trip.frequency.departureTime}`).getHours();
        
        switch (filters.timeRange) {
          case 'morning':
            return hour >= 5 && hour < 12;
          case 'afternoon':
            return hour >= 12 && hour < 18;
          case 'evening':
            return hour >= 18 || hour < 5;
          default:
            return true;
        }
      });
    }
    
    // Ordenar resultados
    switch (filters.sortBy) {
      case 'price':
        filtered.sort((a, b) => a.pricing.normalSeat.basePrice - b.pricing.normalSeat.basePrice);
        break;
      case 'time':
        filtered.sort((a, b) => {
          const timeA = new Date(`2000-01-01T${a.frequency.departureTime}`).getTime();
          const timeB = new Date(`2000-01-01T${b.frequency.departureTime}`).getTime();
          return timeA - timeB;
        });
        break;
      case 'duration':
        // Ordenar por duración estimada
        filtered.sort((a, b) => {
          const durationA = parseFloat(a.duration) || 0;
          const durationB = parseFloat(b.duration) || 0;
          return durationA - durationB;
        });
        break;
    }
    
    setFilteredTrips(filtered);
  };
  
  // Renderizar el componente
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <View style={styles.loadingContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.filtersContainer}>
        <ResultCount count={filteredTrips.length} />
        <SearchFilters onApplyFilters={handleApplyFilters} />
      </View>
      
      {filteredTrips.length === 0 ? (
        <NoResults />
      ) : (
        <FlatList
          data={filteredTrips}
          renderItem={({ item }) => <TripCard trip={item} />}
          keyExtractor={(item) => item.routeSheetDetailId.toString()}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
    paddingLeft: 16,
    paddingVertical: 12,
    paddingTop: 8,
    backgroundColor: '#fff',
    marginTop: -25,
  },
  listContainer: {
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});