import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showToast } from '../../common/components/Toast';
import { Colors } from '../../common/constants/colors';
import { useAuth } from '../../common/context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  // Función para buscar viajes
  const handleSearch = () => {
    if (!origin || !destination || !date) {
      // Mostrar alerta de campos incompletos
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Por favor completa todos los campos'
      });
      return;
    }

    // En una implementación real, aquí redirigiríamos a la pantalla de resultados
    // con los parámetros de búsqueda
    router.navigate({
      pathname: '/(extras)/search-results' as any,
      params: { origin, destination, date }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Hola, {user?.firstName || 'Usuario'}</Text>
        <Text style={styles.subtitle}>¿A dónde viajas hoy?</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.searchCard}>
          <Text style={styles.searchTitle}>Buscar Viaje</Text>
          
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={22} color={Colors.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ciudad de origen"
              value={origin}
              onChangeText={setOrigin}
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Ionicons name="navigate-outline" size={22} color={Colors.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ciudad de destino"
              value={destination}
              onChangeText={setDestination}
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={22} color={Colors.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Fecha de viaje"
              value={date}
              onChangeText={setDate}
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
          
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Buscar Viajes</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.popularDestinations}>
          <Text style={styles.sectionTitle}>Destinos Populares</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {popularDestinations.map((destination, index) => (
              <TouchableOpacity key={index} style={styles.destinationCard}>
                <View style={styles.destinationImageContainer}>
                  <Ionicons name="image-outline" size={30} color="#fff" />
                </View>
                <Text style={styles.destinationName}>{destination.name}</Text>
                <Text style={styles.destinationPrice}>Desde ${destination.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.promotions}>
          <Text style={styles.sectionTitle}>Promociones</Text>
          
          {promotions.map((promotion, index) => (
            <TouchableOpacity key={index} style={styles.promotionCard}>
              <View style={styles.promotionContent}>
                <Text style={styles.promotionTitle}>{promotion.title}</Text>
                <Text style={styles.promotionDescription}>{promotion.description}</Text>
                <Text style={styles.promotionDiscount}>{promotion.discount}</Text>
              </View>
              <View style={styles.promotionIconContainer}>
                <Ionicons name="pricetag-outline" size={30} color="#fff" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Datos de ejemplo
const popularDestinations = [
  { name: 'Quito', price: '25.00' },
  { name: 'Guayaquil', price: '30.00' },
  { name: 'Cuenca', price: '20.00' },
  { name: 'Manta', price: '15.00' },
  { name: 'Loja', price: '22.00' },
];

const promotions = [
  { 
    title: 'Descuento Estudiante', 
    description: 'Viaja con 20% de descuento presentando tu carnet estudiantil', 
    discount: '20% OFF'
  },
  { 
    title: 'Oferta Fin de Semana', 
    description: 'Viajes los sábados y domingos con tarifas especiales', 
    discount: '15% OFF'
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.textPrimary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  popularDestinations: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.textPrimary,
  },
  horizontalScroll: {
    paddingRight: 20,
  },
  destinationCard: {
    width: 140,
    marginRight: 12,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  destinationImageContainer: {
    height: 100,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    padding: 10,
    paddingBottom: 4,
  },
  destinationPrice: {
    fontSize: 14,
    color: Colors.primary,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  promotions: {
    marginBottom: 20,
  },
  promotionCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  promotionContent: {
    flex: 1,
    padding: 15,
  },
  promotionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  promotionDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  promotionDiscount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  promotionIconContainer: {
    width: 60,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
