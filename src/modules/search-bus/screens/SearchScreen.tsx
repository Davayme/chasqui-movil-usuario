import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { showToast } from '../../../common/components/Toast';
import { Colors } from '../../../common/constants/colors';
import { useAuth } from '../../../common/context/AuthContext';
import FormSearchBus from '../components/formSearchbus';
import ServiceInfo from '../components/searchInfo';
import TravelTips from '../components/traverlsTips';

export default function SearchScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const handleSearch = (origin: string, destination: string, date: string) => {
    if (!origin || !destination || !date) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Por favor completa todos los campos'
      });
      return;
    }

    router.navigate({
      pathname: '/(extras)/search-results' as any,
      params: { origin, destination, date }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Cabecera personalizada integrada */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Chasqui-Go</Text>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Hola, {user?.firstName || 'Usuario'}</Text>
          <Text style={styles.subtitle}>¿A dónde viajas hoy?</Text>
        </View>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: 80 + insets.bottom } // Aseguramos espacio para la navegación
        ]}
        showsVerticalScrollIndicator={false}
      >
        <FormSearchBus onSearch={handleSearch} />
        <ServiceInfo />
        <TravelTips />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 40, // Espacio para la barra de estado
    paddingHorizontal: 20,
    paddingBottom: 20,

  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeContainer: {
    marginTop: 5,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingTop: 20,
  }
});