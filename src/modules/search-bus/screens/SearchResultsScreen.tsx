import { Colors } from '@/src/common/constants/colors';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoResults from '../components/NoResults';
import ResultCount from '../components/ResultCount';
import SearchFilters, { FilterOptions } from '../components/SearchFilters';
import TripCard from '../components/TripCard';
import { TripSearchResult } from '../services/interfaces';
import { searchAvailableTrips } from '../services/mockData';

export default function SearchResultsScreen() {
  // Obtener los parámetros de búsqueda
  const params = useLocalSearchParams();
  const { origin, destination, date } = params;
  
  // Estado para los resultados de búsqueda
  const [trips, setTrips] = useState<TripSearchResult[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<TripSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Cargar los resultados de búsqueda
  useEffect(() => {
    console.log('SearchResultsScreen mounted');
    const loadTrips = async () => {
      setIsLoading(true);
      try {
        // Simular tiempo de carga
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Buscar viajes disponibles
        const results = searchAvailableTrips(
          origin as string, 
          destination as string, 
          date as string
        );
        
        console.log('Resultados de búsqueda:', results);
        setTrips(results);
        setFilteredTrips(results);
      } catch (error) {
        console.error('Error al cargar viajes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTrips();
  }, [origin, destination, date]);
  
  // Manejar la aplicación de filtros
  const handleApplyFilters = (filters: FilterOptions) => {
    let filtered = [...trips];
    
    // Filtrar por rango de tiempo
    if (filters.timeRange !== 'all') {
      filtered = filtered.filter(trip => {
        const hour = new Date(trip.departureTime).getHours();
        
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
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'time':
        filtered.sort((a, b) => 
          new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
        );
        break;
      case 'duration':
        // Como no tenemos duración real, usamos un valor fijo para este ejemplo
        break;
    }
    
    setFilteredTrips(filtered);
  };
  
  // Renderizar el componente
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['bottom']}>
        <StatusBar style="light" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" />
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
          keyExtractor={item => item.id.toString()}
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
  },
  listContainer: {
    padding: 16,
  },
});