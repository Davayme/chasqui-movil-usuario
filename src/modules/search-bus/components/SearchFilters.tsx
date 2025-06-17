import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Colors } from '../../../common/constants/colors';

interface SearchFiltersProps {
  onApplyFilters: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  cooperative: string;
  seatType: string;
  busModel: string;
  tripType: 'all' | 'direct' | 'stops';
  sortBy: 'price' | 'time' | 'duration';
}

// Datos estáticos para las opciones de filtro
const COOPERATIVES = ['Todas', 'Flota Imbabura', 'Transportes Ecuador', 'Cooperativa Quito', 'Patria'];
const SEAT_TYPES = ['Todos', 'Semicama', 'Cama', 'VIP', 'Ejecutivo', 'Normal'];
const BUS_MODELS = ['Todos', 'Mercedes Benz', 'Scania', 'Hino', 'Volvo', 'Marcopolo'];

export default function SearchFilters({ onApplyFilters }: SearchFiltersProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    cooperative: 'Todas',
    seatType: 'Todos',
    busModel: 'Todos',
    tripType: 'all',
    sortBy: 'time',
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setIsModalVisible(false);
  };

  const handleCooperativeChange = (cooperative: string) => {
    setFilters({ ...filters, cooperative });
  };

  const handleSeatTypeChange = (seatType: string) => {
    setFilters({ ...filters, seatType });
  };

  const handleBusModelChange = (busModel: string) => {
    setFilters({ ...filters, busModel });
  };

  const handleTripTypeChange = (tripType: FilterOptions['tripType']) => {
    setFilters({ ...filters, tripType });
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="options-outline" size={20} color={Colors.primary} />
        <Text style={styles.filterText}>Filtrar</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar resultados</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Cooperativa */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Cooperativa</Text>
                <View style={styles.optionsContainer}>
                  {COOPERATIVES.map((cooperative) => (
                    <TouchableOpacity 
                      key={cooperative}
                      style={[
                        styles.optionButton,
                        filters.cooperative === cooperative && styles.optionButtonActive
                      ]}
                      onPress={() => handleCooperativeChange(cooperative)}
                    >
                      <Text 
                        style={[
                          styles.optionText,
                          filters.cooperative === cooperative && styles.optionTextActive
                        ]}
                      >
                        {cooperative}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Tipo de asiento */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Tipo de asiento</Text>
                <View style={styles.optionsContainer}>
                  {SEAT_TYPES.map((seatType) => (
                    <TouchableOpacity 
                      key={seatType}
                      style={[
                        styles.optionButton,
                        filters.seatType === seatType && styles.optionButtonActive
                      ]}
                      onPress={() => handleSeatTypeChange(seatType)}
                    >
                      <Text 
                        style={[
                          styles.optionText,
                          filters.seatType === seatType && styles.optionTextActive
                        ]}
                      >
                        {seatType}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Marca del chasis/carrocería */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Marca del chasis/carrocería</Text>
                <View style={styles.optionsContainer}>
                  {BUS_MODELS.map((busModel) => (
                    <TouchableOpacity 
                      key={busModel}
                      style={[
                        styles.optionButton,
                        filters.busModel === busModel && styles.optionButtonActive
                      ]}
                      onPress={() => handleBusModelChange(busModel)}
                    >
                      <Text 
                        style={[
                          styles.optionText,
                          filters.busModel === busModel && styles.optionTextActive
                        ]}
                      >
                        {busModel}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Tipo de viaje */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Tipo de viaje</Text>
                <View style={styles.optionsContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.optionButton,
                      filters.tripType === 'all' && styles.optionButtonActive
                    ]}
                    onPress={() => handleTripTypeChange('all')}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        filters.tripType === 'all' && styles.optionTextActive
                      ]}
                    >
                      Todos
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.optionButton,
                      filters.tripType === 'direct' && styles.optionButtonActive
                    ]}
                    onPress={() => handleTripTypeChange('direct')}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        filters.tripType === 'direct' && styles.optionTextActive
                      ]}
                    >
                      Directo
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.optionButton,
                      filters.tripType === 'stops' && styles.optionButtonActive
                    ]}
                    onPress={() => handleTripTypeChange('stops')}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        filters.tripType === 'stops' && styles.optionTextActive
                      ]}
                    >
                      Con paradas
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Ordenar por (lo mantuve porque también es útil) */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Ordenar por</Text>
                <View style={styles.optionsContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.optionButton,
                      filters.sortBy === 'price' && styles.optionButtonActive
                    ]}
                    onPress={() => setFilters({...filters, sortBy: 'price'})}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        filters.sortBy === 'price' && styles.optionTextActive
                      ]}
                    >
                      Precio
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.optionButton,
                      filters.sortBy === 'time' && styles.optionButtonActive
                    ]}
                    onPress={() => setFilters({...filters, sortBy: 'time'})}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        filters.sortBy === 'time' && styles.optionTextActive
                      ]}
                    >
                      Hora
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.optionButton,
                      filters.sortBy === 'duration' && styles.optionButtonActive
                    ]}
                    onPress={() => setFilters({...filters, sortBy: 'duration'})}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        filters.sortBy === 'duration' && styles.optionTextActive
                      ]}
                    >
                      Duración
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={styles.applyButton}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>Aplicar filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 4,
  },
  filterText: {
    marginLeft: 6,
    color: Colors.primary,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  filterSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray400,
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    color: Colors.textSecondary,
  },
  optionTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});