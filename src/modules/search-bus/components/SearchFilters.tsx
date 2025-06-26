import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../common/constants/colors';

interface SearchFiltersProps {
  onApplyFilters: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  cooperative: string;
  busType: string;
  chassisBrand: string;
  tripType: 'all' | 'direct' | 'stops';
  timeRange: 'all' | 'morning' | 'afternoon' | 'evening';
  sortBy: 'price' | 'time' | 'duration';
}

// Datos estáticos para las opciones de filtro
const COOPERATIVES = ['Todas', 'Transportes Express', 'Flota Imbabura', 'Cooperativa Quito'];
const BUS_TYPES = ['Todos', 'Ejecutivo', 'Premium', 'VIP', 'Normal'];
const CHASSIS_BRANDS = ['Todos', 'Mercedes-Benz', 'Scania', 'Hino', 'Volvo'];

export default function SearchFilters({ onApplyFilters }: SearchFiltersProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    cooperative: 'Todas',
    busType: 'Todos',
    chassisBrand: 'Todos',
    tripType: 'all',
    timeRange: 'all',
    sortBy: 'time',
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setIsModalVisible(false);
  };

  const handleCooperativeChange = (cooperative: string) => {
    setFilters({ ...filters, cooperative });
  };

  const handleBusTypeChange = (busType: string) => {
    setFilters({ ...filters, busType });
  };

  const handleChassisBrandChange = (chassisBrand: string) => {
    setFilters({ ...filters, chassisBrand });
  };

  const handleTimeRangeChange = (timeRange: FilterOptions['timeRange']) => {
    setFilters({ ...filters, timeRange });
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

              {/* Tipo de bus */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Tipo de bus</Text>
                <View style={styles.optionsContainer}>
                  {BUS_TYPES.map((busType) => (
                    <TouchableOpacity 
                      key={busType}
                      style={[
                        styles.optionButton,
                        filters.busType === busType && styles.optionButtonActive
                      ]}
                      onPress={() => handleBusTypeChange(busType)}
                    >
                      <Text 
                        style={[
                          styles.optionText,
                          filters.busType === busType && styles.optionTextActive
                        ]}
                      >
                        {busType}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Marca del chasis */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Marca del chasis</Text>
                <View style={styles.optionsContainer}>
                  {CHASSIS_BRANDS.map((chassisBrand) => (
                    <TouchableOpacity 
                      key={chassisBrand}
                      style={[
                        styles.optionButton,
                        filters.chassisBrand === chassisBrand && styles.optionButtonActive
                      ]}
                      onPress={() => handleChassisBrandChange(chassisBrand)}
                    >
                      <Text 
                        style={[
                          styles.optionText,
                          filters.chassisBrand === chassisBrand && styles.optionTextActive
                        ]}
                      >
                        {chassisBrand}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Horario de salida */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Horario de salida</Text>
                <View style={styles.optionsContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.optionButton,
                      filters.timeRange === 'all' && styles.optionButtonActive
                    ]}
                    onPress={() => handleTimeRangeChange('all')}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        filters.timeRange === 'all' && styles.optionTextActive
                      ]}
                    >
                      Todos
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.optionButton,
                      filters.timeRange === 'morning' && styles.optionButtonActive
                    ]}
                    onPress={() => handleTimeRangeChange('morning')}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        filters.timeRange === 'morning' && styles.optionTextActive
                      ]}
                    >
                      Mañana (5:00 - 12:00)
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.optionButton,
                      filters.timeRange === 'afternoon' && styles.optionButtonActive
                    ]}
                    onPress={() => handleTimeRangeChange('afternoon')}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        filters.timeRange === 'afternoon' && styles.optionTextActive
                      ]}
                    >
                      Tarde (12:00 - 18:00)
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.optionButton,
                      filters.timeRange === 'evening' && styles.optionButtonActive
                    ]}
                    onPress={() => handleTimeRangeChange('evening')}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        filters.timeRange === 'evening' && styles.optionTextActive
                      ]}
                    >
                      Noche (18:00 - 5:00)
                    </Text>
                  </TouchableOpacity>
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