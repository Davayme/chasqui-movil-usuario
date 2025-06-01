import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../common/constants/colors';

type FormSearchBusProps = {
  onSearch: (origin: string, destination: string, date: string) => void;
};

export default function FormSearchBus({ onSearch }: FormSearchBusProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = () => {
    if (origin && destination && date) {
      onSearch(origin, destination, date);
    }
  };

  return (
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
          placeholder="Fecha de viaje (DD/MM/YYYY)"
          value={date}
          onChangeText={setDate}
          placeholderTextColor={Colors.textSecondary}
        />
      </View>
      
      <TouchableOpacity 
        style={[
          styles.searchButton,
          (!origin || !destination || !date) ? styles.searchButtonDisabled : null
        ]} 
        onPress={handleSearch}
        disabled={!origin || !destination || !date}
      >
        <Text style={styles.searchButtonText}>Buscar Viajes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  searchButtonDisabled: {
    backgroundColor: Colors.gray400,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});