import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Colors } from '../../../common/constants/colors';
import { City } from '../services/searchService';
import CityAutocomplete from './cityAutoComplete';

type FormSearchBusProps = {
  onSearch: (origin: string, destination: string, date: string) => void;
};

export default function FormSearchBus({ onSearch }: FormSearchBusProps) {
  // Estado para almacenar las ciudades seleccionadas (objetos completos)
  const [originCity, setOriginCity] = useState<City | null>(null);
  const [destinationCity, setDestinationCity] = useState<City | null>(null);
  
  // Estado para fecha
  const [selectedDate, setSelectedDate] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [calendarVisible, setCalendarVisible] = useState(false);

  // Función para formatear la fecha para mostrar
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Manejador para seleccionar fecha
  const handleDateSelect = (date: any) => {
    setSelectedDate(date.dateString);
    setFormattedDate(formatDisplayDate(date.dateString));
    setCalendarVisible(false);
  };

  const handleSearch = () => {
    if (originCity && destinationCity && selectedDate) {
      onSearch(originCity.name, destinationCity.name, selectedDate);
    }
  };

  return (
    <View style={styles.searchCard}>
      <Text style={styles.searchTitle}>Buscar Viaje</Text>
      
      <View style={styles.cityInputsContainer}>
        <View style={styles.originInputContainer}>
          <CityAutocomplete
            placeholder="Ciudad de origen"
            value={originCity?.name || ''}
            onSelectCity={(city) => {
              if (city.id) {
                setOriginCity(city);
              } else {
                setOriginCity(null);
              }
            }}
            icon="location-outline"
          />
        </View>
        
        <View style={styles.destinationInputContainer}>
          <CityAutocomplete
            placeholder="Ciudad de destino"
            value={destinationCity?.name || ''}
            onSelectCity={(city) => {
              if (city.id) {
                setDestinationCity(city);
              } else {
                setDestinationCity(null);
              }
            }}
            icon="navigate-outline"
          />
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.inputContainer}
        onPress={() => setCalendarVisible(true)}
      >
        <Ionicons name="calendar-outline" size={22} color={Colors.primary} style={styles.inputIcon} />
        <Text 
          style={[
            styles.dateText, 
            !formattedDate && styles.placeholderText
          ]}
        >
          {formattedDate || 'Fecha de viaje'}
        </Text>
        <Ionicons name="chevron-down" size={18} color={Colors.gray400} />
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={calendarVisible}
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Selecciona la fecha</Text>
              <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <Calendar
              current={selectedDate || new Date().toISOString().split('T')[0]}
              minDate={new Date().toISOString().split('T')[0]}
              maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              onDayPress={handleDateSelect}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: Colors.primary }
              }}
              theme={{
                todayTextColor: Colors.primary,
                selectedDayBackgroundColor: Colors.primary,
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 14
              }}
            />
          </View>
        </View>
      </Modal>
      
      <TouchableOpacity 
        style={[
          styles.searchButton,
          (!originCity || !destinationCity || !selectedDate) ? styles.searchButtonDisabled : null
        ]} 
        onPress={handleSearch}
        disabled={!originCity || !destinationCity || !selectedDate}
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
    position: 'relative',
    zIndex: 1,
  },
  cityInputsContainer: {
    position: 'relative',
    zIndex: 5, // Mayor que el contenedor principal
  },
  originInputContainer: {
   // Espacio razonable entre inputs
    position: 'relative',
    zIndex: 10, // Mayor que destinationInputContainer
  },
  destinationInputContainer: {
    position: 'relative',
    zIndex: 5, // Menor que originInputContainer
    marginTop: 20, // Espacio adicional para evitar superposición
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
    marginTop: 20, // Añadir espacio después de los campos de ciudad
    height: 48,
    backgroundColor: '#fff',
    zIndex: 1, // Menor que los autocomplete
  },
  inputIcon: {
    marginRight: 10,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  placeholderText: {
    color: Colors.textSecondary,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    zIndex: 1, // No necesita un z-index alto
  },
  searchButtonDisabled: {
    backgroundColor: Colors.gray400,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
});