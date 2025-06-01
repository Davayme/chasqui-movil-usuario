import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../common/constants/colors';

export default function ServiceInfo() {
  const SERVICE_INFO = [
    {
      icon: 'shield-checkmark-outline',
      title: 'Viajes Seguros',
      description: 'Todos nuestros transportistas están verificados y cumplen con los estándares de seguridad.'
    },
    {
      icon: 'cash-outline',
      title: 'Sin cargos ocultos',
      description: 'El precio que ves es el precio final que pagas, sin sorpresas.'
    },
    {
      icon: 'star-outline',
      title: 'Servicio de calidad',
      description: 'Cooperativas con las mejores calificaciones y servicio al cliente.'
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuestro Servicio</Text>
      
      {SERVICE_INFO.map((item, index) => (
        <View key={index} style={styles.infoItem}>
          <View style={styles.iconContainer}>
            <Ionicons name={item.icon as any} size={24} color={Colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
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
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});