import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../common/constants/colors';

export default function TravelTips() {
  const TRAVEL_TIPS = [
    {
      icon: 'time-outline',
      tip: 'Llega al terminal con al menos 30 minutos de anticipación',
    },
    {
      icon: 'card-outline',
      tip: 'Puedes pagar con tarjeta o efectivo en la mayoría de rutas',
    },
    {
      icon: 'umbrella-outline',
      tip: 'Verifica el pronóstico del tiempo antes de viajar',
    },
    {
      icon: 'bag-check-outline',
      tip: 'Equipaje permitido: 1 maleta grande y 1 de mano',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consejos para tu viaje</Text>
      
      {TRAVEL_TIPS.map((item, index) => (
        <View key={index} style={styles.tipItem}>
          <View style={styles.iconContainer}>
            <Ionicons name={item.icon as any} size={20} color="#fff" />
          </View>
          <Text style={styles.tipText}>{item.tip}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.textPrimary,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});